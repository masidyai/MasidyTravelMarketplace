import 'server-only'

import type Stripe from 'stripe'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { duffelRequest } from '@/lib/duffel'
import { getPayloadClient } from '@/lib/payload'
import { toMinorUnits } from '@/lib/flight-validation'
import { sendTransactionalEmail } from '@/lib/email'

type DuffelOrder = {
  id: string
  type: 'hold' | 'instant' | null
  total_amount: string
  total_currency: string
  booking_reference?: string | null
  payment_status?: {
    awaiting_payment?: boolean
    payment_required_by?: string | null
  }
}

type DuffelPayment = {
  id: string
  status: 'succeeded' | 'failed' | 'pending' | 'cancelled'
  failure_reason?: string | null
}

async function getOrderPayments(orderID: string) {
  return duffelRequest<DuffelPayment[]>(
    `/air/payments?order_id=${encodeURIComponent(orderID)}&limit=10`,
  )
}

async function claimDuffelPaymentAttempt(bookingID: string | number) {
  const { env } = await getCloudflareContext({ async: true })
  const result = await env.D1.prepare(
    'UPDATE flight_bookings SET duffel_payment_attempted_at = ? WHERE id = ? AND duffel_payment_attempted_at IS NULL',
  )
    .bind(new Date().toISOString(), bookingID)
    .run()

  return result.meta.changes === 1
}

function getPaymentIntentID(session: Stripe.Checkout.Session) {
  return typeof session.payment_intent === 'string'
    ? session.payment_intent
    : session.payment_intent?.id
}

async function refundFlightPayment(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
  bookingID: string | number,
) {
  const paymentIntentID = getPaymentIntentID(session)
  if (!paymentIntentID) throw new Error('Stripe payment intent is missing.')
  await stripe.refunds.create(
    { payment_intent: paymentIntentID },
    { idempotencyKey: `flight-refund:${bookingID}` },
  )
}

export async function fulfillFlightBooking(session: Stripe.Checkout.Session, stripe: Stripe) {
  const bookingID = session.metadata?.flightBookingId
  if (!bookingID) return

  const payload = await getPayloadClient()
  const booking = await payload.findByID({
    collection: 'flight-bookings',
    id: bookingID,
    overrideAccess: true,
  })

  if (booking.stripeCheckoutSessionId !== session.id) {
    throw new Error('Flight checkout session does not match the booking.')
  }
  if (booking.status === 'confirmed' || booking.status === 'refunded') return
  if (session.payment_status !== 'paid') return

  const expectedAmount = toMinorUnits(booking.totalAmount, booking.currency)
  const paymentIntentID = getPaymentIntentID(session)
  if (
    !paymentIntentID ||
    expectedAmount === null ||
    session.amount_total !== expectedAmount ||
    session.currency?.toUpperCase() !== booking.currency
  ) {
    await refundFlightPayment(stripe, session, booking.id)
    await payload.update({
      collection: 'flight-bookings',
      id: booking.id,
      overrideAccess: true,
      data: {
        status: 'refunded',
        stripePaymentIntentId: paymentIntentID,
        failureReason: 'The payment did not match the held flight price.',
      },
    })
    return
  }

  if (!booking.duffelOrderId) {
    await refundFlightPayment(stripe, session, booking.id)
    await payload.update({
      collection: 'flight-bookings',
      id: booking.id,
      overrideAccess: true,
      data: {
        status: 'refunded',
        stripePaymentIntentId: paymentIntentID,
        failureReason: 'The airline booking hold could not be found.',
      },
    })
    return
  }

  await payload.update({
    collection: 'flight-bookings',
    id: booking.id,
    overrideAccess: true,
    data: { status: 'processing', stripePaymentIntentId: paymentIntentID },
  })

  const order = await duffelRequest<DuffelOrder>(
    `/air/orders/${encodeURIComponent(booking.duffelOrderId)}`,
  )
  const orderAmount = toMinorUnits(order.total_amount, order.total_currency)
  if (
    order.type !== 'hold' ||
    orderAmount !== expectedAmount ||
    order.total_currency !== booking.currency ||
    (order.payment_status?.payment_required_by &&
      Date.parse(order.payment_status.payment_required_by) <= Date.now())
  ) {
    await refundFlightPayment(stripe, session, booking.id)
    await payload.update({
      collection: 'flight-bookings',
      id: booking.id,
      overrideAccess: true,
      data: {
        status: 'refunded',
        failureReason: 'The airline could not honor the held flight price.',
      },
    })
    return
  }

  let payments = await getOrderPayments(order.id)
  let payment = payments.find((item) => item.status === 'succeeded' || item.status === 'pending')

  if (
    !payment &&
    payments.some((item) => item.status === 'failed' || item.status === 'cancelled')
  ) {
    await refundFlightPayment(stripe, session, booking.id)
    await payload.update({
      collection: 'flight-bookings',
      id: booking.id,
      overrideAccess: true,
      data: {
        status: 'refunded',
        failureReason: 'Duffel could not collect the airline payment.',
      },
    })
    return
  }

  if (!payment) {
    if (booking.duffelPaymentAttemptedAt) {
      console.error(
        '[flight-booking] Duffel payment outcome is uncertain; refusing to submit a duplicate payment',
      )
      throw new Error('Duffel payment requires manual reconciliation.')
    }

    if (!(await claimDuffelPaymentAttempt(booking.id))) {
      console.error('[flight-booking] Another webhook claimed the Duffel payment attempt')
      throw new Error('Duffel payment requires manual reconciliation.')
    }

    try {
      payment = await duffelRequest<DuffelPayment>('/air/payments', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            order_id: order.id,
            payment: {
              type: 'balance',
              amount: order.total_amount,
              currency: order.total_currency,
            },
          },
        }),
      })
    } catch (error) {
      try {
        payments = await getOrderPayments(order.id)
      } catch {
        throw error
      }
      payment = payments.find((item) => item.status === 'succeeded' || item.status === 'pending')
      if (!payment) throw error
    }
  }

  if (payment.status === 'pending') {
    await payload.update({
      collection: 'flight-bookings',
      id: booking.id,
      overrideAccess: true,
      data: { duffelPaymentId: payment.id, status: 'processing' },
    })
    throw new Error('Duffel balance payment is still processing.')
  }

  if (payment.status !== 'succeeded') {
    await refundFlightPayment(stripe, session, booking.id)
    await payload.update({
      collection: 'flight-bookings',
      id: booking.id,
      overrideAccess: true,
      data: {
        duffelPaymentId: payment.id,
        status: 'refunded',
        failureReason: 'Duffel could not collect the airline payment.',
      },
    })
    return
  }

  const confirmedAt = new Date().toISOString()
  const airlineReference =
    order.booking_reference && /^[A-Za-z0-9-]{1,32}$/.test(order.booking_reference)
      ? order.booking_reference
      : undefined
  await payload.update({
    collection: 'flight-bookings',
    id: booking.id,
    overrideAccess: true,
    data: {
      duffelPaymentId: payment.id,
      bookingReference: airlineReference,
      status: 'confirmed',
      confirmedAt,
      failureReason: undefined,
    },
  })

  const email = session.customer_details?.email || session.customer_email
  if (email) {
    try {
      const delivery = await sendTransactionalEmail({
        to: email,
        subject: 'Your Masidy flight booking is confirmed',
        html: `<h1>Flight booking confirmed</h1><p>Your Masidy booking reference is ${booking.reference}.</p><p>${airlineReference ? `Your airline booking reference is ${airlineReference}.` : 'Your airline booking reference is available in your Masidy confirmation page.'}</p><p>Keep this information with your travel documents.</p>`,
      })
      if (!delivery.configured) {
        console.warn('[flight-booking] Confirmation email is not configured')
      }
    } catch {
      console.error('[flight-booking] Confirmation email could not be sent')
    }
  }
}

export async function expireFlightBooking(session: Stripe.Checkout.Session) {
  const bookingID = session.metadata?.flightBookingId
  if (!bookingID) return

  const payload = await getPayloadClient()
  const booking = await payload.findByID({
    collection: 'flight-bookings',
    id: bookingID,
    overrideAccess: true,
  })
  if (
    booking.stripeCheckoutSessionId !== session.id ||
    booking.status === 'confirmed' ||
    booking.status === 'refunded'
  ) {
    return
  }

  await payload.update({
    collection: 'flight-bookings',
    id: booking.id,
    overrideAccess: true,
    data: {
      passengers: [],
      status: 'cancelled',
      failureReason: 'The payment session expired before the flight was booked.',
    },
  })
}
