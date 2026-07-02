import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import {
  createSession,
  destroySession,
  getSession,
  verifyPassword,
  logActivity,
  getClientIp,
  readJson,
  ok,
  err,
} from '@/lib/auth'

// POST /api/auth — login
// Returns a Bearer token in the response body. The client stores it in
// localStorage and sends it as "Authorization: Bearer <token>" on
// subsequent requests. This avoids all cookie/SameSite/third-party-cookie
// issues in iframe-embedded preview environments.
export async function POST(req: NextRequest) {
  try {
    const body = await readJson(req)
    const { email, password } = body as { email?: string; password?: string }

    if (!email || !password) {
      return err(400, 'Email va parol majburiy')
    }

    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      return err(401, 'Email yoki parol noto\'g\'ri')
    }

    if (!user.isActive) {
      return err(403, 'Hisobingiz bloklangan. Administratorga murojaat qiling.')
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return err(401, 'Email yoki parol noto\'g\'ri')
    }

    const token = await createSession(user.id)

    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    await logActivity(user.id, 'login', 'user', user.id, undefined, getClientIp(req), req.headers.get('user-agent') ?? undefined)

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

    // Return token in response body — client stores in localStorage
    return ok({ ...userData, token })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('Login error:', e)
    return err(500, 'Server xatosi')
  }
}

// DELETE /api/auth — logout
// Reads the Bearer token from the Authorization header and revokes the session.
export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') ?? ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined

    const session = await getSession(token)
    if (session) {
      await destroySession(token)
      await logActivity(session.user.id, 'logout', undefined, undefined, undefined, getClientIp(req))
    }

    return ok({ success: true })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('Logout error:', e)
    return err(500, 'Server xatosi')
  }
}
