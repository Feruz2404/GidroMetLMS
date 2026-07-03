import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import {
  createSession,
  handleApiError,
  hashPassword,
  logActivity,
  getClientIp,
  readJson,
  ok,
  err,
} from '@/lib/auth'

// POST /api/auth/register - public self-registration
export async function POST(req: NextRequest) {
  try {
    const body = await readJson(req)
    const {
      email,
      username,
      password,
      role,
      firstName,
      lastName,
      middleName,
      phone,
      department,
      position,
    } = body as Record<string, unknown>

    if (!email || !username || !password || !firstName || !lastName) {
      return err(400, 'Missing required fields', undefined, 'MISSING_FIELDS')
    }

    if (String(password).length < 6) {
      return err(400, 'Password must be at least 6 characters', undefined, 'PASSWORD_TOO_SHORT')
    }

    // Public self-registration always creates a student. Tutor/admin accounts
    // are provisioned by an administrator via /api/users.
    void role
    const safeRole = 'student'

    const emailStr = String(email).trim().toLowerCase()
    const usernameStr = String(username).trim()
    const existing = await db.user.findFirst({
      where: { OR: [{ email: emailStr }, { username: usernameStr }] },
    })
    if (existing) {
      return err(409, 'Email or username already exists', undefined, 'USER_EXISTS')
    }

    const user = await db.user.create({
      data: {
        email: emailStr,
        username: usernameStr,
        passwordHash: hashPassword(String(password)),
        role: safeRole,
        firstName: String(firstName),
        lastName: String(lastName),
        middleName: middleName ? String(middleName) : null,
        phone: phone ? String(phone) : null,
        department: department ? String(department) : null,
        position: position ? String(position) : null,
        emailVerifiedAt: new Date(),
      },
    })

    const token = await createSession(user.id)

    await logActivity(
      user.id,
      'register',
      'user',
      user.id,
      { role: safeRole },
      getClientIp(req),
      req.headers.get('user-agent') ?? undefined
    )

    return ok({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
    })
  } catch (e) {
    return handleApiError('auth.register', e)
  }
}

// GET /api/auth/oneid - OneID OAuth2 redirect placeholder
export async function GET() {
  const oneIdEnabled = process.env.ONEID_CLIENT_ID && process.env.ONEID_CLIENT_SECRET
  if (!oneIdEnabled) {
    return err(503, 'OneID is not configured', undefined, 'ONEID_NOT_CONFIGURED')
  }

  return err(501, 'OneID integration is not implemented', undefined, 'ONEID_NOT_IMPLEMENTED')
}

export const dynamic = 'force-dynamic'
