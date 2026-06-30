// Prisma seed script for GidroEdu LMS
// Run: npx prisma db seed (or: bun run prisma db seed)

import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data (order matters due to foreign keys)
  const deleteOrder = [
    'quizAnswer',
    'quizAttempt',
    'answerOption',
    'question',
    'quiz',
    'lessonProgress',
    'enrollment',
    'lesson',
    'section',
    'certificate',
    'certificateTemplate',
    'resourceBookmark',
    'resourceDownload',
    'libraryResource',
    'notification',
    'activityLog',
    'userSession',
    'user',
    'setting',
    'category',
    'course',
  ] as const

  for (const model of deleteOrder) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any)[model].deleteMany().catch(() => {})
  }

  console.log('  Cleaned existing data')

  // === USERS ===
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gidroedu.uz',
      username: 'admin',
      passwordHash: hashPassword('Admin@2026'),
      role: 'admin',
      firstName: 'Administrator',
      lastName: 'GidroEdu',
      department: 'IT bo\'limi',
      position: 'Administrator',
      emailVerifiedAt: new Date(),
    },
  })

  const tutor = await prisma.user.create({
    data: {
      email: 'tutor@gidroedu.uz',
      username: 'tutor',
      passwordHash: hashPassword('Tutor@2026'),
      role: 'tutor',
      firstName: 'Olim',
      lastName: 'Karimov',
      department: 'Gidrometeorologiya',
      position: 'O\'qituvchi',
      emailVerifiedAt: new Date(),
    },
  })

  const student = await prisma.user.create({
    data: {
      email: 'student@gidroedu.uz',
      username: 'student',
      passwordHash: hashPassword('Student@2026'),
      role: 'student',
      firstName: 'Ali',
      lastName: 'Toshmatov',
      department: 'Gidrometeorologiya',
      position: 'Talaba',
      emailVerifiedAt: new Date(),
    },
  })

  console.log('  Created 3 users: admin, tutor, student')

  // === CATEGORIES ===
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Gidrometeorologiya asoslari', slug: 'gidrometeorologiya-asoslari', icon: 'CloudRain', order: 1 },
    }),
    prisma.category.create({
      data: { name: 'Ob-havo kuzatish', slug: 'ob-havo-kuzatish', icon: 'Thermometer', order: 2 },
    }),
    prisma.category.create({
      data: { name: 'Suv resurslari', slug: 'suv-resurslari', icon: 'Droplets', order: 3 },
    }),
    prisma.category.create({
      data: { name: 'Iqlim o\'zgarishi', slug: 'iqlim-ozgarishi', icon: 'Globe', order: 4 },
    }),
  ])

  console.log('  Created 4 categories')

  // === COURSES ===
  const course1 = await prisma.course.create({
    data: {
      title: 'Gidrometeorologiya asoslari',
      description: 'Gidrometeorologiya fanining asosiy tushunchalari, ob-havo va iqlim haqida bilimlar.',
      slug: 'gidrometeorologiya-asoslari',
      categoryId: categories[0].id,
      tutorId: tutor.id,
      createdBy: admin.id,
      durationHours: 24,
      level: 'beginner',
      status: 'published',
      publishedAt: new Date(),
    },
  })

  const course2 = await prisma.course.create({
    data: {
      title: 'Ob-havo kuzatish usullari',
      description: 'Zamonaviy ob-havo kuzatish usullari va meteorologik asboblardan foydalanish.',
      slug: 'ob-havo-kuzatish-usullari',
      categoryId: categories[1].id,
      tutorId: tutor.id,
      createdBy: admin.id,
      durationHours: 16,
      level: 'intermediate',
      status: 'published',
      publishedAt: new Date(),
    },
  })

  const course3 = await prisma.course.create({
    data: {
      title: 'Suv resurslarini boshqarish',
      description: 'Suv resurslarini monitoring qilish va boshqarish bo\'yicha ilmiy asoslar.',
      slug: 'suv-resurslarini-boshqarish',
      categoryId: categories[2].id,
      tutorId: tutor.id,
      createdBy: admin.id,
      durationHours: 20,
      level: 'advanced',
      status: 'published',
      publishedAt: new Date(),
    },
  })

  console.log('  Created 3 courses')

  // === SECTIONS & LESSONS ===
  const section1 = await prisma.section.create({
    data: { courseId: course1.id, title: 'Kirish', order: 1 },
  })

  await prisma.lesson.createMany({
    data: [
      {
        courseId: course1.id,
        sectionId: section1.id,
        title: 'Gidrometeorologiya nima?',
        content: '# Gidrometeorologiya nima?\n\nGidrometeorologiya — Yer atmosferasida sodir bo\'ladigan fizikaviy jarayonlarni o\'rganadigan fan.\n\n## Asosiy tushunchalar\n\n- **Ob-havo** — ma\'lum bir vaqtda atmosferaning holati\n- **Iqlim** — uzoq muddatli ob-havo rejimi\n- **Meteorologiya** — ob-havoni o\'rganadigan fan',
        type: 'text',
        durationMin: 15,
        order: 1,
        isFree: true,
      },
      {
        courseId: course1.id,
        sectionId: section1.id,
        title: 'Atmosfera tarkibi',
        content: '# Atmosfera tarkibi\n\nYer atmosferasi bir nechta gazlardan tashkil topgan:\n\n1. **Azot (N₂)** — 78%\n2. **Kislorod (O₂)** — 21%\n3. **Argon (Ar)** — 0.93%\n4. **Uglerod dioksidi (CO₂)** — 0.04%',
        type: 'text',
        durationMin: 20,
        order: 2,
      },
    ],
  })

  console.log('  Created sections and lessons')

  // === ENROLLMENTS ===
  await prisma.enrollment.createMany({
    data: [
      { courseId: course1.id, userId: student.id, status: 'active', progress: 45 },
      { courseId: course2.id, userId: student.id, status: 'active', progress: 20 },
    ],
  })

  console.log('  Created enrollments')

  // === QUIZ ===
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Gidrometeorologiya asoslari — Test',
      description: 'Kurs bo\'yicha bilimlarini tekshirish uchun test.',
      courseId: course1.id,
      createdBy: tutor.id,
      timeLimitMin: 15,
      passingScore: 70,
      maxAttempts: 3,
      status: 'published',
    },
  })

  // Quiz questions
  const q1 = await prisma.question.create({
    data: { quizId: quiz.id, text: 'Gidrometeorologiya nima o\'rganadi?', type: 'single_choice', points: 1, order: 1 },
  })
  await prisma.answerOption.createMany({
    data: [
      { questionId: q1.id, text: 'Yer atmosferasi jarayonlarini', isCorrect: true, order: 1 },
      { questionId: q1.id, text: 'Okean suvlarini', isCorrect: false, order: 2 },
      { questionId: q1.id, text: 'Yer po\'stini', isCorrect: false, order: 3 },
      { questionId: q1.id, text: 'Kosmik obyektlarni', isCorrect: false, order: 4 },
    ],
  })

  const q2 = await prisma.question.create({
    data: { quizId: quiz.id, text: 'Atmosferada eng ko\'p mavjud bo\'lgan gaz?', type: 'single_choice', points: 1, order: 2 },
  })
  await prisma.answerOption.createMany({
    data: [
      { questionId: q2.id, text: 'Kislorod', isCorrect: false, order: 1 },
      { questionId: q2.id, text: 'Azot', isCorrect: true, order: 2 },
      { questionId: q2.id, text: 'Argon', isCorrect: false, order: 3 },
      { questionId: q2.id, text: 'Uglerod dioksidi', isCorrect: false, order: 4 },
    ],
  })

  const q3 = await prisma.question.create({
    data: { quizId: quiz.id, text: 'Ob-havo bu nima?', type: 'single_choice', points: 1, order: 3 },
  })
  await prisma.answerOption.createMany({
    data: [
      { questionId: q3.id, text: 'Uzoq muddatli ob-havo rejimi', isCorrect: false, order: 1 },
      { questionId: q3.id, text: 'Ma\'lum bir vaqtda atmosferaning holati', isCorrect: true, order: 2 },
      { questionId: q3.id, text: 'Yer yuzasining balandligi', isCorrect: false, order: 3 },
    ],
  })

  console.log('  Created quiz with 3 questions')

  // === LIBRARY RESOURCES ===
  await prisma.libraryResource.createMany({
    data: [
      {
        title: 'Meteorologiya darslik',
        description: 'Gidrometeorologiya texnikumi uchun darslik',
        type: 'book',
        category: 'Darslik',
        author: 'Karimov O.',
        publisher: 'Fan nashriyoti',
        year: 2024,
        language: 'uz',
        pages: 250,
        uploadedBy: admin.id,
      },
      {
        title: 'Ob-havo kuzatish qo\'llanmasi',
        description: 'Amaliy ob-havo kuzatish bo\'yicha qo\'llanma',
        type: 'document',
        category: 'Qo\'llanma',
        author: 'Xolmatov S.',
        year: 2023,
        language: 'uz',
        pages: 120,
        uploadedBy: tutor.id,
      },
      {
        title: 'Iqlim o\'zgarishi hisoboti',
        description: 'O\'zbekiston iqlim o\'zgarishi bo\'yicha yillik hisobot',
        type: 'article',
        category: 'Hisobot',
        year: 2025,
        language: 'uz',
        uploadedBy: admin.id,
      },
    ],
  })

  console.log('  Created 3 library resources')

  // === CERTIFICATE TEMPLATE ===
  await prisma.certificateTemplate.create({
    data: {
      name: 'Standart sertifikat',
      titleText: 'SERTIFIKAT',
      bodyText: 'Ushbu sertifikat bilimlarni muvaffaqiyatli o\'zlashtirgani uchun beriladi.',
      signerName: 'R. Xolmatov',
      signerTitle: 'Gidrometeorologiya Texnikumi direktori',
      primaryColor: '#0f766e',
      accentColor: '#ca8a04',
    },
  })

  console.log('  Created certificate template')

  // === SETTINGS ===
  await prisma.setting.createMany({
    data: [
      { key: 'pass_percentage', value: '70' },
      { key: 'max_file_size_mb', value: '500' },
      { key: 'session_ttl_days', value: '7' },
      { key: 'backup_schedule', value: 'daily' },
      { key: 'max_enrollment', value: '0' },
    ],
  })

  console.log('  Created settings')

  // === NOTIFICATIONS ===
  await prisma.notification.createMany({
    data: [
      { userId: student.id, type: 'info', title: 'Yangi kurs qo\'shildi', message: '"Suv resurslarini boshqarish" kursi nashr etildi.' },
      { userId: student.id, type: 'success', title: 'Registratsiya muvaffaqiyatli', message: 'Tizimga muvaffaqiyatli ro\'yxatdan o\'tdingiz.' },
      { userId: tutor.id, type: 'info', title: 'Yangi talaba', message: 'Ali Toshmatov tizimiga ro\'yxatdan o\'tdi.' },
    ],
  })

  console.log('  Created notifications')

  console.log('\n✅ Seed complete!')
  console.log('\nDemo accounts:')
  console.log('  Admin:   admin@gidroedu.uz / Admin@2026')
  console.log('  Tutor:   tutor@gidroedu.uz  / Tutor@2026')
  console.log('  Student: student@gidroedu.uz / Student@2026')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })