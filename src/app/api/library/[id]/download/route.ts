import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err, logActivity, getClientIp } from '@/lib/auth'
import { hasPermission, PERMISSIONS } from '@/server/auth/permissions'

// POST /api/library/[id]/download — record a download, increment downloadCount,
// log activity, and return the fileUrl (in a real app this would be a signed URL).
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')

    const { id } = await params

    const resource = await db.libraryResource.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        fileUrl: true,
        fileType: true,
        fileSize: true,
        status: true,
      },
    })
    if (!resource) return err(404, 'Resurs topilmadi')

    // Archived resources are not downloadable for students
    if (resource.status === 'archived' && !hasPermission(user.role, PERMISSIONS.LIBRARY_MANAGE)) {
      return err(404, 'Resurs topilmadi')
    }

    // Record the download + increment counter atomically in a transaction
    const updated = await db.$transaction(async (tx) => {
      await tx.resourceDownload.create({
        data: { resourceId: id, userId: user.id },
      })
      return tx.libraryResource.update({
        where: { id },
        data: { downloadCount: { increment: 1 } },
        select: { downloadCount: true },
      })
    })

    await logActivity(
      user.id,
      'download_resource',
      'library_resource',
      id,
      { title: resource.title, fileType: resource.fileType },
      getClientIp(req)
    )

    return ok({
      fileUrl: resource.fileUrl,
      fileType: resource.fileType,
      fileSize: resource.fileSize,
      downloadCount: updated.downloadCount,
    })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('POST /api/library/[id]/download error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
