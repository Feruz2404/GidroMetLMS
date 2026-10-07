'use client'

import Link from 'next/link'
import { Eye, FileText, Globe, Layers, ShieldAlert, Users } from 'lucide-react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUrlState } from '@/hooks/use-url-state'
import { useI18n } from '@/i18n/provider'
import { ApiError } from '@/lib/api-client'
import { routes } from '@/lib/routes'
import { useCourse, useUpdateCourse } from './api'
import { CourseDetailsForm } from './components/editor/course-details-form'
import { CurriculumEditor } from './components/editor/curriculum-editor'
import { LearnersPanel } from './components/editor/learners-panel'
import { PublishingPanel } from './components/editor/publishing-panel'
import { flattenLessons } from './components/lesson-meta'
import { CourseNotFound } from './course-page'

const TABS = ['details', 'curriculum', 'publishing', 'learners'] as const
type Tab = (typeof TABS)[number]

function EditorSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-96 max-w-full" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-full max-w-lg" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  )
}

export function CourseEditorPage({ courseId }: { courseId: string }) {
  const { t, formatDate } = useI18n()
  const course = useCourse(courseId)
  const update = useUpdateCourse(courseId)
  const [state, setState] = useUrlState({ tab: 'details' })
  const tab: Tab = TABS.includes(state.tab as Tab) ? (state.tab as Tab) : 'details'

  if (course.isPending) return <EditorSkeleton />
  if (course.isError) {
    return course.error instanceof ApiError && course.error.status === 404 ? (
      <CourseNotFound />
    ) : (
      <ErrorState error={course.error} onRetry={() => course.refetch()} />
    )
  }

  const data = course.data
  if (!data.canManage) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title={t('courses.editor.forbidden')}
        description={t('errors.FORBIDDEN')}
        action={
          <Button asChild variant="outline">
            <Link href={routes.course(courseId)}>{t('courses.editor.backToCourse')}</Link>
          </Button>
        }
      />
    )
  }

  const lessonCount = flattenLessons(data).length
  const count = (value: number) => <span className="rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground">{value}</span>

  return (
    <div>
      <PageHeader
        back={{ href: routes.course(courseId), label: t('courses.editor.backToCourse') }}
        eyebrow={t('courses.editor.eyebrow')}
        title={data.title}
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <StatusBadge status={data.status} />
            <span>{t('common.lastUpdated', { date: formatDate(data.updatedAt) })}</span>
          </span>
        }
        actions={
          <Button asChild variant="outline">
            <Link href={routes.course(courseId)}>
              <Eye aria-hidden="true" />
              {t('courses.editor.viewCourse')}
            </Link>
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(next) => setState({ tab: next })} className="gap-6">
        <div className="-mx-4 overflow-x-auto px-4 scrollbar-thin sm:mx-0 sm:px-0">
          <TabsList className="h-10">
            <TabsTrigger value="details" className="flex-none px-3">
              <FileText aria-hidden="true" />
              {t('courses.editor.tab.details')}
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="flex-none px-3">
              <Layers aria-hidden="true" />
              {t('courses.tab.curriculum')}
              {count(lessonCount)}
            </TabsTrigger>
            <TabsTrigger value="publishing" className="flex-none px-3">
              <Globe aria-hidden="true" />
              {t('courses.editor.tab.publishing')}
            </TabsTrigger>
            <TabsTrigger value="learners" className="flex-none px-3">
              <Users aria-hidden="true" />
              {t('courses.actions.learners')}
              {count(data.enrollmentCount)}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details">
          <CourseDetailsForm
            key={data.updatedAt}
            course={data}
            submitLabel={t('action.saveChanges')}
            pending={update.isPending}
            onSubmit={async (input) => {
              await update.mutateAsync(input)
              toast.success(t('courses.editor.saved'))
            }}
          />
        </TabsContent>
        <TabsContent value="curriculum">
          <CurriculumEditor course={data} />
        </TabsContent>
        <TabsContent value="publishing">
          <PublishingPanel course={data} onGoToCurriculum={() => setState({ tab: 'curriculum' })} />
        </TabsContent>
        <TabsContent value="learners">
          <LearnersPanel course={data} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
