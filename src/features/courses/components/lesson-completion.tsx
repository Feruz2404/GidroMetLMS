'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Award, CheckCircle2, ChevronLeft, ChevronRight, CircleCheck, ClipboardCheck, Eye, Loader2, Lock, Sparkles, Trophy } from 'lucide-react'
import { toast } from 'sonner'
import { ProgressBar } from '@/components/shared/progress-bar'
import { Button } from '@/components/ui/button'
import { useSession } from '@/features/auth/session'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { useErrorToast } from '@/lib/use-api-error'
import { cn } from '@/lib/utils'
import type { CourseDetailDto, LessonDetailDto, LessonProgressResultDto } from '@/shared/dto'
import { useCompleteLesson } from '../api'
import { EnrollButton } from './course-actions'
import { activeEnrollment, flattenLessons, pendingQuiz } from './lesson-meta'

const panelClass = 'flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between'

function CourseCompleted({ course, certificate }: { course: CourseDetailDto; certificate: LessonProgressResultDto['certificateIssued'] }) {
  const { t } = useI18n()
  const quiz = pendingQuiz(course)
  return (
    <section
      aria-live="polite"
      className="relative overflow-hidden rounded-2xl border border-success/30 bg-gradient-to-br from-success/12 via-card to-primary/10 px-6 py-9 text-center shadow-[var(--shadow-card)] sm:px-10"
    >
      <Sparkles className="absolute left-6 top-6 size-6 text-chart-3/70" aria-hidden="true" />
      <Sparkles className="absolute bottom-8 right-8 size-5 text-primary/50" aria-hidden="true" />
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15 text-success ring-8 ring-success/5">
        <Trophy className="size-8" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-semibold tracking-tight sm:text-2xl">{t('courses.complete.title')}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
        {certificate
          ? t('courses.complete.certificate', { number: certificate.certNumber })
          : quiz
            ? t('courses.complete.quiz')
            : t('courses.complete.done')}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {certificate ? (
          <Button asChild size="lg">
            <Link href={routes.certificate(certificate.id)}>
              <Award aria-hidden="true" />
              {t('courses.actions.certificate')}
            </Link>
          </Button>
        ) : (
          quiz && (
            <Button asChild size="lg">
              <Link href={routes.quiz(quiz.id)}>
                <ClipboardCheck aria-hidden="true" />
                {t('courses.actions.finalTest')}
              </Link>
            </Button>
          )
        )}
        <Button asChild size="lg" variant="outline">
          <Link href={routes.course(course.id)}>{t('courses.lesson.backToCourse')}</Link>
        </Button>
      </div>
    </section>
  )
}

interface LessonCompletionProps {
  course: CourseDetailDto
  lesson: LessonDetailDto
  watched: number
}

/** Footer of a lesson: mark-complete control, then the way forward. */
export function LessonCompletion({ course, lesson, watched }: LessonCompletionProps) {
  const { t, formatDuration } = useI18n()
  const { isLearner } = useSession()
  const complete = useCompleteLesson(course.id)
  const onError = useErrorToast()
  const [result, setResult] = useState<LessonProgressResultDto | null>(null)
  const nextHref = lesson.nextLessonId ? routes.lesson(course.id, lesson.nextLessonId) : routes.course(course.id)

  if (result && result.courseProgress >= 100) return <CourseCompleted course={course} certificate={result.certificateIssued} />

  if (!isLearner) {
    return (
      <div className={cn(panelClass, 'bg-muted/40 shadow-none')}>
        <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <Eye className="size-4 shrink-0" aria-hidden="true" />
          {t('courses.lesson.staffPreview')}
        </p>
      </div>
    )
  }

  if (!activeEnrollment(course)) {
    return (
      <div className={panelClass}>
        <p className="text-sm text-muted-foreground">{t('courses.lesson.enrollToTrack')}</p>
        <EnrollButton courseId={course.id} size="default" />
      </div>
    )
  }

  if (lesson.isCompleted || result?.isCompleted) {
    return (
      <div className={cn(panelClass, 'border-success/30 bg-success/5')}>
        <p className="flex items-center gap-2.5 font-medium">
          <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden="true" />
          {t('courses.lesson.completed')}
        </p>
        <Button asChild>
          <Link href={nextHref}>
            {lesson.nextLessonId ? t('courses.lesson.next') : t('courses.lesson.backToCourse')}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    )
  }

  const required = lesson.requiredWatchSec
  const ready = watched >= required
  const markComplete = () =>
    complete.mutate(
      { lessonId: lesson.id, watchTimeSec: required > 0 ? watched : undefined },
      {
        onSuccess: (progress) => {
          setResult(progress)
          if (progress.courseProgress < 100) toast.success(t('courses.lesson.completedToast', { progress: progress.courseProgress }))
        },
        onError,
      }
    )

  return (
    <div className={panelClass}>
      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-sm text-muted-foreground">
          {ready ? t('courses.lesson.completeHint') : t('courses.lesson.watchHint', { time: formatDuration(required - watched) })}
        </p>
        {required > 0 && (
          <div className="max-w-sm space-y-1">
            <ProgressBar value={(Math.min(watched, required) / required) * 100} size="sm" />
            <p className="text-xs tabular-nums text-muted-foreground">
              {t('courses.lesson.watched', { watched: formatDuration(Math.min(watched, required)), required: formatDuration(required) })}
            </p>
          </div>
        )}
      </div>
      <Button size="lg" disabled={!ready || complete.isPending} onClick={markComplete}>
        {complete.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <CircleCheck aria-hidden="true" />}
        {t('courses.lesson.markComplete')}
      </Button>
    </div>
  )
}

/** Previous / next lesson cards with titles taken from the course outline. */
export function LessonPager({ course, lesson }: { course: CourseDetailDto; lesson: LessonDetailDto }) {
  const { t } = useI18n()
  const lessons = flattenLessons(course)
  const find = (id: string | null) => (id ? lessons.find((item) => item.id === id) ?? null : null)
  const previous = find(lesson.previousLessonId)
  const next = find(lesson.nextLessonId)
  if (!previous && !next) return null

  const card = 'group flex min-w-0 flex-col gap-1 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] transition-colors hover:border-primary/40'
  return (
    <nav aria-label={t('courses.lesson.navigation')} className="grid gap-3 sm:grid-cols-2">
      {previous ? (
        <Link href={routes.lesson(course.id, previous.id)} className={card}>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            {t('courses.lesson.previous')}
          </span>
          <span className="line-clamp-2 text-sm font-medium group-hover:text-primary">{previous.title}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" aria-hidden="true" />
      )}
      {next && (
        <Link href={routes.lesson(course.id, next.id)} className={cn(card, 'sm:items-end sm:text-right')}>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            {next.isLocked && <Lock className="size-3" aria-hidden="true" />}
            {t('courses.lesson.next')}
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </span>
          <span className="line-clamp-2 text-sm font-medium group-hover:text-primary">{next.title}</span>
        </Link>
      )}
    </nav>
  )
}
