export type FlightLocationSuggestion = {
  code: string
  city: string
  country: string
  kind: 'airport' | 'city'
  label: string
  name: string
}
