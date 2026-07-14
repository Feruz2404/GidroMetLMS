import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'
import { passwordSchema } from '../src/validators/auth'

const prisma = new PrismaClient()

async function createInitialAdministrator() {
  const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.INITIAL_ADMIN_PASSWORD
  if (!email && !password) return
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error('INITIAL_ADMIN_EMAIL must be a valid email address.')

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (existing) {
    console.warn('Initial administrator already exists; no credentials were changed.')
    return
  }

  const parsedPassword = passwordSchema.safeParse(password)
  if (!parsedPassword.success) throw new Error(parsedPassword.error.issues[0]?.message ?? 'INITIAL_ADMIN_PASSWORD is invalid.')

  const requestedUsername = process.env.INITIAL_ADMIN_USERNAME?.trim().toLowerCase()
  const username = requestedUsername || email.split('@')[0].replace(/[^a-z0-9._-]/g, '.')
  await prisma.user.create({
    data: {
      email,
      username,
      passwordHash: hashPassword(parsedPassword.data),
      role: 'super_admin',
      firstName: process.env.INITIAL_ADMIN_FIRST_NAME?.trim() || 'System',
      lastName: process.env.INITIAL_ADMIN_LAST_NAME?.trim() || 'Administrator',
      department: process.env.INITIAL_ADMIN_DEPARTMENT?.trim() || null,
      position: process.env.INITIAL_ADMIN_POSITION?.trim() || 'Super administrator',
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  })
  console.warn('Initial administrator created. The password was not printed.')
}

async function main() {
  if (process.env.VERCEL_ENV !== 'production' || process.env.RUN_PRODUCTION_INIT !== 'true') {
    throw new Error('Production initialization is blocked unless VERCEL_ENV=production and RUN_PRODUCTION_INIT=true.')
  }

  await prisma.setting.createMany({
    data: [
      { key: 'platform_name', value: 'GidroEdu LMS' },
      { key: 'default_language', value: 'uz' },
      { key: 'public_registration_enabled', value: 'false' },
    ],
    skipDuplicates: true,
  })
  await prisma.category.createMany({
    data: [
      { id: 'system-category-meteorology', slug: 'meteorologiya', name: 'Meteorologiya', icon: 'CloudSun', order: 10 },
      { id: 'system-category-hydrology', slug: 'gidrologiya', name: 'Gidrologiya', icon: 'Droplets', order: 20 },
      { id: 'system-category-safety', slug: 'mehnat-xavfsizligi', name: 'Mehnat xavfsizligi', icon: 'ShieldCheck', order: 30 },
    ],
    skipDuplicates: true,
  })
  await prisma.certificateTemplate.upsert({
    where: { id: 'system-certificate-template' },
    update: {},
    create: {
      id: 'system-certificate-template',
      name: 'GidroEdu standart sertifikati',
      titleText: 'SERTIFIKAT',
      bodyText: 'Kursni muvaffaqiyatli yakunlaganini tasdiqlaydi.',
      primaryColor: '#0f3d5e',
      accentColor: '#0891b2',
      isActive: true,
    },
  })
  await createInitialAdministrator()
  console.warn('Production initialization completed without overwriting existing records.')
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : 'Production initialization failed.')
    process.exitCode = 1
  })
  .finally(async () => prisma.$disconnect())
