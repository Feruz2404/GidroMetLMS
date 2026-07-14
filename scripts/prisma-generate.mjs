import { spawnSync } from 'node:child_process'
import { resolveDatabaseConfiguration } from '../src/lib/environment.js'

const database = resolveDatabaseConfiguration(process.env)
const env = {
  ...process.env,
  ...(database.databaseUrl ? { DATABASE_URL: database.databaseUrl } : {}),
  // Generation does not connect. Deployment validation still requires a
  // dedicated direct URL before migrations can run.
  ...(database.directUrl || database.databaseUrl
    ? { DIRECT_URL: database.directUrl ?? database.databaseUrl }
    : {}),
}

const result = spawnSync('npx', ['prisma', 'generate', '--schema=prisma/schema.prisma'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env,
})
process.exit(result.status ?? 1)
