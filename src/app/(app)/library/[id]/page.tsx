import type { Metadata } from 'next'
import { ResourcePage } from '@/features/library/resource-page'

export const metadata: Metadata = { title: 'Kutubxona resursi' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ResourcePage id={id} />
}
