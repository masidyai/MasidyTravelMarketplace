import 'server-only'

type DuffelErrorItem = {
  code?: string
}

export class DuffelConfigurationError extends Error {
  constructor() {
    super('Duffel is not configured.')
    this.name = 'DuffelConfigurationError'
  }
}

export class DuffelApiError extends Error {
  constructor(
    readonly status: number,
    readonly code?: string,
  ) {
    super('Duffel API request failed.')
    this.name = 'DuffelApiError'
  }
}

function getErrorCode(body: unknown): string | undefined {
  if (!body || typeof body !== 'object' || !('errors' in body)) return undefined
  const errors = (body as { errors?: DuffelErrorItem[] }).errors
  const code = errors?.[0]?.code
  return typeof code === 'string' ? code : undefined
}

export async function duffelRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = process.env.DUFFEL_ACCESS_TOKEN
  if (!token) throw new DuffelConfigurationError()

  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${token}`)
  headers.set('Duffel-Version', 'v2')
  headers.set('Accept', 'application/json')
  if (init.body) headers.set('Content-Type', 'application/json')

  const response = await fetch(new URL(path, 'https://api.duffel.com'), {
    ...init,
    headers,
    cache: 'no-store',
    signal: AbortSignal.timeout(25_000),
  })

  let body: unknown
  try {
    body = await response.json()
  } catch {
    body = null
  }

  if (!response.ok) throw new DuffelApiError(response.status, getErrorCode(body))
  if (!body || typeof body !== 'object' || !('data' in body)) {
    throw new DuffelApiError(response.status, 'invalid_response')
  }

  return (body as { data: T }).data
}

export function getDuffelErrorResponse(error: unknown) {
  if (error instanceof DuffelConfigurationError) {
    return { status: 503, message: 'Live flight search is not configured yet.' }
  }
  if (error instanceof DuffelApiError) {
    return {
      status: error.status >= 500 ? 502 : 400,
      message: 'Duffel could not complete that request. Please try again.',
    }
  }
  return { status: 502, message: 'Live flight search is temporarily unavailable.' }
}
