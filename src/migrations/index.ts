import * as migration_20261122_115418_login_auth_schema from './20261122_115418_login_auth_schema'
import * as migration_20261122_125555_dashboard_data_schema from './20261122_125555_dashboard_data_schema'

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
]
