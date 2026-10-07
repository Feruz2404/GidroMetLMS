// Operator-run, idempotent Production content initializer. It installs the
// learning catalogue (courses, assessments, library, templates) using stable
// ids and never deletes user data, resets schemas or overwrites credentials.
// See docs/deployment.md for the required operator sequence.
import './load-env'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/server/auth/password'
import { passwordSchema } from '../src/shared/schemas'
import { courseId, deliverAnnouncements, seedCatalog } from './seed/catalog'
import { getProductionContentCounts, getProductionContentDuplicateReport } from './production-content-report'

const prisma = new PrismaClient()

function assertInitializationAllowed() {
  if (process.env.ALLOW_PRODUCTION_CONTENT_INIT !== 'true') {
    throw new Error('Production content initialization is not authorized.')
  }
  const production = process.env.VERCEL_ENV === 'production'
  const isolatedTest = process.env.CONTENT_INIT_ISOLATED_TEST === 'true' && process.env.VERCEL_ENV !== 'production'
  if (!production && !isolatedTest) {
    throw new Error('Content initialization requires VERCEL_ENV=production or the explicit isolated-test guard.')
  }
  if (!/^postgres(?:ql)?:\/\//i.test(process.env.DATABASE_URL?.trim() ?? '')) {
    throw new Error('A PostgreSQL DATABASE_URL is required.')
  }
}

interface OptionalUser {
  id: string
  email: string
  username: string
  role: string
  firstName: string
  lastName: string
  department: string
  position: string
  passwordVariable: 'INIT_ADMIN_PASSWORD' | 'INIT_INSTRUCTOR_PASSWORD' | 'INIT_MANAGER_PASSWORD' | 'INIT_LEARNER_PASSWORD'
}

/** Creates an optional starter account only when its password variable is set and the account does not exist. */
async function ensureOptionalUser(definition: OptionalUser) {
  const existing = await prisma.user.findFirst({ where: { OR: [{ email: definition.email }, { username: definition.username }] } })
  if (existing) return existing

  const password = process.env[definition.passwordVariable]
  if (!password) {
    console.warn(`Optional ${definition.role} account skipped because ${definition.passwordVariable} is not configured.`)
    return null
  }
  const parsed = passwordSchema.safeParse(password)
  if (!parsed.success) throw new Error(`${definition.passwordVariable} does not meet the strong password policy.`)

  const { passwordVariable: _variable, ...profile } = definition
  return prisma.user.create({
    data: { ...profile, passwordHash: await hashPassword(parsed.data), isActive: true, mustChangePassword: true, emailVerifiedAt: new Date() },
  })
}

/** Enrols every active learner in the core mandatory courses plus one department-relevant course. */
async function initializeEnrollments() {
  const learners = await prisma.user.findMany({ where: { isActive: true, role: { in: ['learner', 'student'] } }, select: { id: true, department: true } })
  const intro = courseId(0)
  const safety = courseId(17)
  for (const learner of learners) {
    const department = learner.department?.toLowerCase() ?? ''
    const relevant = department.includes('gidrolog') ? courseId(6) : department.includes('iqlim') ? courseId(10) : courseId(1)
    for (const id of [intro, safety, relevant]) {
      await prisma.enrollment.upsert({
        where: { courseId_userId: { courseId: id, userId: learner.id } },
        update: {},
        create: { courseId: id, userId: learner.id, status: 'active', progress: 0 },
      })
    }
  }
}

async function main() {
  assertInitializationAllowed()
  console.warn(JSON.stringify({ phase: 'before', counts: await getProductionContentCounts(prisma) }))

  await ensureOptionalUser({ id: 'production-initial-admin', email: 'lms.admin@example.com', username: 'lms.initial.admin', role: 'super_admin', firstName: 'Diyor', lastName: 'Rahimov', department: 'Malaka oshirish va ta’lim bo‘limi', position: 'Tizim administratori', passwordVariable: 'INIT_ADMIN_PASSWORD' })
  const instructor = await ensureOptionalUser({ id: 'production-initial-instructor', email: 'lms.instructor@example.com', username: 'lms.initial.instructor', role: 'instructor', firstName: 'Dilafruz', lastName: 'Karimova', department: 'Malaka oshirish va ta’lim bo‘limi', position: 'O‘qituvchi', passwordVariable: 'INIT_INSTRUCTOR_PASSWORD' })
  await ensureOptionalUser({ id: 'production-initial-manager', email: 'lms.manager@example.com', username: 'lms.initial.manager', role: 'department_manager', firstName: 'Akmal', lastName: 'Saidov', department: 'Meteorologiya boshqarmasi', position: 'Bo‘lim rahbari', passwordVariable: 'INIT_MANAGER_PASSWORD' })
  await ensureOptionalUser({ id: 'production-initial-learner', email: 'lms.learner@example.com', username: 'lms.initial.learner', role: 'learner', firstName: 'Malika', lastName: 'Tursunova', department: 'Meteorologiya boshqarmasi', position: 'Tinglovchi', passwordVariable: 'INIT_LEARNER_PASSWORD' })

  const author =
    (await prisma.user.findFirst({ where: { isActive: true, role: { in: ['super_admin', 'administrator', 'admin'] } }, orderBy: { createdAt: 'asc' } })) ??
    instructor ??
    (await prisma.user.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'asc' } }))
  if (!author) throw new Error('No active Production user is available to own initialized content.')
  const tutor = instructor ?? (await prisma.user.findFirst({ where: { isActive: true, role: { in: ['instructor', 'tutor'] } }, orderBy: { createdAt: 'asc' } })) ?? author

  await seedCatalog(prisma, { authorId: author.id, tutorFor: () => tutor.id, log: console.warn })
  const recipients = await prisma.user.findMany({ where: { isActive: true }, orderBy: { createdAt: 'asc' }, take: 1000, select: { id: true } })
  await deliverAnnouncements(prisma, recipients.map((recipient) => recipient.id))
  await initializeEnrollments()

  const [after, duplicates] = await Promise.all([getProductionContentCounts(prisma), getProductionContentDuplicateReport(prisma)])
  if (Object.values(duplicates).flat().length) throw new Error('Duplicate stable identifiers were detected after initialization.')
  console.warn(JSON.stringify({ phase: 'after', counts: after, duplicates }))
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : 'Production content initialization failed.')
    process.exitCode = 1
  })
  .finally(async () => prisma.$disconnect())
