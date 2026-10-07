'use client'

import Link from 'next/link'
import { ArrowRight, BarChart3, CheckCircle2, ClipboardList, Users } from 'lucide-react'
import { DataTable, type Column } from '@/components/shared/data-table'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { StatCard } from '@/components/shared/stat-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { personName } from '@/lib/utils'
import { useQuizResults, type QuizResultRowDto } from '../api'
import { ScorePill } from './score-pill'

function summarize(rows: QuizResultRowDto[]) {
  const learners = new Set(rows.map((row) => row.learner.id)).size
  if (rows.length === 0) return { attempts: 0, learners, average: null, passRate: null }
  const average = Math.round(rows.reduce((total, row) => total + row.percentage, 0) / rows.length)
  const passRate = Math.round((rows.filter((row) => row.passed).length / rows.length) * 100)
  return { attempts: rows.length, learners, average, passRate }
}

/** Authors' view of every graded attempt with headline statistics. */
export function QuizResults({ quizId, passingScore }: { quizId: string; passingScore: number }) {
  const { t, formatDate, formatDuration } = useI18n()
  const results = useQuizResults(quizId)
  const stats = summarize(results.data ?? [])

  const columns: Column<QuizResultRowDto>[] = [
    {
      key: 'learner',
      header: t('quizzes.results.learner'),
      cell: (row) => (
        <div className="flex min-w-0 max-w-[11rem] items-center gap-3 sm:max-w-xs">
          <UserAvatar user={row.learner} className="size-8" />
          <div className="min-w-0">
            <p className="truncate font-medium">{personName(row.learner)}</p>
            {(row.learner.department || row.learner.position) && (
              <p className="truncate text-xs text-muted-foreground">{row.learner.department ?? row.learner.position}</p>
            )}
          </div>
        </div>
      ),
    },
    { key: 'result', header: t('common.result'), cell: (row) => <ScorePill percentage={row.percentage} passingScore={passingScore} /> },
    { key: 'status', header: t('common.status'), hideOnMobile: true, cell: (row) => <StatusBadge status={row.passed ? 'passed' : 'failed'} /> },
    {
      key: 'date',
      header: t('common.date'),
      hideOnMobile: true,
      cell: (row) => <span className="whitespace-nowrap tabular-nums">{formatDate(row.submittedAt, 'datetime')}</span>,
    },
    {
      key: 'duration',
      header: t('common.duration'),
      hideOnMobile: true,
      cell: (row) => <span className="tabular-nums">{formatDuration(row.timeSpentSec)}</span>,
    },
    {
      key: 'open',
      header: <span className="sr-only">{t('common.actions')}</span>,
      className: 'text-right',
      cell: (row) => (
        <Link href={routes.attempt(row.id)} className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-primary hover:underline">
          {t('quizzes.history.view')}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      ),
    },
  ]

  return (
    <section className="space-y-4" aria-labelledby="quiz-results-title">
      <h2 id="quiz-results-title" className="font-semibold tracking-tight">
        {t('quizzes.results.title')}
      </h2>
      {results.isError ? (
        <ErrorState error={results.error} onRetry={() => results.refetch()} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label={t('quizzes.results.attempts')} value={results.isPending ? '…' : stats.attempts} icon={ClipboardList} />
            <StatCard label={t('quizzes.results.learners')} value={results.isPending ? '…' : stats.learners} icon={Users} tone="cyan" />
            <StatCard label={t('quizzes.results.average')} value={stats.average === null ? '—' : `${stats.average}%`} icon={BarChart3} tone="violet" />
            <StatCard label={t('quizzes.results.passRate')} value={stats.passRate === null ? '—' : `${stats.passRate}%`} icon={CheckCircle2} tone="green" />
          </div>
          <DataTable
            columns={columns}
            rows={results.data}
            rowKey={(row) => row.id}
            loading={results.isPending}
            empty={<EmptyState compact icon={ClipboardList} title={t('quizzes.results.empty')} description={t('quizzes.results.emptyHint')} className="border-0 bg-transparent" />}
          />
        </>
      )}
    </section>
  )
}
