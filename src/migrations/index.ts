import * as migration_20261122_115418_login_auth_schema from './20261122_115418_login_auth_schema';

export const migrations = [
  {
    up: migration_20261122_115418_login_auth_schema.up,
    down: migration_20261122_115418_login_auth_schema.down,
    name: '20261122_115418_login_auth_schema'
  },
];
