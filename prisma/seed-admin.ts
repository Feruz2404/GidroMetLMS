import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gidroedu.uz' },
    update: {
      username: 'admin',
      passwordHash: hashPassword('Admin@2026'),
      role: 'admin',
      firstName: 'Administrator',
      lastName: 'GidroEdu',
      department: 'IT bo\'limi',
      position: 'Administrator',
      isActive: true,
      emailVerifiedAt: new Date(),
    },
    create: {
      email: 'admin@gidroedu.uz',
      username: 'admin',
      passwordHash: hashPassword('Admin@2026'),
      role: 'admin',
      firstName: 'Administrator',
      lastName: 'GidroEdu',
      department: 'IT bo\'limi',
      position: 'Administrator',
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  })

  console.warn(`Admin account ready: ${admin.email}`)
}

main()
  .catch((error) => {
    console.error('Seed admin error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
