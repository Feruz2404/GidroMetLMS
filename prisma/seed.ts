// Development / Preview seed: the real learning catalogue plus a fictional,
// repeatable organisation with realistic learning activity.
// Never runs in Production (see the guard below).
import './load-env'
import { PrismaClient } from '@prisma/client'
import { passwordSchema } from '../src/shared/schemas'
import { seedCatalog } from './seed/catalog'
import { seedDemo } from './seed/demo'

const prisma = new PrismaClient()

function assertAllowed() {
  const preview = process.env.VERCEL_ENV === 'preview' && process.env.RUN_PREVIEW_SEED === 'true'
  const local = !process.env.VERCEL_ENV && process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEMO_SEED === 'true'
  if (!preview && !local) {
    throw new Error('Demo seed blocked. Use ALLOW_DEMO_SEED=true locally or RUN_PREVIEW_SEED=true in Vercel Preview.')
  }
}

async function main() {
  assertAllowed()
  const password = passwordSchema.safeParse(process.env.DEMO_SEED_PASSWORD)
  if (!password.success) throw new Error('DEMO_SEED_PASSWORD must be a strong, environment-specific password.')

  const started = Date.now()
  // The author must exist before courses reference it; demo staff are (re)created by seedDemo.
  const author = await prisma.user.upsert({
    where: { id: 'demo-user-administrator' },
    update: {},
    create: {
      id: 'demo-user-administrator',
      email: 'administrator@demo.gidroedu.uz',
      username: 'demo.administrator',
      passwordHash: 'pending',
      role: 'administrator',
      firstName: 'Javlon',
      lastName: 'Qodirov',
    },
  })
  await seedCatalog(prisma, { authorId: author.id, log: console.warn })
  await seedDemo(prisma, { password: password.data, log: console.info })
  console.info(`Seed finished in ${((Date.now() - started) / 1000).toFixed(1)} s.`)
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
