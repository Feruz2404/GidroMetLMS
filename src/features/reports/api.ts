'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type {
  AssessmentReportRowDto,
  AuditReportRowDto,
  CertificateReportRowDto,
  CourseReportRowDto,
  LearnerReportRowDto,
  LibraryReportRowDto,
  ReportOverviewDto,
  ReportType,
} from '@/shared/dto'

export interface ReportData {
  overview: ReportOverviewDto
  learners: LearnerReportRowDto[]
  courses: CourseReportRowDto[]
  assessments: AssessmentReportRowDto[]
  certificates: CertificateReportRowDto[]
  library: LibraryReportRowDto[]
  audit: AuditReportRowDto[]
}

export type TabularReportType = Exclude<ReportType, 'overview'>

export const reportKeys = {
  all: ['reports'] as const,
  detail: (type: ReportType) => ['reports', type] as const,
}

export function useReport<K extends ReportType>(type: K) {
  return useQuery({
    queryKey: reportKeys.detail(type),
    queryFn: () => api.get<ReportData[K]>('/reports', { type }),
    staleTime: 60_000,
  })
}
