import crypto from 'crypto'
import { db, getPrismaErrorDetails } from '@/lib/db'
import { logServerError } from '@/lib/server-log'
import { hasPermission, type Permission } from '@/server/auth/permissions'

export const SESSION_COOKIE = 'gidroedu_session'
export const SESSION_TTL_DAYS = 7
const MIN_SESSION_SECRET_LENGTH = 32
const PASSWORD_ALGORITHM = 'pbkdf2-sha256'
const PASSWORD_ITERATIONS = 600_000

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
    throw new AuthConfigError('No session secret configured.', 'SESSION_SECRET_MISSING')
  }
  if (secret.length < MIN_SESSION_SECRET_LENGTH) {
    throw new AuthConfigError(
      `SESSION_SECRET must be at least ${MIN_SESSION_SECRET_LENGTH} characters.`,
      'SESSION_SECRET_TOO_SHORT'
    )
  }
  return secret
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, 64, 'sha256').toString('hex')
  return `${PASSWORD_ALGORITHM}$${PASSWORD_ITERATIONS}$${salt}$${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const modern = stored.split('$')
  let salt: string
  let hash: string
  let iterations: number
  let digest: 'sha256' | 'sha512'

  if (modern.length === 4 && modern[0] === PASSWORD_ALGORITHM) {
    iterations = Number(modern[1])
    salt = modern[2]
    hash = modern[3]
    digest = 'sha256'
  } else {
    const legacy = stored.split(':')
    if (legacy.length !== 2) return false
    ;[salt, hash] = legacy
    iterations = 100_000
    digest = 'sha512'
  }

  if (!salt || !hash || !Number.isSafeInteger(iterations) || iterations < 100_000) return false
  if (!/^[a-f0-9]+$/i.test(hash)) return false
  const verify = crypto.pbkdf2Sync(password, salt, iterations, 64, digest).toString('hex')
  const storedHash = Buffer.from(hash, 'hex')
  const verifyHash = Buffer.from(verify, 'hex')
  return storedHash.length === verifyHash.length && crypto.timingSafeEqual(storedHash, verifyHash)
}

export function needsPasswordRehash(stored: string): boolean {
  const [algorithm, iterations] = stored.split('$')
  return algorithm !== PASSWORD_ALGORITHM || Number(iterations) < PASSWORD_ITERATIONS
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

export async function createSession(
  userId: string,
  context: { deviceInfo?: string; ipAddress?: string } = {}
): Promise<string> {
  const token = generateToken()
  const refreshToken = hashSessionToken(token)
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)
  await db.userSession.create({
    data: {
      userId,
      refreshToken,
      expiresAt,
      deviceInfo: context.deviceInfo?.slice(0, 500),
      ipAddress: context.ipAddress?.slice(0, 64),
    },
  })
  return token
}

export async function getSession(token: string | undefined) {
  if (!token) return null
  const refreshToken = hashSessionToken(token)
  const session = await db.userSession.findUnique({ where: { refreshToken }, include: { user: true } })
  if (!session || session.revokedAt || session.expiresAt < new Date() || !session.user.isActive) return null
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

export function extractToken(req?: Request | { headers?: Headers }): string | undefined {
  const auth = req?.headers?.get('authorization') ?? req?.headers?.get('Authorization')
  const match = auth?.match(/^Bearer\s+([A-Fa-f0-9]{96})$/)
  return match?.[1]
}

export function extractSessionCookie(req?: Request | { headers?: Headers }): string | undefined {
  const cookie = req?.headers?.get('cookie')
  if (!cookie) return undefined
  for (const part of cookie.split(';')) {
    const [name, ...valueParts] = part.trim().split('=')
    if (name === SESSION_COOKIE) {
      const value = decodeURIComponent(valueParts.join('='))
      return /^[A-Fa-f0-9]{96}$/.test(value) ? value : undefined
    }
  }
  return undefined
}

export function getRequestSessionToken(req?: Request | { headers?: Headers }) {
  const bearer = extractToken(req)
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
    `Max-Age=${SESSION_TTL_DAYS * 24 * 60 * 60}`,
  ]
  if (secure) attributes.push('Secure')
  return attributes.join('; ')
}

export function serializeExpiredSessionCookie(secure = process.env.NODE_ENV === 'production'): string {
  const attributes = [`${SESSION_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0']
  if (secure) attributes.push('Secure')
  return attributes.join('; ')
}

export function withSessionCookie<T extends Response>(response: T, token: string): T {
  response.headers.append('Set-Cookie', serializeSessionCookie(token))
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export function withExpiredSessionCookie<T extends Response>(response: T): T {
  response.headers.append('Set-Cookie', serializeExpiredSessionCookie())
  response.headers.set('Cache-Control', 'no-store')
  return response
}

function isTrustedMutation(req?: Request | { headers?: Headers; method?: string; url?: string }): boolean {
  const method = req?.method?.toUpperCase() ?? 'GET'
  if (['GET', 'HEAD', 'OPTIONS'].includes(method) || extractToken(req)) return true
  if (req?.headers?.get('sec-fetch-site') === 'cross-site') return false

  const origin = req?.headers?.get('origin')
  if (!origin) return true

  try {
    const requestUrl = req && 'url' in req && req.url ? new URL(req.url) : null
    const configuredUrl = process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL) : null
    return origin === requestUrl?.origin || origin === configuredUrl?.origin
  } catch {
    return false
  }
}

export async function getCurrentUser(req?: Request | { headers?: Headers }) {
  const { token, source } = getRequestSessionToken(req)
  if (source === 'cookie' && !isTrustedMutation(req)) return null
  const session = await getSession(token)
  return session?.user ?? null
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

export async function requirePermission(req: Request | { headers?: Headers }, permission: Permission) {
  const user = await requireAuth(req)
  if (!hasPermission(user.role, permission)) throw new Error('FORBIDDEN')
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
  const { token } = getRequestSessionToken(req)
  const session = await getSession(token)
  if (session) {
    await destroySession(token)
    await logActivity(session.user.id, 'logout', undefined, undefined, undefined, getClientIp(req))
  }
  return withExpiredSessionCookie(ok({ success: true }))
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim().slice(0, 64)
  return (request.headers.get('x-real-ip') || 'unknown').slice(0, 64)
}

export async function readJson<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    const body = await req.json()
    return (body ?? {}) as T
  } catch {
    return {} as T
  }
}

export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return Response.json({ status: 'success', data, ...(meta ? { meta } : {}) })
}

export function err(statusCode: number, message: string, errors?: unknown, code?: string) {
  return Response.json(
    { status: 'error', statusCode, ...(code ? { code } : {}), message, errors, timestamp: new Date().toISOString() },
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
