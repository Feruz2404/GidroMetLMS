'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Award, CheckCircle2, GraduationCap, TrendingUp, UserPlus, Users } from 'lucide-react'
import { DataTable, type Column } from '@/components/shared/data-table'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { ProgressBar } from '@/components/shared/progress-bar'
import { SearchInput } from '@/components/shared/search-input'
import { StatCard } from '@/components/shared/stat-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { cn, personName } from '@/lib/utils'
import type { CourseDetailDto, CourseLearnerDto } from '@/shared/dto'
import { useCourseLearners } from '../../api'
import { AssignDialog } from './assign-dialog'

const STATUS_BADGE = { active: 'in_progress', completed: 'completed', dropped: 'dropped' } as const

function matches(learner: CourseLearnerDto, query: string): boolean {
  const haystack = [learner.user.firstName, learner.user.lastName, learner.user.email, learner.user.department ?? ''].join(' ').toLowerCase()
  return haystack.includes(query.toLowerCase())
}

export function LearnersPanel({ course }: { course: CourseDetailDto }) {
  const { t, formatDate } = useI18n()
  const learners = useCourseLearners(course.id)
  const [search, setSearch] = useState('')
  const [assignOpen, setAssignOpen] = useState(false)

  const rows = (learners.data ?? []).filter((learner) => !search || matches(learner, search))
  const all = learners.data ?? []
  const completed = all.filter((learner) => learner.status === 'completed').length
  const average = all.length ? Math.round(all.reduce((sum, learner) => sum + learner.progress, 0) / all.length) : 0
  const certificates = all.filter((learner) => learner.certificateId).length
  const passingScore = course.quizzes.find((quiz) => quiz.status === 'published')?.passingScore ?? course.passPercentage

  const columns: Column<CourseLearnerDto>[] = [
    {
      key: 'learner',
      header: t('courses.learners.learner'),
      cell: (row) => (
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar user={row.user} className="size-8" />
          <div className="min-w-0">
            <p className="truncate font-medium">{personName(row.user)}</p>
            <p className="truncate text-xs text-muted-foreground">{row.user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: t('common.department'),
      hideOnMobile: true,
      cell: (row) => (
        <span className="block max-w-56 truncate text-sm text-muted-foreground" title={row.user.department ?? undefined}>
          {row.user.department ?? t('common.none')}
        </span>
      ),
    },
    { key: 'status', header: t('common.status'), cell: (row) => <StatusBadge status={STATUS_BADGE[row.status]} /> },
    { key: 'progress', header: t('common.progress'), cell: (row) => <ProgressBar value={row.progress} showLabel size="sm" className="w-36" /> },
    {
      key: 'score',
      header: t('courses.learners.bestScore'),
      hideOnMobile: true,
      cell: (row) =>
        row.bestPercentage === null ? (
          <span className="text-muted-foreground">{t('common.none')}</span>
        ) : (
          <span className={cn('font-medium tabular-nums', row.bestPercentage >= passingScore ? 'text-success' : 'text-warning-foreground dark:text-warning')}>
            {Math.round(row.bestPercentage)}%
          </span>
        ),
    },
    { key: 'started', header: t('courses.progress.started'), hideOnMobile: true, cell: (row) => <span className="text-sm tabular-nums text-muted-foreground">{formatDate(row.startedAt, 'short')}</span> },
    {
      key: 'certificate',
      header: t('courses.learners.certificate'),
      hideOnMobile: true,
      cell: (row) =>
        row.certificateId ? (
          <Link href={routes.certificate(row.certificateId)} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            <Award className="size-4" aria-hidden="true" />
            {t('action.view')}
          </Link>
        ) : (
          <span className="text-muted-foreground">{t('common.none')}</span>
        ),
    },
  ]

  if (learners.isError) return <ErrorState error={learners.error} onRetry={() => learners.refetch()} />

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('courses.learners.enrolled')} value={learners.isPending ? '…' : all.length} icon={Users} />
        <StatCard label={t('courses.learners.completed')} value={learners.isPending ? '…' : completed} icon={CheckCircle2} tone="green" />
        <StatCard label={t('courses.learners.averageProgress')} value={learners.isPending ? '…' : `${average}%`} icon={TrendingUp} tone="cyan" />
        <StatCard label={t('courses.learners.certificates')} value={learners.isPending ? '…' : certificates} icon={Award} tone="amber" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder={t('courses.learners.search')} className="sm:max-w-xs sm:flex-1" />
        <Button onClick={() => setAssignOpen(true)}>
          <UserPlus aria-hidden="true" />
          {t('courses.actions.assign')}
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.enrollmentId}
        loading={learners.isPending}
        empty={
          <EmptyState
            compact
            icon={GraduationCap}
            title={search ? t('state.noResults') : t('courses.learners.empty')}
            description={search ? t('state.noResultsHint') : t('courses.learners.emptyHint')}
          />
        }
      />

      <AssignDialog course={course} open={assignOpen} onOpenChange={setAssignOpen} />
    </div>
  )
}
