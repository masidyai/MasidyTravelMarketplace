export type FlightPassenger = {
  given_name: string
  family_name: string
  born_on: string
  email: string
  phone_number: string
  gender?: 'm' | 'f'
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isValidDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

const isAdult = (birthDate: string) => {
  const birth = new Date(`${birthDate}T00:00:00.000Z`)
  const today = new Date()
  let age = today.getUTCFullYear() - birth.getUTCFullYear()
  if (
    today.getUTCMonth() < birth.getUTCMonth() ||
    (today.getUTCMonth() === birth.getUTCMonth() && today.getUTCDate() < birth.getUTCDate())
  ) {
    age -= 1
  }
  return age >= 12
}

export function parseFlightPassengers(value: unknown): FlightPassenger[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 9) return null

  const passengers: FlightPassenger[] = []
  for (const candidate of value) {
    if (!isRecord(candidate)) return null
    const allowedKeys = new Set([
      'given_name',
      'family_name',
      'born_on',
      'email',
      'phone_number',
      'gender',
    ])
    if (Object.keys(candidate).some((key) => !allowedKeys.has(key))) return null

    const givenName = typeof candidate.given_name === 'string' ? candidate.given_name.trim() : ''
    const familyName = typeof candidate.family_name === 'string' ? candidate.family_name.trim() : ''
    const bornOn = typeof candidate.born_on === 'string' ? candidate.born_on : ''
    const email = typeof candidate.email === 'string' ? candidate.email.trim() : ''
    const phoneNumber =
      typeof candidate.phone_number === 'string' ? candidate.phone_number.trim() : ''
    const gender = candidate.gender

    if (
      givenName.length < 1 ||
      givenName.length > 70 ||
      !/^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u.test(givenName) ||
      familyName.length < 1 ||
      familyName.length > 70 ||
      !/^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u.test(familyName) ||
      !isValidDate(bornOn) ||
      !isAdult(bornOn) ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ||
      !/^\+[1-9]\d{6,14}$/.test(phoneNumber) ||
      (gender !== undefined && gender !== '' && gender !== 'm' && gender !== 'f')
    ) {
      return null
    }

    passengers.push({
      given_name: givenName,
      family_name: familyName,
      born_on: bornOn,
      email,
      phone_number: phoneNumber,
      ...(gender === 'm' || gender === 'f' ? { gender } : {}),
    })
  }

  return passengers
}

export function toMinorUnits(amount: string, currency: string): number | null {
  if (!/^[A-Z]{3}$/.test(currency) || !/^\d+(?:\.\d+)?$/.test(amount)) return null

  let decimalPlaces: number
  try {
    const fractionDigits = new Intl.NumberFormat('en', {
      style: 'currency',
      currency,
    }).resolvedOptions().maximumFractionDigits
    if (fractionDigits === undefined) return null
    decimalPlaces = fractionDigits
  } catch {
    return null
  }

  const [whole, fraction = ''] = amount.split('.')
  if (fraction.slice(decimalPlaces).replace(/0/g, '').length > 0) return null
  const scaledFraction = fraction.slice(0, decimalPlaces).padEnd(decimalPlaces, '0')
  const minorUnits = Number(`${whole}${scaledFraction}` || '0')
  return Number.isSafeInteger(minorUnits) && minorUnits > 0 ? minorUnits : null
}
