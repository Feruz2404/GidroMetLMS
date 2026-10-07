'use client'

import Link from 'next/link'
import { ArrowRight, Award, CalendarClock } from 'lucide-react'
import { ProgressBar } from '@/components/shared/progress-bar'
import { SectionCard } from '@/components/shared/section-card'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { CourseDetailDto } from '@/shared/dto'
import { activeEnrollment, flattenLessons, formatMinutes, pendingQuiz, totalMinutes } from './lesson-meta'

const LANGUAGE_KEYS = { uz: 'courses.language.uz', ru: 'courses.language.ru', en: 'courses.language.en' } as const

function isPast(date: string): boolean {
  return new Date(date).getTime() < Date.now()
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  )
}

export function CourseProgressCard({ course }: { course: CourseDetailDto }) {
  const { t, formatDate } = useI18n()
  const enrollment = activeEnrollment(course)
  if (!enrollment) return null
  const total = flattenLessons(course).length
  const quiz = pendingQuiz(course)
  const overdue = enrollment.deadlineAt && enrollment.status !== 'completed' && isPast(enrollment.deadlineAt)

  return (
    <SectionCard title={t('courses.progress.title')}>
      <div className="flex items-end justify-between gap-3">
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{Math.round(enrollment.progress)}%</span>
        <span className="pb-1 text-sm text-muted-foreground">{t('courses.progress.lessons', { done: course.completedLessons, total })}</span>
      </div>
      <ProgressBar value={enrollment.progress} className="mt-3" />

      <dl className="mt-3 divide-y">
        <Row label={t('courses.progress.started')}>{formatDate(enrollment.startedAt)}</Row>
        {enrollment.deadlineAt && (
          <Row label={t('courses.progress.deadline')}>
            <span className={cn('inline-flex items-center gap-1.5', overdue && 'text-destructive')}>
              <CalendarClock className="size-3.5" aria-hidden="true" />
              {formatDate(enrollment.deadlineAt)}
              {overdue && <span className="sr-only">({t('courses.progress.overdue')})</span>}
            </span>
          </Row>
        )}
        {enrollment.completedAt && <Row label={t('courses.progress.completed')}>{formatDate(enrollment.completedAt)}</Row>}
      </dl>

      {course.certificate ? (
        <Link
          href={routes.certificate(course.certificate.id)}
          className="group mt-4 flex items-center gap-3 rounded-lg border border-success/30 bg-success/8 p-3 transition-colors hover:bg-success/12"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
            <Award className="size-4.5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium">{t('courses.progress.certificate')}</span>
            <span className="block truncate font-mono text-xs text-muted-foreground">{course.certificate.certNumber}</span>
          </span>
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      ) : (
        enrollment.status === 'completed' &&
        course.certificateEnabled &&
        quiz && (
          <p className="mt-4 rounded-lg bg-info/8 p-3 text-sm leading-relaxed">
            {t('courses.progress.certificateHint')}{' '}
            <Link href={routes.quiz(quiz.id)} className="font-medium text-primary hover:underline">
              {t('courses.actions.finalTest')}
            </Link>
          </p>
        )
      )}
    </SectionCard>
  )
}

export function CourseFactsCard({ course }: { course: CourseDetailDto }) {
  const { t, formatDate } = useI18n()
  const lessons = flattenLessons(course)
  const language = LANGUAGE_KEYS[course.language as keyof typeof LANGUAGE_KEYS]

  return (
    <SectionCard title={t('courses.facts.title')} contentClassName="py-2">
      <dl className="divide-y">
        <Row label={t('courses.filter.level')}>{t(`level.${course.level}`)}</Row>
        <Row label={t('common.language')}>{language ? t(language) : course.language}</Row>
        <Row label={t('courses.facts.duration')}>{t('common.hours', { count: course.durationHours })}</Row>
        <Row label={t('courses.facts.lessons')}>
          {lessons.length} · {formatMinutes(t, totalMinutes(lessons))}
        </Row>
        <Row label={t('courses.facts.assessment')}>{course.quizzes.length > 0 ? t('common.yes') : t('common.no')}</Row>
        <Row label={t('courses.facts.certificate')}>
          {course.certificateEnabled
            ? course.validDays
              ? t('courses.facts.validDays', { count: course.validDays })
              : t('courses.facts.validForever')
            : t('common.no')}
        </Row>
        <Row label={t('courses.facts.updated')}>{formatDate(course.updatedAt)}</Row>
      </dl>
    </SectionCard>
  )
}
