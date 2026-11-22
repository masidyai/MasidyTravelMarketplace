import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const nextCLI = fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url))
const result = spawnSync(process.execPath, [nextCLI, 'build', '--webpack'], {
  env: {
    ...process.env,
    PAYLOAD_CONFIG_PATH: 'src/payload.cloudflare.config.ts',
    MASIDY_CLOUDFLARE_BUILD: '1',
  },
  stdio: 'inherit',
})

if (result.error) throw result.error
process.exitCode = result.status ?? 1
