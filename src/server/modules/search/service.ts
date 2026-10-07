import { hasPermission, PERMISSIONS, type Actor } from '@/server/auth/permissions'
import { db } from '@/server/db'
import { ilike } from '@/server/http/request'
import { visibleCoursesWhere } from '@/server/modules/courses/service'
import type { ResourceType, SearchResultsDto } from '@/shared/dto'

/** Global quick search used by the command palette. */
export async function search(actor: Actor, term: string): Promise<SearchResultsDto> {
  const query = term.trim()
  if (query.length < 2) return { courses: [], resources: [], users: [] }

  const [courses, resources, users] = await Promise.all([
    db.course.findMany({
      where: { AND: [visibleCoursesWhere(actor), { status: { not: 'archived' } }, { OR: [{ title: ilike(query) }, { shortSummary: ilike(query) }] }] },
      select: { id: true, title: true, category: { select: { name: true } } },
      orderBy: { title: 'asc' },
      take: 6,
    }),
    db.libraryResource.findMany({
      where: { status: 'active', OR: [{ title: ilike(query) }, { author: ilike(query) }, { tags: ilike(query) }] },
      select: { id: true, title: true, type: true },
      orderBy: { viewCount: 'desc' },
      take: 6,
    }),
    hasPermission(actor.role, PERMISSIONS.USERS_MANAGE)
      ? db.user.findMany({
          where: { OR: [{ firstName: ilike(query) }, { lastName: ilike(query) }, { email: ilike(query) }] },
          select: { id: true, firstName: true, lastName: true, email: true },
          take: 5,
        })
      : Promise.resolve([]),
  ])

  return {
    courses: courses.map((course) => ({ id: course.id, title: course.title, category: course.category?.name ?? null })),
    resources: resources.map((resource) => ({ id: resource.id, title: resource.title, type: resource.type as ResourceType })),
    users: users.map((user) => ({ id: user.id, name: `${user.lastName} ${user.firstName}`, email: user.email })),
  }
}
