'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Clock, PlayCircle } from 'lucide-react'
import { CourseCover } from '@/components/shared/category-icon'
import { ProgressBar } from '@/components/shared/progress-bar'
import { LevelBadge, StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import type { CourseCardDto } from '@/shared/dto'

export function CourseCard({ course, nextLessonId }: { course: CourseCardDto; nextLessonId?: string | null }) {
  const { t } = useI18n()
  const enrollment = course.enrollment && course.enrollment.status !== 'dropped' ? course.enrollment : null
  const href = routes.course(course.id)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <Link href={href} className="block focus-visible:outline-none" tabIndex={-1} aria-hidden="true">
        <CourseCover icon={course.category?.icon} seed={course.category?.slug ?? course.id} className="h-28 px-5 py-4">
          <div className="flex items-start justify-between gap-2">
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">{course.category?.name ?? t('nav.courses')}</span>
            {course.isMandatory && <span className="rounded-full bg-amber-400/95 px-2.5 py-1 text-xs font-semibold text-amber-950">{t('common.mandatory')}</span>}
          </div>
        </CourseCover>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={course.level} />
          {course.status !== 'published' && <StatusBadge status={course.status} />}
          {enrollment?.status === 'completed' && <StatusBadge status="completed" />}
        </div>
        <h3 className="line-clamp-2 text-[1.05rem] font-semibold leading-snug tracking-tight">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:underline group-hover:text-primary">
            {course.title}
          </Link>
        </h3>
        {course.shortSummary && <p className="line-clamp-2 text-sm text-muted-foreground">{course.shortSummary}</p>}

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            {t('common.hours', { count: course.durationHours })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="size-3.5" aria-hidden="true" />
            {t('common.lessons', { count: course.lessonCount })}
          </span>
          {course.tutor && (
            <span className="truncate">
              {course.tutor.lastName} {course.tutor.firstName[0]}.
            </span>
          )}
        </div>

        {enrollment ? (
          <div className="relative z-10 space-y-3 border-t pt-4">
            <ProgressBar value={enrollment.progress} showLabel />
            <Button asChild size="sm" variant={enrollment.status === 'completed' ? 'outline' : 'default'} className="w-full">
              <Link href={nextLessonId && enrollment.status !== 'completed' ? routes.lesson(course.id, nextLessonId) : href}>
                {enrollment.status === 'completed' ? t('courses.card.review') : enrollment.progress > 0 ? t('courses.card.continue') : t('courses.card.start')}
                {enrollment.status === 'completed' ? <ArrowRight aria-hidden="true" /> : <PlayCircle aria-hidden="true" />}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between border-t pt-4">
            <Badge variant="muted">{t('common.learners', { count: course.enrollmentCount })}</Badge>
            <Link href={href} className="relative z-10 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              {t('courses.card.details')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </article>
  )
}
