// Realistic, repeatable demo activity for development and Preview databases:
// fictional staff, enrolments, lesson progress, graded attempts (using the
// real grading rules), certificates, notifications and sign-in history.
// Running it again rebuilds the demo users' activity from scratch.
import type { Prisma, PrismaClient } from '@prisma/client'
import { hashPassword } from '../../src/server/auth/password'
import { generateCertNumber, generateVerifyHash } from '../../src/server/modules/certificates/codes'
import { gradeAttempt, type SubmittedAnswer } from '../../src/server/modules/quizzes/grading'
import { COURSES, LIBRARY_RESOURCES } from '../content'
import { courseId, deliverAnnouncements, quizId } from './catalog'
import { COURSE_TUTORS, DEPARTMENT, DEPARTMENT_COURSES, LEARNERS, STAFF, type DemoPerson } from './people'

const DAY = 24 * 60 * 60 * 1000

/** Deterministic PRNG so every run produces the same demo story. */
function createRandom(seed: number) {
  let state = seed >>> 0
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    int: (min: number, max: number) => min + Math.floor(next() * (max - min + 1)),
    pick: <T>(items: readonly T[]) => items[Math.floor(next() * items.length)],
    chance: (probability: number) => next() < probability,
    shuffle: <T>(items: readonly T[]) => {
      const copy = [...items]
      for (let index = copy.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(next() * (index + 1))
        ;[copy[index], copy[swap]] = [copy[swap], copy[index]]
      }
      return copy
    },
  }
}

type Random = ReturnType<typeof createRandom>

const at = (now: Date, daysAgo: number, hour = 10, minute = 0) => {
  const date = new Date(now.getTime() - daysAgo * DAY)
  date.setHours(hour, minute, 0, 0)
  return date
}

type EnrollmentPlan = { course: number; state: 'completed' | 'active' | 'new'; startedDaysAgo: number; lessonsDone?: number; deadlineInDays?: number; skill?: number }

/** The showcase learner account gets a hand-written history. */
const SHOWCASE_PLAN: EnrollmentPlan[] = [
  { course: 1, state: 'completed', startedDaysAgo: 120, skill: 0.92 },
  { course: 18, state: 'completed', startedDaysAgo: 75, skill: 0.85 },
  { course: 2, state: 'active', startedDaysAgo: 30, lessonsDone: 7, deadlineInDays: 21 },
  { course: 3, state: 'active', startedDaysAgo: 12, lessonsDone: 3 },
  { course: 16, state: 'new', startedDaysAgo: 3, deadlineInDays: 45 },
]

function planFor(learner: DemoPerson, random: Random): EnrollmentPlan[] {
  if (learner.email.startsWith('learner@')) return SHOWCASE_PLAN
  const relevant = DEPARTMENT_COURSES[learner.department]
  const required = [1, 18]
  const optional = random.shuffle(relevant.filter((course) => !required.includes(course))).slice(0, random.int(1, 4))
  return [...required, ...optional].map((course) => {
    const roll = random.next()
    const state = roll < 0.42 ? 'completed' : roll < 0.85 ? 'active' : 'new'
    const mandatory = COURSES[course - 1].mandatory
    return {
      course,
      state,
      startedDaysAgo: state === 'completed' ? random.int(35, 330) : random.int(4, 175),
      lessonsDone: state === 'active' ? random.int(1, 8) : undefined,
      deadlineInDays: mandatory && state !== 'completed' ? random.int(10, 80) : undefined,
    }
  })
}

async function resetDemoActivity(prisma: PrismaClient, userIds: string[]) {
  const where = { userId: { in: userIds } }
  await prisma.quizAttempt.deleteMany({ where })
  await prisma.certificate.deleteMany({ where })
  await prisma.lessonProgress.deleteMany({ where })
  await prisma.enrollment.deleteMany({ where })
  await prisma.notification.deleteMany({ where })
  await prisma.activityLog.deleteMany({ where })
  await prisma.resourceBookmark.deleteMany({ where })
  await prisma.resourceDownload.deleteMany({ where })
}

async function upsertPeople(prisma: PrismaClient, password: string, now: Date) {
  const people = [...STAFF, ...LEARNERS]
  const hashes = await Promise.all(people.map(() => hashPassword(password)))
  for (const [index, member] of people.entries()) {
    const data = {
      email: member.email,
      username: member.username,
      role: member.role,
      firstName: member.firstName,
      lastName: member.lastName,
      middleName: member.middleName,
      department: DEPARTMENT[member.department],
      position: member.position,
      phone: member.phone,
      isActive: true,
      mustChangePassword: false,
      passwordHash: hashes[index],
    }
    await prisma.user.upsert({
      where: { id: member.id },
      update: data,
      create: { id: member.id, ...data, emailVerifiedAt: now, createdAt: at(now, 380 - index) },
    })
  }
  return people
}

type QuizWithQuestions = Prisma.QuizGetPayload<{ include: { questions: { include: { options: true } } } }>

/** Simulates a learner answering: each question is answered correctly with probability `skill`. */
function simulateAnswers(quiz: QuizWithQuestions, skill: number, random: Random): Map<string, SubmittedAnswer> {
  const answers = new Map<string, SubmittedAnswer>()
  for (const question of quiz.questions) {
    const correct = question.options.filter((option) => option.isCorrect)
    const wrong = question.options.filter((option) => !option.isCorrect)
    const right = random.chance(skill)
    if (question.type === 'fill_blank') {
      answers.set(question.id, { textAnswer: right ? correct[0]?.text : 'bilmayman' })
    } else if (question.type === 'multiple_choice') {
      answers.set(question.id, { selectedOptions: right ? correct.map((option) => option.id) : [correct[0].id, ...(wrong[0] ? [wrong[0].id] : [])] })
    } else {
      answers.set(question.id, { selectedOptions: [right || wrong.length === 0 ? correct[0].id : random.pick(wrong).id] })
    }
  }
  return answers
}

export async function seedDemo(prisma: PrismaClient, options: { password: string; now?: Date; log?: (message: string) => void }) {
  const now = options.now ?? new Date()
  const random = createRandom(20261006)
  const log = options.log ?? (() => undefined)

  const people = await upsertPeople(prisma, options.password, now)
  const ids = people.map((member) => member.id)
  await resetDemoActivity(prisma, ids)

  // Course ownership follows the instructors' specialisations.
  for (const [number, tutorKey] of Object.entries(COURSE_TUTORS)) {
    await prisma.course.updateMany({ where: { id: courseId(Number(number) - 1) }, data: { tutorId: `demo-user-${tutorKey}` } })
  }
  // Retire the generic courses of the first demo dataset, if present.
  await prisma.course.updateMany({ where: { id: { startsWith: 'demo-course-' } }, data: { status: 'archived' } })

  const quizzes = new Map<number, QuizWithQuestions>()
  for (let number = 1; number <= COURSES.length; number += 1) {
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId(number - 1) }, include: { questions: { include: { options: true }, orderBy: { order: 'asc' } } } })
    if (quiz) quizzes.set(number, quiz)
  }
  const lessonsByCourse = new Map<number, Array<{ id: string; durationMin: number }>>()
  for (let number = 1; number <= COURSES.length; number += 1) {
    lessonsByCourse.set(number, await prisma.lesson.findMany({ where: { courseId: courseId(number - 1) }, orderBy: { order: 'asc' }, select: { id: true, durationMin: true } }))
  }
  const template = await prisma.certificateTemplate.findFirst({ where: { isActive: true } })

  const logs: Prisma.ActivityLogCreateManyInput[] = []
  const notifications: Prisma.NotificationCreateManyInput[] = []
  let certificatesIssued = 0

  for (const learner of LEARNERS) {
    const skill = 0.62 + random.next() * 0.33
    for (const plan of planFor(learner, random)) {
      const course = COURSES[plan.course - 1]
      const lessons = lessonsByCourse.get(plan.course) ?? []
      const startedAt = at(now, plan.startedDaysAgo, random.int(8, 17), random.int(0, 59))
      const lessonsDone = plan.state === 'completed' ? lessons.length : plan.state === 'active' ? Math.min(plan.lessonsDone ?? 1, lessons.length - 1) : 0
      const spanDays = plan.state === 'completed' ? Math.max(5, Math.min(plan.startedDaysAgo - 2, random.int(10, 40))) : Math.max(1, plan.startedDaysAgo - 1)
      const completedAt = plan.state === 'completed' ? new Date(startedAt.getTime() + spanDays * DAY) : null
      const progress = lessons.length ? Math.round((lessonsDone / lessons.length) * 100) : 0

      await prisma.enrollment.create({
        data: {
          userId: learner.id,
          courseId: courseId(plan.course - 1),
          status: plan.state === 'completed' ? 'completed' : 'active',
          progress,
          startedAt,
          completedAt,
          deadlineAt: plan.deadlineInDays ? at(now, -plan.deadlineInDays, 18) : null,
        },
      })
      notifications.push({
        userId: learner.id,
        type: 'success',
        title: 'Kursga yozildingiz',
        message: `“${course.title}” kursiga muvaffaqiyatli yozildingiz. Birinchi darsdan boshlang!`,
        link: `/courses/${courseId(plan.course - 1)}`,
        isRead: plan.startedDaysAgo > 5,
        createdAt: startedAt,
      })

      for (let index = 0; index < lessonsDone; index += 1) {
        const doneAt = new Date(startedAt.getTime() + ((index + 1) / Math.max(1, lessonsDone)) * spanDays * DAY * (plan.state === 'completed' ? 1 : 0.9))
        await prisma.lessonProgress.create({
          data: { lessonId: lessons[index].id, userId: learner.id, isCompleted: true, watchTimeSec: lessons[index].durationMin * 60, completedAt: doneAt },
        })
        logs.push({ userId: learner.id, action: 'complete_lesson', entity: 'lesson', entityId: lessons[index].id, createdAt: doneAt, ipAddress: '10.20.1.15' })
      }

      const quiz = quizzes.get(plan.course)
      if (plan.state !== 'completed' || !quiz || !completedAt) continue

      logs.push({ userId: learner.id, action: 'complete_course', entity: 'course', entityId: courseId(plan.course - 1), createdAt: completedAt, ipAddress: '10.20.1.15' })
      let attemptSkill = plan.skill ?? skill
      for (let attemptNumber = 1; attemptNumber <= 2; attemptNumber += 1) {
        const startedAttempt = new Date(completedAt.getTime() + random.int(2, 72) * 60 * 60 * 1000 + (attemptNumber - 1) * 2 * DAY)
        if (startedAttempt > now) break
        const grade = gradeAttempt(quiz.questions, simulateAnswers(quiz, attemptSkill, random))
        const passed = grade.percentage >= quiz.passingScore
        const timeSpentSec = random.int(7, 18) * 60 + random.int(0, 59)
        const submittedAt = new Date(startedAttempt.getTime() + timeSpentSec * 1000)
        const attempt = await prisma.quizAttempt.create({
          data: {
            quizId: quiz.id,
            userId: learner.id,
            status: 'graded',
            score: grade.score,
            maxScore: grade.maxScore,
            percentage: grade.percentage,
            passed,
            startedAt: startedAttempt,
            submittedAt,
            timeSpentSec,
            answers: {
              create: grade.questions.map((question) => ({
                questionId: question.questionId,
                userId: learner.id,
                selectedOptions: question.selectedOptions.length ? JSON.stringify(question.selectedOptions) : null,
                textAnswer: question.textAnswer,
                isCorrect: question.isCorrect,
                pointsAwarded: question.pointsAwarded,
              })),
            },
          },
        })
        logs.push({ userId: learner.id, action: 'submit_quiz_attempt', entity: 'quiz', entityId: quiz.id, metadata: JSON.stringify({ attemptId: attempt.id, percentage: grade.percentage, passed }), createdAt: submittedAt, ipAddress: '10.20.1.15' })
        notifications.push({
          userId: learner.id,
          type: passed ? 'success' : 'warning',
          title: passed ? 'Test muvaffaqiyatli topshirildi' : 'Test natijasi',
          message: `“${quiz.title}”: ${grade.percentage}% (o‘tish chegarasi ${quiz.passingScore}%).`,
          link: `/attempts/${attempt.id}`,
          isRead: true,
          createdAt: submittedAt,
        })

        if (passed) {
          const certificate = await prisma.certificate.create({
            data: {
              certNumber: generateCertNumber(submittedAt),
              verifyHash: generateVerifyHash(),
              userId: learner.id,
              courseId: courseId(plan.course - 1),
              templateId: template?.id ?? null,
              attemptId: attempt.id,
              score: grade.score,
              maxScore: grade.maxScore,
              percentage: grade.percentage,
              issuedAt: submittedAt,
              validUntil: course.mandatory ? new Date(submittedAt.getTime() + 365 * DAY) : null,
            },
          })
          certificatesIssued += 1
          notifications.push({
            userId: learner.id,
            type: 'success',
            title: 'Sertifikatingiz tayyor',
            message: `“${course.title}” kursi bo‘yicha ${certificate.certNumber} raqamli sertifikat berildi.`,
            link: `/certificates/${certificate.id}`,
            isRead: (now.getTime() - submittedAt.getTime()) / DAY > 3,
            createdAt: submittedAt,
          })
          logs.push({ userId: learner.id, action: 'certificate_issued', entity: 'certificate', entityId: certificate.id, createdAt: submittedAt })
          break
        }
        attemptSkill = Math.min(0.98, attemptSkill + 0.15)
      }
    }
  }

  // Sign-in history for the last 45 days drives the "active users" charts.
  for (const member of people) {
    const engagement = member.role === 'learner' ? 0.25 + random.next() * 0.45 : 0.55
    let lastLogin: Date | null = null
    for (let daysAgo = 45; daysAgo >= 0; daysAgo -= 1) {
      const date = new Date(now.getTime() - daysAgo * DAY)
      const weekend = date.getDay() === 0 || date.getDay() === 6
      if (!random.chance(weekend ? engagement * 0.15 : engagement)) continue
      const loginAt = at(now, daysAgo, random.int(8, 18), random.int(0, 59))
      if (loginAt > now) continue
      logs.push({ userId: member.id, action: 'login', entity: 'user', entityId: member.id, createdAt: loginAt, ipAddress: `10.20.${random.int(1, 9)}.${random.int(10, 250)}`, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' })
      lastLogin = loginAt
    }
    if (lastLogin) await prisma.user.update({ where: { id: member.id }, data: { lastLoginAt: lastLogin } })
  }

  // Library usage: bookmarks and downloads, then counters that agree with them.
  const resources = await prisma.libraryResource.findMany({ where: { slug: { in: LIBRARY_RESOURCES.map((resource) => resource.slug) } }, select: { id: true } })
  for (const member of LEARNERS) {
    for (const resource of random.shuffle(resources).slice(0, random.int(0, 4))) {
      await prisma.resourceBookmark.create({ data: { userId: member.id, resourceId: resource.id, createdAt: at(now, random.int(1, 90)) } })
    }
    for (const resource of random.shuffle(resources).slice(0, random.int(0, 6))) {
      const downloadedAt = at(now, random.int(0, 120), random.int(8, 18))
      await prisma.resourceDownload.create({ data: { userId: member.id, resourceId: resource.id, createdAt: downloadedAt } })
      logs.push({ userId: member.id, action: 'download_resource', entity: 'library_resource', entityId: resource.id, createdAt: downloadedAt })
    }
  }
  for (const resource of resources) {
    const downloads = await prisma.resourceDownload.count({ where: { resourceId: resource.id } })
    await prisma.libraryResource.update({ where: { id: resource.id }, data: { downloadCount: downloads, viewCount: downloads * 3 + random.int(8, 60) } })
  }

  await prisma.activityLog.createMany({ data: logs })
  await prisma.notification.createMany({ data: notifications })
  await deliverAnnouncements(prisma, ids, (index) => at(now, 40 - index * 9))
  await prisma.notification.updateMany({ where: { userId: { in: ids }, eventKey: { not: null }, createdAt: { lt: at(now, 7) } }, data: { isRead: true } })

  log(`Demo data: ${people.length} users, ${certificatesIssued} certificates, ${logs.length} activity records.`)
}
