'use client'

import { CheckCircle2, FileDown, FileText, Lock, PlayCircle, type LucideIcon } from 'lucide-react'
import type { Translate } from '@/i18n/provider'
import { cn } from '@/lib/utils'
import type { CourseDetailDto, LessonOutlineDto, LessonType } from '@/shared/dto'

export const LESSON_TYPES: readonly LessonType[] = ['text', 'video', 'pdf']

export const LESSON_TYPE_ICONS: Record<LessonType, LucideIcon> = {
  text: FileText,
  video: PlayCircle,
  pdf: FileDown,
}

/** "45 min" below an hour, "1 h 30 min" above. */
export function formatMinutes(t: Translate, minutes: number): string {
  if (minutes < 60) return t('common.minutesShort', { count: minutes })
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? t('courses.duration.hoursMinutes', { hours, minutes: rest }) : t('common.hours', { count: hours })
}

export function totalMinutes(lessons: Array<{ durationMin: number }>): number {
  return lessons.reduce((sum, lesson) => sum + lesson.durationMin, 0)
}

/** The learner's live enrollment; a dropped enrollment counts as none. */
export function activeEnrollment(course: Pick<CourseDetailDto, 'enrollment'>) {
  return course.enrollment && course.enrollment.status !== 'dropped' ? course.enrollment : null
}

/** Section titles are optional for the catch-all bucket of lessons without a section. */
export function sectionTitle(t: Translate, section: { id: string; title: string }): string {
  return section.id === 'unsectioned' ? t('courses.curriculum.otherLessons') : section.title
}

/** The first published course test the learner has not passed yet. */
export function pendingQuiz(course: Pick<CourseDetailDto, 'quizzes'>) {
  return course.quizzes.find((quiz) => quiz.status === 'published' && !quiz.passed) ?? null
}

export function flattenLessons(course: Pick<CourseDetailDto, 'sections'>): LessonOutlineDto[] {
  return course.sections.flatMap((section) => section.lessons)
}

/** Completed tick, lock, or the lesson-type icon, in a small round badge. */
export function LessonStatusIcon({ lesson, className }: { lesson: Pick<LessonOutlineDto, 'type' | 'isCompleted' | 'isLocked'>; className?: string }) {
  if (lesson.isCompleted) {
    return (
      <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-full bg-success/12 text-success', className)}>
        <CheckCircle2 className="size-4" aria-hidden="true" />
      </span>
    )
  }
  const Icon = lesson.isLocked ? Lock : LESSON_TYPE_ICONS[lesson.type]
  return (
    <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground', className)}>
      <Icon className="size-3.5" aria-hidden="true" />
    </span>
  )
}
