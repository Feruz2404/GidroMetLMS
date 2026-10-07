'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { DashboardDto } from '@/shared/dto'

// Other features invalidate ['dashboard'] after mutations that move its numbers.
export const dashboardKeys = {
  all: ['dashboard'] as const,
}

export function useDashboard() {
  return useQuery({ queryKey: dashboardKeys.all, queryFn: () => api.get<DashboardDto>('/dashboard') })
}
