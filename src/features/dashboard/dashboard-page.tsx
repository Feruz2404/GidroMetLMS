'use client'

import { ErrorState } from '@/components/shared/error-state'
import { useDashboard } from './api'
import { DashboardHeader } from './components/dashboard-header'
import { DashboardSkeleton } from './components/dashboard-skeleton'
import { InstructorDashboard } from './components/instructor-dashboard'
import { LearnerDashboard } from './components/learner-dashboard'
import { OrganizationDashboard } from './components/organization-dashboard'

export function DashboardPage() {
  const dashboard = useDashboard()
  const data = dashboard.data

  return (
    <div>
      <DashboardHeader department={data?.kind === 'organization' ? data.scope.department : null} />
      {dashboard.isPending ? (
        <DashboardSkeleton />
      ) : dashboard.isError ? (
        <ErrorState error={dashboard.error} onRetry={() => dashboard.refetch()} />
      ) : dashboard.data.kind === 'learner' ? (
        <LearnerDashboard data={dashboard.data} />
      ) : dashboard.data.kind === 'instructor' ? (
        <InstructorDashboard data={dashboard.data} />
      ) : (
        <OrganizationDashboard data={dashboard.data} />
      )}
    </div>
  )
}
