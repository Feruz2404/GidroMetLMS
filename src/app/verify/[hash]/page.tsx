import type { Metadata } from 'next'
import { VerifyResultPage } from '@/features/certificates/verify-result-page'

// Results name a person, so they are kept out of search engines.
export const metadata: Metadata = { title: 'Sertifikat tekshiruvi', robots: { index: false, follow: false } }

export default async function Page({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params
  return <VerifyResultPage hash={hash.toLowerCase()} />
}
