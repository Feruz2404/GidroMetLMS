import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'
import { passwordSchema } from '../src/validators/auth'

const prisma = new PrismaClient()

const USERS = [
  { id: 'demo-user-super-admin', email: 'super.admin@demo.gidroedu.uz', username: 'demo.superadmin', role: 'super_admin', firstName: 'Kamola', lastName: 'Nurmatova', department: 'Raqamli rivojlanish', position: 'Bosh administrator' },
  { id: 'demo-user-administrator', email: 'administrator@demo.gidroedu.uz', username: 'demo.administrator', role: 'administrator', firstName: 'Javlon', lastName: 'Qodirov', department: 'O‘quv jarayonini boshqarish', position: 'Administrator' },
  { id: 'demo-user-instructor', email: 'instructor@demo.gidroedu.uz', username: 'demo.instructor', role: 'instructor', firstName: 'Madina', lastName: 'Ismoilova', department: 'Meteorologik tayyorgarlik', position: 'O‘qituvchi' },
  { id: 'demo-user-manager', email: 'manager@demo.gidroedu.uz', username: 'demo.manager', role: 'department_manager', firstName: 'Sardor', lastName: 'Rasulov', department: 'Meteorologik kuzatuvlar', position: 'Bo‘lim rahbari' },
  { id: 'demo-user-learner', email: 'learner@demo.gidroedu.uz', username: 'demo.learner', role: 'learner', firstName: 'Dilnoza', lastName: 'Ergasheva', department: 'Meteorologik kuzatuvlar', position: 'Kuzatuvchi mutaxassis' },
] as const

const COURSES = [
  {
    slug: 'meteorologik-kuzatuvlar-amaliyoti',
    title: 'Meteorologik kuzatuvlar amaliyoti',
    description: 'Kuzatuv maydonini tayyorlash, asbob ko‘rsatkichlarini qayd etish va ma’lumot sifatini nazorat qilish bo‘yicha demo o‘quv kursi.',
    category: ['meteorologik-kuzatuvlar', 'Meteorologik kuzatuvlar', 'Thermometer'],
    level: 'beginner', durationHours: 18, mandatory: true,
    sections: [
      ['Kuzatuv jarayoniga tayyorgarlik', 'Kuzatuv joyi va vaqtini tekshirish', 'Asbob holatini ko‘zdan kechirish', 'Kuzatuv rejasini tasdiqlash'],
      ['O‘lchash va qayd etish', 'Ko‘rsatkichni to‘g‘ri o‘qish', 'Vaqt va birliklarni qayd etish', 'Dala jurnalini izchil yuritish'],
      ['Sifat nazorati', 'Mantiqiy diapazonni tekshirish', 'Shubhali qiymatni belgilash', 'Tekshiruv natijasini hujjatlashtirish'],
    ],
  },
  {
    slug: 'gidrologik-post-ma-lumotlari',
    title: 'Gidrologik post ma’lumotlari bilan ishlash',
    description: 'Suv sathi kuzatuvlari, dala jurnali va ketma-ket o‘lchovlarni sifatli yuritish bo‘yicha demo kurs.',
    category: ['gidrologik-monitoring', 'Gidrologik monitoring', 'Droplets'],
    level: 'beginner', durationHours: 20, mandatory: true,
    sections: [
      ['Post va kuzatuv sharoiti', 'Post tavsifini yangilash', 'Xavfsiz yondashuvni rejalash', 'Kuzatuv nuqtasini tekshirish'],
      ['Suv sathini kuzatish', 'Sanoq boshini tekshirish', 'Natijani jurnalga kiritish', 'Takroriy o‘qishni solishtirish'],
      ['Ma’lumotlar uzluksizligi', 'Vaqt qatoridagi uzilishlar', 'Izoh va hodisalarni qayd etish', 'Navbatchilik ma’lumotini topshirish'],
    ],
  },
  {
    slug: 'iqlim-ma-lumotlari-sifati',
    title: 'Iqlim ma’lumotlari sifatini boshqarish',
    description: 'Vaqt qatorlarini tekshirish, metama’lumotlarni yuritish va tuzatishlarni izchil hujjatlashtirish bo‘yicha demo kurs.',
    category: ['iqlim-ma-lumotlari', 'Iqlim ma’lumotlari', 'CloudSun'],
    level: 'intermediate', durationHours: 24, mandatory: false,
    sections: [
      ['Ma’lumot hayotiy sikli', 'Manba va kelib chiqishni qayd etish', 'Metama’lumotlarning vazifasi', 'Versiya nazoratini yuritish'],
      ['Avtomatik tekshiruvlar', 'Diapazon va ketma-ketlik nazorati', 'Qo‘shni kuzatuvlarni taqqoslash', 'Tekshiruv bayroqlarini talqin qilish'],
      ['Tuzatish va audit', 'Asl qiymatni saqlash', 'Tuzatish sababini hujjatlashtirish', 'Audit izini ko‘rib chiqish'],
    ],
  },
  {
    slug: 'masofadan-zondlash-asoslari',
    title: 'Masofadan zondlash ma’lumotlari asoslari',
    description: 'Sun’iy yo‘ldosh tasvirlari, fazoviy qamrov va yer usti kuzatuvlari bilan taqqoslash tamoyillari bo‘yicha demo kurs.',
    category: ['masofadan-zondlash', 'Masofadan zondlash', 'Satellite'],
    level: 'intermediate', durationHours: 22, mandatory: false,
    sections: [
      ['Tasvirni tushunish', 'Piksel va fazoviy aniqlik', 'Vaqt bo‘yicha qamrov', 'Tasvir manbasini qayd etish'],
      ['Bulut va sirt belgilarini talqin qilish', 'Ko‘rinadigan belgilar', 'Noto‘g‘ri talqin xavfi', 'Bir nechta tasvirni solishtirish'],
      ['Yer usti ma’lumoti bilan tekshirish', 'Mos vaqtni tanlash', 'Farqlarni hujjatlashtirish', 'Tekshiruv xulosasini yozish'],
    ],
  },
  {
    slug: 'prognoz-axborotini-yetkazish',
    title: 'Prognoz axborotini aniq yetkazish',
    description: 'Noaniqlikni tushunarli ifodalash, auditoriyaga mos xabar tuzish va yangilanishlarni boshqarish bo‘yicha demo kurs.',
    category: ['prognoz-kommunikatsiyasi', 'Prognoz kommunikatsiyasi', 'MessageSquareText'],
    level: 'advanced', durationHours: 16, mandatory: false,
    sections: [
      ['Auditoriyani aniqlash', 'Qaror ehtiyojini tushunish', 'Texnik atamalarni moslashtirish', 'Xabar kanalini tanlash'],
      ['Xabar tuzilishi', 'Asosiy mazmunni birinchi berish', 'Noaniqlikni yashirmaslik', 'Amaliy harakatni aniq ifodalash'],
      ['Yangilash va qayta aloqa', 'Versiya va vaqtni ko‘rsatish', 'Savollarni qayd etish', 'Yangilangan xabarni tarqatish'],
    ],
  },
  {
    slug: 'dala-kuzatuvlarida-xavfsizlik',
    title: 'Dala kuzatuvlarida mehnat xavfsizligi',
    description: 'Dala chiqishini rejalash, xavflarni baholash va hodisalar haqida xabar berish bo‘yicha umumiy demo o‘quv kursi.',
    category: ['dala-xavfsizligi', 'Dala xavfsizligi', 'ShieldCheck'],
    level: 'beginner', durationHours: 12, mandatory: true,
    sections: [
      ['Chiqishni rejalash', 'Yo‘nalish va aloqa rejasini tuzish', 'Ob-havo sharoitini baholash', 'Zaxira rejasini kelishish'],
      ['Joydagi xavfsiz ish', 'Shaxsiy himoya vositalari', 'Yakka ishlash xavfini kamaytirish', 'Vaziyat o‘zgarsa ishni to‘xtatish'],
      ['Hodisa va deyarli hodisa', 'Birinchi harakatlar', 'Xolis hisobot yozish', 'Takrorlanishni oldini olish'],
    ],
  },
] as const

function lessonContent(courseTitle: string, sectionTitle: string, lessonTitle: string) {
  return `# ${lessonTitle}\n\nUshbu demo dars **${courseTitle}** kursining “${sectionTitle}” bo‘limiga kiradi.\n\n## Amaliy maqsad\n\nMutaxassis ish boshlashdan oldin vazifani, ma’lumot manbasini, vaqtni va qo‘llaniladigan birliklarni aniqlaydi. Har bir natija keyinchalik tekshirilishi uchun kuzatuv sharoiti va noodatiy holatlar qisqa izoh bilan qayd etiladi.\n\n## Ish tartibi\n\n1. Vazifa va xavfsizlik shartlarini tekshiring.\n2. Asbob yoki ma’lumot manbasining holatini baholang.\n3. Natijani kelishilgan formatda qayd eting.\n4. Mantiqiy va ketma-ketlik tekshiruvini bajaring.\n5. Shubhali qiymatni o‘chirmang; uni belgilab, sababini hujjatlashtiring.\n\n> Bu mahalliy ishlab chiqish uchun demo ta’lim mazmunidir. Tashkilotning tasdiqlangan yo‘riqnomalari mavjud bo‘lsa, amaliy ishda o‘sha hujjatlar ustuvor hisoblanadi.`
}

function questionSet(courseTitle: string) {
  return [
    ['Ish boshlashdan oldin qaysi ma’lumotlar aniqlashtirilishi kerak?', 'Vazifa, vaqt, manba va o‘lchov birligi', 'Faqat fayl nomi', 'Faqat xodimning ismi'],
    ['Shubhali qiymat aniqlansa, eng to‘g‘ri harakat qaysi?', 'Qiymatni belgilash va tekshiruv sababini hujjatlashtirish', 'Qiymatni izsiz o‘chirish', 'Uni avtomatik ravishda nolga almashtirish'],
    ['Metama’lumot nima uchun kerak?', 'Natijaning sharoiti va kelib chiqishini tushuntirish uchun', 'Faqat dizaynni bezash uchun', 'Parolni saqlash uchun'],
    ['Ketma-ketlik tekshiruvi nimani topishga yordam beradi?', 'Vaqt qatoridagi uzilish va noodatiy o‘zgarishlarni', 'Foydalanuvchi rasmini', 'Sertifikat rangini'],
    ['Birliklarni qayd etmaslik qanday xavf tug‘diradi?', 'Natijani noto‘g‘ri talqin qilish xavfini', 'Tarmoq tezligini pasaytiradi', 'Faylni avtomatik o‘chiradi'],
    ['Tuzatilgan ma’lumot bilan qanday ishlash kerak?', 'Asl qiymat va tuzatish sababini saqlash kerak', 'Asl qiymatni butunlay yo‘qotish kerak', 'Sababni yozmaslik kerak'],
    ['Kuzatuv vaqti nega aniq qayd etiladi?', 'Ma’lumotlarni to‘g‘ri taqqoslash va tartiblash uchun', 'Faqat hisobotni uzun qilish uchun', 'Rang tanlash uchun'],
    ['${courseTitle} bo‘yicha sifat nazoratining maqsadi nima?', 'Ishonchli, izchil va tekshiriladigan natija olish', 'Barcha qiymatlarni bir xil qilish', 'Faqat ko‘proq fayl yaratish'],
    ['Noodatiy hodisa yuz bersa nima qayd etiladi?', 'Hodisa va uning natijaga mumkin bo‘lgan ta’siri', 'Faqat xodimning kayfiyati', 'Hech narsa qayd etilmaydi'],
    ['Amaliy vazifada mahalliy tasdiqlangan yo‘riqnoma mavjud bo‘lsa nima qilinadi?', 'Tasdiqlangan yo‘riqnoma talablariga amal qilinadi', 'Demo matn har doim ustun qo‘yiladi', 'Yo‘riqnoma e’tiborsiz qoldiriladi'],
  ].map((question) => [question[0].replace('${courseTitle}', courseTitle), ...question.slice(1)])
}

async function main() {
  const previewAllowed = process.env.VERCEL_ENV === 'preview' && process.env.RUN_PREVIEW_SEED === 'true'
  const localAllowed = !process.env.VERCEL_ENV && process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEMO_SEED === 'true'
  if (!previewAllowed && !localAllowed) {
    throw new Error('Demo seed blocked. Use ALLOW_DEMO_SEED=true locally or RUN_PREVIEW_SEED=true in Vercel Preview.')
  }

  const demoPassword = passwordSchema.safeParse(process.env.DEMO_SEED_PASSWORD)
  if (!demoPassword.success) {
    throw new Error('DEMO_SEED_PASSWORD must be configured with a strong, environment-specific password.')
  }

  const passwordHash = hashPassword(demoPassword.data)
  for (const user of USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { username: user.username, passwordHash, role: user.role, firstName: user.firstName, lastName: user.lastName, department: user.department, position: user.position, isActive: true },
      create: { ...user, passwordHash, emailVerifiedAt: new Date() },
    })
  }

  const administrator = await prisma.user.findUniqueOrThrow({ where: { email: 'administrator@demo.gidroedu.uz' } })
  const instructor = await prisma.user.findUniqueOrThrow({ where: { email: 'instructor@demo.gidroedu.uz' } })
  const learner = await prisma.user.findUniqueOrThrow({ where: { email: 'learner@demo.gidroedu.uz' } })

  for (const [courseIndex, definition] of COURSES.entries()) {
    const [categorySlug, categoryName, icon] = definition.category
    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: { name: categoryName, icon, order: courseIndex + 1 },
      create: { id: `demo-category-${courseIndex + 1}`, slug: categorySlug, name: categoryName, icon, order: courseIndex + 1 },
    })
    const course = await prisma.course.upsert({
      where: { slug: definition.slug },
      update: { title: definition.title, description: definition.description, categoryId: category.id, tutorId: instructor.id, durationHours: definition.durationHours, level: definition.level, isMandatory: definition.mandatory, status: 'published' },
      create: { id: `demo-course-${courseIndex + 1}`, slug: definition.slug, title: definition.title, description: definition.description, categoryId: category.id, tutorId: instructor.id, createdBy: administrator.id, durationHours: definition.durationHours, level: definition.level, isMandatory: definition.mandatory, status: 'published', publishedAt: new Date(), passPercentage: 70, maxAttempts: 3 },
    })

    let lessonOrder = 0
    for (const [sectionIndex, [sectionTitle, ...lessonTitles]] of definition.sections.entries()) {
      const sectionId = `demo-section-${courseIndex + 1}-${sectionIndex + 1}`
      await prisma.section.upsert({
        where: { id: sectionId },
        update: { title: sectionTitle, order: sectionIndex + 1 },
        create: { id: sectionId, courseId: course.id, title: sectionTitle, description: `${sectionTitle} bo‘yicha amaliy demo bo‘lim.`, order: sectionIndex + 1 },
      })
      for (const [lessonIndex, lessonTitle] of lessonTitles.entries()) {
        lessonOrder += 1
        const lessonId = `demo-lesson-${courseIndex + 1}-${sectionIndex + 1}-${lessonIndex + 1}`
        await prisma.lesson.upsert({
          where: { id: lessonId },
          update: { title: lessonTitle, content: lessonContent(definition.title, sectionTitle, lessonTitle), order: lessonOrder },
          create: { id: lessonId, courseId: course.id, sectionId, title: lessonTitle, description: `${lessonTitle} bo‘yicha amaliy ko‘rsatmalar.`, content: lessonContent(definition.title, sectionTitle, lessonTitle), type: 'text', durationMin: 35, order: lessonOrder, isFree: courseIndex === 0 && lessonOrder === 1 },
        })
      }
    }

    const quizId = `demo-quiz-${courseIndex + 1}`
    await prisma.quiz.upsert({
      where: { id: quizId },
      update: { title: `${definition.title} — yakuniy test`, courseId: course.id, status: 'published', passingScore: 70, maxAttempts: 3 },
      create: { id: quizId, title: `${definition.title} — yakuniy test`, description: 'Demo kurs yakuniy bilim nazorati.', courseId: course.id, createdBy: instructor.id, timeLimitMin: 20, passingScore: 70, maxAttempts: 3, shuffleQuestions: true, showAnswers: true, status: 'published' },
    })

    for (const [questionIndex, [text, correct, ...incorrect]] of questionSet(definition.title).entries()) {
      const questionId = `demo-question-${courseIndex + 1}-${questionIndex + 1}`
      await prisma.question.upsert({
        where: { id: questionId },
        update: { text, order: questionIndex + 1 },
        create: { id: questionId, quizId, type: 'single_choice', text, points: 1, explanation: 'To‘g‘ri javob ish jarayonining tekshirilishi va izchil hujjatlashtirilishini ta’minlaydi.', order: questionIndex + 1 },
      })
      for (const [optionIndex, option] of [correct, ...incorrect].entries()) {
        const optionId = `demo-option-${courseIndex + 1}-${questionIndex + 1}-${optionIndex + 1}`
        await prisma.answerOption.upsert({
          where: { id: optionId },
          update: { text: option, isCorrect: optionIndex === 0, order: optionIndex + 1 },
          create: { id: optionId, questionId, text: option, isCorrect: optionIndex === 0, order: optionIndex + 1 },
        })
      }
    }

    await prisma.enrollment.upsert({
      where: { courseId_userId: { courseId: course.id, userId: learner.id } },
      update: courseIndex === 0 ? { status: 'completed', progress: 100, completedAt: new Date() } : { status: 'active', progress: courseIndex === 1 ? 33 : 0 },
      create: { courseId: course.id, userId: learner.id, status: courseIndex === 0 ? 'completed' : 'active', progress: courseIndex === 0 ? 100 : courseIndex === 1 ? 33 : 0, completedAt: courseIndex === 0 ? new Date() : null },
    })

    if (courseIndex <= 1) {
      const completedLessonCount = courseIndex === 0 ? 9 : 3
      for (let lessonIndex = 1; lessonIndex <= completedLessonCount; lessonIndex += 1) {
        const sectionNumber = Math.ceil(lessonIndex / 3)
        const sectionLessonNumber = ((lessonIndex - 1) % 3) + 1
        const lessonId = `demo-lesson-${courseIndex + 1}-${sectionNumber}-${sectionLessonNumber}`
        await prisma.lessonProgress.upsert({
          where: { lessonId_userId: { lessonId, userId: learner.id } },
          update: { isCompleted: true, completedAt: new Date(), watchTimeSec: 900 },
          create: { lessonId, userId: learner.id, isCompleted: true, completedAt: new Date(), watchTimeSec: 900 },
        })
      }
    }
  }

  const resources = COURSES.map((course, index) => ({
    id: `demo-resource-${index + 1}`,
    title: `${course.title}: amaliy eslatma`,
    description: `${course.title} bo‘yicha demo kursda foydalaniladigan qisqa amaliy resurs metama’lumoti.`,
    type: 'document', category: course.category[1], author: 'GidroEdu demo tahririyati', year: 2026, language: 'uz', fileType: 'pdf', fileSize: 0, uploadedBy: instructor.id, status: 'active', tags: 'demo,ta’lim,gidrometeorologiya',
  }))
  for (const resource of resources) {
    await prisma.libraryResource.upsert({ where: { id: resource.id }, update: resource, create: resource })
  }

  await prisma.certificateTemplate.upsert({
    where: { id: 'demo-certificate-template' },
    update: { name: 'GidroEdu demo sertifikati', isActive: true },
    create: { id: 'demo-certificate-template', name: 'GidroEdu demo sertifikati', titleText: 'SERTIFIKAT', bodyText: 'Demo kursni muvaffaqiyatli yakunlaganini tasdiqlaydi.', signerName: 'Demo vakolatli shaxs', signerTitle: 'O‘quv dasturi koordinatori', primaryColor: '#0f3d5e', accentColor: '#0891b2', isActive: true },
  })

  await prisma.quizAttempt.upsert({
    where: { id: 'demo-attempt-1' },
    update: { status: 'graded', score: 8, maxScore: 10, percentage: 80, passed: true, submittedAt: new Date(), timeSpentSec: 620 },
    create: { id: 'demo-attempt-1', quizId: 'demo-quiz-1', userId: learner.id, status: 'graded', score: 8, maxScore: 10, percentage: 80, passed: true, submittedAt: new Date(), timeSpentSec: 620 },
  })

  await prisma.certificate.upsert({
    where: { certNumber: 'DEMO-2026-0001' },
    update: { userId: learner.id, courseId: 'demo-course-1', templateId: 'demo-certificate-template', attemptId: 'demo-attempt-1', score: 8, maxScore: 10, percentage: 80, status: 'active' },
    create: { id: 'demo-certificate-1', certNumber: 'DEMO-2026-0001', userId: learner.id, courseId: 'demo-course-1', templateId: 'demo-certificate-template', attemptId: 'demo-attempt-1', score: 8, maxScore: 10, percentage: 80, status: 'active', verifyHash: 'd3f6a9b2c5e8f1a4d7c0b3e6f9a2c5d8e1f4a7b0' },
  })

  await prisma.notification.upsert({
    where: { id: 'demo-notification-welcome' },
    update: { title: 'Demo o‘quv muhiti tayyor', message: 'Siz uchun gidrometeorologiya bo‘yicha demo kurslar biriktirildi.' },
    create: { id: 'demo-notification-welcome', userId: learner.id, type: 'info', title: 'Demo o‘quv muhiti tayyor', message: 'Siz uchun gidrometeorologiya bo‘yicha demo kurslar biriktirildi.', link: 'courses' },
  })

  const demoSettings = [
    { key: 'platform_name', value: 'GidroEdu LMS Preview' },
    { key: 'default_language', value: 'uz' },
    { key: 'demo_content_notice', value: 'Fictional Preview training data; not an official operational instruction.' },
  ]
  for (const setting of demoSettings) {
    await prisma.setting.upsert({ where: { key: setting.key }, update: setting, create: setting })
  }

  console.info(`Demo seed complete: ${USERS.length} users, ${COURSES.length} courses, ${COURSES.length * 9} lessons, ${COURSES.length * 10} questions.`)
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : 'Demo seed failed')
    process.exitCode = 1
  })
  .finally(async () => prisma.$disconnect())
