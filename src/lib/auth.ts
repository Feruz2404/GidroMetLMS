// Auth utilities for GidroEdu LMS
// Token-based auth using Bearer token in Authorization header.
// Token is stored in localStorage on the client and sent as
// "Authorization: Bearer <token>" — this avoids all cookie/SameSite/
// third-party-cookie-blocking issues in iframe-embedded preview environments.

import { db } from '@/lib/db'
import crypto from 'crypto'

export const SESSION_COOKIE = 'gidroedu_session' // kept for backward compat
export const SESSION_TTL_DAYS = 7

// Simple hash (NOT for production - demo only). TZ specifies Argon2id.
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const verify = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verify, 'hex'))
}

export function generateToken(): string {
  return crypto.randomBytes(48).toString('hex')
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
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)
  await db.userSession.create({
    data: {
      userId,
      refreshToken: token,
      expiresAt,
    },
  })
  return token
}

export async function getSession(token: string | undefined) {
  if (!token) return null
  const session = await db.userSession.findUnique({
    where: { refreshToken: token },
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
  await db.userSession.updateMany({
    where: { refreshToken: token, revokedAt: null },
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

// Client IP extraction from Next.js request
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const real = request.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}

// Standard API response helpers
export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return Response.json({ status: 'success', data, ...(meta ? { meta } : {}) })
}

export function err(statusCode: number, message: string, errors?: unknown) {
  return Response.json(
    {
      status: 'error',
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  )
}
