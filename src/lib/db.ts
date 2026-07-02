import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function resolveDatabaseUrl(env = process.env): string | undefined {
  const candidates = [
    env.DATABASE_URL,
    env.DIRECT_URL,
    env.POSTGRES_PRISMA_URL,
    env.POSTGRES_URL,
    env.POSTGRES_URL_NON_POOLING,
  ]

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim()
    }
  }

  return undefined
}

export function isDatabaseUrlConfigured(url?: string): boolean {
  if (!url) return false
  return /^(postgres(?:ql)?:\/\/)/i.test(url.trim())
}

export function getPrismaErrorDetails(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown database error'
  const code = typeof error === 'object' && error !== null && 'code' in error ? String((error as { code?: unknown }).code) : undefined
  const isConnectionIssue = Boolean(
    code && ['P1000', 'P1001', 'P1002', 'P1003', 'P1010', 'P1011', 'P1012', 'P1013', 'P1014', 'P1015', 'P1016', 'P1017', 'P2001', 'P2021'].includes(code)
  )

  return { code, message, isConnectionIssue }
}

const databaseUrl = resolveDatabaseUrl()

if (databaseUrl) {
  process.env.DATABASE_URL = databaseUrl
}

if (!databaseUrl) {
  console.warn('[db] No database URL configured. Expected DATABASE_URL or a Vercel Postgres variable.')
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: databaseUrl && isDatabaseUrlConfigured(databaseUrl)
      ? { db: { url: databaseUrl } }
      : undefined,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db