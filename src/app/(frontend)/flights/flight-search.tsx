'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, Clock3, Plane, Search, ShieldCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { FlightLocationSuggestion } from '@/lib/flight-locations'
import type { FlightPassenger } from '@/lib/flight-validation'
import FlightLocationInput from './flight-location-input'

type FlightSegment = {
  airline: string
  flightNumber: string
  departingAt: string
  arrivingAt: string
  origin: { code: string; city: string }
  destination: { code: string; city: string }
}

type FlightSlice = {
  origin: string
  destination: string
  segments: FlightSegment[]
}

type FlightOffer = {
  id: string
  totalAmount: string
  currency: string
  airline: string
  slices: FlightSlice[]
  expiresAt: string | null
}

type PassengerDraft = Omit<FlightPassenger, 'gender'> & { gender: '' | 'm' | 'f' }

const formatPrice = (amount: string, currency: string) =>
  new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
  }).format(Number(amount))

const formatTime = (value: string) =>
  new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))

const emptyPassenger = (): PassengerDraft => ({
  given_name: '',
  family_name: '',
  born_on: '',
  email: '',
  phone_number: '',
  gender: '',
})

export default function FlightSearch() {
  const [origin, setOrigin] = useState<FlightLocationSuggestion | null>(null)
  const [destination, setDestination] = useState<FlightLocationSuggestion | null>(null)
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [passengerCount, setPassengerCount] = useState(1)
  const [cabinClass, setCabinClass] = useState('economy')
  const [offerRequestId, setOfferRequestId] = useState('')
  const [offers, setOffers] = useState<FlightOffer[]>([])
  const [selectedOfferId, setSelectedOfferId] = useState('')
  const [passengers, setPassengers] = useState<PassengerDraft[]>([emptyPassenger()])
  const [searching, setSearching] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState('')
  const [signInRequired, setSignInRequired] = useState(false)

  const selectedOffer = offers.find((offer) => offer.id === selectedOfferId)

  const searchFlights = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!origin || !destination) {
      setError('Choose a city or airport from the suggestions for both locations.')
      return
    }
    setSearching(true)
    setError('')
    setSignInRequired(false)
    setOffers([])
    setSelectedOfferId('')
    setOfferRequestId('')

    try {
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          origin: origin.code,
          destination: destination.code,
          departureDate,
          returnDate,
          passengers: passengerCount,
          cabinClass,
        }),
      })
      const result = (await response.json()) as {
        error?: string
        offerRequestId?: string
        offers?: FlightOffer[]
      }
      if (!response.ok || !result.offerRequestId || !Array.isArray(result.offers)) {
        setError(result.error || 'Live flight search could not be completed.')
        return
      }
      setOfferRequestId(result.offerRequestId)
      setOffers(result.offers)
    } catch {
      setError('Live flight search could not be completed. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  const selectOffer = (offerId: string) => {
    setSelectedOfferId(offerId)
    setPassengers(Array.from({ length: passengerCount }, emptyPassenger))
    setError('')
    setSignInRequired(false)
  }

  const updatePassenger = (index: number, field: keyof PassengerDraft, value: string) => {
    setPassengers((current) =>
      current.map((passenger, passengerIndex) =>
        passengerIndex === index ? { ...passenger, [field]: value } : passenger,
      ),
    )
  }

  const startCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedOffer) return

    setCheckingOut(true)
    setError('')
    setSignInRequired(false)
    try {
      const response = await fetch('/api/flights/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          offerRequestId,
          offerId: selectedOffer.id,
          passengers,
        }),
      })
      const result = (await response.json()) as { url?: string; error?: string }
      if (response.status === 401) {
        setSignInRequired(true)
        return
      }
      if (!response.ok || !result.url) {
        setError(result.error || 'Secure checkout could not be started.')
        return
      }
      window.location.assign(result.url)
    } catch {
      setError('Secure checkout could not be started. Please try again.')
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-[#0b2239]">
      <header className="border-b border-slate-200/80 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" aria-label="Masidy home" className="shrink-0">
            <Image
              src="/masidy-logo.png"
              alt="Masidy"
              width={959}
              height={313}
              className="h-9 w-auto"
              priority
            />
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 transition hover:text-[#087cb4]"
          >
            Back to marketplace
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#087cb4]">
            Flights, by Masidy
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Find your next flight.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Compare live airline fares and book securely with Masidy.
          </p>
        </div>

        <form
          onSubmit={searchFlights}
          className="mt-9 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(12,38,60,.07)] sm:grid-cols-2 sm:p-7 lg:grid-cols-6"
        >
          <FlightLocationInput
            label="From"
            placeholder="City, country, or airport"
            value={origin}
            onSelect={setOrigin}
          />
          <FlightLocationInput
            label="To"
            placeholder="City, country, or airport"
            value={destination}
            onSelect={setDestination}
          />
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 lg:col-span-1">
            Depart
            <input
              required
              type="date"
              value={departureDate}
              onChange={(event) => setDepartureDate(event.target.value)}
              className="h-12 rounded-xl border border-slate-200 px-4 text-base outline-none transition focus:border-[#087cb4] focus:ring-4 focus:ring-sky-100"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 lg:col-span-1">
            Return · optional
            <input
              type="date"
              value={returnDate}
              onChange={(event) => setReturnDate(event.target.value)}
              className="h-12 rounded-xl border border-slate-200 px-4 text-base outline-none transition focus:border-[#087cb4] focus:ring-4 focus:ring-sky-100"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
            Adults
            <select
              value={passengerCount}
              onChange={(event) => setPassengerCount(Number(event.target.value))}
              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-[#087cb4] focus:ring-4 focus:ring-sky-100"
            >
              {Array.from({ length: 9 }, (_, index) => index + 1).map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
            Cabin
            <select
              value={cabinClass}
              onChange={(event) => setCabinClass(event.target.value)}
              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-base outline-none transition focus:border-[#087cb4] focus:ring-4 focus:ring-sky-100"
            >
              <option value="economy">Economy</option>
              <option value="premium_economy">Premium economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={searching}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0c2f4d] px-5 font-bold text-white transition hover:bg-[#123d61] disabled:cursor-wait disabled:opacity-60 sm:col-span-2 lg:col-span-6"
          >
            <Search size={18} />
            {searching ? 'Searching live fares…' : 'Search flights'}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck size={15} className="text-[#087cb4]" />
            Secure payment with Stripe
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock3 size={15} className="text-[#087cb4]" />
            Live availability from Duffel
          </span>
          <span>Adult travellers age 12 and over</span>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
          >
            {error}
          </p>
        )}

        {offers.length > 0 && (
          <section aria-labelledby="results-heading" className="mt-12">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-500">Live fares</p>
                <h2 id="results-heading" className="mt-1 text-2xl font-semibold">
                  {offers.length} flight option{offers.length === 1 ? '' : 's'}
                </h2>
              </div>
              <span className="text-sm text-slate-500">
                Prices are for all {passengerCount} adult passenger{passengerCount === 1 ? '' : 's'}
                .
              </span>
            </div>
            <div className="grid gap-4">
              {offers.map((offer) => (
                <article
                  key={offer.id}
                  className={`rounded-3xl border bg-white p-5 shadow-sm transition sm:p-6 ${
                    selectedOfferId === offer.id
                      ? 'border-[#087cb4] ring-2 ring-sky-100'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-4">
                      {offer.slices.map((slice, index) => (
                        <div
                          key={`${offer.id}-${index}`}
                          className="grid gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0 sm:grid-cols-[100px_1fr_auto] sm:items-center"
                        >
                          <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            {offer.slices.length > 1
                              ? index === 0
                                ? 'Outbound'
                                : 'Return'
                              : 'Flight'}
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-lg font-semibold">
                              <span>{formatTime(slice.segments[0].departingAt)}</span>
                              <span className="text-sm font-medium text-slate-400">
                                {slice.origin}
                              </span>
                              <ArrowRight size={16} className="text-slate-400" />
                              <span>
                                {formatTime(slice.segments[slice.segments.length - 1].arrivingAt)}
                              </span>
                              <span className="text-sm font-medium text-slate-400">
                                {slice.destination}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-slate-500">
                              {slice.segments[0].airline}
                              {slice.segments[0].flightNumber
                                ? ` · ${slice.segments[0].flightNumber}`
                                : ''}
                              {slice.segments.length === 1
                                ? ' · Nonstop'
                                : ` · ${slice.segments.length - 1} stop${slice.segments.length === 2 ? '' : 's'}`}
                            </p>
                          </div>
                          <span className="text-sm text-slate-500">
                            {slice.segments[0].origin.city} to{' '}
                            {slice.segments[slice.segments.length - 1].destination.city}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between gap-5 border-t border-slate-100 pt-4 lg:min-w-56 lg:flex-col lg:items-end lg:border-0 lg:pt-0">
                      <div className="text-left lg:text-right">
                        <p className="text-2xl font-bold">
                          {formatPrice(offer.totalAmount, offer.currency)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">Total · {offer.airline}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => selectOffer(offer.id)}
                        className={`inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-bold transition ${
                          selectedOfferId === offer.id
                            ? 'bg-sky-50 text-[#087cb4]'
                            : 'bg-[#0c2f4d] text-white hover:bg-[#123d61]'
                        }`}
                      >
                        {selectedOfferId === offer.id ? (
                          <>
                            <Check size={16} />
                            Selected
                          </>
                        ) : (
                          <>
                            Choose flight
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {offerRequestId && offers.length === 0 && !searching && !error && (
          <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <Plane className="mx-auto text-slate-400" size={30} />
            <h2 className="mt-4 text-xl font-semibold">No bookable flights found</h2>
            <p className="mt-2 text-sm text-slate-500">
              Try different dates or airports. Some fares require instant airline payment and cannot
              use this secure checkout.
            </p>
          </div>
        )}

        {selectedOffer && (
          <form
            onSubmit={startCheckout}
            className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(12,38,60,.06)] sm:p-8"
          >
            <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#087cb4]">Next · traveller details</p>
                <h2 className="mt-1 text-2xl font-semibold">Who is flying?</h2>
              </div>
              <p className="text-lg font-bold">
                {formatPrice(selectedOffer.totalAmount, selectedOffer.currency)}
              </p>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-500">
              Enter each traveller’s name as shown on their travel document. This first release
              supports adult travellers (age 12+).
            </p>

            <div className="mt-6 grid gap-6">
              {passengers.map((passenger, index) => (
                <fieldset
                  key={index}
                  className="grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2 sm:p-5"
                >
                  <legend className="px-2 text-sm font-bold text-[#0c2f4d]">
                    Traveller {index + 1}
                  </legend>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    Given name(s)
                    <input
                      required
                      autoComplete="given-name"
                      value={passenger.given_name}
                      onChange={(event) => updatePassenger(index, 'given_name', event.target.value)}
                      className="h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-[#087cb4] focus:ring-4 focus:ring-sky-100"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    Family name
                    <input
                      required
                      autoComplete="family-name"
                      value={passenger.family_name}
                      onChange={(event) =>
                        updatePassenger(index, 'family_name', event.target.value)
                      }
                      className="h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-[#087cb4] focus:ring-4 focus:ring-sky-100"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    Date of birth
                    <input
                      required
                      type="date"
                      value={passenger.born_on}
                      onChange={(event) => updatePassenger(index, 'born_on', event.target.value)}
                      className="h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-[#087cb4] focus:ring-4 focus:ring-sky-100"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    Gender · optional
                    <select
                      value={passenger.gender}
                      onChange={(event) => updatePassenger(index, 'gender', event.target.value)}
                      className="h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-[#087cb4] focus:ring-4 focus:ring-sky-100"
                    >
                      <option value="">Not specified</option>
                      <option value="f">Female</option>
                      <option value="m">Male</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    Contact email
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      value={passenger.email}
                      onChange={(event) => updatePassenger(index, 'email', event.target.value)}
                      className="h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-[#087cb4] focus:ring-4 focus:ring-sky-100"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                    Phone · include country code
                    <input
                      required
                      type="tel"
                      autoComplete="tel"
                      placeholder="+447700900000"
                      value={passenger.phone_number}
                      onChange={(event) =>
                        updatePassenger(index, 'phone_number', event.target.value)
                      }
                      className="h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-[#087cb4] focus:ring-4 focus:ring-sky-100"
                    />
                  </label>
                </fieldset>
              ))}
            </div>

            {signInRequired && (
              <p className="mt-5 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
                Sign in with Google to continue to secure checkout.{' '}
                <Link href="/login" className="font-bold underline">
                  Continue with Google
                </Link>
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-xs leading-5 text-slate-500">
                Masidy places an airline hold, then confirms your ticket after Stripe payment. Live
                fares can change before the hold is created.
              </p>
              <button
                type="submit"
                disabled={checkingOut}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0c2f4d] px-6 font-bold text-white transition hover:bg-[#123d61] disabled:cursor-wait disabled:opacity-60"
              >
                {checkingOut ? 'Preparing secure checkout…' : 'Continue to payment'}
                <ArrowRight size={17} />
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  )
}
