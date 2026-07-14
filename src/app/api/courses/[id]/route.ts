import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err, logActivity, getClientIp } from '@/lib/auth'
import { canManageCourse, hasPermission, isInstructorRole, isLearnerRole, PERMISSIONS } from '@/server/auth/permissions'

// GET /api/courses/[id] — full course detail with sections, lessons, progress
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')

    const { id } = await params

    const course = await db.course.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true, description: true } },
        tutor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
            position: true,
            department: true,
            avatarUrl: true,
          },
        },
        sections: { orderBy: { order: 'asc' } },
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            section: { select: { id: true, title: true, order: true } },
            progress: isLearnerRole(user.role)
              ? { where: { userId: user.id } }
              : false,
          },
        },
        _count: { select: { enrollments: true, lessons: true } },
        enrollments: isLearnerRole(user.role)
          ? { where: { userId: user.id } }
          : false,
      },
    })

    if (!course) return err(404, 'Kurs topilmadi')

    // Visibility check: students can only see published courses
    if (isLearnerRole(user.role) && course.status !== 'published') {
      return err(404, 'Kurs topilmadi')
    }
    // Tutors can only see their own drafts/non-published
    if (
      isInstructorRole(user.role) &&
      course.status !== 'published' &&
      course.tutorId !== user.id &&
      course.createdBy !== user.id
    ) {
      return err(403, 'Ruxsat yo\'q')
    }

    const { enrollments, ...rest } = course as typeof course & {
      enrollments?: Array<{ id: string; progress: number; status: string; startedAt: Date; completedAt: Date | null; deadlineAt: Date | null }>
    }

    // Flatten enrollment + lesson progress for students
    const enrollment = enrollments?.[0] ?? null

    // For students: lock lessons if not enrolled (unless free preview)
    const isEnrolled = !!enrollment
    const isOwner = canManageCourse(user.role, user.id, course)

    const lessons = (course.lessons as Array<typeof course.lessons[number]>).map((l) => {
      const { progress, ...lessonRest } = l as typeof l & { progress?: Array<{ isCompleted: boolean; watchTimeSec: number; lastPosition: number }> }
      const lp = progress?.[0] ?? null
      const locked = !isEnrolled && !isOwner && !lessonRest.isFree
      // Hide content for locked lessons
      return {
        ...lessonRest,
        progress: lp ? { isCompleted: lp.isCompleted, watchTimeSec: lp.watchTimeSec, lastPosition: lp.lastPosition } : null,
        isLocked: locked,
        content: locked ? null : lessonRest.content,
        videoUrl: locked ? null : lessonRest.videoUrl,
        fileUrl: locked ? null : lessonRest.fileUrl,
      }
    })

    // Group lessons by section
    const sections = course.sections.map((s) => ({
      ...s,
      lessons: lessons.filter((l) => l.sectionId === s.id),
    }))

    // Lessons without section (safety)
    const orphanLessons = lessons.filter((l) => !l.sectionId)

    return ok({
      ...rest,
      enrollment,
      sections,
      lessons: orphanLessons.length ? orphanLessons : lessons,
    })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('GET /api/courses/[id] error:', e)
    return err(500, 'Server xatosi')
  }
}

// PATCH /api/courses/[id] — update course (tutor/admin)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')
    if (!hasPermission(user.role, PERMISSIONS.COURSES_MANAGE_ALL) && !hasPermission(user.role, PERMISSIONS.COURSES_MANAGE_OWN)) return err(403, 'Ruxsat yo\'q')

    const { id } = await params
    const course = await db.course.findUnique({ where: { id } })
    if (!course) return err(404, 'Kurs topilmadi')

    // Tutor can only edit their own courses; admin can edit any
    if (!canManageCourse(user.role, user.id, course)) {
      return err(403, 'Faqat o\'z kurslaringizni tahrirlay olasiz')
    }

    const body = await req.json()
    const allowed = [
      'title', 'description', 'categoryId', 'tutorId',
      'thumbnailUrl', 'durationHours', 'level', 'isMandatory',
      'passPercentage', 'maxAttempts', 'validDays', 'status',
    ]

    const data: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) {
        const v = (body as Record<string, unknown>)[key]
        if (v === undefined) continue
        if (['durationHours', 'passPercentage', 'maxAttempts', 'validDays'].includes(key)) {
          data[key] = v === null ? null : Number(v)
        } else if (key === 'isMandatory') {
          data[key] = Boolean(v)
        } else {
          data[key] = v
        }
      }
    }

    // Auto-set publishedAt when transitioning to published
    if (data.status === 'published' && !course.publishedAt) {
      data.publishedAt = new Date()
    }

    // Don't regenerate slug on title change — slug is only set on creation
    if (typeof data.title === 'string' && data.title !== course.title) {
      // Keep existing slug to maintain URL stability
    }

    const updated = await db.course.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true } },
        tutor: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { enrollments: true, lessons: true } },
      },
    })

    await logActivity(user.id, 'update_course', 'course', id, { fields: Object.keys(data) }, getClientIp(req))

    return ok(updated)
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('PATCH /api/courses/[id] error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
