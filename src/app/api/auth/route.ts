import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import {
  createSession,
  hashPassword,
  verifyPassword,
  needsPasswordRehash,
  logActivity,
  getClientIp,
  handleApiError,
  logoutRequest,
  readJson,
  ok,
  err,
  withSessionCookie,
} from '@/lib/auth'
import { consumeRateLimit, resetRateLimit } from '@/lib/rate-limit'
import { formatValidationErrors, loginSchema } from '@/validators/auth'

// POST /api/auth - login
// Creates a server-side session and returns its opaque token only in a
// secure, HttpOnly cookie. Legacy bearer sessions are read-only migration
// compatibility and are never issued by this endpoint.
export async function POST(req: NextRequest) {
  try {
    const parsed = loginSchema.safeParse(await readJson(req))
    if (!parsed.success) return err(400, 'Invalid login request', formatValidationErrors(parsed.error), 'INVALID_REQUEST')
    const { email, password } = parsed.data
    const clientIp = getClientIp(req)
    const rateLimitKey = `${clientIp}:${email}`
    const limit = consumeRateLimit(rateLimitKey)
    if (!limit.allowed) {
      const response = err(429, 'Invalid email or password', undefined, 'TOO_MANY_ATTEMPTS')
      response.headers.set('Retry-After', String(limit.retryAfterSeconds))
      return response
    }

    const user = await db.user.findUnique({ where: { email } })
    if (!user || !user.isActive || !verifyPassword(password, user.passwordHash)) {
      return err(401, 'Invalid credentials', undefined, 'INVALID_CREDENTIALS')
    }

    const token = await createSession(user.id, {
      ipAddress: clientIp,
      deviceInfo: req.headers.get('user-agent') ?? undefined,
    })
    resetRateLimit(rateLimitKey)

    await db.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        ...(needsPasswordRehash(user.passwordHash) ? { passwordHash: hashPassword(password) } : {}),
      },
    })

    await logActivity(
      user.id,
      'login',
      'user',
      user.id,
      undefined,
      clientIp,
      req.headers.get('user-agent') ?? undefined
    )

    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      department: user.department,
      position: user.position,
      isActive: user.isActive,
      mustChangePassword: user.mustChangePassword,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    }

    return withSessionCookie(ok(userData), token)
  } catch (e) {
    return handleApiError('auth.login', e)
  }
}

// DELETE /api/auth - logout
export async function DELETE(req: NextRequest) {
  try {
    return await logoutRequest(req)
  } catch (e) {
    return handleApiError('auth.logout', e)
  }
}

export const dynamic = 'force-dynamic'
