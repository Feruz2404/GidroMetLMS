import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requirePermission, ok, err, logActivity, getClientIp } from '@/lib/auth'
import { PERMISSIONS } from '@/server/auth/permissions'

// PATCH /api/users/[id]/status — activate or block user
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requirePermission(req, PERMISSIONS.USERS_MANAGE)
    const { id } = await params
    const body = await req.json()
    const rawIsActive = body.isActive
    if (typeof rawIsActive !== 'boolean') {
      return err(400, 'isActive boolean bo\'lishi kerak (true yoki false)')
    }
    const isActive = rawIsActive

    if (id === admin.id && !isActive) {
      return err(400, 'O\'zingizni bloklay olmaysiz')
    }

    const user = await db.user.findUnique({ where: { id } })
    if (!user) return err(404, 'Foydalanuvchi topilmadi')

    await db.user.update({ where: { id }, data: { isActive } })
    if (!isActive) {
      // Revoke all sessions
      await db.userSession.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } })
    }

    await logActivity(admin.id, isActive ? 'activate_user' : 'block_user', 'user', id, undefined, getClientIp(req))
    return ok({ id, isActive })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('User status error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
