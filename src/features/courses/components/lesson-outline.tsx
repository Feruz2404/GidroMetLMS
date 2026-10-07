'use client'

import Link from 'next/link'
import { ProgressBar } from '@/components/shared/progress-bar'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { CourseDetailDto } from '@/shared/dto'
import { activeEnrollment, flattenLessons, formatMinutes, LessonStatusIcon, sectionTitle } from './lesson-meta'

interface LessonOutlineProps {
  course: CourseDetailDto
  currentLessonId: string
  onNavigate?: () => void
  className?: string
  headerClassName?: string
}

/** Course curriculum navigation shown beside the lesson (desktop) or in a sheet (mobile). */
export function LessonOutline({ course, currentLessonId, onNavigate, className, headerClassName }: LessonOutlineProps) {
  const { t } = useI18n()
  const enrollment = activeEnrollment(course)
  const total = flattenLessons(course).length

  return (
    <nav aria-label={t('courses.tab.curriculum')} className={cn('flex min-h-0 flex-col', className)}>
      <div className={cn('border-b px-4 py-4', headerClassName)}>
        <Link href={routes.course(course.id)} onClick={onNavigate} className="line-clamp-2 font-semibold leading-snug hover:text-primary">
          {course.title}
        </Link>
        {enrollment ? (
          <div className="mt-3 space-y-1.5">
            <ProgressBar value={enrollment.progress} showLabel size="sm" />
            <p className="text-xs text-muted-foreground">{t('courses.progress.lessons', { done: course.completedLessons, total })}</p>
          </div>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">{t('common.lessons', { count: total })}</p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
        {course.sections.map((section, index) => (
          <div key={section.id} className="mb-3 last:mb-0">
            <p className="px-2 pb-1.5 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {index + 1}. {sectionTitle(t, section)}
            </p>
            <ol className="space-y-0.5">
              {section.lessons.map((lesson) => {
                const current = lesson.id === currentLessonId
                const content = (
                  <>
                    <LessonStatusIcon lesson={lesson} className={cn('size-6', current && !lesson.isCompleted && 'bg-primary/15 text-primary')} />
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 leading-snug">{lesson.title}</span>
                      <span className={cn('mt-0.5 block text-xs', current ? 'text-primary/80' : 'text-muted-foreground')}>{formatMinutes(t, lesson.durationMin)}</span>
                    </span>
                  </>
                )
                const itemClass = cn(
                  'flex items-start gap-2.5 rounded-lg px-2 py-2 text-sm',
                  current ? 'bg-primary/10 font-medium text-primary' : 'text-foreground/90'
                )
                return (
                  <li key={lesson.id}>
                    {lesson.isLocked ? (
                      <span className={cn(itemClass, 'text-muted-foreground')} title={t('courses.curriculum.lockedHint')}>
                        {content}
                      </span>
                    ) : (
                      <Link
                        href={routes.lesson(course.id, lesson.id)}
                        onClick={onNavigate}
                        aria-current={current ? 'page' : undefined}
                        className={cn(itemClass, !current && 'transition-colors hover:bg-muted', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50')}
                      >
                        {content}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
      </div>
    </nav>
  )
}
