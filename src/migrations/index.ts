import * as migration_20261122_115418_login_auth_schema from './20261122_115418_login_auth_schema'
import * as migration_20261122_125555_dashboard_data_schema from './20261122_125555_dashboard_data_schema'
import * as migration_20261127_135042_flight_bookings from './20261127_135042_flight_bookings'
import * as migration_20261127_135838_flight_payment_attempt from './20261127_135838_flight_payment_attempt'

export const migrations = [
  {
    up: migration_20261122_115418_login_auth_schema.up,
    down: migration_20261122_115418_login_auth_schema.down,
    name: '20261122_115418_login_auth_schema',
  },
  {
    up: migration_20261122_125555_dashboard_data_schema.up,
    down: migration_20261122_125555_dashboard_data_schema.down,
    name: '20261122_125555_dashboard_data_schema',
  },
  {
    up: migration_20261127_135042_flight_bookings.up,
    down: migration_20261127_135042_flight_bookings.down,
    name: '20261127_135042_flight_bookings',
  },
  {
    up: migration_20261127_135838_flight_payment_attempt.up,
    down: migration_20261127_135838_flight_payment_attempt.down,
    name: '20261127_135838_flight_payment_attempt',
  },
]
