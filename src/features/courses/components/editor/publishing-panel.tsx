'use client'

import { useState } from 'react'
import { AlertTriangle, Archive, CheckCircle2, Circle, FilePen, Globe, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { SectionCard } from '@/components/shared/section-card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useI18n } from '@/i18n/provider'
import { ApiError } from '@/lib/api-client'
import { useErrorToast } from '@/lib/use-api-error'
import { cn } from '@/lib/utils'
import type { CourseDetailDto, CourseStatus } from '@/shared/dto'
import { useArchiveCourse, useUpdateCourse } from '../../api'
import { flattenLessons } from '../lesson-meta'

const OPTIONS = [
  { status: 'draft', icon: FilePen },
  { status: 'published', icon: Globe },
  { status: 'archived', icon: Archive },
] as const satisfies ReadonlyArray<{ status: CourseStatus; icon: unknown }>

function ChecklistItem({ done, label, required }: { done: boolean; label: string; required?: boolean }) {
  const { t } = useI18n()
  return (
    <li className="flex items-start gap-2.5 py-2 text-sm">
      {done ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
      ) : (
        <Circle className={cn('mt-0.5 size-4 shrink-0', required ? 'text-warning' : 'text-muted-foreground/60')} aria-hidden="true" />
      )}
      <span className={cn('flex-1', !done && 'text-muted-foreground')}>
        {label}
        <span className="sr-only"> — {done ? t('common.yes') : t('common.no')}</span>
      </span>
      {required && !done && <Badge variant="warning">{t('courses.publishing.required')}</Badge>}
    </li>
  )
}

export function PublishingPanel({ course, onGoToCurriculum }: { course: CourseDetailDto; onGoToCurriculum: () => void }) {
  const { t } = useI18n()
  const onError = useErrorToast()
  const update = useUpdateCourse(course.id)
  const archive = useArchiveCourse(course.id)
  const [selected, setSelected] = useState<CourseStatus>(course.status)
  const [confirmArchive, setConfirmArchive] = useState(false)
  const [emptyError, setEmptyError] = useState(false)
  const lessons = flattenLessons(course)
  const pending = update.isPending || archive.isPending

  const changed = selected !== course.status
  const applyLabel = selected === 'published' ? t('action.publish') : selected === 'archived' ? t('action.archive') : t('courses.publishing.toDraft')

  const apply = () => {
    setEmptyError(false)
    if (selected === 'archived') {
      setConfirmArchive(true)
      return
    }
    update.mutate(
      { status: selected },
      {
        onSuccess: () => toast.success(t(`courses.publishing.done.${selected}`)),
        onError: (error) => {
          if (error instanceof ApiError && error.code === 'COURSE_EMPTY') setEmptyError(true)
          else onError(error)
        },
      }
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
      <SectionCard title={t('courses.publishing.title')} description={t('courses.publishing.description')}>
        <RadioGroup value={selected} onValueChange={(value) => setSelected(value as CourseStatus)} className="gap-3" aria-label={t('common.status')}>
          {OPTIONS.map(({ status, icon: Icon }) => (
            <Label
              key={status}
              htmlFor={`status-${status}`}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-4 font-normal transition-colors hover:bg-muted/40',
                'has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50',
                selected === status && 'border-primary bg-primary/5 hover:bg-primary/5'
              )}
            >
              <RadioGroupItem id={`status-${status}`} value={status} className="mt-1" />
              <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', selected === status ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
                <Icon className="size-4.5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 space-y-1">
                <span className="flex flex-wrap items-center gap-2 font-medium">
                  {t(`status.${status}`)}
                  {course.status === status && <Badge variant="muted">{t('courses.publishing.current')}</Badge>}
                </span>
                <span className="block text-sm leading-relaxed text-muted-foreground">{t(`courses.publishing.explain.${status}`)}</span>
              </span>
            </Label>
          ))}
        </RadioGroup>

        {emptyError && (
          <Alert variant="destructive" className="mt-4 border-destructive/30 bg-destructive/5">
            <AlertTriangle aria-hidden="true" />
            <AlertTitle>{t('courses.publishing.emptyTitle')}</AlertTitle>
            <AlertDescription>
              <p>{t('errors.COURSE_EMPTY')}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={onGoToCurriculum}>
                {t('courses.publishing.goToCurriculum')}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {changed && (
            <Button variant="ghost" disabled={pending} onClick={() => setSelected(course.status)}>
              {t('action.cancel')}
            </Button>
          )}
          <Button disabled={!changed || pending} variant={selected === 'archived' ? 'destructive' : 'default'} onClick={apply}>
            {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
            {applyLabel}
          </Button>
        </div>
      </SectionCard>

      <SectionCard title={t('courses.publishing.checklist')} description={t('courses.publishing.checklistHint')}>
        <ul className="divide-y">
          <ChecklistItem done={lessons.length > 0} label={t('courses.publishing.check.lessons')} required />
          <ChecklistItem done={Boolean(course.description)} label={t('courses.publishing.check.description')} />
          <ChecklistItem done={course.learningOutcomes.length > 0} label={t('courses.publishing.check.outcomes')} />
          <ChecklistItem done={Boolean(course.categoryId)} label={t('courses.publishing.check.category')} />
          <ChecklistItem done={course.quizzes.some((quiz) => quiz.status === 'published')} label={t('courses.publishing.check.quiz')} />
        </ul>
      </SectionCard>

      <ConfirmDialog
        open={confirmArchive}
        onOpenChange={setConfirmArchive}
        destructive
        title={t('courses.publishing.archiveTitle')}
        description={t('courses.publishing.archiveDescription')}
        confirmLabel={t('action.archive')}
        onConfirm={async () => {
          try {
            await archive.mutateAsync()
            toast.success(t('courses.publishing.done.archived'))
          } catch (error) {
            onError(error)
          }
        }}
      />
    </div>
  )
}
