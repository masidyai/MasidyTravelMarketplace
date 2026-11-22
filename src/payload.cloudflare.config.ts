import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { r2Storage } from '@payloadcms/storage-r2'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { en as adminLanguage } from '@payloadcms/translations/languages/en'
import { buildConfig, type PayloadLogger } from 'payload'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { GetPlatformProxyOptions } from 'wrangler'

import { Admins } from './collections/Admins'
import { AiProjects } from './collections/AiProjects'
import { AiUsage } from './collections/AiUsage'
import { Agencies } from './collections/Agencies'
import { AgencyMemberships } from './collections/AgencyMemberships'
import { AgentListings } from './collections/AgentListings'
import { AgentProfiles } from './collections/AgentProfiles'
import { Applications } from './collections/Applications'
import { AuthAccounts } from './collections/AuthAccounts'
import { AuthVerificationTokens } from './collections/AuthVerificationTokens'
import { AuditLogs } from './collections/AuditLogs'
import { BookingRequests } from './collections/BookingRequests'
import { BrandKits } from './collections/BrandKits'
import { Consents } from './collections/Consents'
import { Conversations } from './collections/Conversations'
import { DataRequests } from './collections/DataRequests'
import { Departures } from './collections/Departures'
import { Disputes } from './collections/Disputes'
import { FinanceRules } from './collections/FinanceRules'
import { Folders } from './collections/Folders'
import { Invoices } from './collections/Invoices'
import { LedgerEntries } from './collections/LedgerEntries'
import { LegalPolicies } from './collections/LegalPolicies'
import { Media } from './collections/Media'
import { Messages } from './collections/Messages'
import { Notifications } from './collections/Notifications'
import { OrderChanges } from './collections/OrderChanges'
import { Orders } from './collections/Orders'
import { PaymentAccounts } from './collections/PaymentAccounts'
import { PayoutStatements } from './collections/PayoutStatements'
import { Proposals } from './collections/Proposals'
import { RateLimits } from './collections/RateLimits'
import { RefundRequests } from './collections/RefundRequests'
import { ReservationHolds } from './collections/ReservationHolds'
import { Reviews } from './collections/Reviews'
import { SavedTrips } from './collections/SavedTrips'
import { SecurityEvents } from './collections/SecurityEvents'
import { SupportTickets } from './collections/SupportTickets'
import { Tags } from './collections/Tags'
import { TravelerFiles } from './collections/TravelerFiles'
import { TravelerProfiles } from './collections/TravelerProfiles'
import { Trips } from './collections/Trips'
import { Users } from './collections/Users'
import { Waitlists } from './collections/Waitlists'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const realpath = (value: string) => (fs.existsSync(value) ? fs.realpathSync(value) : undefined)
const isCloudflareMinimalBuild =
  process.env.PAYLOAD_CONFIG_PATH?.replaceAll('\\', '/').endsWith(
    'src/payload.cloudflare.config.ts',
  ) && process.env.NEXT_PHASE === 'phase-production-build'
const isCloudflareBuildStep = process.env.MASIDY_CLOUDFLARE_BUILD === '1'

const isPayloadCLI = process.argv.some((value) => {
  const resolved = realpath(value)
  return resolved?.endsWith(path.join('payload', 'bin.js')) ?? false
})
const isProduction = process.env.NODE_ENV === 'production'
const payloadSecret = process.env.PAYLOAD_SECRET

if (!payloadSecret && !isCloudflareBuildStep) {
  throw new Error('PAYLOAD_SECRET must be set for the Cloudflare Worker runtime.')
}

const createLog =
  (level: string, fn: typeof console.log) => (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === 'string') {
      fn(JSON.stringify({ level, msg: objOrMsg }))
    } else {
      fn(JSON.stringify({ level, ...objOrMsg, msg: msg ?? (objOrMsg as { msg?: string }).msg }))
    }
  }

const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || 'info',
  trace: createLog('trace', console.debug),
  debug: createLog('debug', console.debug),
  info: createLog('info', console.log),
  warn: createLog('warn', console.warn),
  error: createLog('error', console.error),
  fatal: createLog('fatal', console.error),
  silent: () => {},
} as unknown as PayloadLogger

const cloudflare =
  isPayloadCLI || !isProduction || isCloudflareMinimalBuild
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })

export default buildConfig({
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Admins,
    Users,
    Media,
    Folders,
    Tags,
    Agencies,
    Trips,
    AgentListings,
    BookingRequests,
    AuthAccounts,
    AuthVerificationTokens,
    AgencyMemberships,
    Orders,
    AiProjects,
    Applications,
    Departures,
    SavedTrips,
    Reviews,
    SupportTickets,
    AgentProfiles,
    ReservationHolds,
    Proposals,
    Waitlists,
    OrderChanges,
    TravelerProfiles,
    TravelerFiles,
    Conversations,
    Messages,
    Notifications,
    FinanceRules,
    PaymentAccounts,
    LedgerEntries,
    Invoices,
    RefundRequests,
    BrandKits,
    AiUsage,
    LegalPolicies,
    Consents,
    DataRequests,
    AuditLogs,
    SecurityEvents,
    RateLimits,
    PayoutStatements,
    Disputes,
  ],
  graphQL: {
    disable: true,
  },
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en: adminLanguage },
  },
  secret: payloadSecret ?? '',
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  storage: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
  logger: isProduction ? cloudflareLogger : undefined,
  typescript: {
    outputFile: path.resolve(dirname, 'payload.cloudflare-types.ts'),
  },
})

function getCloudflareContextFromWrangler() {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: isProduction && !isCloudflareMinimalBuild,
      } satisfies GetPlatformProxyOptions),
  )
}
