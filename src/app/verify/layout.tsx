import { PublicShell } from '@/features/certificates/components/public-shell'
import { getPageUser } from '@/server/auth/page-session'

// Public: verification must work for anyone holding a certificate link or QR code.
export default async function VerifyLayout({ children }: { children: React.ReactNode }) {
  const user = await getPageUser().catch(() => null)
  return <PublicShell signedIn={Boolean(user)}>{children}</PublicShell>
}
