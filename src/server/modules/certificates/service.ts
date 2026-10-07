import type { Prisma } from '@prisma/client'
import { audit } from '@/server/audit'
import {
  canManageCourse,
  hasPermission,
  isAdminRole,
  isInstructorRole,
  isManagerRole,
  PERMISSIONS,
  requirePermission,
  type Actor,
} from '@/server/auth/permissions'
import { db } from '@/server/db'
import { conflict, forbidden, found, notFound, unprocessable } from '@/server/http/errors'
import { ilike, pageMeta, skipTake } from '@/server/http/request'
import { notify } from '@/server/modules/notifications/service'
import { fullName } from '@/server/modules/users/mapper'
import type { CertificateDto, CertificateStatus, CertificateSyncResultDto, PublicCertificateDto } from '@/shared/dto'
import { certificateStatus } from './certificate-status'
import { generateCertNumber, generateVerifyHash } from './codes'

const DAY_MS = 24 * 60 * 60 * 1000

const certificateInclude = {
  user: { select: { id: true, firstName: true, lastName: true, middleName: true, department: true, position: true } },
  course: { select: { id: true, title: true, durationHours: true, tutorId: true, createdBy: true } },
  template: true,
} satisfies Prisma.CertificateInclude

type CertificateSource = Prisma.CertificateGetPayload<{ include: typeof certificateInclude }>

function toTemplateDto(template: CertificateSource['template']) {
  return template
    ? {
        titleText: template.titleText,
        bodyText: template.bodyText,
        primaryColor: template.primaryColor,
        accentColor: template.accentColor,
        signerName: template.signerName,
        signerTitle: template.signerTitle,
      }
    : null
}

function toDto(certificate: CertificateSource): CertificateDto {
  return {
    id: certificate.id,
    certNumber: certificate.certNumber,
    verifyHash: certificate.verifyHash,
    status: certificateStatus(certificate),
    score: certificate.score,
    maxScore: certificate.maxScore,
    percentage: certificate.percentage,
    issuedAt: certificate.issuedAt.toISOString(),
    validUntil: certificate.validUntil?.toISOString() ?? null,
    course: { id: certificate.course.id, title: certificate.course.title, durationHours: certificate.course.durationHours },
    recipient: {
      id: certificate.user.id,
      fullName: fullName(certificate.user),
      department: certificate.user.department,
      position: certificate.user.position,
    },
    template: toTemplateDto(certificate.template),
  }
}

// --- Eligibility --------------------------------------------------------------------

type Eligibility =
  | { eligible: true; score: number; maxScore: number; percentage: number; attemptId: string | null }
  | { eligible: false; reason: 'CERTIFICATES_DISABLED' | 'COURSE_NOT_COMPLETED' | 'ASSESSMENT_NOT_PASSED' | 'CERTIFICATE_EXISTS' }

/**
 * The single certificate rule: the course allows certificates, the learner
 * completed every lesson, passed a published final assessment of the course
 * (when one exists), and holds no active certificate for it yet.
 */
export async function evaluateEligibility(userId: string, courseId: string): Promise<Eligibility> {
  const [course, enrollment, existing, quizzes] = await Promise.all([
    db.course.findUnique({ where: { id: courseId }, select: { certificateEnabled: true } }),
    db.enrollment.findUnique({ where: { courseId_userId: { courseId, userId } }, select: { status: true, progress: true } }),
    db.certificate.findFirst({ where: { userId, courseId, status: 'active' }, select: { id: true } }),
    db.quiz.count({ where: { courseId, status: 'published' } }),
  ])
  if (!course?.certificateEnabled) return { eligible: false, reason: 'CERTIFICATES_DISABLED' }
  if (existing) return { eligible: false, reason: 'CERTIFICATE_EXISTS' }
  if (!enrollment || enrollment.status !== 'completed' || enrollment.progress < 100) {
    return { eligible: false, reason: 'COURSE_NOT_COMPLETED' }
  }
  if (quizzes === 0) return { eligible: true, score: 100, maxScore: 100, percentage: 100, attemptId: null }

  const best = await db.quizAttempt.findFirst({
    where: { userId, passed: true, status: 'graded', quiz: { courseId, status: 'published' } },
    orderBy: [{ percentage: 'desc' }, { submittedAt: 'asc' }],
    select: { id: true, score: true, maxScore: true, percentage: true },
  })
  if (!best) return { eligible: false, reason: 'ASSESSMENT_NOT_PASSED' }
  return { eligible: true, score: Math.round(best.score), maxScore: best.maxScore, percentage: best.percentage, attemptId: best.id }
}

async function createCertificate(userId: string, courseId: string, grade: Extract<Eligibility, { eligible: true }>) {
  const [course, template] = await Promise.all([
    db.course.findUniqueOrThrow({ where: { id: courseId }, select: { title: true, validDays: true } }),
    db.certificateTemplate.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
  ])
  const issuedAt = new Date()
  const certificate = await db.$transaction(async (tx) => {
    // Re-check inside the transaction so concurrent completions cannot double-issue.
    const duplicate = await tx.certificate.findFirst({ where: { userId, courseId, status: 'active' }, select: { id: true } })
    if (duplicate) return null
    const created = await tx.certificate.create({
      data: {
        certNumber: generateCertNumber(issuedAt),
        verifyHash: generateVerifyHash(),
        userId,
        courseId,
        templateId: template?.id ?? null,
        attemptId: grade.attemptId,
        score: grade.score,
        maxScore: grade.maxScore,
        percentage: grade.percentage,
        issuedAt,
        validUntil: course.validDays ? new Date(issuedAt.getTime() + course.validDays * DAY_MS) : null,
      },
    })
    await notify(
      userId,
      {
        type: 'success',
        title: 'Sertifikatingiz tayyor',
        message: `“${course.title}” kursi bo‘yicha ${created.certNumber} raqamli sertifikat berildi.`,
        link: `/certificates/${created.id}`,
      },
      tx
    )
    return created
  })
  return certificate ? { id: certificate.id, certNumber: certificate.certNumber } : null
}

/** Issues a certificate when the learner has just become eligible; otherwise does nothing. */
export async function issueCertificateIfEligible(userId: string, courseId: string) {
  const eligibility = await evaluateEligibility(userId, courseId)
  if (!eligibility.eligible) return null
  const certificate = await createCertificate(userId, courseId, eligibility)
  if (certificate) {
    await audit({ userId, action: 'certificate_issued', entity: 'certificate', entityId: certificate.id, metadata: { courseId, automatic: true } })
  }
  return certificate
}

// --- Queries ------------------------------------------------------------------------------

function scopeWhere(actor: Actor): Prisma.CertificateWhereInput {
  if (isAdminRole(actor.role)) return {}
  if (isInstructorRole(actor.role)) return { course: { OR: [{ tutorId: actor.id }, { createdBy: actor.id }] } }
  if (isManagerRole(actor.role)) return { user: { department: actor.department ?? '__none__' } }
  return { userId: actor.id }
}

export interface CertificateListQuery {
  search?: string
  courseId?: string
  status?: CertificateStatus
  mine?: boolean
  page: number
  limit: number
}

export async function listCertificates(actor: Actor, query: CertificateListQuery) {
  const and: Prisma.CertificateWhereInput[] = [query.mine ? { userId: actor.id } : scopeWhere(actor)]
  if (query.courseId) and.push({ courseId: query.courseId })
  if (query.status === 'revoked') and.push({ status: 'revoked' })
  if (query.status === 'active') and.push({ status: 'active', OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }] })
  if (query.status === 'expired') and.push({ status: 'active', validUntil: { lt: new Date() } })
  if (query.search) {
    and.push({
      OR: [
        { certNumber: ilike(query.search) },
        { course: { title: ilike(query.search) } },
        { user: { OR: [{ firstName: ilike(query.search) }, { lastName: ilike(query.search) }] } },
      ],
    })
  }
  const where: Prisma.CertificateWhereInput = { AND: and }
  const [total, certificates] = await Promise.all([
    db.certificate.count({ where }),
    db.certificate.findMany({ where, include: certificateInclude, orderBy: { issuedAt: 'desc' }, ...skipTake(query.page, query.limit) }),
  ])
  return { items: certificates.map(toDto), meta: pageMeta(total, query.page, query.limit) }
}

export async function getCertificate(actor: Actor, id: string): Promise<CertificateDto> {
  const certificate = await db.certificate.findFirst({ where: { AND: [{ id }, scopeWhere(actor)] }, include: certificateInclude })
  if (!certificate) throw notFound('Certificate')
  return toDto(certificate)
}

export async function verifyCertificate(hash: string): Promise<PublicCertificateDto> {
  if (!/^[a-f0-9]{40}$/i.test(hash)) throw notFound('Certificate')
  const certificate = await db.certificate.findUnique({ where: { verifyHash: hash.toLowerCase() }, include: certificateInclude })
  if (!certificate) throw notFound('Certificate')
  return {
    status: certificateStatus(certificate),
    certNumber: certificate.certNumber,
    recipientName: fullName(certificate.user),
    courseTitle: certificate.course.title,
    courseHours: certificate.course.durationHours,
    percentage: certificate.percentage,
    issuedAt: certificate.issuedAt.toISOString(),
    validUntil: certificate.validUntil?.toISOString() ?? null,
    template: toTemplateDto(certificate.template),
  }
}

// --- Administration ---------------------------------------------------------------------

export async function issueCertificate(actor: Actor, input: { userId: string; courseId: string }, req: Request) {
  const course = found(await db.course.findUnique({ where: { id: input.courseId } }), 'Course')
  if (!hasPermission(actor.role, PERMISSIONS.CERTIFICATES_MANAGE) && !canManageCourse(actor, course)) throw forbidden()

  const eligibility = await evaluateEligibility(input.userId, input.courseId)
  if (!eligibility.eligible) {
    if (eligibility.reason === 'CERTIFICATE_EXISTS') throw conflict('CERTIFICATE_EXISTS', 'An active certificate already exists')
    throw unprocessable(eligibility.reason, 'The learner is not eligible for a certificate yet')
  }
  const issued = await createCertificate(input.userId, input.courseId, eligibility)
  if (!issued) throw conflict('CERTIFICATE_EXISTS', 'An active certificate already exists')
  await audit({ userId: actor.id, action: 'issue_certificate', entity: 'certificate', entityId: issued.id, metadata: input, request: req })
  return getCertificate(actor, issued.id)
}

export async function revokeCertificate(actor: Actor, id: string, reason: string | null, req: Request) {
  requirePermission(actor, PERMISSIONS.CERTIFICATES_MANAGE)
  const certificate = found(await db.certificate.findUnique({ where: { id }, include: { course: { select: { title: true } } } }), 'Certificate')
  if (certificate.status === 'revoked') throw conflict('CONFLICT', 'The certificate is already revoked')

  await db.certificate.update({ where: { id }, data: { status: 'revoked' } })
  await notify(certificate.userId, {
    type: 'warning',
    title: 'Sertifikat bekor qilindi',
    message: `“${certificate.course.title}” kursi bo‘yicha ${certificate.certNumber} sertifikati bekor qilindi.${reason ? ` Sabab: ${reason}` : ''}`,
    link: '/certificates',
  })
  await audit({ userId: actor.id, action: 'revoke_certificate', entity: 'certificate', entityId: id, metadata: { reason }, request: req })
  return getCertificate(actor, id)
}

/** Issues certificates for every learner who is eligible but has none (e.g. after data imports). */
export async function syncCertificates(actor: Actor, req: Request): Promise<CertificateSyncResultDto> {
  requirePermission(actor, PERMISSIONS.CERTIFICATES_MANAGE)
  const candidates = await db.enrollment.findMany({
    where: { status: 'completed', course: { certificateEnabled: true }, user: { isActive: true } },
    select: { userId: true, courseId: true },
  })
  const issued: CertificateSyncResultDto['certificates'] = []
  for (const candidate of await withoutActiveCertificates(candidates)) {
    const certificate = await issueCertificateIfEligible(candidate.userId, candidate.courseId)
    if (!certificate) continue
    const detail = await db.certificate.findUniqueOrThrow({ where: { id: certificate.id }, include: certificateInclude })
    issued.push({ id: detail.id, certNumber: detail.certNumber, recipientName: fullName(detail.user), courseTitle: detail.course.title })
  }
  await audit({ userId: actor.id, action: 'sync_certificates', entity: 'certificate', metadata: { created: issued.length }, request: req })
  return { created: issued.length, certificates: issued }
}

async function withoutActiveCertificates(candidates: Array<{ userId: string; courseId: string }>) {
  const existing = await db.certificate.findMany({ where: { status: 'active' }, select: { userId: true, courseId: true } })
  const taken = new Set(existing.map((certificate) => `${certificate.userId}:${certificate.courseId}`))
  return candidates.filter((candidate) => !taken.has(`${candidate.userId}:${candidate.courseId}`))
}
