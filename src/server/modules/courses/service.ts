import type { Prisma } from '@prisma/client'
import { audit } from '@/server/audit'
import {
  assertCanManageCourse,
  canManageCourse,
  hasPermission,
  isLearnerRole,
  isManagerRole,
  PERMISSIONS,
  requireAnyPermission,
  type Actor,
} from '@/server/auth/permissions'
import { db } from '@/server/db'
import { badRequest, forbidden, found, notFound, unprocessable } from '@/server/http/errors'
import { ilike, pageMeta, skipTake } from '@/server/http/request'
import { notify } from '@/server/modules/notifications/service'
import { toUserSummary, userSummarySelect } from '@/server/modules/users/mapper'
import type {
  CategoryDto,
  CourseCardDto,
  CourseDetailDto,
  CourseLearnerDto,
  EnrollmentStatus,
  LearnerCandidateDto,
  LessonType,
  QuizStatus,
  SectionDto,
} from '@/shared/dto'
import { ADMIN_ROLES, INSTRUCTOR_ROLES, LEARNER_ROLES } from '@/shared/roles'
import type { CourseInput, CourseUpdateInput } from '@/shared/schemas'
import { courseCardInclude, joinLines, slugify, splitLines, toCourseCard, toEnrollmentDto } from './mapper'
import { orderLessons } from './progress'

/** Courses the actor may see in the catalogue. */
export function visibleCoursesWhere(actor: Actor): Prisma.CourseWhereInput {
  if (hasPermission(actor.role, PERMISSIONS.COURSES_MANAGE_ALL)) return {}
  if (hasPermission(actor.role, PERMISSIONS.COURSES_MANAGE_OWN)) {
    return { OR: [{ status: 'published' }, { tutorId: actor.id }, { createdBy: actor.id }] }
  }
  return { status: 'published' }
}

export async function findVisibleCourse(actor: Actor, courseId: string) {
  const course = await db.course.findFirst({ where: { AND: [{ id: courseId }, visibleCoursesWhere(actor)] } })
  if (!course) throw notFound('Course')
  return course
}

// --- Catalogue ------------------------------------------------------------------

export async function listCategories(actor: Actor): Promise<CategoryDto[]> {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { courses: { where: visibleCoursesWhere(actor) } } } },
  })
  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    nameRu: category.nameRu,
    icon: category.icon,
    description: category.description,
    courseCount: category._count.courses,
  }))
}

export interface CourseListQuery {
  search?: string
  categoryId?: string
  level?: string
  status?: string
  view: 'all' | 'enrolled' | 'completed' | 'managed'
  sort: 'newest' | 'popular' | 'title'
  page: number
  limit: number
}

export async function listCourses(actor: Actor, query: CourseListQuery) {
  const and: Prisma.CourseWhereInput[] = [visibleCoursesWhere(actor)]
  if (query.search) {
    and.push({ OR: [{ title: ilike(query.search) }, { shortSummary: ilike(query.search) }, { description: ilike(query.search) }] })
  }
  if (query.categoryId) and.push({ categoryId: query.categoryId })
  if (query.level) and.push({ level: query.level })
  if (query.status && !isLearnerRole(actor.role)) and.push({ status: query.status })
  if (query.view === 'enrolled') and.push({ enrollments: { some: { userId: actor.id, status: { not: 'dropped' } } } })
  if (query.view === 'completed') and.push({ enrollments: { some: { userId: actor.id, status: 'completed' } } })
  if (query.view === 'managed' && !hasPermission(actor.role, PERMISSIONS.COURSES_MANAGE_ALL)) {
    and.push({ OR: [{ tutorId: actor.id }, { createdBy: actor.id }] })
  }

  const where: Prisma.CourseWhereInput = { AND: and }
  const orderBy: Prisma.CourseOrderByWithRelationInput[] =
    query.sort === 'title'
      ? [{ title: 'asc' }]
      : query.sort === 'popular'
        ? [{ enrollments: { _count: 'desc' } }, { title: 'asc' }]
        : [{ isMandatory: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }]

  const [total, courses] = await Promise.all([
    db.course.count({ where }),
    db.course.findMany({ where, orderBy, include: courseCardInclude(actor.id), ...skipTake(query.page, query.limit) }),
  ])
  return { items: courses.map((course) => toCourseCard(course, actor)), meta: pageMeta(total, query.page, query.limit) }
}

// --- Detail ---------------------------------------------------------------------

export async function getCourseDetail(actor: Actor, courseId: string): Promise<CourseDetailDto> {
  const course = await db.course.findFirst({
    where: { AND: [{ id: courseId }, visibleCoursesWhere(actor)] },
    include: {
      ...courseCardInclude(actor.id),
      sections: { orderBy: { order: 'asc' } },
      lessons: {
        orderBy: { order: 'asc' },
        include: { progress: { where: { userId: actor.id }, select: { isCompleted: true } } },
      },
      quizzes: {
        where: { status: { not: 'archived' } },
        orderBy: { createdAt: 'asc' },
        include: {
          _count: { select: { questions: true } },
          attempts: { where: { userId: actor.id, status: 'graded' }, select: { percentage: true, passed: true } },
        },
      },
      certificates: { where: { userId: actor.id, status: 'active' }, take: 1, select: { id: true, certNumber: true, verifyHash: true } },
    },
  })
  if (!course) throw notFound('Course')

  const card = toCourseCard(course, actor)
  const learner = isLearnerRole(actor.role)
  const enrolled = Boolean(card.enrollment && card.enrollment.status !== 'dropped')

  const lessons = orderLessons(course.sections, course.lessons).map((lesson) => ({
    id: lesson.id,
    sectionId: lesson.sectionId,
    title: lesson.title,
    description: lesson.description,
    type: lesson.type as LessonType,
    durationMin: lesson.durationMin,
    order: lesson.order,
    isFree: lesson.isFree,
    isLocked: learner && !enrolled && !lesson.isFree,
    isCompleted: lesson.progress[0]?.isCompleted ?? false,
  }))

  const sections: SectionDto[] = course.sections.map((section) => ({
    id: section.id,
    title: section.title,
    description: section.description,
    order: section.order,
    lessons: lessons.filter((lesson) => lesson.sectionId === section.id),
  }))
  const unsectioned = lessons.filter((lesson) => !lesson.sectionId || !course.sections.some((s) => s.id === lesson.sectionId))
  if (unsectioned.length) {
    sections.push({ id: 'unsectioned', title: '—', description: null, order: Number.MAX_SAFE_INTEGER, lessons: unsectioned })
  }

  const quizzes = course.quizzes
    .filter((quiz) => card.canManage || quiz.status === 'published')
    .map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      status: quiz.status as QuizStatus,
      questionCount: quiz._count.questions,
      timeLimitMin: quiz.timeLimitMin,
      passingScore: quiz.passingScore,
      maxAttempts: quiz.maxAttempts,
      attemptsUsed: quiz.attempts.length,
      bestPercentage: quiz.attempts.length ? Math.max(...quiz.attempts.map((attempt) => attempt.percentage)) : null,
      passed: quiz.attempts.some((attempt) => attempt.passed),
    }))

  const completedLessons = lessons.filter((lesson) => lesson.isCompleted).length
  const nextLesson = lessons.find((lesson) => !lesson.isCompleted && !lesson.isLocked) ?? lessons.find((lesson) => !lesson.isLocked)

  return {
    ...card,
    description: course.description,
    targetAudience: course.targetAudience,
    learningOutcomes: splitLines(course.learningOutcomes),
    prerequisites: splitLines(course.prerequisites),
    language: course.language,
    certificateEnabled: course.certificateEnabled,
    passPercentage: course.passPercentage,
    maxAttempts: course.maxAttempts,
    validDays: course.validDays,
    generalTrainingNotice: course.generalTrainingNotice,
    thumbnailUrl: course.thumbnailUrl,
    categoryId: course.categoryId,
    tutorId: course.tutorId,
    sections,
    completedLessons,
    nextLessonId: nextLesson?.id ?? null,
    quizzes,
    certificate: course.certificates[0] ?? null,
  }
}

// --- Authoring --------------------------------------------------------------------

async function resolveTutorId(actor: Actor, requested: string | null | undefined): Promise<string> {
  if (!requested || requested === actor.id) return actor.id
  if (!hasPermission(actor.role, PERMISSIONS.COURSES_MANAGE_ALL)) throw forbidden()
  const tutor = await db.user.findFirst({
    where: { id: requested, isActive: true, role: { in: [...INSTRUCTOR_ROLES, ...ADMIN_ROLES] } },
    select: { id: true },
  })
  if (!tutor) throw badRequest('VALIDATION_FAILED', 'The selected tutor is not an active instructor')
  return tutor.id
}

async function assertCategory(categoryId: string | null | undefined) {
  if (!categoryId) return
  const exists = await db.category.count({ where: { id: categoryId } })
  if (!exists) throw badRequest('VALIDATION_FAILED', 'Unknown category')
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title)
  const taken = await db.course.count({ where: { slug: base } })
  return taken ? `${base}-${Math.random().toString(36).slice(2, 7)}` : base
}

export async function createCourse(actor: Actor, input: CourseInput, req: Request): Promise<CourseCardDto> {
  requireAnyPermission(actor, PERMISSIONS.COURSES_MANAGE_ALL, PERMISSIONS.COURSES_MANAGE_OWN)
  await assertCategory(input.categoryId)
  // A new course has no lessons yet, so it always starts as a draft.
  const { learningOutcomes, prerequisites, tutorId, ...fields } = input
  const course = await db.course.create({
    data: {
      ...fields,
      status: 'draft',
      learningOutcomes: joinLines(learningOutcomes),
      prerequisites: joinLines(prerequisites),
      slug: await uniqueSlug(input.title),
      tutorId: await resolveTutorId(actor, tutorId),
      createdBy: actor.id,
    },
    include: courseCardInclude(actor.id),
  })
  await audit({ userId: actor.id, action: 'create_course', entity: 'course', entityId: course.id, metadata: { title: course.title }, request: req })
  return toCourseCard(course, actor)
}

export async function updateCourse(actor: Actor, courseId: string, input: CourseUpdateInput, req: Request): Promise<CourseCardDto> {
  const course = found(await db.course.findUnique({ where: { id: courseId } }), 'Course')
  assertCanManageCourse(actor, course)
  await assertCategory(input.categoryId)

  const { learningOutcomes, prerequisites, tutorId, ...fields } = input
  const data: Prisma.CourseUncheckedUpdateInput = { ...fields }
  if (learningOutcomes) data.learningOutcomes = joinLines(learningOutcomes)
  if (prerequisites) data.prerequisites = joinLines(prerequisites)
  if (tutorId !== undefined) data.tutorId = await resolveTutorId(actor, tutorId)

  if (input.status === 'published' && course.status !== 'published') {
    const lessons = await db.lesson.count({ where: { courseId } })
    if (!lessons) throw unprocessable('COURSE_EMPTY', 'Add at least one lesson before publishing')
    data.publishedAt = course.publishedAt ?? new Date()
  }

  const updated = await db.course.update({ where: { id: courseId }, data, include: courseCardInclude(actor.id) })
  await audit({ userId: actor.id, action: 'update_course', entity: 'course', entityId: courseId, metadata: { fields: Object.keys(input) }, request: req })
  return toCourseCard(updated, actor)
}

export async function archiveCourse(actor: Actor, courseId: string, req: Request): Promise<void> {
  const course = found(await db.course.findUnique({ where: { id: courseId } }), 'Course')
  assertCanManageCourse(actor, course)
  await db.course.update({ where: { id: courseId }, data: { status: 'archived' } })
  await audit({ userId: actor.id, action: 'archive_course', entity: 'course', entityId: courseId, request: req })
}

// --- Enrollment ---------------------------------------------------------------------

export async function enroll(actor: Actor, courseId: string, req: Request) {
  if (!isLearnerRole(actor.role)) throw forbidden('LEARNERS_ONLY', 'Only learners can enroll')
  const course = found(await db.course.findUnique({ where: { id: courseId } }), 'Course')
  if (course.status !== 'published') throw unprocessable('COURSE_NOT_PUBLISHED', 'The course is not open for enrollment')

  const existing = await db.enrollment.findUnique({ where: { courseId_userId: { courseId, userId: actor.id } } })
  if (existing) {
    if (existing.status !== 'dropped') return toEnrollmentDto(existing)
    const reactivated = await db.enrollment.update({ where: { id: existing.id }, data: { status: existing.progress >= 100 ? 'completed' : 'active' } })
    return toEnrollmentDto(reactivated)
  }

  const enrollment = await db.enrollment.create({ data: { courseId, userId: actor.id, status: 'active', progress: 0 } })
  await notify(actor.id, {
    type: 'success',
    title: 'Kursga yozildingiz',
    message: `“${course.title}” kursiga muvaffaqiyatli yozildingiz. Birinchi darsdan boshlang!`,
    link: `/courses/${courseId}`,
  })
  await audit({ userId: actor.id, action: 'enroll_course', entity: 'course', entityId: courseId, request: req })
  return toEnrollmentDto(enrollment)
}

export interface AssignInput {
  userIds?: string[]
  department?: string
  deadlineAt?: Date | null
}

/** Assigns a course to learners (individually or a whole department), optionally with a deadline. */
export async function assignCourse(actor: Actor, courseId: string, input: AssignInput, req: Request) {
  const course = found(await db.course.findUnique({ where: { id: courseId } }), 'Course')
  assertCanManageCourse(actor, course)
  if (course.status !== 'published') throw unprocessable('COURSE_NOT_PUBLISHED', 'Only published courses can be assigned')
  if (!input.userIds?.length && !input.department) throw badRequest('VALIDATION_FAILED', 'Choose learners or a department')

  const learners = await db.user.findMany({
    where: {
      isActive: true,
      role: { in: [...LEARNER_ROLES] },
      OR: [
        ...(input.userIds?.length ? [{ id: { in: input.userIds } }] : []),
        ...(input.department ? [{ department: input.department }] : []),
      ],
    },
    select: { id: true },
  })

  let created = 0
  for (const learner of learners) {
    const existing = await db.enrollment.findUnique({ where: { courseId_userId: { courseId, userId: learner.id } } })
    if (existing) {
      if (input.deadlineAt !== undefined || existing.status === 'dropped') {
        await db.enrollment.update({
          where: { id: existing.id },
          data: {
            ...(input.deadlineAt !== undefined ? { deadlineAt: input.deadlineAt } : {}),
            ...(existing.status === 'dropped' ? { status: 'active' } : {}),
          },
        })
      }
      continue
    }
    await db.enrollment.create({ data: { courseId, userId: learner.id, deadlineAt: input.deadlineAt ?? null } })
    created += 1
    await notify(learner.id, {
      type: 'info',
      title: 'Sizga yangi kurs biriktirildi',
      message: input.deadlineAt
        ? `“${course.title}” kursini ${input.deadlineAt.toLocaleDateString('uz-UZ')} sanasigacha yakunlang.`
        : `“${course.title}” kursi sizning o‘quv rejangizga qo‘shildi.`,
      link: `/courses/${courseId}`,
    })
  }
  await audit({ userId: actor.id, action: 'assign_course', entity: 'course', entityId: courseId, metadata: { learners: learners.length, created }, request: req })
  return { matched: learners.length, created }
}

export async function listCourseLearners(actor: Actor, courseId: string): Promise<CourseLearnerDto[]> {
  const course = found(await db.course.findUnique({ where: { id: courseId } }), 'Course')
  if (!canManageCourse(actor, course) && !isManagerRole(actor.role)) throw forbidden()

  const enrollments = await db.enrollment.findMany({
    where: { courseId, ...(isManagerRole(actor.role) ? { user: { department: actor.department ?? '__none__' } } : {}) },
    include: { user: { select: { ...userSummarySelect, email: true } } },
    orderBy: [{ status: 'asc' }, { progress: 'desc' }],
  })
  const userIds = enrollments.map((enrollment) => enrollment.userId)
  const [attempts, certificates] = await Promise.all([
    db.quizAttempt.groupBy({
      by: ['userId'],
      where: { userId: { in: userIds }, status: 'graded', quiz: { courseId } },
      _max: { percentage: true },
    }),
    db.certificate.findMany({ where: { courseId, userId: { in: userIds }, status: 'active' }, select: { id: true, userId: true } }),
  ])
  const best = new Map(attempts.map((row) => [row.userId, row._max.percentage]))
  const certificateByUser = new Map(certificates.map((certificate) => [certificate.userId, certificate.id]))

  return enrollments.map((enrollment) => ({
    enrollmentId: enrollment.id,
    user: { ...toUserSummary(enrollment.user), email: enrollment.user.email },
    status: enrollment.status as EnrollmentStatus,
    progress: enrollment.progress,
    startedAt: enrollment.startedAt.toISOString(),
    completedAt: enrollment.completedAt?.toISOString() ?? null,
    bestPercentage: best.get(enrollment.userId) ?? null,
    certificateId: certificateByUser.get(enrollment.userId) ?? null,
  }))
}

/** Active learners matching a search, for course managers assigning the course to individuals. */
export async function searchAssignableLearners(actor: Actor, courseId: string, search: string): Promise<LearnerCandidateDto[]> {
  const course = found(await db.course.findUnique({ where: { id: courseId } }), 'Course')
  assertCanManageCourse(actor, course)
  const term = search.trim()
  const learners = await db.user.findMany({
    where: {
      isActive: true,
      role: { in: [...LEARNER_ROLES] },
      ...(term
        ? { OR: [{ firstName: ilike(term) }, { lastName: ilike(term) }, { email: ilike(term) }, { department: ilike(term) }] }
        : {}),
    },
    select: { ...userSummarySelect, email: true, enrollments: { where: { courseId }, select: { status: true } } },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    take: 25,
  })
  return learners.map(({ enrollments, email, ...user }) => ({
    ...toUserSummary(user),
    email,
    enrolled: enrollments.some((enrollment) => enrollment.status !== 'dropped'),
  }))
}
