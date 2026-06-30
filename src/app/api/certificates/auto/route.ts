import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import {
  getCurrentUser,
  ok,
  err,
  logActivity,
  getClientIp,
  generateCertNumber,
  generateVerifyHash,
} from '@/lib/auth'

// POST /api/certificates/auto — auto-generate certificates for eligible quiz attempts
// Eligibility: QuizAttempt where passed=true, status='graded', quiz has courseId,
// user has an enrollment for that course, and no existing Certificate with that attemptId
// Returns count of certificates created + list of certNumbers
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')
    if (!['tutor', 'admin'].includes(user.role)) {
      return err(403, 'Ruxsat yo\'q')
    }

    // Find passed attempts linked to a course where no certificate exists yet
    const eligibleAttempts = await db.quizAttempt.findMany({
      where: {
        passed: true,
        status: 'graded',
        quiz: { courseId: { not: null } },
        // No certificate exists for this attemptId
        // (we'll do a follow-up filter to be safe since SQLite doesn't fully support this relation check)
      },
      include: {
        quiz: {
          select: {
            id: true,
            courseId: true,
            title: true,
            course: {
              select: { id: true, title: true, validDays: true },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
          },
        },
      },
      orderBy: { submittedAt: 'asc' },
    })

    // Get all existing certificates' attemptIds to filter efficiently
    const existingAttemptCerts = await db.certificate.findMany({
      where: { attemptId: { not: null } },
      select: { attemptId: true },
    })
    const usedAttemptIds = new Set(
      existingAttemptCerts
        .map((c) => c.attemptId)
        .filter((x): x is string => x !== null)
    )

    // Also check for user+course duplicates for attempts without prior certs
    const existingUserCourseCerts = await db.certificate.findMany({
      where: { status: 'active' },
      select: { userId: true, courseId: true },
    })
    const userCourseSet = new Set(
      existingUserCourseCerts.map((c) => `${c.userId}|${c.courseId}`)
    )

    // Filter to truly eligible attempts
    const eligible = eligibleAttempts.filter((a) => {
      if (!a.quiz.courseId) return false
      if (a.quiz.courseId && usedAttemptIds.has(a.id)) return false
      if (userCourseSet.has(`${a.userId}|${a.quiz.courseId}`)) return false
      return true
    })

    if (eligible.length === 0) {
      return ok({
        created: 0,
        certificates: [],
        message: 'Yangi sertifikat generatsiya qilish uchun mos urinishlar topilmadi',
      })
    }

    // Get active template (single fetch, reuse)
    const template = await db.certificateTemplate.findFirst({
      where: { isActive: true },
    })

    const issuedAt = new Date()
    const created: Array<{
      id: string
      certNumber: string
      userId: string
      courseId: string
      attemptId: string
      studentName: string
      courseTitle: string
    }> = []

    // Create certificates inside a Prisma transaction for atomicity
    await db.$transaction(async (tx) => {
      for (const attempt of eligible) {
        if (!attempt.quiz.course) continue
        const course = attempt.quiz.course
        const validUntil = course.validDays
          ? new Date(issuedAt.getTime() + course.validDays * 24 * 60 * 60 * 1000)
          : null

        const cert = await tx.certificate.create({
          data: {
            certNumber: generateCertNumber(),
            userId: attempt.userId,
            courseId: attempt.quiz.courseId!,
            templateId: template?.id ?? null,
            attemptId: attempt.id,
            score: attempt.score,
            maxScore: attempt.maxScore,
            percentage: attempt.percentage,
            issuedAt,
            validUntil,
            status: 'active',
            verifyHash: generateVerifyHash(),
          },
        })

        // Notify the user
        await tx.notification.create({
          data: {
            userId: attempt.userId,
            type: 'success',
            title: 'Sertifikatingiz tayyor',
            message: `"${course.title}" kursi uchun sertifikat berildi (№${cert.certNumber}).`,
            link: 'certificates',
          },
        })

        created.push({
          id: cert.id,
          certNumber: cert.certNumber,
          userId: attempt.userId,
          courseId: attempt.quiz.courseId!,
          attemptId: attempt.id,
          studentName: `${attempt.user.lastName} ${attempt.user.firstName}`.trim(),
          courseTitle: course.title,
        })
      }
    })

    // Log a single batch activity entry
    await logActivity(
      user.id,
      'auto_issue_certificates',
      'certificate',
      undefined,
      {
        count: created.length,
        certNumbers: created.map((c) => c.certNumber),
      },
      getClientIp(req)
    )

    return ok({
      created: created.length,
      certificates: created,
      message:
        created.length > 0
          ? `${created.length} ta sertifikat muvaffaqiyatli generatsiya qilindi`
          : 'Yangi sertifikat generatsiya qilish uchun mos urinishlar topilmadi',
    })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('POST /api/certificates/auto error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'