import { redirect } from 'next/navigation'
import { AuthHero } from '@/features/auth/auth-hero'
import { getPageUser } from '@/server/auth/page-session'
import { getCatalogueStats } from '@/server/modules/courses/stats'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  if (await getPageUser()) redirect('/dashboard')
  const stats = await getCatalogueStats().catch(() => null)
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1.1fr)_minmax(440px,0.9fr)]">
      <AuthHero stats={stats} />
      <main className="flex items-center justify-center bg-background px-5 py-10 sm:px-10">{children}</main>
    </div>
  )
}
