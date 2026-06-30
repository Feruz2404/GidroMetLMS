import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser, ok, err } from '@/lib/auth'

// GET /api/categories — list all categories (for filter dropdowns, course creation forms)
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) return err(401, 'Avtorizatsiya talab qilinadi')

    const categories = await db.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { courses: true } },
      },
    })

    return ok(categories)
  } catch (e) {
    if (e instanceof Error && (e.message === 'UNAUTHORIZED' || e.message === 'FORBIDDEN')) {
      return err(e.message === 'FORBIDDEN' ? 403 : 401, e.message === 'FORBIDDEN' ? 'Ruxsat yo\'q' : 'Avtorizatsiya talab qilinadi')
    }
    console.error('GET /api/categories error:', e)
    return err(500, 'Server xatosi')
  }
}

export const dynamic = 'force-dynamic'
