import { spawnSync } from 'node:child_process'

const schema = 'prisma/schema.postgresql.prisma'

const databaseCandidates = [
  'DATABASE_URL',
  'POSTGRES_PRISMA_URL',
  'POSTGRES_URL',
  'POSTGRES_URL_NON_POOLING',
]

const directCandidates = [
  'DIRECT_URL',
  'POSTGRES_URL_NON_POOLING',
  'POSTGRES_URL',
]

function resolveEnv(candidates) {
  for (const key of candidates) {
    const value = process.env[key]
    if (typeof value === 'string' && value.trim()) {
      return { key, value: value.trim() }
    }
  }
  return {}
}

function assertPostgresUrl(value, name) {
  if (!value) {
    throw new Error(`${name} is required for Vercel production builds.`)
  }
  if (!/^postgres(?:ql)?:\/\//i.test(value)) {
    throw new Error(`${name} must be a PostgreSQL connection string for Vercel production builds.`)
  }
}

function run(command, args, env) {
  console.log(`[vercel-build] ${command} ${args.join(' ')}`)
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

try {
  const database = resolveEnv(databaseCandidates)
  const direct = resolveEnv(directCandidates)
  assertPostgresUrl(database.value, database.key ?? 'DATABASE_URL')

  const env = {
    ...process.env,
    DATABASE_URL: database.value,
    DIRECT_URL: direct.value ?? database.value,
  }

  console.log(`[vercel-build] DATABASE_URL configured from ${database.key}`)
  console.log(`[vercel-build] DIRECT_URL ${direct.key ? `configured from ${direct.key}` : 'falling back to DATABASE_URL'}`)

  run('npx', ['prisma', 'generate', `--schema=${schema}`], env)
  run('npx', ['prisma', 'db', 'push', `--schema=${schema}`, '--accept-data-loss'], env)
  run('npx', ['next', 'build'], env)
  run('node', ['scripts/copy-assets.js'], env)
} catch (error) {
  console.error(`[vercel-build] ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
