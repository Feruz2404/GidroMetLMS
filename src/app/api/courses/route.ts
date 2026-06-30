import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err, logActivity, getClientIp } from '@/lib/auth'

// GET /api/courses — paginated list with filters
// Query: search, categoryId, level, status, page (1), limit (12), sort (newest|popular|title)
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')?.trim() ?? ''
    const categoryId = searchParams.get('categoryId') ?? ''
    const level = searchParams.get('level') ?? ''
    const status = searchParams.get('status') ?? ''
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(60, Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10)))
    const sort = searchParams.get('sort') ?? 'newest'

    // Build where clause based on role
    // Students: only published courses; tutors/admins can additionally see their own draft courses
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    if (user.role === 'student') {
      where.status = 'published'
    } else if (status) {
      where.status = status
    } else if (user.role === 'tutor') {
      // tutors: published OR their own (any status)
      where.OR = [{ status: 'published' }, { tutorId: user.id }, { createdBy: user.id }]
    }
    // admin sees everything (no filter)

    if (categoryId) where.categoryId = categoryId
    if (level) where.level = level

    if (search) {
      where.OR = [
        ...(Array.isArray(where.OR) ? where.OR : []),
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    // Sorting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'title') orderBy = { title: 'asc' }
    else if (sort === 'popular') orderBy = { enrollments: { _count: 'desc' } }

    const [total, courses] = await Promise.all([
      db.course.count({ where }),
      db.course.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true, icon: true } },
          tutor: { select: { id: true, firstName: true, lastName: true, position: true, avatarUrl: true } },
          _count: { select: { enrollments: true, lessons: true } },
          enrollments: user.role === 'student'
            ? { where: { userId: user.id }, select: { id: true, progress: true, status: true } }
            : false,
        },
      }),
    ])

    // Flatten enrollment for students
    const data = courses.map((c) => {
      const { enrollments, ...rest } = c as typeof c & { enrollments?: Array<{ id: string; progress: number; status: string }> }
      return {
        ...rest,
        enrollment: enrollments?.[0] ?? null,
      }
    })

    return ok(data, { total, page, pages: Math.max(1, Math.ceil(total / limit)), limit })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('GET /api/courses error:', e)
    return err(500, 'Server xatosi')
  }
}

// POST /api/courses — tutor/admin create new course
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')
    if (!['tutor', 'admin'].includes(user.role)) return err(403, 'Ruxsat yo\'q')

    const body = await req.json()
    const {
      title,
      description,
      categoryId,
      tutorId,
      thumbnailUrl,
      durationHours,
      level,
      isMandatory,
      passPercentage,
      maxAttempts,
      validDays,
      status,
    } = body as Record<string, unknown>

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return err(400, 'Sarlavha kamida 3 ta belgidan iborat bo\'lishi kerak')
    }

    const slug = (title as string)
      .toLowerCase()
      .replace(/[^a-z0-9\s'-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      + '-' + Math.random().toString(36).slice(2, 8)

    const course = await db.course.create({
      data: {
        title: title as string,
        description: (description as string) ?? null,
        slug,
        categoryId: (categoryId as string) || null,
        tutorId: (tutorId as string) || user.id,
        thumbnailUrl: (thumbnailUrl as string) ?? null,
        durationHours: Number(durationHours) || 0,
        level: (level as string) || 'beginner',
        status: (status as string) || 'draft',
        isMandatory: Boolean(isMandatory),
        passPercentage: Number(passPercentage) || 70,
        maxAttempts: Number(maxAttempts) || 3,
        validDays: validDays ? Number(validDays) : null,
        createdBy: user.id,
        publishedAt: status === 'published' ? new Date() : null,
      },
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true } },
        tutor: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { enrollments: true, lessons: true } },
      },
    })

    await logActivity(user.id, 'create_course', 'course', course.id, { title: course.title }, getClientIp(req))

    return ok(course)
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('POST /api/courses error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'