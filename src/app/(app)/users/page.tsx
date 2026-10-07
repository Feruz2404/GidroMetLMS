import type { Metadata } from 'next'
import { UsersPage } from '@/features/users/users-page'
import { requirePagePermission } from '@/server/auth/page-session'
import { PERMISSIONS } from '@/shared/roles'

export const metadata: Metadata = { title: 'Foydalanuvchilar' }

export default async function Page() {
  await requirePagePermission(PERMISSIONS.USERS_MANAGE)
  return <UsersPage />
}
