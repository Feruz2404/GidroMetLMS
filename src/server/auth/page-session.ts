import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { hasPermission, type Permission } from '@/shared/roles'
import { findSessionUser, SESSION_COOKIE, type SessionUser } from './session'

/** The signed-in user for server components; memoised per request. */
export const getPageUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  return findSessionUser(token)
})

export async function requirePageUser(): Promise<SessionUser> {
  const user = await getPageUser()
  if (!user) redirect('/login')
  return user
}

/** Server-side page guard: users without any of the permissions go back to the dashboard. */
export async function requirePagePermission(...permissions: Permission[]): Promise<SessionUser> {
  const user = await requirePageUser()
  if (!permissions.some((permission) => hasPermission(user.role, permission))) redirect('/dashboard')
  return user
}

export async function requirePageRole(check: (role: string) => boolean): Promise<SessionUser> {
  const user = await requirePageUser()
  if (!check(user.role)) redirect('/dashboard')
  return user
}
