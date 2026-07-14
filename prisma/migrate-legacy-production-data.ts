import { PrismaClient } from '@prisma/client'

function assertMigrationAllowed() {
  if (process.env.ALLOW_LEGACY_PRODUCTION_MIGRATION !== 'true') {
    throw new Error('Legacy Production data migration is not authorized.')
  }
  if (process.env.VERCEL_ENV !== 'production') {
    throw new Error('Legacy Production data migration requires VERCEL_ENV=production.')
  }
  const source = process.env.LEGACY_DATABASE_URL?.trim()
  const target = process.env.DATABASE_URL?.trim()
  if (!/^postgres(?:ql)?:\/\//i.test(source ?? '') || !/^postgres(?:ql)?:\/\//i.test(target ?? '')) {
    throw new Error('PostgreSQL source and target URLs are required.')
  }
  if (source === target) throw new Error('Legacy source and new Production target must be different databases.')
  return { source: source!, target: target! }
}

async function legacyCounts(prisma: PrismaClient) {
  const [
    users, sessions, activityLogs, settings, categories, courses, sections, lessons,
    enrollments, lessonProgress, quizzes, questions, answerOptions, quizAttempts,
    quizAnswers, libraryResources, resourceDownloads, resourceBookmarks,
    certificateTemplates, certificates, notifications,
  ] = await Promise.all([
    prisma.user.count(), prisma.userSession.count(), prisma.activityLog.count(), prisma.setting.count(),
    prisma.category.count(), prisma.course.count(), prisma.section.count(), prisma.lesson.count(),
    prisma.enrollment.count(), prisma.lessonProgress.count(), prisma.quiz.count(), prisma.question.count(),
    prisma.answerOption.count(), prisma.quizAttempt.count(), prisma.quizAnswer.count(),
    prisma.libraryResource.count(), prisma.resourceDownload.count(), prisma.resourceBookmark.count(),
    prisma.certificateTemplate.count(), prisma.certificate.count(), prisma.notification.count(),
  ])
  return {
    users, sessions, activityLogs, settings, categories, courses, sections, lessons,
    enrollments, lessonProgress, quizzes, questions, answerOptions, quizAttempts,
    quizAnswers, libraryResources, resourceDownloads, resourceBookmarks,
    certificateTemplates, certificates, notifications,
  }
}

async function main() {
  const urls = assertMigrationAllowed()
  const source = new PrismaClient({ datasources: { db: { url: urls.source } } })
  const target = new PrismaClient({ datasources: { db: { url: urls.target } } })

  try {
    const [sourceBefore, targetBefore] = await Promise.all([legacyCounts(source), legacyCounts(target)])
    console.warn(JSON.stringify({ phase: 'legacy-copy-before', source: sourceBefore, target: targetBefore }))

    const users = await source.user.findMany({ select: {
      id: true, email: true, username: true, passwordHash: true, role: true, firstName: true,
      lastName: true, middleName: true, phone: true, avatarUrl: true, department: true,
      position: true, isActive: true, lastLoginAt: true, emailVerifiedAt: true, oneidPin: true,
      externalId: true, createdAt: true, updatedAt: true,
    } })
    if (users.length) await target.user.createMany({ data: users, skipDuplicates: true })

    const sessions = await source.userSession.findMany({ select: {
      id: true, userId: true, refreshToken: true, deviceInfo: true, ipAddress: true,
      expiresAt: true, createdAt: true, revokedAt: true,
    } })
    if (sessions.length) await target.userSession.createMany({ data: sessions, skipDuplicates: true })

    const activityLogs = await source.activityLog.findMany({ select: {
      id: true, userId: true, action: true, entity: true, entityId: true, ipAddress: true,
      userAgent: true, metadata: true, createdAt: true,
    } })
    if (activityLogs.length) await target.activityLog.createMany({ data: activityLogs, skipDuplicates: true })

    const settings = await source.setting.findMany({ select: { id: true, key: true, value: true } })
    if (settings.length) await target.setting.createMany({ data: settings, skipDuplicates: true })

    const categories = await source.category.findMany({ select: {
      id: true, name: true, slug: true, description: true, parentId: true, icon: true,
      order: true, createdAt: true, updatedAt: true,
    } })
    const pendingCategories = [...categories]
    const copiedCategoryIds = new Set<string>()
    while (pendingCategories.length) {
      const ready = pendingCategories.filter((category) => !category.parentId || copiedCategoryIds.has(category.parentId))
      if (!ready.length) throw new Error('Legacy category hierarchy contains an unresolved parent or cycle.')
      await target.category.createMany({ data: ready, skipDuplicates: true })
      for (const category of ready) {
        copiedCategoryIds.add(category.id)
        pendingCategories.splice(pendingCategories.findIndex((item) => item.id === category.id), 1)
      }
    }

    const courses = await source.course.findMany({ select: {
      id: true, title: true, description: true, slug: true, categoryId: true, tutorId: true,
      thumbnailUrl: true, durationHours: true, level: true, status: true, isMandatory: true,
      passPercentage: true, maxAttempts: true, validDays: true, createdBy: true,
      publishedAt: true, createdAt: true, updatedAt: true,
    } })
    if (courses.length) await target.course.createMany({ data: courses, skipDuplicates: true })

    const sections = await source.section.findMany({ select: {
      id: true, courseId: true, title: true, description: true, order: true, createdAt: true, updatedAt: true,
    } })
    if (sections.length) await target.section.createMany({ data: sections, skipDuplicates: true })

    const lessons = await source.lesson.findMany({ select: {
      id: true, courseId: true, sectionId: true, title: true, description: true, content: true,
      type: true, videoUrl: true, fileUrl: true, durationMin: true, order: true, isFree: true,
      createdAt: true, updatedAt: true,
    } })
    if (lessons.length) await target.lesson.createMany({ data: lessons, skipDuplicates: true })

    const enrollments = await source.enrollment.findMany({ select: {
      id: true, courseId: true, userId: true, status: true, progress: true, startedAt: true,
      completedAt: true, deadlineAt: true,
    } })
    if (enrollments.length) await target.enrollment.createMany({ data: enrollments, skipDuplicates: true })

    const lessonProgress = await source.lessonProgress.findMany({ select: {
      id: true, lessonId: true, userId: true, isCompleted: true, watchTimeSec: true,
      lastPosition: true, completedAt: true, updatedAt: true,
    } })
    if (lessonProgress.length) await target.lessonProgress.createMany({ data: lessonProgress, skipDuplicates: true })

    const quizzes = await source.quiz.findMany({ select: {
      id: true, title: true, description: true, courseId: true, lessonId: true, timeLimitMin: true,
      passingScore: true, maxAttempts: true, shuffleQuestions: true, showAnswers: true,
      status: true, createdBy: true, createdAt: true, updatedAt: true,
    } })
    if (quizzes.length) await target.quiz.createMany({ data: quizzes, skipDuplicates: true })

    const questions = await source.question.findMany({ select: {
      id: true, quizId: true, type: true, text: true, points: true, explanation: true,
      order: true, createdAt: true,
    } })
    if (questions.length) await target.question.createMany({ data: questions, skipDuplicates: true })

    const answerOptions = await source.answerOption.findMany({ select: {
      id: true, questionId: true, text: true, isCorrect: true, order: true,
    } })
    if (answerOptions.length) await target.answerOption.createMany({ data: answerOptions, skipDuplicates: true })

    const quizAttempts = await source.quizAttempt.findMany({ select: {
      id: true, quizId: true, userId: true, status: true, score: true, maxScore: true,
      percentage: true, passed: true, startedAt: true, submittedAt: true, timeSpentSec: true,
    } })
    if (quizAttempts.length) await target.quizAttempt.createMany({ data: quizAttempts, skipDuplicates: true })

    const quizAnswers = await source.quizAnswer.findMany({ select: {
      id: true, attemptId: true, questionId: true, userId: true, selectedOptions: true,
      textAnswer: true, isCorrect: true, pointsAwarded: true,
    } })
    if (quizAnswers.length) await target.quizAnswer.createMany({ data: quizAnswers, skipDuplicates: true })

    const libraryResources = await source.libraryResource.findMany({ select: {
      id: true, title: true, description: true, type: true, category: true, author: true,
      publisher: true, year: true, language: true, pages: true, fileUrl: true, fileSize: true,
      fileType: true, coverUrl: true, tags: true, downloadCount: true, viewCount: true,
      uploadedBy: true, status: true, createdAt: true, updatedAt: true,
    } })
    if (libraryResources.length) await target.libraryResource.createMany({ data: libraryResources, skipDuplicates: true })

    const resourceDownloads = await source.resourceDownload.findMany({ select: {
      id: true, resourceId: true, userId: true, createdAt: true,
    } })
    if (resourceDownloads.length) await target.resourceDownload.createMany({ data: resourceDownloads, skipDuplicates: true })

    const resourceBookmarks = await source.resourceBookmark.findMany({ select: {
      id: true, resourceId: true, userId: true, createdAt: true,
    } })
    if (resourceBookmarks.length) await target.resourceBookmark.createMany({ data: resourceBookmarks, skipDuplicates: true })

    const certificateTemplates = await source.certificateTemplate.findMany({ select: {
      id: true, name: true, titleText: true, bodyText: true, signerName: true, signerTitle: true,
      primaryColor: true, accentColor: true, isActive: true, createdAt: true,
    } })
    if (certificateTemplates.length) await target.certificateTemplate.createMany({ data: certificateTemplates, skipDuplicates: true })

    const certificates = await source.certificate.findMany({ select: {
      id: true, certNumber: true, userId: true, courseId: true, templateId: true, attemptId: true,
      score: true, maxScore: true, percentage: true, issuedAt: true, validUntil: true,
      status: true, verifyHash: true, createdAt: true,
    } })
    if (certificates.length) await target.certificate.createMany({ data: certificates, skipDuplicates: true })

    const notifications = await source.notification.findMany({ select: {
      id: true, userId: true, type: true, title: true, message: true, link: true,
      isRead: true, createdAt: true,
    } })
    if (notifications.length) await target.notification.createMany({ data: notifications, skipDuplicates: true })

    const targetAfter = await legacyCounts(target)
    console.warn(JSON.stringify({ phase: 'legacy-copy-after', source: sourceBefore, target: targetAfter }))
    for (const [model, sourceCount] of Object.entries(sourceBefore)) {
      const targetCount = targetAfter[model as keyof typeof targetAfter]
      if (targetCount < sourceCount) throw new Error(`Target ${model} count is lower than the legacy source after copy.`)
    }
  } finally {
    await Promise.all([source.$disconnect(), target.$disconnect()])
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Legacy Production data migration failed.')
  process.exitCode = 1
})
