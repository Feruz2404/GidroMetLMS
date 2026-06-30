import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireRole, ok, err, logActivity, getClientIp } from '@/lib/auth'

// GET /api/users/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(_req, 'admin')
    const { id } = await params
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, username: true, role: true,
        firstName: true, lastName: true, middleName: true,
        phone: true, avatarUrl: true, department: true, position: true,
        isActive: true, lastLoginAt: true, emailVerifiedAt: true, createdAt: true,
        _count: {
          select: {
            enrollments: true,
            certificates: true,
            quizAttempts: true,
            createdCourses: true,
            activityLogs: true,
          },
        },
      },
    })
    if (!user) return err(404, 'Foydalanuvchi topilmadi')
    return ok(user)
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    return err(500, 'Server xatosi')
  }
}

// PATCH /api/users/[id] — update user
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireRole(req, 'admin')
    const { id } = await params
    const body = await req.json()
    const { firstName, lastName, middleName, phone, department, position, role } = body as Record<string, unknown>

    const user = await db.user.findUnique({ where: { id } })
    if (!user) return err(404, 'Foydalanuvchi topilmadi')

    const updated = await db.user.update({
      where: { id },
      data: {
        ...(firstName !== undefined && { firstName: String(firstName) }),
        ...(lastName !== undefined && { lastName: String(lastName) }),
        ...(middleName !== undefined && { middleName: middleName === null ? null : String(middleName) }),
        ...(phone !== undefined && { phone: phone === null ? null : String(phone) }),
        ...(department !== undefined && { department: department === null ? null : String(department) }),
        ...(position !== undefined && { position: position === null ? null : String(position) }),
        ...(role !== undefined && ['admin', 'tutor', 'student'].includes(String(role)) && { role: String(role) }),
      },
    })

    await logActivity(admin.id, 'update_user', 'user', id, { role: role ? String(role) : undefined }, getClientIp(req))
    return ok({
      id: updated.id, email: updated.email, username: updated.username, role: updated.role,
      firstName: updated.firstName, lastName: updated.lastName, middleName: updated.middleName,
      phone: updated.phone, department: updated.department, position: updated.position,
    })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('User update error:', e)
    return err(500, 'Server xatosi')
  }
}

// DELETE /api/users/[id] — soft delete (deactivate)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireRole(req, 'admin')
    const { id } = await params

    if (id === admin.id) return err(400, 'O\'z hisobingizni o\'chira olmaysiz')

    const user = await db.user.findUnique({ where: { id } })
    if (!user) return err(404, 'Foydalanuvchi topilmadi')

    await db.user.update({ where: { id }, data: { isActive: false } })
    await db.userSession.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } })

    await logActivity(admin.id, 'delete_user', 'user', id, undefined, getClientIp(req))
    return ok({ success: true })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('User delete error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
