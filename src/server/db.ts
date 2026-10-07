import { PrismaClient } from '@prisma/client'
import { logServerEvent } from '@/server/log'
import {
  describeDatabaseConfiguration,
  isPostgresUrl,
  resolveDatabaseConfiguration,
} from '@/server/config/environment'

export class ServerConfigError extends Error {
  readonly statusCode = 503

  constructor(
    message: string,
    readonly code = 'SERVER_CONFIG_ERROR'
  ) {
    super(message)
    this.name = 'ServerConfigError'
  }
}

export function isSupportedDatabaseUrl(url?: string): boolean {
  return isPostgresUrl(url)
}

/** Every environment runs on PostgreSQL, so "supported" and "configured" are the same check. */
export const isDatabaseUrlConfigured = isSupportedDatabaseUrl

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
    directUrlConfigured: isSupportedDatabaseUrl(database.directUrl),
    directUrlSource: database.directUrlSource ?? null,
    databaseProvider: diagnostic.runtime.provider,
    runtimeConnectionType: diagnostic.runtime.connectionType,
    migrationConnectionType: diagnostic.migration.connectionType,
    databaseSslEnabled: diagnostic.runtime.sslEnabled && diagnostic.migration.sslEnabled,
    sameDatabaseEnvironment: diagnostic.sameEnvironment,
  }
}

function getRuntimeDatabaseUrl(env = process.env): string {
  const { databaseUrl } = resolveDatabaseConfiguration(env)
  if (!databaseUrl) {
    throw new ServerConfigError('No database URL configured. Set DATABASE_URL to a PostgreSQL URL.', 'DATABASE_URL_MISSING')
  }
  if (!isSupportedDatabaseUrl(databaseUrl)) {
    throw new ServerConfigError('GidroEdu LMS requires PostgreSQL in every environment.', 'DATABASE_URL_INVALID')
  }
  return databaseUrl
}

export interface PrismaErrorDetails {
  code?: string
  message: string
  isConfigIssue: boolean
  isConnectionIssue: boolean
  isSchemaIssue: boolean
}

const CONNECTION_ERROR_CODES = new Set([
  'P1000', 'P1001', 'P1002', 'P1003', 'P1010', 'P1011', 'P1012', 'P1013', 'P1014', 'P1015', 'P1016', 'P1017', 'P2001',
])

export function getPrismaErrorDetails(error: unknown): PrismaErrorDetails {
  const message = error instanceof Error ? error.message : 'Unknown database error'
  const code =
    typeof error === 'object' && error !== null && 'code' in error ? String((error as { code?: unknown }).code) : undefined
  return {
    code,
    message,
    isConfigIssue:
      error instanceof ServerConfigError ||
      /Environment variable not found|No database URL configured|DATABASE_URL/i.test(message),
    isConnectionIssue:
      Boolean(code && CONNECTION_ERROR_CODES.has(code)) || /Can't reach database|Timed out|ECONNREFUSED|ENOTFOUND/i.test(message),
    isSchemaIssue: code === 'P2021' || code === 'P2022',
  }
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient(): PrismaClient {
  const databaseUrl = getRuntimeDatabaseUrl()
  // Production resolves the URL from PRODUCTION_NEON_DATABASE_URL; the schema's
  // datasource still names DATABASE_URL, so keep both in sync.
  process.env.DATABASE_URL = databaseUrl
  logServerEvent('info', 'db.prisma.init', {
    databaseUrlSource: resolveDatabaseConfiguration().databaseUrlSource,
    provider: 'postgresql',
  })
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: { db: { url: databaseUrl } },
  })
}

export function getDb(): PrismaClient {
  globalForPrisma.prisma ??= createPrismaClient()
  return globalForPrisma.prisma
}

/**
 * Lazily-initialised Prisma client. Importing this module never connects or
 * validates configuration; the first query does. That keeps `next build` and
 * unit tests independent of a database.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getDb()
    const value = Reflect.get(client, property, receiver)
    return typeof value === 'function' ? value.bind(client) : value
  },
})

export type Db = PrismaClient
export type Tx = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0]
