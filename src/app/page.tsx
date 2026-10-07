import { redirect } from 'next/navigation'
import { getPageUser } from '@/server/auth/page-session'

// Entry point. Also keeps QR codes printed on older certificates working:
// they point at /?view=verify&hash=<hash>.
export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const hash = typeof params.hash === 'string' ? params.hash : typeof params.cert === 'string' ? params.cert : null
  if (params.view === 'verify') redirect(hash ? `/verify/${encodeURIComponent(hash)}` : '/verify')
  redirect((await getPageUser()) ? '/dashboard' : '/login')
}
