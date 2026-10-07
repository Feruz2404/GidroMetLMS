import { AppShell } from '@/components/layout/app-shell'
import { SessionProvider } from '@/features/auth/session'
import { requirePageUser } from '@/server/auth/page-session'
import { toCurrentUser } from '@/server/modules/users/mapper'

// Every page in this group requires a session; the check runs on the server
// before anything renders, so signed-out visitors never see a flash of the app.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePageUser()
  return (
    <SessionProvider initialUser={toCurrentUser(user)}>
      <AppShell>{children}</AppShell>
    </SessionProvider>
  )
}
