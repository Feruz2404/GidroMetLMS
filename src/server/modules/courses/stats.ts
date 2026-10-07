import { db } from '@/server/db'

/** Public catalogue size shown on the sign-in page (real counts, never fabricated). */
export async function getCatalogueStats() {
  const [courses, lessons, resources] = await Promise.all([
    db.course.count({ where: { status: 'published' } }),
    db.lesson.count({ where: { course: { status: 'published' } } }),
    db.libraryResource.count({ where: { status: 'active' } }),
  ])
  return { courses, lessons, resources }
}
