import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import {
  getCurrentUser,
  handleApiError,
  hashPassword,
  ok,
  err,
  requireAuth,
  readJson,
  verifyPassword,
} from '@/lib/auth'
import { passwordSchema } from '@/validators/auth'

// GET /api/auth/me - current user profile
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Unauthorized', undefined, 'UNAUTHORIZED')

    return ok({
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
    })
  } catch (e) {
    return handleApiError('auth.me.get', e)
  }
}

// PATCH /api/auth/me - update profile and optionally password
export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const body = await readJson<{
      firstName?: string
      lastName?: string
      middleName?: string | null
      phone?: string | null
      avatarUrl?: string | null
      password?: string
      currentPassword?: string
    }>(req)
    const { firstName, lastName, middleName, phone, avatarUrl, password, currentPassword } = body

    if (password !== undefined) {
      if (!currentPassword) return err(400, 'Missing current password', undefined, 'MISSING_CURRENT_PASSWORD')
      const parsedPassword = passwordSchema.safeParse(password)
      if (!parsedPassword.success) return err(400, parsedPassword.error.issues[0]?.message ?? 'Weak password', undefined, 'WEAK_PASSWORD')
      if (!verifyPassword(currentPassword, user.passwordHash)) {
        return err(401, 'Invalid credentials', undefined, 'INVALID_CREDENTIALS')
      }
    }

    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(middleName !== undefined && { middleName }),
        ...(phone !== undefined && { phone }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(password !== undefined && { passwordHash: hashPassword(password) }),
      },
    })

    return ok({
      id: updated.id,
      email: updated.email,
      username: updated.username,
      role: updated.role,
      firstName: updated.firstName,
      lastName: updated.lastName,
      middleName: updated.middleName,
      phone: updated.phone,
      avatarUrl: updated.avatarUrl,
      department: updated.department,
      position: updated.position,
    })
  } catch (e) {
    if (e instanceof Error && e.message === 'UNAUTHORIZED') {
      return err(401, 'Unauthorized', undefined, 'UNAUTHORIZED')
    }
    if (e instanceof Error && e.message === 'FORBIDDEN') {
      return err(403, 'Forbidden', undefined, 'FORBIDDEN')
    }

    return handleApiError('auth.me.patch', e)
  }
}

export const dynamic = 'force-dynamic'
