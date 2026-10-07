const POOLED_DATABASE_CANDIDATES = ['DATABASE_URL']
const DIRECT_DATABASE_CANDIDATES = ['DIRECT_URL', 'DATABASE_URL_UNPOOLED']

function firstConfigured(env, candidates) {
  for (const key of candidates) {
    const rawValue = env[key]
    if (typeof rawValue === 'string' && rawValue.trim()) {
      return { key, value: rawValue.trim(), hasOuterWhitespace: rawValue !== rawValue.trim() }
    }
  }
  return {}
}

export function isPostgresUrl(value) {
  return Boolean(value && /^postgres(?:ql)?:\/\//i.test(value.trim()))
}

function maskHostname(hostname) {
  if (!hostname) return null
  const labels = hostname.split('.')
  const first = labels[0]
  const maskedFirst = first.length <= 8 ? `${first.slice(0, 2)}…` : `${first.slice(0, 5)}…${first.slice(-4)}`
  return `${maskedFirst}.${labels.slice(-2).join('.')}`
}

export function classifyDatabaseUrl(value) {
  if (!isPostgresUrl(value)) {
    return { valid: false, provider: 'unsupported', connectionType: 'unknown', sslEnabled: false }
  }

  try {
    const url = new URL(value)
    const hostname = url.hostname.toLowerCase()
    const isNeon = hostname.endsWith('.neon.tech')
    const isSupabase = hostname.endsWith('.supabase.co')
    const isPooled = isNeon && /-pooler\./.test(hostname)
    const normalizedHostname = isNeon ? hostname.replace(/-pooler(?=\.)/, '') : hostname
    const databaseName = decodeURIComponent(url.pathname.replace(/^\//, ''))
    const sslMode = url.searchParams.get('sslmode')?.toLowerCase()
    const sslEnabled = sslMode === 'require' || sslMode === 'verify-ca' || sslMode === 'verify-full'

    return {
      valid: true,
      provider: isNeon ? 'neon' : isSupabase ? 'supabase' : 'postgresql',
      connectionType: isPooled ? 'pooled' : 'direct',
      sslEnabled,
      maskedHostname: maskHostname(hostname),
      environmentKey: `${normalizedHostname}/${databaseName}`,
      databaseName,
    }
  } catch {
    return { valid: false, provider: 'unsupported', connectionType: 'unknown', sslEnabled: false }
  }
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
  const production = getDeploymentEnvironment(env) === 'production'
  const pooledCandidates = production ? ['PRODUCTION_NEON_DATABASE_URL'] : POOLED_DATABASE_CANDIDATES
  const directCandidates = production
    ? ['PRODUCTION_NEON_DATABASE_URL_UNPOOLED']
    : DIRECT_DATABASE_CANDIDATES
  const pooled = firstConfigured(env, pooledCandidates)
  const direct = firstConfigured(env, directCandidates)
  return {
    databaseUrl: pooled.value,
    databaseUrlSource: pooled.key,
    databaseUrlHasOuterWhitespace: pooled.hasOuterWhitespace ?? false,
    directUrl: direct.value,
    directUrlSource: direct.key,
    directUrlHasOuterWhitespace: direct.hasOuterWhitespace ?? false,
  }
}

export function describeDatabaseConfiguration(env = process.env) {
  const database = resolveDatabaseConfiguration(env)
  const pooled = classifyDatabaseUrl(database.databaseUrl)
  const direct = classifyDatabaseUrl(database.directUrl)
  return {
    deploymentEnvironment: getDeploymentEnvironment(env),
    runtime: {
      variable: database.databaseUrlSource ?? null,
      provider: pooled.provider,
      connectionType: pooled.connectionType,
      maskedHostname: pooled.maskedHostname ?? null,
      sslEnabled: pooled.sslEnabled,
    },
    migration: {
      variable: database.directUrlSource ?? null,
      provider: direct.provider,
      connectionType: direct.connectionType,
      maskedHostname: direct.maskedHostname ?? null,
      sslEnabled: direct.sslEnabled,
    },
    sameEnvironment: Boolean(pooled.environmentKey && pooled.environmentKey === direct.environmentKey),
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
  const pooled = classifyDatabaseUrl(database.databaseUrl)
  const direct = classifyDatabaseUrl(database.directUrl)
  const errors = []

  if (!isPostgresUrl(database.databaseUrl)) errors.push('DATABASE_URL must be a PostgreSQL connection URL')
  if (!isPostgresUrl(database.directUrl)) errors.push('DIRECT_URL or DATABASE_URL_UNPOOLED must be a direct PostgreSQL connection URL')
  if (database.databaseUrlHasOuterWhitespace) errors.push('DATABASE_URL must not contain surrounding whitespace')
  if (database.directUrlHasOuterWhitespace) errors.push(`${database.directUrlSource} must not contain surrounding whitespace`)
  if (pooled.provider !== 'neon') errors.push('DATABASE_URL must use Neon PostgreSQL')
  if (direct.provider !== 'neon') errors.push('The direct database URL must use Neon PostgreSQL')
  if (pooled.connectionType !== 'pooled') errors.push('DATABASE_URL must use a Neon pooled endpoint')
  if (direct.connectionType !== 'direct') errors.push('The migration URL must use a Neon direct endpoint')
  if (!pooled.sslEnabled || !direct.sslEnabled) errors.push('Neon database URLs must require SSL')
  if (pooled.environmentKey && direct.environmentKey && pooled.environmentKey !== direct.environmentKey) {
    errors.push('DATABASE_URL and the direct URL must target the same Neon endpoint and database')
  }
  if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) errors.push('SESSION_SECRET must contain at least 32 characters')
  if (!resolveApplicationUrl(env)) errors.push('NEXT_PUBLIC_APP_URL or a Vercel deployment URL is required')
  if (!['preview', 'production'].includes(deploymentEnvironment)) errors.push('VERCEL_ENV must be preview or production')
  if (deploymentEnvironment === 'preview' && env.RUN_PREVIEW_SEED === 'true' && !isStrongPassword(env.DEMO_SEED_PASSWORD)) {
    errors.push('DEMO_SEED_PASSWORD must be a strong password when RUN_PREVIEW_SEED=true')
  }

  return {
    valid: errors.length === 0,
    errors,
    deploymentEnvironment,
    ...database,
    diagnostic: describeDatabaseConfiguration(env),
  }
}
