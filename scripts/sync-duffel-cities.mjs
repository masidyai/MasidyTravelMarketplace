import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const token = process.env.DUFFEL_ACCESS_TOKEN
if (!token) throw new Error('DUFFEL_ACCESS_TOKEN must be set to refresh the Duffel city directory.')

async function fetchDirectory(resource) {
  const records = []
  let after
  let pages = 0

  do {
    const url = new URL(`https://api.duffel.com/air/${resource}`)
    url.searchParams.set('limit', '200')
    if (after) url.searchParams.set('after', after)

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Duffel-Version': 'v2',
      },
      signal: AbortSignal.timeout(90_000),
    })
    const result = await response.json()

    if (!response.ok) {
      throw new Error(`Duffel ${resource} request failed with HTTP ${response.status}.`)
    }
    if (!Array.isArray(result.data) || !result.meta) {
      throw new Error(`Duffel returned an invalid ${resource} directory response.`)
    }

    records.push(...result.data)
    after = result.meta.after
    pages += 1
    if (pages > 100 && after) {
      throw new Error(`Duffel ${resource} directory exceeded the page safety limit.`)
    }
  } while (after)

  return { records, pages }
}

const cityIndex = new Map()
const cityDirectory = await fetchDirectory('cities')
const airportDirectory = await fetchDirectory('airports')

function getCity(cityName, cityCode, countryCode) {
  const key = `${countryCode}:${cityCode}`
  let city = cityIndex.get(key)
  if (!city) {
    city = { name: cityName, code: cityCode, countryCode, airports: [] }
    cityIndex.set(key, city)
  }
  return city
}

function addAirport(city, airportName, airportCode) {
  if (!city.airports.some((airport) => airport.code === airportCode)) {
    city.airports.push({ name: airportName, code: airportCode })
  }
}

for (const cityRecord of cityDirectory.records) {
  if (
    typeof cityRecord.name !== 'string' ||
    typeof cityRecord.iata_code !== 'string' ||
    typeof cityRecord.iata_country_code !== 'string'
  ) {
    continue
  }

  const city = getCity(cityRecord.name, cityRecord.iata_code, cityRecord.iata_country_code)
  for (const airport of Array.isArray(cityRecord.airports) ? cityRecord.airports : []) {
    if (typeof airport.name === 'string' && typeof airport.iata_code === 'string') {
      addAirport(city, airport.name, airport.iata_code)
    }
  }
}

for (const airport of airportDirectory.records) {
  if (
    typeof airport.name !== 'string' ||
    typeof airport.iata_code !== 'string' ||
    typeof airport.city_name !== 'string' ||
    typeof airport.iata_city_code !== 'string' ||
    typeof airport.iata_country_code !== 'string'
  ) {
    continue
  }

  const city = getCity(airport.city_name, airport.iata_city_code, airport.iata_country_code)
  addAirport(city, airport.name, airport.iata_code)
}

const cities = [...cityIndex.values()]
  .map((city) => ({
    ...city,
    airports: city.airports.sort((left, right) => left.name.localeCompare(right.name)),
  }))
  .sort((left, right) => left.name.localeCompare(right.name) || left.code.localeCompare(right.code))

const outputPath = join(dirname(fileURLToPath(import.meta.url)), '../src/data/duffel-cities.json')
const countryNames = new Intl.DisplayNames(['en'], { type: 'region' })
const countryCodes = [...new Set(cities.map((city) => city.countryCode))].sort()
const countries = countryCodes.map((code) => ({
  code,
  name: countryNames.of(code) || code,
}))

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(
  outputPath,
  `${JSON.stringify({ source: 'Duffel /air/cities + /air/airports', generatedAt: new Date().toISOString(), cities })}\n`,
)
await writeFile(
  join(dirname(outputPath), 'duffel-countries.json'),
  `${JSON.stringify({ source: 'Duffel /air/cities + /air/airports', countries })}\n`,
)

const airportCount = cities.reduce((count, city) => count + city.airports.length, 0)
console.log(
  `Updated Duffel directory: ${cities.length} cities, ${airportCount} airports, and ` +
    `${countries.length} passport issuing countries (${cityDirectory.pages} city pages, ` +
    `${airportDirectory.pages} airport pages).`,
)
