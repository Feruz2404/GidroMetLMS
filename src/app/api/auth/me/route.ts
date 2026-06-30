import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err, requireAuth } from '@/lib/auth'

// GET /api/auth/me — current user profile
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')
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
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('me GET error:', e)
    return err(500, 'Server xatosi')
  }
}

// PATCH /api/auth/me — update profile
export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const body = await req.json()
    const { firstName, lastName, middleName, phone, department, position, avatarUrl } = body

    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(middleName !== undefined && { middleName }),
        ...(phone !== undefined && { phone }),
        ...(department !== undefined && { department }),
        ...(position !== undefined && { position }),
        ...(avatarUrl !== undefined && { avatarUrl }),
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
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('me PATCH error:', e)
    return err(500, 'Server xatosi')
  }
}
