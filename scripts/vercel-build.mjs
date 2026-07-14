import { spawnSync } from 'node:child_process'
import {
  resolveApplicationUrl,
  resolveDatabaseConfiguration,
  validateDeploymentEnvironment,
} from '../src/lib/environment.js'

function run(command, args, env) {
  console.info(`[vercel-build] ${command} ${args.join(' ')}`)
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

const validation = validateDeploymentEnvironment(process.env)
if (!validation.valid) {
  for (const message of validation.errors) console.error(`[vercel-build] ${message}.`)
  process.exit(1)
}

const database = resolveDatabaseConfiguration(process.env)
const env = {
  ...process.env,
  DATABASE_URL: database.databaseUrl,
  DIRECT_URL: database.directUrl,
  NEXT_PUBLIC_APP_URL: resolveApplicationUrl(process.env),
}

console.info(`[vercel-build] Database configuration ${JSON.stringify(validation.diagnostic)}.`)
run('node', ['scripts/assert-prisma-config.mjs'], env)
run('npx', ['prisma', 'generate', '--schema=prisma/schema.prisma'], env)
run('npx', ['prisma', 'migrate', 'deploy', '--schema=prisma/schema.prisma'], env)

if (validation.deploymentEnvironment === 'production' && process.env.ALLOW_LEGACY_PRODUCTION_MIGRATION === 'true') {
  const legacyUrl = process.env.DATABASE_URL?.trim()
  if (!legacyUrl || legacyUrl === database.databaseUrl) {
    console.error('[vercel-build] A distinct legacy DATABASE_URL is required for the guarded Production data migration.')
    process.exit(1)
  }
  run('npx', ['tsx', 'prisma/migrate-legacy-production-data.ts'], {
    ...env,
    LEGACY_DATABASE_URL: legacyUrl,
    ALLOW_LEGACY_PRODUCTION_MIGRATION: 'true',
  })
}

if (validation.deploymentEnvironment === 'preview' && process.env.RUN_PREVIEW_SEED === 'true') {
  run('npx', ['tsx', 'prisma/seed.ts'], env)
}
if (validation.deploymentEnvironment === 'production' && process.env.ALLOW_PRODUCTION_CONTENT_INIT === 'true') {
  run('npx', ['tsx', 'prisma/init-production-content.ts'], env)
}

run('npx', ['next', 'build'], env)
run('node', ['scripts/copy-assets.js'], env)
