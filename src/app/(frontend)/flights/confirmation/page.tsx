import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/current-user'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Flight booking | Masidy',
  description: 'View your Masidy flight booking status.',
}

export const dynamic = 'force-dynamic'

type FlightConfirmationProps = {
  searchParams: Promise<{ session_id?: string }>
}

export default async function FlightConfirmationPage({ searchParams }: FlightConfirmationProps) {
  const { session_id: sessionID } = await searchParams
  if (!sessionID || !/^cs_[A-Za-z0-9_]+$/.test(sessionID)) notFound()

  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'flight-bookings',
    user,
    overrideAccess: false,
    where: {
      and: [{ stripeCheckoutSessionId: { equals: sessionID } }, { traveler: { equals: user.id } }],
    },
    limit: 1,
    depth: 0,
  })
  const booking = result.docs[0]
  if (!booking) notFound()

  const confirmed = booking.status === 'confirmed'
  const refunded = booking.status === 'refunded'
  const cancelled = booking.status === 'cancelled'

  return (
    <main className="min-h-screen bg-[#f7f8f6] px-5 py-10 text-[#0b2239]">
      <div className="mx-auto max-w-2xl">
        <Link href="/" aria-label="Masidy home" className="inline-flex">
          <Image
            src="/masidy-logo.png"
            alt="Masidy"
            width={959}
            height={313}
            className="h-9 w-auto"
            priority
          />
        </Link>
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(12,38,60,.07)] sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#087cb4]">
            Masidy flights
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            {confirmed
              ? 'Your flight is confirmed'
              : refunded
                ? 'Your payment was refunded'
                : cancelled
                  ? 'Checkout expired'
                  : 'Confirming your flight'}
          </h1>
          <p className="mt-4 leading-7 text-slate-600">
            {confirmed
              ? 'Your airline booking has been confirmed. Keep the references below with your travel documents.'
              : refunded
                ? 'The airline could not confirm this flight, so your Stripe payment was refunded.'
                : cancelled
                  ? 'The payment session expired before the flight was booked. Search again to choose a current fare.'
                  : 'Your payment has been received. Masidy is completing the airline booking; this page will show the confirmation once it is ready.'}
          </p>

          <dl className="mt-7 grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Masidy reference
              </dt>
              <dd className="mt-1 font-bold">{booking.reference}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Booking status
              </dt>
              <dd className="mt-1 font-bold capitalize">{booking.status.replaceAll('_', ' ')}</dd>
            </div>
            {confirmed && booking.bookingReference && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Airline reference
                </dt>
                <dd className="mt-1 text-lg font-bold tracking-wider">
                  {booking.bookingReference}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/flights"
              className="rounded-xl bg-[#0c2f4d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#123d61]"
            >
              Search another flight
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Go to dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
