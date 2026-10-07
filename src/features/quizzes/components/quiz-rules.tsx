'use client'

import { Clock, Eye, EyeOff, ListChecks, RotateCcw, Save, Shuffle, Target, Timer, type LucideIcon } from 'lucide-react'
import { SectionCard } from '@/components/shared/section-card'
import { useI18n } from '@/i18n/provider'
import type { QuizDetailDto } from '@/shared/dto'

function Fact({ icon: Icon, label, value, hint }: { icon: LucideIcon; label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <Icon className="size-4 text-primary" aria-hidden="true" />
      <dt className="mt-2 text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-lg font-semibold tracking-tight tabular-nums">{value}</dd>
      {hint && <dd className="text-xs text-muted-foreground">{hint}</dd>}
    </div>
  )
}

function Note({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span>{children}</span>
    </li>
  )
}

/** The assessment's rules: size, timing, pass mark and attempt allowance. */
export function QuizRules({ quiz }: { quiz: QuizDetailDto }) {
  const { t } = useI18n()
  const learner = quiz.attemptsRemaining !== null

  return (
    <SectionCard title={t('quizzes.rules.title')} description={learner ? t('quizzes.rules.description') : t('quizzes.rules.descriptionStaff')}>
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Fact icon={ListChecks} label={t('quizzes.rules.questions')} value={quiz.questionCount} />
        <Fact icon={Clock} label={t('quizzes.rules.timeLimit')} value={t('common.minutes', { count: quiz.timeLimitMin })} />
        <Fact icon={Target} label={t('quizzes.rules.passingScore')} value={`${quiz.passingScore}%`} />
        <Fact
          icon={RotateCcw}
          label={learner ? t('quizzes.rules.attemptsLeft') : t('quizzes.rules.maxAttempts')}
          value={learner ? `${quiz.attemptsRemaining} / ${quiz.maxAttempts}` : quiz.maxAttempts}
        />
      </dl>
      <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
        <Note icon={Timer}>{t('quizzes.rules.noteTimer')}</Note>
        <Note icon={Save}>{t('quizzes.rules.noteAutosave')}</Note>
        {quiz.shuffleQuestions && <Note icon={Shuffle}>{t('quizzes.rules.noteShuffle')}</Note>}
        <Note icon={quiz.showAnswers ? Eye : EyeOff}>{quiz.showAnswers ? t('quizzes.rules.noteAnswersShown') : t('quizzes.rules.noteAnswersHidden')}</Note>
      </ul>
    </SectionCard>
  )
}
