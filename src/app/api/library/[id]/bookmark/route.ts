import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err } from '@/lib/auth'

// GET /api/library/[id]/bookmark — check bookmark status for current user
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(_req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')

    const { id } = await params

    const resource = await db.libraryResource.findUnique({
      where: { id },
      select: { id: true, status: true },
    })
    if (!resource) return err(404, 'Resurs topilmadi')

    const bookmark = await db.resourceBookmark.findUnique({
      where: { resourceId_userId: { resourceId: id, userId: user.id } },
      select: { id: true, createdAt: true },
    })

    return ok({ bookmarked: !!bookmark, bookmarkId: bookmark?.id ?? null })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('GET /api/library/[id]/bookmark error:', e)
    return err(500, 'Server xatosi')
  }
}

// POST /api/library/[id]/bookmark — toggle bookmark
// (create if not exists, delete if exists). Returns new bookmarked status.
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(_req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')

    const { id } = await params

    const resource = await db.libraryResource.findUnique({
      where: { id },
      select: { id: true, status: true },
    })
    if (!resource) return err(404, 'Resurs topilmadi')

    const existing = await db.resourceBookmark.findUnique({
      where: { resourceId_userId: { resourceId: id, userId: user.id } },
    })

    if (existing) {
      await db.resourceBookmark.delete({ where: { id: existing.id } })
      return ok({ bookmarked: false, action: 'removed' })
    }

    await db.resourceBookmark.create({
      data: { resourceId: id, userId: user.id },
    })
    return ok({ bookmarked: true, action: 'added' })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('POST /api/library/[id]/bookmark error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
