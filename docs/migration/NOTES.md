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
3. OpenNext exact override paths and Durable Object bindings remain unverified
   until the installed package version is selected.
4. Workers AI quality remains unverified.
5. File/malware scanning availability on the selected plan remains unverified.
6. Email Service beta volume and deliverability remain unverified.

## Human checkpoint H1

Not started. `masidy.travel` is not yet on Cloudflare.

## Human checkpoint H2

Not started. `wrangler login` and account-ID confirmation are owner actions.

## Human checkpoint H3

Not started. Provider dashboard work is deferred to Phases 4 and 7.

## Phase 0 gate

Waiting for owner review and approval of `docs/migration/AUDIT.md`.

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
