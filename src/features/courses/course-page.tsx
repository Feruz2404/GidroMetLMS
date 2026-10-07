'use client'

import Link from 'next/link'
import { BookX, ChevronLeft } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUrlState } from '@/hooks/use-url-state'
import { useI18n } from '@/i18n/provider'
import { ApiError } from '@/lib/api-client'
import { routes } from '@/lib/routes'
import { useCourse } from './api'
import { CourseAssessments } from './components/course-assessments'
import { CourseFactsCard, CourseProgressCard } from './components/course-aside'
import { CourseCurriculum } from './components/course-curriculum'
import { CourseHero } from './components/course-hero'
import { CourseOverview } from './components/course-overview'
import { activeEnrollment } from './components/lesson-meta'

const TABS = ['overview', 'curriculum', 'assessment'] as const
type Tab = (typeof TABS)[number]

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
      <ChevronLeft className="size-4" aria-hidden="true" />
      {label}
    </Link>
  )
}

function CoursePageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-80 rounded-2xl" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  )
}

export function CourseNotFound() {
  const { t } = useI18n()
  return (
    <EmptyState
      icon={BookX}
      title={t('courses.detail.notFound')}
      description={t('courses.detail.notFoundHint')}
      action={
        <Button asChild variant="outline">
          <Link href={routes.courses}>{t('courses.detail.backToCatalog')}</Link>
        </Button>
      }
    />
  )
}

export function CoursePage({ courseId }: { courseId: string }) {
  const { t } = useI18n()
  const course = useCourse(courseId)
  const [state, setState] = useUrlState({ tab: 'overview' })
  const tab: Tab = TABS.includes(state.tab as Tab) ? (state.tab as Tab) : 'overview'

  if (course.isPending) return <CoursePageSkeleton />
  if (course.isError) {
    return course.error instanceof ApiError && course.error.status === 404 ? (
      <CourseNotFound />
    ) : (
      <ErrorState error={course.error} onRetry={() => course.refetch()} />
    )
  }

  const data = course.data
  const enrolled = Boolean(activeEnrollment(data))
  return (
    <div className="space-y-6">
      <BackLink href={routes.courses} label={t('courses.detail.backToCatalog')} />
      <CourseHero course={data} />

      {/* Small screens: progress, tabs, facts. Desktop: tabs on the left, progress and facts in the side column. */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:grid-rows-[auto_1fr]">
        {enrolled && (
          <div className="lg:col-start-2 lg:row-start-1">
            <CourseProgressCard course={data} />
          </div>
        )}

        <Tabs value={tab} onValueChange={(next) => setState({ tab: next })} className="min-w-0 gap-5 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <TabsList className="h-10 w-full sm:w-fit">
            <TabsTrigger value="overview" className="px-3">
              {t('courses.tab.overview')}
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="px-3">
              {t('courses.tab.curriculum')}
            </TabsTrigger>
            <TabsTrigger value="assessment" className="px-3">
              {t('courses.tab.assessment')}
              {data.quizzes.length > 0 && <span className="rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground">{data.quizzes.length}</span>}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <CourseOverview course={data} />
          </TabsContent>
          <TabsContent value="curriculum">
            <CourseCurriculum course={data} />
          </TabsContent>
          <TabsContent value="assessment">
            <CourseAssessments course={data} />
          </TabsContent>
        </Tabs>

        <div className={enrolled ? 'lg:col-start-2 lg:row-start-2' : 'lg:col-start-2 lg:row-span-2 lg:row-start-1'}>
          <CourseFactsCard course={data} />
        </div>
      </div>
    </div>
  )
}
