import { PrismaClient } from '@prisma/client'
import { logServerEvent } from '@/lib/server-log'
import { describeDatabaseConfiguration, isPostgresUrl, resolveDatabaseConfiguration } from '@/lib/environment'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

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
  const database = resolveDatabaseConfiguration(env)
  return { url: database.databaseUrl, source: database.databaseUrlSource }
}

export function resolveDatabaseUrl(env = process.env): string | undefined {
  return resolveDatabaseUrlWithSource(env).url
}

export function isPostgresDatabaseUrl(url?: string): boolean {
  return isPostgresUrl(url)
}

export function isSupportedDatabaseUrl(url?: string): boolean {
  return isPostgresDatabaseUrl(url)
}

export function isDatabaseUrlConfigured(url?: string): boolean {
  return isPostgresDatabaseUrl(url)
}

export function getDatabaseConfigStatus(env = process.env) {
  const database = resolveDatabaseConfiguration(env)
  const diagnostic = describeDatabaseConfiguration(env)
  const url = database.databaseUrl

  return {
    databaseUrlConfigured: Boolean(url),
    databaseUrlSource: database.databaseUrlSource ?? null,
    databaseUrlSupported: isSupportedDatabaseUrl(url),
    databaseUrlProductionReady: isDatabaseUrlConfigured(url),
    productionRequiresPostgres: true,
    directUrlConfigured: isPostgresDatabaseUrl(database.directUrl),
    directUrlSource: database.directUrlSource ?? null,
    databaseProvider: diagnostic.runtime.provider,
    runtimeConnectionType: diagnostic.runtime.connectionType,
    migrationConnectionType: diagnostic.migration.connectionType,
    databaseSslEnabled: diagnostic.runtime.sslEnabled && diagnostic.migration.sslEnabled,
    sameDatabaseEnvironment: diagnostic.sameEnvironment,
  }
}

function getRuntimeDatabaseUrl(env = process.env): string {
  const { url } = resolveDatabaseUrlWithSource(env)

  if (!url) {
    throw new ServerConfigError(
      'No database URL configured. Set DATABASE_URL to a PostgreSQL URL in Vercel Project Settings.',
      'DATABASE_URL_MISSING'
    )
  }

  if (!isPostgresDatabaseUrl(url)) {
    throw new ServerConfigError(
      'Unsupported DATABASE_URL protocol. GidroEdu LMS requires PostgreSQL in every environment.',
      'DATABASE_URL_INVALID'
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
    provider: 'postgresql',
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
