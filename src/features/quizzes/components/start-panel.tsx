'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, CircleAlert, Lock, PlayCircle, Trophy } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import type { MessageKey } from '@/i18n'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import type { QuizDetailDto } from '@/shared/dto'
import { ScoreRing, scoreTone } from './score-ring'
import { StartAttemptButton } from './start-attempt-button'

const BLOCKED: Record<NonNullable<QuizDetailDto['blockedReason']>, { title: MessageKey; hint: MessageKey }> = {
  NOT_ENROLLED: { title: 'quizzes.blocked.NOT_ENROLLED', hint: 'quizzes.blocked.NOT_ENROLLED.hint' },
  ATTEMPTS_EXHAUSTED: { title: 'quizzes.blocked.ATTEMPTS_EXHAUSTED', hint: 'quizzes.blocked.ATTEMPTS_EXHAUSTED.hint' },
  QUIZ_EMPTY: { title: 'quizzes.blocked.QUIZ_EMPTY', hint: 'quizzes.blocked.QUIZ_EMPTY.hint' },
  NOT_PUBLISHED: { title: 'quizzes.blocked.NOT_PUBLISHED', hint: 'quizzes.blocked.NOT_PUBLISHED.hint' },
}

/** Learner call-to-action: best result so far and the start/resume button, or why it is unavailable. */
export function StartPanel({ quiz }: { quiz: QuizDetailDto }) {
  const { t } = useI18n()
  const my = quiz.my
  const best = my?.bestPercentage ?? null
  const inProgress = my?.inProgressAttemptId ?? null
  const blocked = quiz.blockedReason

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]" aria-labelledby="start-panel-title">
      <div className="flex items-center gap-4 border-b bg-gradient-to-br from-primary/8 via-transparent to-transparent p-5">
        <ScoreRing
          value={best}
          tone={scoreTone(best, quiz.passingScore)}
          size={76}
          strokeWidth={7}
          label={best === null ? t('quizzes.card.notAttempted') : t('quizzes.card.bestAria', { value: best })}
        >
          {best === null ? (
            <Trophy className="size-6 text-muted-foreground" aria-hidden="true" />
          ) : (
            <span className="text-lg font-semibold tabular-nums">{best}%</span>
          )}
        </ScoreRing>
        <div className="min-w-0 space-y-1">
          <h2 id="start-panel-title" className="font-semibold tracking-tight">
            {best === null ? t('quizzes.start.title') : t('quizzes.card.best')}
          </h2>
          {my?.passed ? (
            <StatusBadge status="passed" />
          ) : (
            <p className="text-sm text-muted-foreground">{t('quizzes.start.goal', { value: quiz.passingScore })}</p>
          )}
        </div>
      </div>

      <div className="space-y-4 p-5">
        {inProgress ? (
          <>
            <p className="text-sm text-muted-foreground">{t('quizzes.start.inProgressHint')}</p>
            <Button asChild size="lg" className="w-full">
              <Link href={routes.attempt(inProgress)}>
                <PlayCircle aria-hidden="true" />
                {t('quizzes.action.resume')}
              </Link>
            </Button>
          </>
        ) : blocked ? (
          <div className="flex gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
            {blocked === 'NOT_ENROLLED' ? (
              <Lock className="mt-0.5 size-4 shrink-0 text-warning-foreground dark:text-warning" aria-hidden="true" />
            ) : (
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning-foreground dark:text-warning" aria-hidden="true" />
            )}
            <div className="space-y-1">
              <p className="font-medium">{t(BLOCKED[blocked].title)}</p>
              <p className="text-muted-foreground">{t(BLOCKED[blocked].hint, { course: quiz.course?.title ?? '', max: quiz.maxAttempts })}</p>
              {blocked === 'NOT_ENROLLED' && quiz.course && (
                <Button asChild size="sm" className="mt-2">
                  <Link href={routes.course(quiz.course.id)}>
                    <BookOpen aria-hidden="true" />
                    {t('quizzes.start.openCourse')}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <StartAttemptButton quiz={quiz} retry={Boolean(my && my.attemptsUsed > 0)} size="lg" className="w-full" />
            <p className="text-center text-xs text-muted-foreground">{t('quizzes.start.attemptsLeft', { count: quiz.attemptsRemaining ?? 0, max: quiz.maxAttempts })}</p>
          </>
        )}

        {quiz.course && blocked !== 'NOT_ENROLLED' && (
          <Link href={routes.course(quiz.course.id)} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors hover:bg-muted/60">
            <span className="flex min-w-0 items-center gap-2">
              <BookOpen className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="truncate">{quiz.course.title}</span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  )
}
