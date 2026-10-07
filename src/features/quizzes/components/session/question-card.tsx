'use client'

import type { Ref } from 'react'
import { ArrowLeft, ArrowRight, Flag, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'
import type { TakingQuestionDto } from '@/shared/dto'
import { GAP_PATTERN, QUESTION_TYPE_LABEL, type AnswerDraft } from '../../session-model'
import { AnswerInput } from './answer-input'

const GAP_TONES = {
  primary: 'border-primary bg-primary/[0.06] text-primary',
  success: 'border-success bg-success/10 text-success',
  destructive: 'border-destructive bg-destructive/[0.07] text-destructive',
} as const

interface QuestionTextProps {
  question: Pick<TakingQuestionDto, 'type' | 'text'>
  filled?: string
  /** Colour of a filled gap: neutral while answering, graded in the review. */
  tone?: keyof typeof GAP_TONES
}

/** Question text; a fill-in gap (`____`) shows the learner's answer in place. */
export function QuestionText({ question, filled, tone = 'primary' }: QuestionTextProps) {
  if (question.type !== 'fill_blank' || !GAP_PATTERN.test(question.text)) return <>{question.text}</>
  const parts = question.text.split(GAP_PATTERN)
  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && (
            <span
              className={cn(
                'mx-1 inline-block min-w-20 rounded-t-sm border-b-2 border-dashed px-2 text-center align-baseline',
                filled ? cn('font-semibold', GAP_TONES[tone]) : 'border-muted-foreground/50'
              )}
            >
              {filled || ' '}
            </span>
          )}
        </span>
      ))}
    </>
  )
}

interface QuestionCardProps {
  question: TakingQuestionDto
  index: number
  total: number
  answer: AnswerDraft
  flagged: boolean
  onAnswer: (answer: AnswerDraft) => void
  onToggleFlag: () => void
  onPrevious: () => void
  onNext: () => void
  onFinish: () => void
  /** Receives focus when the learner moves to another question. */
  headingRef: Ref<HTMLHeadingElement>
}

export function QuestionCard({ question, index, total, answer, flagged, onAnswer, onToggleFlag, onPrevious, onNext, onFinish, headingRef }: QuestionCardProps) {
  const { t } = useI18n()
  const headingId = `question-${question.id}`
  const last = index === total - 1

  return (
    <section aria-labelledby={headingId} className="scroll-mt-44 rounded-xl border bg-card shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold tabular-nums">{t('quizzes.session.questionOf', { index: index + 1, total })}</span>
          <Badge variant="muted">{t(QUESTION_TYPE_LABEL[question.type])}</Badge>
          <span className="text-xs text-muted-foreground">{t('quizzes.points', { count: question.points })}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          aria-pressed={flagged}
          onClick={onToggleFlag}
          className={cn(flagged && 'bg-warning/15 text-warning-foreground hover:bg-warning/25 dark:text-warning')}
        >
          <Flag className={cn(flagged && 'fill-current')} aria-hidden="true" />
          {flagged ? t('quizzes.session.flagged') : t('quizzes.session.flag')}
        </Button>
      </div>

      <div key={question.id} className="space-y-5 p-5 animate-in fade-in duration-300 sm:p-6">
        <h2 ref={headingRef} id={headingId} tabIndex={-1} className="text-lg font-medium leading-relaxed text-pretty outline-none sm:text-xl">
          <QuestionText question={question} filled={answer.text.trim()} />
        </h2>
        {question.type === 'multiple_choice' && <p className="-mt-2 text-sm font-medium text-primary">{t('quizzes.session.selectAll')}</p>}
        <AnswerInput question={question} answer={answer} labelledBy={headingId} onChange={onAnswer} />
      </div>

      <div className="flex items-center justify-between gap-3 border-t px-5 py-3 sm:px-6">
        <Button variant="outline" onClick={onPrevious} disabled={index === 0}>
          <ArrowLeft aria-hidden="true" />
          {t('action.previous')}
        </Button>
        {last ? (
          <Button onClick={onFinish}>
            {t('quizzes.session.finish')}
            <Send aria-hidden="true" />
          </Button>
        ) : (
          <Button onClick={onNext}>
            {t('action.next')}
            <ArrowRight aria-hidden="true" />
          </Button>
        )}
      </div>
    </section>
  )
}
