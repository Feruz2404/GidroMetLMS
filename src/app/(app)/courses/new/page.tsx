import type { Metadata } from 'next'
import { CourseCreatePage } from '@/features/courses/course-create-page'
import { requirePagePermission } from '@/server/auth/page-session'
import { PERMISSIONS } from '@/shared/roles'

export const metadata: Metadata = { title: 'Yangi kurs' }

export default async function Page() {
  await requirePagePermission(PERMISSIONS.COURSES_MANAGE_ALL, PERMISSIONS.COURSES_MANAGE_OWN)
  return <CourseCreatePage />
}
