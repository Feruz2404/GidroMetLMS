'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { ProgressBar } from '@/components/shared/progress-bar'
import { StatusBadge } from '@/components/shared/status-badge'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import type { CourseReportRowDto } from '@/shared/dto'
import { useReport } from '../api'
import { CountCell, PercentCell, TwoLineCell } from './cells'
import { ReportTable, type ReportColumn } from './report-table'

const NUMERIC = 'text-right tabular-nums'

export function CoursesReport() {
  const { t, formatNumber } = useI18n()
  const query = useReport('courses')

  const columns: ReportColumn<CourseReportRowDto>[] = [
    {
      key: 'title',
      header: t('reports.col.course'),
      cell: (row) => (
        <TwoLineCell
          primary={
            <span className="flex items-center gap-2">
              <Link href={routes.course(row.id)} className="truncate hover:text-primary focus-visible:underline focus-visible:outline-none">
                {row.title}
              </Link>
              {row.status !== 'published' && <StatusBadge status={row.status} />}
            </span>
          }
          secondary={[row.category, row.tutor].filter(Boolean).join(' · ')}
        />
      ),
      sortValue: (row) => row.title,
    },
    { key: 'lessons', header: t('reports.col.lessons'), cell: (row) => <CountCell value={row.lessons} />, sortValue: (row) => row.lessons, className: NUMERIC, hideOnMobile: true },
    { key: 'enrolled', header: t('reports.col.enrolled'), cell: (row) => <CountCell value={row.enrolled} />, sortValue: (row) => row.enrolled, className: NUMERIC },
    {
      key: 'completionRate',
      header: t('reports.col.completionRate'),
      cell: (row) => <ProgressBar value={row.completionRate} showLabel className="min-w-28" />,
      sortValue: (row) => row.completionRate,
    },
    {
      key: 'progress',
      header: t('reports.col.averageProgress'),
      cell: (row) => <PercentCell value={row.averageProgress} />,
      sortValue: (row) => row.averageProgress,
      className: NUMERIC,
      hideOnMobile: true,
    },
    { key: 'score', header: t('reports.col.averageScore'), cell: (row) => <PercentCell value={row.averageScore} />, sortValue: (row) => row.averageScore, className: NUMERIC },
    {
      key: 'certificates',
      header: t('reports.col.certificates'),
      cell: (row) => <CountCell value={row.certificates} />,
      sortValue: (row) => row.certificates,
      className: NUMERIC,
      hideOnMobile: true,
    },
  ]

  return (
    <ReportTable
      type="courses"
      query={query}
      columns={columns}
      rowKey={(row) => row.id}
      searchText={(row) => [row.title, row.category, row.tutor].join(' ')}
      searchPlaceholder={t('reports.search.courses')}
      empty={{ icon: BookOpen, title: t('reports.empty.courses'), description: t('reports.empty.hint') }}
      summary={(rows) => {
        const sum = (pick: (row: CourseReportRowDto) => number) => formatNumber(rows.reduce((total, row) => total + pick(row), 0))
        return [
          { label: t('reports.summary.courses'), value: formatNumber(rows.length) },
          { label: t('reports.summary.enrollments'), value: sum((row) => row.enrolled) },
          { label: t('reports.summary.completed'), value: sum((row) => row.completed) },
          { label: t('reports.summary.certificates'), value: sum((row) => row.certificates) },
        ]
      }}
    />
  )
}
