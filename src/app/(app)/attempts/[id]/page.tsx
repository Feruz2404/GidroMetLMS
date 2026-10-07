import type { Metadata } from 'next'
import { AttemptPage } from '@/features/quizzes/attempt-page'

export const metadata: Metadata = { title: 'Test topshirish' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AttemptPage attemptId={id} />
}
