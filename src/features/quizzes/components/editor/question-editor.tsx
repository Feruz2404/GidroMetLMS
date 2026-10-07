'use client'

import { useEffect, useId, useRef } from 'react'
import { ArrowDown, ArrowUp, CircleDot, Copy, ListChecks, TextCursorInput, ToggleLeft, Trash2, type LucideIcon } from 'lucide-react'
import { Field } from '@/components/shared/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'
import type { QuestionType } from '@/shared/dto'
import type { DraftQuestion, QuestionErrors } from '../../editor-model'
import { QUESTION_TYPE_LABEL } from '../../session-model'
import { OptionsEditor } from './options-editor'

export const QUESTION_TYPES: Array<{ type: QuestionType; icon: LucideIcon }> = [
  { type: 'single_choice', icon: CircleDot },
  { type: 'multiple_choice', icon: ListChecks },
  { type: 'true_false', icon: ToggleLeft },
  { type: 'fill_blank', icon: TextCursorInput },
]

function IconAction({ label, icon: Icon, onClick, disabled, destructive }: { label: string; icon: LucideIcon; onClick: () => void; disabled?: boolean; destructive?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          className={cn('text-muted-foreground', destructive && 'hover:bg-destructive/10 hover:text-destructive')}
        >
          <Icon aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

interface QuestionEditorProps {
  question: DraftQuestion
  index: number
  total: number
  errors: QuestionErrors | null
  onChange: (question: DraftQuestion) => void
  onTypeChange: (type: QuestionType) => void
  onMove: (offset: -1 | 1) => void
  onDuplicate: () => void
  onDelete: () => void
  /** Scrolls to and focuses the question text when it first appears (newly added). */
  autoFocus?: boolean
}

export function QuestionEditor({ question, index, total, errors, onChange, onTypeChange, onMove, onDuplicate, onDelete, autoFocus = false }: QuestionEditorProps) {
  const { t } = useI18n()
  const id = useId()
  const articleRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const invalid = Boolean(errors)

  useEffect(() => {
    if (!autoFocus) return
    articleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    textRef.current?.focus({ preventScroll: true })
  }, [autoFocus])

  return (
    <article
      ref={articleRef}
      data-question-index={index}
      aria-labelledby={`${id}-title`}
      className={cn('scroll-mt-24 rounded-xl border bg-card shadow-[var(--shadow-card)] transition-colors', invalid && 'border-destructive/50')}
    >
      <header className="flex flex-wrap items-center gap-2 border-b px-4 py-3 sm:px-5">
        <h3 id={`${id}-title`} className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 tabular-nums text-primary" aria-hidden="true">
            {index + 1}
          </span>
          <span className="sr-only">{t('quizzes.session.questionNumber', { index: index + 1 })}</span>
        </h3>
        <Select value={question.type} onValueChange={(type) => onTypeChange(type as QuestionType)}>
          <SelectTrigger className="h-8 w-56 bg-background" aria-label={t('quizzes.editor.questionType')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {QUESTION_TYPES.map(({ type, icon: Icon }) => (
              <SelectItem key={type} value={type}>
                <Icon aria-hidden="true" />
                {t(QUESTION_TYPE_LABEL[type])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-0.5">
          <IconAction label={t('quizzes.editor.moveUp')} icon={ArrowUp} onClick={() => onMove(-1)} disabled={index === 0} />
          <IconAction label={t('quizzes.editor.moveDown')} icon={ArrowDown} onClick={() => onMove(1)} disabled={index === total - 1} />
          <IconAction label={t('quizzes.editor.duplicate')} icon={Copy} onClick={onDuplicate} />
          <IconAction label={t('quizzes.editor.deleteQuestion')} icon={Trash2} onClick={onDelete} disabled={total <= 1} destructive />
        </div>
      </header>

      <div className="space-y-5 p-4 sm:p-5">
        <Field
          id={`${id}-text`}
          label={t('quizzes.editor.questionText')}
          hint={question.type === 'fill_blank' ? t('quizzes.editor.fillBlankHint') : undefined}
          error={errors?.text ? t(errors.text) : null}
          required
        >
          <Textarea
            ref={textRef}
            id={`${id}-text`}
            value={question.text}
            onChange={(event) => onChange({ ...question, text: event.target.value })}
            placeholder={question.type === 'fill_blank' ? t('quizzes.editor.fillBlankPlaceholder') : t('quizzes.editor.questionPlaceholder')}
            maxLength={2000}
            rows={2}
            aria-invalid={Boolean(errors?.text) || undefined}
            aria-describedby={errors?.text ? `${id}-text-error` : question.type === 'fill_blank' ? `${id}-text-hint` : undefined}
            className="min-h-20 bg-background"
          />
        </Field>

        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <p className="text-sm font-medium">{question.type === 'fill_blank' ? t('quizzes.editor.acceptedAnswers') : t('quizzes.editor.options')}</p>
            <p className="text-xs text-muted-foreground">
              {question.type === 'fill_blank'
                ? t('quizzes.editor.acceptedAnswersHint')
                : question.type === 'multiple_choice'
                  ? t('quizzes.editor.markAllCorrect')
                  : t('quizzes.editor.markOneCorrect')}
            </p>
          </div>
          <OptionsEditor question={question} invalidKeys={errors?.optionKeys ?? []} onChange={(options) => onChange({ ...question, options })} />
          {errors?.options && (
            <p className="text-xs font-medium text-destructive" role="alert">
              {t(errors.options)}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
          <Field id={`${id}-points`} label={t('quizzes.editor.points')} error={errors?.points ? t(errors.points) : null}>
            <Input
              id={`${id}-points`}
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              value={question.points}
              onChange={(event) => onChange({ ...question, points: event.target.value })}
              aria-invalid={Boolean(errors?.points) || undefined}
              className="bg-background"
            />
          </Field>
          <Field id={`${id}-explanation`} label={t('quizzes.editor.explanation')} hint={t('quizzes.editor.explanationHint')}>
            <Textarea
              id={`${id}-explanation`}
              value={question.explanation}
              onChange={(event) => onChange({ ...question, explanation: event.target.value })}
              maxLength={2000}
              rows={1}
              aria-describedby={`${id}-explanation-hint`}
              className="min-h-9 bg-background"
            />
          </Field>
        </div>
      </div>
    </article>
  )
}
