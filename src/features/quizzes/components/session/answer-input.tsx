'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'
import type { TakingQuestionDto } from '@/shared/dto'
import type { AnswerDraft } from '../../session-model'

const CARD =
  'group/option flex w-full cursor-pointer items-start gap-3 rounded-xl border bg-background p-4 text-left text-[0.95rem] leading-relaxed transition-colors outline-none hover:border-primary/40 hover:bg-primary/[0.03] focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/[0.06] dark:data-[state=checked]:bg-primary/10'

const MARKER =
  'mt-px flex size-6 shrink-0 items-center justify-center border text-xs font-semibold text-muted-foreground transition-colors group-data-[state=checked]/option:border-primary group-data-[state=checked]/option:bg-primary group-data-[state=checked]/option:text-primary-foreground'

const letter = (index: number) => String.fromCharCode(65 + index)

interface AnswerInputProps {
  question: TakingQuestionDto
  answer: AnswerDraft
  labelledBy: string
  onChange: (answer: AnswerDraft) => void
}

/** The answer control for one question: radio cards, checkbox cards or a text field. */
export function AnswerInput({ question, answer, labelledBy, onChange }: AnswerInputProps) {
  const { t } = useI18n()

  if (question.type === 'fill_blank') {
    return (
      <div className="space-y-2">
        <Input
          value={answer.text}
          onChange={(event) => onChange({ selected: [], text: event.target.value })}
          placeholder={t('quizzes.session.fillPlaceholder')}
          aria-labelledby={labelledBy}
          aria-describedby={`${labelledBy}-hint`}
          maxLength={4000}
          autoComplete="off"
          spellCheck={false}
          className="h-12 bg-background px-4 text-base"
        />
        <p id={`${labelledBy}-hint`} className="text-xs text-muted-foreground">
          {t('quizzes.session.fillHint')}
        </p>
      </div>
    )
  }

  if (question.type === 'multiple_choice') {
    return (
      <div role="group" aria-labelledby={labelledBy} className="grid grid-cols-1 gap-3">
        {question.options.map((option, index) => {
          const checked = answer.selected.includes(option.id)
          return (
            <CheckboxPrimitive.Root
              key={option.id}
              checked={checked}
              onCheckedChange={(next) =>
                onChange({ selected: next === true ? [...answer.selected, option.id] : answer.selected.filter((id) => id !== option.id), text: '' })
              }
              className={CARD}
            >
              <span className={cn(MARKER, 'rounded-md')} aria-hidden="true">
                {checked ? <Check className="size-3.5" strokeWidth={3} /> : letter(index)}
              </span>
              <span className="min-w-0 flex-1">{option.text}</span>
            </CheckboxPrimitive.Root>
          )
        })}
      </div>
    )
  }

  return (
    <RadioGroupPrimitive.Root
      value={answer.selected[0] ?? ''}
      onValueChange={(value) => onChange({ selected: [value], text: '' })}
      aria-labelledby={labelledBy}
      className={cn('grid grid-cols-1 gap-3', question.type === 'true_false' && 'sm:grid-cols-2')}
    >
      {question.options.map((option, index) => (
        <RadioGroupPrimitive.Item key={option.id} value={option.id} className={CARD}>
          <span className={cn(MARKER, 'rounded-full')} aria-hidden="true">
            {letter(index)}
          </span>
          <span className="min-w-0 flex-1">{option.text}</span>
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  )
}
