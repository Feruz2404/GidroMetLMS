import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err, logActivity, getClientIp } from '@/lib/auth'

// GET /api/library/[id] — full resource details; increments viewCount
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
      include: {
        uploader: {
          select: { id: true, firstName: true, lastName: true },
        },
        bookmarks: {
          where: { userId: user.id },
          select: { id: true },
        },
      },
    })

    if (!resource) return err(404, 'Resurs topilmadi')

    // Visibility: archived resources only visible to staff
    if (resource.status === 'archived' && !['tutor', 'admin'].includes(user.role)) {
      return err(404, 'Resurs topilmadi')
    }

    // Increment viewCount (fire-and-forget; small cost — also acts as analytics)
    await db.libraryResource.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })

    const { bookmarks, ...rest } = resource as typeof resource & {
      bookmarks?: Array<{ id: string }>
    }

    return ok({
      ...rest,
      viewCount: rest.viewCount + 1,
      bookmarked: (bookmarks?.length ?? 0) > 0,
    })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('GET /api/library/[id] error:', e)
    return err(500, 'Server xatosi')
  }
}

// PATCH /api/library/[id] — tutor/admin update resource metadata
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')
    if (!['tutor', 'admin'].includes(user.role)) return err(403, 'Ruxsat yo\'q')

    const { id } = await params
    const existing = await db.libraryResource.findUnique({ where: { id } })
    if (!existing) return err(404, 'Resurs topilmadi')

    // Tutors can only edit their own uploads; admins can edit any
    if (user.role === 'tutor' && existing.uploadedBy !== user.id) {
      return err(403, 'Faqat o\'z yuklagan resurslaringizni tahrirlay olasiz')
    }

    const body = await req.json()
    const allowed = [
      'title', 'description', 'type', 'category', 'author', 'publisher',
      'year', 'language', 'pages', 'fileUrl', 'fileSize', 'fileType',
      'coverUrl', 'tags', 'status',
    ]

    const data: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) {
        const v = (body as Record<string, unknown>)[key]
        if (v === undefined) continue
        if (['year', 'pages', 'fileSize'].includes(key)) {
          data[key] = v === null ? null : Number(v)
        } else if (v === null) {
          data[key] = null
        } else {
          data[key] = v
        }
      }
    }

    const updated = await db.libraryResource.update({
      where: { id },
      data,
      include: {
        bookmarks: { where: { userId: user.id }, select: { id: true } },
      },
    })

    await logActivity(
      user.id,
      'update_resource',
      'library_resource',
      id,
      { fields: Object.keys(data) },
      getClientIp(req)
    )

    const { bookmarks, ...rest } = updated as typeof updated & {
      bookmarks?: Array<{ id: string }>
    }

    return ok({ ...rest, bookmarked: (bookmarks?.length ?? 0) > 0 })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('PATCH /api/library/[id] error:', e)
    return err(500, 'Server xatosi')
  }
}

// DELETE /api/library/[id] — archive (soft delete) resource
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')
    if (!['tutor', 'admin'].includes(user.role)) return err(403, 'Ruxsat yo\'q')

    const { id } = await params
    const existing = await db.libraryResource.findUnique({ where: { id } })
    if (!existing) return err(404, 'Resurs topilmadi')

    if (user.role === 'tutor' && existing.uploadedBy !== user.id) {
      return err(403, 'Faqat o\'z yuklagan resurslaringizni o\'chira olasiz')
    }

    await db.libraryResource.update({
      where: { id },
      data: { status: 'archived' },
    })

    await logActivity(
      user.id,
      'archive_resource',
      'library_resource',
      id,
      { title: existing.title },
      getClientIp(req)
    )

    return ok({ id, status: 'archived' })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('DELETE /api/library/[id] error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
