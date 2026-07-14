import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { ok, err } from '@/lib/auth'

// GET /api/certificates/verify?hash=xxx — PUBLIC verification endpoint (no auth required)
// Returns certificate by verifyHash if status="active" and (validUntil is null OR validUntil > now)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const hash = searchParams.get('hash')

    if (!hash || !/^[a-f0-9]{40}$/i.test(hash)) {
      return err(404, 'Sertifikat topilmadi')
    }

    const certificate = await db.certificate.findUnique({
      where: { verifyHash: hash },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            middleName: true,
          },
        },
        course: { select: { title: true } },
        template: {
          select: {
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

    if (!certificate) {
      return err(404, 'Sertifikat topilmadi')
    }

    if (certificate.status === 'revoked') {
      return ok({
        found: true,
        status: 'revoked',
        certNumber: certificate.certNumber,
        message: 'Sertifikat bekor qilingan',
      })
    }

    const now = new Date()
    const isExpired = certificate.validUntil !== null && certificate.validUntil < now

    if (isExpired) {
      return ok({
        found: true,
        status: 'expired',
        certNumber: certificate.certNumber,
        validUntil: certificate.validUntil,
        message: 'Sertifikat amal qilish muddati tugagan',
      })
    }

    return ok({
      found: true,
      status: 'active',
      certNumber: certificate.certNumber,
      score: certificate.score,
      maxScore: certificate.maxScore,
      percentage: certificate.percentage,
      issuedAt: certificate.issuedAt,
      validUntil: certificate.validUntil,
      user: certificate.user,
      course: certificate.course,
      template: certificate.template,
    })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('Certificate verify error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
