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

// POST /api/certificates/generate — manual certificate generation (admin/tutor only)
// Body: { userId, courseId, attemptId?, score, maxScore }
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')
    if (!['tutor', 'admin'].includes(user.role)) {
      return err(403, 'Ruxsat yo\'q')
    }

    const body = await req.json()
    const {
      userId,
      courseId,
      attemptId,
      score,
      maxScore,
    } = body as Record<string, unknown>

    if (!userId || typeof userId !== 'string') {
      return err(400, 'Foydalanuvchi ID majburiy')
    }
    if (!courseId || typeof courseId !== 'string') {
      return err(400, 'Kurs ID majburiy')
    }

    const scoreNum = Number(score)
    const maxScoreNum = Number(maxScore)
    if (Number.isNaN(scoreNum) || Number.isNaN(maxScoreNum) || maxScoreNum <= 0) {
      return err(400, 'Ball noto\'g\'ri formatda')
    }
    const percentage = Math.min(100, Math.max(0, Math.round((scoreNum / maxScoreNum) * 100)))

    // Validate target user + course exist
    const [targetUser, course] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: { id: true, firstName: true, lastName: true, role: true },
      }),
      db.course.findUnique({
        where: { id: courseId },
        select: { id: true, title: true, validDays: true },
      }),
    ])

    if (!targetUser) return err(404, 'Foydalanuvchi topilmadi')
    if (!course) return err(404, 'Kurs topilmadi')

    // If attemptId provided, ensure no existing certificate for that attempt
    if (attemptId && typeof attemptId === 'string') {
      const existing = await db.certificate.findFirst({
        where: { attemptId },
        select: { id: true, certNumber: true },
      })
      if (existing) {
        return err(409, `Bu urinish uchun sertifikat allaqachon mavjud (№${existing.certNumber})`)
      }
    } else {
      // No attemptId provided — prevent duplicates for same user+course with active status
      const existing = await db.certificate.findFirst({
        where: { userId, courseId, status: 'active' },
        select: { id: true, certNumber: true },
      })
      if (existing) {
        return err(409, `Bu talaba ushbu kurs uchun sertifikatga ega (№${existing.certNumber})`)
      }
    }

    // Get active template
    const template = await db.certificateTemplate.findFirst({
      where: { isActive: true },
    })

    const issuedAt = new Date()
    const validUntil = course.validDays
      ? new Date(issuedAt.getTime() + course.validDays * 24 * 60 * 60 * 1000)
      : null

    const certificate = await db.certificate.create({
      data: {
        certNumber: generateCertNumber(),
        userId,
        courseId,
        templateId: template?.id ?? null,
        attemptId: typeof attemptId === 'string' ? attemptId : null,
        score: scoreNum,
        maxScore: maxScoreNum,
        percentage,
        issuedAt,
        validUntil,
        status: 'active',
        verifyHash: generateVerifyHash(),
      },
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

    // Notify the user
    await db.notification.create({
      data: {
        userId,
        type: 'success',
        title: 'Sertifikatingiz tayyor',
        message: `"${course.title}" kursi uchun sertifikat berildi (№${certificate.certNumber}).`,
        link: 'certificates',
      },
    })

    await logActivity(
      user.id,
      'issue_certificate',
      'certificate',
      certificate.id,
      {
        certNumber: certificate.certNumber,
        userId,
        courseId,
        attemptId: attemptId ?? null,
        score: scoreNum,
        maxScore: maxScoreNum,
        percentage,
      },
      getClientIp(req)
    )

    return ok(certificate)
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('POST /api/certificates/generate error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
