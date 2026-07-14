import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'
import { passwordSchema } from '../src/validators/auth'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.INITIAL_ADMIN_PASSWORD
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

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : 'Initial administrator setup failed.')
    process.exitCode = 1
  })
  .finally(async () => prisma.$disconnect())
