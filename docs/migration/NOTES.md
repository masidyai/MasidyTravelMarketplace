# Masidy Cloudflare Migration Notes

## Verified in Phase 0

1. Payload is **4.0.0-beta.8**, not 3.x or 4.x stable. Matching official
   adapters exist:
   - `@payloadcms/db-d1-sqlite@4.0.0-beta.8`
   - `@payloadcms/storage-r2@4.0.0-beta.8`
2. The D1 adapter package explicitly exports and types transaction methods:
   `beginTransaction`, `commitTransaction`, and `rollbackTransaction`.
   The staging implementation must prove the behavior for this app's flows.
3. The official `with-cloudflare-d1` repository template was checked:
   <https://github.com/payloadcms/payload/tree/main/templates/with-cloudflare-d1>
   Its current main branch template uses Payload 4.0.0-beta.11, while this app
   is pinned at beta.8. Its beta.11 package must not be mixed with beta.8.
   The template package, wrangler, config, and OpenNext approach are sources
   for Phase 1, but exact installed beta.8 APIs take precedence.
4. The exact D1 and R2 package archives were downloaded and inspected for
   `4.0.0-beta.8`.
5. The Next build currently has webpack configuration and the Figma custom
   loader. The exact Next 16 webpack/OpenNext build command remains to be
   verified during Phase 1.
6. No `wrangler` package is currently present, so it must be pinned exactly
   when Phase 1 starts.

## Open questions

1. D1 transaction behavior is exposed, but its practical use and isolation
   behavior remain a staging result.
2. Cloudflare Images transformations for R2 files and plan inclusion remain
   unverified.
3. Workers AI quality remains unverified.
4. File/malware scanning availability on the selected plan remains unverified.
5. Email Service beta volume and deliverability remain unverified.

## Human checkpoint H1

Not started. `masidy.travel` is not yet on Cloudflare.

## Human checkpoint H2

Complete. Wrangler OAuth was authorized by the owner on 2026-11-21, and
`wrangler whoami` succeeded. The confirmed account ID is
`e0de3cfc84733483abd97dc50b30ef01`.

## Human checkpoint H3

Not started. Provider dashboard work is deferred to Phases 4 and 7.

## Phase 0 gate

Approved by the owner before Phase 1 began.

## Phase 0 validation

- Git initialized on branch `cloudflare-migration`.
- `pnpm exec tsc --noEmit`: passed.
- Markdown formatting: formatted and checked with `oxfmt`.
- No repository lint script is configured; package scripts do not include
  `lint`.
- `pnpm build`: blocked on Windows by the package script's Unix
  `NODE_OPTIONS=...` shell syntax.
- Direct `pnpm exec payload build`: blocked because ordinary shell execution
  is outside the Figma Make lifecycle and `FIGMA_EID`/platform configuration
  is unavailable.

## Phase 1 preparation

- Current registry versions checked: `@opennextjs/cloudflare@1.20.18` and
  `wrangler@4.166.0`. Wrangler 4.166.0 satisfies OpenNext's declared
  `wrangler` peer range `^4.148.0`.
- OpenNext 1.20.18 requires Next `>=16.4.5` for Next 16. The project is on
  Next 16.4.2. Payload's `@payloadcms/next@4.0.0-beta.8` allows
  `next >=16.4.1 <17.0.0`, so Next 16.4.5 is the smallest verified compatible
  patch upgrade.
- The project-pinned D1 and R2 adapters remain exact beta.8 versions.
- The current OpenNext docs verify these overrides:
  - `@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache`
  - `@opennextjs/cloudflare/overrides/queue/do-queue`
  - `@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache`
- For on-demand revalidation, OpenNext documents
  `NEXT_CACHE_DO_QUEUE` / `DOQueueHandler` and
  `NEXT_TAG_CACHE_DO_SHARDED` / `DOShardedTagCache` bindings. The queue
  migration uses SQLite Durable Object classes. A self-reference service
  binding is also documented.
- The Cloudflare caching docs state that Cache API purge is only available on a
  zone/custom domain. If configured with durable-object purging, use
  `@opennextjs/cloudflare/overrides/cache-purge/index` and the
  `NEXT_CACHE_DO_PURGE` / `BucketCachePurge` binding.
- Next 16.4.2's CLI docs verify `next build --webpack` is the webpack flag.
- `mise install` installed the project-pinned Node 24.22.1, but refused the
  project-pinned `npm:pnpm@10.34.3` with a supply-chain trust downgrade error:
  pnpm 10.20.0 had trusted-publisher evidence, but 10.34.3 did not. The 10.34.3
  npm registry integrity/signature and signed GitHub release tag were checked;
  the owner approved a narrow local-only exception for exactly
  `pnpm@10.34.3`. It is stored in the ignored `.mise.local.toml` override and
  is not part of the repository.
- Added exact dependencies using project-pinned pnpm 10.34.3:
  `@opennextjs/cloudflare@1.20.18`,
  `@payloadcms/db-d1-sqlite@4.0.0-beta.8`,
  `@payloadcms/storage-r2@4.0.0-beta.8`, and `wrangler@4.166.0`.
  Next was updated to 16.4.5 to meet OpenNext's peer range. Figma remains
  installed and `buildFigmaConfig()` is unchanged.
- Wrangler reports version 4.166.0. TypeScript check and migration file
  formatting pass. The install warns that `workerd@1.20261119.1`'s postinstall
  was ignored; local Workers preview/deploy still needs its install script
  approved and verified.
- No lint script is configured in `package.json`.
- Wrangler 4.166.0 OAuth is authorized; `wrangler whoami` succeeds and
  confirms the account ID above. No Cloudflare credentials belong in
  `.env.local`.
- The original Figma build remains blocked outside Make by the platform-owned
  `FIGMA_EID`. No dummy environment values were supplied.

## Phase 1 staging resources and configuration

- Listed existing account resources before creation. Existing
  `travel-marketplace-production`, `vibesdk-db`, `travel-marketplace-media`,
  and `vibesdk-templates` resources were left untouched.
- Created the approved staging D1 database `masidy-staging-db` in WEUR with ID
  `d9851218-a17e-4ec1-ad85-d3d725447513`.
- Created `masidy-staging-media` and `masidy-staging-cache` R2 buckets with the
  Standard storage class.
- Added `wrangler.jsonc`, `open-next.config.ts`, and a separate minimal
  `src/payload.cloudflare.config.ts`. The Figma config remains the default;
  only the OpenNext build wrapper selects the Cloudflare config. Generated
  Wrangler binding types are in `worker-configuration.d.ts`.
- Added the owner-confirmed empty `src/app/(payload)/custom.css` required by
  the generated layout. A Cloudflare-only `tsconfig` and admin import map keep
  Figma-specific build paths out of the staging build.
- Read the current official Payload `with-cloudflare-d1` template. Its main
  branch currently targets beta.11, so only its compatible configuration
  approach was used; project adapters remain pinned to Payload beta.8.
- TypeScript passes after generating Worker binding types.
- The Cloudflare build compiles with webpack and no longer fails on Figma
  initialization. Page-data collection now requires `PAYLOAD_SECRET`, which
  has not been provided to the local build environment. Set it locally without
  sharing the value, then add it to the deployed Worker through Wrangler.
- The first Workers Builds deploy reached Wrangler but failed because CI
  expects Worker `masidytravelmarketplace` while the config's self-service
  binding targeted the nonexistent `masidy-staging` Worker. Account inspection
  confirmed the CI Worker has no custom routes. The Wrangler worker name and
  self-reference now match CI; all D1/R2 bindings remain on staging resources.
- The CI Worker is also attached to the `masidy.travel` custom domain. Its
  first successful deployment exposed a missing runtime `PAYLOAD_SECRET`
  binding; the original Worker environment values were restored as secret
  bindings without changing or displaying their values.
- The Google provider initially advertised the previous staging hostname as
  its callback URL. The Worker now declares `AUTH_URL=https://masidy.travel`.
- The local `workerd` postinstall remains unapproved, so local Workers runtime
  preview has not been tested.
- A Workers Builds log showed that `pnpm run build` invoked the Figma Payload
  build and failed while resolving `FIGMA_EID`. The default `build` script now
  uses the Cloudflare OpenNext build; Figma Make deploy scripts use the separate
  `figma:build` script. This keeps Figma out of the Cloudflare build path
  without removing the existing Figma app. Build-time variables are separate
  from deployed Worker secrets.
- Next.js imports the Cloudflare Payload config during page-data collection.
  The Cloudflare build wrapper now marks this build-only config load; the
  config still throws if `PAYLOAD_SECRET` is absent when the Worker runs.
