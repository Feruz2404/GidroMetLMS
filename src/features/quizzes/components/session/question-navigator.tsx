'use client'

import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'

export interface NavigatorItem {
  id: string
  answered: boolean
  flagged: boolean
}

interface QuestionNavigatorProps {
  items: NavigatorItem[]
  current: number
  onSelect: (index: number) => void
  onSubmit: () => void
  submitting: boolean
  className?: string
}

/** Grid of question numbers showing answered, unanswered and flagged-for-review states. */
export function QuestionNavigator({ items, current, onSelect, onSubmit, submitting, className }: QuestionNavigatorProps) {
  const { t } = useI18n()
  const answered = items.filter((item) => item.answered).length

  return (
    <nav aria-label={t('quizzes.session.navigator')} className={cn('rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]', className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{t('quizzes.session.navigator')}</h2>
        <span className="text-xs tabular-nums text-muted-foreground">
          {answered} / {items.length}
        </span>
      </div>
      <ol className="grid grid-cols-6 gap-2 sm:grid-cols-10 lg:grid-cols-5">
        {items.map((item, index) => {
          const state = [
            item.answered ? t('quizzes.session.stateAnswered') : t('quizzes.session.stateUnanswered'),
            item.flagged ? t('quizzes.session.stateFlagged') : null,
          ]
            .filter(Boolean)
            .join(', ')
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={index === current ? 'step' : undefined}
                aria-label={`${t('quizzes.session.questionNumber', { index: index + 1 })}: ${state}`}
                className={cn(
                  'relative flex aspect-square w-full items-center justify-center rounded-lg border text-sm font-medium tabular-nums transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                  item.answered
                    ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  index === current && 'ring-2 ring-primary ring-offset-2 ring-offset-card'
                )}
              >
                {index + 1}
                {item.flagged && <span className="absolute -right-1 -top-1 size-3 rounded-full bg-warning ring-2 ring-card" aria-hidden="true" />}
              </button>
            </li>
          )
        })}
      </ol>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground" aria-hidden="true">
        <li className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded bg-primary" />
          {t('quizzes.session.stateAnswered')}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded border bg-background" />
          {t('quizzes.session.stateUnanswered')}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-warning" />
          {t('quizzes.session.stateFlagged')}
        </li>
      </ul>
      <Button onClick={onSubmit} disabled={submitting} variant="soft" className="mt-4 w-full">
        <Send aria-hidden="true" />
        {t('quizzes.session.submit')}
      </Button>
    </nav>
  )
}
