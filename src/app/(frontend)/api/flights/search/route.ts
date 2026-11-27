import { enforceRateLimit } from '@/lib/rate-limit'
import { DuffelApiError, DuffelConfigurationError, duffelRequest } from '@/lib/duffel'
import { toMinorUnits } from '@/lib/flight-validation'

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
  expires_at?: string
}

type DuffelOfferRequest = {
  id: string
  offers: DuffelOffer[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isTravelDate = (value: unknown): value is string => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function isValidAirport(airport: DuffelAirport | undefined): airport is DuffelAirport {
  return Boolean(
    airport &&
    /^[A-Z]{3}$/.test(airport.iata_code) &&
    typeof airport.name === 'string' &&
    (airport.city_name === undefined || typeof airport.city_name === 'string'),
  )
}

function summarizeOffer(offer: DuffelOffer) {
  if (
    !offer.id.startsWith('off_') ||
    !toMinorUnits(offer.total_amount, offer.total_currency) ||
    !Array.isArray(offer.slices) ||
    offer.slices.length === 0
  ) {
    return null
  }

  const slices = offer.slices.map((slice) => {
    if (
      !isValidAirport(slice.origin) ||
      !isValidAirport(slice.destination) ||
      !Array.isArray(slice.segments) ||
      slice.segments.length === 0
    ) {
      return null
    }

    const segments = slice.segments.map((segment) => {
      if (
        !isValidAirport(segment.origin) ||
        !isValidAirport(segment.destination) ||
        !Number.isFinite(Date.parse(segment.departing_at)) ||
        !Number.isFinite(Date.parse(segment.arriving_at))
      ) {
        return null
      }

      return {
        departingAt: segment.departing_at,
        arrivingAt: segment.arriving_at,
        origin: {
          code: segment.origin.iata_code,
          city: segment.origin.city_name || segment.origin.name,
        },
        destination: {
          code: segment.destination.iata_code,
          city: segment.destination.city_name || segment.destination.name,
        },
        airline: segment.marketing_carrier?.name || offer.owner?.name || 'Airline',
        flightNumber: segment.marketing_carrier_flight_number || '',
      }
    })

    if (segments.some((segment) => segment === null)) return null
    return {
      origin: slice.origin.iata_code,
      destination: slice.destination.iata_code,
      segments,
    }
  })

  if (slices.some((slice) => slice === null)) return null

  return {
    id: offer.id,
    totalAmount: offer.total_amount,
    currency: offer.total_currency,
    airline: offer.owner?.name || 'Airline',
    slices,
    expiresAt: offer.expires_at || null,
  }
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Enter valid flight search details.' }, { status: 400 })
  }

  if (!isRecord(body)) {
    return Response.json({ error: 'Enter valid flight search details.' }, { status: 400 })
  }

  const origin = typeof body.origin === 'string' ? body.origin.trim().toUpperCase() : ''
  const destination =
    typeof body.destination === 'string' ? body.destination.trim().toUpperCase() : ''
  const departureDate = body.departureDate
  const returnDate = body.returnDate
  const passengerCount = typeof body.passengers === 'number' ? body.passengers : NaN
  const cabinClass = typeof body.cabinClass === 'string' ? body.cabinClass : ''

  if (
    !/^[A-Z]{3}$/.test(origin) ||
    !/^[A-Z]{3}$/.test(destination) ||
    origin === destination ||
    !isTravelDate(departureDate) ||
    !Number.isInteger(passengerCount) ||
    passengerCount < 1 ||
    passengerCount > 9 ||
    !['economy', 'premium_economy', 'business', 'first'].includes(cabinClass) ||
    (returnDate !== undefined &&
      returnDate !== '' &&
      (!isTravelDate(returnDate) ||
        new Date(`${returnDate}T00:00:00.000Z`) <= new Date(`${departureDate}T00:00:00.000Z`)))
  ) {
    return Response.json(
      { error: 'Check the airports, dates, cabin, and passenger count.' },
      { status: 400 },
    )
  }

  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  if (new Date(`${departureDate}T00:00:00.000Z`) < today) {
    return Response.json({ error: 'Departure must be today or later.' }, { status: 400 })
  }

  const clientIP = request.headers.get('cf-connecting-ip') || 'local'
  try {
    await enforceRateLimit(clientIP, 'flight-search', 30, 15 * 60 * 1000)
  } catch (error) {
    if (error instanceof Error && error.message === 'RATE_LIMITED') {
      return Response.json(
        { error: 'Too many flight searches. Please try again later.' },
        { status: 429 },
      )
    }
    console.error('[flight-search] Rate limit check failed')
    return Response.json({ error: 'Flight search is temporarily unavailable.' }, { status: 503 })
  }

  const slices = [
    { origin, destination, departure_date: departureDate },
    ...(typeof returnDate === 'string' && returnDate
      ? [{ origin: destination, destination: origin, departure_date: returnDate }]
      : []),
  ]

  try {
    const result = await duffelRequest<DuffelOfferRequest>('/air/offer_requests', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          slices,
          passengers: Array.from({ length: passengerCount }, () => ({ type: 'adult' })),
          cabin_class: cabinClass,
        },
      }),
    })

    if (!result.id.startsWith('orq_') || !Array.isArray(result.offers)) {
      throw new DuffelApiError(502, 'invalid_response')
    }

    const offers = result.offers
      .filter((offer) => offer.payment_requirements?.requires_instant_payment !== true)
      .map(summarizeOffer)
      .filter((offer) => offer !== null)
      .sort(
        (left, right) =>
          (toMinorUnits(left.totalAmount, left.currency) ?? Number.MAX_SAFE_INTEGER) -
          (toMinorUnits(right.totalAmount, right.currency) ?? Number.MAX_SAFE_INTEGER),
      )
      .slice(0, 30)

    return Response.json(
      { offerRequestId: result.id, offers },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
  } catch (error) {
    if (error instanceof DuffelConfigurationError) {
      return Response.json({ error: 'Live flight search is not configured yet.' }, { status: 503 })
    }
    if (error instanceof DuffelApiError) {
      console.error('[flight-search] Duffel request failed', {
        status: error.status,
        code: error.code,
      })
      return Response.json(
        {
          error:
            error.code === 'invalid_iata_code'
              ? 'One of these airport codes is not recognized by Duffel. Use a supported three-letter airport IATA code.'
              : 'Duffel could not complete that search. Please try again.',
        },
        { status: error.status >= 500 ? 502 : 400 },
      )
    }
    console.error('[flight-search] Unexpected request failure')
    return Response.json(
      { error: 'Live flight search is temporarily unavailable.' },
      { status: 502 },
    )
  }
}
