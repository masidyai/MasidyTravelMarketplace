import duffelDirectory from '@/data/duffel-cities.json'
import type { FlightLocationSuggestion } from '@/lib/flight-locations'

const countryNames = new Intl.DisplayNames(['en'], { type: 'region' })
const countryAliases: Record<string, string[]> = {
  AE: ['uae'],
  GB: ['uk', 'britain', 'great britain', 'england', 'scotland', 'wales', 'northern ireland'],
  US: ['usa', 'united states of america'],
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()

const indexedLocations = duffelDirectory.cities.flatMap((city) => {
  const country = countryNames.of(city.countryCode) || city.countryCode
  const aliases = countryAliases[city.countryCode] || []
  const citySecondary = normalize(`${country} ${city.countryCode} ${aliases.join(' ')}`)

  return [
    {
      location: {
        code: city.code,
        city: city.name,
        country,
        kind: 'city' as const,
        label: `${city.name}, ${country} (${city.code})`,
        name: city.name,
      },
      primary: normalize(city.name),
      code: normalize(city.code),
      secondary: citySecondary,
      secondaryTokens: ` ${citySecondary} `,
      airportCount: city.airports.length,
    },
    ...city.airports.map((airport) => {
      const secondary = normalize(`${city.name} ${city.code}`)
      return {
        location: {
          code: airport.code,
          city: city.name,
          country,
          kind: 'airport' as const,
          label: `${airport.name} — ${city.name}, ${country} (${airport.code})`,
          name: airport.name,
        },
        primary: normalize(airport.name),
        code: normalize(airport.code),
        secondary,
        secondaryTokens: ` ${secondary} `,
        airportCount: city.airports.length,
      }
    }),
  ]
})

function getMatchScore(
  primary: string,
  code: string,
  secondary: string,
  secondaryTokens: string,
  query: string,
) {
  if (primary === query || code === query) return 0
  if (primary.startsWith(query) || code.startsWith(query)) return 1
  if (secondaryTokens.includes(` ${query} `)) return 1
  if (primary.includes(query) || code.includes(query)) return 2
  if (secondary.includes(query)) return 3
  return null
}

export async function GET(request: Request) {
  const search = new URL(request.url).searchParams.get('q')?.trim() ?? ''
  if (search.length > 80) {
    return Response.json({ error: 'Search for a shorter place name.' }, { status: 400 })
  }

  const query = normalize(search)
  if (query.length < 2) {
    return Response.json({ locations: [] }, { headers: { 'Cache-Control': 'private, no-store' } })
  }

  const matches: Array<{
    location: FlightLocationSuggestion
    score: number
    airportCount: number
  }> = []

  for (const entry of indexedLocations) {
    const score = getMatchScore(
      entry.primary,
      entry.code,
      entry.secondary,
      entry.secondaryTokens,
      query,
    )
    if (score === null) continue

    matches.push({
      location: entry.location,
      score,
      airportCount: entry.airportCount,
    })
  }

  matches.sort(
    (left, right) =>
      left.score - right.score ||
      (left.location.kind === right.location.kind ? 0 : left.location.kind === 'city' ? -1 : 1) ||
      right.airportCount - left.airportCount ||
      left.location.label.localeCompare(right.location.label),
  )

  return Response.json(
    { locations: matches.slice(0, 12).map(({ location }) => location) },
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}
