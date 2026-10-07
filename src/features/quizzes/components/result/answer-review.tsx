'use client'

import { useState } from 'react'
import { Check, Lightbulb, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'
import type { AttemptResultQuestionDto } from '@/shared/dto'
import { QUESTION_TYPE_LABEL } from '../../session-model'
import { QuestionText } from '../session/question-card'

type Filter = 'all' | 'incorrect' | 'correct'

function optionStyle(option: AttemptResultQuestionDto['options'][number]) {
  if (option.isCorrect && option.selected) return 'border-success/40 bg-success/10'
  if (option.isCorrect) return 'border-dashed border-success/50 bg-success/[0.04]'
  if (option.selected) return 'border-destructive/40 bg-destructive/[0.07]'
  return 'bg-background'
}

function OptionMarker({ option, index }: { option: AttemptResultQuestionDto['options'][number]; index: number }) {
  const base = 'mt-px flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold'
  if (option.isCorrect) {
    return (
      <span className={cn(base, 'bg-success text-success-foreground')}>
        <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
      </span>
    )
  }
  if (option.selected) {
    return (
      <span className={cn(base, 'bg-destructive text-white')}>
        <X className="size-3.5" strokeWidth={3} aria-hidden="true" />
      </span>
    )
  }
  return <span className={cn(base, 'border text-muted-foreground')}>{String.fromCharCode(65 + index)}</span>
}

function ReviewItem({ question, number, isOwner }: { question: AttemptResultQuestionDto; number: number; isOwner: boolean }) {
  const { t } = useI18n()
  const unanswered = question.type === 'fill_blank' ? !question.textAnswer : !question.options.some((option) => option.selected)

  return (
    <article className="rounded-xl border bg-card shadow-[var(--shadow-card)]" aria-labelledby={`review-${question.id}`}>
      <header className="flex items-start gap-3 border-b px-5 py-4">
        <span
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-full',
            question.isCorrect ? 'bg-success/12 text-success' : 'bg-destructive/10 text-destructive'
          )}
        >
          {question.isCorrect ? <Check className="size-4" strokeWidth={2.5} aria-hidden="true" /> : <X className="size-4" strokeWidth={2.5} aria-hidden="true" />}
          <span className="sr-only">{question.isCorrect ? t('quizzes.review.correct') : t('quizzes.review.incorrect')}</span>
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{t('quizzes.session.questionNumber', { index: number })}</span>
            <span aria-hidden="true">·</span>
            <span>{t(QUESTION_TYPE_LABEL[question.type])}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{t('quizzes.review.points', { awarded: question.pointsAwarded, points: question.points })}</span>
          </p>
          <h3 id={`review-${question.id}`} className="font-medium leading-relaxed">
            <QuestionText question={question} filled={question.textAnswer ?? undefined} tone={question.isCorrect ? 'success' : 'destructive'} />
          </h3>
        </div>
      </header>

      <div className="space-y-3 p-5">
        {question.type === 'fill_blank' ? (
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div
              className={cn(
                'rounded-lg border px-3.5 py-2.5',
                unanswered ? 'bg-muted/40' : question.isCorrect ? 'border-success/40 bg-success/10' : 'border-destructive/40 bg-destructive/[0.07]'
              )}
            >
              <dt className="text-xs text-muted-foreground">{isOwner ? t('quizzes.review.yourAnswer') : t('quizzes.review.learnerAnswer')}</dt>
              <dd className={cn('mt-0.5 font-medium', unanswered && 'italic text-muted-foreground')}>{question.textAnswer || t('quizzes.review.noAnswer')}</dd>
            </div>
            <div className="rounded-lg border border-dashed border-success/50 bg-success/[0.04] px-3.5 py-2.5">
              <dt className="text-xs text-muted-foreground">{t('quizzes.review.acceptedAnswers')}</dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {(question.acceptedAnswers ?? []).map((accepted) => (
                  <Badge key={accepted} variant="success">
                    {accepted}
                  </Badge>
                ))}
              </dd>
            </div>
          </dl>
        ) : (
          <>
            {unanswered && <p className="text-sm italic text-muted-foreground">{t('quizzes.review.noAnswer')}</p>}
            <ul className="space-y-2">
              {question.options.map((option, index) => (
                <li key={option.id} className={cn('flex items-start gap-3 rounded-lg border px-3.5 py-2.5 text-sm', optionStyle(option))}>
                  <OptionMarker option={option} index={index} />
                  <span className="min-w-0 flex-1 leading-relaxed">{option.text}</span>
                  <span className="flex shrink-0 flex-wrap justify-end gap-1">
                    {option.selected && (
                      <Badge variant={option.isCorrect ? 'success' : 'destructive'}>{isOwner ? t('quizzes.review.yourChoice') : t('quizzes.review.learnerChoice')}</Badge>
                    )}
                    {option.isCorrect && !option.selected && <Badge variant="success">{t('quizzes.review.correctOption')}</Badge>}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {question.explanation && (
          <div className="flex gap-3 rounded-lg border border-info/25 bg-info/[0.07] p-3.5 text-sm">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-info" aria-hidden="true" />
            <div>
              <p className="font-medium">{t('quizzes.review.explanation')}</p>
              <p className="mt-0.5 leading-relaxed text-muted-foreground">{question.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

/** Per-question breakdown: the learner's choices against the correct answers, with explanations. */
export function AnswerReview({ questions, isOwner }: { questions: AttemptResultQuestionDto[]; isOwner: boolean }) {
  const { t } = useI18n()
  const [filter, setFilter] = useState<Filter>('all')
  const incorrect = questions.filter((question) => !question.isCorrect).length
  const visible = questions
    .map((question, index) => ({ question, number: index + 1 }))
    .filter(({ question }) => filter === 'all' || (filter === 'correct') === question.isCorrect)

  return (
    <section className="space-y-4" aria-labelledby="answer-review-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="answer-review-title" className="text-lg font-semibold tracking-tight">
            {t('quizzes.review.title')}
          </h2>
          <p className="text-sm text-muted-foreground">{isOwner ? t('quizzes.review.description') : t('quizzes.review.descriptionReviewer')}</p>
        </div>
        <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
          <TabsList>
            <TabsTrigger value="all">{t('quizzes.review.filterAll', { count: questions.length })}</TabsTrigger>
            <TabsTrigger value="incorrect">{t('quizzes.review.filterIncorrect', { count: incorrect })}</TabsTrigger>
            <TabsTrigger value="correct">{t('quizzes.review.filterCorrect', { count: questions.length - incorrect })}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed px-5 py-8 text-center text-sm text-muted-foreground">{t('quizzes.review.nothing')}</p>
      ) : (
        visible.map(({ question, number }) => <ReviewItem key={question.id} question={question} number={number} isOwner={isOwner} />)
      )}
    </section>
  )
}
