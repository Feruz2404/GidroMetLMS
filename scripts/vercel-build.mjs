import { spawnSync } from 'node:child_process'

const schema = 'prisma/schema.postgresql.prisma'
const candidates = ['DATABASE_URL', 'POSTGRES_PRISMA_URL', 'POSTGRES_URL', 'POSTGRES_URL_NON_POOLING']

function resolveDatabase() {
  for (const key of candidates) {
    const value = process.env[key]?.trim()
    if (value) return { key, value }
  }
  return {}
}

function run(command, args, env) {
  console.info(`[vercel-build] ${command} ${args.join(' ')}`)
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

const database = resolveDatabase()
if (!database.value || !/^postgres(?:ql)?:\/\//i.test(database.value)) {
  console.error('[vercel-build] A PostgreSQL DATABASE_URL is required.')
  process.exit(1)
}

const env = { ...process.env, DATABASE_URL: database.value }
console.info(`[vercel-build] PostgreSQL configured from ${database.key}.`)
run('node', ['scripts/assert-schema-parity.mjs'], env)
run('npx', ['prisma', 'generate', `--schema=${schema}`], env)

// Database changes are intentionally not applied during an immutable build.
// The deployment workflow must run `npm run db:migrate:deploy` as a separate,
// auditable release step before routing traffic to the new version.
run('npx', ['next', 'build'], env)
run('node', ['scripts/copy-assets.js'], env)
