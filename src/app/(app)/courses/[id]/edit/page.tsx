import type { Metadata } from 'next'
import { CourseEditorPage } from '@/features/courses/course-editor-page'
import { requirePagePermission } from '@/server/auth/page-session'
import { PERMISSIONS } from '@/shared/roles'

export const metadata: Metadata = { title: 'Kursni tahrirlash' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requirePagePermission(PERMISSIONS.COURSES_MANAGE_ALL, PERMISSIONS.COURSES_MANAGE_OWN)
  const { id } = await params
  return <CourseEditorPage courseId={id} />
}
