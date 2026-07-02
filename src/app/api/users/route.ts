import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import {
  requireRole,
  ok,
  err,
  hashPassword,
  logActivity,
  getClientIp,
} from '@/lib/auth'

// GET /api/users — admin only, paginated list
export async function GET(req: NextRequest) {
  try {
    await requireRole(req, 'admin')

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') ?? ''
    const role = searchParams.get('role') ?? ''
    const status = searchParams.get('status') ?? ''
    const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? '20') || 20))

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { username: { contains: search } },
      ]
    }
    if (role) where.role = role
    if (status === 'active') where.isActive = true
    if (status === 'inactive') where.isActive = false

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          firstName: true,
          lastName: true,
          middleName: true,
          phone: true,
          avatarUrl: true,
          department: true,
          position: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.user.count({ where }),
    ])

    return ok(
      { users, total, page, pages: Math.ceil(total / limit) },
      { page, limit, total, pages: Math.ceil(total / limit) }
    )
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('Users list error:', e)
    return err(500, 'Server xatosi')
  }
}

// POST /api/users — admin creates new user
export async function POST(req: NextRequest) {
  try {
    const admin = await requireRole(req, 'admin')
    const body = await req.json()
    const { email, username, password, role, firstName, lastName, middleName, phone, department, position } = body as Record<string, unknown>

    if (!email || !username || !password || !role || !firstName || !lastName) {
      return err(400, 'Majburiy maydonlar: email, username, password, role, firstName, lastName')
    }
    if (!['admin', 'tutor', 'student'].includes(String(role))) {
      return err(400, 'Rol noto\'g\'ri: admin, tutor yoki student bo\'lishi kerak')
    }
    if (String(password).length < 6) {
      return err(400, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak')
    }

    const emailStr = String(email)
    const usernameStr = String(username)
    const existing = await db.user.findFirst({
      where: { OR: [{ email: emailStr }, { username: usernameStr }] },
    })
    if (existing) {
      return err(409, 'Bu email yoki username allaqachon mavjud')
    }

    const user = await db.user.create({
      data: {
        email: emailStr,
        username: usernameStr,
        passwordHash: hashPassword(String(password)),
        role: String(role),
        firstName: String(firstName),
        lastName: String(lastName),
        middleName: middleName ? String(middleName) : null,
        phone: phone ? String(phone) : null,
        department: department ? String(department) : null,
        position: position ? String(position) : null,
        emailVerifiedAt: new Date(),
      },
    })

    await logActivity(admin.id, 'create_user', 'user', user.id, { role: String(role), email: emailStr }, getClientIp(req))

    return ok({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('User create error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
