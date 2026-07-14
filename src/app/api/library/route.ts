import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err, logActivity, getClientIp } from '@/lib/auth'
import { hasPermission, PERMISSIONS } from '@/server/auth/permissions'

// GET /api/library — paginated list with filters
// Query: search (title/author/description/tags), type, category, year, language,
//        page (1), limit (12), sort (newest|popular|title|downloads),
//        bookmarks=true (filter to current user's bookmarks)
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')?.trim() ?? ''
    const type = searchParams.get('type')?.trim() ?? ''
    const category = searchParams.get('category')?.trim() ?? ''
    const year = searchParams.get('year')?.trim() ?? ''
    const language = searchParams.get('language')?.trim() ?? ''
    const bookmarksOnly = searchParams.get('bookmarks') === 'true'
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
    const limit = Math.min(60, Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10) || 12))
    const sort = searchParams.get('sort') ?? 'newest'

    // Base filter: only active resources
     
    const where: any = { status: 'active' }

    if (type) where.type = type
    if (category) where.category = category
    if (language) where.language = language
    if (year) {
      const y = Number(year)
      if (!Number.isNaN(y)) where.year = y
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ]
    }

    // Bookmarks filter: limit to user's bookmarked resources
    if (bookmarksOnly) {
      where.bookmarks = { some: { userId: user.id } }
    }

    // Sorting
     
    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'title') orderBy = { title: 'asc' }
    else if (sort === 'popular') orderBy = { viewCount: 'desc' }
    else if (sort === 'downloads') orderBy = { downloadCount: 'desc' }

    const [total, resources] = await Promise.all([
      db.libraryResource.count({ where }),
      db.libraryResource.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          bookmarks: {
            where: { userId: user.id },
            select: { id: true },
          },
        },
      }),
    ])

    // Flatten bookmark flag for current user
    const data = resources.map((r) => {
      const { bookmarks, ...rest } = r as typeof r & {
        bookmarks?: Array<{ id: string }>
      }
      return {
        ...rest,
        bookmarked: (bookmarks?.length ?? 0) > 0,
      }
    })

    return ok(data, {
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
      limit,
    })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('GET /api/library error:', e)
    return err(500, 'Server xatosi')
  }
}

// POST /api/library — tutor/admin upload a new resource (creates DB record;
// actual file storage is a URL placeholder for this demo)
// Body: { title, description?, type?, category?, author?, publisher?, year?, language?,
//        pages?, fileUrl?, fileSize?, fileType?, coverUrl?, tags?, status? }
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')
    if (!hasPermission(user.role, PERMISSIONS.LIBRARY_MANAGE)) return err(403, 'Ruxsat yo\'q')

    const body = await req.json()
    const {
      title,
      description,
      type,
      category,
      author,
      publisher,
      year,
      language,
      pages,
      fileUrl,
      fileSize,
      fileType,
      coverUrl,
      tags,
      status,
    } = body as Record<string, unknown>

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return err(400, 'Sarlavha kamida 3 ta belgidan iborat bo\'lishi kerak')
    }

    const validTypes = ['book', 'article', 'video', 'audio', 'document', 'manual', 'presentation', 'normative']
    const finalType = validTypes.includes(type as string) ? (type as string) : 'book'

    const resource = await db.libraryResource.create({
      data: {
        title: (title as string).trim(),
        description: (description as string) ?? null,
        type: finalType,
        category: (category as string) || null,
        author: (author as string) || null,
        publisher: (publisher as string) || null,
        year: year ? Number(year) : null,
        language: (language as string) || 'uz',
        pages: pages ? Number(pages) : null,
        fileUrl: (fileUrl as string) ?? null,
        fileSize: Number(fileSize) || 0,
        fileType: (fileType as string) ?? null,
        coverUrl: (coverUrl as string) ?? null,
        tags: (tags as string) ?? null,
        status: (status as string) === 'archived' ? 'archived' : 'active',
        uploadedBy: user.id,
      },
      include: {
        bookmarks: { where: { userId: user.id }, select: { id: true } },
      },
    })

    const { bookmarks, ...rest } = resource as typeof resource & {
      bookmarks?: Array<{ id: string }>
    }

    await logActivity(
      user.id,
      'create_resource',
      'library_resource',
      resource.id,
      { title: resource.title },
      getClientIp(req)
    )

    return ok({ ...rest, bookmarked: (bookmarks?.length ?? 0) > 0 })
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('POST /api/library error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
