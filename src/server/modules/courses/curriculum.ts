import { audit } from '@/server/audit'
import { assertCanManageCourse, isLearnerRole, type Actor } from '@/server/auth/permissions'
import { db } from '@/server/db'
import { badRequest, forbidden, found, unprocessable } from '@/server/http/errors'
import { issueCertificateIfEligible } from '@/server/modules/certificates/service'
import { notify } from '@/server/modules/notifications/service'
import type { EnrollmentStatus, LessonDetailDto, LessonProgressResultDto, LessonType } from '@/shared/dto'
import type { LessonInput, LessonUpdateInput, SectionInput } from '@/shared/schemas'
import { safeResourceUrl } from '@/shared/url'
import { findVisibleCourse } from './service'
import { orderLessons, progressPercent, requiredWatchSeconds } from './progress'

async function findManagedCourse(actor: Actor, courseId: string) {
  const course = found(await db.course.findUnique({ where: { id: courseId } }), 'Course')
  assertCanManageCourse(actor, course)
  return course
}

function sanitizeUrls<T extends { videoUrl?: string | null; fileUrl?: string | null }>(input: T): T {
  const result = { ...input }
  if (input.videoUrl !== undefined) {
    result.videoUrl = input.videoUrl ? safeResourceUrl(input.videoUrl) : null
    if (input.videoUrl && !result.videoUrl) throw badRequest('VALIDATION_FAILED', 'Video URL must be an https link')
  }
  if (input.fileUrl !== undefined) {
    result.fileUrl = input.fileUrl ? safeResourceUrl(input.fileUrl) : null
    if (input.fileUrl && !result.fileUrl) throw badRequest('VALIDATION_FAILED', 'File URL must be an https link')
  }
  return result
}

// --- Sections ---------------------------------------------------------------------

export async function createSection(actor: Actor, courseId: string, input: SectionInput, req: Request) {
  await findManagedCourse(actor, courseId)
  const last = await db.section.aggregate({ where: { courseId }, _max: { order: true } })
  const section = await db.section.create({ data: { ...input, courseId, order: (last._max.order ?? 0) + 1 } })
  await audit({ userId: actor.id, action: 'create_section', entity: 'section', entityId: section.id, metadata: { courseId }, request: req })
  return section
}

async function findManagedSection(actor: Actor, sectionId: string) {
  const section = found(await db.section.findUnique({ where: { id: sectionId }, include: { course: true } }), 'Section')
  assertCanManageCourse(actor, section.course)
  return section
}

export async function updateSection(actor: Actor, sectionId: string, input: Partial<SectionInput>) {
  await findManagedSection(actor, sectionId)
  return db.section.update({ where: { id: sectionId }, data: input })
}

export async function deleteSection(actor: Actor, sectionId: string, req: Request) {
  const section = await findManagedSection(actor, sectionId)
  const lessons = await db.lesson.count({ where: { sectionId } })
  if (lessons && section.course.status === 'published') {
    throw unprocessable('CONFLICT', 'Move or delete the lessons of a published course section first')
  }
  await db.section.delete({ where: { id: sectionId } })
  await recalculateCourseProgress(section.courseId)
  await audit({ userId: actor.id, action: 'delete_section', entity: 'section', entityId: sectionId, request: req })
}

export async function reorderSections(actor: Actor, courseId: string, ids: string[]) {
  await findManagedCourse(actor, courseId)
  const sections = await db.section.findMany({ where: { courseId }, select: { id: true } })
  if (sections.length !== ids.length || !sections.every((section) => ids.includes(section.id))) {
    throw badRequest('VALIDATION_FAILED', 'The order must list every section of the course exactly once')
  }
  await db.$transaction(ids.map((id, index) => db.section.update({ where: { id }, data: { order: index + 1 } })))
}

// --- Lessons ----------------------------------------------------------------------

export async function createLesson(actor: Actor, courseId: string, input: LessonInput, req: Request) {
  await findManagedCourse(actor, courseId)
  const section = await db.section.findFirst({ where: { id: input.sectionId, courseId } })
  if (!section) throw badRequest('VALIDATION_FAILED', 'The section does not belong to this course')
  const last = await db.lesson.aggregate({ where: { courseId, sectionId: section.id }, _max: { order: true } })
  const lesson = await db.lesson.create({
    data: { ...sanitizeUrls(input), courseId, order: (last._max.order ?? 0) + 1 },
  })
  await recalculateCourseProgress(courseId)
  await audit({ userId: actor.id, action: 'create_lesson', entity: 'lesson', entityId: lesson.id, metadata: { courseId }, request: req })
  return lesson
}

async function findLessonWithCourse(lessonId: string) {
  return found(await db.lesson.findUnique({ where: { id: lessonId }, include: { course: true } }), 'Lesson')
}

export async function updateLesson(actor: Actor, lessonId: string, input: LessonUpdateInput, req: Request) {
  const lesson = await findLessonWithCourse(lessonId)
  assertCanManageCourse(actor, lesson.course)
  if (input.sectionId) {
    const section = await db.section.findFirst({ where: { id: input.sectionId, courseId: lesson.courseId } })
    if (!section) throw badRequest('VALIDATION_FAILED', 'The section does not belong to this course')
  }
  const updated = await db.lesson.update({ where: { id: lessonId }, data: sanitizeUrls(input) })
  await audit({ userId: actor.id, action: 'update_lesson', entity: 'lesson', entityId: lessonId, metadata: { fields: Object.keys(input) }, request: req })
  return updated
}

export async function deleteLesson(actor: Actor, lessonId: string, req: Request) {
  const lesson = await findLessonWithCourse(lessonId)
  assertCanManageCourse(actor, lesson.course)
  await db.lesson.delete({ where: { id: lessonId } })
  await recalculateCourseProgress(lesson.courseId)
  await audit({ userId: actor.id, action: 'delete_lesson', entity: 'lesson', entityId: lessonId, request: req })
}

export async function reorderLessons(actor: Actor, sectionId: string, ids: string[]) {
  const section = await findManagedSection(actor, sectionId)
  const lessons = await db.lesson.findMany({ where: { sectionId }, select: { id: true } })
  if (lessons.length !== ids.length || !lessons.every((lesson) => ids.includes(lesson.id))) {
    throw badRequest('VALIDATION_FAILED', 'The order must list every lesson of the section exactly once')
  }
  await db.$transaction(ids.map((id, index) => db.lesson.update({ where: { id }, data: { order: index + 1 } })))
  return section.courseId
}

// --- Learning -----------------------------------------------------------------------

export async function getLesson(actor: Actor, lessonId: string): Promise<LessonDetailDto> {
  const lesson = await findLessonWithCourse(lessonId)
  await findVisibleCourse(actor, lesson.courseId)

  const [sections, siblings, enrollment, progress] = await Promise.all([
    db.section.findMany({ where: { courseId: lesson.courseId }, select: { id: true, order: true } }),
    db.lesson.findMany({ where: { courseId: lesson.courseId }, select: { id: true, order: true, sectionId: true, isFree: true } }),
    db.enrollment.findUnique({ where: { courseId_userId: { courseId: lesson.courseId, userId: actor.id } } }),
    db.lessonProgress.findUnique({ where: { lessonId_userId: { lessonId, userId: actor.id } } }),
  ])

  const enrolled = Boolean(enrollment && enrollment.status !== 'dropped')
  const locked = isLearnerRole(actor.role) && !enrolled && !lesson.isFree
  if (locked) throw forbidden('NOT_ENROLLED', 'Enroll in the course to open this lesson')

  const ordered = orderLessons(sections, siblings)
  const index = ordered.findIndex((item) => item.id === lessonId)

  return {
    id: lesson.id,
    courseId: lesson.courseId,
    sectionId: lesson.sectionId,
    title: lesson.title,
    description: lesson.description,
    type: lesson.type as LessonType,
    durationMin: lesson.durationMin,
    order: lesson.order,
    isFree: lesson.isFree,
    isLocked: false,
    isCompleted: progress?.isCompleted ?? false,
    content: lesson.content,
    videoUrl: lesson.videoUrl,
    fileUrl: lesson.fileUrl,
    watchTimeSec: progress?.watchTimeSec ?? 0,
    requiredWatchSec: requiredWatchSeconds(lesson),
    previousLessonId: index > 0 ? ordered[index - 1].id : null,
    nextLessonId: index >= 0 && index < ordered.length - 1 ? ordered[index + 1].id : null,
  }
}

/** Re-derives every enrollment's progress after the curriculum changes. */
async function recalculateCourseProgress(courseId: string) {
  const total = await db.lesson.count({ where: { courseId } })
  const enrollments = await db.enrollment.findMany({ where: { courseId }, select: { id: true, userId: true, status: true } })
  for (const enrollment of enrollments) {
    const completed = await db.lessonProgress.count({ where: { userId: enrollment.userId, isCompleted: true, lesson: { courseId } } })
    const progress = progressPercent(completed, total)
    await db.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress,
        // Adding lessons re-opens a completed enrollment; it never completes one silently.
        ...(enrollment.status === 'completed' && progress < 100 ? { status: 'active', completedAt: null } : {}),
      },
    })
  }
}

export async function recordProgress(
  actor: Actor,
  lessonId: string,
  input: { completed?: boolean; watchTimeSec?: number },
  req: Request
): Promise<LessonProgressResultDto> {
  if (!isLearnerRole(actor.role)) throw forbidden('LEARNERS_ONLY', 'Only learners track progress')
  const lesson = await findLessonWithCourse(lessonId)
  const enrollment = await db.enrollment.findUnique({ where: { courseId_userId: { courseId: lesson.courseId, userId: actor.id } } })
  if (!enrollment || enrollment.status === 'dropped') throw forbidden('NOT_ENROLLED', 'Enroll in the course first')

  const existing = await db.lessonProgress.findUnique({ where: { lessonId_userId: { lessonId, userId: actor.id } } })
  // Watch time only ever grows, and is capped at a day to reject nonsense values.
  const watchTimeSec = Math.min(86_400, Math.max(existing?.watchTimeSec ?? 0, Math.floor(input.watchTimeSec ?? 0)))
  const wantsCompletion = input.completed ?? existing?.isCompleted ?? false
  if (wantsCompletion && !existing?.isCompleted && watchTimeSec < requiredWatchSeconds(lesson)) {
    throw unprocessable('VIDEO_INCOMPLETE', 'Watch the video before marking it complete', { requiredWatchSec: requiredWatchSeconds(lesson) })
  }
  const isCompleted = existing?.isCompleted || wantsCompletion

  await db.lessonProgress.upsert({
    where: { lessonId_userId: { lessonId, userId: actor.id } },
    update: { isCompleted, watchTimeSec, lastPosition: watchTimeSec, completedAt: isCompleted ? (existing?.completedAt ?? new Date()) : null },
    create: { lessonId, userId: actor.id, isCompleted, watchTimeSec, lastPosition: watchTimeSec, completedAt: isCompleted ? new Date() : null },
  })

  const [totalLessons, completedLessons] = await Promise.all([
    db.lesson.count({ where: { courseId: lesson.courseId } }),
    db.lessonProgress.count({ where: { userId: actor.id, isCompleted: true, lesson: { courseId: lesson.courseId } } }),
  ])
  const courseProgress = progressPercent(completedLessons, totalLessons)
  const justCompleted = courseProgress >= 100 && enrollment.status !== 'completed'

  const updated = await db.enrollment.update({
    where: { id: enrollment.id },
    data: {
      progress: courseProgress,
      status: courseProgress >= 100 ? 'completed' : 'active',
      completedAt: courseProgress >= 100 ? (enrollment.completedAt ?? new Date()) : null,
    },
  })

  let certificateIssued: LessonProgressResultDto['certificateIssued'] = null
  if (isCompleted && !existing?.isCompleted) {
    await audit({ userId: actor.id, action: 'complete_lesson', entity: 'lesson', entityId: lessonId, metadata: { courseId: lesson.courseId }, request: req })
  }
  if (justCompleted) {
    await audit({ userId: actor.id, action: 'complete_course', entity: 'course', entityId: lesson.courseId, request: req })
    await notify(actor.id, {
      type: 'success',
      title: 'Kurs yakunlandi',
      message: `“${lesson.course.title}” kursining barcha darslarini tugatdingiz. Endi yakuniy testni topshiring.`,
      link: `/courses/${lesson.courseId}`,
      eventKey: `course-completed-${lesson.courseId}`,
    })
    certificateIssued = await issueCertificateIfEligible(actor.id, lesson.courseId)
  }

  return {
    lessonId,
    isCompleted,
    watchTimeSec,
    courseProgress,
    completedLessons,
    totalLessons,
    enrollmentStatus: updated.status as EnrollmentStatus,
    certificateIssued,
  }
}
