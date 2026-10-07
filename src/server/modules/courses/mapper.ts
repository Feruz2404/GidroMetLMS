import type { Enrollment, Prisma } from '@prisma/client'
import { canManageCourse, type Actor } from '@/server/auth/permissions'
import { toUserSummary, userSummarySelect } from '@/server/modules/users/mapper'
import type { CourseCardDto, CourseEnrollmentDto, CourseLevel, CourseStatus, EnrollmentStatus } from '@/shared/dto'

export function courseCardInclude(userId: string) {
  return {
    category: { select: { id: true, name: true, slug: true, icon: true } },
    tutor: { select: userSummarySelect },
    _count: { select: { lessons: true, enrollments: true } },
    enrollments: { where: { userId }, take: 1 },
  } satisfies Prisma.CourseInclude
}

export type CourseCardSource = Prisma.CourseGetPayload<{ include: ReturnType<typeof courseCardInclude> }>

export function toEnrollmentDto(enrollment: Enrollment): CourseEnrollmentDto {
  return {
    id: enrollment.id,
    status: enrollment.status as EnrollmentStatus,
    progress: enrollment.progress,
    startedAt: enrollment.startedAt.toISOString(),
    completedAt: enrollment.completedAt?.toISOString() ?? null,
    deadlineAt: enrollment.deadlineAt?.toISOString() ?? null,
  }
}

export function toCourseCard(course: CourseCardSource, actor: Actor): CourseCardDto {
  const enrollment = course.enrollments[0]
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    titleRu: course.titleRu,
    shortSummary: course.shortSummary,
    level: course.level as CourseLevel,
    status: course.status as CourseStatus,
    durationHours: course.durationHours,
    isMandatory: course.isMandatory,
    category: course.category,
    tutor: course.tutor ? toUserSummary(course.tutor) : null,
    lessonCount: course._count.lessons,
    enrollmentCount: course._count.enrollments,
    enrollment: enrollment ? toEnrollmentDto(enrollment) : null,
    canManage: canManageCourse(actor, course),
    publishedAt: course.publishedAt?.toISOString() ?? null,
    updatedAt: course.updatedAt.toISOString(),
  }
}

/** Multi-line text columns store one item per line (a leading bullet is tolerated). */
export function splitLines(value: string | null): string[] {
  if (!value) return []
  return value
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s•\-*]+/, '').trim())
    .filter(Boolean)
}

export function joinLines(lines: string[]): string | null {
  return lines.length ? lines.join('\n') : null
}

const TRANSLITERATION: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ц: 's', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '',
  ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya', ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h',
}

export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .split('')
      .map((char) => TRANSLITERATION[char] ?? char)
      .join('')
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[‘’ʻʼ'`]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'kurs'
  )
}
