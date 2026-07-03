// Auth utilities for GidroEdu LMS
// Token-based auth using Bearer token in Authorization header.
// Token is stored in localStorage on the client and sent as
// "Authorization: Bearer <token>" — this avoids all cookie/SameSite/
// third-party-cookie-blocking issues in iframe-embedded preview environments.

import { db, getPrismaErrorDetails } from '@/lib/db'
import { logServerError } from '@/lib/server-log'
import crypto from 'crypto'

export const SESSION_COOKIE = 'gidroedu_session' // kept for backward compat
export const SESSION_TTL_DAYS = 7
const MIN_SESSION_SECRET_LENGTH = 32

export class AuthConfigError extends Error {
  statusCode = 503

  constructor(
    message: string,
    public code = 'SESSION_SECRET_MISSING'
  ) {
    super(message)
    this.name = 'AuthConfigError'
  }
}

export function getSessionSecret(env = process.env): string | undefined {
  const secret = env.SESSION_SECRET || env.AUTH_SECRET || env.NEXTAUTH_SECRET || env.JWT_SECRET
  return typeof secret === 'string' && secret.trim() ? secret.trim() : undefined
}

export function isSessionSecretConfigured(env = process.env): boolean {
  const secret = getSessionSecret(env)
  return Boolean(secret && secret.length >= MIN_SESSION_SECRET_LENGTH)
}

function requireSessionSecret(): string {
  const secret = getSessionSecret()
  if (!secret) {
    throw new AuthConfigError(
      'No session secret configured. Set SESSION_SECRET in Vercel Project Settings.',
      'SESSION_SECRET_MISSING'
    )
  }
  if (secret.length < MIN_SESSION_SECRET_LENGTH) {
    throw new AuthConfigError(
      `SESSION_SECRET must be at least ${MIN_SESSION_SECRET_LENGTH} characters.`,
      'SESSION_SECRET_TOO_SHORT'
    )
  }
  return secret
}

// Simple hash (NOT for production - demo only). TZ specifies Argon2id.
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  if (!/^[a-f0-9]+$/i.test(hash)) return false
  const verify = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  const storedHash = Buffer.from(hash, 'hex')
  const verifyHash = Buffer.from(verify, 'hex')
  if (storedHash.length !== verifyHash.length) return false
  return crypto.timingSafeEqual(storedHash, verifyHash)
}

export function generateToken(): string {
  return crypto.randomBytes(48).toString('hex')
}

function hashSessionToken(token: string): string {
  return crypto.createHmac('sha256', requireSessionSecret()).update(token).digest('hex')
}

export function generateCertNumber(): string {
  const now = new Date()
  const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase()
  return `SRT-${ym}-${rand}`
}

export function generateVerifyHash(): string {
  return crypto.randomBytes(20).toString('hex')
}

// Session management
export async function createSession(userId: string): Promise<string> {
  const token = generateToken()
  const refreshToken = hashSessionToken(token)
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)
  await db.userSession.create({
    data: {
      userId,
      refreshToken,
      expiresAt,
    },
  })
  return token
}

export async function getSession(token: string | undefined) {
  if (!token) return null
  const refreshToken = hashSessionToken(token)
  const session = await db.userSession.findUnique({
    where: { refreshToken },
    include: { user: true },
  })
  if (!session) return null
  if (session.revokedAt) return null
  if (session.expiresAt < new Date()) return null
  if (!session.user.isActive) return null
  return session
}

export async function destroySession(token: string | undefined): Promise<void> {
  if (!token) return
  const refreshToken = hashSessionToken(token)
  await db.userSession.updateMany({
    where: { refreshToken, revokedAt: null },
    data: { revokedAt: new Date() },
  })
}

/**
 * Extract the Bearer token from a Request's Authorization header.
 * Works with both NextRequest (API routes) and plain Request objects.
 */
export function extractToken(req?: Request | { headers?: Headers }): string | undefined {
  if (!req?.headers) return undefined
  const auth = req.headers.get('authorization') ?? req.headers.get('Authorization')
  if (!auth) return undefined
  // Support "Bearer <token>" format
  if (auth.startsWith('Bearer ')) return auth.slice(7)
  return auth
}

/**
 * Get the current authenticated user from a Bearer token in the
 * Authorization header. Used by all API routes.
 */
export async function getCurrentUser(req?: Request | { headers?: Headers }) {
  const token = extractToken(req)
  const session = await getSession(token)
  if (!session) return null
  return session.user
}

export async function requireAuth(req?: Request | { headers?: Headers }) {
  const user = await getCurrentUser(req)
  if (!user) throw new Error('UNAUTHORIZED')
  return user
}

export async function requireRole(req: Request | { headers?: Headers }, ...roles: string[]) {
  const user = await requireAuth(req)
  if (!roles.includes(user.role)) throw new Error('FORBIDDEN')
  return user
}

export async function logActivity(
  userId: string,
  action: string,
  entity?: string,
  entityId?: string,
  metadata?: Record<string, unknown>,
  ipAddress?: string,
  userAgent?: string
) {
  await db.activityLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      metadata: metadata ? JSON.stringify(metadata) : null,
      ipAddress,
      userAgent,
    },
  })
}

export async function logoutRequest(req: Request) {
  const token = extractToken(req)
  const session = await getSession(token)
  if (session) {
    await destroySession(token)
    await logActivity(session.user.id, 'logout', undefined, undefined, undefined, getClientIp(req))
  }

  return ok({ success: true })
}

// Client IP extraction from Next.js request
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const real = request.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}

/**
 * Safely parse a JSON request body. Returns `{}` for an empty or malformed
 * body instead of throwing, so routes surface their own field-validation
 * errors (400) rather than a generic 500 from an unparsable body.
 */
export async function readJson<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    const body = await req.json()
    return (body ?? {}) as T
  } catch {
    return {} as T
  }
}

// Standard API response helpers
export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return Response.json({ status: 'success', data, ...(meta ? { meta } : {}) })
}

export function err(statusCode: number, message: string, errors?: unknown, code?: string) {
  return Response.json(
    {
      status: 'error',
      statusCode,
      ...(code ? { code } : {}),
      message,
      errors,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  )
}

export function handleApiError(context: string, error: unknown) {
  const details = getPrismaErrorDetails(error)

  if (error instanceof AuthConfigError || details.isConfigIssue) {
    logServerError(context, error, { category: 'configuration', code: details.code })
    return err(503, 'Server configuration error', undefined, 'SERVER_CONFIG_ERROR')
  }

  if (details.isConnectionIssue) {
    logServerError(context, error, { category: 'database_connection', code: details.code })
    return err(503, 'Database connection error', undefined, 'DATABASE_CONNECTION_ERROR')
  }

  if (details.isSchemaIssue) {
    logServerError(context, error, { category: 'database_schema', code: details.code })
    return err(503, 'Database schema error', undefined, 'DATABASE_SCHEMA_ERROR')
  }

  logServerError(context, error, { category: 'unhandled', code: details.code })
  return err(500, 'Server error', undefined, 'INTERNAL_SERVER_ERROR')
}
