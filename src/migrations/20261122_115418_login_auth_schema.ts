import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`admins_sessions\` (
	\`_order\` integer NOT NULL,
	\`_parent_id\` integer NOT NULL,
	\`id\` text PRIMARY KEY NOT NULL,
	\`created_at\` text,
	\`expires_at\` text NOT NULL,
	\`refresh_count\` numeric,
	\`refreshed_at\` text,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`admins_sessions_order_idx\` ON \`admins_sessions\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX \`admins_sessions_parent_id_idx\` ON \`admins_sessions\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`admins\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`email\` text NOT NULL,
	\`reset_password_token\` text,
	\`reset_password_expiration\` text,
	\`salt\` text,
	\`hash\` text,
	\`reset_password_requested_at\` text,
	\`login_attempts\` numeric DEFAULT 0,
	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`admins_updated_at_idx\` ON \`admins\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`admins_created_at_idx\` ON \`admins\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`admins_email_idx\` ON \`admins\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`admins_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`admins_id\` integer,
	\`users_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`admins_rels_order_idx\` ON \`admins_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`admins_rels_parent_idx\` ON \`admins_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`admins_rels_path_idx\` ON \`admins_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`admins_rels_admins_id_idx\` ON \`admins_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE INDEX \`admins_rels_users_id_idx\` ON \`admins_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`email\` text NOT NULL,
	\`name\` text NOT NULL,
	\`role\` text DEFAULT 'traveler' NOT NULL,
	\`image\` text,
	\`email_verified\` text,
	\`status\` text DEFAULT 'active',
	\`phone\` text,
	\`country\` text,
	\`locale\` text DEFAULT 'en',
	\`time_zone\` text DEFAULT 'UTC',
	\`preferred_currency\` text DEFAULT 'USD',
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`users_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`admins_id\` integer,
	\`users_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_rels_order_idx\` ON \`users_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`users_rels_parent_idx\` ON \`users_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`users_rels_path_idx\` ON \`users_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`users_rels_admins_id_idx\` ON \`users_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE INDEX \`users_rels_users_id_idx\` ON \`users_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`_users_v\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`parent_id\` integer,
	\`version_email\` text NOT NULL,
	\`version_name\` text NOT NULL,
	\`version_role\` text DEFAULT 'traveler' NOT NULL,
	\`version_image\` text,
	\`version_email_verified\` text,
	\`version_status\` text DEFAULT 'active',
	\`version_phone\` text,
	\`version_country\` text,
	\`version_locale\` text DEFAULT 'en',
	\`version_time_zone\` text DEFAULT 'UTC',
	\`version_preferred_currency\` text DEFAULT 'USD',
	\`version_updated_at\` text,
	\`version_created_at\` text,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_users_v_parent_idx\` ON \`_users_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_users_v_version_version_email_idx\` ON \`_users_v\` (\`version_email\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_users_v_version_version_updated_at_idx\` ON \`_users_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_users_v_version_version_created_at_idx\` ON \`_users_v\` (\`version_created_at\`);`,
  )
  await db.run(sql`CREATE INDEX \`_users_v_created_at_idx\` ON \`_users_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_users_v_updated_at_idx\` ON \`_users_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_users_v_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`admins_id\` integer,
	\`users_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`_users_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_users_v_rels_order_idx\` ON \`_users_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_users_v_rels_parent_idx\` ON \`_users_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_users_v_rels_path_idx\` ON \`_users_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_users_v_rels_admins_id_idx\` ON \`_users_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_users_v_rels_users_id_idx\` ON \`_users_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`auth_accounts\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`user_id\` integer NOT NULL,
	\`type\` text NOT NULL,
	\`provider\` text NOT NULL,
	\`provider_account_id\` text NOT NULL,
	\`provider_key\` text NOT NULL,
	\`refresh_token\` text,
	\`access_token\` text,
	\`expires_at\` numeric,
	\`token_type\` text,
	\`scope\` text,
	\`id_token\` text,
	\`session_state\` text,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`auth_accounts_user_idx\` ON \`auth_accounts\` (\`user_id\`);`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`auth_accounts_provider_key_idx\` ON \`auth_accounts\` (\`provider_key\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`auth_accounts_updated_at_idx\` ON \`auth_accounts\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`auth_accounts_created_at_idx\` ON \`auth_accounts\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`auth_accounts_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`admins_id\` integer,
	\`users_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`auth_accounts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`auth_accounts_rels_order_idx\` ON \`auth_accounts_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`auth_accounts_rels_parent_idx\` ON \`auth_accounts_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`auth_accounts_rels_path_idx\` ON \`auth_accounts_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`auth_accounts_rels_admins_id_idx\` ON \`auth_accounts_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`auth_accounts_rels_users_id_idx\` ON \`auth_accounts_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_auth_accounts_v\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`parent_id\` integer,
	\`version_user_id\` integer NOT NULL,
	\`version_type\` text NOT NULL,
	\`version_provider\` text NOT NULL,
	\`version_provider_account_id\` text NOT NULL,
	\`version_provider_key\` text NOT NULL,
	\`version_refresh_token\` text,
	\`version_access_token\` text,
	\`version_expires_at\` numeric,
	\`version_token_type\` text,
	\`version_scope\` text,
	\`version_id_token\` text,
	\`version_session_state\` text,
	\`version_updated_at\` text,
	\`version_created_at\` text,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`auth_accounts\`(\`id\`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (\`version_user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_auth_accounts_v_parent_idx\` ON \`_auth_accounts_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_accounts_v_version_version_user_idx\` ON \`_auth_accounts_v\` (\`version_user_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_accounts_v_version_version_provider_key_idx\` ON \`_auth_accounts_v\` (\`version_provider_key\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_accounts_v_version_version_updated_at_idx\` ON \`_auth_accounts_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_accounts_v_version_version_created_at_idx\` ON \`_auth_accounts_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_accounts_v_created_at_idx\` ON \`_auth_accounts_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_accounts_v_updated_at_idx\` ON \`_auth_accounts_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_auth_accounts_v_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`admins_id\` integer,
	\`users_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`_auth_accounts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_auth_accounts_v_rels_order_idx\` ON \`_auth_accounts_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_accounts_v_rels_parent_idx\` ON \`_auth_accounts_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_accounts_v_rels_path_idx\` ON \`_auth_accounts_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_accounts_v_rels_admins_id_idx\` ON \`_auth_accounts_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_accounts_v_rels_users_id_idx\` ON \`_auth_accounts_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`auth_verification_tokens\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`identifier\` text NOT NULL,
	\`token\` text NOT NULL,
	\`expires\` text NOT NULL,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`auth_verification_tokens_identifier_idx\` ON \`auth_verification_tokens\` (\`identifier\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`auth_verification_tokens_token_idx\` ON \`auth_verification_tokens\` (\`token\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`auth_verification_tokens_updated_at_idx\` ON \`auth_verification_tokens\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`auth_verification_tokens_created_at_idx\` ON \`auth_verification_tokens\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`auth_verification_tokens_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`admins_id\` integer,
	\`users_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`auth_verification_tokens\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`auth_verification_tokens_rels_order_idx\` ON \`auth_verification_tokens_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`auth_verification_tokens_rels_parent_idx\` ON \`auth_verification_tokens_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`auth_verification_tokens_rels_path_idx\` ON \`auth_verification_tokens_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`auth_verification_tokens_rels_admins_id_idx\` ON \`auth_verification_tokens_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`auth_verification_tokens_rels_users_id_idx\` ON \`auth_verification_tokens_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_auth_verification_tokens_v\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`parent_id\` integer,
	\`version_identifier\` text NOT NULL,
	\`version_token\` text NOT NULL,
	\`version_expires\` text NOT NULL,
	\`version_updated_at\` text,
	\`version_created_at\` text,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`auth_verification_tokens\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_auth_verification_tokens_v_parent_idx\` ON \`_auth_verification_tokens_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_verification_tokens_v_version_version_identifier_idx\` ON \`_auth_verification_tokens_v\` (\`version_identifier\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_verification_tokens_v_version_version_token_idx\` ON \`_auth_verification_tokens_v\` (\`version_token\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_verification_tokens_v_version_version_updated_at_idx\` ON \`_auth_verification_tokens_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_verification_tokens_v_version_version_created_at_idx\` ON \`_auth_verification_tokens_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_verification_tokens_v_created_at_idx\` ON \`_auth_verification_tokens_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_verification_tokens_v_updated_at_idx\` ON \`_auth_verification_tokens_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_auth_verification_tokens_v_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`admins_id\` integer,
	\`users_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`_auth_verification_tokens_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_auth_verification_tokens_v_rels_order_idx\` ON \`_auth_verification_tokens_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_verification_tokens_v_rels_parent_idx\` ON \`_auth_verification_tokens_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_verification_tokens_v_rels_path_idx\` ON \`_auth_verification_tokens_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_verification_tokens_v_rels_admins_id_idx\` ON \`_auth_verification_tokens_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_auth_verification_tokens_v_rels_users_id_idx\` ON \`_auth_verification_tokens_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`media\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`alt\` text NOT NULL,
	\`prefix\` text DEFAULT '',
	\`_objectkey\` text,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`url\` text,
	\`thumbnail_u_r_l\` text,
	\`filename\` text,
	\`mime_type\` text,
	\`filesize\` numeric,
	\`width\` numeric,
	\`height\` numeric,
	\`_stored\` integer,
	\`_transforms\` text,
	\`original_filename\` text,
	\`original_url\` text,
	\`original_mime_type\` text,
	\`original_filesize\` numeric,
	\`original_width\` numeric,
	\`original_height\` numeric,
	\`original_prefix\` text,
	\`original__objectkey\` text,
	\`original__stored\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(
    sql`CREATE INDEX \`media_original_original_filename_idx\` ON \`media\` (\`original_filename\`);`,
  )
  await db.run(sql`CREATE TABLE \`media_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`admins_id\` integer,
	\`users_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`media_rels_order_idx\` ON \`media_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`media_rels_parent_idx\` ON \`media_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`media_rels_path_idx\` ON \`media_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`media_rels_admins_id_idx\` ON \`media_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE INDEX \`media_rels_users_id_idx\` ON \`media_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`_media_v\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`parent_id\` integer,
	\`version_alt\` text NOT NULL,
	\`version_prefix\` text DEFAULT '',
	\`version__objectkey\` text,
	\`version_updated_at\` text,
	\`version_created_at\` text,
	\`version_url\` text,
	\`version_thumbnail_u_r_l\` text,
	\`version_filename\` text,
	\`version_mime_type\` text,
	\`version_filesize\` numeric,
	\`version_width\` numeric,
	\`version_height\` numeric,
	\`version__stored\` integer,
	\`version__transforms\` text,
	\`version_original_filename\` text,
	\`version_original_url\` text,
	\`version_original_mime_type\` text,
	\`version_original_filesize\` numeric,
	\`version_original_width\` numeric,
	\`version_original_height\` numeric,
	\`version_original_prefix\` text,
	\`version_original__objectkey\` text,
	\`version_original__stored\` integer,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_media_v_parent_idx\` ON \`_media_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_media_v_version_version_updated_at_idx\` ON \`_media_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_media_v_version_version_created_at_idx\` ON \`_media_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_media_v_version_version_filename_idx\` ON \`_media_v\` (\`version_filename\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_media_v_version_original_version_original_filename_idx\` ON \`_media_v\` (\`version_original_filename\`);`,
  )
  await db.run(sql`CREATE INDEX \`_media_v_created_at_idx\` ON \`_media_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_updated_at_idx\` ON \`_media_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_media_v_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`admins_id\` integer,
	\`users_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`_media_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_media_v_rels_order_idx\` ON \`_media_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_rels_parent_idx\` ON \`_media_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_rels_path_idx\` ON \`_media_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_media_v_rels_admins_id_idx\` ON \`_media_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_media_v_rels_users_id_idx\` ON \`_media_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_kv\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`key\` text NOT NULL,
	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`global_slug\` text,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`admins_id\` integer,
	\`users_id\` integer,
	\`auth_accounts_id\` integer,
	\`auth_verification_tokens_id\` integer,
	\`media_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`auth_accounts_id\`) REFERENCES \`auth_accounts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`auth_verification_tokens_id\`) REFERENCES \`auth_verification_tokens\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
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
    sql`CREATE INDEX \`payload_locked_documents_rels_auth_accounts_id_idx\` ON \`payload_locked_documents_rels\` (\`auth_accounts_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_auth_verification_tokens_i_idx\` ON \`payload_locked_documents_rels\` (\`auth_verification_tokens_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`key\` text,
	\`value\` text,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` integer NOT NULL,
	\`path\` text NOT NULL,
	\`admins_id\` integer,
	\`users_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_admins_id_idx\` ON \`payload_preferences_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`name\` text,
	\`batch\` numeric,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_llm_instructions\` (
	\`id\` text PRIMARY KEY NOT NULL,
	\`entity_slug\` text NOT NULL,
	\`entity_type\` text NOT NULL,
	\`additional_instructions\` text,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_llm_instructions_entity_slug_idx\` ON \`payload_llm_instructions\` (\`entity_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_llm_instructions_updated_at_idx\` ON \`payload_llm_instructions\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_llm_instructions_created_at_idx\` ON \`payload_llm_instructions\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_llm_instructions_rels\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`order\` integer,
	\`parent_id\` text NOT NULL,
	\`path\` text NOT NULL,
	\`admins_id\` integer,
	\`users_id\` integer,
	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_llm_instructions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_llm_instructions_rels_order_idx\` ON \`payload_llm_instructions_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_llm_instructions_rels_parent_idx\` ON \`payload_llm_instructions_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_llm_instructions_rels_path_idx\` ON \`payload_llm_instructions_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_llm_instructions_rels_admins_id_idx\` ON \`payload_llm_instructions_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_llm_instructions_rels_users_id_idx\` ON \`payload_llm_instructions_rels\` (\`users_id\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`admins_sessions\`;`)
  await db.run(sql`DROP TABLE \`admins\`;`)
  await db.run(sql`DROP TABLE \`admins_rels\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`users_rels\`;`)
  await db.run(sql`DROP TABLE \`_users_v\`;`)
  await db.run(sql`DROP TABLE \`_users_v_rels\`;`)
  await db.run(sql`DROP TABLE \`auth_accounts\`;`)
  await db.run(sql`DROP TABLE \`auth_accounts_rels\`;`)
  await db.run(sql`DROP TABLE \`_auth_accounts_v\`;`)
  await db.run(sql`DROP TABLE \`_auth_accounts_v_rels\`;`)
  await db.run(sql`DROP TABLE \`auth_verification_tokens\`;`)
  await db.run(sql`DROP TABLE \`auth_verification_tokens_rels\`;`)
  await db.run(sql`DROP TABLE \`_auth_verification_tokens_v\`;`)
  await db.run(sql`DROP TABLE \`_auth_verification_tokens_v_rels\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`media_rels\`;`)
  await db.run(sql`DROP TABLE \`_media_v\`;`)
  await db.run(sql`DROP TABLE \`_media_v_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`payload_llm_instructions\`;`)
  await db.run(sql`DROP TABLE \`payload_llm_instructions_rels\`;`)
}
