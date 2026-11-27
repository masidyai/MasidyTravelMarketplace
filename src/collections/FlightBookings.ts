import { randomUUID } from 'node:crypto'
import type { Access, CollectionBeforeValidateHook, CollectionConfig, FieldAccess } from 'payload'
import { parseFlightPassengers, toMinorUnits } from '@/lib/flight-validation'
import { auditChanges, auditDeletes } from '@/lib/audit-hook'

const adminsOnly: Access = ({ req }) => req.user?.collection === 'admins'
const adminsOnlyField: FieldAccess = ({ req }) => req.user?.collection === 'admins'

const canCreateCheckoutField: FieldAccess = ({ req }) =>
  req.user?.collection === 'admins' ||
  (req.user?.collection === 'users' && req.context?.flightCheckout === true)

const ownFlightBookings: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection !== 'users') return false
  return { traveler: { equals: req.user.id } }
}

const prepareFlightBooking: CollectionBeforeValidateHook = ({ data, operation, req }) => {
  if (operation !== 'create') return data
  if (req.user?.collection !== 'users' || req.context?.flightCheckout !== true) {
    throw new Error('Flight bookings can only be created through checkout.')
  }

  const passengers = parseFlightPassengers(data?.passengers)
  const currency = typeof data?.currency === 'string' ? data.currency : ''
  const amount = typeof data?.totalAmount === 'string' ? data.totalAmount : ''
  if (
    !passengers ||
    !toMinorUnits(amount, currency) ||
    typeof data?.offerId !== 'string' ||
    !data.offerId.startsWith('off_') ||
    typeof data?.offerRequestId !== 'string' ||
    !data.offerRequestId.startsWith('orq_')
  ) {
    throw new Error('Flight booking details are invalid.')
  }

  return {
    ...data,
    reference:
      typeof data.reference === 'string' && data.reference.startsWith('MSF-')
        ? data.reference
        : `MSF-${randomUUID().slice(0, 10).toUpperCase()}`,
    traveler: req.user.id,
    passengers,
    status: 'creating',
  }
}

export const FlightBookings: CollectionConfig = {
  slug: 'flight-bookings',
  admin: {
    group: 'Operations',
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'traveler', 'status', 'totalAmount', 'currency', 'createdAt'],
  },
  access: {
    create: ({ req }) => req.user?.collection === 'users' && req.context?.flightCheckout === true,
    delete: adminsOnly,
    read: ownFlightBookings,
    update: adminsOnly,
  },
  hooks: {
    beforeValidate: [prepareFlightBooking],
    afterChange: [auditChanges('flight-bookings')],
    afterDelete: [auditDeletes('flight-bookings')],
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      access: { create: canCreateCheckoutField, update: adminsOnlyField },
    },
    {
      name: 'traveler',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: { create: canCreateCheckoutField, update: adminsOnlyField },
    },
    {
      name: 'offerRequestId',
      type: 'text',
      required: true,
      access: { create: canCreateCheckoutField, update: adminsOnlyField },
    },
    {
      name: 'offerId',
      type: 'text',
      required: true,
      access: { create: canCreateCheckoutField, update: adminsOnlyField },
    },
    {
      name: 'duffelOrderId',
      type: 'text',
      index: true,
      access: { create: adminsOnlyField, update: adminsOnlyField },
    },
    {
      name: 'duffelPaymentId',
      type: 'text',
      access: { create: adminsOnlyField, update: adminsOnlyField },
    },
    {
      name: 'duffelPaymentAttemptedAt',
      type: 'date',
      access: { create: adminsOnlyField, update: adminsOnlyField },
    },
    {
      name: 'passengers',
      type: 'json',
      required: true,
      access: { create: canCreateCheckoutField, update: adminsOnlyField },
    },
    {
      name: 'itinerary',
      type: 'json',
      required: true,
      access: { create: canCreateCheckoutField, update: adminsOnlyField },
    },
    {
      name: 'totalAmount',
      type: 'text',
      required: true,
      minLength: 1,
      maxLength: 32,
      access: { create: canCreateCheckoutField, update: adminsOnlyField },
    },
    {
      name: 'currency',
      type: 'text',
      required: true,
      minLength: 3,
      maxLength: 3,
      access: { create: canCreateCheckoutField, update: adminsOnlyField },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'creating',
      access: { create: canCreateCheckoutField, update: adminsOnlyField },
      options: [
        { label: 'Creating booking hold', value: 'creating' },
        { label: 'Awaiting payment', value: 'awaiting_payment' },
        { label: 'Processing payment', value: 'processing' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'stripeCheckoutSessionId',
      type: 'text',
      unique: true,
      index: true,
      access: { create: adminsOnlyField, update: adminsOnlyField },
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      index: true,
      access: { create: adminsOnlyField, update: adminsOnlyField },
    },
    {
      name: 'paymentRequiredBy',
      type: 'date',
      access: { create: adminsOnlyField, update: adminsOnlyField },
    },
    {
      name: 'bookingReference',
      type: 'text',
      index: true,
      access: { create: adminsOnlyField, update: adminsOnlyField },
    },
    {
      name: 'failureReason',
      type: 'text',
      maxLength: 300,
      access: { create: adminsOnlyField, update: adminsOnlyField },
    },
    {
      name: 'confirmedAt',
      type: 'date',
      access: { create: adminsOnlyField, update: adminsOnlyField },
    },
  ],
}
