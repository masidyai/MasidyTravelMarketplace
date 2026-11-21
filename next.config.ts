import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
const payloadConfigPath = process.env.PAYLOAD_CONFIG_PATH
const isCloudflareBuild =
  payloadConfigPath?.replaceAll('\\', '/').endsWith('src/payload.cloudflare.config.ts') ?? false

const makePublicPreviewOrigin = (() => {
  if (isCloudflareBuild) return undefined

  const publicURL = process.env.FIGMA_PUBLIC_URL
  if (!publicURL) return undefined

  try {
    // Next.js expects host[:port] entries rather than full URL origins.
    return new URL(publicURL).host
  } catch {
    return undefined
  }
})()

const productionSiteOrigin = (() => {
  const siteURL = isCloudflareBuild
    ? 'https://staging.masidy.dev'
    : process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL
  if (!siteURL || siteURL.includes('localhost')) return undefined

  try {
    return new URL(siteURL).host
  } catch {
    return undefined
  }
})()

const serverActionOrigins = Array.from(
  new Set(
    [makePublicPreviewOrigin, productionSiteOrigin].filter((origin): origin is string =>
      Boolean(origin),
    ),
  ),
)

const nextConfig: NextConfig = {
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    if (isCloudflareBuild && payloadConfigPath) {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@payload-config': path.resolve(dirname, payloadConfigPath),
        './admin/importMap.js$': path.resolve(dirname, 'src/payload.cloudflare-import-map.ts'),
        sharp$: path.resolve(dirname, 'src/lib/cloudflare-sharp.ts'),
      }
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  ...(!isCloudflareBuild ? { output: 'standalone' as const } : {}),
  ...(isCloudflareBuild
    ? {
        transpilePackages: ['sharp'],
        outputFileTracingExcludes: {
          '/*': [
            './node_modules/sharp/**/*',
            './node_modules/.pnpm/sharp@*/**',
            './node_modules/.pnpm/next@*/node_modules/sharp',
            './node_modules/.pnpm/next@*/node_modules/sharp/**',
            './node_modules/@img/sharp-*/**',
            './node_modules/.pnpm/@img+sharp-*/**',
          ],
          'next-server': [
            './node_modules/sharp/**/*',
            './node_modules/.pnpm/sharp@*/**',
            './node_modules/.pnpm/next@*/node_modules/sharp',
            './node_modules/.pnpm/next@*/node_modules/sharp/**',
            './node_modules/@img/sharp-*/**',
            './node_modules/.pnpm/@img+sharp-*/**',
          ],
        },
      }
    : {}),
  images: {
    loader: 'custom',
    loaderFile: './figma-image-loader.ts',
  },
  // Don't block publishing or preview deploys on errors if the emitted JS is valid
  typescript: {
    ignoreBuildErrors: true,
    ...(isCloudflareBuild ? { tsconfigPath: 'tsconfig.cloudflare.json' } : {}),
  },
  // `next dev` serves the Make preview at a per-sandbox cross-origin host. Next
  // blocks its dev resources (`/_next/*`, HMR WebSocket, internal endpoints)
  // unless the origin is listed here, and a blocked HMR socket stalls Turbopack
  // so the Payload `/admin` panel renders blank in the preview iframe.
  // Dev-only - ignored by `next build`.
  //
  allowedDevOrigins: !isCloudflareBuild && makePublicPreviewOrigin ? [makePublicPreviewOrigin] : [],
  // Prerender source maps add ~100 MB per static build worker
  enablePrerenderSourceMaps: false,
  experimental: {
    // Caps static build workers (~250-380 MB each) to lower `next build` peak memory
    cpus: isCloudflareBuild ? 1 : 2,
    // Payload Admin uses Next Server Actions. In the Make preview proxy, the
    // browser origin is the public sandbox host while `x-forwarded-host` points
    // at the local dev server. Preserve that exact platform-provisioned host
    // and allow the configured published host for production mutations.
    serverActions: {
      allowedOrigins: serverActionOrigins,
    },
  },
  env: {
    NEXT_PUBLIC_SITE_URL: isCloudflareBuild
      ? 'https://staging.masidy.dev'
      : process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXTAUTH_URL ||
        process.env.FIGMA_PUBLIC_URL ||
        'http://localhost:3000',
    // NOTE: Do not add FIGMA_OAUTH_CLIENT_SECRET, FIGMA_CONTENT_API_ACCESS_KEY,
    // or any other credential here. Values placed in `env` are inlined into
    // the JavaScript bundle by Next.js at build time and become readable by
    // anyone who can load the app's client assets. Server-side code
    // (payload.config.ts, route handlers, server components) can still read
    // these values from `process.env.*` without declaring them here. Only
    // public, non-secret values that explicitly need to be available in
    // browser code should be added - and those should use the `NEXT_PUBLIC_*`
    // naming convention.
    ...(!isCloudflareBuild
      ? {
          FIGMA_CONTENT_API_CONTENT_SYSTEM_ID: process.env.FIGMA_CONTENT_API_CONTENT_SYSTEM_ID,
          FIGMA_CONTENT_API_URL: process.env.FIGMA_CONTENT_API_URL,
          FIGMA_OAUTH_CLIENT_ID: process.env.FIGMA_OAUTH_CLIENT_ID,
        }
      : {}),
    ...(isCloudflareBuild ? { MASIDY_CLOUDFLARE_MINIMAL_STAGING: '1' } : {}),
  },
}

const payloadConfig = withPayload(nextConfig, { devBundleServerPackages: false })
const payloadWebpack = payloadConfig.webpack

const finalConfig: NextConfig = isCloudflareBuild
  ? {
      ...payloadConfig,
      serverExternalPackages: payloadConfig.serverExternalPackages?.filter(
        (packageName) => packageName !== 'sharp',
      ),
      webpack: (webpackConfig, webpackOptions) => {
        const resolvedConfig = payloadWebpack?.(webpackConfig, webpackOptions) ?? webpackConfig

        return {
          ...resolvedConfig,
          externals: Array.isArray(resolvedConfig.externals)
            ? resolvedConfig.externals.filter((external: unknown) => external !== 'sharp')
            : resolvedConfig.externals,
        }
      },
    }
  : payloadConfig

export default finalConfig
