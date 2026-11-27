import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`flight_bookings\` ADD \`duffel_payment_attempted_at\` text;`)
  await db.run(
    sql`ALTER TABLE \`_flight_bookings_v\` ADD \`version_duffel_payment_attempted_at\` text;`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`flight_bookings\` DROP COLUMN \`duffel_payment_attempted_at\`;`)
  await db.run(
    sql`ALTER TABLE \`_flight_bookings_v\` DROP COLUMN \`version_duffel_payment_attempted_at\`;`,
  )
}
