'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Field } from '@/components/shared/field'
import { FilterSelect } from '@/components/shared/filter-select'
import { SectionCard } from '@/components/shared/section-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from '@/features/auth/session'
import { useI18n, type Translate } from '@/i18n/provider'
import { ApiError } from '@/lib/api-client'
import { useErrorToast } from '@/lib/use-api-error'
import { personName } from '@/lib/utils'
import type { CourseDetailDto, CourseLevel } from '@/shared/dto'
import { useCategories, usePeople, type CourseDraftInput } from '../../api'
import { fromListItems, ListEditor, toListItems, type ListItem } from './list-editor'
import { MarkdownEditor } from './markdown-editor'

export interface CourseFormValues {
  title: string
  titleRu: string
  shortSummary: string
  description: string
  targetAudience: string
  learningOutcomes: ListItem[]
  prerequisites: ListItem[]
  categoryId: string
  tutorId: string
  level: CourseLevel
  durationHours: string
  isMandatory: boolean
  certificateEnabled: boolean
  passPercentage: string
  maxAttempts: string
  validDays: string
}

export function courseFormValues(course?: CourseDetailDto): CourseFormValues {
  return {
    title: course?.title ?? '',
    titleRu: course?.titleRu ?? '',
    shortSummary: course?.shortSummary ?? '',
    description: course?.description ?? '',
    targetAudience: course?.targetAudience ?? '',
    learningOutcomes: toListItems(course?.learningOutcomes ?? []),
    prerequisites: toListItems(course?.prerequisites ?? []),
    categoryId: course?.categoryId ?? '',
    tutorId: course?.tutorId ?? '',
    level: course?.level ?? 'beginner',
    durationHours: String(course?.durationHours ?? 0),
    isMandatory: course?.isMandatory ?? false,
    certificateEnabled: course?.certificateEnabled ?? true,
    passPercentage: String(course?.passPercentage ?? 70),
    maxAttempts: String(course?.maxAttempts ?? 3),
    validDays: course?.validDays ? String(course.validDays) : '',
  }
}

const RANGES = {
  durationHours: [0, 1000],
  passPercentage: [1, 100],
  maxAttempts: [1, 20],
  validDays: [1, 3650],
} as const

type NumericField = keyof typeof RANGES

function validate(values: CourseFormValues, t: Translate): Record<string, string> {
  const errors: Record<string, string> = {}
  if (values.title.trim().length < 3) errors.title = t('courses.editor.validation.titleLength')
  for (const field of Object.keys(RANGES) as NumericField[]) {
    const raw = values[field].trim()
    if (field === 'validDays' && raw === '') continue
    const value = Number(raw)
    const [min, max] = RANGES[field]
    if (raw === '' || !Number.isInteger(value) || value < min || value > max) errors[field] = t('courses.editor.validation.range', { min, max })
  }
  return errors
}

/** Tutor is only sent by administrators; for others the server keeps the current tutor. */
function toInput(values: CourseFormValues, withTutor: boolean): CourseDraftInput {
  const text = (value: string) => value.trim() || null
  return {
    title: values.title.trim(),
    titleRu: text(values.titleRu),
    shortSummary: text(values.shortSummary),
    description: text(values.description),
    targetAudience: text(values.targetAudience),
    learningOutcomes: fromListItems(values.learningOutcomes),
    prerequisites: fromListItems(values.prerequisites),
    categoryId: values.categoryId || null,
    ...(withTutor ? { tutorId: values.tutorId || null } : {}),
    level: values.level,
    durationHours: Number(values.durationHours),
    isMandatory: values.isMandatory,
    certificateEnabled: values.certificateEnabled,
    passPercentage: Number(values.passPercentage),
    maxAttempts: Number(values.maxAttempts),
    validDays: values.validDays.trim() ? Number(values.validDays) : null,
  }
}

function SwitchRow({ id, label, hint, checked, onChange }: { id: string; label: string; hint: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border bg-muted/20 p-3">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} aria-describedby={`${id}-hint`} />
    </div>
  )
}

interface CourseDetailsFormProps {
  course?: CourseDetailDto
  submitLabel: string
  pending: boolean
  onSubmit: (input: CourseDraftInput) => Promise<unknown>
}

export function CourseDetailsForm({ course, submitLabel, pending, onSubmit }: CourseDetailsFormProps) {
  const { t } = useI18n()
  const session = useSession()
  const onError = useErrorToast()
  const canChooseTutor = session.can('users.manage')
  const categories = useCategories()
  const instructors = usePeople('instructor', '', canChooseTutor)
  const [initial] = useState(() => courseFormValues(course))
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const dirty = JSON.stringify(toInput(values, canChooseTutor)) !== JSON.stringify(toInput(initial, canChooseTutor))

  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const set = <K extends keyof CourseFormValues>(key: K, value: CourseFormValues[K]) => setValues((current) => ({ ...current, [key]: value }))
  const bind = (key: 'title' | 'titleRu' | 'shortSummary' | 'targetAudience' | NumericField) => ({
    id: key,
    value: values[key],
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${key}-error` : `${key}-hint`,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, event.target.value),
  })

  const tutorOptions = (instructors.data?.items ?? []).map((user) => ({ value: user.id, label: personName(user) }))
  if (course?.tutor && !tutorOptions.some((option) => option.value === course.tutor?.id)) {
    tutorOptions.unshift({ value: course.tutor.id, label: personName(course.tutor) })
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const found = validate(values, t)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus()
      return
    }
    try {
      await onSubmit(toInput(values, canChooseTutor))
    } catch (error) {
      if (error instanceof ApiError && error.issues.length) {
        setErrors(Object.fromEntries(error.issues.map((issue) => [issue.path.split('.')[0], t('courses.editor.validation.invalid')])))
      }
      onError(error)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="min-w-0 space-y-6">
          <SectionCard title={t('courses.editor.group.basics')}>
            <div className="space-y-4">
              <Field id="title" label={t('courses.editor.field.title')} required error={errors.title}>
                <Input {...bind('title')} maxLength={200} />
              </Field>
              <Field id="titleRu" label={t('courses.editor.field.titleRu')} hint={t('courses.editor.hint.titleRu')}>
                <Input {...bind('titleRu')} maxLength={200} lang="ru" />
              </Field>
              <Field id="shortSummary" label={t('courses.editor.field.shortSummary')} hint={t('courses.editor.hint.shortSummary', { count: values.shortSummary.length })}>
                <Textarea {...bind('shortSummary')} maxLength={400} rows={3} className="min-h-20" />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title={t('courses.editor.field.description')} description={t('courses.editor.hint.description')}>
            <MarkdownEditor id="description" value={values.description} onChange={(value) => set('description', value)} />
          </SectionCard>

          <SectionCard title={t('courses.editor.group.audience')}>
            <div className="space-y-5">
              <Field id="targetAudience" label={t('courses.editor.field.targetAudience')} hint={t('courses.editor.hint.targetAudience')}>
                <Textarea {...bind('targetAudience')} maxLength={400} rows={2} className="min-h-16" />
              </Field>
              <Field id="learningOutcomes" label={t('courses.editor.field.outcomes')} hint={t('courses.editor.hint.outcomes')}>
                <ListEditor
                  id="learningOutcomes"
                  items={values.learningOutcomes}
                  onChange={(items) => set('learningOutcomes', items)}
                  placeholder={t('courses.editor.placeholder.outcome')}
                  addLabel={t('courses.editor.addOutcome')}
                />
              </Field>
              <Field id="prerequisites" label={t('courses.editor.field.prerequisites')}>
                <ListEditor
                  id="prerequisites"
                  items={values.prerequisites}
                  onChange={(items) => set('prerequisites', items)}
                  placeholder={t('courses.editor.placeholder.prerequisite')}
                  addLabel={t('courses.editor.addPrerequisite')}
                />
              </Field>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title={t('courses.editor.group.classification')}>
            <div className="space-y-4">
              <Field id="categoryId" label={t('common.category')}>
                <FilterSelect
                  value={values.categoryId}
                  onChange={(value) => set('categoryId', value)}
                  allLabel={t('courses.editor.noCategory')}
                  ariaLabel={t('common.category')}
                  options={(categories.data ?? []).map((category) => ({ value: category.id, label: category.name }))}
                  className="h-9 sm:w-full"
                />
              </Field>
              <Field id="level" label={t('courses.filter.level')}>
                <FilterSelect
                  value={values.level}
                  onChange={(value) => set('level', value as CourseLevel)}
                  ariaLabel={t('courses.filter.level')}
                  options={(['beginner', 'intermediate', 'advanced'] as const).map((level) => ({ value: level, label: t(`level.${level}`) }))}
                  className="h-9 sm:w-full"
                />
              </Field>
              {canChooseTutor && (
                <Field id="tutorId" label={t('courses.detail.tutor')} hint={t('courses.editor.hint.tutor')}>
                  <FilterSelect
                    value={values.tutorId}
                    onChange={(value) => set('tutorId', value)}
                    allLabel={t('courses.editor.tutorSelf')}
                    ariaLabel={t('courses.detail.tutor')}
                    options={tutorOptions}
                    className="h-9 sm:w-full"
                  />
                </Field>
              )}
              <Field id="durationHours" label={t('courses.editor.field.durationHours')} error={errors.durationHours}>
                <Input {...bind('durationHours')} type="number" inputMode="numeric" min={0} max={1000} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title={t('courses.editor.group.completion')}>
            <div className="space-y-4">
              <SwitchRow
                id="isMandatory"
                label={t('courses.editor.field.mandatory')}
                hint={t('courses.editor.hint.mandatory')}
                checked={values.isMandatory}
                onChange={(checked) => set('isMandatory', checked)}
              />
              <SwitchRow
                id="certificateEnabled"
                label={t('courses.editor.field.certificate')}
                hint={t('courses.editor.hint.certificate')}
                checked={values.certificateEnabled}
                onChange={(checked) => set('certificateEnabled', checked)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Field id="passPercentage" label={t('courses.editor.field.passPercentage')} error={errors.passPercentage}>
                  <Input {...bind('passPercentage')} type="number" inputMode="numeric" min={1} max={100} />
                </Field>
                <Field id="maxAttempts" label={t('courses.editor.field.maxAttempts')} error={errors.maxAttempts}>
                  <Input {...bind('maxAttempts')} type="number" inputMode="numeric" min={1} max={20} />
                </Field>
              </div>
              <p className="-mt-2 text-xs text-muted-foreground">{t('courses.editor.hint.passing')}</p>
              <Field id="validDays" label={t('courses.editor.field.validDays')} hint={t('courses.editor.hint.validDays')} error={errors.validDays}>
                <Input {...bind('validDays')} type="number" inputMode="numeric" min={1} max={3650} placeholder={t('courses.facts.validForever')} />
              </Field>
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-3 border-t bg-background/90 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {dirty && <span className="mr-auto text-sm text-muted-foreground">{t('state.unsavedChanges')}</span>}
        <Button type="submit" disabled={pending || (Boolean(course) && !dirty)}>
          {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
