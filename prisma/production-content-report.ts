import type { PrismaClient } from '@prisma/client'

export async function getProductionContentCounts(prisma: PrismaClient) {
  const [
    users,
    departments,
    regionalDivisions,
    roles,
    rolePermissions,
    categories,
    courses,
    sections,
    lessons,
    quizzes,
    questions,
    answerOptions,
    libraryResources,
    announcements,
    notifications,
    enrollments,
    certificateTemplates,
    certificates,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.department.count(),
    prisma.regionalDivision.count(),
    prisma.roleDefinition.count(),
    prisma.rolePermission.count(),
    prisma.category.count(),
    prisma.course.count(),
    prisma.section.count(),
    prisma.lesson.count(),
    prisma.quiz.count(),
    prisma.question.count(),
    prisma.answerOption.count(),
    prisma.libraryResource.count(),
    prisma.announcement.count(),
    prisma.notification.count(),
    prisma.enrollment.count(),
    prisma.certificateTemplate.count(),
    prisma.certificate.count(),
  ])

  return {
    users,
    departments,
    regionalDivisions,
    roles,
    rolePermissions,
    categories,
    courses,
    sections,
    lessons,
    quizzes,
    questions,
    answerOptions,
    libraryResources,
    announcements,
    notifications,
    enrollments,
    certificateTemplates,
    certificates,
  }
}

function duplicates(values: Array<string | null | undefined>) {
  const counts = new Map<string, number>()
  for (const value of values) {
    if (!value) continue
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value)
}

export async function getProductionContentDuplicateReport(prisma: PrismaClient) {
  const [users, categories, courses, resources, departments, divisions, announcements] = await Promise.all([
    prisma.user.findMany({ select: { email: true, username: true } }),
    prisma.category.findMany({ select: { slug: true } }),
    prisma.course.findMany({ select: { slug: true } }),
    prisma.libraryResource.findMany({ select: { slug: true } }),
    prisma.department.findMany({ select: { code: true } }),
    prisma.regionalDivision.findMany({ select: { code: true } }),
    prisma.announcement.findMany({ select: { eventKey: true } }),
  ])

  return {
    emails: duplicates(users.map((user) => user.email)),
    usernames: duplicates(users.map((user) => user.username)),
    categorySlugs: duplicates(categories.map((category) => category.slug)),
    courseSlugs: duplicates(courses.map((course) => course.slug)),
    resourceSlugs: duplicates(resources.map((resource) => resource.slug)),
    departmentCodes: duplicates(departments.map((department) => department.code)),
    regionalDivisionCodes: duplicates(divisions.map((division) => division.code)),
    announcementKeys: duplicates(announcements.map((announcement) => announcement.eventKey)),
  }
}
