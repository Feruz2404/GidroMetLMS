import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import {
  err,
  generateCertNumber,
  generateVerifyHash,
  getClientIp,
  getCurrentUser,
  handleApiError,
  logActivity,
  ok,
  readJson,
} from '@/lib/auth'
import { isAdminRole, isInstructorRole } from '@/server/auth/permissions'

// Scores and eligibility are always derived from server records. Client-sent
// scores are deliberately ignored.
export async function POST(req: NextRequest) {
  try {
    const actor = await getCurrentUser(req)
    if (!actor) return err(401, 'Authentication required', undefined, 'UNAUTHORIZED')
    if (!isAdminRole(actor.role) && !isInstructorRole(actor.role)) {
      return err(403, 'Permission denied', undefined, 'FORBIDDEN')
    }

    const { userId, courseId, attemptId } = await readJson<{
      userId?: string
      courseId?: string
      attemptId?: string
    }>(req)
    if (!userId || !courseId) return err(400, 'userId and courseId are required', undefined, 'INVALID_REQUEST')

    const [targetUser, course, enrollment] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: { id: true, firstName: true, lastName: true },
      }),
      db.course.findUnique({
        where: { id: courseId },
        select: { id: true, title: true, validDays: true, tutorId: true, createdBy: true },
      }),
      db.enrollment.findUnique({
        where: { courseId_userId: { courseId, userId } },
        select: { status: true, progress: true },
      }),
    ])
    if (!targetUser || !course) return err(404, 'Learner or course not found', undefined, 'NOT_FOUND')
    if (isInstructorRole(actor.role) && course.tutorId !== actor.id && course.createdBy !== actor.id) {
      return err(403, 'Instructors may issue certificates only for owned courses', undefined, 'FORBIDDEN')
    }
    if (!enrollment || enrollment.status !== 'completed' || enrollment.progress < 100) {
      return err(422, 'The learner has not completed the course', undefined, 'COURSE_NOT_COMPLETED')
    }

    const eligibleAttempt = attemptId
      ? await db.quizAttempt.findFirst({
          where: { id: attemptId, userId, passed: true, status: 'graded', quiz: { courseId } },
          select: { id: true, score: true, maxScore: true, percentage: true },
        })
      : await db.quizAttempt.findFirst({
          where: { userId, passed: true, status: 'graded', quiz: { courseId } },
          orderBy: { submittedAt: 'desc' },
          select: { id: true, score: true, maxScore: true, percentage: true },
        })
    if (!eligibleAttempt) {
      return err(422, 'No passed final assessment was found', undefined, 'ASSESSMENT_NOT_PASSED')
    }

    const template = await db.certificateTemplate.findFirst({ where: { isActive: true } })
    const issuedAt = new Date()
    const validUntil = course.validDays
      ? new Date(issuedAt.getTime() + course.validDays * 24 * 60 * 60 * 1000)
      : null

    const certificate = await db.$transaction(async (tx) => {
      const duplicate = await tx.certificate.findFirst({
        where: {
          OR: [
            { attemptId: eligibleAttempt.id },
            { userId, courseId, status: 'active' },
          ],
        },
        select: { certNumber: true },
      })
      if (duplicate) throw new Error('CERTIFICATE_EXISTS')

      const created = await tx.certificate.create({
        data: {
          certNumber: generateCertNumber(),
          userId,
          courseId,
          templateId: template?.id ?? null,
          attemptId: eligibleAttempt.id,
          score: eligibleAttempt.score,
          maxScore: eligibleAttempt.maxScore,
          percentage: eligibleAttempt.percentage,
          issuedAt,
          validUntil,
          status: 'active',
          verifyHash: generateVerifyHash(),
        },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, middleName: true } },
          course: { select: { id: true, title: true } },
          template: true,
        },
      })

      await tx.notification.create({
        data: {
          userId,
          type: 'success',
          title: 'Sertifikatingiz tayyor',
          message: `“${course.title}” kursi uchun sertifikat berildi (${created.certNumber}).`,
          link: 'certificates',
        },
      })
      return created
    })

    await logActivity(actor.id, 'issue_certificate', 'certificate', certificate.id, {
      certNumber: certificate.certNumber,
      userId,
      courseId,
      attemptId: eligibleAttempt.id,
      percentage: eligibleAttempt.percentage,
    }, getClientIp(req))

    return ok(certificate)
  } catch (error) {
    if (error instanceof Error && error.message === 'CERTIFICATE_EXISTS') {
      return err(409, 'A certificate has already been issued', undefined, 'CERTIFICATE_EXISTS')
    }
    return handleApiError('certificates.generate', error)
  }
}

export const dynamic = 'force-dynamic'
