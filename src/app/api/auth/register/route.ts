import { NextRequest } from 'next/server'
import { db, getPrismaErrorDetails } from '@/lib/db'
import {
  createSession,
  hashPassword,
  logActivity,
  getClientIp,
  readJson,
  ok,
  err,
} from '@/lib/auth'

// POST /api/auth/register — public self-registration
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

    // Validation
    if (!email || !username || !password || !firstName || !lastName) {
      return err(400, 'Majburiy maydonlar: email, username, password, firstName, lastName')
    }
    if (String(password).length < 6) {
      return err(400, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak')
    }
    // Public self-registration always creates a student. Tutor/admin accounts
    // are provisioned by an administrator via /api/users. Honoring a client-
    // supplied role here would let anyone self-grant elevated (tutor) access by
    // calling the API directly (the UI only ever offers "student").
    void role
    const safeRole = 'student'

    // Check for existing email/username
    const emailStr = String(email)
    const usernameStr = String(username)
    const existing = await db.user.findFirst({
      where: { OR: [{ email: emailStr }, { username: usernameStr }] },
    })
    if (existing) {
      return err(409, 'Bu email yoki username allaqachon mavjud')
    }

    // Create user
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
        emailVerifiedAt: new Date(), // TODO: send verification email via Nodemailer
      },
    })

    // Create session token
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
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }

    const { code, message, isConnectionIssue } = getPrismaErrorDetails(e)
    if (isConnectionIssue) {
      console.error('Register database error:', { code, message })
      return err(503, 'Ro\'yxatdan o\'tish xizmati vaqtincha mavjud emas. Iltimos, bir ozdan keyin qayta urinib ko\'ring.')
    }

    console.error('Register error:', { error: e, code, message })
    return err(500, 'Server xatosi')
  }
}

// GET /api/auth/oneid — OneID OAuth2 redirect (placeholder)
// TODO: When OneID credentials are available in .env, implement full OAuth2 flow:
// 1. Generate state token, store in session
// 2. Redirect to ONEID_AUTH_URL with client_id, redirect_uri, scope, state
// 3. User authenticates on sso.egov.uz
// 4. Callback to /api/auth/oneid/callback
export async function GET() {
  const oneIdEnabled = process.env.ONEID_CLIENT_ID && process.env.ONEID_CLIENT_SECRET
  if (!oneIdEnabled) {
    return err(503, 'OneID hozircha mavjud emas. Credential sozlanmagani.')
  }
  // Real redirect would be:
  // const state = generateToken()
  // const authUrl = `${process.env.ONEID_AUTH_URL}?client_id=${process.env.ONEID_CLIENT_ID}&redirect_uri=${process.env.ONEID_REDIRECT_URI}&response_type=code&state=${state}&scope=${process.env.ONEID_SCOPE}`
  // return NextResponse.redirect(authUrl)
  return err(501, 'OneID integratsiyasi tez orada ulanadi')
}
