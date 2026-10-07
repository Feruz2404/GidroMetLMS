'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Check, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'
import { MAX_OPTIONS, newKey, type DraftOption, type DraftQuestion } from '../../editor-model'

const TOGGLE =
  'flex size-7 shrink-0 items-center justify-center border-2 text-muted-foreground transition-colors outline-none hover:border-success/60 focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=checked]:border-success data-[state=checked]:bg-success data-[state=checked]:text-success-foreground'

interface OptionsEditorProps {
  question: DraftQuestion
  invalidKeys: string[]
  onChange: (options: DraftOption[]) => void
}

/** Answer options of one question: texts plus which are correct (fill-in: accepted answers). */
export function OptionsEditor({ question, invalidKeys, onChange }: OptionsEditorProps) {
  const { t } = useI18n()
  const { type, options } = question
  const fixed = type === 'true_false'
  const fill = type === 'fill_blank'
  const minimum = fill ? 1 : 2
  const letter = (index: number) => String.fromCharCode(65 + index)

  const update = (key: string, patch: Partial<DraftOption>) => onChange(options.map((item) => (item.key === key ? { ...item, ...patch } : item)))
  const remove = (key: string) => onChange(options.filter((item) => item.key !== key))
  const add = () => onChange([...options, { key: newKey(), text: '', isCorrect: fill }])

  const rows = options.map((item, index) => {
    const invalid = invalidKeys.includes(item.key)
    const label = fill ? t('quizzes.editor.acceptedAnswerN', { index: index + 1 }) : t('quizzes.editor.optionN', { letter: letter(index) })
    return (
      <div
        key={item.key}
        className={cn('flex items-center gap-2 rounded-lg border p-1.5 pl-2 transition-colors', item.isCorrect && !fill ? 'border-success/40 bg-success/[0.06]' : 'bg-background')}
      >
        {type === 'multiple_choice' && (
          <CheckboxPrimitive.Root
            checked={item.isCorrect}
            onCheckedChange={(checked) => update(item.key, { isCorrect: checked === true })}
            aria-label={t('quizzes.editor.markCorrect', { option: label })}
            className={cn(TOGGLE, 'rounded-md')}
          >
            <Check className="size-4" strokeWidth={3} aria-hidden="true" />
          </CheckboxPrimitive.Root>
        )}
        {(type === 'single_choice' || type === 'true_false') && (
          <RadioGroupPrimitive.Item value={String(index)} aria-label={t('quizzes.editor.markCorrect', { option: label })} className={cn(TOGGLE, 'rounded-full')}>
            <Check className="size-4" strokeWidth={3} aria-hidden="true" />
          </RadioGroupPrimitive.Item>
        )}
        {fill && <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-success/12 text-xs font-semibold text-success">{index + 1}</span>}
        <Input
          value={item.text}
          onChange={(event) => update(item.key, { text: event.target.value })}
          placeholder={fill ? t('quizzes.editor.acceptedAnswerPlaceholder') : t('quizzes.editor.optionPlaceholder', { letter: letter(index) })}
          aria-label={label}
          aria-invalid={invalid || undefined}
          maxLength={500}
          className="h-9 border-transparent bg-transparent shadow-none focus-visible:border-ring dark:bg-transparent"
        />
        {!fixed && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => remove(item.key)}
            disabled={options.length <= minimum}
            aria-label={t('quizzes.editor.removeOption', { option: label })}
            className="text-muted-foreground hover:text-destructive"
          >
            <X aria-hidden="true" />
          </Button>
        )}
      </div>
    )
  })

  return (
    <div className="space-y-2">
      {type === 'single_choice' || type === 'true_false' ? (
        <RadioGroupPrimitive.Root
          value={String(options.findIndex((item) => item.isCorrect))}
          onValueChange={(value) => onChange(options.map((item, index) => ({ ...item, isCorrect: String(index) === value })))}
          aria-label={t('quizzes.editor.correctAnswer')}
          className={cn('grid grid-cols-1 gap-2', fixed && 'sm:grid-cols-2')}
        >
          {rows}
        </RadioGroupPrimitive.Root>
      ) : (
        <div role="group" aria-label={fill ? t('quizzes.editor.acceptedAnswers') : t('quizzes.editor.options')} className="grid grid-cols-1 gap-2">
          {rows}
        </div>
      )}
      {!fixed && options.length < MAX_OPTIONS && (
        <Button type="button" variant="ghost" size="sm" onClick={add} className="text-primary hover:text-primary">
          <Plus aria-hidden="true" />
          {fill ? t('quizzes.editor.addAnswer') : t('quizzes.editor.addOption')}
        </Button>
      )}
    </div>
  )
}
