import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { extractVerificationCode } from '@/features/certificates/verification-code'
import { VerifyPage } from '@/features/certificates/verify-page'
import { routes } from '@/lib/routes'

export const metadata: Metadata = { title: 'Sertifikatni tekshirish' }

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { hash } = await searchParams
  const code = typeof hash === 'string' ? extractVerificationCode(hash) : null
  if (code) redirect(routes.verify(code))
  return <VerifyPage />
}
