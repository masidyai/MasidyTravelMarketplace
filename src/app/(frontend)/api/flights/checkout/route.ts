import { randomUUID } from 'node:crypto'
import { getCurrentUser } from '@/lib/current-user'
import { duffelRequest, DuffelApiError, DuffelConfigurationError } from '@/lib/duffel'
import { getPayloadClient } from '@/lib/payload'
import { enforceRateLimit } from '@/lib/rate-limit'
import { getStripeClient } from '@/lib/stripe'
import { parseFlightPassengers, toMinorUnits, type FlightPassenger } from '@/lib/flight-validation'

type DuffelAirport = {
  iata_code: string
  city_name?: string
  name: string
}

type DuffelSegment = {
  departing_at: string
  arriving_at: string
  origin: DuffelAirport
  destination: DuffelAirport
  marketing_carrier?: { name?: string; iata_code?: string }
  marketing_carrier_flight_number?: string
}

type DuffelSlice = {
  origin: DuffelAirport
  destination: DuffelAirport
  segments: DuffelSegment[]
}

type DuffelOffer = {
  id: string
  total_amount: string
  total_currency: string
  owner?: { name?: string }
  slices: DuffelSlice[]
  payment_requirements?: { requires_instant_payment?: boolean }
  passenger_identity_documents_required?: boolean
  expires_at?: string
}

type DuffelOfferRequest = {
  id: string
  passengers: Array<{ id: string; type?: string }>
  offers: Array<{ id: string }>
}

type DuffelOrder = {
  id: string
  type: 'hold' | 'instant' | null
  total_amount: string
  total_currency: string
  payment_status?: {
    awaiting_payment?: boolean
    payment_required_by?: string | null
  }
}

type DuffelOrderPassenger = FlightPassenger & {
  id: string
  type: 'adult'
}

class FlightCheckoutError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'FlightCheckoutError'
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

function getItinerary(offer: DuffelOffer) {
  return {
    airline: offer.owner?.name || 'Airline',
    slices: offer.slices.map((slice) => ({
      origin: slice.origin.iata_code,
      destination: slice.destination.iata_code,
      segments: slice.segments.map((segment) => ({
        airline: segment.marketing_carrier?.name || offer.owner?.name || 'Airline',
        flightNumber: segment.marketing_carrier_flight_number || '',
        departingAt: segment.departing_at,
        arrivingAt: segment.arriving_at,
        origin: segment.origin.iata_code,
        destination: segment.destination.iata_code,
      })),
    })),
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return Response.json({ error: 'Sign in to book a flight.' }, { status: 401 })
  }

  try {
    await enforceRateLimit(String(user.id), 'flight-checkout', 5, 15 * 60 * 1000)
  } catch (error) {
    if (error instanceof Error && error.message === 'RATE_LIMITED') {
      return Response.json(
        { error: 'Too many checkout attempts. Please try again later.' },
        { status: 429 },
      )
    }
    console.error('[flight-checkout] Rate limit check failed')
    return Response.json({ error: 'Flight checkout is temporarily unavailable.' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Enter valid passenger details.' }, { status: 400 })
  }

  if (!isRecord(body)) {
    return Response.json({ error: 'Enter valid passenger details.' }, { status: 400 })
  }

  const offerRequestId = typeof body.offerRequestId === 'string' ? body.offerRequestId.trim() : ''
  const offerId = typeof body.offerId === 'string' ? body.offerId.trim() : ''
  const passengers = parseFlightPassengers(body.passengers)
  if (
    !/^orq_[A-Za-z0-9]+$/.test(offerRequestId) ||
    !/^off_[A-Za-z0-9]+$/.test(offerId) ||
    !passengers
  ) {
    return Response.json(
      { error: 'Check the selected flight and passenger details.' },
      { status: 400 },
    )
  }

  const stripe = getStripeClient()
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL || process.env.AUTH_URL
  if (!stripe || !siteURL) {
    return Response.json(
      { error: 'Secure flight checkout is not configured yet.' },
      { status: 503 },
    )
  }

  let checkoutOrigin: string
  try {
    const url = new URL(siteURL)
    if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
      throw new Error('Invalid site origin')
    }
    checkoutOrigin = url.origin
  } catch {
    return Response.json(
      { error: 'Secure flight checkout is not configured correctly.' },
      { status: 503 },
    )
  }

  const payload = await getPayloadClient()
  let booking: { id: string | number; reference: string } | undefined
  let checkoutSession: Awaited<ReturnType<typeof stripe.checkout.sessions.create>> | undefined

  try {
    const offerRequest = await duffelRequest<DuffelOfferRequest>(
      `/air/offer_requests/${encodeURIComponent(offerRequestId)}`,
    )
    const selectedOfferExists = offerRequest.offers.some((offer) => offer.id === offerId)
    if (
      offerRequest.id !== offerRequestId ||
      !selectedOfferExists ||
      offerRequest.passengers.length !== passengers.length ||
      offerRequest.passengers.some(
        (passenger) => typeof passenger.id !== 'string' || passenger.type === 'child',
      )
    ) {
      throw new FlightCheckoutError('That flight search is no longer available. Search again.', 409)
    }

    const offer = await duffelRequest<DuffelOffer>(`/air/offers/${encodeURIComponent(offerId)}`)
    if (
      offer.id !== offerId ||
      offer.payment_requirements?.requires_instant_payment === true ||
      offer.passenger_identity_documents_required === true ||
      (offer.expires_at && Date.parse(offer.expires_at) <= Date.now())
    ) {
      throw new FlightCheckoutError(
        'That flight can no longer be booked through secure checkout. Search again.',
        409,
      )
    }

    const offerAmount = toMinorUnits(offer.total_amount, offer.total_currency)
    if (offerAmount === null) {
      throw new FlightCheckoutError('This flight has an unsupported price. Search again.', 409)
    }

    const reference = `MSF-${randomUUID().slice(0, 10).toUpperCase()}`
    booking = await payload.create({
      collection: 'flight-bookings',
      user,
      overrideAccess: false,
      draft: false,
      context: { flightCheckout: true },
      data: {
        reference,
        traveler: user.id,
        offerRequestId,
        offerId,
        passengers,
        itinerary: getItinerary(offer),
        totalAmount: offer.total_amount,
        currency: offer.total_currency,
        status: 'creating',
      },
    })

    const duffelPassengers: DuffelOrderPassenger[] = offerRequest.passengers.map(
      (offerPassenger, index) => ({
        ...passengers[index],
        id: offerPassenger.id,
        type: 'adult',
      }),
    )

    const order = await duffelRequest<DuffelOrder>('/air/orders', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'hold',
          selected_offers: [offerId],
          passengers: duffelPassengers,
          metadata: { masidy_reference: reference },
        },
      }),
    })

    const orderAmount = toMinorUnits(order.total_amount, order.total_currency)
    if (
      !order.id.startsWith('ord_') ||
      order.type !== 'hold' ||
      order.payment_status?.awaiting_payment !== true ||
      orderAmount === null ||
      orderAmount !== offerAmount ||
      order.total_currency !== offer.total_currency
    ) {
      throw new FlightCheckoutError(
        'The flight price or availability changed. Search again before paying.',
        409,
      )
    }

    const paymentRequiredBy = order.payment_status?.payment_required_by
    const deadline = paymentRequiredBy ? Date.parse(paymentRequiredBy) : Number.NaN
    const now = Math.floor(Date.now() / 1000)
    const expiresAt = Math.min(Math.floor(deadline / 1000), now + 23 * 60 * 60)
    if (!Number.isFinite(deadline) || expiresAt < now + 30 * 60) {
      throw new FlightCheckoutError(
        'The airline hold expires too soon for secure checkout. Search again.',
        409,
      )
    }

    await payload.update({
      collection: 'flight-bookings',
      id: booking.id,
      overrideAccess: true,
      data: {
        duffelOrderId: order.id,
        paymentRequiredBy,
        totalAmount: order.total_amount,
        currency: order.total_currency,
        status: 'awaiting_payment',
      },
    })

    const route = offer.slices
      .map((slice) => `${slice.origin.iata_code}-${slice.destination.iata_code}`)
      .join(' · ')
    checkoutSession = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        allowed_payment_method_types: ['card'],
        customer_email: user.email,
        expires_at: expiresAt,
        success_url: `${checkoutOrigin}/flights/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${checkoutOrigin}/flights?checkout=cancelled`,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: order.total_currency.toLowerCase(),
              unit_amount: orderAmount,
              product_data: {
                name: `Masidy flight: ${route}`,
                description: `${passengers.length} adult passenger${passengers.length === 1 ? '' : 's'} · operated by ${offer.owner?.name || 'airline'}`,
              },
            },
          },
        ],
        metadata: {
          flightBookingId: String(booking.id),
          flightBookingReference: booking.reference,
          duffelOrderId: order.id,
        },
      },
      { idempotencyKey: `flight-checkout:${booking.id}` },
    )

    if (!checkoutSession.url) {
      throw new FlightCheckoutError('Stripe did not return a checkout link.', 502)
    }

    await payload.update({
      collection: 'flight-bookings',
      id: booking.id,
      overrideAccess: true,
      data: { stripeCheckoutSessionId: checkoutSession.id },
    })

    return Response.json(
      { url: checkoutSession.url },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
  } catch (error) {
    if (checkoutSession) {
      try {
        await stripe.checkout.sessions.expire(checkoutSession.id)
      } catch {
        console.error('[flight-checkout] Could not expire an incomplete Stripe session')
      }
    }

    if (booking) {
      try {
        await payload.update({
          collection: 'flight-bookings',
          id: booking.id,
          overrideAccess: true,
          data: {
            status: 'failed',
            passengers: [],
            failureReason: 'Checkout could not be completed. Search again to retry.',
          },
        })
      } catch {
        console.error('[flight-checkout] Could not mark an incomplete booking')
      }
    }

    if (error instanceof FlightCheckoutError) {
      return Response.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof DuffelConfigurationError) {
      return Response.json({ error: 'Live flight booking is not configured yet.' }, { status: 503 })
    }
    if (error instanceof DuffelApiError) {
      console.error('[flight-checkout] Duffel request failed', {
        status: error.status,
        code: error.code,
      })
      return Response.json(
        {
          error:
            error.status >= 500
              ? 'Duffel could not hold that flight. Search again and retry.'
              : 'That flight is no longer available at the displayed price. Search again.',
        },
        { status: error.status >= 500 ? 502 : 409 },
      )
    }
    console.error('[flight-checkout] Unexpected checkout failure')
    return Response.json(
      { error: 'Flight checkout could not be started. Please search and try again.' },
      { status: 502 },
    )
  }
}
