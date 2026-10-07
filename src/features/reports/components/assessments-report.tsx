'use client'

import Link from 'next/link'
import { ClipboardCheck } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import type { AssessmentReportRowDto } from '@/shared/dto'
import { useReport } from '../api'
import { TwoLineCell } from './cells'
import { ReportTable, type ReportColumn } from './report-table'

const NUMERIC = 'text-right tabular-nums'

export function AssessmentsReport() {
  const { t, formatNumber, formatDate, formatDuration } = useI18n()
  const query = useReport('assessments')

  const columns: ReportColumn<AssessmentReportRowDto>[] = [
    { key: 'learner', header: t('reports.col.learner'), cell: (row) => <TwoLineCell primary={row.learner} secondary={row.email} />, sortValue: (row) => row.learner },
    {
      key: 'quiz',
      header: t('reports.col.quiz'),
      cell: (row) => (
        <TwoLineCell
          primary={
            <Link href={routes.attempt(row.id)} className="hover:text-primary focus-visible:underline focus-visible:outline-none">
              {row.quiz}
            </Link>
          }
          secondary={row.course}
        />
      ),
      sortValue: (row) => row.quiz,
    },
    {
      key: 'score',
      header: t('common.score'),
      cell: (row) => `${formatNumber(row.score)} / ${formatNumber(row.maxScore)}`,
      sortValue: (row) => row.score,
      className: NUMERIC,
      hideOnMobile: true,
    },
    { key: 'percentage', header: t('common.result'), cell: (row) => <span className="font-semibold">{t('common.percent', { value: row.percentage })}</span>, sortValue: (row) => row.percentage, className: NUMERIC },
    {
      key: 'status',
      header: t('common.status'),
      cell: (row) => <StatusBadge status={row.passed ? 'passed' : 'failed'} />,
      sortValue: (row) => (row.passed ? 1 : 0),
    },
    {
      key: 'time',
      header: t('reports.col.timeSpent'),
      cell: (row) => formatDuration(row.timeSpentSec),
      sortValue: (row) => row.timeSpentSec,
      className: NUMERIC,
      hideOnMobile: true,
    },
    {
      key: 'submittedAt',
      header: t('reports.col.submittedAt'),
      cell: (row) => <span className="whitespace-nowrap">{formatDate(row.submittedAt, 'datetime')}</span>,
      sortValue: (row) => (row.submittedAt ? Date.parse(row.submittedAt) : null),
    },
  ]

  return (
    <ReportTable
      type="assessments"
      query={query}
      columns={columns}
      rowKey={(row) => row.id}
      searchText={(row) => [row.learner, row.email, row.quiz, row.course].join(' ')}
      searchPlaceholder={t('reports.search.assessments')}
      empty={{ icon: ClipboardCheck, title: t('reports.empty.assessments'), description: t('reports.empty.hint') }}
      summary={(rows) => {
        const passed = rows.filter((row) => row.passed).length
        const average = rows.length ? Math.round(rows.reduce((total, row) => total + row.percentage, 0) / rows.length) : 0
        return [
          { label: t('reports.summary.attempts'), value: formatNumber(rows.length) },
          { label: t('reports.summary.passed'), value: formatNumber(passed) },
          { label: t('reports.summary.failed'), value: formatNumber(rows.length - passed) },
          { label: t('reports.summary.averageScore'), value: t('common.percent', { value: average }) },
        ]
      }}
    />
  )
}
