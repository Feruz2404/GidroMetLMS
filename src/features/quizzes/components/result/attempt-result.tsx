'use client'

import Link from 'next/link'
import { ArrowRight, Award, BookOpen, CheckCircle2, ChevronLeft, Clock, EyeOff, ListChecks, PartyPopper, PlayCircle, Target } from 'lucide-react'
import { StatCard } from '@/components/shared/stat-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import { useSession } from '@/features/auth/session'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { cn, personName } from '@/lib/utils'
import type { AttemptResultDto } from '@/shared/dto'
import { useQuiz } from '../../api'
import { ScoreRing, scoreTone } from '../score-ring'
import { StartAttemptButton } from '../start-attempt-button'
import { AnswerReview } from './answer-review'

/** Retake/resume for the learner who owns the result, based on the assessment's current state. */
function RetakeAction({ quizId, passed }: { quizId: string; passed: boolean }) {
  const { t } = useI18n()
  const quiz = useQuiz(quizId)
  if (!quiz.data) return null
  const inProgress = quiz.data.my?.inProgressAttemptId
  if (inProgress) {
    return (
      <Button asChild>
        <Link href={routes.attempt(inProgress)}>
          <PlayCircle aria-hidden="true" />
          {t('quizzes.action.resume')}
        </Link>
      </Button>
    )
  }
  if (quiz.data.blockedReason || !quiz.data.attemptsRemaining) return null
  return <StartAttemptButton quiz={quiz.data} retry variant={passed ? 'outline' : 'default'} />
}

function ResultHero({ result, isOwner }: { result: AttemptResultDto; isOwner: boolean }) {
  const { t } = useI18n()
  const gap = Math.max(0, result.quiz.passingScore - result.percentage)

  return (
    <section className="relative overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-card)]" aria-labelledby="result-title">
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent',
          result.passed ? 'from-success/15 via-success/[0.04]' : 'from-warning/15 via-warning/[0.04]'
        )}
        aria-hidden="true"
      />
      {result.passed && <PartyPopper className="pointer-events-none absolute -right-6 -top-6 size-40 text-success/10" aria-hidden="true" />}
      <div className="relative flex flex-col items-center gap-6 p-6 text-center animate-in fade-in zoom-in-95 duration-500 sm:flex-row sm:items-center sm:gap-8 sm:p-8 sm:text-left">
        <ScoreRing
          value={result.percentage}
          tone={scoreTone(result.percentage, result.quiz.passingScore)}
          size={148}
          strokeWidth={12}
          animate
          label={t('quizzes.result.scoreAria', { value: result.percentage })}
        >
          <span className="text-[2rem] font-bold leading-none tracking-tight tabular-nums">{result.percentage}%</span>
          <span className="mt-1 text-xs font-medium text-muted-foreground">{t('quizzes.result.yourScore')}</span>
        </ScoreRing>
        <div className="min-w-0 flex-1 space-y-3">
          <StatusBadge status={result.passed ? 'passed' : 'failed'} />
          <h1 id="result-title" className="text-2xl font-semibold tracking-tight text-balance sm:text-[1.7rem]">
            {result.passed ? (isOwner ? t('quizzes.result.passedTitle') : t('quizzes.result.passedTitleReviewer')) : t('quizzes.result.failedTitle')}
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-[0.95rem]">
            {result.passed
              ? t('quizzes.result.passedHint', { value: result.percentage, passing: result.quiz.passingScore })
              : t('quizzes.result.failedHint', { value: result.percentage, passing: result.quiz.passingScore, gap })}
          </p>
          <p className="text-sm font-medium">
            {result.quiz.title}
            {result.quiz.course && <span className="font-normal text-muted-foreground"> · {result.quiz.course.title}</span>}
          </p>
        </div>
      </div>
    </section>
  )
}

export function AttemptResult({ result }: { result: AttemptResultDto }) {
  const { t, formatDate, formatDuration } = useI18n()
  const { user } = useSession()
  const isOwner = result.learner.id === user.id
  const correct = result.questions.filter((question) => question.isCorrect).length

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href={routes.quiz(result.quiz.id)}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        {t('quizzes.result.backToQuiz')}
      </Link>

      {!isOwner && (
        <div className="flex items-center gap-3 rounded-xl border bg-card px-5 py-4 shadow-[var(--shadow-card)]">
          <UserAvatar user={result.learner} className="size-10" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{personName(result.learner, true)}</p>
            <p className="truncate text-sm text-muted-foreground">
              {[result.learner.position, result.learner.department].filter(Boolean).join(' · ') || t('quizzes.result.learner')}
            </p>
          </div>
          <p className="hidden text-right text-sm text-muted-foreground sm:block">
            {t('quizzes.result.submittedAt')}
            <span className="block font-medium tabular-nums text-foreground">{formatDate(result.submittedAt, 'datetime')}</span>
          </p>
        </div>
      )}

      <ResultHero result={result} isOwner={isOwner} />

      {result.certificate && (
        <div className="flex flex-col gap-4 rounded-xl border border-success/30 bg-gradient-to-r from-success/10 via-success/[0.03] to-transparent p-5 sm:flex-row sm:items-center">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
            <Award className="size-6" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{t('quizzes.result.certificateTitle')}</p>
            <p className="text-sm text-muted-foreground">{t('quizzes.result.certificateHint', { number: result.certificate.certNumber })}</p>
          </div>
          <Button asChild>
            <Link href={routes.certificate(result.certificate.id)}>
              {t('quizzes.result.viewCertificate')}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('quizzes.result.points')} value={`${result.score} / ${result.maxScore}`} icon={Target} />
        <StatCard
          label={t('quizzes.result.correctAnswers')}
          value={`${correct} / ${result.questions.length}`}
          icon={CheckCircle2}
          tone="green"
        />
        <StatCard label={t('quizzes.result.timeSpent')} value={formatDuration(result.timeSpentSec)} icon={Clock} tone="cyan" />
        <StatCard label={t('quizzes.rules.passingScore')} value={`${result.quiz.passingScore}%`} icon={ListChecks} tone="violet" />
      </div>

      {isOwner && (
        <div className="flex flex-wrap gap-2">
          <RetakeAction quizId={result.quiz.id} passed={result.passed} />
          {result.quiz.course && (
            <Button asChild variant="outline">
              <Link href={routes.course(result.quiz.course.id)}>
                <BookOpen aria-hidden="true" />
                {t('quizzes.result.backToCourse')}
              </Link>
            </Button>
          )}
          <Button asChild variant="ghost">
            <Link href={routes.quizzes}>{t('quizzes.result.allQuizzes')}</Link>
          </Button>
        </div>
      )}

      {result.canSeeAnswers ? (
        <AnswerReview questions={result.questions} isOwner={isOwner} />
      ) : (
        <div className="flex gap-3 rounded-xl border border-dashed bg-card/50 p-5">
          <EyeOff className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="font-medium">{t('quizzes.review.hiddenTitle')}</p>
            <p className="text-sm text-muted-foreground">{t('quizzes.review.hiddenHint')}</p>
          </div>
        </div>
      )}
    </div>
  )
}
