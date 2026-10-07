'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ErrorState } from '@/components/shared/error-state'
import { Field } from '@/components/shared/field'
import { FilterSelect } from '@/components/shared/filter-select'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useI18n, type Translate } from '@/i18n/provider'
import { ApiError } from '@/lib/api-client'
import { useErrorToast } from '@/lib/use-api-error'
import { cn } from '@/lib/utils'
import type { LessonDetailDto, LessonType, SectionDto } from '@/shared/dto'
import type { LessonInput } from '@/shared/schemas'
import { safeResourceUrl } from '@/shared/url'
import { useCreateLesson, useLesson, useUpdateLesson } from '../../api'
import { videoSource } from '../lesson-media'
import { LESSON_TYPE_ICONS, LESSON_TYPES } from '../lesson-meta'
import { MarkdownEditor } from './markdown-editor'

interface LessonFormValues {
  sectionId: string
  title: string
  description: string
  type: LessonType
  content: string
  videoUrl: string
  fileUrl: string
  durationMin: string
  isFree: boolean
}

function initialValues(sectionId: string, lesson?: LessonDetailDto): LessonFormValues {
  return {
    sectionId: lesson?.sectionId ?? sectionId,
    title: lesson?.title ?? '',
    description: lesson?.description ?? '',
    type: lesson?.type ?? 'text',
    content: lesson?.content ?? '',
    videoUrl: lesson?.videoUrl ?? '',
    fileUrl: lesson?.fileUrl ?? '',
    durationMin: String(lesson?.durationMin ?? 30),
    isFree: lesson?.isFree ?? false,
  }
}

function validate(values: LessonFormValues, t: Translate): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!values.sectionId) errors.sectionId = t('validation.required')
  if (values.title.trim().length < 2) errors.title = t('courses.editor.validation.titleShort')
  if (values.type === 'video' && !videoSource(values.videoUrl.trim() || null)) errors.videoUrl = t('courses.editor.validation.videoUrl')
  if (values.type === 'pdf' && !safeResourceUrl(values.fileUrl)) errors.fileUrl = t('courses.editor.validation.fileUrl')
  const duration = Number(values.durationMin)
  if (values.durationMin.trim() === '' || !Number.isInteger(duration) || duration < 0 || duration > 600) {
    errors.durationMin = t('courses.editor.validation.range', { min: 0, max: 600 })
  }
  return errors
}

function toInput(values: LessonFormValues): LessonInput {
  return {
    sectionId: values.sectionId,
    title: values.title.trim(),
    description: values.description.trim() || null,
    type: values.type,
    content: values.content.trim() || null,
    videoUrl: values.type === 'video' ? values.videoUrl.trim() : null,
    fileUrl: values.type === 'pdf' ? values.fileUrl.trim() : null,
    durationMin: Number(values.durationMin),
    isFree: values.isFree,
  }
}

interface LessonFormProps {
  courseId: string
  sections: SectionDto[]
  sectionId: string
  lesson?: LessonDetailDto
  onDone: () => void
}

function LessonForm({ courseId, sections, sectionId, lesson, onDone }: LessonFormProps) {
  const { t } = useI18n()
  const onError = useErrorToast()
  const create = useCreateLesson(courseId)
  const update = useUpdateLesson(courseId)
  const [values, setValues] = useState(() => initialValues(sectionId, lesson))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const pending = create.isPending || update.isPending
  const set = <K extends keyof LessonFormValues>(key: K, value: LessonFormValues[K]) => setValues((current) => ({ ...current, [key]: value }))
  const youtube = values.type === 'video' && videoSource(values.videoUrl.trim() || null)?.kind === 'youtube'

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const found = validate(values, t)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(`lesson-${Object.keys(found)[0]}`)?.focus()
      return
    }
    const handlers = {
      onSuccess: () => {
        toast.success(lesson ? t('courses.editor.lesson.updated') : t('courses.editor.lesson.created'))
        onDone()
      },
      onError: (error: unknown) => {
        if (error instanceof ApiError && error.issues.length) {
          setErrors(Object.fromEntries(error.issues.map((issue) => [issue.path.split('.')[0], t('courses.editor.validation.invalid')])))
        }
        onError(error)
      },
    }
    if (lesson) update.mutate({ id: lesson.id, ...toInput(values) }, handlers)
    else create.mutate(toInput(values), handlers)
  }

  const invalid = (key: string) => (errors[key] ? { 'aria-invalid': true, 'aria-describedby': `lesson-${key}-error` } : {})

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <DialogHeader>
        <DialogTitle>{lesson ? t('courses.editor.lesson.edit') : t('courses.editor.lesson.add')}</DialogTitle>
        <DialogDescription>{t('courses.editor.lesson.dialogHint')}</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
        <Field id="lesson-title" label={t('courses.editor.field.lessonTitle')} required error={errors.title}>
          <Input id="lesson-title" value={values.title} maxLength={200} onChange={(event) => set('title', event.target.value)} {...invalid('title')} />
        </Field>
        <Field id="lesson-sectionId" label={t('courses.editor.field.section')} required error={errors.sectionId}>
          <FilterSelect
            value={values.sectionId}
            onChange={(value) => set('sectionId', value)}
            ariaLabel={t('courses.editor.field.section')}
            placeholder={t('courses.editor.field.section')}
            options={sections.map((section, index) => ({ value: section.id, label: `${index + 1}. ${section.title}` }))}
            className="h-9 sm:w-full"
          />
        </Field>
      </div>

      <Field id="lesson-description" label={t('courses.editor.field.lessonSummary')} hint={t('state.optional')}>
        <Textarea id="lesson-description" value={values.description} maxLength={1000} rows={2} className="min-h-14" onChange={(event) => set('description', event.target.value)} />
      </Field>

      <fieldset className="space-y-2">
        <legend className="mb-1.5 text-sm font-medium">{t('courses.editor.field.lessonType')}</legend>
        <RadioGroup value={values.type} onValueChange={(value) => set('type', value as LessonType)} className="grid grid-cols-3 gap-2">
          {LESSON_TYPES.map((type) => {
            const Icon = LESSON_TYPE_ICONS[type]
            return (
              <Label
                key={type}
                htmlFor={`lesson-type-${type}`}
                className={cn(
                  'flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-center text-sm font-medium transition-colors hover:bg-muted/50',
                  'has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50',
                  values.type === type && 'border-primary bg-primary/5 text-primary hover:bg-primary/5'
                )}
              >
                <RadioGroupItem id={`lesson-type-${type}`} value={type} className="sr-only" />
                <Icon className="size-5" aria-hidden="true" />
                {t(`courses.lessonType.${type}`)}
              </Label>
            )
          })}
        </RadioGroup>
      </fieldset>

      {values.type === 'video' && (
        <Field
          id="lesson-videoUrl"
          label={t('courses.editor.field.videoUrl')}
          required
          error={errors.videoUrl}
          hint={
            youtube ? (
              <span className="inline-flex items-center gap-1 text-success">
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                {t('courses.editor.hint.youtubeDetected')}
              </span>
            ) : (
              t('courses.editor.hint.videoUrl')
            )
          }
        >
          <Input
            id="lesson-videoUrl"
            type="url"
            inputMode="url"
            value={values.videoUrl}
            maxLength={500}
            placeholder="https://www.youtube.com/watch?v=…"
            onChange={(event) => set('videoUrl', event.target.value)}
            {...invalid('videoUrl')}
          />
        </Field>
      )}
      {values.type === 'pdf' && (
        <Field id="lesson-fileUrl" label={t('courses.editor.field.fileUrl')} required error={errors.fileUrl} hint={t('courses.editor.hint.fileUrl')}>
          <Input
            id="lesson-fileUrl"
            type="url"
            inputMode="url"
            value={values.fileUrl}
            maxLength={500}
            placeholder="https://…/material.pdf"
            onChange={(event) => set('fileUrl', event.target.value)}
            {...invalid('fileUrl')}
          />
        </Field>
      )}

      <Field id="lesson-content" label={values.type === 'text' ? t('courses.editor.field.lessonContent') : t('courses.editor.field.lessonNotes')}>
        <MarkdownEditor id="lesson-content" value={values.content} onChange={(value) => set('content', value)} minHeightClass="min-h-64" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="lesson-durationMin"
          label={t('courses.editor.field.durationMin')}
          error={errors.durationMin}
          hint={values.type === 'video' ? t('courses.editor.hint.videoDuration') : undefined}
        >
          <Input
            id="lesson-durationMin"
            type="number"
            inputMode="numeric"
            min={0}
            max={600}
            value={values.durationMin}
            onChange={(event) => set('durationMin', event.target.value)}
            {...invalid('durationMin')}
          />
        </Field>
        <div className="flex items-start justify-between gap-4 self-start rounded-lg border bg-muted/20 p-3 sm:mt-6">
          <div className="space-y-0.5">
            <Label htmlFor="lesson-isFree" className="text-sm font-medium">
              {t('courses.editor.field.freePreview')}
            </Label>
            <p id="lesson-isFree-hint" className="text-xs text-muted-foreground">
              {t('courses.editor.hint.freePreview')}
            </p>
          </div>
          <Switch id="lesson-isFree" checked={values.isFree} onCheckedChange={(checked) => set('isFree', checked)} aria-describedby="lesson-isFree-hint" />
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={pending}>
            {t('action.cancel')}
          </Button>
        </DialogClose>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
          {lesson ? t('action.save') : t('action.add')}
        </Button>
      </DialogFooter>
    </form>
  )
}

function EditLesson({ lessonId, ...props }: Omit<LessonFormProps, 'lesson'> & { lessonId: string }) {
  const { t } = useI18n()
  const lesson = useLesson(lessonId)
  if (lesson.isSuccess) return <LessonForm {...props} lesson={lesson.data} />
  return (
    <div className="grid gap-5">
      <DialogHeader>
        <DialogTitle>{t('courses.editor.lesson.edit')}</DialogTitle>
        <DialogDescription>{t('courses.editor.lesson.dialogHint')}</DialogDescription>
      </DialogHeader>
      {lesson.isError ? (
        <ErrorState error={lesson.error} onRetry={() => lesson.refetch()} />
      ) : (
        <div className="space-y-4" aria-busy="true">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      )}
    </div>
  )
}

export interface LessonDialogState {
  open: boolean
  sectionId: string
  /** Absent when adding a lesson. */
  lessonId?: string
}

interface LessonDialogProps {
  courseId: string
  sections: SectionDto[]
  state: LessonDialogState
  onClose: () => void
}

export function LessonDialog({ courseId, sections, state, onClose }: LessonDialogProps) {
  const common = { courseId, sections, sectionId: state.sectionId, onDone: onClose }
  return (
    <Dialog open={state.open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto scrollbar-thin sm:max-w-3xl">
        {state.lessonId ? (
          <EditLesson key={state.lessonId} lessonId={state.lessonId} {...common} />
        ) : (
          <LessonForm key={`new-${state.sectionId}`} {...common} />
        )}
      </DialogContent>
    </Dialog>
  )
}
