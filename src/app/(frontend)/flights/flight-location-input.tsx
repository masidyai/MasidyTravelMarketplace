'use client'

import { useEffect, useId, useState, type KeyboardEvent } from 'react'
import type { FlightLocationSuggestion } from '@/lib/flight-locations'

type FlightLocationInputProps = {
  label: string
  onSelect: (location: FlightLocationSuggestion | null) => void
  placeholder: string
  value: FlightLocationSuggestion | null
}

type LocationSearchResponse = {
  error?: string
  locations?: FlightLocationSuggestion[]
}

export default function FlightLocationInput({
  label,
  onSelect,
  placeholder,
  value,
}: FlightLocationInputProps) {
  const inputId = useId()
  const listId = useId()
  const [query, setQuery] = useState(value?.label ?? '')
  const [locations, setLocations] = useState<FlightLocationSuggestion[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')

  useEffect(() => {
    const search = query.trim()
    const controller = new AbortController()

    if (value || search.length < 2) {
      setLocations([])
      setLoading(false)
      setLookupError('')
      return () => controller.abort()
    }

    const timer = window.setTimeout(async () => {
      setLoading(true)
      setLookupError('')
      try {
        const response = await fetch(`/api/flights/locations?q=${encodeURIComponent(search)}`, {
          signal: controller.signal,
        })
        const result = (await response.json()) as LocationSearchResponse
        if (!response.ok || !Array.isArray(result.locations)) {
          throw new Error(result.error || 'Location search failed.')
        }
        setLocations(result.locations)
        setOpen(true)
        setActiveIndex(-1)
      } catch {
        if (!controller.signal.aborted) {
          setLocations([])
          setLookupError('Place search is temporarily unavailable. Please try again.')
          setOpen(true)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 250)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query, value])

  const selectLocation = (location: FlightLocationSuggestion) => {
    setQuery(location.label)
    setLocations([])
    setOpen(false)
    setActiveIndex(-1)
    onSelect(location)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }
    if (event.key === 'ArrowDown' && locations.length > 0) {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((current) => Math.min(current + 1, locations.length - 1))
      return
    }
    if (event.key === 'ArrowUp' && locations.length > 0) {
      event.preventDefault()
      setActiveIndex((current) => Math.max(current - 1, 0))
      return
    }
    if (event.key === 'Enter' && open && activeIndex >= 0) {
      event.preventDefault()
      selectLocation(locations[activeIndex])
    }
  }

  return (
    <div
      className="relative flex flex-col gap-2 text-sm font-semibold text-slate-700 lg:col-span-1"
      onBlur={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          setOpen(false)
        }
      }}
    >
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        required
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        value={query}
        onFocus={() => {
          if (query.trim().length >= 2 && !value) setOpen(true)
        }}
        onChange={(event) => {
          const nextQuery = event.target.value
          setQuery(nextQuery)
          setLocations([])
          setActiveIndex(-1)
          setOpen(nextQuery.trim().length >= 2)
          onSelect(null)
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base font-normal outline-none transition focus:border-[#087cb4] focus:ring-4 focus:ring-sky-100"
      />
      {open && query.trim().length >= 2 && (
        <div
          id={listId}
          role="listbox"
          aria-label={`${label} locations`}
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
        >
          {loading && (
            <p role="status" className="px-4 py-3 text-sm font-normal text-slate-500">
              Searching places…
            </p>
          )}
          {lookupError && (
            <p role="alert" className="px-4 py-3 text-sm font-normal text-rose-700">
              {lookupError}
            </p>
          )}
          {!loading && !lookupError && locations.length === 0 && (
            <p className="px-4 py-3 text-sm font-normal text-slate-500">
              No matching cities or airports. Try a nearby city or a different spelling.
            </p>
          )}
          {locations.map((location, index) => (
            <button
              id={`${listId}-${index}`}
              key={`${location.kind}-${location.code}-${location.city}`}
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectLocation(location)}
              className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-sky-50 ${
                activeIndex === index ? 'bg-sky-50' : ''
              }`}
            >
              <span className="text-sm font-medium text-slate-800">{location.label}</span>
              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                {location.kind}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
