'use client'

import { Field } from '@/components/shared/field'
import { SectionCard } from '@/components/shared/section-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useCourses } from '@/features/courses/api'
import { useI18n } from '@/i18n/provider'
import type { QuizStatus } from '@/shared/dto'
import type { DraftSettings, SettingsErrors } from '../../editor-model'

const NO_COURSE = '__none__'

interface SettingsCardProps {
  settings: DraftSettings
  errors: SettingsErrors
  isNew: boolean
  onChange: (patch: Partial<DraftSettings>) => void
}

function NumberField({ id, label, suffix, value, min, max, error, onChange }: {
  id: string
  label: string
  suffix?: string
  value: string
  min: number
  max: number
  error?: string
  onChange: (value: string) => void
}) {
  return (
    <Field id={id} label={label} error={error} required>
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error) || undefined}
          className={suffix ? 'pr-10' : undefined}
        />
        {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </Field>
  )
}

function SwitchRow({ id, label, hint, checked, onChange }: { id: string; label: string; hint: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} aria-describedby={`${id}-hint`} className="mt-0.5" />
    </div>
  )
}

/** Assessment-level settings: identity, linked course, timing, pass mark, attempts and visibility. */
export function SettingsCard({ settings, errors, isNew, onChange }: SettingsCardProps) {
  const { t } = useI18n()
  const courses = useCourses({ view: 'managed', sort: 'title', limit: 100 })
  const courseOptions = courses.data?.items ?? []
  const missingCourse = settings.courseId && courses.data && !courseOptions.some((course) => course.id === settings.courseId)
  const statuses: QuizStatus[] = isNew ? ['draft', 'published'] : ['draft', 'published', 'archived']

  return (
    <SectionCard title={t('quizzes.editor.settings')} description={t('quizzes.editor.settingsHint')} contentClassName="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-5">
          <Field id="quiz-title" label={t('common.title')} error={errors.title ? t(errors.title) : null} required>
            <Input
              id="quiz-title"
              value={settings.title}
              onChange={(event) => onChange({ title: event.target.value })}
              placeholder={t('quizzes.editor.titlePlaceholder')}
              maxLength={200}
              aria-invalid={Boolean(errors.title) || undefined}
            />
          </Field>
          <Field id="quiz-course" label={t('quizzes.filter.course')} hint={t('quizzes.editor.courseHint')}>
            <Select value={settings.courseId || NO_COURSE} onValueChange={(value) => onChange({ courseId: value === NO_COURSE ? '' : value })}>
              <SelectTrigger id="quiz-course" className="w-full" aria-describedby="quiz-course-hint">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_COURSE}>{t('quizzes.editor.noCourse')}</SelectItem>
                {missingCourse && <SelectItem value={settings.courseId}>{t('quizzes.editor.currentCourse')}</SelectItem>}
                {courseOptions.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field id="quiz-description" label={t('common.description')} error={errors.description ? t(errors.description) : null}>
          <Textarea
            id="quiz-description"
            value={settings.description}
            onChange={(event) => onChange({ description: event.target.value })}
            placeholder={t('quizzes.editor.descriptionPlaceholder')}
            maxLength={2000}
            rows={4}
            className="min-h-[7.75rem]"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <NumberField
          id="quiz-time"
          label={t('quizzes.rules.timeLimit')}
          suffix={t('quizzes.editor.minutesSuffix')}
          value={settings.timeLimitMin}
          min={1}
          max={600}
          error={errors.timeLimitMin ? t(errors.timeLimitMin) : undefined}
          onChange={(timeLimitMin) => onChange({ timeLimitMin })}
        />
        <NumberField
          id="quiz-passing"
          label={t('quizzes.rules.passingScore')}
          suffix="%"
          value={settings.passingScore}
          min={1}
          max={100}
          error={errors.passingScore ? t(errors.passingScore) : undefined}
          onChange={(passingScore) => onChange({ passingScore })}
        />
        <NumberField
          id="quiz-attempts"
          label={t('quizzes.rules.maxAttempts')}
          value={settings.maxAttempts}
          min={1}
          max={20}
          error={errors.maxAttempts ? t(errors.maxAttempts) : undefined}
          onChange={(maxAttempts) => onChange({ maxAttempts })}
        />
        <Field id="quiz-status" label={t('common.status')}>
          <Select value={settings.status} onValueChange={(status) => onChange({ status: status as QuizStatus })}>
            <SelectTrigger id="quiz-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`status.${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg border bg-muted/30 p-4 md:grid-cols-2 md:gap-8">
        <SwitchRow
          id="quiz-shuffle"
          label={t('quizzes.editor.shuffle')}
          hint={t('quizzes.editor.shuffleHint')}
          checked={settings.shuffleQuestions}
          onChange={(shuffleQuestions) => onChange({ shuffleQuestions })}
        />
        <SwitchRow
          id="quiz-answers"
          label={t('quizzes.editor.showAnswers')}
          hint={t('quizzes.editor.showAnswersHint')}
          checked={settings.showAnswers}
          onChange={(showAnswers) => onChange({ showAnswers })}
        />
      </div>
    </SectionCard>
  )
}
