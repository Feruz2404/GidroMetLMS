'use client'

import Link from 'next/link'
import { ArrowRight, History, PlayCircle } from 'lucide-react'
import { DataTable, type Column } from '@/components/shared/data-table'
import { EmptyState } from '@/components/shared/empty-state'
import { SectionCard } from '@/components/shared/section-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import type { AttemptSummaryDto } from '@/shared/dto'
import { ScorePill } from './score-pill'

/** The learner's own attempts at one assessment, newest first. */
export function AttemptHistory({ attempts, passingScore }: { attempts: AttemptSummaryDto[]; passingScore: number }) {
  const { t, formatDate, formatDuration } = useI18n()
  const total = attempts.length

  const columns: Column<AttemptSummaryDto>[] = [
    {
      key: 'number',
      header: '#',
      className: 'w-12',
      cell: (attempt) => <span className="font-medium tabular-nums text-muted-foreground">{total - attempts.indexOf(attempt)}</span>,
    },
    {
      key: 'date',
      header: t('common.date'),
      cell: (attempt) => <span className="whitespace-nowrap tabular-nums">{formatDate(attempt.submittedAt ?? attempt.startedAt, 'datetime')}</span>,
    },
    {
      key: 'score',
      header: t('common.score'),
      hideOnMobile: true,
      cell: (attempt) => (attempt.status === 'graded' ? <span className="tabular-nums">{`${attempt.score} / ${attempt.maxScore}`}</span> : '—'),
    },
    {
      key: 'result',
      header: t('common.result'),
      cell: (attempt) =>
        attempt.status === 'graded' ? <ScorePill percentage={attempt.percentage} passingScore={passingScore} /> : <StatusBadge status="in_progress" />,
    },
    {
      key: 'status',
      header: t('common.status'),
      hideOnMobile: true,
      cell: (attempt) => (attempt.status === 'graded' ? <StatusBadge status={attempt.passed ? 'passed' : 'failed'} /> : null),
    },
    {
      key: 'duration',
      header: t('common.duration'),
      hideOnMobile: true,
      cell: (attempt) => (attempt.status === 'graded' ? <span className="tabular-nums">{formatDuration(attempt.timeSpentSec)}</span> : '—'),
    },
    {
      key: 'open',
      header: <span className="sr-only">{t('common.actions')}</span>,
      className: 'text-right',
      cell: (attempt) => (
        <Link
          href={routes.attempt(attempt.id)}
          className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-primary hover:underline"
        >
          {attempt.status === 'graded' ? t('quizzes.history.view') : t('quizzes.action.resume')}
          {attempt.status === 'graded' ? <ArrowRight className="size-4" aria-hidden="true" /> : <PlayCircle className="size-4" aria-hidden="true" />}
        </Link>
      ),
    },
  ]

  if (total === 0) {
    return (
      <SectionCard title={t('quizzes.history.title')}>
        <EmptyState compact icon={History} title={t('quizzes.history.empty')} description={t('quizzes.history.emptyHint')} className="border-0 bg-transparent" />
      </SectionCard>
    )
  }

  return (
    <section className="space-y-3" aria-labelledby="attempt-history-title">
      <h2 id="attempt-history-title" className="font-semibold tracking-tight">
        {t('quizzes.history.title')}
      </h2>
      <DataTable columns={columns} rows={attempts} rowKey={(attempt) => attempt.id} />
    </section>
  )
}
