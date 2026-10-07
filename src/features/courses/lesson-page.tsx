'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, FileQuestion, FileText, ListTree, Lock } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { Markdown } from '@/components/shared/markdown'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/features/auth/session'
import { useI18n } from '@/i18n/provider'
import { ApiError } from '@/lib/api-client'
import { routes } from '@/lib/routes'
import type { CourseDetailDto, LessonDetailDto } from '@/shared/dto'
import { useCourse, useLesson } from './api'
import { EnrollButton } from './components/course-actions'
import { LessonCompletion, LessonPager } from './components/lesson-completion'
import { LessonDocument, LessonVideo, videoSource } from './components/lesson-media'
import { activeEnrollment, flattenLessons, formatMinutes, LESSON_TYPE_ICONS, sectionTitle } from './components/lesson-meta'
import { LessonOutline } from './components/lesson-outline'
import { useWatchTime } from './components/use-watch-time'
import { BackLink, CourseNotFound } from './course-page'

function LessonSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-9 w-3/4" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-80 rounded-xl" />
      <Skeleton className="h-20 rounded-xl" />
    </div>
  )
}

function LockedLesson({ course, lessonId }: { course: CourseDetailDto; lessonId: string }) {
  const { t } = useI18n()
  const { isLearner } = useSession()
  const outline = flattenLessons(course).find((lesson) => lesson.id === lessonId)
  return (
    <section className="rounded-2xl border bg-card px-6 py-12 text-center shadow-[var(--shadow-card)] sm:py-16">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Lock className="size-6" aria-hidden="true" />
      </span>
      {outline && <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{outline.title}</p>}
      <h1 className="mt-2 text-xl font-semibold tracking-tight">{t('courses.locked.title')}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{t('courses.locked.description')}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {isLearner && course.status === 'published' && <EnrollButton courseId={course.id} />}
        <Button asChild size="lg" variant="outline">
          <Link href={routes.course(course.id)}>{t('courses.locked.viewCourse')}</Link>
        </Button>
      </div>
    </section>
  )
}

function LessonView({ course, lesson }: { course: CourseDetailDto; lesson: LessonDetailDto }) {
  const { t } = useI18n()
  const { isLearner } = useSession()
  const [playing, setPlaying] = useState(false)
  const enrolled = isLearner && Boolean(activeEnrollment(course))
  const source = lesson.type === 'video' ? videoSource(lesson.videoUrl) : null
  // Embedded YouTube players expose no playback events under our CSP, so visible time on the page counts as viewing.
  const watched = useWatchTime({
    courseId: course.id,
    lessonId: lesson.id,
    initialSec: lesson.watchTimeSec,
    enabled: enrolled && source !== null && !lesson.isCompleted,
    active: source?.kind === 'youtube' || playing,
  })

  const lessons = flattenLessons(course)
  const position = lessons.findIndex((item) => item.id === lesson.id) + 1
  const section = course.sections.find((item) => item.lessons.some((outline) => outline.id === lesson.id))
  const TypeIcon = LESSON_TYPE_ICONS[lesson.type]

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {section && sectionTitle(t, section)}
          {section && position > 0 && ' · '}
          {position > 0 && t('courses.lesson.position', { current: position, total: lessons.length })}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-[1.9rem] sm:leading-tight">{lesson.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <TypeIcon className="size-4" aria-hidden="true" />
            {t(`courses.lessonType.${lesson.type}`)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {formatMinutes(t, lesson.durationMin)}
          </span>
          {lesson.isFree && !enrolled && <Badge variant="info">{t('courses.curriculum.preview')}</Badge>}
          {lesson.isCompleted && <StatusBadge status="completed" />}
        </div>
        {lesson.description && <p className="max-w-3xl text-[0.95rem] leading-relaxed text-muted-foreground">{lesson.description}</p>}
      </header>

      {lesson.type === 'video' && <LessonVideo source={source} title={lesson.title} onPlayingChange={setPlaying} />}
      {lesson.type === 'pdf' && <LessonDocument url={lesson.fileUrl} />}

      {lesson.content ? (
        <div className="rounded-xl border bg-card px-5 py-7 shadow-[var(--shadow-card)] sm:px-8 sm:py-9 lg:px-12">
          <Markdown className="mx-auto max-w-[68ch]">{lesson.content}</Markdown>
        </div>
      ) : (
        lesson.type === 'text' && <EmptyState icon={FileText} title={t('courses.lesson.noContent')} compact />
      )}

      <LessonCompletion course={course} lesson={lesson} watched={watched} />
      <LessonPager course={course} lesson={lesson} />
    </article>
  )
}

export function LessonPage({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const { t } = useI18n()
  const course = useCourse(courseId)
  const lesson = useLesson(lessonId)
  const [outlineOpen, setOutlineOpen] = useState(false)

  if (course.isPending) {
    return (
      <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Skeleton className="hidden h-[32rem] rounded-xl lg:block" />
        <LessonSkeleton />
      </div>
    )
  }
  if (course.isError) {
    return course.error instanceof ApiError && course.error.status === 404 ? (
      <CourseNotFound />
    ) : (
      <ErrorState error={course.error} onRetry={() => course.refetch()} />
    )
  }

  const data = course.data
  const error = lesson.error instanceof ApiError ? lesson.error : null
  const missing = error?.status === 404 || (lesson.data && lesson.data.courseId !== courseId)

  let body: React.ReactNode
  if (lesson.isPending) body = <LessonSkeleton />
  else if (error?.code === 'NOT_ENROLLED') body = <LockedLesson course={data} lessonId={lessonId} />
  else if (missing) {
    body = (
      <EmptyState
        icon={FileQuestion}
        title={t('courses.lesson.notFound')}
        action={
          <Button asChild variant="outline">
            <Link href={routes.course(courseId)}>{t('courses.lesson.backToCourse')}</Link>
          </Button>
        }
      />
    )
  } else if (lesson.isError) body = <ErrorState error={lesson.error} onRetry={() => lesson.refetch()} />
  else body = <LessonView key={lesson.data.id} course={data} lesson={lesson.data} />

  return (
    <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="sticky top-24 hidden max-h-[calc(100dvh-7.5rem)] flex-col overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)] lg:flex">
        <LessonOutline course={data} currentLessonId={lessonId} className="flex-1" />
      </aside>

      <div className="min-w-0 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 truncate">
            <BackLink href={routes.course(courseId)} label={t('courses.lesson.backToCourse')} />
          </div>
          <Sheet open={outlineOpen} onOpenChange={setOutlineOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <ListTree aria-hidden="true" />
                {t('courses.tab.curriculum')}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88vw] max-w-sm gap-0 p-0">
              <SheetTitle className="sr-only">{t('courses.tab.curriculum')}</SheetTitle>
              <SheetDescription className="sr-only">{data.title}</SheetDescription>
              <LessonOutline course={data} currentLessonId={lessonId} onNavigate={() => setOutlineOpen(false)} className="h-full" headerClassName="pr-12" />
            </SheetContent>
          </Sheet>
        </div>
        {body}
      </div>
    </div>
  )
}
