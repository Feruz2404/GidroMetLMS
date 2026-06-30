import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err } from '@/lib/auth'

// PATCH /api/notifications/[id] — mark single as read
export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser(_req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')
    const { id } = await params

    const notif = await db.notification.findUnique({ where: { id } })
    if (!notif || notif.userId !== user.id) return err(404, 'Bildirishnoma topilmadi')

    await db.notification.update({ where: { id }, data: { isRead: true } })
    return ok({ id, isRead: true })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('Notification update error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
