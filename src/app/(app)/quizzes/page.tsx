import type { Metadata } from 'next'
import { QuizListPage } from '@/features/quizzes/quiz-list-page'

export const metadata: Metadata = { title: 'Testlar' }

export default function Page() {
  return <QuizListPage />
}
