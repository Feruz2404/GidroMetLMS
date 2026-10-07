'use client'

import Link from 'next/link'
import { ArrowRight, Award, ClipboardCheck, Plus } from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { useSession } from '@/features/auth/session'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { CourseDetailDto, CourseQuizSummaryDto } from '@/shared/dto'

function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: 'success' | 'warning' }) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={cn('mt-0.5 font-semibold tabular-nums', tone === 'success' && 'text-success', tone === 'warning' && 'text-warning-foreground dark:text-warning')}>{value}</dd>
    </div>
  )
}

function QuizCard({ quiz, canManage, isLearner }: { quiz: CourseQuizSummaryDto; canManage: boolean; isLearner: boolean }) {
  const { t } = useI18n()
  const action = !isLearner
    ? t('action.open')
    : quiz.passed
      ? t('courses.assessment.viewResults')
      : quiz.attemptsUsed > 0
        ? t('courses.assessment.retake')
        : t('courses.assessment.start')
  const best = quiz.bestPercentage
  return (
    <article className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-chart-5/12 text-chart-5">
            <ClipboardCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold leading-snug">{quiz.title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t('common.questions', { count: quiz.questionCount })} · {t('common.minutes', { count: quiz.timeLimitMin })}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
          {quiz.status !== 'published' && <StatusBadge status={quiz.status} />}
          {isLearner && quiz.attemptsUsed > 0 && <StatusBadge status={quiz.passed ? 'passed' : 'failed'} />}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Stat label={t('courses.assessment.passingScore')} value={`${quiz.passingScore}%`} />
        <Stat label={t('courses.assessment.timeLimit')} value={t('common.minutesShort', { count: quiz.timeLimitMin })} />
        <Stat
          label={t('courses.assessment.attempts')}
          value={isLearner ? t('courses.assessment.attemptsValue', { used: quiz.attemptsUsed, max: quiz.maxAttempts }) : quiz.maxAttempts}
        />
        <Stat
          label={t('courses.assessment.best')}
          value={isLearner && best !== null ? `${Math.round(best)}%` : t('common.none')}
          tone={isLearner && best !== null ? (quiz.passed ? 'success' : 'warning') : undefined}
        />
      </dl>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {canManage && (
          <Button asChild variant="outline" size="sm">
            <Link href={routes.quizEditor(quiz.id)}>{t('action.edit')}</Link>
          </Button>
        )}
        <Button asChild size="sm" variant={quiz.passed || !isLearner ? 'outline' : 'default'}>
          <Link href={routes.quiz(quiz.id)}>
            {action}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </article>
  )
}

export function CourseAssessments({ course }: { course: CourseDetailDto }) {
  const { t } = useI18n()
  const { isLearner } = useSession()

  return (
    <div className="space-y-4">
      {course.certificateEnabled && (
        <p className="flex gap-2.5 rounded-lg border border-success/25 bg-success/5 px-4 py-3 text-sm leading-relaxed">
          <Award className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
          <span>{t('courses.assessment.certificateRule')}</span>
        </p>
      )}
      {course.quizzes.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title={t('courses.assessment.empty')}
          description={course.canManage ? t('courses.assessment.emptyManage') : t('courses.assessment.emptyHint')}
          action={
            course.canManage && (
              <Button asChild>
                <Link href={routes.newQuiz(course.id)}>
                  <Plus aria-hidden="true" />
                  {t('courses.assessment.create')}
                </Link>
              </Button>
            )
          }
        />
      ) : (
        <>
          {course.quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} canManage={course.canManage} isLearner={isLearner} />
          ))}
          {course.canManage && (
            <Button asChild variant="outline" size="sm">
              <Link href={routes.newQuiz(course.id)}>
                <Plus aria-hidden="true" />
                {t('courses.assessment.create')}
              </Link>
            </Button>
          )}
        </>
      )}
    </div>
  )
}
