import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE = 'gidroedu_session'

/**
 * Fast path for signed-out visitors: pages that need a session redirect to the
 * sign-in page and remember where the user was going. Only the cookie's
 * presence is checked here; the (app) layout validates the session itself.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next()
  const { pathname, search } = request.nextUrl
  const login = request.nextUrl.clone()
  login.pathname = '/login'
  login.search = pathname === '/' ? '' : `?next=${encodeURIComponent(`${pathname}${search}`)}`
  return NextResponse.redirect(login)
}

export const config = {
  // Public routes, the API and static assets are excluded.
  matcher: ['/((?!api|_next/static|_next/image|login|register|verify|favicon.ico|logo.svg|robots.txt|.*\.(?:svg|png|jpg|jpeg|webp|ico)$).+)'],
}
