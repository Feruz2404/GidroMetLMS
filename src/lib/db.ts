import { PrismaClient } from '@prisma/client'
import { logServerEvent } from '@/lib/server-log'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const DATABASE_URL_CANDIDATES = [
  'DATABASE_URL',
  'POSTGRES_PRISMA_URL',
  'POSTGRES_URL',
  'POSTGRES_URL_NON_POOLING',
  'DIRECT_URL',
] as const

export class ServerConfigError extends Error {
  statusCode = 503

  constructor(
    message: string,
    public code = 'SERVER_CONFIG_ERROR'
  ) {
    super(message)
    this.name = 'ServerConfigError'
  }
}

export function resolveDatabaseUrlWithSource(env = process.env): { url?: string; source?: string } {
  for (const key of DATABASE_URL_CANDIDATES) {
    const candidate = env[key]
    if (typeof candidate === 'string' && candidate.trim()) {
      return { url: candidate.trim(), source: key }
    }
  }

  return {}
}

export function resolveDatabaseUrl(env = process.env): string | undefined {
  return resolveDatabaseUrlWithSource(env).url
}

export function isPostgresDatabaseUrl(url?: string): boolean {
  return Boolean(url && /^(postgres(?:ql)?:\/\/)/i.test(url.trim()))
}

export function isSqliteDatabaseUrl(url?: string): boolean {
  return Boolean(url && /^file:/i.test(url.trim()))
}

export function isSupportedDatabaseUrl(url?: string): boolean {
  return isPostgresDatabaseUrl(url) || isSqliteDatabaseUrl(url)
}

export function isDatabaseUrlConfigured(url?: string): boolean {
  return isPostgresDatabaseUrl(url)
}

function requiresProductionDatabase(env = process.env): boolean {
  return env.NODE_ENV === 'production' || env.VERCEL === '1'
}

export function getDatabaseConfigStatus(env = process.env) {
  const { url, source } = resolveDatabaseUrlWithSource(env)
  const productionRequiresPostgres = requiresProductionDatabase(env)

  return {
    databaseUrlConfigured: Boolean(url),
    databaseUrlSource: source ?? null,
    databaseUrlSupported: isSupportedDatabaseUrl(url),
    databaseUrlProductionReady: isDatabaseUrlConfigured(url),
    productionRequiresPostgres,
    directUrlConfigured: Boolean(env.DIRECT_URL || env.POSTGRES_URL_NON_POOLING),
  }
}

function getRuntimeDatabaseUrl(env = process.env): string {
  const { url, source } = resolveDatabaseUrlWithSource(env)

  if (!url) {
    throw new ServerConfigError(
      'No database URL configured. Set DATABASE_URL to a PostgreSQL URL in Vercel Project Settings.',
      'DATABASE_URL_MISSING'
    )
  }

  if (!isSupportedDatabaseUrl(url)) {
    throw new ServerConfigError(
      'Unsupported DATABASE_URL protocol. Use postgresql:// in production or file: for local SQLite development.',
      'DATABASE_URL_INVALID'
    )
  }

  if (requiresProductionDatabase(env) && !isPostgresDatabaseUrl(url)) {
    throw new ServerConfigError(
      `Production database URL must be PostgreSQL. ${source ?? 'DATABASE_URL'} is not production-ready.`,
      'DATABASE_URL_NOT_PRODUCTION_READY'
    )
  }

  return url
}

export function getPrismaErrorDetails(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown database error'
  const code = typeof error === 'object' && error !== null && 'code' in error ? String((error as { code?: unknown }).code) : undefined
  const isConfigIssue =
    error instanceof ServerConfigError ||
    /Environment variable not found|No database URL configured|Unsupported DATABASE_URL|DATABASE_URL/i.test(message)
  const isConnectionIssue = Boolean(
    (code && ['P1000', 'P1001', 'P1002', 'P1003', 'P1010', 'P1011', 'P1012', 'P1013', 'P1014', 'P1015', 'P1016', 'P1017', 'P2001'].includes(code)) ||
      /Can't reach database|Timed out|ECONNREFUSED|ENOTFOUND|connection/i.test(message)
  )
  const isSchemaIssue = Boolean(code && ['P2021', 'P2022'].includes(code))

  return { code, message, isConfigIssue, isConnectionIssue, isSchemaIssue }
}

function createPrismaClient(): PrismaClient {
  const databaseUrl = getRuntimeDatabaseUrl()
  process.env.DATABASE_URL = databaseUrl
  logServerEvent('info', 'db.prisma.init', {
    databaseUrlSource: resolveDatabaseUrlWithSource().source,
    provider: isPostgresDatabaseUrl(databaseUrl) ? 'postgresql' : 'sqlite',
  })

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: { db: { url: databaseUrl } },
  })
}

export function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getDb()
    const value = Reflect.get(client, prop, receiver)
    return typeof value === 'function' ? value.bind(client) : value
  },
})
