import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import {
  createSession,
  verifyPassword,
  logActivity,
  getClientIp,
  handleApiError,
  logoutRequest,
  readJson,
  ok,
  err,
} from '@/lib/auth'

// POST /api/auth - login
// Returns a Bearer token in the response body. The client stores it in
// localStorage and sends it as "Authorization: Bearer <token>" on
// subsequent requests.
export async function POST(req: NextRequest) {
  try {
    const body = await readJson(req)
    const { email, password } = body as { email?: string; password?: string }

    if (!email || !password) {
      return err(400, 'Missing credentials', undefined, 'MISSING_CREDENTIALS')
    }

    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      return err(401, 'Invalid credentials', undefined, 'INVALID_CREDENTIALS')
    }

    if (!user.isActive) {
      return err(403, 'Account blocked', undefined, 'ACCOUNT_BLOCKED')
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return err(401, 'Invalid credentials', undefined, 'INVALID_CREDENTIALS')
    }

    const token = await createSession(user.id)

    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    await logActivity(
      user.id,
      'login',
      'user',
      user.id,
      undefined,
      getClientIp(req),
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
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    }

    return ok({ ...userData, token })
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
