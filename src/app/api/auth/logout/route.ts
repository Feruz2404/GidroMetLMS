import { NextRequest } from 'next/server'
import { handleApiError, logoutRequest } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    return await logoutRequest(req)
  } catch (e) {
    return handleApiError('auth.logout', e)
  }
}

export async function DELETE(req: NextRequest) {
  return POST(req)
}

export const dynamic = 'force-dynamic'
