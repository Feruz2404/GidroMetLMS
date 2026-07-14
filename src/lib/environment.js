const POOLED_DATABASE_CANDIDATES = ['DATABASE_URL', 'POSTGRES_PRISMA_URL', 'POSTGRES_URL']
const DIRECT_DATABASE_CANDIDATES = ['DIRECT_URL', 'DATABASE_URL_UNPOOLED', 'POSTGRES_URL_NON_POOLING']

function firstConfigured(env, candidates) {
  for (const key of candidates) {
    const value = env[key]
    if (typeof value === 'string' && value.trim()) return { key, value: value.trim() }
  }
  return {}
}

export function isPostgresUrl(value) {
  return Boolean(value && /^postgres(?:ql)?:\/\//i.test(value.trim()))
}

function isStrongPassword(value) {
  return Boolean(
    typeof value === 'string' &&
      value.length >= 12 &&
      value.length <= 256 &&
      /[a-z]/.test(value) &&
      /[A-Z]/.test(value) &&
      /[0-9]/.test(value) &&
      /[^A-Za-z0-9]/.test(value)
  )
}

export function getDeploymentEnvironment(env = process.env) {
  if (env.VERCEL_ENV === 'preview') return 'preview'
  if (env.VERCEL_ENV === 'production') return 'production'
  if (env.NODE_ENV === 'test') return 'test'
  return 'development'
}

export function resolveDatabaseConfiguration(env = process.env) {
  const pooled = firstConfigured(env, POOLED_DATABASE_CANDIDATES)
  const direct = firstConfigured(env, DIRECT_DATABASE_CANDIDATES)
  return {
    databaseUrl: pooled.value,
    databaseUrlSource: pooled.key,
    directUrl: direct.value,
    directUrlSource: direct.key,
  }
}

export function resolveApplicationUrl(env = process.env) {
  const deploymentEnvironment = getDeploymentEnvironment(env)
  const vercelHost = env.VERCEL_URL?.trim()
  if (deploymentEnvironment === 'preview' && vercelHost) return `https://${vercelHost}`

  const configured = env.NEXT_PUBLIC_APP_URL?.trim()
  if (configured) return configured

  const productionHost = env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (deploymentEnvironment === 'production' && productionHost) return `https://${productionHost}`
  if (vercelHost) return `https://${vercelHost}`
  if (deploymentEnvironment === 'development' || deploymentEnvironment === 'test') return 'http://localhost:3000'
  return undefined
}

export function validateDeploymentEnvironment(env = process.env) {
  const deploymentEnvironment = getDeploymentEnvironment(env)
  const database = resolveDatabaseConfiguration(env)
  const errors = []

  if (!isPostgresUrl(database.databaseUrl)) errors.push('DATABASE_URL must be a PostgreSQL connection URL')
  if (!isPostgresUrl(database.directUrl)) errors.push('DIRECT_URL must be a direct PostgreSQL connection URL')
  if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) errors.push('SESSION_SECRET must contain at least 32 characters')
  if (!resolveApplicationUrl(env)) errors.push('NEXT_PUBLIC_APP_URL or a Vercel deployment URL is required')
  if (!['preview', 'production'].includes(deploymentEnvironment)) errors.push('VERCEL_ENV must be preview or production')
  if (deploymentEnvironment === 'preview' && env.RUN_PREVIEW_SEED === 'true' && !isStrongPassword(env.DEMO_SEED_PASSWORD)) {
    errors.push('DEMO_SEED_PASSWORD must be a strong password when RUN_PREVIEW_SEED=true')
  }

  return { valid: errors.length === 0, errors, deploymentEnvironment, ...database }
}
