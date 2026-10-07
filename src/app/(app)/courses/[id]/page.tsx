import type { Metadata } from 'next'
import { CoursePage } from '@/features/courses/course-page'

export const metadata: Metadata = { title: 'Kurs' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CoursePage courseId={id} />
}
