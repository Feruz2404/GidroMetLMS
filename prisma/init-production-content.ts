import { Prisma, PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'
import { passwordSchema } from '../src/validators/auth'
import {
  ANNOUNCEMENTS,
  CATEGORIES,
  COURSES,
  DEPARTMENTS,
  LIBRARY_RESOURCES,
  REGIONAL_DIVISIONS,
  ROLE_DEFINITIONS,
  type CourseSeed,
  type LessonSeed,
} from './production-content-data'
import { getProductionContentCounts, getProductionContentDuplicateReport } from './production-content-report'

const prisma = new PrismaClient()
const TRAINING_NOTICE = 'Ushbu material umumiy kasbiy tayyorgarlik uchun tuzilgan. Amaliy ishda tashkilotning tasdiqlangan yo‘riqnomalari va vakolatli rahbar ko‘rsatmalari ustuvor hisoblanadi.'

function stableId(prefix: string, index: number) {
  return `production-${prefix}-${String(index + 1).padStart(2, '0')}`
}

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
    throw new Error('A PostgreSQL DATABASE_URL is required. SQLite is not supported.')
  }
}

function lessonContent(course: CourseSeed, sectionTitle: string, lesson: LessonSeed) {
  return `# ${lesson.title}

> ${TRAINING_NOTICE}

## O‘quv maqsadi

Ushbu dars **${course.title}** kursining “${sectionTitle}” bo‘limiga kiradi. Dars yakunida tinglovchi ${lesson.focus} bo‘yicha izchil amaliy yondashuvni tushuntira oladi.

## Asosiy tamoyillar

1. Vazifa, vaqt, hudud va foydalanilayotgan ma’lumot manbasini ish boshida aniqlang.
2. O‘lchov birligi, kuzatuv sharoiti va ma’lumot versiyasini natija bilan birga saqlang.
3. Shubhali qiymatni izsiz o‘zgartirmang; uni belgilab, qo‘shimcha manba yoki takroriy tekshiruv bilan baholang.
4. Kuzatilgan fakt, hisoblangan natija va ekspert xulosasini bir-biridan ajrating.
5. Noaniqlik va usul cheklovlarini yakuniy xulosada aniq ko‘rsating.

## Amaliy ish tartibi

- ${lesson.focus.charAt(0).toUpperCase()}${lesson.focus.slice(1)} uchun zarur kirish ma’lumotlarini ro‘yxatlang.
- Ma’lumotlarning to‘liqligi, vaqt mosligi va mantiqiy izchilligini tekshiring.
- Natijani ikkinchi mustaqil manba yoki oldingi davr ma’lumoti bilan solishtiring.
- Qabul qilingan qaror, sabab va mas’ul ijrochini kuzatuv jurnalida qayd eting.

## O‘zini tekshirish

Natijani boshqa mutaxassis qayta ko‘ra oladimi? Manba, vaqt, birlik, tekshiruv va xulosa o‘rtasidagi bog‘lanish hujjatlashtirilgan bo‘lsa, ish jarayoni kuzatuvchan hisoblanadi.`
}

function courseDescription(course: CourseSeed) {
  return `${course.summary}\n\nKurs kuzatuv, sifat nazorati, tahlil va xulosani hujjatlashtirishga yo‘naltirilgan. ${TRAINING_NOTICE}`
}

function questionForLesson(course: CourseSeed, lesson: LessonSeed, index: number) {
  return {
    text: `${course.title} doirasida “${lesson.title}” bosqichining asosiy vazifasi qaysi?`,
    correct: lesson.focus.charAt(0).toUpperCase() + lesson.focus.slice(1),
    incorrect: [
      'Manba va vaqtni tekshirmasdan yakuniy xulosa chiqarish',
      'Shubhali qiymatlarni izohsiz o‘chirib tashlash',
      'Faqat natija ko‘rinishini bezash bilan cheklanish',
    ],
    explanation: `To‘g‘ri yondashuv ${lesson.focus} va natijani qayta tekshirish mumkin bo‘lgan tarzda hujjatlashtirishdir.`,
    order: index + 1,
  }
}

function finalQuestion(course: CourseSeed) {
  return {
    text: `${course.title} bo‘yicha xulosa tayyorlashda qaysi tamoyil ustuvor?`,
    correct: 'Manba, vaqt, birlik, tekshiruv va noaniqlikni birga hujjatlashtirish',
    incorrect: [
      'Noaniqlikni ko‘rsatmaslik',
      'Tasdiqlanmagan mezonni rasmiy talab sifatida keltirish',
      'Asl ma’lumotni tuzatishdan keyin yo‘qotish',
    ],
    explanation: 'Kuzatuvchanlik va xolis noaniqlik ifodasi kasbiy gidrometeorologik mahsulotning asosiy sifat shartidir.',
    order: 10,
  }
}

async function ensureOptionalUser(definition: {
  id: string
  email: string
  username: string
  role: string
  firstName: string
  lastName: string
  department: string
  position: string
  passwordVariable: string
}) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: definition.email }, { username: definition.username }] },
  })
  if (existing) return existing

  const password = process.env[definition.passwordVariable]
  if (!password) {
    console.warn(`Optional ${definition.role} account skipped because ${definition.passwordVariable} is not configured.`)
    return null
  }
  const parsed = passwordSchema.safeParse(password)
  if (!parsed.success) {
    throw new Error(`${definition.passwordVariable} does not meet the strong password policy.`)
  }

  return prisma.user.create({
    data: {
      id: definition.id,
      email: definition.email,
      username: definition.username,
      passwordHash: hashPassword(parsed.data),
      role: definition.role,
      firstName: definition.firstName,
      lastName: definition.lastName,
      department: definition.department,
      position: definition.position,
      isActive: true,
      mustChangePassword: true,
      emailVerifiedAt: new Date(),
    },
  })
}

async function initializeOrganization() {
  await Promise.all(DEPARTMENTS.map(async ([code, nameUz, nameRu], index) => {
    await prisma.department.upsert({
      where: { code },
      update: { nameUz, nameRu, description: `${nameUz} uchun umumiy o‘quv tashkiliy yozuvi.`, isActive: true },
      create: { id: stableId('department', index), code, nameUz, nameRu, description: `${nameUz} uchun umumiy o‘quv tashkiliy yozuvi.`, isActive: true },
    })
  }))

  await Promise.all(REGIONAL_DIVISIONS.map(async ([code, nameUz, nameRu], index) => {
    await prisma.regionalDivision.upsert({
      where: { code },
      update: { nameUz, nameRu, description: `${nameUz} hududi uchun neytral o‘quv tashkiliy yozuvi.`, isActive: true },
      create: { id: stableId('region', index), code, nameUz, nameRu, description: `${nameUz} hududi uchun neytral o‘quv tashkiliy yozuvi.`, isActive: true },
    })
  }))

  for (const [roleIndex, role] of ROLE_DEFINITIONS.entries()) {
    const roleDefinition = await prisma.roleDefinition.upsert({
      where: { key: role.key },
      update: { nameUz: role.nameUz, description: 'Ilova ruxsat matritsasi bilan mos keluvchi rol.', isActive: true },
      create: { id: stableId('role', roleIndex), key: role.key, nameUz: role.nameUz, description: 'Ilova ruxsat matritsasi bilan mos keluvchi rol.', isActive: true },
    })
    await Promise.all(role.permissions.map(async (permission, permissionIndex) => {
      await prisma.rolePermission.upsert({
        where: { roleId_permission: { roleId: roleDefinition.id, permission } },
        update: {},
        create: { id: `${roleDefinition.id}-permission-${String(permissionIndex + 1).padStart(2, '0')}`, roleId: roleDefinition.id, permission },
      })
    }))
  }
}

async function initializeCategories() {
  const categories = new Map<string, string>()
  for (const [index, [slug, name, nameRu, icon]] of CATEGORIES.entries()) {
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name, nameRu, description: `${name} yo‘nalishidagi umumiy kasbiy tayyorgarlik kurslari.`, descriptionRu: `Общие учебные материалы по направлению «${nameRu}».`, icon, order: (index + 1) * 10, isActive: true },
      create: { id: stableId('category', index), slug, name, nameRu, description: `${name} yo‘nalishidagi umumiy kasbiy tayyorgarlik kurslari.`, descriptionRu: `Общие учебные материалы по направлению «${nameRu}».`, icon, order: (index + 1) * 10, isActive: true },
    })
    categories.set(slug, category.id)
  }
  return categories
}

async function ensureCourse(courseSeed: CourseSeed, courseIndex: number, categoryId: string, creatorId: string, tutorId: string) {
  const expectedId = stableId('course', courseIndex)
  const existing = await prisma.course.findUnique({ where: { slug: courseSeed.slug } })
  const data = {
    title: courseSeed.title,
    titleRu: courseSeed.titleRu,
    description: courseDescription(courseSeed),
    shortSummary: courseSeed.summary,
    targetAudience: courseSeed.targetAudience,
    learningOutcomes: courseSeed.outcomes.map((outcome) => `• ${outcome}`).join('\n'),
    prerequisites: courseSeed.prerequisites.map((item) => `• ${item}`).join('\n'),
    language: 'uz',
    certificateEnabled: true,
    generalTrainingNotice: TRAINING_NOTICE,
    categoryId,
    tutorId,
    thumbnailUrl: '/logo.svg',
    durationHours: courseSeed.durationHours,
    level: courseSeed.level,
    status: 'published',
    isMandatory: courseSeed.mandatory,
    passPercentage: 70,
    maxAttempts: 3,
    validDays: 365,
  } satisfies Prisma.CourseUncheckedUpdateInput

  if (!existing) {
    return prisma.course.create({
      data: { id: expectedId, slug: courseSeed.slug, createdBy: creatorId, publishedAt: new Date(), ...data },
    })
  }
  if (existing.id === expectedId) {
    return prisma.course.update({ where: { id: existing.id }, data })
  }
  console.warn(`Existing course preserved for slug ${courseSeed.slug}; only missing nested content will be added.`)
  return existing
}

async function initializeCourseContent(courseSeed: CourseSeed, courseIndex: number, courseId: string, creatorId: string) {
  const lessonSeeds: LessonSeed[] = courseSeed.sections.flatMap((section) => section.lessons)
  await Promise.all(courseSeed.sections.map(async (section, sectionIndex) => {
    const sectionId = `${stableId('course', courseIndex)}-section-${sectionIndex + 1}`
    const sectionCollision = await prisma.section.findUnique({ where: { id: sectionId } })
    if (sectionCollision && sectionCollision.courseId !== courseId) throw new Error(`Stable section identifier collision: ${sectionId}`)
    await prisma.section.upsert({
      where: { id: sectionId },
      update: { title: section.title, description: `${section.title} bo‘yicha umumiy kasbiy tayyorgarlik bo‘limi.`, order: sectionIndex + 1 },
      create: { id: sectionId, courseId, title: section.title, description: `${section.title} bo‘yicha umumiy kasbiy tayyorgarlik bo‘limi.`, order: sectionIndex + 1 },
    })

    await Promise.all(section.lessons.map(async (lesson, lessonIndex) => {
      const lessonOrder = courseSeed.sections
        .slice(0, sectionIndex)
        .reduce((total, previousSection) => total + previousSection.lessons.length, 0) + lessonIndex + 1
      const lessonId = `${sectionId}-lesson-${lessonIndex + 1}`
      const lessonCollision = await prisma.lesson.findUnique({ where: { id: lessonId } })
      if (lessonCollision && lessonCollision.courseId !== courseId) throw new Error(`Stable lesson identifier collision: ${lessonId}`)
      await prisma.lesson.upsert({
        where: { id: lessonId },
        update: { title: lesson.title, description: lesson.focus, content: lessonContent(courseSeed, section.title, lesson), type: 'text', durationMin: 45, order: lessonOrder },
        create: { id: lessonId, courseId, sectionId, title: lesson.title, description: lesson.focus, content: lessonContent(courseSeed, section.title, lesson), type: 'text', durationMin: 45, order: lessonOrder, isFree: courseIndex === 0 && lessonOrder === 1 },
      })
    }))
  }))

  const quizId = `${stableId('course', courseIndex)}-final-quiz`
  const quizCollision = await prisma.quiz.findUnique({ where: { id: quizId } })
  if (quizCollision?.courseId && quizCollision.courseId !== courseId) throw new Error(`Stable quiz identifier collision: ${quizId}`)
  await prisma.quiz.upsert({
    where: { id: quizId },
    update: { title: `${courseSeed.title} — yakuniy test`, description: 'Kurs mavzulari bo‘yicha 10 savolli yakuniy bilim nazorati.', courseId, timeLimitMin: 25, passingScore: 70, maxAttempts: 3, shuffleQuestions: true, showAnswers: true, status: 'published' },
    create: { id: quizId, title: `${courseSeed.title} — yakuniy test`, description: 'Kurs mavzulari bo‘yicha 10 savolli yakuniy bilim nazorati.', courseId, createdBy: creatorId, timeLimitMin: 25, passingScore: 70, maxAttempts: 3, shuffleQuestions: true, showAnswers: true, status: 'published' },
  })

  const questions = [...lessonSeeds.slice(0, 9).map((lesson, index) => questionForLesson(courseSeed, lesson, index)), finalQuestion(courseSeed)]
  await Promise.all(questions.map(async (question, questionIndex) => {
    const questionId = `${quizId}-question-${questionIndex + 1}`
    await prisma.question.upsert({
      where: { id: questionId },
      update: { text: question.text, type: 'single_choice', points: 1, explanation: question.explanation, order: question.order },
      create: { id: questionId, quizId, text: question.text, type: 'single_choice', points: 1, explanation: question.explanation, order: question.order },
    })
    await Promise.all([question.correct, ...question.incorrect].map(async (text, optionIndex) => {
      const optionId = `${questionId}-option-${optionIndex + 1}`
      await prisma.answerOption.upsert({
        where: { id: optionId },
        update: { text, isCorrect: optionIndex === 0, order: optionIndex + 1 },
        create: { id: optionId, questionId, text, isCorrect: optionIndex === 0, order: optionIndex + 1 },
      })
    }))
  }))
}

async function initializeCourses(categories: Map<string, string>, creatorId: string, tutorId: string) {
  const courseIds = new Map<string, string>()
  for (const [courseIndex, courseSeed] of COURSES.entries()) {
    const categoryId = categories.get(courseSeed.categorySlug)
    if (!categoryId) throw new Error(`Category not found for course ${courseSeed.slug}.`)
    const created = await ensureCourse(courseSeed, courseIndex, categoryId, creatorId, tutorId)
    courseIds.set(courseSeed.slug, created.id)
    await initializeCourseContent(courseSeed, courseIndex, created.id, creatorId)
  }
  return courseIds
}

async function initializeLibrary(uploaderId: string) {
  await Promise.all(LIBRARY_RESOURCES.map(async ([slug, title, type, category, description], index) => {
    const expectedId = stableId('resource', index)
    const existing = await prisma.libraryResource.findUnique({ where: { slug } })
    const data = {
      title,
      description: `${description} ${TRAINING_NOTICE}`,
      type,
      category,
      author: 'Umumiy o‘quv materiallari tahririyati',
      publisher: 'GidroEdu LMS',
      year: 2026,
      language: 'uz',
      pages: type === 'video' ? null : 24 + index,
      fileUrl: null,
      fileSize: 0,
      fileType: null,
      coverUrl: '/logo.svg',
      tags: `${category.toLowerCase()},gidrometeorologiya,umumiy-oquv-materiali`,
      status: 'active',
    }
    if (!existing) {
      await prisma.libraryResource.create({ data: { id: expectedId, slug, uploadedBy: uploaderId, ...data } })
    } else if (existing.id === expectedId) {
      await prisma.libraryResource.update({ where: { id: existing.id }, data })
    } else {
      console.warn(`Existing library resource preserved for slug ${slug}.`)
    }
  }))
}

async function initializeAnnouncementsAndNotifications() {
  await Promise.all(ANNOUNCEMENTS.map(async ([eventKey, titleUz, titleRu, messageUz, type, link], index) => {
    await prisma.announcement.upsert({
      where: { eventKey },
      update: { titleUz, titleRu, messageUz, type, link, isActive: true },
      create: { id: stableId('announcement', index), eventKey, titleUz, titleRu, messageUz, type, link, isActive: true },
    })
  }))

  const recipients = await prisma.user.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
    take: 100,
    select: { id: true },
  })
  await Promise.all(recipients.flatMap((recipient) =>
    ANNOUNCEMENTS.map(async ([eventKey, titleUz, , messageUz, type, link], index) => {
      await prisma.notification.upsert({
        where: { userId_eventKey: { userId: recipient.id, eventKey } },
        update: { title: titleUz, message: messageUz, type, link },
        create: { id: `${stableId('notification', index)}-${recipient.id}`, userId: recipient.id, eventKey, title: titleUz, message: messageUz, type, link },
      })
    })
  ))
}

async function initializeCertificateTemplate() {
  await prisma.certificateTemplate.upsert({
    where: { id: 'production-certificate-template' },
    update: { name: 'Kasbiy tayyorgarlik sertifikati', titleText: 'SERTIFIKAT', bodyText: 'Umumiy kasbiy tayyorgarlik kursini muvaffaqiyatli yakunlaganini tasdiqlaydi.', primaryColor: '#0f3d5e', accentColor: '#0891b2', isActive: true },
    create: { id: 'production-certificate-template', name: 'Kasbiy tayyorgarlik sertifikati', titleText: 'SERTIFIKAT', bodyText: 'Umumiy kasbiy tayyorgarlik kursini muvaffaqiyatli yakunlaganini tasdiqlaydi.', signerName: 'Vakolatli mas’ul shaxs', signerTitle: 'Vakolatli lavozim', primaryColor: '#0f3d5e', accentColor: '#0891b2', isActive: true },
  })
}

async function initializeSettings() {
  const settings = [
    { key: 'platform_name', value: 'GidroEdu LMS' },
    { key: 'default_language', value: 'uz' },
    { key: 'public_registration_enabled', value: 'false' },
    { key: 'production_content_version', value: '2026-07-14.1' },
    { key: 'training_material_notice', value: TRAINING_NOTICE },
  ]
  await Promise.all(settings.map(async (setting) => {
    const existing = await prisma.setting.findUnique({ where: { key: setting.key } })
    if (!existing) await prisma.setting.create({ data: setting })
    else if (setting.key === 'production_content_version' || setting.key === 'training_material_notice') {
      await prisma.setting.update({ where: { key: setting.key }, data: { value: setting.value } })
    }
  }))
}

async function initializeEnrollments(courseIds: Map<string, string>) {
  const learners = await prisma.user.findMany({ where: { isActive: true, role: { in: ['learner', 'student'] } }, select: { id: true, department: true } })
  const introId = courseIds.get('gidrometeorologiyaga-kirish')
  const safetyId = courseIds.get('mehnat-muhofazasi-va-texnika-xavfsizligi')
  if (!introId || !safetyId) throw new Error('Mandatory course identifiers are missing.')

  await Promise.all(learners.map(async (learner) => {
    const department = learner.department?.toLowerCase() ?? ''
    const relevantSlug = department.includes('gidrolog')
      ? 'daryo-gidrologiyasi-asoslari'
      : department.includes('iqlim')
        ? 'iqlim-malumotlarini-statistik-tahlil-qilish'
        : 'meteorologik-kuzatuvlarni-tashkil-etish'
    const relevantId = courseIds.get(relevantSlug)
    await Promise.all([introId, safetyId, relevantId].filter((id): id is string => Boolean(id)).map(async (courseId) => {
      await prisma.enrollment.upsert({
        where: { courseId_userId: { courseId, userId: learner.id } },
        update: {},
        create: { courseId, userId: learner.id, status: 'active', progress: 0 },
      })
    }))
  }))
}

async function main() {
  assertInitializationAllowed()
  const before = await getProductionContentCounts(prisma)
  console.warn(JSON.stringify({ phase: 'before', counts: before }))

  await initializeOrganization()
  const optionalInstructor = await ensureOptionalUser({ id: 'production-initial-instructor', email: 'lms.instructor@example.com', username: 'lms.initial.instructor', role: 'instructor', firstName: 'Dilafruz', lastName: 'Karimova', department: 'Malaka oshirish va ta’lim bo‘limi', position: 'Fictional o‘qituvchi', passwordVariable: 'INIT_INSTRUCTOR_PASSWORD' })
  await ensureOptionalUser({ id: 'production-initial-manager', email: 'lms.manager@example.com', username: 'lms.initial.manager', role: 'department_manager', firstName: 'Akmal', lastName: 'Saidov', department: 'Meteorologiya boshqarmasi', position: 'Fictional bo‘lim rahbari', passwordVariable: 'INIT_MANAGER_PASSWORD' })
  await ensureOptionalUser({ id: 'production-initial-learner', email: 'lms.learner@example.com', username: 'lms.initial.learner', role: 'learner', firstName: 'Malika', lastName: 'Tursunova', department: 'Meteorologiya boshqarmasi', position: 'Fictional tinglovchi', passwordVariable: 'INIT_LEARNER_PASSWORD' })

  const administrators = await prisma.user.findMany({ where: { isActive: true, role: { in: ['super_admin', 'administrator', 'admin'] } }, orderBy: { createdAt: 'asc' } })
  const creator = administrators[0] ?? optionalInstructor ?? await prisma.user.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'asc' } })
  if (!creator) throw new Error('No active Production user is available to own initialized content.')
  const tutor = optionalInstructor ?? await prisma.user.findFirst({ where: { isActive: true, role: { in: ['instructor', 'tutor'] } }, orderBy: { createdAt: 'asc' } }) ?? creator

  const categories = await initializeCategories()
  const courseIds = await initializeCourses(categories, creator.id, tutor.id)
  await initializeLibrary(tutor.id)
  await initializeAnnouncementsAndNotifications()
  await initializeCertificateTemplate()
  await initializeSettings()
  await initializeEnrollments(courseIds)

  const [after, duplicates] = await Promise.all([
    getProductionContentCounts(prisma),
    getProductionContentDuplicateReport(prisma),
  ])
  const duplicateValues = Object.values(duplicates).flat()
  if (duplicateValues.length) throw new Error('Duplicate stable identifiers were detected after initialization.')
  console.warn(JSON.stringify({ phase: 'after', counts: after, duplicates }))
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : 'Production content initialization failed.')
    process.exitCode = 1
  })
  .finally(async () => prisma.$disconnect())
