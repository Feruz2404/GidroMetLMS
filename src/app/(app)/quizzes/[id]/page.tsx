import type { Metadata } from 'next'
import { QuizOverviewPage } from '@/features/quizzes/quiz-overview-page'

export const metadata: Metadata = { title: 'Test' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <QuizOverviewPage quizId={id} />
}
