# Masidy Cloudflare Migration - Phase 0 Audit

Audit date: 2026-11-21

## 1. Package versions

| Package                            |       Version |
| ---------------------------------- | ------------: |
| `payload`                          |  4.0.0-beta.8 |
| `next`                             |        16.4.2 |
| `react`                            |        19.3.1 |
| `react-dom`                        |        19.3.1 |
| `@payloadcms/next`                 |  4.0.0-beta.8 |
| `@payloadcms/plugin-cloud-storage` |  4.0.0-beta.8 |
| `@payloadcms/plugin-mcp`           |  4.0.0-beta.8 |
| `@payloadcms/richtext-lexical`     |  4.0.0-beta.8 |
| `@payloadcms/translations`         |  4.0.0-beta.8 |
| `@payloadcms/ui`                   |  4.0.0-beta.8 |
| `@payloadcms/figma`                |  1.0.0-beta.1 |
| `sharp`                            |        0.35.4 |
| `stripe`                           |        23.1.0 |
| `next-auth`                        | 5.0.0-beta.32 |

The project is on Payload 4.0.0-beta.8. Official packages
`@payloadcms/db-d1-sqlite` and `@payloadcms/storage-r2` exist for this exact
version. Both package archives were verified at `4.0.0-beta.8`.

No `wrangler` package is currently installed or pinned.

## 2. Figma-specific dependencies

- `@payloadcms/figma` is declared and used by `buildFigmaConfig()`.
- `src/payload.config.ts` imports `buildFigmaConfig`.
- `figma-image-loader.ts` exports the Figma platform image loader.
- `next.config.ts` reads `FIGMA_PUBLIC_URL` for preview origins and server
  action origins.
- `next.config.ts` includes Figma-provided public environment values:
  `FIGMA_CONTENT_API_CONTENT_SYSTEM_ID`,
  `FIGMA_CONTENT_API_URL`, and `FIGMA_OAUTH_CLIENT_ID`.
- `src/app/(payload)/admin/logout/route.ts` falls back to `FIGMA_PUBLIC_URL`.
- `.figma/make/*` lifecycle scripts and metadata are present.
- `.figma/make/template-transition.json`, `payload.json`, and `dev.json`
  contain Figma Make runtime configuration.
- The generated Payload import map contains Figma-specific admin components.
- The Figma asset route at
  `src/app/(frontend)/.figma/make/[asset]/route.ts` is runtime Figma infrastructure.
- `@payloadcms/figma` is not present only in this project; it is also part of
  the generated Payload admin import map and lifecycle scripts.

These items must remain intact until the migration passes staging and must be
removed only in Phase 8.

## 3. Worker and Node runtime compatibility

Node-compatible APIs found:

- `node:crypto` in rate limiting, proposals, orders, Stripe webhooks, and cron.
- `node:fs/promises` and `node:path` in the Figma asset route.
- `sharp` is both a dependency and a configured `pnpm` built dependency.
- `next/font/google` is used in the frontend layout.

Migration risks:

- The Figma asset route and the Figma Make lifecycle scripts must not ship as
  application runtime dependencies.
- `sharp` is Node/native-image tooling and is not an appropriate Cloudflare
  replacement. Cloudflare Images/R2 serving must replace its role.
- `node:crypto` should be checked against `nodejs_compat` and Workers fetch
  APIs. The webhook signature path should use Stripe/Workers-compatible async
  verification and no Node-only assumptions.
- The Figma asset route is a direct `fs` dependency and must be removed or
  replaced during cleanup.
- The app uses Next Server Components, route handlers, and Next cache APIs.
  It should be built and deployed only through the OpenNext Cloudflare pipeline.

No native modules or child-process usage other than `sharp` were found in
application source.

## 4. Transactions and atomicity

The D1 adapter for beta.8 exposes `beginTransaction`, `commitTransaction`,
`rollbackTransaction`, and `transactionOptions` in its package types and
exports. Therefore Payload D1 transactional primitives exist in this exact
adapter, but D1 and Cloudflare Worker behavior still require staging proof.

High-risk flows:

- Checkout and reservation hold creation are multi-step:
  order creation, active hold calculation, hold creation, and Stripe checkout
  session creation. The current hold check and create path is not a database
  transaction.
- Two simultaneous checkouts rely on the read-before-write hold calculation.
  A unique constraint or Durable Object serialization will be required.
- Hold conversion updates the departure booked count and hold status in separate
  writes.
- Stripe webhook processing creates or updates an order, invoice, ledger,
  notifications, reminder, hold, and departure state in separate operations.
- Stripe transfer creation happens before ledger entry creation, with retry
  logic based on idempotency keys.
- Refund, dispute, payout, reversal, and commission flows can span several
  collections and external Stripe calls.

No Payload `req.payload.beginTransaction` or explicit transaction calls exist
in the current application source.

## 5. Scheduled work and webhooks

- `src/app/(frontend)/api/cron/notifications/route.ts` processes due
  notifications and is protected by `CRON_SECRET`.
- The Notifications collection stores `scheduledFor` and `deliveryStatus`.
- Stripe account, checkout, payout, and dispute events are handled in
  `src/app/(frontend)/api/payments/webhook/route.ts`.
- Stripe Checkout and Connect routes create external sessions.
- Reservation holds have a 30-minute expiry but no expiration job was found in
  application source.
- Reminder notifications are created from the Stripe webhook for departures
  seven days away.
- No general retry queue or statement-scheduling worker was found.
- No Payload `autoRun` or existing queue consumer was found.

## 6. Outbound integrations and environment variables

| Integration            | Environment names                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Stripe                 | `STRIPE_SECRET_KEY`, `STRIPE_CONNECT_CLIENT_ID`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CONNECT_WEBHOOK_SECRET`         |
| Google sign-in         | `AUTH_GOOGLE_ID` or `GOOGLE_CLIENT_ID`, `AUTH_GOOGLE_SECRET` or `GOOGLE_CLIENT_SECRET`, `AUTH_SECRET`, `AUTH_URL` |
| Resend email           | `RESEND_API_KEY`, `TRANSACTIONAL_EMAIL_FROM`                                                                      |
| Turnstile              | `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`                                                          |
| OpenAI                 | `APP_OPENAI_API_KEY`                                                                                              |
| Optional file scanning | `FILE_SCAN_API_URL`, `FILE_SCAN_API_KEY`                                                                          |
| Cron                   | `CRON_SECRET`                                                                                                     |
| Site                   | `NEXT_PUBLIC_SITE_URL`, `NEXTAUTH_URL`                                                                            |
| Figma Make             | `FIGMA_PUBLIC_URL`, Figma content/OAuth variables                                                                 |

Google Analytics is also optional through Make site settings.

## 7. Cache invalidation

`unstable_cache` is used in:

- `src/lib/public-records.ts`
- `src/lib/marketplace-data.ts`

Existing cache tags:

- `marketplace`
- `trip:<slug>`
- `agency:<slug>`
- `agent-storefronts`
- `agent:<slug>`
- `published-pages`
- `page:<slug>`

Collection hooks call `revalidateTag` for:

- Trips
- Agencies
- AgentProfiles
- AgentListings
- Departures
- Media
- Reviews
- AIProjects/pages

The invalidation hooks generally cover list/detail keys, including previous and
current slugs. This logic must remain or be adapted to the OpenNext Workers tag
cache.

## 8. Collections and relationships

The project has 44 collections.

| Collection             | Main relationships                 |
| ---------------------- | ---------------------------------- |
| Admins                 | no app user relationship           |
| Users                  | public app accounts                |
| Media                  | Users, Folders, Tags               |
| Folders                | Media organization                 |
| Tags                   | Media organization                 |
| Agencies               | Users/media/trips                  |
| Trips                  | Agencies, Media, Departures        |
| Departures             | Trips                              |
| BookingRequests        | Trips                              |
| Orders                 | Users, Agencies, Trips, Departures |
| ReservationHolds       | Departures, Orders, Users          |
| Waitlists              | Users, Departures                  |
| Proposals              | Users, Trips, Departures           |
| Reviews                | Users, Trips, Orders               |
| AgencyMemberships      | Users, Agencies                    |
| AgentProfiles          | Users, Media                       |
| AgentListings          | Users, Trips                       |
| Applications           | Users                              |
| Conversations          | Orders, Users                      |
| Messages               | Conversations, Users               |
| Notifications          | Users                              |
| SupportTickets         | Users, Orders                      |
| FinanceRules           | no direct relationship             |
| PaymentAccounts        | Users, Agencies                    |
| LedgerEntries          | Orders, Users, Agencies            |
| PayoutStatements       | Users, Agencies                    |
| Invoices               | Orders, Customers                  |
| RefundRequests         | Orders, Users                      |
| Disputes               | Orders, Users                      |
| OrderChanges           | Orders, Users                      |
| BrandKits              | Users, Media                       |
| TravelerProfiles       | Users                              |
| TravelerFiles          | Users                              |
| AiProjects             | Users, BrandKits                   |
| AiUsage                | Users, AiProjects                  |
| AuthAccounts           | Users                              |
| AuthVerificationTokens | no app relationship                |
| LegalPolicies          | no app relationship                |
| Consents               | Users                              |
| DataRequests           | Users                              |
| AuditLogs              | Admins or Users                    |
| SecurityEvents         | Users                              |
| RateLimits             | no relationship                    |
| SavedTrips             | Users, Trips                       |

ID handling must use Payload-generated ID values and an old-ID/new-ID map
during import. The current schema contains UUIDs and/or document IDs but not
only numbers.

## 9. Monetary and data integrity findings

- Orders, taxes, fees, commissions, ledger entries, refunds, proposals,
  disputes, payout statements, and related finance documents use `number`
  fields.
- Several calculations use binary floating point and round to 2 decimals.
- Stripe amounts are divided or multiplied by 100 in the webhook and checkout
  paths.
- This conflicts with the migration requirement to store integer minor units.
  Monetary storage and migration must be addressed in a later implementation
  phase.

## 10. GraphQL

GraphQL is a declared dependency and
`src/app/(payload)/api/graphql/route.ts` is generated by Payload. It must not
be relied on for Workers; REST and the Local API will be the supported
interfaces.
