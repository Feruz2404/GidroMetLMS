'use client'

import Link from 'next/link'
import { ClipboardCheck, Plus } from 'lucide-react'
import { CardGridSkeleton } from '@/components/shared/page-loader'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { FilterSelect } from '@/components/shared/filter-select'
import { PageHeader } from '@/components/shared/page-header'
import { PaginationBar } from '@/components/shared/pagination-bar'
import { SearchInput } from '@/components/shared/search-input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSession } from '@/features/auth/session'
import { useCourses } from '@/features/courses/api'
import { useUrlState } from '@/hooks/use-url-state'
import type { MessageKey } from '@/i18n'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { PERMISSIONS } from '@/shared/roles'
import { useQuizzes, type QuizListParams } from './api'
import { QuizCard } from './components/quiz-card'

const PAGE_SIZE = 12

type View = NonNullable<QuizListParams['view']>

const EMPTY: Partial<Record<View, { title: MessageKey; hint: MessageKey }>> = {
  available: { title: 'quizzes.list.emptyAvailable', hint: 'quizzes.list.emptyAvailableHint' },
  passed: { title: 'quizzes.list.emptyPassed', hint: 'quizzes.list.emptyPassedHint' },
  managed: { title: 'quizzes.list.emptyManaged', hint: 'quizzes.list.emptyManagedHint' },
}

export function QuizListPage() {
  const { t } = useI18n()
  const session = useSession()
  const canAuthor = session.can(PERMISSIONS.ASSESSMENTS_MANAGE)
  const [filters, setFilters] = useUrlState({ q: '', view: 'all', status: '', course: '', page: '1' })
  const courses = useCourses({ view: session.isLearner ? 'enrolled' : canAuthor ? 'managed' : 'all', sort: 'title', limit: 100 })

  const params: QuizListParams = {
    search: filters.q || undefined,
    status: canAuthor ? filters.status || undefined : undefined,
    courseId: filters.course || undefined,
    view: filters.view as View,
    page: Number(filters.page) || 1,
    limit: PAGE_SIZE,
  }
  const quizzes = useQuizzes(params)
  const filtered = Boolean(filters.q || filters.status || filters.course)
  const empty = EMPTY[params.view ?? 'all']

  const views = session.isLearner
    ? ([['all', 'quizzes.view.all'], ['available', 'quizzes.view.available'], ['passed', 'quizzes.view.passed']] as const)
    : canAuthor
      ? ([['all', 'quizzes.view.all'], ['managed', 'quizzes.view.managed']] as const)
      : null

  return (
    <div>
      <PageHeader
        title={t('quizzes.list.title')}
        description={session.isLearner ? t('quizzes.list.descriptionLearner') : t('quizzes.list.description')}
        actions={
          canAuthor && (
            <Button asChild>
              <Link href={routes.newQuiz()}>
                <Plus aria-hidden="true" />
                {t('quizzes.list.create')}
              </Link>
            </Button>
          )
        }
      />

      <div className="mb-6 space-y-4">
        {views && (
          <Tabs value={filters.view} onValueChange={(view) => setFilters({ view })}>
            <TabsList>
              {views.map(([value, label]) => (
                <TabsTrigger key={value} value={value}>
                  {t(label)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchInput value={filters.q} onChange={(q) => setFilters({ q })} placeholder={t('quizzes.list.search')} className="lg:max-w-sm lg:flex-1" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">
            <FilterSelect
              value={filters.course}
              onChange={(course) => setFilters({ course })}
              allLabel={t('quizzes.filter.allCourses')}
              ariaLabel={t('quizzes.filter.course')}
              options={(courses.data?.items ?? []).map((course) => ({ value: course.id, label: course.title }))}
              className="lg:w-72"
            />
            {canAuthor && (
              <FilterSelect
                value={filters.status}
                onChange={(status) => setFilters({ status })}
                allLabel={t('quizzes.filter.allStatuses')}
                ariaLabel={t('common.status')}
                options={(['published', 'draft', 'archived'] as const).map((status) => ({ value: status, label: t(`status.${status}`) }))}
              />
            )}
          </div>
        </div>
      </div>

      {quizzes.isPending ? (
        <CardGridSkeleton className="h-64" />
      ) : quizzes.isError ? (
        <ErrorState error={quizzes.error} onRetry={() => quizzes.refetch()} />
      ) : quizzes.data.items.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title={filtered ? t('state.noResults') : t(empty?.title ?? 'quizzes.list.empty')}
          description={filtered ? t('state.noResultsHint') : t(empty?.hint ?? 'quizzes.list.emptyHint')}
          action={
            filtered ? (
              <Button variant="outline" onClick={() => setFilters({ q: '', status: '', course: '' })}>
                {t('action.reset')}
              </Button>
            ) : params.view === 'available' ? (
              <Button asChild variant="outline">
                <Link href={routes.courses}>{t('quizzes.list.browseCourses')}</Link>
              </Button>
            ) : (
              canAuthor && (
                <Button asChild>
                  <Link href={routes.newQuiz()}>
                    <Plus aria-hidden="true" />
                    {t('quizzes.list.create')}
                  </Link>
                </Button>
              )
            )
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy={quizzes.isFetching}>
            {quizzes.data.items.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
          <PaginationBar meta={quizzes.data.meta} onPageChange={(page) => setFilters({ page })} />
        </>
      )}
    </div>
  )
}
