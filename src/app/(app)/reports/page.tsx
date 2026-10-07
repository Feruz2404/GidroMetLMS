import type { Metadata } from 'next'
import { ReportsPage } from '@/features/reports/reports-page'
import { requirePageRole } from '@/server/auth/page-session'
import { canViewReports } from '@/shared/roles'

export const metadata: Metadata = { title: 'Hisobotlar' }

export default async function Page() {
  await requirePageRole(canViewReports)
  return <ReportsPage />
}
