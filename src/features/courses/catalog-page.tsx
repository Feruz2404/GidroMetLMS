'use client'

import Link from 'next/link'
import { BookOpen, Plus } from 'lucide-react'
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
import { useUrlState } from '@/hooks/use-url-state'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { useCategories, useCourses, type CourseListParams } from './api'
import { CourseCard } from './components/course-card'

const PAGE_SIZE = 12

export function CourseCatalogPage() {
  const { t } = useI18n()
  const session = useSession()
  const [filters, setFilters] = useUrlState({ q: '', category: '', level: '', sort: 'newest', view: 'all', page: '1' })
  const categories = useCategories()
  const params: CourseListParams = {
    search: filters.q || undefined,
    categoryId: filters.category || undefined,
    level: filters.level || undefined,
    sort: filters.sort as CourseListParams['sort'],
    view: filters.view as CourseListParams['view'],
    page: Number(filters.page) || 1,
    limit: PAGE_SIZE,
  }
  const courses = useCourses(params)
  const filtered = Boolean(filters.q || filters.category || filters.level)

  const views = session.isLearner
    ? ([['all', 'courses.view.all'], ['enrolled', 'courses.view.enrolled'], ['completed', 'courses.view.completed']] as const)
    : session.canManageContent
      ? ([['all', 'courses.view.all'], ['managed', 'courses.view.managed']] as const)
      : null

  return (
    <div>
      <PageHeader
        title={t('courses.catalog.title')}
        description={t('courses.catalog.description')}
        actions={
          session.canManageContent && (
            <Button asChild>
              <Link href={routes.newCourse}>
                <Plus aria-hidden="true" />
                {t('courses.catalog.create')}
              </Link>
            </Button>
          )
        }
      />

      <div className="mb-6 space-y-4">
        {views && (
          <Tabs value={filters.view} onValueChange={(view) => setFilters({ view })}>
            <TabsList className="max-w-full justify-start overflow-x-auto scrollbar-thin">
              {views.map(([value, label]) => (
                <TabsTrigger key={value} value={value}>
                  {t(label)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchInput value={filters.q} onChange={(q) => setFilters({ q })} placeholder={t('courses.catalog.search')} className="lg:max-w-sm lg:flex-1" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
            <FilterSelect
              value={filters.category}
              onChange={(category) => setFilters({ category })}
              allLabel={t('courses.filter.allCategories')}
              ariaLabel={t('common.category')}
              options={(categories.data ?? []).filter((category) => category.courseCount > 0).map((category) => ({ value: category.id, label: `${category.name} (${category.courseCount})` }))}
              className="lg:w-60"
            />
            <FilterSelect
              value={filters.level}
              onChange={(level) => setFilters({ level })}
              allLabel={t('courses.filter.allLevels')}
              ariaLabel={t('courses.filter.level')}
              options={(['beginner', 'intermediate', 'advanced'] as const).map((level) => ({ value: level, label: t(`level.${level}`) }))}
            />
            <FilterSelect
              value={filters.sort}
              onChange={(sort) => setFilters({ sort })}
              ariaLabel={t('common.sortBy')}
              options={[
                { value: 'newest', label: t('common.sort.newest') },
                { value: 'popular', label: t('common.sort.popular') },
                { value: 'title', label: t('common.sort.title') },
              ]}
            />
          </div>
        </div>
      </div>

      {courses.isPending ? (
        <CardGridSkeleton />
      ) : courses.isError ? (
        <ErrorState error={courses.error} onRetry={() => courses.refetch()} />
      ) : courses.data.items.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={filtered ? t('state.noResults') : t('courses.catalog.empty')}
          description={filtered ? t('state.noResultsHint') : t('courses.catalog.emptyHint')}
          action={
            filtered && (
              <Button variant="outline" onClick={() => setFilters({ q: '', category: '', level: '' })}>
                {t('action.reset')}
              </Button>
            )
          }
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy={courses.isFetching}>
            {courses.data.items.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <PaginationBar meta={courses.data.meta} onPageChange={(page) => setFilters({ page })} />
        </>
      )}
    </div>
  )
}
