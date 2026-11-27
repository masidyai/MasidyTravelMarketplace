import type { Metadata } from 'next'
import duffelCountries from '@/data/duffel-countries.json'
import FlightSearch from './flight-search'

export const metadata: Metadata = {
  title: 'Book flights | Masidy',
  description: 'Search live flights and book securely with Masidy.',
}

export default function FlightsPage() {
  return <FlightSearch passportCountries={duffelCountries.countries} />
}
