import type { Metadata } from 'next'
import FlightSearch from './flight-search'

export const metadata: Metadata = {
  title: 'Book flights | Masidy',
  description: 'Search live flights and book securely with Masidy.',
}

export default function FlightsPage() {
  return <FlightSearch />
}
