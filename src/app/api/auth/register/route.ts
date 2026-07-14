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
  withSessionCookie,
} from '@/lib/auth'
import { formatValidationErrors, publicRegistrationSchema } from '@/validators/auth'

// POST /api/auth/register - public self-registration
export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PUBLIC_REGISTRATION !== 'true') {
      return err(403, 'Public registration is disabled', undefined, 'REGISTRATION_DISABLED')
    }

    const parsed = publicRegistrationSchema.safeParse(await readJson(req))
    if (!parsed.success) {
      return err(400, 'Invalid registration request', formatValidationErrors(parsed.error), 'INVALID_REQUEST')
    }
    const { email, username, password, firstName, lastName, middleName, phone } = parsed.data

    // Public self-registration always creates a learner. Staff accounts are
    // provisioned by an administrator via /api/users.
    const safeRole = 'learner'

    const emailStr = email
    const usernameStr = username
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
        passwordHash: hashPassword(password),
        role: safeRole,
        firstName,
        lastName,
        middleName: middleName || null,
        phone: phone || null,
        emailVerifiedAt: null,
      },
    })

    const token = await createSession(user.id, {
      ipAddress: getClientIp(req),
      deviceInfo: req.headers.get('user-agent') ?? undefined,
    })

    await logActivity(
      user.id,
      'register',
      'user',
      user.id,
      { role: safeRole },
      getClientIp(req),
      req.headers.get('user-agent') ?? undefined
    )

    return withSessionCookie(ok({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    }), token)
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
