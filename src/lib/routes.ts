// Single source of truth for application URLs.
export const routes = {
  home: '/',
  login: (next?: string) => (next ? `/login?next=${encodeURIComponent(next)}` : '/login'),
  register: '/register',
  dashboard: '/dashboard',
  courses: '/courses',
  newCourse: '/courses/new',
  course: (id: string) => `/courses/${id}`,
  courseEditor: (id: string) => `/courses/${id}/edit`,
  lesson: (courseId: string, lessonId: string) => `/courses/${courseId}/lessons/${lessonId}`,
  quizzes: '/quizzes',
  newQuiz: (courseId?: string) => (courseId ? `/quizzes/new?courseId=${courseId}` : '/quizzes/new'),
  quiz: (id: string) => `/quizzes/${id}`,
  quizEditor: (id: string) => `/quizzes/${id}/edit`,
  attempt: (id: string) => `/attempts/${id}`,
  library: '/library',
  resource: (id: string) => `/library/${id}`,
  certificates: '/certificates',
  certificate: (id: string) => `/certificates/${id}`,
  verify: (hash?: string) => (hash ? `/verify/${hash}` : '/verify'),
  notifications: '/notifications',
  reports: '/reports',
  users: '/users',
  settings: (tab?: 'profile' | 'security' | 'preferences') => (tab ? `/settings?tab=${tab}` : '/settings'),
} as const

const LEGACY_LINKS: Record<string, string> = {
  dashboard: routes.dashboard,
  courses: routes.courses,
  quizzes: routes.quizzes,
  library: routes.library,
  certificates: routes.certificates,
  notifications: routes.notifications,
  reports: routes.reports,
  settings: routes.settings(),
}

/**
 * Notification links are stored as app paths ("/courses/…"). Older records
 * used view names ("courses", "course-detail:<id>"); map those too.
 */
export function resolveAppLink(link: string | null | undefined): string | null {
  if (!link) return null
  if (link.startsWith('/') && !link.startsWith('//')) return link
  const [view, id] = link.split(':')
  if (view === 'course-detail' && id) return routes.course(id)
  if (view === 'library-detail' && id) return routes.resource(id)
  return LEGACY_LINKS[view] ?? null
}
