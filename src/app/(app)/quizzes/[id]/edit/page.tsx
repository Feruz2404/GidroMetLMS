import type { Metadata } from 'next'
import { QuizEditorPage } from '@/features/quizzes/quiz-editor-page'
import { requirePagePermission } from '@/server/auth/page-session'
import { PERMISSIONS } from '@/shared/roles'

export const metadata: Metadata = { title: 'Testni tahrirlash' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requirePagePermission(PERMISSIONS.ASSESSMENTS_MANAGE)
  const { id } = await params
  return <QuizEditorPage quizId={id} />
}
