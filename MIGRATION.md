# Masidy → Cloudflare migration brief (for the coding agent)

Read this whole file before doing anything. Work phase by phase. Stop at every **HUMAN CHECKPOINT** and wait for the owner.

---

## 0. Working rules

1. Work on a new git branch `cloudflare-migration`. Commit small and often. Never commit to `main`.
2. Never print, log, commit or paste secret values. Reference them only by name (`process.env.X` or a Worker binding). The owner enters secret values themselves with `wrangler secret put NAME`.
3. Do not guess. Anything marked **VERIFY** must be checked against the installed package, the official template, or current docs before you rely on it. Write what you found in `docs/migration/NOTES.md`.
4. Keep the old Figma code working until staging passes all tests (Phase 6). Do not delete it earlier.
5. Everything is built and tested on **staging first**, with separate D1/R2/Queue resources. Production resources are created only in Phase 7.
6. After each phase, run typecheck, lint and build, then report: what changed, what was verified, what is still open.
7. If a step needs a dashboard action or a credential you do not have, stop and ask. Do not work around it.
8. Treat exported customer data as personal data. It lives only in `migration-data/` (gitignored) and is never committed.

## 1. Facts

- **Production domain: `masidy.travel`. It is NOT on Cloudflare yet** (see H1).
- **Test/staging domain: `masidy.dev`.** It is already on Cloudflare, so use `staging.masidy.dev` for staging.
- Account products available: Workers Paid, R2, Images, Zero Trust (Free), Zaraz, Log Explorer. D1, Queues, KV, Durable Objects, Cron Triggers and Workers AI come with Workers (VERIFY plan/usage billing). Advanced Certificate Manager is attached to `masidy.dev`, not `masidy.travel`; `masidy.travel` will use the free Universal SSL certificate.
- Not needed: Workers for Platforms, Tunnels for Platforms, Stream.
- Current stack: Next.js (App Router), React 19, Payload with `@payloadcms/figma` (`buildFigmaConfig()`), Tailwind v4. The database, storage, auth and deploy are Figma-managed.
- Target stack: Next.js on Workers via `@opennextjs/cloudflare`; Payload on D1 (`@payloadcms/db-d1-sqlite`) and R2 (`@payloadcms/storage-r2`); Cloudflare Images for resizing; Access for admin; Cron Triggers, Queues, Turnstile, Email Service, Workers AI.
- Stays external (Cloudflare has no equivalent): Stripe (Checkout, Connect, payouts), Google sign-in, SMS/WhatsApp provider.
- Reference implementation: Payload's official `with-cloudflare-d1` template. Read it and copy its structure instead of inventing one.

## 2. Hard constraints

- Do not use Payload's default logger (`pino-pretty` breaks on Workers). Use a console-based logger.
- Do not use GraphQL on Workers (not guaranteed to work). Use REST and the Local API.
- Next.js must build with **webpack, not Turbopack** (Turbopack is incompatible with the Cloudflare pipeline per the template). VERIFY the correct flag for the installed Next version.
- All `@payloadcms/*` packages must be on exactly the same version as `payload`. Pin `wrangler` to an exact version.
- Worker bundle: only the uncompressed size counts, limit 64 MiB. Worker startup must stay under 1 second. Check both with `wrangler deploy --dry-run` and on first deploy.
- Money is stored as integer minor units. Never floats.
- Do not assume IDs are numeric or unchanged after import. Use an ID map.
- User-facing Local API calls keep `overrideAccess: false`. Only import scripts may override access.

## 3. HUMAN CHECKPOINTS (stop and ask)

**H1. Put `masidy.travel` on Cloudflare (owner does this; can be done in parallel with Phases 0–2).**
1. Before switching, list the current DNS records at the registrar (website, MX/email, TXT). Save a copy so nothing is lost.
2. Cloudflare dashboard → Add a domain → `masidy.travel` → Free plan. Check that the imported DNS records match the saved copy.
3. At the registrar, replace the nameservers with the two Cloudflare gives. Registrar transfer is optional and can be done later (check `.travel` support on Cloudflare's TLD policies page).
4. Wait until the zone shows **Active**. Then: SSL/TLS mode **Full (strict)**, enable Always Use HTTPS. Enable DNSSEC only after Active, and remove any old DS record at the registrar first.
5. Tell the agent when the zone is Active.

**H2. Credentials.** Owner runs `wrangler login` (or creates a scoped API token) and confirms the account ID. Agent never asks for the token in chat.

**H3. Provider dashboards** (owner, in Phase 4 and 7): Google redirect URI, Stripe webhook endpoints and Connect return URLs, Turnstile widget hostnames, Email Service domain onboarding, Access application.

**H4. Review gates:** after Phase 0 (audit), Phase 3 (data counts), Phase 6 (test report), and before DNS cutover.

---

## 4. Phase 0: Audit (read-only)

Create `docs/migration/AUDIT.md` listing:
1. Versions: `payload`, `next`, `react`, every `@payloadcms/*`. **VERIFY** that D1 and R2 adapters exist for this exact Payload major version. If the project is on Payload 4.x and no matching adapter exists, stop and report options (pin to the 3.x line the template tests, or wait).
2. Every Figma-specific item: `@payloadcms/figma`, `buildFigmaConfig`, `FIGMA_*` env vars, `figma-image-loader.ts`, `.figma/make/*`, `allowedDevOrigins` / `serverActions.allowedOrigins` settings.
3. Node-only code that may fail on Workers (`fs`, `child_process`, native modules, `sharp`, long CPU loops).
4. Every place that relies on a database transaction or multi-step atomic update: availability locking, reservation expiry, booking creation, commission ledger, refunds, payouts.
5. All scheduled/background work (reminders, reservation expiry, retries, statements) and every webhook route.
6. Every outbound integration and its env var names.
7. Every `revalidatePath` / `revalidateTag` / cache tag and every collection hook that invalidates.
8. Every collection with its relationships and ID usage.

**HUMAN CHECKPOINT H4.** Wait for approval.

## 5. Phase 1: Prove the platform on staging

1. Read the official `with-cloudflare-d1` template (package.json, wrangler.jsonc, payload.config.ts, next.config, open-next.config.ts, scripts). Copy its approach.
2. Install: `@opennextjs/cloudflare`, `wrangler` (pinned), `@payloadcms/db-d1-sqlite`, `@payloadcms/storage-r2`, all matching `payload`. Do not remove `@payloadcms/figma` yet; keep a config switch or separate branch config until Phase 2.
3. Create staging resources (owner approves names):
   ```
   wrangler d1 create masidy-staging-db
   wrangler r2 bucket create masidy-staging-media
   wrangler r2 bucket create masidy-staging-cache
   ```
4. Create `wrangler.jsonc` for staging. Sketch (VERIFY every key against the template and current docs):
   ```jsonc
   {
     "name": "masidy-staging",
     "main": ".open-next/worker.js",
     "compatibility_date": "<today>",
     "compatibility_flags": ["nodejs_compat"],
     "assets": { "directory": ".open-next/assets", "binding": "ASSETS" },
     "d1_databases": [{ "binding": "D1", "database_name": "masidy-staging-db", "database_id": "<id>" }],
     "r2_buckets": [
       { "binding": "R2", "bucket_name": "masidy-staging-media" },
       { "binding": "NEXT_INC_CACHE_R2_BUCKET", "bucket_name": "masidy-staging-cache" }
     ],
     "services": [{ "binding": "WORKER_SELF_REFERENCE", "service": "masidy-staging" }],
     "observability": { "enabled": true }
   }
   ```
   Run `wrangler types` after every binding change.
5. Deploy a minimal working Payload (Admins + Media) to `masidy-staging.<account>.workers.dev`.

**Done when:** `/admin` loads, an admin can be created, an image uploads to R2 and is served, and the bundle size and startup time are recorded in NOTES.md.

## 6. Phase 2: Port Masidy

2.1 **Payload config.** Replace `buildFigmaConfig()` with `buildConfig()`: `sqliteD1Adapter({ binding })`, R2 storage on the Media collection, `secret` from `PAYLOAD_SECRET`, console logger, existing collections/globals/plugins, `typescript.outputFile` unchanged. Keep Admins and Media. Remove all `@payloadcms/figma` imports.

2.2 **Next config.** Remove Figma preview-origin settings. Set webpack build. Set `images.loader: 'custom'` with a new `cloudflare-image-loader.ts`.

2.3 **Image loader.** Use Cloudflare image transformations (`/cdn-cgi/image/width=…,quality=…,format=auto/<path>`). Keep passing Payload `media.url` to `next/image`. Pass through non-Payload URLs unchanged. In dev, return the plain URL. **VERIFY on staging** that transformations work for files your Worker serves from R2 and that the Images plan includes transformations. If not, fall back to serving R2 through a public custom domain or the original URL with fixed sizes.

2.4 **Caching.** `open-next.config.ts` with R2 incremental cache, a Durable Object queue, and the **Durable Object sharded tag cache** (D1 tag cache is only advised for low traffic). Use the override import paths from the installed `@opennextjs/cloudflare` version (VERIFY exact paths and required Durable Object bindings/migrations in current docs). Keep every existing collection hook that invalidates list + previous and current route keys. Prove it: edit a published trip on staging and confirm the public page updates.

2.5 **Atomic flows.** From the audit, do not rely on interactive transactions. For seat/availability locking and the commission ledger: unique constraints, idempotency keys, conditional updates (`UPDATE … WHERE remaining >= n`), and D1 batch where needed. For availability locking prefer **one Durable Object per departure** to serialize reservations. VERIFY whether the D1 adapter supports transactions; document the result.

2.6 **Bindings and env.** Read bindings through `getCloudflareContext()`; remove `process.env` use for bindings. Secrets stay `process.env`/Worker secrets. Replace `FIGMA_PUBLIC_URL` with `NEXT_PUBLIC_SITE_URL` (staging: `https://staging.masidy.dev`, production: `https://masidy.travel`) and update sitemap, canonical URLs, OG tags and structured data.

2.7 **Migrations.** `pnpm payload migrate:create`, commit the migrations, apply to staging D1 (local first, then remote).

**Done when:** the full app builds with webpack, deploys to staging, public pages render empty states without crashing, and `/admin` works.

## 7. Phase 3: Data and media import

1. **HUMAN:** owner exports all collections (JSON) and all Media files from the Figma-managed app into `migration-data/` using Make's Payload data tooling. If the owner cannot, stop and report.
2. Write `scripts/import/` (idempotent, re-runnable): import in dependency order (media → agencies → users → trips → departures → storefronts/proposals → bookings → orders → ledger/payout/statement records → messages/notifications/reviews/etc.). Keep `migration-data/id-map.json` mapping old ID → new ID per collection and rewrite every relationship through it.
3. Upload media through Payload (so records and R2 stay consistent), not directly to R2.
4. Write `docs/migration/DATA_REPORT.md`: per-collection source count vs imported count, relationship spot checks, money totals (sum of orders, ledger, payouts) matching the source, and image load check.

**HUMAN CHECKPOINT H4.** Wait for approval of the data report. Rerun the import against production only in Phase 7.

## 8. Phase 4: Integrations (staging)

4.1 **Admin auth.** Step A: keep Payload's own login for `admins`. Step B (owner H3): Cloudflare Access self-hosted app on `staging.masidy.dev/admin*`. Step C: add a custom Payload auth strategy that verifies the Access JWT (from the `Cf-Access-Jwt-Assertion` header, and the `CF_Authorization` cookie for `/api` calls) against the team JWKS, the issuer, and the app AUD, then maps the email to an `admins` user. VERIFY with the `jose` library on Workers. Env: `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`. Never trust the header without verifying the signature.

4.2 **Public auth.** Keep the existing Users/`payload-auth` setup. Replace the `FIGMA_PREVIEW_OAUTH_*` variables with real redirect URIs: `https://<host>/<existing callback path>`. Magic links are sent with the email module (4.4).

4.3 **Stripe.** Use the fetch HTTP client and async webhook signature verification (no Node-only crypto). Webhook route: verify signature, store the event ID with a unique constraint (idempotency), process; if processing fails, enqueue a retry in Queues. Separate secrets for account and Connect webhooks. Return 200 quickly.

4.4 **Email.** Wrap sending in one function `sendEmail()`. Use the Email Service Workers binding (`send_email` binding named `EMAIL`). It is in public beta; keep the function swappable. Sending domain `masidy.travel` (after H1); staging uses a verified subdomain on `masidy.dev`.

4.5 **Turnstile.** Widget on signup, login, partner application, contact and support forms. Verify server-side on every submit. Env: `TURNSTILE_SECRET_KEY`.

4.6 **Cron and retries.** Create a second tiny Worker `masidy-cron` with Cron Triggers (reminders, reservation expiry, payout schedules, statements, retries). It calls the main Worker through a service binding at `/api/payload-jobs/run`, authenticated with `CRON_SECRET`. Do not use Payload `autoRun` (it needs a long-running server). Queue consumers live in the same Worker.

4.7 **AI.** Move Masidy Make AI to Workers AI through AI Gateway (binding `AI`). Put the model call behind one provider interface. Keep usage logging, moderation and cost limits. Output quality will differ; keep the old provider selectable until tested.

4.8 **SMS/WhatsApp.** Remains external. Only update env var names, webhook URLs and callback hosts.

**Done when:** each integration passes its staging test (Phase 6 list).

## 9. Phase 5: Security and operations

1. WAF rate-limiting rules on login, magic-link request, booking, payment and AI endpoints (owner enables; agent provides the exact paths and thresholds).
2. File uploads: allow-list MIME types and sizes, re-encode images, validate server-side. Check whether Cloudflare content scanning is available on this plan; if not, document the gap.
3. Logging: Workers Logs on, structured JSON logs, no PII or secrets in logs. Alerts through Notifications for 5xx spikes, cron failures, Queue backlog and webhook failures.
4. Backups: nightly D1 export to R2 (`wrangler d1 export` or an API call from the cron Worker), media bucket retention, and a written restore procedure tested once on staging. D1 Time Travel as a second layer.
5. Zaraz for analytics and consent. Keep the existing consent and privacy-export/deletion features working.
6. Security headers and CSP set in the Worker/Next config.

## 10. Phase 6: Test on staging (full report)

Write `docs/migration/TEST_REPORT.md` with pass/fail for:
- Signup, Google login, magic link, logout, account deletion and privacy export
- Admin via Access (allowed and denied user)
- Trip browse, search, detail, wishlist; agency and storefront pages; images with nonzero dimensions on every route
- Edit a published trip and see the public page update (cache invalidation)
- Booking with seat lock, expiry, waitlist, amendment, cancellation, voucher
- Stripe test-mode checkout, webhook, split payment, refund, partial refund, dispute, Connect onboarding, payout, statement, commission reversal; replayed webhook does not double-apply
- Two simultaneous bookings for the last seat (only one succeeds)
- Email, SMS/WhatsApp delivery; reminders fire from cron
- AI features and cost limits
- Rate limiting and Turnstile block bad requests
- Existing e2e, accessibility and load tests; bundle size and startup time recorded
- Backup export and restore drill

**HUMAN CHECKPOINT H4.** Owner approves before production.

## 11. Phase 7: Production cutover (`masidy.travel`)

Prerequisites: H1 done (zone Active).
1. Create production resources (`masidy-db`, `masidy-media`, `masidy-cache`) and `wrangler.production.jsonc` (or an `env.production` block). Worker custom domains: `masidy.travel` and `www.masidy.travel` (redirect www → apex).
2. Owner sets production secrets with `wrangler secret put`.
3. Apply migrations to production D1. Dry-run the import against production with `masidy.travel` not yet live, then verify counts.
4. **HUMAN:** register callbacks for `masidy.travel`: Google redirect URI, Stripe webhook endpoints (account + Connect) and Connect return/refresh URLs, Turnstile hostnames, Email Service domain DNS (SPF/DKIM/DMARC), Access app for `masidy.travel/admin*`, SMS/WhatsApp webhooks.
5. Freeze writes on the old app. Take a final export, import the delta, verify counts again.
6. Attach the custom domain and deploy. Run the Phase 6 smoke tests against production with real test-mode checkout, then switch Stripe to live mode.
7. Keep the old Figma app untouched for at least a week as the rollback. Rollback = repoint DNS/custom domain and re-register callbacks.

## 12. Phase 8: Cleanup

Remove `@payloadcms/figma`, `.figma/make/*`, `figma-image-loader.ts` and unused `FIGMA_*` references only after the first stable week. Update README with the deploy runbook (`opennextjs-cloudflare build && opennextjs-cloudflare deploy`, migrations, secrets, backup/restore, rollback).

---

## 13. Open questions the agent must answer in NOTES.md (do not assume)

1. Is the project on Payload 3.x or 4.x, and do matching D1/R2 adapters exist?
2. Does the D1 adapter support transactions in this version?
3. Do Cloudflare image transformations work on R2 files served by the Worker, and are they included in the Images plan?
4. Which exact OpenNext override import paths and Durable Object bindings does the installed version require?
5. Is Workers AI quality acceptable for each Masidy Make AI feature?
6. Is file/malware scanning available on this plan?
7. Does the Email Service beta meet volume and deliverability needs for magic links and reminders?
