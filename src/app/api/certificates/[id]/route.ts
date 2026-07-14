import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err, logActivity, getClientIp } from '@/lib/auth'
import { isAdminRole, isInstructorRole, isManagerRole } from '@/server/auth/permissions'

// GET /api/certificates/[id] — full certificate with user, course, template
// Students can only view their own; tutors/admins can view any
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(_req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')

    const { id } = await params

    const certificate = await db.certificate.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
            department: true,
          },
        },
        course: { select: { id: true, title: true, tutorId: true, createdBy: true } },
        template: {
          select: {
            id: true,
            titleText: true,
            bodyText: true,
            primaryColor: true,
            accentColor: true,
            signerName: true,
            signerTitle: true,
          },
        },
      },
    })

    if (!certificate) return err(404, 'Sertifikat topilmadi')

    // Ownership check: students can only view their own
    const isAuthorizedStaff =
      isAdminRole(user.role) ||
      (isInstructorRole(user.role) && (certificate.course.tutorId === user.id || certificate.course.createdBy === user.id)) ||
      (isManagerRole(user.role) && certificate.user.department === user.department)
    if (!isAuthorizedStaff && certificate.userId !== user.id) {
      return err(403, 'Ruxsat yo\'q')
    }

    return ok(certificate)
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('GET /api/certificates/[id] error:', e)
    return err(500, 'Server xatosi')
  }
}

// PATCH /api/certificates/[id] — admin revoke certificate
// Body: { status: 'revoked' } (only 'revoked' supported for now)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')
    if (!isAdminRole(user.role)) return err(403, 'Faqat administratorlar sertifikatni bekor qila oladi')

    const { id } = await params
    const existing = await db.certificate.findUnique({ where: { id } })
    if (!existing) return err(404, 'Sertifikat topilmadi')

    const body = await req.json()
    const newStatus = (body as Record<string, unknown>)?.status
    if (newStatus !== 'revoked') {
      return err(400, 'Faqat sertifikatni bekor qilish mumkin (status: "revoked")')
    }

    const updated = await db.certificate.update({
      where: { id },
      data: { status: 'revoked' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
          },
        },
        course: { select: { id: true, title: true } },
        template: {
          select: {
            id: true,
            titleText: true,
            primaryColor: true,
            accentColor: true,
            signerName: true,
            signerTitle: true,
          },
        },
      },
    })

    // Notify the user that their certificate was revoked
    await db.notification.create({
      data: {
        userId: existing.userId,
        type: 'warning',
        title: 'Sertifikat bekor qilindi',
        message: `Sertifikat №${existing.certNumber} administrator tomonidan bekor qilindi.`,
        link: 'certificates',
      },
    })

    await logActivity(
      user.id,
      'revoke_certificate',
      'certificate',
      id,
      { certNumber: existing.certNumber, userId: existing.userId },
      getClientIp(req)
    )

    return ok(updated)
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('PATCH /api/certificates/[id] error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
