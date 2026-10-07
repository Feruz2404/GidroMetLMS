'use client'

import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'
import type { DraftQuestion } from '../../editor-model'
import { QUESTION_TYPE_LABEL } from '../../session-model'

/** Read-only question with its correct answers, shown while the question bank is locked. */
export function QuestionPreview({ question, index }: { question: DraftQuestion; index: number }) {
  const { t } = useI18n()
  return (
    <article className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{t('quizzes.session.questionNumber', { index: index + 1 })}</span>
        <Badge variant="muted">{t(QUESTION_TYPE_LABEL[question.type])}</Badge>
        <span>{t('quizzes.points', { count: Number(question.points) || 0 })}</span>
      </div>
      <h3 className="font-medium leading-relaxed">{question.text}</h3>
      <ul className={cn('mt-3 grid grid-cols-1 gap-1.5 text-sm', question.type === 'fill_blank' && 'flex flex-wrap')}>
        {question.options.map((item) =>
          question.type === 'fill_blank' ? (
            <li key={item.key}>
              <Badge variant="success">{item.text}</Badge>
            </li>
          ) : (
            <li key={item.key} className={cn('flex items-center gap-2 rounded-md px-2.5 py-1.5', item.isCorrect ? 'bg-success/10 font-medium' : 'text-muted-foreground')}>
              <Check className={cn('size-4 shrink-0', item.isCorrect ? 'text-success' : 'invisible')} aria-hidden="true" />
              <span>{item.text}</span>
              {item.isCorrect && <span className="sr-only">({t('quizzes.review.correctOption')})</span>}
            </li>
          )
        )}
      </ul>
      {question.explanation && <p className="mt-3 border-t pt-3 text-sm text-muted-foreground">{question.explanation}</p>}
    </article>
  )
}
