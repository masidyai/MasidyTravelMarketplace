import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`folders\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_h_folders_id\` integer,
    \`name\` text NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`_h_folders_id\`) REFERENCES \`folders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`folders__h_folders_idx\` ON \`folders\` (\`_h_folders_id\`);`)
  await db.run(sql`CREATE INDEX \`folders_updated_at_idx\` ON \`folders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`folders_created_at_idx\` ON \`folders\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`folders_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`folders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`folders_rels_order_idx\` ON \`folders_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`folders_rels_parent_idx\` ON \`folders_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`folders_rels_path_idx\` ON \`folders_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`folders_rels_admins_id_idx\` ON \`folders_rels\` (\`admins_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`folders_rels_users_id_idx\` ON \`folders_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`_folders_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version__h_folders_id\` integer,
    \`version_name\` text NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`folders\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version__h_folders_id\`) REFERENCES \`folders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_folders_v_parent_idx\` ON \`_folders_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_folders_v_version_version__h_folders_idx\` ON \`_folders_v\` (\`version__h_folders_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_folders_v_version_version_updated_at_idx\` ON \`_folders_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_folders_v_version_version_created_at_idx\` ON \`_folders_v\` (\`version_created_at\`);`,
  )
  await db.run(sql`CREATE INDEX \`_folders_v_created_at_idx\` ON \`_folders_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_folders_v_updated_at_idx\` ON \`_folders_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_folders_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_folders_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_folders_v_rels_order_idx\` ON \`_folders_v_rels\` (\`order\`);`)
  await db.run(
    sql`CREATE INDEX \`_folders_v_rels_parent_idx\` ON \`_folders_v_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`_folders_v_rels_path_idx\` ON \`_folders_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_folders_v_rels_admins_id_idx\` ON \`_folders_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_folders_v_rels_users_id_idx\` ON \`_folders_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`tags\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_h_tags_id\` integer,
    \`name\` text NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`_h_tags_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`tags__h_tags_idx\` ON \`tags\` (\`_h_tags_id\`);`)
  await db.run(sql`CREATE INDEX \`tags_updated_at_idx\` ON \`tags\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`tags_created_at_idx\` ON \`tags\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`tags_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tags_rels_order_idx\` ON \`tags_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`tags_rels_parent_idx\` ON \`tags_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tags_rels_path_idx\` ON \`tags_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`tags_rels_admins_id_idx\` ON \`tags_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE INDEX \`tags_rels_users_id_idx\` ON \`tags_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`_tags_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version__h_tags_id\` integer,
    \`version_name\` text NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version__h_tags_id\`) REFERENCES \`tags\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_tags_v_parent_idx\` ON \`_tags_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_tags_v_version_version__h_tags_idx\` ON \`_tags_v\` (\`version__h_tags_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_tags_v_version_version_updated_at_idx\` ON \`_tags_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_tags_v_version_version_created_at_idx\` ON \`_tags_v\` (\`version_created_at\`);`,
  )
  await db.run(sql`CREATE INDEX \`_tags_v_created_at_idx\` ON \`_tags_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_tags_v_updated_at_idx\` ON \`_tags_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_tags_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_tags_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tags_v_rels_order_idx\` ON \`_tags_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_tags_v_rels_parent_idx\` ON \`_tags_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tags_v_rels_path_idx\` ON \`_tags_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_tags_v_rels_admins_id_idx\` ON \`_tags_v_rels\` (\`admins_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`_tags_v_rels_users_id_idx\` ON \`_tags_v_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`agencies_languages\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`language\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`agencies_languages_order_idx\` ON \`agencies_languages\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agencies_languages_parent_id_idx\` ON \`agencies_languages\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`agencies_licenses\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`authority\` text NOT NULL,
    \`number\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`agencies_licenses_order_idx\` ON \`agencies_licenses\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agencies_licenses_parent_id_idx\` ON \`agencies_licenses\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`agencies\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`name\` text NOT NULL,
    \`slug\` text NOT NULL,
    \`location\` text NOT NULL,
    \`specialty\` text NOT NULL,
    \`description\` text NOT NULL,
    \`website\` text,
    \`contact_email\` text,
    \`support_phone\` text,
    \`logo_id\` integer,
    \`cover_image_id\` integer,
    \`rating\` numeric NOT NULL,
    \`review_count\` numeric NOT NULL,
    \`years_active\` numeric NOT NULL,
    \`is_demo\` integer DEFAULT false,
    \`status\` text DEFAULT 'pending' NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`agencies_slug_idx\` ON \`agencies\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`agencies_logo_idx\` ON \`agencies\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`agencies_cover_image_idx\` ON \`agencies\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`agencies_updated_at_idx\` ON \`agencies\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`agencies_created_at_idx\` ON \`agencies\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`agencies_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`agencies_rels_order_idx\` ON \`agencies_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`agencies_rels_parent_idx\` ON \`agencies_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`agencies_rels_path_idx\` ON \`agencies_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`agencies_rels_admins_id_idx\` ON \`agencies_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agencies_rels_users_id_idx\` ON \`agencies_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_agencies_v_version_languages\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`language\` text NOT NULL,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_agencies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_agencies_v_version_languages_order_idx\` ON \`_agencies_v_version_languages\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agencies_v_version_languages_parent_id_idx\` ON \`_agencies_v_version_languages\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_agencies_v_version_licenses\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`authority\` text NOT NULL,
    \`number\` text NOT NULL,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_agencies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_agencies_v_version_licenses_order_idx\` ON \`_agencies_v_version_licenses\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agencies_v_version_licenses_parent_id_idx\` ON \`_agencies_v_version_licenses\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_agencies_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_name\` text NOT NULL,
    \`version_slug\` text NOT NULL,
    \`version_location\` text NOT NULL,
    \`version_specialty\` text NOT NULL,
    \`version_description\` text NOT NULL,
    \`version_website\` text,
    \`version_contact_email\` text,
    \`version_support_phone\` text,
    \`version_logo_id\` integer,
    \`version_cover_image_id\` integer,
    \`version_rating\` numeric NOT NULL,
    \`version_review_count\` numeric NOT NULL,
    \`version_years_active\` numeric NOT NULL,
    \`version_is_demo\` integer DEFAULT false,
    \`version_status\` text DEFAULT 'pending' NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_agencies_v_parent_idx\` ON \`_agencies_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_agencies_v_version_version_slug_idx\` ON \`_agencies_v\` (\`version_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agencies_v_version_version_logo_idx\` ON \`_agencies_v\` (\`version_logo_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agencies_v_version_version_cover_image_idx\` ON \`_agencies_v\` (\`version_cover_image_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agencies_v_version_version_updated_at_idx\` ON \`_agencies_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agencies_v_version_version_created_at_idx\` ON \`_agencies_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agencies_v_created_at_idx\` ON \`_agencies_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agencies_v_updated_at_idx\` ON \`_agencies_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_agencies_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_agencies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_agencies_v_rels_order_idx\` ON \`_agencies_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agencies_v_rels_parent_idx\` ON \`_agencies_v_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`_agencies_v_rels_path_idx\` ON \`_agencies_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_agencies_v_rels_admins_id_idx\` ON \`_agencies_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agencies_v_rels_users_id_idx\` ON \`_agencies_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`trips_highlights\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`title\` text NOT NULL,
    \`description\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`trips_highlights_order_idx\` ON \`trips_highlights\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`trips_highlights_parent_id_idx\` ON \`trips_highlights\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`trips_itinerary\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`day\` numeric NOT NULL,
    \`title\` text NOT NULL,
    \`description\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`trips_itinerary_order_idx\` ON \`trips_itinerary\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX \`trips_itinerary_parent_id_idx\` ON \`trips_itinerary\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`trips_inclusions\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`item\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`trips_inclusions_order_idx\` ON \`trips_inclusions\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`trips_inclusions_parent_id_idx\` ON \`trips_inclusions\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`trips_exclusions\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`item\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`trips_exclusions_order_idx\` ON \`trips_exclusions\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`trips_exclusions_parent_id_idx\` ON \`trips_exclusions\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`trips\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text NOT NULL,
    \`slug\` text NOT NULL,
    \`destination\` text NOT NULL,
    \`country\` text NOT NULL,
    \`category\` text NOT NULL,
    \`agency_id\` integer NOT NULL,
    \`hero_image_id\` integer,
    \`duration_days\` numeric NOT NULL,
    \`price\` numeric NOT NULL,
    \`currency\` text DEFAULT 'USD' NOT NULL,
    \`rating\` numeric DEFAULT 0 NOT NULL,
    \`review_count\` numeric DEFAULT 0 NOT NULL,
    \`agent_commission\` numeric NOT NULL,
    \`tagline\` text NOT NULL,
    \`summary\` text,
    \`accommodation\` text,
    \`transport\` text,
    \`meeting_point\` text,
    \`difficulty\` text,
    \`cancellation_policy\` text,
    \`featured\` integer DEFAULT false,
    \`is_demo\` integer DEFAULT false,
    \`status\` text DEFAULT 'draft' NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`agency_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`trips_slug_idx\` ON \`trips\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`trips_agency_idx\` ON \`trips\` (\`agency_id\`);`)
  await db.run(sql`CREATE INDEX \`trips_hero_image_idx\` ON \`trips\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`trips_updated_at_idx\` ON \`trips\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`trips_created_at_idx\` ON \`trips\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`trips_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`media_id\` integer,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`trips_rels_order_idx\` ON \`trips_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`trips_rels_parent_idx\` ON \`trips_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`trips_rels_path_idx\` ON \`trips_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`trips_rels_media_id_idx\` ON \`trips_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`trips_rels_admins_id_idx\` ON \`trips_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE INDEX \`trips_rels_users_id_idx\` ON \`trips_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`_trips_v_version_highlights\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text NOT NULL,
    \`description\` text,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_trips_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_trips_v_version_highlights_order_idx\` ON \`_trips_v_version_highlights\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_trips_v_version_highlights_parent_id_idx\` ON \`_trips_v_version_highlights\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_trips_v_version_itinerary\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`day\` numeric NOT NULL,
    \`title\` text NOT NULL,
    \`description\` text NOT NULL,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_trips_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_trips_v_version_itinerary_order_idx\` ON \`_trips_v_version_itinerary\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_trips_v_version_itinerary_parent_id_idx\` ON \`_trips_v_version_itinerary\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_trips_v_version_inclusions\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`item\` text NOT NULL,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_trips_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_trips_v_version_inclusions_order_idx\` ON \`_trips_v_version_inclusions\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_trips_v_version_inclusions_parent_id_idx\` ON \`_trips_v_version_inclusions\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_trips_v_version_exclusions\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`item\` text NOT NULL,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_trips_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_trips_v_version_exclusions_order_idx\` ON \`_trips_v_version_exclusions\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_trips_v_version_exclusions_parent_id_idx\` ON \`_trips_v_version_exclusions\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_trips_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_title\` text NOT NULL,
    \`version_slug\` text NOT NULL,
    \`version_destination\` text NOT NULL,
    \`version_country\` text NOT NULL,
    \`version_category\` text NOT NULL,
    \`version_agency_id\` integer NOT NULL,
    \`version_hero_image_id\` integer,
    \`version_duration_days\` numeric NOT NULL,
    \`version_price\` numeric NOT NULL,
    \`version_currency\` text DEFAULT 'USD' NOT NULL,
    \`version_rating\` numeric DEFAULT 0 NOT NULL,
    \`version_review_count\` numeric DEFAULT 0 NOT NULL,
    \`version_agent_commission\` numeric NOT NULL,
    \`version_tagline\` text NOT NULL,
    \`version_summary\` text,
    \`version_accommodation\` text,
    \`version_transport\` text,
    \`version_meeting_point\` text,
    \`version_difficulty\` text,
    \`version_cancellation_policy\` text,
    \`version_featured\` integer DEFAULT false,
    \`version_is_demo\` integer DEFAULT false,
    \`version_status\` text DEFAULT 'draft' NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_agency_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_trips_v_parent_idx\` ON \`_trips_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_trips_v_version_version_slug_idx\` ON \`_trips_v\` (\`version_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_trips_v_version_version_agency_idx\` ON \`_trips_v\` (\`version_agency_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_trips_v_version_version_hero_image_idx\` ON \`_trips_v\` (\`version_hero_image_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_trips_v_version_version_updated_at_idx\` ON \`_trips_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_trips_v_version_version_created_at_idx\` ON \`_trips_v\` (\`version_created_at\`);`,
  )
  await db.run(sql`CREATE INDEX \`_trips_v_created_at_idx\` ON \`_trips_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_trips_v_updated_at_idx\` ON \`_trips_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_trips_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`media_id\` integer,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_trips_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_trips_v_rels_order_idx\` ON \`_trips_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_trips_v_rels_parent_idx\` ON \`_trips_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_trips_v_rels_path_idx\` ON \`_trips_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_trips_v_rels_media_id_idx\` ON \`_trips_v_rels\` (\`media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_trips_v_rels_admins_id_idx\` ON \`_trips_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_trips_v_rels_users_id_idx\` ON \`_trips_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`agent_listings\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`public_title\` text NOT NULL,
    \`agent_id\` integer NOT NULL,
    \`trip_id\` integer NOT NULL,
    \`personal_note\` text NOT NULL,
    \`status\` text DEFAULT 'draft' NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`agent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`trip_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`agent_listings_agent_idx\` ON \`agent_listings\` (\`agent_id\`);`)
  await db.run(sql`CREATE INDEX \`agent_listings_trip_idx\` ON \`agent_listings\` (\`trip_id\`);`)
  await db.run(
    sql`CREATE INDEX \`agent_listings_updated_at_idx\` ON \`agent_listings\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agent_listings_created_at_idx\` ON \`agent_listings\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`agent_listings_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`agent_listings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`agent_listings_rels_order_idx\` ON \`agent_listings_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agent_listings_rels_parent_idx\` ON \`agent_listings_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agent_listings_rels_path_idx\` ON \`agent_listings_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agent_listings_rels_admins_id_idx\` ON \`agent_listings_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agent_listings_rels_users_id_idx\` ON \`agent_listings_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_agent_listings_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_public_title\` text NOT NULL,
    \`version_agent_id\` integer NOT NULL,
    \`version_trip_id\` integer NOT NULL,
    \`version_personal_note\` text NOT NULL,
    \`version_status\` text DEFAULT 'draft' NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`agent_listings\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_agent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_trip_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_agent_listings_v_parent_idx\` ON \`_agent_listings_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_listings_v_version_version_agent_idx\` ON \`_agent_listings_v\` (\`version_agent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_listings_v_version_version_trip_idx\` ON \`_agent_listings_v\` (\`version_trip_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_listings_v_version_version_updated_at_idx\` ON \`_agent_listings_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_listings_v_version_version_created_at_idx\` ON \`_agent_listings_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_listings_v_created_at_idx\` ON \`_agent_listings_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_listings_v_updated_at_idx\` ON \`_agent_listings_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_agent_listings_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_agent_listings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_agent_listings_v_rels_order_idx\` ON \`_agent_listings_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_listings_v_rels_parent_idx\` ON \`_agent_listings_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_listings_v_rels_path_idx\` ON \`_agent_listings_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_listings_v_rels_admins_id_idx\` ON \`_agent_listings_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_listings_v_rels_users_id_idx\` ON \`_agent_listings_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`booking_requests\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`traveler_name\` text NOT NULL,
    \`email\` text NOT NULL,
    \`phone\` text,
    \`trip_id\` integer NOT NULL,
    \`travelers\` numeric NOT NULL,
    \`preferred_month\` text NOT NULL,
    \`note\` text,
    \`status\` text DEFAULT 'new',
    \`quoted_amount\` numeric,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`trip_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`booking_requests_trip_idx\` ON \`booking_requests\` (\`trip_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`booking_requests_updated_at_idx\` ON \`booking_requests\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`booking_requests_created_at_idx\` ON \`booking_requests\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`booking_requests_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`booking_requests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`booking_requests_rels_order_idx\` ON \`booking_requests_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`booking_requests_rels_parent_idx\` ON \`booking_requests_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`booking_requests_rels_path_idx\` ON \`booking_requests_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`booking_requests_rels_admins_id_idx\` ON \`booking_requests_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`booking_requests_rels_users_id_idx\` ON \`booking_requests_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_booking_requests_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_traveler_name\` text NOT NULL,
    \`version_email\` text NOT NULL,
    \`version_phone\` text,
    \`version_trip_id\` integer NOT NULL,
    \`version_travelers\` numeric NOT NULL,
    \`version_preferred_month\` text NOT NULL,
    \`version_note\` text,
    \`version_status\` text DEFAULT 'new',
    \`version_quoted_amount\` numeric,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`booking_requests\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_trip_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_booking_requests_v_parent_idx\` ON \`_booking_requests_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_booking_requests_v_version_version_trip_idx\` ON \`_booking_requests_v\` (\`version_trip_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_booking_requests_v_version_version_updated_at_idx\` ON \`_booking_requests_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_booking_requests_v_version_version_created_at_idx\` ON \`_booking_requests_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_booking_requests_v_created_at_idx\` ON \`_booking_requests_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_booking_requests_v_updated_at_idx\` ON \`_booking_requests_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_booking_requests_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_booking_requests_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_booking_requests_v_rels_order_idx\` ON \`_booking_requests_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_booking_requests_v_rels_parent_idx\` ON \`_booking_requests_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_booking_requests_v_rels_path_idx\` ON \`_booking_requests_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_booking_requests_v_rels_admins_id_idx\` ON \`_booking_requests_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_booking_requests_v_rels_users_id_idx\` ON \`_booking_requests_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`agency_memberships\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`user_id\` integer NOT NULL,
    \`agency_id\` integer NOT NULL,
    \`role\` text DEFAULT 'manager' NOT NULL,
    \`status\` text DEFAULT 'active' NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`agency_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`agency_memberships_user_idx\` ON \`agency_memberships\` (\`user_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agency_memberships_agency_idx\` ON \`agency_memberships\` (\`agency_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agency_memberships_updated_at_idx\` ON \`agency_memberships\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agency_memberships_created_at_idx\` ON \`agency_memberships\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`agency_memberships_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`agency_memberships\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`agency_memberships_rels_order_idx\` ON \`agency_memberships_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agency_memberships_rels_parent_idx\` ON \`agency_memberships_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agency_memberships_rels_path_idx\` ON \`agency_memberships_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agency_memberships_rels_admins_id_idx\` ON \`agency_memberships_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agency_memberships_rels_users_id_idx\` ON \`agency_memberships_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_agency_memberships_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_user_id\` integer NOT NULL,
    \`version_agency_id\` integer NOT NULL,
    \`version_role\` text DEFAULT 'manager' NOT NULL,
    \`version_status\` text DEFAULT 'active' NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`agency_memberships\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_agency_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_agency_memberships_v_parent_idx\` ON \`_agency_memberships_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agency_memberships_v_version_version_user_idx\` ON \`_agency_memberships_v\` (\`version_user_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agency_memberships_v_version_version_agency_idx\` ON \`_agency_memberships_v\` (\`version_agency_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agency_memberships_v_version_version_updated_at_idx\` ON \`_agency_memberships_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agency_memberships_v_version_version_created_at_idx\` ON \`_agency_memberships_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agency_memberships_v_created_at_idx\` ON \`_agency_memberships_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agency_memberships_v_updated_at_idx\` ON \`_agency_memberships_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_agency_memberships_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_agency_memberships_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_agency_memberships_v_rels_order_idx\` ON \`_agency_memberships_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agency_memberships_v_rels_parent_idx\` ON \`_agency_memberships_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agency_memberships_v_rels_path_idx\` ON \`_agency_memberships_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agency_memberships_v_rels_admins_id_idx\` ON \`_agency_memberships_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agency_memberships_v_rels_users_id_idx\` ON \`_agency_memberships_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`orders\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`reference\` text NOT NULL,
    \`traveler_id\` integer NOT NULL,
    \`agent_id\` integer,
    \`agency_id\` integer NOT NULL,
    \`trip_id\` integer NOT NULL,
    \`departure_id\` integer,
    \`travelers\` numeric NOT NULL,
    \`total\` numeric NOT NULL,
    \`subtotal\` numeric,
    \`tax_amount\` numeric,
    \`currency\` text NOT NULL,
    \`agent_commission_amount\` numeric,
    \`platform_fee_amount\` numeric,
    \`invoice_prefix\` text,
    \`status\` text DEFAULT 'pending' NOT NULL,
    \`stripe_checkout_session_id\` text,
    \`stripe_payment_intent_id\` text,
    \`paid_at\` text,
    \`voucher_code\` text,
    \`voucher_issued_at\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`traveler_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`agent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`agency_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`trip_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`departure_id\`) REFERENCES \`departures\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`orders_reference_idx\` ON \`orders\` (\`reference\`);`)
  await db.run(sql`CREATE INDEX \`orders_traveler_idx\` ON \`orders\` (\`traveler_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_agent_idx\` ON \`orders\` (\`agent_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_agency_idx\` ON \`orders\` (\`agency_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_trip_idx\` ON \`orders\` (\`trip_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_departure_idx\` ON \`orders\` (\`departure_id\`);`)
  await db.run(
    sql`CREATE INDEX \`orders_stripe_checkout_session_id_idx\` ON \`orders\` (\`stripe_checkout_session_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`orders_stripe_payment_intent_id_idx\` ON \`orders\` (\`stripe_payment_intent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`orders_voucher_code_idx\` ON \`orders\` (\`voucher_code\`);`)
  await db.run(sql`CREATE INDEX \`orders_updated_at_idx\` ON \`orders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`orders_created_at_idx\` ON \`orders\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`orders_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`orders_rels_order_idx\` ON \`orders_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`orders_rels_parent_idx\` ON \`orders_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_rels_path_idx\` ON \`orders_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`orders_rels_admins_id_idx\` ON \`orders_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE INDEX \`orders_rels_users_id_idx\` ON \`orders_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`_orders_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_reference\` text NOT NULL,
    \`version_traveler_id\` integer NOT NULL,
    \`version_agent_id\` integer,
    \`version_agency_id\` integer NOT NULL,
    \`version_trip_id\` integer NOT NULL,
    \`version_departure_id\` integer,
    \`version_travelers\` numeric NOT NULL,
    \`version_total\` numeric NOT NULL,
    \`version_subtotal\` numeric,
    \`version_tax_amount\` numeric,
    \`version_currency\` text NOT NULL,
    \`version_agent_commission_amount\` numeric,
    \`version_platform_fee_amount\` numeric,
    \`version_invoice_prefix\` text,
    \`version_status\` text DEFAULT 'pending' NOT NULL,
    \`version_stripe_checkout_session_id\` text,
    \`version_stripe_payment_intent_id\` text,
    \`version_paid_at\` text,
    \`version_voucher_code\` text,
    \`version_voucher_issued_at\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_traveler_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_agent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_agency_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_trip_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_departure_id\`) REFERENCES \`departures\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_orders_v_parent_idx\` ON \`_orders_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_orders_v_version_version_reference_idx\` ON \`_orders_v\` (\`version_reference\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_orders_v_version_version_traveler_idx\` ON \`_orders_v\` (\`version_traveler_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_orders_v_version_version_agent_idx\` ON \`_orders_v\` (\`version_agent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_orders_v_version_version_agency_idx\` ON \`_orders_v\` (\`version_agency_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_orders_v_version_version_trip_idx\` ON \`_orders_v\` (\`version_trip_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_orders_v_version_version_departure_idx\` ON \`_orders_v\` (\`version_departure_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_orders_v_version_version_stripe_checkout_session_id_idx\` ON \`_orders_v\` (\`version_stripe_checkout_session_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_orders_v_version_version_stripe_payment_intent_id_idx\` ON \`_orders_v\` (\`version_stripe_payment_intent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_orders_v_version_version_voucher_code_idx\` ON \`_orders_v\` (\`version_voucher_code\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_orders_v_version_version_updated_at_idx\` ON \`_orders_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_orders_v_version_version_created_at_idx\` ON \`_orders_v\` (\`version_created_at\`);`,
  )
  await db.run(sql`CREATE INDEX \`_orders_v_created_at_idx\` ON \`_orders_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_orders_v_updated_at_idx\` ON \`_orders_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_orders_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_orders_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_orders_v_rels_order_idx\` ON \`_orders_v_rels\` (\`order\`);`)
  await db.run(
    sql`CREATE INDEX \`_orders_v_rels_parent_idx\` ON \`_orders_v_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`_orders_v_rels_path_idx\` ON \`_orders_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_orders_v_rels_admins_id_idx\` ON \`_orders_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_orders_v_rels_users_id_idx\` ON \`_orders_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`ai_projects_sections\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`type\` text NOT NULL,
    \`eyebrow\` text,
    \`heading\` text NOT NULL,
    \`body\` text NOT NULL,
    \`cta_label\` text,
    \`cta_href\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`ai_projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`ai_projects_sections_order_idx\` ON \`ai_projects_sections\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`ai_projects_sections_parent_id_idx\` ON \`ai_projects_sections\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`ai_projects_versions\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`saved_at\` text NOT NULL,
    \`label\` text NOT NULL,
    \`sections\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`ai_projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`ai_projects_versions_order_idx\` ON \`ai_projects_versions\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`ai_projects_versions_parent_id_idx\` ON \`ai_projects_versions\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`ai_projects\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`owner_id\` integer NOT NULL,
    \`title\` text NOT NULL,
    \`type\` text NOT NULL,
    \`prompt\` text NOT NULL,
    \`generated_content\` text,
    \`slug\` text,
    \`template\` text DEFAULT 'editorial',
    \`brand_kit_id\` integer,
    \`published_at\` text,
    \`status\` text DEFAULT 'draft' NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`brand_kit_id\`) REFERENCES \`brand_kits\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`ai_projects_owner_idx\` ON \`ai_projects\` (\`owner_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`ai_projects_slug_idx\` ON \`ai_projects\` (\`slug\`);`)
  await db.run(
    sql`CREATE INDEX \`ai_projects_brand_kit_idx\` ON \`ai_projects\` (\`brand_kit_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`ai_projects_updated_at_idx\` ON \`ai_projects\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`ai_projects_created_at_idx\` ON \`ai_projects\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`ai_projects_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`ai_projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`ai_projects_rels_order_idx\` ON \`ai_projects_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`ai_projects_rels_parent_idx\` ON \`ai_projects_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`ai_projects_rels_path_idx\` ON \`ai_projects_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`ai_projects_rels_admins_id_idx\` ON \`ai_projects_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`ai_projects_rels_users_id_idx\` ON \`ai_projects_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_ai_projects_v_version_sections\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`type\` text NOT NULL,
    \`eyebrow\` text,
    \`heading\` text NOT NULL,
    \`body\` text NOT NULL,
    \`cta_label\` text,
    \`cta_href\` text,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ai_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_version_sections_order_idx\` ON \`_ai_projects_v_version_sections\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_version_sections_parent_id_idx\` ON \`_ai_projects_v_version_sections\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_ai_projects_v_version_versions\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`saved_at\` text NOT NULL,
    \`label\` text NOT NULL,
    \`sections\` text NOT NULL,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ai_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_version_versions_order_idx\` ON \`_ai_projects_v_version_versions\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_version_versions_parent_id_idx\` ON \`_ai_projects_v_version_versions\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_ai_projects_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_owner_id\` integer NOT NULL,
    \`version_title\` text NOT NULL,
    \`version_type\` text NOT NULL,
    \`version_prompt\` text NOT NULL,
    \`version_generated_content\` text,
    \`version_slug\` text,
    \`version_template\` text DEFAULT 'editorial',
    \`version_brand_kit_id\` integer,
    \`version_published_at\` text,
    \`version_status\` text DEFAULT 'draft' NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`ai_projects\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_brand_kit_id\`) REFERENCES \`brand_kits\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_parent_idx\` ON \`_ai_projects_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_version_version_owner_idx\` ON \`_ai_projects_v\` (\`version_owner_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_version_version_slug_idx\` ON \`_ai_projects_v\` (\`version_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_version_version_brand_kit_idx\` ON \`_ai_projects_v\` (\`version_brand_kit_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_version_version_updated_at_idx\` ON \`_ai_projects_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_version_version_created_at_idx\` ON \`_ai_projects_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_created_at_idx\` ON \`_ai_projects_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_updated_at_idx\` ON \`_ai_projects_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_ai_projects_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_ai_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_rels_order_idx\` ON \`_ai_projects_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_rels_parent_idx\` ON \`_ai_projects_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_rels_path_idx\` ON \`_ai_projects_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_rels_admins_id_idx\` ON \`_ai_projects_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_projects_v_rels_users_id_idx\` ON \`_ai_projects_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`applications_specialties\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`name\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`applications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`applications_specialties_order_idx\` ON \`applications_specialties\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`applications_specialties_parent_id_idx\` ON \`applications_specialties\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`applications\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`owner_id\` integer NOT NULL,
    \`type\` text NOT NULL,
    \`business_name\` text NOT NULL,
    \`website\` text,
    \`country\` text NOT NULL,
    \`phone\` text NOT NULL,
    \`experience\` text NOT NULL,
    \`status\` text DEFAULT 'submitted',
    \`internal_notes\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`applications_owner_idx\` ON \`applications\` (\`owner_id\`);`)
  await db.run(
    sql`CREATE INDEX \`applications_updated_at_idx\` ON \`applications\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`applications_created_at_idx\` ON \`applications\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`applications_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`applications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`applications_rels_order_idx\` ON \`applications_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`applications_rels_parent_idx\` ON \`applications_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`applications_rels_path_idx\` ON \`applications_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`applications_rels_admins_id_idx\` ON \`applications_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`applications_rels_users_id_idx\` ON \`applications_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_applications_v_version_specialties\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`name\` text NOT NULL,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_applications_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_applications_v_version_specialties_order_idx\` ON \`_applications_v_version_specialties\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_applications_v_version_specialties_parent_id_idx\` ON \`_applications_v_version_specialties\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_applications_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_owner_id\` integer NOT NULL,
    \`version_type\` text NOT NULL,
    \`version_business_name\` text NOT NULL,
    \`version_website\` text,
    \`version_country\` text NOT NULL,
    \`version_phone\` text NOT NULL,
    \`version_experience\` text NOT NULL,
    \`version_status\` text DEFAULT 'submitted',
    \`version_internal_notes\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`applications\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_applications_v_parent_idx\` ON \`_applications_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_applications_v_version_version_owner_idx\` ON \`_applications_v\` (\`version_owner_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_applications_v_version_version_updated_at_idx\` ON \`_applications_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_applications_v_version_version_created_at_idx\` ON \`_applications_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_applications_v_created_at_idx\` ON \`_applications_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_applications_v_updated_at_idx\` ON \`_applications_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_applications_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_applications_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_applications_v_rels_order_idx\` ON \`_applications_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_applications_v_rels_parent_idx\` ON \`_applications_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_applications_v_rels_path_idx\` ON \`_applications_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_applications_v_rels_admins_id_idx\` ON \`_applications_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_applications_v_rels_users_id_idx\` ON \`_applications_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`departures\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`label\` text NOT NULL,
    \`trip_id\` integer NOT NULL,
    \`start_date\` text NOT NULL,
    \`end_date\` text NOT NULL,
    \`capacity\` numeric NOT NULL,
    \`booked\` numeric DEFAULT 0 NOT NULL,
    \`price_override\` numeric,
    \`status\` text DEFAULT 'open' NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`trip_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`departures_trip_idx\` ON \`departures\` (\`trip_id\`);`)
  await db.run(sql`CREATE INDEX \`departures_start_date_idx\` ON \`departures\` (\`start_date\`);`)
  await db.run(sql`CREATE INDEX \`departures_updated_at_idx\` ON \`departures\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`departures_created_at_idx\` ON \`departures\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`departures_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`departures\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`departures_rels_order_idx\` ON \`departures_rels\` (\`order\`);`)
  await db.run(
    sql`CREATE INDEX \`departures_rels_parent_idx\` ON \`departures_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`departures_rels_path_idx\` ON \`departures_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`departures_rels_admins_id_idx\` ON \`departures_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`departures_rels_users_id_idx\` ON \`departures_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_departures_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_label\` text NOT NULL,
    \`version_trip_id\` integer NOT NULL,
    \`version_start_date\` text NOT NULL,
    \`version_end_date\` text NOT NULL,
    \`version_capacity\` numeric NOT NULL,
    \`version_booked\` numeric DEFAULT 0 NOT NULL,
    \`version_price_override\` numeric,
    \`version_status\` text DEFAULT 'open' NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`departures\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_trip_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_departures_v_parent_idx\` ON \`_departures_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_departures_v_version_version_trip_idx\` ON \`_departures_v\` (\`version_trip_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_departures_v_version_version_start_date_idx\` ON \`_departures_v\` (\`version_start_date\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_departures_v_version_version_updated_at_idx\` ON \`_departures_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_departures_v_version_version_created_at_idx\` ON \`_departures_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_departures_v_created_at_idx\` ON \`_departures_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_departures_v_updated_at_idx\` ON \`_departures_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_departures_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_departures_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_departures_v_rels_order_idx\` ON \`_departures_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_departures_v_rels_parent_idx\` ON \`_departures_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_departures_v_rels_path_idx\` ON \`_departures_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_departures_v_rels_admins_id_idx\` ON \`_departures_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_departures_v_rels_users_id_idx\` ON \`_departures_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`saved_trips\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`owner_id\` integer NOT NULL,
    \`trip_id\` integer NOT NULL,
    \`note\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`trip_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`saved_trips_owner_idx\` ON \`saved_trips\` (\`owner_id\`);`)
  await db.run(sql`CREATE INDEX \`saved_trips_trip_idx\` ON \`saved_trips\` (\`trip_id\`);`)
  await db.run(
    sql`CREATE INDEX \`saved_trips_updated_at_idx\` ON \`saved_trips\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`saved_trips_created_at_idx\` ON \`saved_trips\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`owner_trip_idx\` ON \`saved_trips\` (\`owner_id\`,\`trip_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`saved_trips_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`saved_trips\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`saved_trips_rels_order_idx\` ON \`saved_trips_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`saved_trips_rels_parent_idx\` ON \`saved_trips_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`saved_trips_rels_path_idx\` ON \`saved_trips_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`saved_trips_rels_admins_id_idx\` ON \`saved_trips_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`saved_trips_rels_users_id_idx\` ON \`saved_trips_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_saved_trips_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_owner_id\` integer NOT NULL,
    \`version_trip_id\` integer NOT NULL,
    \`version_note\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`saved_trips\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_trip_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_saved_trips_v_parent_idx\` ON \`_saved_trips_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_saved_trips_v_version_version_owner_idx\` ON \`_saved_trips_v\` (\`version_owner_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_saved_trips_v_version_version_trip_idx\` ON \`_saved_trips_v\` (\`version_trip_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_saved_trips_v_version_version_updated_at_idx\` ON \`_saved_trips_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_saved_trips_v_version_version_created_at_idx\` ON \`_saved_trips_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_saved_trips_v_created_at_idx\` ON \`_saved_trips_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_saved_trips_v_updated_at_idx\` ON \`_saved_trips_v\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`version_owner_version_trip_idx\` ON \`_saved_trips_v\` (\`version_owner_id\`,\`version_trip_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_saved_trips_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_saved_trips_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_saved_trips_v_rels_order_idx\` ON \`_saved_trips_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_saved_trips_v_rels_parent_idx\` ON \`_saved_trips_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_saved_trips_v_rels_path_idx\` ON \`_saved_trips_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_saved_trips_v_rels_admins_id_idx\` ON \`_saved_trips_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_saved_trips_v_rels_users_id_idx\` ON \`_saved_trips_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`reviews\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`author_id\` integer NOT NULL,
    \`trip_id\` integer NOT NULL,
    \`order_id\` integer,
    \`title\` text NOT NULL,
    \`body\` text NOT NULL,
    \`rating\` numeric NOT NULL,
    \`status\` text DEFAULT 'pending',
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`trip_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_author_idx\` ON \`reviews\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_trip_idx\` ON \`reviews\` (\`trip_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_order_idx\` ON \`reviews\` (\`order_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_updated_at_idx\` ON \`reviews\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`reviews_created_at_idx\` ON \`reviews\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`reviews_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`reviews\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`reviews_rels_order_idx\` ON \`reviews_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`reviews_rels_parent_idx\` ON \`reviews_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`reviews_rels_path_idx\` ON \`reviews_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`reviews_rels_admins_id_idx\` ON \`reviews_rels\` (\`admins_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`reviews_rels_users_id_idx\` ON \`reviews_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`_reviews_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_author_id\` integer NOT NULL,
    \`version_trip_id\` integer NOT NULL,
    \`version_order_id\` integer,
    \`version_title\` text NOT NULL,
    \`version_body\` text NOT NULL,
    \`version_rating\` numeric NOT NULL,
    \`version_status\` text DEFAULT 'pending',
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`reviews\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_trip_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_reviews_v_parent_idx\` ON \`_reviews_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_reviews_v_version_version_author_idx\` ON \`_reviews_v\` (\`version_author_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reviews_v_version_version_trip_idx\` ON \`_reviews_v\` (\`version_trip_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reviews_v_version_version_order_idx\` ON \`_reviews_v\` (\`version_order_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reviews_v_version_version_updated_at_idx\` ON \`_reviews_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reviews_v_version_version_created_at_idx\` ON \`_reviews_v\` (\`version_created_at\`);`,
  )
  await db.run(sql`CREATE INDEX \`_reviews_v_created_at_idx\` ON \`_reviews_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_reviews_v_updated_at_idx\` ON \`_reviews_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`_reviews_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_reviews_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_reviews_v_rels_order_idx\` ON \`_reviews_v_rels\` (\`order\`);`)
  await db.run(
    sql`CREATE INDEX \`_reviews_v_rels_parent_idx\` ON \`_reviews_v_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`_reviews_v_rels_path_idx\` ON \`_reviews_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_reviews_v_rels_admins_id_idx\` ON \`_reviews_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reviews_v_rels_users_id_idx\` ON \`_reviews_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`support_tickets\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`owner_id\` integer NOT NULL,
    \`order_id\` integer,
    \`subject\` text NOT NULL,
    \`message\` text NOT NULL,
    \`priority\` text DEFAULT 'normal',
    \`status\` text DEFAULT 'open',
    \`internal_notes\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`support_tickets_owner_idx\` ON \`support_tickets\` (\`owner_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`support_tickets_order_idx\` ON \`support_tickets\` (\`order_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`support_tickets_updated_at_idx\` ON \`support_tickets\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`support_tickets_created_at_idx\` ON \`support_tickets\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`support_tickets_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`support_tickets\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`support_tickets_rels_order_idx\` ON \`support_tickets_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`support_tickets_rels_parent_idx\` ON \`support_tickets_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`support_tickets_rels_path_idx\` ON \`support_tickets_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`support_tickets_rels_admins_id_idx\` ON \`support_tickets_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`support_tickets_rels_users_id_idx\` ON \`support_tickets_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_support_tickets_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_owner_id\` integer NOT NULL,
    \`version_order_id\` integer,
    \`version_subject\` text NOT NULL,
    \`version_message\` text NOT NULL,
    \`version_priority\` text DEFAULT 'normal',
    \`version_status\` text DEFAULT 'open',
    \`version_internal_notes\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`support_tickets\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_support_tickets_v_parent_idx\` ON \`_support_tickets_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_support_tickets_v_version_version_owner_idx\` ON \`_support_tickets_v\` (\`version_owner_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_support_tickets_v_version_version_order_idx\` ON \`_support_tickets_v\` (\`version_order_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_support_tickets_v_version_version_updated_at_idx\` ON \`_support_tickets_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_support_tickets_v_version_version_created_at_idx\` ON \`_support_tickets_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_support_tickets_v_created_at_idx\` ON \`_support_tickets_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_support_tickets_v_updated_at_idx\` ON \`_support_tickets_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_support_tickets_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_support_tickets_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_support_tickets_v_rels_order_idx\` ON \`_support_tickets_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_support_tickets_v_rels_parent_idx\` ON \`_support_tickets_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_support_tickets_v_rels_path_idx\` ON \`_support_tickets_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_support_tickets_v_rels_admins_id_idx\` ON \`_support_tickets_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_support_tickets_v_rels_users_id_idx\` ON \`_support_tickets_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`agent_profiles_specialties\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`name\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`agent_profiles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`agent_profiles_specialties_order_idx\` ON \`agent_profiles_specialties\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agent_profiles_specialties_parent_id_idx\` ON \`agent_profiles_specialties\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`agent_profiles\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`owner_id\` integer NOT NULL,
    \`slug\` text NOT NULL,
    \`display_name\` text NOT NULL,
    \`tagline\` text NOT NULL,
    \`bio\` text NOT NULL,
    \`location\` text,
    \`avatar_id\` integer,
    \`status\` text DEFAULT 'draft' NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`agent_profiles_owner_idx\` ON \`agent_profiles\` (\`owner_id\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`agent_profiles_slug_idx\` ON \`agent_profiles\` (\`slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agent_profiles_avatar_idx\` ON \`agent_profiles\` (\`avatar_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agent_profiles_updated_at_idx\` ON \`agent_profiles\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agent_profiles_created_at_idx\` ON \`agent_profiles\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`agent_profiles_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`agent_profiles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`agent_profiles_rels_order_idx\` ON \`agent_profiles_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agent_profiles_rels_parent_idx\` ON \`agent_profiles_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agent_profiles_rels_path_idx\` ON \`agent_profiles_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agent_profiles_rels_admins_id_idx\` ON \`agent_profiles_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`agent_profiles_rels_users_id_idx\` ON \`agent_profiles_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_agent_profiles_v_version_specialties\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`name\` text NOT NULL,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_agent_profiles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_agent_profiles_v_version_specialties_order_idx\` ON \`_agent_profiles_v_version_specialties\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_profiles_v_version_specialties_parent_id_idx\` ON \`_agent_profiles_v_version_specialties\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_agent_profiles_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_owner_id\` integer NOT NULL,
    \`version_slug\` text NOT NULL,
    \`version_display_name\` text NOT NULL,
    \`version_tagline\` text NOT NULL,
    \`version_bio\` text NOT NULL,
    \`version_location\` text,
    \`version_avatar_id\` integer,
    \`version_status\` text DEFAULT 'draft' NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`agent_profiles\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_agent_profiles_v_parent_idx\` ON \`_agent_profiles_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_profiles_v_version_version_owner_idx\` ON \`_agent_profiles_v\` (\`version_owner_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_profiles_v_version_version_slug_idx\` ON \`_agent_profiles_v\` (\`version_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_profiles_v_version_version_avatar_idx\` ON \`_agent_profiles_v\` (\`version_avatar_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_profiles_v_version_version_updated_at_idx\` ON \`_agent_profiles_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_profiles_v_version_version_created_at_idx\` ON \`_agent_profiles_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_profiles_v_created_at_idx\` ON \`_agent_profiles_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_profiles_v_updated_at_idx\` ON \`_agent_profiles_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_agent_profiles_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_agent_profiles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_agent_profiles_v_rels_order_idx\` ON \`_agent_profiles_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_profiles_v_rels_parent_idx\` ON \`_agent_profiles_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_profiles_v_rels_path_idx\` ON \`_agent_profiles_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_profiles_v_rels_admins_id_idx\` ON \`_agent_profiles_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_agent_profiles_v_rels_users_id_idx\` ON \`_agent_profiles_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`reservation_holds\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`departure_id\` integer NOT NULL,
    \`order_id\` integer NOT NULL,
    \`traveler_id\` integer NOT NULL,
    \`agent_id\` integer,
    \`seats\` numeric NOT NULL,
    \`expires_at\` text NOT NULL,
    \`status\` text DEFAULT 'active' NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`departure_id\`) REFERENCES \`departures\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`traveler_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`agent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`reservation_holds_departure_idx\` ON \`reservation_holds\` (\`departure_id\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`reservation_holds_order_idx\` ON \`reservation_holds\` (\`order_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`reservation_holds_traveler_idx\` ON \`reservation_holds\` (\`traveler_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`reservation_holds_agent_idx\` ON \`reservation_holds\` (\`agent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`reservation_holds_expires_at_idx\` ON \`reservation_holds\` (\`expires_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`reservation_holds_updated_at_idx\` ON \`reservation_holds\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`reservation_holds_created_at_idx\` ON \`reservation_holds\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`reservation_holds_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`reservation_holds\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`reservation_holds_rels_order_idx\` ON \`reservation_holds_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`reservation_holds_rels_parent_idx\` ON \`reservation_holds_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`reservation_holds_rels_path_idx\` ON \`reservation_holds_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`reservation_holds_rels_admins_id_idx\` ON \`reservation_holds_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`reservation_holds_rels_users_id_idx\` ON \`reservation_holds_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_reservation_holds_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_departure_id\` integer NOT NULL,
    \`version_order_id\` integer NOT NULL,
    \`version_traveler_id\` integer NOT NULL,
    \`version_agent_id\` integer,
    \`version_seats\` numeric NOT NULL,
    \`version_expires_at\` text NOT NULL,
    \`version_status\` text DEFAULT 'active' NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`reservation_holds\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_departure_id\`) REFERENCES \`departures\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_traveler_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_agent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_reservation_holds_v_parent_idx\` ON \`_reservation_holds_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reservation_holds_v_version_version_departure_idx\` ON \`_reservation_holds_v\` (\`version_departure_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reservation_holds_v_version_version_order_idx\` ON \`_reservation_holds_v\` (\`version_order_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reservation_holds_v_version_version_traveler_idx\` ON \`_reservation_holds_v\` (\`version_traveler_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reservation_holds_v_version_version_agent_idx\` ON \`_reservation_holds_v\` (\`version_agent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reservation_holds_v_version_version_expires_at_idx\` ON \`_reservation_holds_v\` (\`version_expires_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reservation_holds_v_version_version_updated_at_idx\` ON \`_reservation_holds_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reservation_holds_v_version_version_created_at_idx\` ON \`_reservation_holds_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reservation_holds_v_created_at_idx\` ON \`_reservation_holds_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reservation_holds_v_updated_at_idx\` ON \`_reservation_holds_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_reservation_holds_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_reservation_holds_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_reservation_holds_v_rels_order_idx\` ON \`_reservation_holds_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reservation_holds_v_rels_parent_idx\` ON \`_reservation_holds_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reservation_holds_v_rels_path_idx\` ON \`_reservation_holds_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reservation_holds_v_rels_admins_id_idx\` ON \`_reservation_holds_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_reservation_holds_v_rels_users_id_idx\` ON \`_reservation_holds_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`proposals\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`reference\` text NOT NULL,
    \`agent_id\` integer NOT NULL,
    \`traveler_id\` integer,
    \`traveler_name\` text NOT NULL,
    \`traveler_email\` text NOT NULL,
    \`trip_id\` integer NOT NULL,
    \`departure_id\` integer,
    \`travelers\` numeric NOT NULL,
    \`amount\` numeric NOT NULL,
    \`currency\` text NOT NULL,
    \`valid_until\` text NOT NULL,
    \`message\` text NOT NULL,
    \`status\` text DEFAULT 'draft' NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`agent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`traveler_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`trip_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`departure_id\`) REFERENCES \`departures\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`proposals_reference_idx\` ON \`proposals\` (\`reference\`);`,
  )
  await db.run(sql`CREATE INDEX \`proposals_agent_idx\` ON \`proposals\` (\`agent_id\`);`)
  await db.run(sql`CREATE INDEX \`proposals_traveler_idx\` ON \`proposals\` (\`traveler_id\`);`)
  await db.run(sql`CREATE INDEX \`proposals_trip_idx\` ON \`proposals\` (\`trip_id\`);`)
  await db.run(sql`CREATE INDEX \`proposals_departure_idx\` ON \`proposals\` (\`departure_id\`);`)
  await db.run(sql`CREATE INDEX \`proposals_updated_at_idx\` ON \`proposals\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`proposals_created_at_idx\` ON \`proposals\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`proposals_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`proposals\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`proposals_rels_order_idx\` ON \`proposals_rels\` (\`order\`);`)
  await db.run(
    sql`CREATE INDEX \`proposals_rels_parent_idx\` ON \`proposals_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`proposals_rels_path_idx\` ON \`proposals_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`proposals_rels_admins_id_idx\` ON \`proposals_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`proposals_rels_users_id_idx\` ON \`proposals_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_proposals_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_reference\` text NOT NULL,
    \`version_agent_id\` integer NOT NULL,
    \`version_traveler_id\` integer,
    \`version_traveler_name\` text NOT NULL,
    \`version_traveler_email\` text NOT NULL,
    \`version_trip_id\` integer NOT NULL,
    \`version_departure_id\` integer,
    \`version_travelers\` numeric NOT NULL,
    \`version_amount\` numeric NOT NULL,
    \`version_currency\` text NOT NULL,
    \`version_valid_until\` text NOT NULL,
    \`version_message\` text NOT NULL,
    \`version_status\` text DEFAULT 'draft' NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`proposals\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_agent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_traveler_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_trip_id\`) REFERENCES \`trips\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_departure_id\`) REFERENCES \`departures\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_proposals_v_parent_idx\` ON \`_proposals_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_proposals_v_version_version_reference_idx\` ON \`_proposals_v\` (\`version_reference\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_proposals_v_version_version_agent_idx\` ON \`_proposals_v\` (\`version_agent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_proposals_v_version_version_traveler_idx\` ON \`_proposals_v\` (\`version_traveler_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_proposals_v_version_version_trip_idx\` ON \`_proposals_v\` (\`version_trip_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_proposals_v_version_version_departure_idx\` ON \`_proposals_v\` (\`version_departure_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_proposals_v_version_version_updated_at_idx\` ON \`_proposals_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_proposals_v_version_version_created_at_idx\` ON \`_proposals_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_proposals_v_created_at_idx\` ON \`_proposals_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_proposals_v_updated_at_idx\` ON \`_proposals_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_proposals_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_proposals_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_proposals_v_rels_order_idx\` ON \`_proposals_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_proposals_v_rels_parent_idx\` ON \`_proposals_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_proposals_v_rels_path_idx\` ON \`_proposals_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_proposals_v_rels_admins_id_idx\` ON \`_proposals_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_proposals_v_rels_users_id_idx\` ON \`_proposals_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`waitlists\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`traveler_id\` integer NOT NULL,
    \`departure_id\` integer NOT NULL,
    \`travelers\` numeric NOT NULL,
    \`note\` text,
    \`status\` text DEFAULT 'waiting' NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`traveler_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`departure_id\`) REFERENCES \`departures\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`waitlists_traveler_idx\` ON \`waitlists\` (\`traveler_id\`);`)
  await db.run(sql`CREATE INDEX \`waitlists_departure_idx\` ON \`waitlists\` (\`departure_id\`);`)
  await db.run(sql`CREATE INDEX \`waitlists_updated_at_idx\` ON \`waitlists\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`waitlists_created_at_idx\` ON \`waitlists\` (\`created_at\`);`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`traveler_departure_idx\` ON \`waitlists\` (\`traveler_id\`,\`departure_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`waitlists_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`waitlists\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`waitlists_rels_order_idx\` ON \`waitlists_rels\` (\`order\`);`)
  await db.run(
    sql`CREATE INDEX \`waitlists_rels_parent_idx\` ON \`waitlists_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`waitlists_rels_path_idx\` ON \`waitlists_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`waitlists_rels_admins_id_idx\` ON \`waitlists_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`waitlists_rels_users_id_idx\` ON \`waitlists_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_waitlists_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_traveler_id\` integer NOT NULL,
    \`version_departure_id\` integer NOT NULL,
    \`version_travelers\` numeric NOT NULL,
    \`version_note\` text,
    \`version_status\` text DEFAULT 'waiting' NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`waitlists\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_traveler_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_departure_id\`) REFERENCES \`departures\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_waitlists_v_parent_idx\` ON \`_waitlists_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_waitlists_v_version_version_traveler_idx\` ON \`_waitlists_v\` (\`version_traveler_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_waitlists_v_version_version_departure_idx\` ON \`_waitlists_v\` (\`version_departure_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_waitlists_v_version_version_updated_at_idx\` ON \`_waitlists_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_waitlists_v_version_version_created_at_idx\` ON \`_waitlists_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_waitlists_v_created_at_idx\` ON \`_waitlists_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_waitlists_v_updated_at_idx\` ON \`_waitlists_v\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`version_traveler_version_departure_idx\` ON \`_waitlists_v\` (\`version_traveler_id\`,\`version_departure_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_waitlists_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_waitlists_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_waitlists_v_rels_order_idx\` ON \`_waitlists_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_waitlists_v_rels_parent_idx\` ON \`_waitlists_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_waitlists_v_rels_path_idx\` ON \`_waitlists_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_waitlists_v_rels_admins_id_idx\` ON \`_waitlists_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_waitlists_v_rels_users_id_idx\` ON \`_waitlists_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`order_changes\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order_id\` integer NOT NULL,
    \`requester_id\` integer NOT NULL,
    \`type\` text NOT NULL,
    \`details\` text NOT NULL,
    \`status\` text DEFAULT 'requested' NOT NULL,
    \`resolution\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`requester_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`order_changes_order_idx\` ON \`order_changes\` (\`order_id\`);`)
  await db.run(
    sql`CREATE INDEX \`order_changes_requester_idx\` ON \`order_changes\` (\`requester_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`order_changes_updated_at_idx\` ON \`order_changes\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`order_changes_created_at_idx\` ON \`order_changes\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`order_changes_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`order_changes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`order_changes_rels_order_idx\` ON \`order_changes_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`order_changes_rels_parent_idx\` ON \`order_changes_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`order_changes_rels_path_idx\` ON \`order_changes_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`order_changes_rels_admins_id_idx\` ON \`order_changes_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`order_changes_rels_users_id_idx\` ON \`order_changes_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_order_changes_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_order_id\` integer NOT NULL,
    \`version_requester_id\` integer NOT NULL,
    \`version_type\` text NOT NULL,
    \`version_details\` text NOT NULL,
    \`version_status\` text DEFAULT 'requested' NOT NULL,
    \`version_resolution\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`order_changes\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_requester_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_order_changes_v_parent_idx\` ON \`_order_changes_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_order_changes_v_version_version_order_idx\` ON \`_order_changes_v\` (\`version_order_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_order_changes_v_version_version_requester_idx\` ON \`_order_changes_v\` (\`version_requester_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_order_changes_v_version_version_updated_at_idx\` ON \`_order_changes_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_order_changes_v_version_version_created_at_idx\` ON \`_order_changes_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_order_changes_v_created_at_idx\` ON \`_order_changes_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_order_changes_v_updated_at_idx\` ON \`_order_changes_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_order_changes_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_order_changes_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_order_changes_v_rels_order_idx\` ON \`_order_changes_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_order_changes_v_rels_parent_idx\` ON \`_order_changes_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_order_changes_v_rels_path_idx\` ON \`_order_changes_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_order_changes_v_rels_admins_id_idx\` ON \`_order_changes_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_order_changes_v_rels_users_id_idx\` ON \`_order_changes_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`traveler_profiles\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`owner_id\` integer NOT NULL,
    \`full_name\` text NOT NULL,
    \`date_of_birth\` text,
    \`nationality\` text,
    \`passport_last_four\` text,
    \`passport_expiry\` text,
    \`dietary_needs\` text,
    \`accessibility_needs\` text,
    \`emergency_contact_name\` text,
    \`emergency_contact_phone\` text,
    \`emergency_contact_relation\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`traveler_profiles_owner_idx\` ON \`traveler_profiles\` (\`owner_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`traveler_profiles_updated_at_idx\` ON \`traveler_profiles\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`traveler_profiles_created_at_idx\` ON \`traveler_profiles\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`traveler_profiles_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`traveler_profiles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`traveler_profiles_rels_order_idx\` ON \`traveler_profiles_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`traveler_profiles_rels_parent_idx\` ON \`traveler_profiles_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`traveler_profiles_rels_path_idx\` ON \`traveler_profiles_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`traveler_profiles_rels_admins_id_idx\` ON \`traveler_profiles_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`traveler_profiles_rels_users_id_idx\` ON \`traveler_profiles_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_traveler_profiles_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_owner_id\` integer NOT NULL,
    \`version_full_name\` text NOT NULL,
    \`version_date_of_birth\` text,
    \`version_nationality\` text,
    \`version_passport_last_four\` text,
    \`version_passport_expiry\` text,
    \`version_dietary_needs\` text,
    \`version_accessibility_needs\` text,
    \`version_emergency_contact_name\` text,
    \`version_emergency_contact_phone\` text,
    \`version_emergency_contact_relation\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`traveler_profiles\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_traveler_profiles_v_parent_idx\` ON \`_traveler_profiles_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_profiles_v_version_version_owner_idx\` ON \`_traveler_profiles_v\` (\`version_owner_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_profiles_v_version_version_updated_at_idx\` ON \`_traveler_profiles_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_profiles_v_version_version_created_at_idx\` ON \`_traveler_profiles_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_profiles_v_created_at_idx\` ON \`_traveler_profiles_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_profiles_v_updated_at_idx\` ON \`_traveler_profiles_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_traveler_profiles_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_traveler_profiles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_traveler_profiles_v_rels_order_idx\` ON \`_traveler_profiles_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_profiles_v_rels_parent_idx\` ON \`_traveler_profiles_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_profiles_v_rels_path_idx\` ON \`_traveler_profiles_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_profiles_v_rels_admins_id_idx\` ON \`_traveler_profiles_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_profiles_v_rels_users_id_idx\` ON \`_traveler_profiles_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`traveler_files\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`owner_id\` integer NOT NULL,
    \`label\` text NOT NULL,
    \`document_type\` text NOT NULL,
    \`expires_at\` text,
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
    \`original__stored\` integer,
    \`focal_x\` numeric,
    \`focal_y\` numeric,
    FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`traveler_files_owner_idx\` ON \`traveler_files\` (\`owner_id\`);`)
  await db.run(
    sql`CREATE INDEX \`traveler_files_updated_at_idx\` ON \`traveler_files\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`traveler_files_created_at_idx\` ON \`traveler_files\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`traveler_files_filename_idx\` ON \`traveler_files\` (\`filename\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`traveler_files_original_original_filename_idx\` ON \`traveler_files\` (\`original_filename\`);`,
  )
  await db.run(sql`CREATE TABLE \`traveler_files_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`traveler_files\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`traveler_files_rels_order_idx\` ON \`traveler_files_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`traveler_files_rels_parent_idx\` ON \`traveler_files_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`traveler_files_rels_path_idx\` ON \`traveler_files_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`traveler_files_rels_admins_id_idx\` ON \`traveler_files_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`traveler_files_rels_users_id_idx\` ON \`traveler_files_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_traveler_files_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_owner_id\` integer NOT NULL,
    \`version_label\` text NOT NULL,
    \`version_document_type\` text NOT NULL,
    \`version_expires_at\` text,
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
    \`version_focal_x\` numeric,
    \`version_focal_y\` numeric,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`traveler_files\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_traveler_files_v_parent_idx\` ON \`_traveler_files_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_files_v_version_version_owner_idx\` ON \`_traveler_files_v\` (\`version_owner_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_files_v_version_version_updated_at_idx\` ON \`_traveler_files_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_files_v_version_version_created_at_idx\` ON \`_traveler_files_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_files_v_version_version_filename_idx\` ON \`_traveler_files_v\` (\`version_filename\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_files_v_version_original_version_original_file_idx\` ON \`_traveler_files_v\` (\`version_original_filename\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_files_v_created_at_idx\` ON \`_traveler_files_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_files_v_updated_at_idx\` ON \`_traveler_files_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_traveler_files_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_traveler_files_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_traveler_files_v_rels_order_idx\` ON \`_traveler_files_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_files_v_rels_parent_idx\` ON \`_traveler_files_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_files_v_rels_path_idx\` ON \`_traveler_files_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_files_v_rels_admins_id_idx\` ON \`_traveler_files_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_traveler_files_v_rels_users_id_idx\` ON \`_traveler_files_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`conversations\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order_id\` integer NOT NULL,
    \`subject\` text NOT NULL,
    \`status\` text DEFAULT 'open' NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`conversations_order_idx\` ON \`conversations\` (\`order_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`conversations_updated_at_idx\` ON \`conversations\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`conversations_created_at_idx\` ON \`conversations\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`conversations_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`users_id\` integer,
    \`admins_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`conversations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`conversations_rels_order_idx\` ON \`conversations_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`conversations_rels_parent_idx\` ON \`conversations_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`conversations_rels_path_idx\` ON \`conversations_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`conversations_rels_users_id_idx\` ON \`conversations_rels\` (\`users_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`conversations_rels_admins_id_idx\` ON \`conversations_rels\` (\`admins_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_conversations_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_order_id\` integer NOT NULL,
    \`version_subject\` text NOT NULL,
    \`version_status\` text DEFAULT 'open' NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`conversations\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_conversations_v_parent_idx\` ON \`_conversations_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_conversations_v_version_version_order_idx\` ON \`_conversations_v\` (\`version_order_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_conversations_v_version_version_updated_at_idx\` ON \`_conversations_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_conversations_v_version_version_created_at_idx\` ON \`_conversations_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_conversations_v_created_at_idx\` ON \`_conversations_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_conversations_v_updated_at_idx\` ON \`_conversations_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_conversations_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`users_id\` integer,
    \`admins_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_conversations_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_conversations_v_rels_order_idx\` ON \`_conversations_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_conversations_v_rels_parent_idx\` ON \`_conversations_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_conversations_v_rels_path_idx\` ON \`_conversations_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_conversations_v_rels_users_id_idx\` ON \`_conversations_v_rels\` (\`users_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_conversations_v_rels_admins_id_idx\` ON \`_conversations_v_rels\` (\`admins_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`messages\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`conversation_id\` integer NOT NULL,
    \`sender_id\` integer NOT NULL,
    \`body\` text NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`conversation_id\`) REFERENCES \`conversations\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`sender_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`messages_conversation_idx\` ON \`messages\` (\`conversation_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`messages_sender_idx\` ON \`messages\` (\`sender_id\`);`)
  await db.run(sql`CREATE INDEX \`messages_updated_at_idx\` ON \`messages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`messages_created_at_idx\` ON \`messages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`messages_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`users_id\` integer,
    \`admins_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`messages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`messages_rels_order_idx\` ON \`messages_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`messages_rels_parent_idx\` ON \`messages_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`messages_rels_path_idx\` ON \`messages_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`messages_rels_users_id_idx\` ON \`messages_rels\` (\`users_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`messages_rels_admins_id_idx\` ON \`messages_rels\` (\`admins_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_messages_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_conversation_id\` integer NOT NULL,
    \`version_sender_id\` integer NOT NULL,
    \`version_body\` text NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`messages\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_conversation_id\`) REFERENCES \`conversations\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_sender_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_messages_v_parent_idx\` ON \`_messages_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_messages_v_version_version_conversation_idx\` ON \`_messages_v\` (\`version_conversation_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_messages_v_version_version_sender_idx\` ON \`_messages_v\` (\`version_sender_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_messages_v_version_version_updated_at_idx\` ON \`_messages_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_messages_v_version_version_created_at_idx\` ON \`_messages_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_messages_v_created_at_idx\` ON \`_messages_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_messages_v_updated_at_idx\` ON \`_messages_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_messages_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`users_id\` integer,
    \`admins_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_messages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_messages_v_rels_order_idx\` ON \`_messages_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_messages_v_rels_parent_idx\` ON \`_messages_v_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`_messages_v_rels_path_idx\` ON \`_messages_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_messages_v_rels_users_id_idx\` ON \`_messages_v_rels\` (\`users_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_messages_v_rels_admins_id_idx\` ON \`_messages_v_rels\` (\`admins_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`notifications\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`recipient_id\` integer NOT NULL,
    \`type\` text NOT NULL,
    \`title\` text NOT NULL,
    \`body\` text NOT NULL,
    \`href\` text,
    \`scheduled_for\` text,
    \`delivery_status\` text DEFAULT 'in-app' NOT NULL,
    \`attempts\` numeric DEFAULT 0 NOT NULL,
    \`last_error\` text,
    \`next_attempt_at\` text,
    \`read_at\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`recipient_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`notifications_recipient_idx\` ON \`notifications\` (\`recipient_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`notifications_scheduled_for_idx\` ON \`notifications\` (\`scheduled_for\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`notifications_next_attempt_at_idx\` ON \`notifications\` (\`next_attempt_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`notifications_updated_at_idx\` ON \`notifications\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`notifications_created_at_idx\` ON \`notifications\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`notifications_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`notifications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`notifications_rels_order_idx\` ON \`notifications_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`notifications_rels_parent_idx\` ON \`notifications_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`notifications_rels_path_idx\` ON \`notifications_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`notifications_rels_admins_id_idx\` ON \`notifications_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`notifications_rels_users_id_idx\` ON \`notifications_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_notifications_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_recipient_id\` integer NOT NULL,
    \`version_type\` text NOT NULL,
    \`version_title\` text NOT NULL,
    \`version_body\` text NOT NULL,
    \`version_href\` text,
    \`version_scheduled_for\` text,
    \`version_delivery_status\` text DEFAULT 'in-app' NOT NULL,
    \`version_attempts\` numeric DEFAULT 0 NOT NULL,
    \`version_last_error\` text,
    \`version_next_attempt_at\` text,
    \`version_read_at\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`notifications\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_recipient_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_notifications_v_parent_idx\` ON \`_notifications_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_notifications_v_version_version_recipient_idx\` ON \`_notifications_v\` (\`version_recipient_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_notifications_v_version_version_scheduled_for_idx\` ON \`_notifications_v\` (\`version_scheduled_for\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_notifications_v_version_version_next_attempt_at_idx\` ON \`_notifications_v\` (\`version_next_attempt_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_notifications_v_version_version_updated_at_idx\` ON \`_notifications_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_notifications_v_version_version_created_at_idx\` ON \`_notifications_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_notifications_v_created_at_idx\` ON \`_notifications_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_notifications_v_updated_at_idx\` ON \`_notifications_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_notifications_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_notifications_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_notifications_v_rels_order_idx\` ON \`_notifications_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_notifications_v_rels_parent_idx\` ON \`_notifications_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_notifications_v_rels_path_idx\` ON \`_notifications_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_notifications_v_rels_admins_id_idx\` ON \`_notifications_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_notifications_v_rels_users_id_idx\` ON \`_notifications_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`finance_rules_supported_currencies\` (
    \`order\` integer NOT NULL,
    \`parent_id\` integer NOT NULL,
    \`value\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`finance_rules\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`finance_rules_supported_currencies_order_idx\` ON \`finance_rules_supported_currencies\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`finance_rules_supported_currencies_parent_idx\` ON \`finance_rules_supported_currencies\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`finance_rules\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`name\` text NOT NULL,
    \`active\` integer DEFAULT false NOT NULL,
    \`platform_fee_percent\` numeric NOT NULL,
    \`tax_percent\` numeric NOT NULL,
    \`invoice_prefix\` text NOT NULL,
    \`refund_window_days\` numeric NOT NULL,
    \`terms_note\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`finance_rules_active_idx\` ON \`finance_rules\` (\`active\`);`)
  await db.run(
    sql`CREATE INDEX \`finance_rules_updated_at_idx\` ON \`finance_rules\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`finance_rules_created_at_idx\` ON \`finance_rules\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`finance_rules_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`finance_rules\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`finance_rules_rels_order_idx\` ON \`finance_rules_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`finance_rules_rels_parent_idx\` ON \`finance_rules_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`finance_rules_rels_path_idx\` ON \`finance_rules_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`finance_rules_rels_admins_id_idx\` ON \`finance_rules_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`finance_rules_rels_users_id_idx\` ON \`finance_rules_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_finance_rules_v_version_supported_currencies\` (
    \`order\` integer NOT NULL,
    \`parent_id\` integer NOT NULL,
    \`value\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_finance_rules_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_finance_rules_v_version_supported_currencies_order_idx\` ON \`_finance_rules_v_version_supported_currencies\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_finance_rules_v_version_supported_currencies_parent_idx\` ON \`_finance_rules_v_version_supported_currencies\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_finance_rules_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_name\` text NOT NULL,
    \`version_active\` integer DEFAULT false NOT NULL,
    \`version_platform_fee_percent\` numeric NOT NULL,
    \`version_tax_percent\` numeric NOT NULL,
    \`version_invoice_prefix\` text NOT NULL,
    \`version_refund_window_days\` numeric NOT NULL,
    \`version_terms_note\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`finance_rules\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_finance_rules_v_parent_idx\` ON \`_finance_rules_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_finance_rules_v_version_version_active_idx\` ON \`_finance_rules_v\` (\`version_active\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_finance_rules_v_version_version_updated_at_idx\` ON \`_finance_rules_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_finance_rules_v_version_version_created_at_idx\` ON \`_finance_rules_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_finance_rules_v_created_at_idx\` ON \`_finance_rules_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_finance_rules_v_updated_at_idx\` ON \`_finance_rules_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_finance_rules_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_finance_rules_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_finance_rules_v_rels_order_idx\` ON \`_finance_rules_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_finance_rules_v_rels_parent_idx\` ON \`_finance_rules_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_finance_rules_v_rels_path_idx\` ON \`_finance_rules_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_finance_rules_v_rels_admins_id_idx\` ON \`_finance_rules_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_finance_rules_v_rels_users_id_idx\` ON \`_finance_rules_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`payment_accounts\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`type\` text NOT NULL,
    \`user_id\` integer,
    \`agency_id\` integer,
    \`stripe_account_id\` text NOT NULL,
    \`charges_enabled\` integer DEFAULT false,
    \`payouts_enabled\` integer DEFAULT false,
    \`details_submitted\` integer DEFAULT false,
    \`status\` text DEFAULT 'pending' NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`agency_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payment_accounts_user_idx\` ON \`payment_accounts\` (\`user_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payment_accounts_agency_idx\` ON \`payment_accounts\` (\`agency_id\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`payment_accounts_stripe_account_id_idx\` ON \`payment_accounts\` (\`stripe_account_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payment_accounts_updated_at_idx\` ON \`payment_accounts\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payment_accounts_created_at_idx\` ON \`payment_accounts\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`payment_accounts_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`payment_accounts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payment_accounts_rels_order_idx\` ON \`payment_accounts_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payment_accounts_rels_parent_idx\` ON \`payment_accounts_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payment_accounts_rels_path_idx\` ON \`payment_accounts_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payment_accounts_rels_admins_id_idx\` ON \`payment_accounts_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payment_accounts_rels_users_id_idx\` ON \`payment_accounts_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_payment_accounts_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_type\` text NOT NULL,
    \`version_user_id\` integer,
    \`version_agency_id\` integer,
    \`version_stripe_account_id\` text NOT NULL,
    \`version_charges_enabled\` integer DEFAULT false,
    \`version_payouts_enabled\` integer DEFAULT false,
    \`version_details_submitted\` integer DEFAULT false,
    \`version_status\` text DEFAULT 'pending' NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`payment_accounts\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_agency_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_payment_accounts_v_parent_idx\` ON \`_payment_accounts_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payment_accounts_v_version_version_user_idx\` ON \`_payment_accounts_v\` (\`version_user_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payment_accounts_v_version_version_agency_idx\` ON \`_payment_accounts_v\` (\`version_agency_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payment_accounts_v_version_version_stripe_account_id_idx\` ON \`_payment_accounts_v\` (\`version_stripe_account_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payment_accounts_v_version_version_updated_at_idx\` ON \`_payment_accounts_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payment_accounts_v_version_version_created_at_idx\` ON \`_payment_accounts_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payment_accounts_v_created_at_idx\` ON \`_payment_accounts_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payment_accounts_v_updated_at_idx\` ON \`_payment_accounts_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_payment_accounts_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_payment_accounts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_payment_accounts_v_rels_order_idx\` ON \`_payment_accounts_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payment_accounts_v_rels_parent_idx\` ON \`_payment_accounts_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payment_accounts_v_rels_path_idx\` ON \`_payment_accounts_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payment_accounts_v_rels_admins_id_idx\` ON \`_payment_accounts_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payment_accounts_v_rels_users_id_idx\` ON \`_payment_accounts_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`ledger_entries\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order_id\` integer NOT NULL,
    \`user_id\` integer,
    \`agency_id\` integer,
    \`type\` text NOT NULL,
    \`amount\` numeric NOT NULL,
    \`currency\` text NOT NULL,
    \`stripe_transfer_id\` text,
    \`note\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`agency_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`ledger_entries_order_idx\` ON \`ledger_entries\` (\`order_id\`);`)
  await db.run(sql`CREATE INDEX \`ledger_entries_user_idx\` ON \`ledger_entries\` (\`user_id\`);`)
  await db.run(
    sql`CREATE INDEX \`ledger_entries_agency_idx\` ON \`ledger_entries\` (\`agency_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`ledger_entries_stripe_transfer_id_idx\` ON \`ledger_entries\` (\`stripe_transfer_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`ledger_entries_updated_at_idx\` ON \`ledger_entries\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`ledger_entries_created_at_idx\` ON \`ledger_entries\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`ledger_entries_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`ledger_entries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`ledger_entries_rels_order_idx\` ON \`ledger_entries_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`ledger_entries_rels_parent_idx\` ON \`ledger_entries_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`ledger_entries_rels_path_idx\` ON \`ledger_entries_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`ledger_entries_rels_admins_id_idx\` ON \`ledger_entries_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`ledger_entries_rels_users_id_idx\` ON \`ledger_entries_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_ledger_entries_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_order_id\` integer NOT NULL,
    \`version_user_id\` integer,
    \`version_agency_id\` integer,
    \`version_type\` text NOT NULL,
    \`version_amount\` numeric NOT NULL,
    \`version_currency\` text NOT NULL,
    \`version_stripe_transfer_id\` text,
    \`version_note\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`ledger_entries\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_agency_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_ledger_entries_v_parent_idx\` ON \`_ledger_entries_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ledger_entries_v_version_version_order_idx\` ON \`_ledger_entries_v\` (\`version_order_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ledger_entries_v_version_version_user_idx\` ON \`_ledger_entries_v\` (\`version_user_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ledger_entries_v_version_version_agency_idx\` ON \`_ledger_entries_v\` (\`version_agency_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ledger_entries_v_version_version_stripe_transfer_id_idx\` ON \`_ledger_entries_v\` (\`version_stripe_transfer_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ledger_entries_v_version_version_updated_at_idx\` ON \`_ledger_entries_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ledger_entries_v_version_version_created_at_idx\` ON \`_ledger_entries_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ledger_entries_v_created_at_idx\` ON \`_ledger_entries_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ledger_entries_v_updated_at_idx\` ON \`_ledger_entries_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_ledger_entries_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_ledger_entries_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_ledger_entries_v_rels_order_idx\` ON \`_ledger_entries_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ledger_entries_v_rels_parent_idx\` ON \`_ledger_entries_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ledger_entries_v_rels_path_idx\` ON \`_ledger_entries_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ledger_entries_v_rels_admins_id_idx\` ON \`_ledger_entries_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ledger_entries_v_rels_users_id_idx\` ON \`_ledger_entries_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`invoices\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`number\` text NOT NULL,
    \`order_id\` integer NOT NULL,
    \`customer_id\` integer NOT NULL,
    \`subtotal\` numeric NOT NULL,
    \`tax\` numeric NOT NULL,
    \`total\` numeric NOT NULL,
    \`currency\` text NOT NULL,
    \`issued_at\` text NOT NULL,
    \`status\` text NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`invoices_number_idx\` ON \`invoices\` (\`number\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`invoices_order_idx\` ON \`invoices\` (\`order_id\`);`)
  await db.run(sql`CREATE INDEX \`invoices_customer_idx\` ON \`invoices\` (\`customer_id\`);`)
  await db.run(sql`CREATE INDEX \`invoices_updated_at_idx\` ON \`invoices\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`invoices_created_at_idx\` ON \`invoices\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`invoices_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`invoices\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`invoices_rels_order_idx\` ON \`invoices_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`invoices_rels_parent_idx\` ON \`invoices_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`invoices_rels_path_idx\` ON \`invoices_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`invoices_rels_admins_id_idx\` ON \`invoices_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`invoices_rels_users_id_idx\` ON \`invoices_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_invoices_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_number\` text NOT NULL,
    \`version_order_id\` integer NOT NULL,
    \`version_customer_id\` integer NOT NULL,
    \`version_subtotal\` numeric NOT NULL,
    \`version_tax\` numeric NOT NULL,
    \`version_total\` numeric NOT NULL,
    \`version_currency\` text NOT NULL,
    \`version_issued_at\` text NOT NULL,
    \`version_status\` text NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`invoices\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_invoices_v_parent_idx\` ON \`_invoices_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_invoices_v_version_version_number_idx\` ON \`_invoices_v\` (\`version_number\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_invoices_v_version_version_order_idx\` ON \`_invoices_v\` (\`version_order_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_invoices_v_version_version_customer_idx\` ON \`_invoices_v\` (\`version_customer_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_invoices_v_version_version_updated_at_idx\` ON \`_invoices_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_invoices_v_version_version_created_at_idx\` ON \`_invoices_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_invoices_v_created_at_idx\` ON \`_invoices_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_invoices_v_updated_at_idx\` ON \`_invoices_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_invoices_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_invoices_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_invoices_v_rels_order_idx\` ON \`_invoices_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_invoices_v_rels_parent_idx\` ON \`_invoices_v_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`_invoices_v_rels_path_idx\` ON \`_invoices_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_invoices_v_rels_admins_id_idx\` ON \`_invoices_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_invoices_v_rels_users_id_idx\` ON \`_invoices_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`refund_requests\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order_id\` integer NOT NULL,
    \`requester_id\` integer NOT NULL,
    \`amount\` numeric NOT NULL,
    \`reason\` text NOT NULL,
    \`status\` text DEFAULT 'requested' NOT NULL,
    \`stripe_refund_id\` text,
    \`resolution\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`requester_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`refund_requests_order_idx\` ON \`refund_requests\` (\`order_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`refund_requests_requester_idx\` ON \`refund_requests\` (\`requester_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`refund_requests_stripe_refund_id_idx\` ON \`refund_requests\` (\`stripe_refund_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`refund_requests_updated_at_idx\` ON \`refund_requests\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`refund_requests_created_at_idx\` ON \`refund_requests\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`refund_requests_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`refund_requests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`refund_requests_rels_order_idx\` ON \`refund_requests_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`refund_requests_rels_parent_idx\` ON \`refund_requests_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`refund_requests_rels_path_idx\` ON \`refund_requests_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`refund_requests_rels_admins_id_idx\` ON \`refund_requests_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`refund_requests_rels_users_id_idx\` ON \`refund_requests_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_refund_requests_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_order_id\` integer NOT NULL,
    \`version_requester_id\` integer NOT NULL,
    \`version_amount\` numeric NOT NULL,
    \`version_reason\` text NOT NULL,
    \`version_status\` text DEFAULT 'requested' NOT NULL,
    \`version_stripe_refund_id\` text,
    \`version_resolution\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`refund_requests\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_requester_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_refund_requests_v_parent_idx\` ON \`_refund_requests_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_refund_requests_v_version_version_order_idx\` ON \`_refund_requests_v\` (\`version_order_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_refund_requests_v_version_version_requester_idx\` ON \`_refund_requests_v\` (\`version_requester_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_refund_requests_v_version_version_stripe_refund_id_idx\` ON \`_refund_requests_v\` (\`version_stripe_refund_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_refund_requests_v_version_version_updated_at_idx\` ON \`_refund_requests_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_refund_requests_v_version_version_created_at_idx\` ON \`_refund_requests_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_refund_requests_v_created_at_idx\` ON \`_refund_requests_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_refund_requests_v_updated_at_idx\` ON \`_refund_requests_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_refund_requests_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_refund_requests_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_refund_requests_v_rels_order_idx\` ON \`_refund_requests_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_refund_requests_v_rels_parent_idx\` ON \`_refund_requests_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_refund_requests_v_rels_path_idx\` ON \`_refund_requests_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_refund_requests_v_rels_admins_id_idx\` ON \`_refund_requests_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_refund_requests_v_rels_users_id_idx\` ON \`_refund_requests_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`brand_kits\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`owner_id\` integer NOT NULL,
    \`name\` text NOT NULL,
    \`primary_color\` text DEFAULT '#0b2e4a' NOT NULL,
    \`accent_color\` text DEFAULT '#ff654c' NOT NULL,
    \`tone\` text NOT NULL,
    \`logo_id\` integer,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`brand_kits_owner_idx\` ON \`brand_kits\` (\`owner_id\`);`)
  await db.run(sql`CREATE INDEX \`brand_kits_logo_idx\` ON \`brand_kits\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`brand_kits_updated_at_idx\` ON \`brand_kits\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`brand_kits_created_at_idx\` ON \`brand_kits\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`brand_kits_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`brand_kits\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`brand_kits_rels_order_idx\` ON \`brand_kits_rels\` (\`order\`);`)
  await db.run(
    sql`CREATE INDEX \`brand_kits_rels_parent_idx\` ON \`brand_kits_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`brand_kits_rels_path_idx\` ON \`brand_kits_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`brand_kits_rels_admins_id_idx\` ON \`brand_kits_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`brand_kits_rels_users_id_idx\` ON \`brand_kits_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_brand_kits_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_owner_id\` integer NOT NULL,
    \`version_name\` text NOT NULL,
    \`version_primary_color\` text DEFAULT '#0b2e4a' NOT NULL,
    \`version_accent_color\` text DEFAULT '#ff654c' NOT NULL,
    \`version_tone\` text NOT NULL,
    \`version_logo_id\` integer,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`brand_kits\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_brand_kits_v_parent_idx\` ON \`_brand_kits_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_brand_kits_v_version_version_owner_idx\` ON \`_brand_kits_v\` (\`version_owner_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_brand_kits_v_version_version_logo_idx\` ON \`_brand_kits_v\` (\`version_logo_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_brand_kits_v_version_version_updated_at_idx\` ON \`_brand_kits_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_brand_kits_v_version_version_created_at_idx\` ON \`_brand_kits_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_brand_kits_v_created_at_idx\` ON \`_brand_kits_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_brand_kits_v_updated_at_idx\` ON \`_brand_kits_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_brand_kits_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_brand_kits_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_brand_kits_v_rels_order_idx\` ON \`_brand_kits_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_brand_kits_v_rels_parent_idx\` ON \`_brand_kits_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_brand_kits_v_rels_path_idx\` ON \`_brand_kits_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_brand_kits_v_rels_admins_id_idx\` ON \`_brand_kits_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_brand_kits_v_rels_users_id_idx\` ON \`_brand_kits_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`ai_usage\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`owner_id\` integer NOT NULL,
    \`project_id\` integer,
    \`model\` text NOT NULL,
    \`input_tokens\` numeric,
    \`output_tokens\` numeric,
    \`estimated_cost_usd\` numeric,
    \`moderation_flagged\` integer DEFAULT false,
    \`status\` text NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`project_id\`) REFERENCES \`ai_projects\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`ai_usage_owner_idx\` ON \`ai_usage\` (\`owner_id\`);`)
  await db.run(sql`CREATE INDEX \`ai_usage_project_idx\` ON \`ai_usage\` (\`project_id\`);`)
  await db.run(sql`CREATE INDEX \`ai_usage_updated_at_idx\` ON \`ai_usage\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`ai_usage_created_at_idx\` ON \`ai_usage\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`ai_usage_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`ai_usage\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`ai_usage_rels_order_idx\` ON \`ai_usage_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`ai_usage_rels_parent_idx\` ON \`ai_usage_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`ai_usage_rels_path_idx\` ON \`ai_usage_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`ai_usage_rels_admins_id_idx\` ON \`ai_usage_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`ai_usage_rels_users_id_idx\` ON \`ai_usage_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_ai_usage_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_owner_id\` integer NOT NULL,
    \`version_project_id\` integer,
    \`version_model\` text NOT NULL,
    \`version_input_tokens\` numeric,
    \`version_output_tokens\` numeric,
    \`version_estimated_cost_usd\` numeric,
    \`version_moderation_flagged\` integer DEFAULT false,
    \`version_status\` text NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`ai_usage\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_project_id\`) REFERENCES \`ai_projects\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_ai_usage_v_parent_idx\` ON \`_ai_usage_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_ai_usage_v_version_version_owner_idx\` ON \`_ai_usage_v\` (\`version_owner_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_usage_v_version_version_project_idx\` ON \`_ai_usage_v\` (\`version_project_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_usage_v_version_version_updated_at_idx\` ON \`_ai_usage_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_usage_v_version_version_created_at_idx\` ON \`_ai_usage_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_usage_v_created_at_idx\` ON \`_ai_usage_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_usage_v_updated_at_idx\` ON \`_ai_usage_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_ai_usage_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_ai_usage_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_ai_usage_v_rels_order_idx\` ON \`_ai_usage_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_usage_v_rels_parent_idx\` ON \`_ai_usage_v_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`_ai_usage_v_rels_path_idx\` ON \`_ai_usage_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_ai_usage_v_rels_admins_id_idx\` ON \`_ai_usage_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_ai_usage_v_rels_users_id_idx\` ON \`_ai_usage_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`legal_policies\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text NOT NULL,
    \`slug\` text NOT NULL,
    \`summary\` text NOT NULL,
    \`body\` text NOT NULL,
    \`version\` text NOT NULL,
    \`effective_at\` text NOT NULL,
    \`status\` text DEFAULT 'draft' NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`legal_policies_slug_idx\` ON \`legal_policies\` (\`slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`legal_policies_updated_at_idx\` ON \`legal_policies\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`legal_policies_created_at_idx\` ON \`legal_policies\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`legal_policies_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`legal_policies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`legal_policies_rels_order_idx\` ON \`legal_policies_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`legal_policies_rels_parent_idx\` ON \`legal_policies_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`legal_policies_rels_path_idx\` ON \`legal_policies_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`legal_policies_rels_admins_id_idx\` ON \`legal_policies_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`legal_policies_rels_users_id_idx\` ON \`legal_policies_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_legal_policies_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_title\` text NOT NULL,
    \`version_slug\` text NOT NULL,
    \`version_summary\` text NOT NULL,
    \`version_body\` text NOT NULL,
    \`version_version\` text NOT NULL,
    \`version_effective_at\` text NOT NULL,
    \`version_status\` text DEFAULT 'draft' NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`legal_policies\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_legal_policies_v_parent_idx\` ON \`_legal_policies_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_legal_policies_v_version_version_slug_idx\` ON \`_legal_policies_v\` (\`version_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_legal_policies_v_version_version_updated_at_idx\` ON \`_legal_policies_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_legal_policies_v_version_version_created_at_idx\` ON \`_legal_policies_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_legal_policies_v_created_at_idx\` ON \`_legal_policies_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_legal_policies_v_updated_at_idx\` ON \`_legal_policies_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_legal_policies_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_legal_policies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_legal_policies_v_rels_order_idx\` ON \`_legal_policies_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_legal_policies_v_rels_parent_idx\` ON \`_legal_policies_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_legal_policies_v_rels_path_idx\` ON \`_legal_policies_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_legal_policies_v_rels_admins_id_idx\` ON \`_legal_policies_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_legal_policies_v_rels_users_id_idx\` ON \`_legal_policies_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`consents\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`owner_id\` integer NOT NULL,
    \`type\` text NOT NULL,
    \`policy_version\` text NOT NULL,
    \`granted\` integer DEFAULT false NOT NULL,
    \`recorded_at\` text NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`consents_owner_idx\` ON \`consents\` (\`owner_id\`);`)
  await db.run(sql`CREATE INDEX \`consents_updated_at_idx\` ON \`consents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`consents_created_at_idx\` ON \`consents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`consents_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`consents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`consents_rels_order_idx\` ON \`consents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`consents_rels_parent_idx\` ON \`consents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`consents_rels_path_idx\` ON \`consents_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`consents_rels_admins_id_idx\` ON \`consents_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`consents_rels_users_id_idx\` ON \`consents_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_consents_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_owner_id\` integer NOT NULL,
    \`version_type\` text NOT NULL,
    \`version_policy_version\` text NOT NULL,
    \`version_granted\` integer DEFAULT false NOT NULL,
    \`version_recorded_at\` text NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`consents\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_consents_v_parent_idx\` ON \`_consents_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_consents_v_version_version_owner_idx\` ON \`_consents_v\` (\`version_owner_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_consents_v_version_version_updated_at_idx\` ON \`_consents_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_consents_v_version_version_created_at_idx\` ON \`_consents_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_consents_v_created_at_idx\` ON \`_consents_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_consents_v_updated_at_idx\` ON \`_consents_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_consents_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_consents_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_consents_v_rels_order_idx\` ON \`_consents_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_consents_v_rels_parent_idx\` ON \`_consents_v_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`_consents_v_rels_path_idx\` ON \`_consents_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_consents_v_rels_admins_id_idx\` ON \`_consents_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_consents_v_rels_users_id_idx\` ON \`_consents_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`data_requests\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`owner_id\` integer NOT NULL,
    \`type\` text NOT NULL,
    \`reason\` text,
    \`status\` text DEFAULT 'requested' NOT NULL,
    \`completed_at\` text,
    \`resolution\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`data_requests_owner_idx\` ON \`data_requests\` (\`owner_id\`);`)
  await db.run(
    sql`CREATE INDEX \`data_requests_updated_at_idx\` ON \`data_requests\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`data_requests_created_at_idx\` ON \`data_requests\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`data_requests_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`data_requests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`data_requests_rels_order_idx\` ON \`data_requests_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`data_requests_rels_parent_idx\` ON \`data_requests_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`data_requests_rels_path_idx\` ON \`data_requests_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`data_requests_rels_admins_id_idx\` ON \`data_requests_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`data_requests_rels_users_id_idx\` ON \`data_requests_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_data_requests_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_owner_id\` integer NOT NULL,
    \`version_type\` text NOT NULL,
    \`version_reason\` text,
    \`version_status\` text DEFAULT 'requested' NOT NULL,
    \`version_completed_at\` text,
    \`version_resolution\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`data_requests\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_data_requests_v_parent_idx\` ON \`_data_requests_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_data_requests_v_version_version_owner_idx\` ON \`_data_requests_v\` (\`version_owner_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_data_requests_v_version_version_updated_at_idx\` ON \`_data_requests_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_data_requests_v_version_version_created_at_idx\` ON \`_data_requests_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_data_requests_v_created_at_idx\` ON \`_data_requests_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_data_requests_v_updated_at_idx\` ON \`_data_requests_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_data_requests_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_data_requests_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_data_requests_v_rels_order_idx\` ON \`_data_requests_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_data_requests_v_rels_parent_idx\` ON \`_data_requests_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_data_requests_v_rels_path_idx\` ON \`_data_requests_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_data_requests_v_rels_admins_id_idx\` ON \`_data_requests_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_data_requests_v_rels_users_id_idx\` ON \`_data_requests_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`audit_logs\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`action\` text NOT NULL,
    \`collection_name\` text NOT NULL,
    \`document_id\` text,
    \`metadata\` text,
    \`ip_hash\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`audit_logs_action_idx\` ON \`audit_logs\` (\`action\`);`)
  await db.run(sql`CREATE INDEX \`audit_logs_updated_at_idx\` ON \`audit_logs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`audit_logs_created_at_idx\` ON \`audit_logs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`audit_logs_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`audit_logs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`audit_logs_rels_order_idx\` ON \`audit_logs_rels\` (\`order\`);`)
  await db.run(
    sql`CREATE INDEX \`audit_logs_rels_parent_idx\` ON \`audit_logs_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`audit_logs_rels_path_idx\` ON \`audit_logs_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`audit_logs_rels_admins_id_idx\` ON \`audit_logs_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`audit_logs_rels_users_id_idx\` ON \`audit_logs_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_audit_logs_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_action\` text NOT NULL,
    \`version_collection_name\` text NOT NULL,
    \`version_document_id\` text,
    \`version_metadata\` text,
    \`version_ip_hash\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`audit_logs\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_audit_logs_v_parent_idx\` ON \`_audit_logs_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_audit_logs_v_version_version_action_idx\` ON \`_audit_logs_v\` (\`version_action\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_audit_logs_v_version_version_updated_at_idx\` ON \`_audit_logs_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_audit_logs_v_version_version_created_at_idx\` ON \`_audit_logs_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_audit_logs_v_created_at_idx\` ON \`_audit_logs_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_audit_logs_v_updated_at_idx\` ON \`_audit_logs_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_audit_logs_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_audit_logs_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_audit_logs_v_rels_order_idx\` ON \`_audit_logs_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_audit_logs_v_rels_parent_idx\` ON \`_audit_logs_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_audit_logs_v_rels_path_idx\` ON \`_audit_logs_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_audit_logs_v_rels_admins_id_idx\` ON \`_audit_logs_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_audit_logs_v_rels_users_id_idx\` ON \`_audit_logs_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`security_events\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`type\` text NOT NULL,
    \`severity\` text NOT NULL,
    \`user_id\` integer,
    \`route\` text,
    \`details\` text,
    \`resolved_at\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`security_events_type_idx\` ON \`security_events\` (\`type\`);`)
  await db.run(sql`CREATE INDEX \`security_events_user_idx\` ON \`security_events\` (\`user_id\`);`)
  await db.run(
    sql`CREATE INDEX \`security_events_updated_at_idx\` ON \`security_events\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`security_events_created_at_idx\` ON \`security_events\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`security_events_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`security_events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`security_events_rels_order_idx\` ON \`security_events_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`security_events_rels_parent_idx\` ON \`security_events_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`security_events_rels_path_idx\` ON \`security_events_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`security_events_rels_admins_id_idx\` ON \`security_events_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`security_events_rels_users_id_idx\` ON \`security_events_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_security_events_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_type\` text NOT NULL,
    \`version_severity\` text NOT NULL,
    \`version_user_id\` integer,
    \`version_route\` text,
    \`version_details\` text,
    \`version_resolved_at\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`security_events\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_security_events_v_parent_idx\` ON \`_security_events_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_security_events_v_version_version_type_idx\` ON \`_security_events_v\` (\`version_type\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_security_events_v_version_version_user_idx\` ON \`_security_events_v\` (\`version_user_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_security_events_v_version_version_updated_at_idx\` ON \`_security_events_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_security_events_v_version_version_created_at_idx\` ON \`_security_events_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_security_events_v_created_at_idx\` ON \`_security_events_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_security_events_v_updated_at_idx\` ON \`_security_events_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_security_events_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_security_events_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_security_events_v_rels_order_idx\` ON \`_security_events_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_security_events_v_rels_parent_idx\` ON \`_security_events_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_security_events_v_rels_path_idx\` ON \`_security_events_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_security_events_v_rels_admins_id_idx\` ON \`_security_events_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_security_events_v_rels_users_id_idx\` ON \`_security_events_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`rate_limits\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`key\` text NOT NULL,
    \`count\` numeric DEFAULT 1 NOT NULL,
    \`window_started_at\` text NOT NULL,
    \`expires_at\` text NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`rate_limits_key_idx\` ON \`rate_limits\` (\`key\`);`)
  await db.run(
    sql`CREATE INDEX \`rate_limits_expires_at_idx\` ON \`rate_limits\` (\`expires_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`rate_limits_updated_at_idx\` ON \`rate_limits\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`rate_limits_created_at_idx\` ON \`rate_limits\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`rate_limits_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`rate_limits\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`rate_limits_rels_order_idx\` ON \`rate_limits_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`rate_limits_rels_parent_idx\` ON \`rate_limits_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`rate_limits_rels_path_idx\` ON \`rate_limits_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`rate_limits_rels_admins_id_idx\` ON \`rate_limits_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`rate_limits_rels_users_id_idx\` ON \`rate_limits_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_rate_limits_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_key\` text NOT NULL,
    \`version_count\` numeric DEFAULT 1 NOT NULL,
    \`version_window_started_at\` text NOT NULL,
    \`version_expires_at\` text NOT NULL,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`rate_limits\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_rate_limits_v_parent_idx\` ON \`_rate_limits_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_rate_limits_v_version_version_key_idx\` ON \`_rate_limits_v\` (\`version_key\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_rate_limits_v_version_version_expires_at_idx\` ON \`_rate_limits_v\` (\`version_expires_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_rate_limits_v_version_version_updated_at_idx\` ON \`_rate_limits_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_rate_limits_v_version_version_created_at_idx\` ON \`_rate_limits_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_rate_limits_v_created_at_idx\` ON \`_rate_limits_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_rate_limits_v_updated_at_idx\` ON \`_rate_limits_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_rate_limits_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_rate_limits_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_rate_limits_v_rels_order_idx\` ON \`_rate_limits_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_rate_limits_v_rels_parent_idx\` ON \`_rate_limits_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_rate_limits_v_rels_path_idx\` ON \`_rate_limits_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_rate_limits_v_rels_admins_id_idx\` ON \`_rate_limits_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_rate_limits_v_rels_users_id_idx\` ON \`_rate_limits_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`payout_statements\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`user_id\` integer,
    \`agency_id\` integer,
    \`stripe_payout_id\` text NOT NULL,
    \`amount\` numeric NOT NULL,
    \`currency\` text NOT NULL,
    \`arrival_date\` text NOT NULL,
    \`status\` text NOT NULL,
    \`failure_message\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`agency_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payout_statements_user_idx\` ON \`payout_statements\` (\`user_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payout_statements_agency_idx\` ON \`payout_statements\` (\`agency_id\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`payout_statements_stripe_payout_id_idx\` ON \`payout_statements\` (\`stripe_payout_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payout_statements_updated_at_idx\` ON \`payout_statements\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payout_statements_created_at_idx\` ON \`payout_statements\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`payout_statements_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`payout_statements\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payout_statements_rels_order_idx\` ON \`payout_statements_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payout_statements_rels_parent_idx\` ON \`payout_statements_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payout_statements_rels_path_idx\` ON \`payout_statements_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payout_statements_rels_admins_id_idx\` ON \`payout_statements_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payout_statements_rels_users_id_idx\` ON \`payout_statements_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_payout_statements_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_user_id\` integer,
    \`version_agency_id\` integer,
    \`version_stripe_payout_id\` text NOT NULL,
    \`version_amount\` numeric NOT NULL,
    \`version_currency\` text NOT NULL,
    \`version_arrival_date\` text NOT NULL,
    \`version_status\` text NOT NULL,
    \`version_failure_message\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`payout_statements\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_agency_id\`) REFERENCES \`agencies\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_payout_statements_v_parent_idx\` ON \`_payout_statements_v\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payout_statements_v_version_version_user_idx\` ON \`_payout_statements_v\` (\`version_user_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payout_statements_v_version_version_agency_idx\` ON \`_payout_statements_v\` (\`version_agency_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payout_statements_v_version_version_stripe_payout_id_idx\` ON \`_payout_statements_v\` (\`version_stripe_payout_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payout_statements_v_version_version_updated_at_idx\` ON \`_payout_statements_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payout_statements_v_version_version_created_at_idx\` ON \`_payout_statements_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payout_statements_v_created_at_idx\` ON \`_payout_statements_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payout_statements_v_updated_at_idx\` ON \`_payout_statements_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_payout_statements_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_payout_statements_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_payout_statements_v_rels_order_idx\` ON \`_payout_statements_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payout_statements_v_rels_parent_idx\` ON \`_payout_statements_v_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payout_statements_v_rels_path_idx\` ON \`_payout_statements_v_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payout_statements_v_rels_admins_id_idx\` ON \`_payout_statements_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_payout_statements_v_rels_users_id_idx\` ON \`_payout_statements_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`disputes\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order_id\` integer NOT NULL,
    \`customer_id\` integer NOT NULL,
    \`stripe_dispute_id\` text NOT NULL,
    \`amount\` numeric NOT NULL,
    \`currency\` text NOT NULL,
    \`reason\` text,
    \`status\` text NOT NULL,
    \`evidence_due_at\` text,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`disputes_order_idx\` ON \`disputes\` (\`order_id\`);`)
  await db.run(sql`CREATE INDEX \`disputes_customer_idx\` ON \`disputes\` (\`customer_id\`);`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`disputes_stripe_dispute_id_idx\` ON \`disputes\` (\`stripe_dispute_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`disputes_updated_at_idx\` ON \`disputes\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`disputes_created_at_idx\` ON \`disputes\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`disputes_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`disputes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`disputes_rels_order_idx\` ON \`disputes_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`disputes_rels_parent_idx\` ON \`disputes_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`disputes_rels_path_idx\` ON \`disputes_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`disputes_rels_admins_id_idx\` ON \`disputes_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`disputes_rels_users_id_idx\` ON \`disputes_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_disputes_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_order_id\` integer NOT NULL,
    \`version_customer_id\` integer NOT NULL,
    \`version_stripe_dispute_id\` text NOT NULL,
    \`version_amount\` numeric NOT NULL,
    \`version_currency\` text NOT NULL,
    \`version_reason\` text,
    \`version_status\` text NOT NULL,
    \`version_evidence_due_at\` text,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`disputes\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_disputes_v_parent_idx\` ON \`_disputes_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_disputes_v_version_version_order_idx\` ON \`_disputes_v\` (\`version_order_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_disputes_v_version_version_customer_idx\` ON \`_disputes_v\` (\`version_customer_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_disputes_v_version_version_stripe_dispute_id_idx\` ON \`_disputes_v\` (\`version_stripe_dispute_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_disputes_v_version_version_updated_at_idx\` ON \`_disputes_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_disputes_v_version_version_created_at_idx\` ON \`_disputes_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_disputes_v_created_at_idx\` ON \`_disputes_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_disputes_v_updated_at_idx\` ON \`_disputes_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_disputes_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`admins_id\` integer,
    \`users_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_disputes_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`admins_id\`) REFERENCES \`admins\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_disputes_v_rels_order_idx\` ON \`_disputes_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_disputes_v_rels_parent_idx\` ON \`_disputes_v_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`_disputes_v_rels_path_idx\` ON \`_disputes_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_disputes_v_rels_admins_id_idx\` ON \`_disputes_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_disputes_v_rels_users_id_idx\` ON \`_disputes_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`media\` ADD \`owner_id\` integer REFERENCES users(id);`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`_h_folders_id\` integer REFERENCES folders(id);`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`focal_x\` numeric;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`focal_y\` numeric;`)
  await db.run(sql`CREATE INDEX \`media_owner_idx\` ON \`media\` (\`owner_id\`);`)
  await db.run(sql`CREATE INDEX \`media__h_folders_idx\` ON \`media\` (\`_h_folders_id\`);`)
  await db.run(sql`ALTER TABLE \`media_rels\` ADD \`tags_id\` integer REFERENCES tags(id);`)
  await db.run(sql`CREATE INDEX \`media_rels_tags_id_idx\` ON \`media_rels\` (\`tags_id\`);`)
  await db.run(sql`ALTER TABLE \`_media_v\` ADD \`version_owner_id\` integer REFERENCES users(id);`)
  await db.run(
    sql`ALTER TABLE \`_media_v\` ADD \`version__h_folders_id\` integer REFERENCES folders(id);`,
  )
  await db.run(sql`ALTER TABLE \`_media_v\` ADD \`version_focal_x\` numeric;`)
  await db.run(sql`ALTER TABLE \`_media_v\` ADD \`version_focal_y\` numeric;`)
  await db.run(
    sql`CREATE INDEX \`_media_v_version_version_owner_idx\` ON \`_media_v\` (\`version_owner_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_media_v_version_version__h_folders_idx\` ON \`_media_v\` (\`version__h_folders_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`_media_v_rels\` ADD \`tags_id\` integer REFERENCES tags(id);`)
  await db.run(sql`CREATE INDEX \`_media_v_rels_tags_id_idx\` ON \`_media_v_rels\` (\`tags_id\`);`)
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`folders_id\` integer REFERENCES folders(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`tags_id\` integer REFERENCES tags(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`agencies_id\` integer REFERENCES agencies(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`trips_id\` integer REFERENCES trips(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`agent_listings_id\` integer REFERENCES agent_listings(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`booking_requests_id\` integer REFERENCES booking_requests(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`agency_memberships_id\` integer REFERENCES agency_memberships(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`orders_id\` integer REFERENCES orders(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`ai_projects_id\` integer REFERENCES ai_projects(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`applications_id\` integer REFERENCES applications(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`departures_id\` integer REFERENCES departures(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`saved_trips_id\` integer REFERENCES saved_trips(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`reviews_id\` integer REFERENCES reviews(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`support_tickets_id\` integer REFERENCES support_tickets(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`agent_profiles_id\` integer REFERENCES agent_profiles(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`reservation_holds_id\` integer REFERENCES reservation_holds(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`proposals_id\` integer REFERENCES proposals(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`waitlists_id\` integer REFERENCES waitlists(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`order_changes_id\` integer REFERENCES order_changes(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`traveler_profiles_id\` integer REFERENCES traveler_profiles(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`traveler_files_id\` integer REFERENCES traveler_files(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`conversations_id\` integer REFERENCES conversations(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`messages_id\` integer REFERENCES messages(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`notifications_id\` integer REFERENCES notifications(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`finance_rules_id\` integer REFERENCES finance_rules(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`payment_accounts_id\` integer REFERENCES payment_accounts(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`ledger_entries_id\` integer REFERENCES ledger_entries(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`invoices_id\` integer REFERENCES invoices(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`refund_requests_id\` integer REFERENCES refund_requests(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`brand_kits_id\` integer REFERENCES brand_kits(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`ai_usage_id\` integer REFERENCES ai_usage(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`legal_policies_id\` integer REFERENCES legal_policies(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`consents_id\` integer REFERENCES consents(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`data_requests_id\` integer REFERENCES data_requests(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`audit_logs_id\` integer REFERENCES audit_logs(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`security_events_id\` integer REFERENCES security_events(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`rate_limits_id\` integer REFERENCES rate_limits(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`payout_statements_id\` integer REFERENCES payout_statements(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`disputes_id\` integer REFERENCES disputes(id);`,
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

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`folders\`;`)
  await db.run(sql`DROP TABLE \`folders_rels\`;`)
  await db.run(sql`DROP TABLE \`_folders_v\`;`)
  await db.run(sql`DROP TABLE \`_folders_v_rels\`;`)
  await db.run(sql`DROP TABLE \`tags\`;`)
  await db.run(sql`DROP TABLE \`tags_rels\`;`)
  await db.run(sql`DROP TABLE \`_tags_v\`;`)
  await db.run(sql`DROP TABLE \`_tags_v_rels\`;`)
  await db.run(sql`DROP TABLE \`agencies_languages\`;`)
  await db.run(sql`DROP TABLE \`agencies_licenses\`;`)
  await db.run(sql`DROP TABLE \`agencies\`;`)
  await db.run(sql`DROP TABLE \`agencies_rels\`;`)
  await db.run(sql`DROP TABLE \`_agencies_v_version_languages\`;`)
  await db.run(sql`DROP TABLE \`_agencies_v_version_licenses\`;`)
  await db.run(sql`DROP TABLE \`_agencies_v\`;`)
  await db.run(sql`DROP TABLE \`_agencies_v_rels\`;`)
  await db.run(sql`DROP TABLE \`trips_highlights\`;`)
  await db.run(sql`DROP TABLE \`trips_itinerary\`;`)
  await db.run(sql`DROP TABLE \`trips_inclusions\`;`)
  await db.run(sql`DROP TABLE \`trips_exclusions\`;`)
  await db.run(sql`DROP TABLE \`trips\`;`)
  await db.run(sql`DROP TABLE \`trips_rels\`;`)
  await db.run(sql`DROP TABLE \`_trips_v_version_highlights\`;`)
  await db.run(sql`DROP TABLE \`_trips_v_version_itinerary\`;`)
  await db.run(sql`DROP TABLE \`_trips_v_version_inclusions\`;`)
  await db.run(sql`DROP TABLE \`_trips_v_version_exclusions\`;`)
  await db.run(sql`DROP TABLE \`_trips_v\`;`)
  await db.run(sql`DROP TABLE \`_trips_v_rels\`;`)
  await db.run(sql`DROP TABLE \`agent_listings\`;`)
  await db.run(sql`DROP TABLE \`agent_listings_rels\`;`)
  await db.run(sql`DROP TABLE \`_agent_listings_v\`;`)
  await db.run(sql`DROP TABLE \`_agent_listings_v_rels\`;`)
  await db.run(sql`DROP TABLE \`booking_requests\`;`)
  await db.run(sql`DROP TABLE \`booking_requests_rels\`;`)
  await db.run(sql`DROP TABLE \`_booking_requests_v\`;`)
  await db.run(sql`DROP TABLE \`_booking_requests_v_rels\`;`)
  await db.run(sql`DROP TABLE \`agency_memberships\`;`)
  await db.run(sql`DROP TABLE \`agency_memberships_rels\`;`)
  await db.run(sql`DROP TABLE \`_agency_memberships_v\`;`)
  await db.run(sql`DROP TABLE \`_agency_memberships_v_rels\`;`)
  await db.run(sql`DROP TABLE \`orders\`;`)
  await db.run(sql`DROP TABLE \`orders_rels\`;`)
  await db.run(sql`DROP TABLE \`_orders_v\`;`)
  await db.run(sql`DROP TABLE \`_orders_v_rels\`;`)
  await db.run(sql`DROP TABLE \`ai_projects_sections\`;`)
  await db.run(sql`DROP TABLE \`ai_projects_versions\`;`)
  await db.run(sql`DROP TABLE \`ai_projects\`;`)
  await db.run(sql`DROP TABLE \`ai_projects_rels\`;`)
  await db.run(sql`DROP TABLE \`_ai_projects_v_version_sections\`;`)
  await db.run(sql`DROP TABLE \`_ai_projects_v_version_versions\`;`)
  await db.run(sql`DROP TABLE \`_ai_projects_v\`;`)
  await db.run(sql`DROP TABLE \`_ai_projects_v_rels\`;`)
  await db.run(sql`DROP TABLE \`applications_specialties\`;`)
  await db.run(sql`DROP TABLE \`applications\`;`)
  await db.run(sql`DROP TABLE \`applications_rels\`;`)
  await db.run(sql`DROP TABLE \`_applications_v_version_specialties\`;`)
  await db.run(sql`DROP TABLE \`_applications_v\`;`)
  await db.run(sql`DROP TABLE \`_applications_v_rels\`;`)
  await db.run(sql`DROP TABLE \`departures\`;`)
  await db.run(sql`DROP TABLE \`departures_rels\`;`)
  await db.run(sql`DROP TABLE \`_departures_v\`;`)
  await db.run(sql`DROP TABLE \`_departures_v_rels\`;`)
  await db.run(sql`DROP TABLE \`saved_trips\`;`)
  await db.run(sql`DROP TABLE \`saved_trips_rels\`;`)
  await db.run(sql`DROP TABLE \`_saved_trips_v\`;`)
  await db.run(sql`DROP TABLE \`_saved_trips_v_rels\`;`)
  await db.run(sql`DROP TABLE \`reviews\`;`)
  await db.run(sql`DROP TABLE \`reviews_rels\`;`)
  await db.run(sql`DROP TABLE \`_reviews_v\`;`)
  await db.run(sql`DROP TABLE \`_reviews_v_rels\`;`)
  await db.run(sql`DROP TABLE \`support_tickets\`;`)
  await db.run(sql`DROP TABLE \`support_tickets_rels\`;`)
  await db.run(sql`DROP TABLE \`_support_tickets_v\`;`)
  await db.run(sql`DROP TABLE \`_support_tickets_v_rels\`;`)
  await db.run(sql`DROP TABLE \`agent_profiles_specialties\`;`)
  await db.run(sql`DROP TABLE \`agent_profiles\`;`)
  await db.run(sql`DROP TABLE \`agent_profiles_rels\`;`)
  await db.run(sql`DROP TABLE \`_agent_profiles_v_version_specialties\`;`)
  await db.run(sql`DROP TABLE \`_agent_profiles_v\`;`)
  await db.run(sql`DROP TABLE \`_agent_profiles_v_rels\`;`)
  await db.run(sql`DROP TABLE \`reservation_holds\`;`)
  await db.run(sql`DROP TABLE \`reservation_holds_rels\`;`)
  await db.run(sql`DROP TABLE \`_reservation_holds_v\`;`)
  await db.run(sql`DROP TABLE \`_reservation_holds_v_rels\`;`)
  await db.run(sql`DROP TABLE \`proposals\`;`)
  await db.run(sql`DROP TABLE \`proposals_rels\`;`)
  await db.run(sql`DROP TABLE \`_proposals_v\`;`)
  await db.run(sql`DROP TABLE \`_proposals_v_rels\`;`)
  await db.run(sql`DROP TABLE \`waitlists\`;`)
  await db.run(sql`DROP TABLE \`waitlists_rels\`;`)
  await db.run(sql`DROP TABLE \`_waitlists_v\`;`)
  await db.run(sql`DROP TABLE \`_waitlists_v_rels\`;`)
  await db.run(sql`DROP TABLE \`order_changes\`;`)
  await db.run(sql`DROP TABLE \`order_changes_rels\`;`)
  await db.run(sql`DROP TABLE \`_order_changes_v\`;`)
  await db.run(sql`DROP TABLE \`_order_changes_v_rels\`;`)
  await db.run(sql`DROP TABLE \`traveler_profiles\`;`)
  await db.run(sql`DROP TABLE \`traveler_profiles_rels\`;`)
  await db.run(sql`DROP TABLE \`_traveler_profiles_v\`;`)
  await db.run(sql`DROP TABLE \`_traveler_profiles_v_rels\`;`)
  await db.run(sql`DROP TABLE \`traveler_files\`;`)
  await db.run(sql`DROP TABLE \`traveler_files_rels\`;`)
  await db.run(sql`DROP TABLE \`_traveler_files_v\`;`)
  await db.run(sql`DROP TABLE \`_traveler_files_v_rels\`;`)
  await db.run(sql`DROP TABLE \`conversations\`;`)
  await db.run(sql`DROP TABLE \`conversations_rels\`;`)
  await db.run(sql`DROP TABLE \`_conversations_v\`;`)
  await db.run(sql`DROP TABLE \`_conversations_v_rels\`;`)
  await db.run(sql`DROP TABLE \`messages\`;`)
  await db.run(sql`DROP TABLE \`messages_rels\`;`)
  await db.run(sql`DROP TABLE \`_messages_v\`;`)
  await db.run(sql`DROP TABLE \`_messages_v_rels\`;`)
  await db.run(sql`DROP TABLE \`notifications\`;`)
  await db.run(sql`DROP TABLE \`notifications_rels\`;`)
  await db.run(sql`DROP TABLE \`_notifications_v\`;`)
  await db.run(sql`DROP TABLE \`_notifications_v_rels\`;`)
  await db.run(sql`DROP TABLE \`finance_rules_supported_currencies\`;`)
  await db.run(sql`DROP TABLE \`finance_rules\`;`)
  await db.run(sql`DROP TABLE \`finance_rules_rels\`;`)
  await db.run(sql`DROP TABLE \`_finance_rules_v_version_supported_currencies\`;`)
  await db.run(sql`DROP TABLE \`_finance_rules_v\`;`)
  await db.run(sql`DROP TABLE \`_finance_rules_v_rels\`;`)
  await db.run(sql`DROP TABLE \`payment_accounts\`;`)
  await db.run(sql`DROP TABLE \`payment_accounts_rels\`;`)
  await db.run(sql`DROP TABLE \`_payment_accounts_v\`;`)
  await db.run(sql`DROP TABLE \`_payment_accounts_v_rels\`;`)
  await db.run(sql`DROP TABLE \`ledger_entries\`;`)
  await db.run(sql`DROP TABLE \`ledger_entries_rels\`;`)
  await db.run(sql`DROP TABLE \`_ledger_entries_v\`;`)
  await db.run(sql`DROP TABLE \`_ledger_entries_v_rels\`;`)
  await db.run(sql`DROP TABLE \`invoices\`;`)
  await db.run(sql`DROP TABLE \`invoices_rels\`;`)
  await db.run(sql`DROP TABLE \`_invoices_v\`;`)
  await db.run(sql`DROP TABLE \`_invoices_v_rels\`;`)
  await db.run(sql`DROP TABLE \`refund_requests\`;`)
  await db.run(sql`DROP TABLE \`refund_requests_rels\`;`)
  await db.run(sql`DROP TABLE \`_refund_requests_v\`;`)
  await db.run(sql`DROP TABLE \`_refund_requests_v_rels\`;`)
  await db.run(sql`DROP TABLE \`brand_kits\`;`)
  await db.run(sql`DROP TABLE \`brand_kits_rels\`;`)
  await db.run(sql`DROP TABLE \`_brand_kits_v\`;`)
  await db.run(sql`DROP TABLE \`_brand_kits_v_rels\`;`)
  await db.run(sql`DROP TABLE \`ai_usage\`;`)
  await db.run(sql`DROP TABLE \`ai_usage_rels\`;`)
  await db.run(sql`DROP TABLE \`_ai_usage_v\`;`)
  await db.run(sql`DROP TABLE \`_ai_usage_v_rels\`;`)
  await db.run(sql`DROP TABLE \`legal_policies\`;`)
  await db.run(sql`DROP TABLE \`legal_policies_rels\`;`)
  await db.run(sql`DROP TABLE \`_legal_policies_v\`;`)
  await db.run(sql`DROP TABLE \`_legal_policies_v_rels\`;`)
  await db.run(sql`DROP TABLE \`consents\`;`)
  await db.run(sql`DROP TABLE \`consents_rels\`;`)
  await db.run(sql`DROP TABLE \`_consents_v\`;`)
  await db.run(sql`DROP TABLE \`_consents_v_rels\`;`)
  await db.run(sql`DROP TABLE \`data_requests\`;`)
  await db.run(sql`DROP TABLE \`data_requests_rels\`;`)
  await db.run(sql`DROP TABLE \`_data_requests_v\`;`)
  await db.run(sql`DROP TABLE \`_data_requests_v_rels\`;`)
  await db.run(sql`DROP TABLE \`audit_logs\`;`)
  await db.run(sql`DROP TABLE \`audit_logs_rels\`;`)
  await db.run(sql`DROP TABLE \`_audit_logs_v\`;`)
  await db.run(sql`DROP TABLE \`_audit_logs_v_rels\`;`)
  await db.run(sql`DROP TABLE \`security_events\`;`)
  await db.run(sql`DROP TABLE \`security_events_rels\`;`)
  await db.run(sql`DROP TABLE \`_security_events_v\`;`)
  await db.run(sql`DROP TABLE \`_security_events_v_rels\`;`)
  await db.run(sql`DROP TABLE \`rate_limits\`;`)
  await db.run(sql`DROP TABLE \`rate_limits_rels\`;`)
  await db.run(sql`DROP TABLE \`_rate_limits_v\`;`)
  await db.run(sql`DROP TABLE \`_rate_limits_v_rels\`;`)
  await db.run(sql`DROP TABLE \`payout_statements\`;`)
  await db.run(sql`DROP TABLE \`payout_statements_rels\`;`)
  await db.run(sql`DROP TABLE \`_payout_statements_v\`;`)
  await db.run(sql`DROP TABLE \`_payout_statements_v_rels\`;`)
  await db.run(sql`DROP TABLE \`disputes\`;`)
  await db.run(sql`DROP TABLE \`disputes_rels\`;`)
  await db.run(sql`DROP TABLE \`_disputes_v\`;`)
  await db.run(sql`DROP TABLE \`_disputes_v_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_media\` (
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
  await db.run(
    sql`INSERT INTO \`__new_media\`("id", "alt", "prefix", "_objectkey", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "_stored", "_transforms", "original_filename", "original_url", "original_mime_type", "original_filesize", "original_width", "original_height", "original_prefix", "original__objectkey", "original__stored") SELECT "id", "alt", "prefix", "_objectkey", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "_stored", "_transforms", "original_filename", "original_url", "original_mime_type", "original_filesize", "original_width", "original_height", "original_prefix", "original__objectkey", "original__stored" FROM \`media\`;`,
  )
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`ALTER TABLE \`__new_media\` RENAME TO \`media\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(
    sql`CREATE INDEX \`media_original_original_filename_idx\` ON \`media\` (\`original_filename\`);`,
  )
  await db.run(sql`CREATE TABLE \`__new_media_rels\` (
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
  await db.run(
    sql`INSERT INTO \`__new_media_rels\`("id", "order", "parent_id", "path", "admins_id", "users_id") SELECT "id", "order", "parent_id", "path", "admins_id", "users_id" FROM \`media_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`media_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_media_rels\` RENAME TO \`media_rels\`;`)
  await db.run(sql`CREATE INDEX \`media_rels_order_idx\` ON \`media_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`media_rels_parent_idx\` ON \`media_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`media_rels_path_idx\` ON \`media_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`media_rels_admins_id_idx\` ON \`media_rels\` (\`admins_id\`);`)
  await db.run(sql`CREATE INDEX \`media_rels_users_id_idx\` ON \`media_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__media_v\` (
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
  await db.run(
    sql`INSERT INTO \`__new__media_v\`("id", "parent_id", "version_alt", "version_prefix", "version__objectkey", "version_updated_at", "version_created_at", "version_url", "version_thumbnail_u_r_l", "version_filename", "version_mime_type", "version_filesize", "version_width", "version_height", "version__stored", "version__transforms", "version_original_filename", "version_original_url", "version_original_mime_type", "version_original_filesize", "version_original_width", "version_original_height", "version_original_prefix", "version_original__objectkey", "version_original__stored", "created_at", "updated_at") SELECT "id", "parent_id", "version_alt", "version_prefix", "version__objectkey", "version_updated_at", "version_created_at", "version_url", "version_thumbnail_u_r_l", "version_filename", "version_mime_type", "version_filesize", "version_width", "version_height", "version__stored", "version__transforms", "version_original_filename", "version_original_url", "version_original_mime_type", "version_original_filesize", "version_original_width", "version_original_height", "version_original_prefix", "version_original__objectkey", "version_original__stored", "created_at", "updated_at" FROM \`_media_v\`;`,
  )
  await db.run(sql`DROP TABLE \`_media_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__media_v\` RENAME TO \`_media_v\`;`)
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
  await db.run(sql`CREATE TABLE \`__new__media_v_rels\` (
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
  await db.run(
    sql`INSERT INTO \`__new__media_v_rels\`("id", "order", "parent_id", "path", "admins_id", "users_id") SELECT "id", "order", "parent_id", "path", "admins_id", "users_id" FROM \`_media_v_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`_media_v_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new__media_v_rels\` RENAME TO \`_media_v_rels\`;`)
  await db.run(sql`CREATE INDEX \`_media_v_rels_order_idx\` ON \`_media_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_rels_parent_idx\` ON \`_media_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_media_v_rels_path_idx\` ON \`_media_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_media_v_rels_admins_id_idx\` ON \`_media_v_rels\` (\`admins_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_media_v_rels_users_id_idx\` ON \`_media_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
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
    sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "admins_id", "users_id", "auth_accounts_id", "auth_verification_tokens_id", "media_id") SELECT "id", "order", "parent_id", "path", "admins_id", "users_id", "auth_accounts_id", "auth_verification_tokens_id", "media_id" FROM \`payload_locked_documents_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(
    sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`,
  )
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
}
