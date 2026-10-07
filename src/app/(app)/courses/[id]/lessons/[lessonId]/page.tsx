import type { Metadata } from 'next'
import { LessonPage } from '@/features/courses/lesson-page'

export const metadata: Metadata = { title: 'Dars' }

export default async function Page({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
  const { id, lessonId } = await params
  return <LessonPage courseId={id} lessonId={lessonId} />
}
