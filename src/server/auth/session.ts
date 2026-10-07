import crypto from 'node:crypto'
import type { User } from '@prisma/client'
import { db } from '@/server/db'
import { resolveApplicationUrl } from '@/server/config/environment'

export const SESSION_COOKIE = 'gidroedu_session'
export const SESSION_TTL_DAYS = 7
const SESSION_TTL_MS = SESSION_TTL_DAYS * 24 * 60 * 60 * 1000
const MIN_SECRET_LENGTH = 32
const TOKEN_PATTERN = /^[A-Fa-f0-9]{96}$/

export type SessionUser = User

export class AuthConfigError extends Error {
  readonly statusCode = 503

  constructor(
    message: string,
    readonly code = 'SESSION_SECRET_MISSING'
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
  return (getSessionSecret(env)?.length ?? 0) >= MIN_SECRET_LENGTH
}

function requireSessionSecret(): string {
  const secret = getSessionSecret()
  if (!secret) throw new AuthConfigError('No session secret configured.')
  if (secret.length < MIN_SECRET_LENGTH) {
    throw new AuthConfigError(`SESSION_SECRET must be at least ${MIN_SECRET_LENGTH} characters.`, 'SESSION_SECRET_TOO_SHORT')
  }
  return secret
}

/** Only an HMAC of the opaque token is stored, so a database leak cannot be replayed. */
function hashToken(token: string): string {
  return crypto.createHmac('sha256', requireSessionSecret()).update(token).digest('hex')
}

export async function createSession(userId: string, context: { deviceInfo?: string; ipAddress?: string } = {}) {
  const token = crypto.randomBytes(48).toString('hex')
  await db.userSession.create({
    data: {
      userId,
      refreshToken: hashToken(token),
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
      deviceInfo: context.deviceInfo?.slice(0, 500),
      ipAddress: context.ipAddress?.slice(0, 64),
    },
  })
  return token
}

export async function findSessionUser(token: string | undefined): Promise<SessionUser | null> {
  if (!token || !TOKEN_PATTERN.test(token)) return null
  const session = await db.userSession.findUnique({ where: { refreshToken: hashToken(token) }, include: { user: true } })
  if (!session || session.revokedAt || session.expiresAt < new Date() || !session.user.isActive) return null
  return session.user
}

export async function revokeSession(token: string | undefined): Promise<void> {
  if (!token || !TOKEN_PATTERN.test(token)) return
  await db.userSession.updateMany({ where: { refreshToken: hashToken(token), revokedAt: null }, data: { revokedAt: new Date() } })
}

export async function revokeAllSessions(userId: string, exceptToken?: string): Promise<void> {
  await db.userSession.updateMany({
    where: { userId, revokedAt: null, ...(exceptToken ? { NOT: { refreshToken: hashToken(exceptToken) } } : {}) },
    data: { revokedAt: new Date() },
  })
}

// --- Token transport -------------------------------------------------------

type HeaderSource = { headers?: Headers }

/** API clients (scripts, tests) may authenticate with `Authorization: Bearer <token>`. */
export function extractBearerToken(req?: HeaderSource): string | undefined {
  const match = req?.headers?.get('authorization')?.match(/^Bearer\s+([A-Fa-f0-9]{96})$/)
  return match?.[1]
}

export function readCookie(cookieHeader: string | null | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined
  for (const part of cookieHeader.split(';')) {
    const [key, ...value] = part.trim().split('=')
    if (key === name) return decodeURIComponent(value.join('='))
  }
  return undefined
}

export function extractSessionCookie(req?: HeaderSource): string | undefined {
  const value = readCookie(req?.headers?.get('cookie'), SESSION_COOKIE)
  return value && TOKEN_PATTERN.test(value) ? value : undefined
}

export function getRequestToken(req?: HeaderSource) {
  const bearer = extractBearerToken(req)
  if (bearer) return { token: bearer, source: 'bearer' as const }
  const cookie = extractSessionCookie(req)
  return cookie ? { token: cookie, source: 'cookie' as const } : { token: undefined, source: 'none' as const }
}

export function serializeSessionCookie(token: string, secure = process.env.NODE_ENV === 'production'): string {
  const attributes = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_TTL_MS / 1000}`,
  ]
  if (secure) attributes.push('Secure')
  return attributes.join('; ')
}

export function serializeExpiredSessionCookie(secure = process.env.NODE_ENV === 'production'): string {
  const attributes = [`${SESSION_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0']
  if (secure) attributes.push('Secure')
  return attributes.join('; ')
}

export function withSessionCookie(response: Response, token: string): Response {
  response.headers.append('Set-Cookie', serializeSessionCookie(token))
  return response
}

export function withExpiredSessionCookie(response: Response): Response {
  response.headers.append('Set-Cookie', serializeExpiredSessionCookie())
  return response
}

/**
 * Cookie-authenticated mutations must come from our own origin. Bearer
 * requests are exempt because browsers never attach that header cross-site.
 */
export function isTrustedRequest(req: { headers?: Headers; method?: string; url?: string }): boolean {
  const method = req.method?.toUpperCase() ?? 'GET'
  if (['GET', 'HEAD', 'OPTIONS'].includes(method) || extractBearerToken(req)) return true
  if (req.headers?.get('sec-fetch-site') === 'cross-site') return false

  const origin = req.headers?.get('origin')
  if (!origin) return true
  try {
    const requestOrigin = req.url ? new URL(req.url).origin : null
    const configured = resolveApplicationUrl()
    return origin === requestOrigin || (configured ? origin === new URL(configured).origin : false)
  } catch {
    return false
  }
}
