'use client'

import { Users } from 'lucide-react'
import { ProgressBar } from '@/components/shared/progress-bar'
import { useI18n } from '@/i18n/provider'
import type { LearnerReportRowDto } from '@/shared/dto'
import { useReport } from '../api'
import { CountCell, PercentCell, Ratio, TwoLineCell } from './cells'
import { ReportTable, type ReportColumn } from './report-table'

const NUMERIC = 'text-right tabular-nums'

export function LearnersReport() {
  const { t, formatNumber, formatRelative, formatDate } = useI18n()
  const query = useReport('learners')

  const columns: ReportColumn<LearnerReportRowDto>[] = [
    {
      key: 'name',
      header: t('reports.col.learner'),
      cell: (row) => (
        <TwoLineCell
          primary={<span title={row.email}>{row.name}</span>}
          secondary={row.department ?? t('reports.noDepartment')}
        />
      ),
      sortValue: (row) => row.name,
    },
    {
      key: 'courses',
      header: t('reports.col.completed'),
      cell: (row) => <Ratio part={row.completed} total={row.enrolled} label={t('reports.coursesRatio', { part: row.completed, total: row.enrolled })} />,
      // Completed first, then enrolled, so "3 / 3" ranks above "3 / 5".
      sortValue: (row) => row.completed * 1000 - row.enrolled,
      className: NUMERIC,
    },
    {
      key: 'progress',
      header: t('common.progress'),
      cell: (row) => <ProgressBar value={row.averageProgress} showLabel className="min-w-28" />,
      sortValue: (row) => row.averageProgress,
    },
    {
      key: 'tests',
      header: t('reports.col.testsPassed'),
      cell: (row) => <Ratio part={row.passed} total={row.attempts} label={t('reports.testsRatio', { part: row.passed, total: row.attempts })} />,
      sortValue: (row) => row.passed * 1000 - row.attempts,
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
    {
      key: 'lastLogin',
      header: t('reports.col.lastLogin'),
      cell: (row) =>
        row.lastLoginAt ? (
          <span className="whitespace-nowrap" title={formatDate(row.lastLoginAt, 'datetime')}>
            {formatRelative(row.lastLoginAt)}
          </span>
        ) : (
          <span className="text-muted-foreground">{t('reports.neverSignedIn')}</span>
        ),
      sortValue: (row) => (row.lastLoginAt ? Date.parse(row.lastLoginAt) : null),
      hideOnMobile: true,
    },
  ]

  return (
    <ReportTable
      type="learners"
      query={query}
      columns={columns}
      rowKey={(row) => row.id}
      searchText={(row) => [row.name, row.email, row.department, row.position].join(' ')}
      searchPlaceholder={t('reports.search.learners')}
      empty={{ icon: Users, title: t('reports.empty.learners'), description: t('reports.empty.hint') }}
      summary={(rows) => {
        const active = rows.filter((row) => row.enrolled > 0)
        const progress = active.length ? Math.round(active.reduce((total, row) => total + row.averageProgress, 0) / active.length) : 0
        return [
          { label: t('reports.summary.learners'), value: formatNumber(rows.length) },
          { label: t('reports.summary.enrolledLearners'), value: formatNumber(active.length) },
          { label: t('reports.summary.averageProgress'), value: t('common.percent', { value: progress }) },
          { label: t('reports.summary.certificates'), value: formatNumber(rows.reduce((total, row) => total + row.certificates, 0)) },
        ]
      }}
    />
  )
}
