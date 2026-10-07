// Idempotent, non-destructive catalogue initialisation shared by the demo
// seed and the production content initializer. Records use stable ids, so
// re-running updates content in place and never duplicates it.
import type { PrismaClient } from '@prisma/client'
import {
  ANNOUNCEMENTS,
  CATEGORIES,
  COURSES,
  DEPARTMENTS,
  LIBRARY_RESOURCES,
  REGIONAL_DIVISIONS,
  ROLE_DEFINITIONS,
  type CourseContent,
} from '../content'

export const TRAINING_NOTICE =
  'Ushbu material kasbiy tayyorgarlik uchun mo‘ljallangan. Amaliy ishda tashkilotning tasdiqlangan yo‘riqnomalari va vakolatli rahbar ko‘rsatmalari ustuvor hisoblanadi.'

/** Placeholder records created by the first content release; archived (never deleted) once real documents exist. */
const LEGACY_PLACEHOLDER_RESOURCE_SLUGS = [
  'gidrometeorologiya-asosiy-tushunchalar', 'meteorologik-kuzatuv-dala-eslatmasi', 'sinoptik-xarita-belgilari', 'qisqa-prognoz-ish-jarayoni',
  'xavfli-hodisa-kuzatuv-varagi', 'agrometeorologik-fenologiya', 'daryo-havzasi-atamallari', 'gidrologik-post-jurnali', 'suv-sarfi-hisoblash-misol',
  'toshqin-xavfi-kontseptual-model', 'iqlim-qatori-tayyorlash', 'tavsifiy-statistika-eslatma', 'iqlim-moslashuv-variantlari', 'suniy-yoldosh-kanallari',
  'bulut-evolyutsiyasi-video', 'radar-asosiy-mahsulotlar', 'radar-artefaktlari', 'havo-sifati-kuzatuv-joyi', 'havo-sifati-sifat-bayroqlari',
  'asbob-profilaktik-korik', 'metrologik-kuzatuvchanlik', 'malumot-sifati-tekshiruvlari', 'tuzatish-audit-izi', 'dala-ishlari-xavfsizligi',
  'tasdiqlangan-tartiblar-katalogi',
]

export function stableId(prefix: string, index: number) {
  return `production-${prefix}-${String(index + 1).padStart(2, '0')}`
}

export const courseId = (index: number) => stableId('course', index)
export const quizId = (index: number) => `${courseId(index)}-final-quiz`

export interface CatalogOptions {
  /** Author of courses, quizzes and library records. */
  authorId: string
  /** Picks the tutor for a course; defaults to the author. */
  tutorFor?: (course: CourseContent, index: number) => string
  log?: (message: string) => void
}

export async function seedOrganization(prisma: PrismaClient) {
  for (const [index, [code, nameUz, nameRu]] of DEPARTMENTS.entries()) {
    await prisma.department.upsert({
      where: { code },
      update: { nameUz, nameRu, isActive: true },
      create: { id: stableId('department', index), code, nameUz, nameRu, isActive: true },
    })
  }
  for (const [index, [code, nameUz, nameRu]] of REGIONAL_DIVISIONS.entries()) {
    await prisma.regionalDivision.upsert({
      where: { code },
      update: { nameUz, nameRu, isActive: true },
      create: { id: stableId('region', index), code, nameUz, nameRu, isActive: true },
    })
  }
  for (const [roleIndex, role] of ROLE_DEFINITIONS.entries()) {
    const definition = await prisma.roleDefinition.upsert({
      where: { key: role.key },
      update: { nameUz: role.nameUz, isActive: true },
      create: { id: stableId('role', roleIndex), key: role.key, nameUz: role.nameUz, description: 'Ilova ruxsat matritsasi bilan mos keluvchi rol.', isActive: true },
    })
    for (const [permissionIndex, permission] of role.permissions.entries()) {
      await prisma.rolePermission.upsert({
        where: { roleId_permission: { roleId: definition.id, permission } },
        update: {},
        create: { id: `${definition.id}-permission-${String(permissionIndex + 1).padStart(2, '0')}`, roleId: definition.id, permission },
      })
    }
  }
}

async function seedCategories(prisma: PrismaClient) {
  const ids = new Map<string, string>()
  for (const [index, [slug, name, nameRu, icon]] of CATEGORIES.entries()) {
    const data = {
      name,
      nameRu,
      icon,
      description: `${name} yo‘nalishidagi kasbiy tayyorgarlik kurslari.`,
      descriptionRu: `Курсы профессиональной подготовки по направлению «${nameRu}».`,
      order: (index + 1) * 10,
      isActive: true,
    }
    const category = await prisma.category.upsert({ where: { slug }, update: data, create: { id: stableId('category', index), slug, ...data } })
    ids.set(slug, category.id)
  }
  return ids
}

async function seedCourse(prisma: PrismaClient, course: CourseContent, index: number, categoryId: string, options: CatalogOptions) {
  const id = courseId(index)
  const tutorId = options.tutorFor?.(course, index) ?? options.authorId
  const data = {
    title: course.title,
    titleRu: course.titleRu,
    shortSummary: course.summary,
    description: course.description.trim(),
    targetAudience: course.targetAudience,
    learningOutcomes: course.outcomes.join('\n'),
    prerequisites: course.prerequisites.join('\n'),
    language: 'uz',
    certificateEnabled: true,
    generalTrainingNotice: TRAINING_NOTICE,
    categoryId,
    tutorId,
    durationHours: course.durationHours,
    level: course.level,
    status: 'published',
    isMandatory: course.mandatory,
    passPercentage: course.quiz.passingScore,
    maxAttempts: 3,
    // Mandatory training is refreshed yearly; elective certificates do not expire.
    validDays: course.mandatory ? 365 : null,
  }

  const existing = await prisma.course.findUnique({ where: { slug: course.slug } })
  if (existing && existing.id !== id) {
    options.log?.(`Course "${course.slug}" exists with a non-catalogue id; its content is preserved.`)
    return
  }
  await prisma.course.upsert({
    where: { id },
    update: data,
    create: { id, slug: course.slug, createdBy: options.authorId, publishedAt: new Date(), thumbnailUrl: null, ...data },
  })

  let order = 0
  for (const [sectionIndex, section] of course.sections.entries()) {
    const sectionId = `${id}-section-${sectionIndex + 1}`
    await prisma.section.upsert({
      where: { id: sectionId },
      update: { title: section.title, description: section.summary, order: sectionIndex + 1 },
      create: { id: sectionId, courseId: id, title: section.title, description: section.summary, order: sectionIndex + 1 },
    })
    for (const [lessonIndex, lesson] of section.lessons.entries()) {
      order += 1
      const lessonId = `${sectionId}-lesson-${lessonIndex + 1}`
      const lessonData = {
        title: lesson.title,
        description: lesson.summary,
        content: lesson.body.trim(),
        type: lesson.type,
        videoUrl: lesson.videoUrl ?? null,
        durationMin: lesson.durationMin,
        order,
        // The first lesson of every course is an open preview.
        isFree: order === 1,
      }
      await prisma.lesson.upsert({
        where: { id: lessonId },
        update: lessonData,
        create: { id: lessonId, courseId: id, sectionId, ...lessonData },
      })
    }
  }

  await seedQuiz(prisma, course, index, options)
}

async function seedQuiz(prisma: PrismaClient, course: CourseContent, index: number, options: CatalogOptions) {
  const id = quizId(index)
  const settings = {
    title: course.quiz.title,
    description: course.quiz.description,
    courseId: courseId(index),
    timeLimitMin: course.quiz.timeLimitMin,
    passingScore: course.quiz.passingScore,
    maxAttempts: 3,
    shuffleQuestions: true,
    showAnswers: true,
    status: 'published',
  }
  await prisma.quiz.upsert({ where: { id }, update: settings, create: { id, createdBy: options.authorId, ...settings } })

  // Questions are rewritten only while nobody has attempted the quiz, so
  // existing results always keep the questions they were graded against.
  const attempts = await prisma.quizAttempt.count({ where: { quizId: id } })
  if (attempts > 0) {
    options.log?.(`Quiz "${id}" has attempts; its questions were left unchanged.`)
    return
  }
  await prisma.question.deleteMany({ where: { quizId: id } })
  for (const [questionIndex, question] of course.quiz.questions.entries()) {
    const questionId = `${id}-question-${questionIndex + 1}`
    await prisma.question.create({
      data: {
        id: questionId,
        quizId: id,
        type: question.type,
        text: question.text,
        points: question.points ?? 1,
        explanation: question.explanation,
        order: questionIndex + 1,
        options: {
          create: question.options.map((option, optionIndex) => ({
            id: `${questionId}-option-${optionIndex + 1}`,
            text: option.text,
            isCorrect: option.correct,
            order: optionIndex + 1,
          })),
        },
      },
    })
  }
}

async function seedLibrary(prisma: PrismaClient, uploaderId: string) {
  for (const resource of LIBRARY_RESOURCES) {
    const data = {
      title: resource.title,
      description: resource.description,
      type: resource.type,
      category: resource.category,
      author: resource.author,
      publisher: resource.publisher,
      year: resource.year,
      language: resource.language,
      pages: resource.pages ?? null,
      fileUrl: resource.fileUrl,
      fileType: resource.fileType,
      tags: resource.tags.join(','),
      status: 'active',
    }
    await prisma.libraryResource.upsert({
      where: { slug: resource.slug },
      update: data,
      create: { id: `library-${resource.slug}`.slice(0, 120), slug: resource.slug, uploadedBy: uploaderId, ...data },
    })
  }
  await prisma.libraryResource.updateMany({
    where: { slug: { in: LEGACY_PLACEHOLDER_RESOURCE_SLUGS }, fileUrl: null, status: 'active' },
    data: { status: 'archived' },
  })
}

async function seedTemplateAndSettings(prisma: PrismaClient) {
  const template = {
    name: 'Malaka oshirish sertifikati',
    titleText: 'SERTIFIKAT',
    bodyText: 'kasbiy malaka oshirish kursini muvaffaqiyatli tamomlagani va yakuniy bilim nazoratidan o‘tganini tasdiqlaydi.',
    signerName: null,
    signerTitle: 'O‘quv markazi direktori',
    primaryColor: '#0f3d6e',
    accentColor: '#0ea5e9',
    isActive: true,
  }
  await prisma.certificateTemplate.upsert({
    where: { id: 'production-certificate-template' },
    update: template,
    create: { id: 'production-certificate-template', ...template },
  })

  const settings = [
    ['platform_name', 'GidroEdu LMS'],
    ['default_language', 'uz'],
    ['content_version', '2026-10-06.1'],
    ['training_material_notice', TRAINING_NOTICE],
  ] as const
  for (const [key, value] of settings) {
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
  }

  for (const [index, [eventKey, titleUz, titleRu, messageUz, type, link]] of ANNOUNCEMENTS.entries()) {
    const path = `/${link}`
    await prisma.announcement.upsert({
      where: { eventKey },
      update: { titleUz, titleRu, messageUz, type, link: path, isActive: true },
      create: { id: stableId('announcement', index), eventKey, titleUz, titleRu, messageUz, type, link: path, isActive: true },
    })
  }
}

/** Delivers the catalogue announcements to the given users once (idempotent per user). */
export async function deliverAnnouncements(prisma: PrismaClient, userIds: string[], at?: (index: number) => Date) {
  for (const userId of userIds) {
    for (const [index, [eventKey, titleUz, , messageUz, type, link]] of ANNOUNCEMENTS.entries()) {
      await prisma.notification.upsert({
        where: { userId_eventKey: { userId, eventKey } },
        update: {},
        create: { userId, eventKey, title: titleUz, message: messageUz, type, link: `/${link}`, ...(at ? { createdAt: at(index) } : {}) },
      })
    }
  }
}

export async function seedCatalog(prisma: PrismaClient, options: CatalogOptions) {
  await seedOrganization(prisma)
  const categories = await seedCategories(prisma)
  for (const [index, course] of COURSES.entries()) {
    const categoryId = categories.get(course.categorySlug)
    if (!categoryId) throw new Error(`Unknown category "${course.categorySlug}" for course ${course.slug}`)
    await seedCourse(prisma, course, index, categoryId, options)
  }
  await seedLibrary(prisma, options.authorId)
  await seedTemplateAndSettings(prisma)
}
