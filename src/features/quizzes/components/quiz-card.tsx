'use client'

import Link from 'next/link'
import { ArrowRight, ClipboardCheck, Clock, History, ListChecks, Pencil, PlayCircle, RotateCcw, Target } from 'lucide-react'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import type { QuizListItemDto } from '@/shared/dto'
import { ScoreRing, scoreTone } from './score-ring'

export function QuizCard({ quiz }: { quiz: QuizListItemDto }) {
  const { t, formatRelative } = useI18n()
  const href = routes.quiz(quiz.id)

  return (
    <article className="group relative flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ClipboardCheck className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate text-xs font-medium text-muted-foreground">{quiz.course?.title ?? t('quizzes.standalone')}</p>
          <h3 className="line-clamp-2 font-semibold leading-snug tracking-tight">
            <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:underline group-hover:text-primary">
              {quiz.title}
            </Link>
          </h3>
        </div>
        <QuizCardBadge quiz={quiz} />
      </div>

      {quiz.description && <p className="line-clamp-2 text-sm text-muted-foreground">{quiz.description}</p>}

      <ul className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <li className="inline-flex items-center gap-1.5">
          <ListChecks className="size-3.5" aria-hidden="true" />
          {t('common.questions', { count: quiz.questionCount })}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden="true" />
          {t('common.minutes', { count: quiz.timeLimitMin })}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Target className="size-3.5" aria-hidden="true" />
          {t('quizzes.passingShort', { value: quiz.passingScore })}
        </li>
      </ul>

      {quiz.my ? (
        <LearnerFooter quiz={quiz} my={quiz.my} />
      ) : (
        <div className="flex items-center justify-between gap-3 border-t pt-4">
          <div className="min-w-0 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">{t('quizzes.card.attemptCount', { count: quiz.attemptCount })}</p>
            <p className="flex items-center gap-1 truncate">
              <History className="size-3 shrink-0" aria-hidden="true" />
              <span className="sr-only">{t('quizzes.card.updated')}</span>
              {formatRelative(quiz.updatedAt)}
            </p>
          </div>
          {quiz.canManage ? (
            <Button asChild size="sm" variant="outline" className="relative z-10">
              <Link href={routes.quizEditor(quiz.id)}>
                <Pencil aria-hidden="true" />
                {t('action.edit')}
              </Link>
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              {t('quizzes.card.details')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          )}
        </div>
      )}
    </article>
  )
}

function QuizCardBadge({ quiz }: { quiz: QuizListItemDto }) {
  const { t } = useI18n()
  if (!quiz.my) return quiz.status !== 'published' ? <StatusBadge status={quiz.status} /> : null
  if (quiz.my.inProgressAttemptId) return <Badge variant="info">{t('quizzes.inProgress')}</Badge>
  if (quiz.my.passed) return <StatusBadge status="passed" />
  return null
}

function LearnerFooter({ quiz, my }: { quiz: QuizListItemDto; my: NonNullable<QuizListItemDto['my']> }) {
  const { t } = useI18n()
  const exhausted = !my.inProgressAttemptId && my.attemptsUsed >= quiz.maxAttempts
  const tone = scoreTone(my.bestPercentage, quiz.passingScore)

  return (
    <div className="flex items-center gap-3 border-t pt-4">
      <ScoreRing
        value={my.bestPercentage}
        tone={tone}
        size={48}
        label={my.bestPercentage === null ? t('quizzes.card.notAttempted') : t('quizzes.card.bestAria', { value: my.bestPercentage })}
      >
        <span className="text-xs font-semibold tabular-nums">{my.bestPercentage === null ? '—' : `${my.bestPercentage}%`}</span>
      </ScoreRing>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{my.bestPercentage === null ? t('quizzes.card.noResult') : t('quizzes.card.best')}</p>
        <p className="truncate text-xs text-muted-foreground">{t('quizzes.card.attempts', { used: my.attemptsUsed, max: quiz.maxAttempts })}</p>
      </div>
      {my.inProgressAttemptId ? (
        <Button asChild size="sm" className="relative z-10">
          <Link href={routes.attempt(my.inProgressAttemptId)}>
            <PlayCircle aria-hidden="true" />
            {t('quizzes.action.resume')}
          </Link>
        </Button>
      ) : my.passed || exhausted ? (
        <Button asChild size="sm" variant="outline" className="relative z-10">
          <Link href={routes.quiz(quiz.id)}>{t('quizzes.action.results')}</Link>
        </Button>
      ) : (
        <Button asChild size="sm" className="relative z-10">
          <Link href={routes.quiz(quiz.id)}>
            {my.attemptsUsed > 0 ? <RotateCcw aria-hidden="true" /> : <PlayCircle aria-hidden="true" />}
            {my.attemptsUsed > 0 ? t('quizzes.action.retry') : t('quizzes.card.start')}
          </Link>
        </Button>
      )}
    </div>
  )
}
