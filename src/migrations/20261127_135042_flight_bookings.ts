import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`flight_bookings\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`reference\` text NOT NULL,
    \`traveler_id\` integer NOT NULL,
    \`offer_request_id\` text NOT NULL,
    \`offer_id\` text NOT NULL,
    \`duffel_order_id\` text,
    \`duffel_payment_id\` text,
    \`passengers\` text NOT NULL,
    \`itinerary\` text NOT NULL,
    \`total_amount\` text NOT NULL,
    \`currency\` text NOT NULL,
    \`status\` text DEFAULT 'creating' NOT NULL,
    \`stripe_checkout_session_id\` text,
    \`stripe_payment_intent_id\` text,
    \`payment_required_by\` text,
    \`booking_reference\` text,
    \`failure_reason\` text,
    \`confirmed_at\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`traveler_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`flight_bookings_reference_idx\` ON \`flight_bookings\` (\`reference\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`flight_bookings_traveler_idx\` ON \`flight_bookings\` (\`traveler_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`flight_bookings_duffel_order_id_idx\` ON \`flight_bookings\` (\`duffel_order_id\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`flight_bookings_stripe_checkout_session_id_idx\` ON \`flight_bookings\` (\`stripe_checkout_session_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`flight_bookings_stripe_payment_intent_id_idx\` ON \`flight_bookings\` (\`stripe_payment_intent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`flight_bookings_booking_reference_idx\` ON \`flight_bookings\` (\`booking_reference\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`flight_bookings_updated_at_idx\` ON \`flight_bookings\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`flight_bookings_created_at_idx\` ON \`flight_bookings\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`flight_bookings_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`flight_bookings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`flight_bookings_rels_order_idx\` ON \`flight_bookings_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`flight_bookings_rels_parent_idx\` ON \`flight_bookings_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`flight_bookings_rels_path_idx\` ON \`flight_bookings_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`flight_bookings_rels_admins_id_idx\` ON \`flight_bookings_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`flight_bookings_rels_users_id_idx\` ON \`flight_bookings_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_flight_bookings_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_reference\` text NOT NULL,
    \`version_traveler_id\` integer NOT NULL,
    \`version_offer_request_id\` text NOT NULL,
    \`version_offer_id\` text NOT NULL,
    \`version_duffel_order_id\` text,
    \`version_duffel_payment_id\` text,
    \`version_passengers\` text NOT NULL,
    \`version_itinerary\` text NOT NULL,
    \`version_total_amount\` text NOT NULL,
    \`version_currency\` text NOT NULL,
    \`version_status\` text DEFAULT 'creating' NOT NULL,
    \`version_stripe_checkout_session_id\` text,
    \`version_stripe_payment_intent_id\` text,
    \`version_payment_required_by\` text,
    \`version_booking_reference\` text,
    \`version_failure_reason\` text,
    \`version_confirmed_at\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`flight_bookings\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_traveler_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_flight_bookings_v_parent_idx\` ON \`_flight_bookings_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_flight_bookings_v_version_version_reference_idx\` ON \`_flight_bookings_v\` (\`version_reference\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_flight_bookings_v_version_version_traveler_idx\` ON \`_flight_bookings_v\` (\`version_traveler_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_flight_bookings_v_version_version_duffel_order_id_idx\` ON \`_flight_bookings_v\` (\`version_duffel_order_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_flight_bookings_v_version_version_stripe_checkout_sessi_idx\` ON \`_flight_bookings_v\` (\`version_stripe_checkout_session_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_flight_bookings_v_version_version_stripe_payment_intent_idx\` ON \`_flight_bookings_v\` (\`version_stripe_payment_intent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_flight_bookings_v_version_version_booking_reference_idx\` ON \`_flight_bookings_v\` (\`version_booking_reference\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_flight_bookings_v_version_version_updated_at_idx\` ON \`_flight_bookings_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_flight_bookings_v_version_version_created_at_idx\` ON \`_flight_bookings_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_flight_bookings_v_created_at_idx\` ON \`_flight_bookings_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_flight_bookings_v_updated_at_idx\` ON \`_flight_bookings_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_flight_bookings_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_flight_bookings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_flight_bookings_v_rels_order_idx\` ON \`_flight_bookings_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_flight_bookings_v_rels_parent_idx\` ON \`_flight_bookings_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_flight_bookings_v_rels_path_idx\` ON \`_flight_bookings_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_flight_bookings_v_rels_admins_id_idx\` ON \`_flight_bookings_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_flight_bookings_v_rels_users_id_idx\` ON \`_flight_bookings_v_rels\` (\`users_id\`);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`flight_bookings_id\` integer REFERENCES flight_bookings(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_flight_bookings_id_idx\` ON \`payload_locked_documents_rels\` (\`flight_bookings_id\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`flight_bookings\`;`)
  await db.run(sql`DROP TABLE \`flight_bookings_rels\`;`)
  await db.run(sql`DROP TABLE \`_flight_bookings_v\`;`)
  await db.run(sql`DROP TABLE \`_flight_bookings_v_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    \`media_id\` integer,
    \`folders_id\` integer,
    \`tags_id\` integer,
    \`agencies_id\` integer,
    \`trips_id\` integer,
    \`agent_listings_id\` integer,
    \`booking_requests_id\` integer,
    \`auth_accounts_id\` integer,
    \`auth_verification_tokens_id\` integer,
    \`agency_memberships_id\` integer,
    \`orders_id\` integer,
    \`ai_projects_id\` integer,
    \`applications_id\` integer,
    \`departures_id\` integer,
    \`saved_trips_id\` integer,
    \`reviews_id\` integer,
    \`support_tickets_id\` integer,
    \`agent_profiles_id\` integer,
    \`reservation_holds_id\` integer,
    \`proposals_id\` integer,
    \`waitlists_id\` integer,
    \`order_changes_id\` integer,
    \`traveler_profiles_id\` integer,
    \`traveler_files_id\` integer,
    \`conversations_id\` integer,
    \`messages_id\` integer,
    \`notifications_id\` integer,
    \`finance_rules_id\` integer,
    \`payment_accounts_id\` integer,
    \`ledger_entries_id\` integer,
    \`invoices_id\` integer,
    \`refund_requests_id\` integer,
    \`brand_kits_id\` integer,
    \`ai_usage_id\` integer,
    \`legal_policies_id\` integer,
    \`consents_id\` integer,
    \`data_requests_id\` integer,
    \`audit_logs_id\` integer,
    \`security_events_id\` integer,
    \`rate_limits_id\` integer,
    \`payout_statements_id\` integer,
    \`disputes_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`folders_id\`) REFERENCES \`folders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`tags_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`agencies_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`trips_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`agent_listings_id\`) REFERENCES \`agent_listings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`booking_requests_id\`) REFERENCES \`booking_requests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`auth_accounts_id\`) REFERENCES \`auth_accounts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`auth_verification_tokens_id\`) REFERENCES \`auth_verification_tokens\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`agency_memberships_id\`) REFERENCES \`agency_memberships\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`orders_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`ai_projects_id\`) REFERENCES \`ai_projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`applications_id\`) REFERENCES \`applications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`departures_id\`) REFERENCES \`departures\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`saved_trips_id\`) REFERENCES \`saved_trips\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`reviews_id\`) REFERENCES \`reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`support_tickets_id\`) REFERENCES \`support_tickets\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`agent_profiles_id\`) REFERENCES \`agent_profiles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`reservation_holds_id\`) REFERENCES \`reservation_holds\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`proposals_id\`) REFERENCES \`proposals\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`waitlists_id\`) REFERENCES \`waitlists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`order_changes_id\`) REFERENCES \`order_changes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`traveler_profiles_id\`) REFERENCES \`traveler_profiles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`traveler_files_id\`) REFERENCES \`traveler_files\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`conversations_id\`) REFERENCES \`conversations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`messages_id\`) REFERENCES \`messages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`notifications_id\`) REFERENCES \`notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`finance_rules_id\`) REFERENCES \`finance_rules\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`payment_accounts_id\`) REFERENCES \`payment_accounts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`ledger_entries_id\`) REFERENCES \`ledger_entries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`invoices_id\`) REFERENCES \`invoices\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`refund_requests_id\`) REFERENCES \`refund_requests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`brand_kits_id\`) REFERENCES \`brand_kits\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`ai_usage_id\`) REFERENCES \`ai_usage\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`legal_policies_id\`) REFERENCES \`legal_policies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`consents_id\`) REFERENCES \`consents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`data_requests_id\`) REFERENCES \`data_requests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`audit_logs_id\`) REFERENCES \`audit_logs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`security_events_id\`) REFERENCES \`security_events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`rate_limits_id\`) REFERENCES \`rate_limits\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`payout_statements_id\`) REFERENCES \`payout_statements\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`disputes_id\`) REFERENCES \`disputes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "admins_id", "users_id", "media_id", "folders_id", "tags_id", "agencies_id", "trips_id", "agent_listings_id", "booking_requests_id", "auth_accounts_id", "auth_verification_tokens_id", "agency_memberships_id", "orders_id", "ai_projects_id", "applications_id", "departures_id", "saved_trips_id", "reviews_id", "support_tickets_id", "agent_profiles_id", "reservation_holds_id", "proposals_id", "waitlists_id", "order_changes_id", "traveler_profiles_id", "traveler_files_id", "conversations_id", "messages_id", "notifications_id", "finance_rules_id", "payment_accounts_id", "ledger_entries_id", "invoices_id", "refund_requests_id", "brand_kits_id", "ai_usage_id", "legal_policies_id", "consents_id", "data_requests_id", "audit_logs_id", "security_events_id", "rate_limits_id", "payout_statements_id", "disputes_id") SELECT "id", "order", "parent_id", "path", "admins_id", "users_id", "media_id", "folders_id", "tags_id", "agencies_id", "trips_id", "agent_listings_id", "booking_requests_id", "auth_accounts_id", "auth_verification_tokens_id", "agency_memberships_id", "orders_id", "ai_projects_id", "applications_id", "departures_id", "saved_trips_id", "reviews_id", "support_tickets_id", "agent_profiles_id", "reservation_holds_id", "proposals_id", "waitlists_id", "order_changes_id", "traveler_profiles_id", "traveler_files_id", "conversations_id", "messages_id", "notifications_id", "finance_rules_id", "payment_accounts_id", "ledger_entries_id", "invoices_id", "refund_requests_id", "brand_kits_id", "ai_usage_id", "legal_policies_id", "consents_id", "data_requests_id", "audit_logs_id", "security_events_id", "rate_limits_id", "payout_statements_id", "disputes_id" FROM \`payload_locked_documents_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(
    sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`,
  )
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_admins_id_idx\` ON \`payload_locked_documents_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_folders_id_idx\` ON \`payload_locked_documents_rels\` (\`folders_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_tags_id_idx\` ON \`payload_locked_documents_rels\` (\`tags_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_agencies_id_idx\` ON \`payload_locked_documents_rels\` (\`agencies_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_trips_id_idx\` ON \`payload_locked_documents_rels\` (\`trips_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_agent_listings_id_idx\` ON \`payload_locked_documents_rels\` (\`agent_listings_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_booking_requests_id_idx\` ON \`payload_locked_documents_rels\` (\`booking_requests_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_auth_accounts_id_idx\` ON \`payload_locked_documents_rels\` (\`auth_accounts_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_auth_verification_tokens_i_idx\` ON \`payload_locked_documents_rels\` (\`auth_verification_tokens_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_agency_memberships_id_idx\` ON \`payload_locked_documents_rels\` (\`agency_memberships_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_ai_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`ai_projects_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_applications_id_idx\` ON \`payload_locked_documents_rels\` (\`applications_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_departures_id_idx\` ON \`payload_locked_documents_rels\` (\`departures_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_saved_trips_id_idx\` ON \`payload_locked_documents_rels\` (\`saved_trips_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_reviews_id_idx\` ON \`payload_locked_documents_rels\` (\`reviews_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_support_tickets_id_idx\` ON \`payload_locked_documents_rels\` (\`support_tickets_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_agent_profiles_id_idx\` ON \`payload_locked_documents_rels\` (\`agent_profiles_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_reservation_holds_id_idx\` ON \`payload_locked_documents_rels\` (\`reservation_holds_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_proposals_id_idx\` ON \`payload_locked_documents_rels\` (\`proposals_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_waitlists_id_idx\` ON \`payload_locked_documents_rels\` (\`waitlists_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_order_changes_id_idx\` ON \`payload_locked_documents_rels\` (\`order_changes_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_traveler_profiles_id_idx\` ON \`payload_locked_documents_rels\` (\`traveler_profiles_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_traveler_files_id_idx\` ON \`payload_locked_documents_rels\` (\`traveler_files_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_conversations_id_idx\` ON \`payload_locked_documents_rels\` (\`conversations_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_messages_id_idx\` ON \`payload_locked_documents_rels\` (\`messages_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_notifications_id_idx\` ON \`payload_locked_documents_rels\` (\`notifications_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_finance_rules_id_idx\` ON \`payload_locked_documents_rels\` (\`finance_rules_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_payment_accounts_id_idx\` ON \`payload_locked_documents_rels\` (\`payment_accounts_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_ledger_entries_id_idx\` ON \`payload_locked_documents_rels\` (\`ledger_entries_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_invoices_id_idx\` ON \`payload_locked_documents_rels\` (\`invoices_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_refund_requests_id_idx\` ON \`payload_locked_documents_rels\` (\`refund_requests_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_brand_kits_id_idx\` ON \`payload_locked_documents_rels\` (\`brand_kits_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_ai_usage_id_idx\` ON \`payload_locked_documents_rels\` (\`ai_usage_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_legal_policies_id_idx\` ON \`payload_locked_documents_rels\` (\`legal_policies_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_consents_id_idx\` ON \`payload_locked_documents_rels\` (\`consents_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_data_requests_id_idx\` ON \`payload_locked_documents_rels\` (\`data_requests_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_audit_logs_id_idx\` ON \`payload_locked_documents_rels\` (\`audit_logs_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_security_events_id_idx\` ON \`payload_locked_documents_rels\` (\`security_events_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_rate_limits_id_idx\` ON \`payload_locked_documents_rels\` (\`rate_limits_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_payout_statements_id_idx\` ON \`payload_locked_documents_rels\` (\`payout_statements_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_disputes_id_idx\` ON \`payload_locked_documents_rels\` (\`disputes_id\`);`,
  )
}
