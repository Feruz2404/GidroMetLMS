import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err } from '@/lib/auth'
import type { Prisma } from '@prisma/client'
import { isAdminRole, isInstructorRole, isManagerRole } from '@/server/auth/permissions'

// GET /api/certificates — paginated list (role-aware)
// Students: only their own active certificates (include course + template)
// Tutors/Admins: all certificates (include user + course + template), with filters:
//   search (user name OR cert number), courseId, status
// Query: page (1), limit (12)
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
    const limit = Math.min(60, Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10) || 12))
    const search = searchParams.get('search')?.trim() ?? ''
    const courseId = searchParams.get('courseId')?.trim() ?? ''
    const status = searchParams.get('status')?.trim() ?? ''

    const isAdmin = isAdminRole(user.role)
    const isInstructor = isInstructorRole(user.role)
    const isManager = isManagerRole(user.role)
    const isStaff = isAdmin || isInstructor || isManager

    // Base where clause — role-aware
     
    const where: Prisma.CertificateWhereInput = {}
    if (!isStaff) {
      where.userId = user.id
      where.status = 'active'
    } else {
      if (isInstructor) where.course = { OR: [{ tutorId: user.id }, { createdBy: user.id }] }
      if (isManager) {
        if (!user.department) return err(403, 'Department scope is not configured', undefined, 'DEPARTMENT_SCOPE_MISSING')
        where.user = { department: user.department }
      }
      if (status && ['active', 'revoked'].includes(status)) {
        where.status = status
      }
      if (courseId) where.courseId = courseId
      if (search) {
        where.OR = [
          { certNumber: { contains: search } },
          {
            user: {
              OR: [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { middleName: { contains: search } },
              ],
            },
          },
        ]
      }
    }

    const include = {
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
      ...(isStaff
        ? {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
              },
            },
          }
        : {}),
    }

    const [total, certificates] = await Promise.all([
      db.certificate.count({ where }),
      db.certificate.findMany({
        where,
        orderBy: { issuedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include,
      }),
    ])

    return ok(certificates, {
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
      limit,
    })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('GET /api/certificates error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
