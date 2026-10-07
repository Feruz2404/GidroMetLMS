import type { Metadata } from 'next'
import { QuizEditorPage } from '@/features/quizzes/quiz-editor-page'
import { requirePagePermission } from '@/server/auth/page-session'
import { PERMISSIONS } from '@/shared/roles'

export const metadata: Metadata = { title: 'Yangi test' }

export default async function Page({ searchParams }: { searchParams: Promise<{ courseId?: string | string[] }> }) {
  await requirePagePermission(PERMISSIONS.ASSESSMENTS_MANAGE)
  const { courseId } = await searchParams
  return <QuizEditorPage courseId={typeof courseId === 'string' ? courseId : undefined} />
}
