'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Field } from '@/components/shared/field'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/i18n/provider'
import { useErrorToast } from '@/lib/use-api-error'
import type { SectionDto } from '@/shared/dto'
import { useCreateSection, useUpdateSection } from '../../api'

function SectionForm({ courseId, section, onDone }: { courseId: string; section: SectionDto | null; onDone: () => void }) {
  const { t } = useI18n()
  const onError = useErrorToast()
  const create = useCreateSection(courseId)
  const update = useUpdateSection(courseId)
  const [title, setTitle] = useState(section?.title ?? '')
  const [description, setDescription] = useState(section?.description ?? '')
  const [error, setError] = useState<string | null>(null)
  const pending = create.isPending || update.isPending

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (title.trim().length < 2) {
      setError(t('courses.editor.validation.titleShort'))
      return
    }
    const input = { title: title.trim(), description: description.trim() || null }
    const onSuccess = () => {
      toast.success(section ? t('courses.editor.section.updated') : t('courses.editor.section.created'))
      onDone()
    }
    if (section) update.mutate({ id: section.id, ...input }, { onSuccess, onError })
    else create.mutate(input, { onSuccess, onError })
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <DialogHeader>
        <DialogTitle>{section ? t('courses.editor.section.edit') : t('courses.editor.section.add')}</DialogTitle>
        <DialogDescription>{t('courses.editor.section.dialogHint')}</DialogDescription>
      </DialogHeader>
      <Field id="section-title" label={t('courses.editor.field.sectionTitle')} required error={error}>
        <Input
          id="section-title"
          value={title}
          maxLength={200}
          autoFocus
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'section-title-error' : undefined}
          onChange={(event) => setTitle(event.target.value)}
        />
      </Field>
      <Field id="section-description" label={t('common.description')} hint={t('state.optional')}>
        <Textarea id="section-description" value={description} maxLength={1000} rows={3} onChange={(event) => setDescription(event.target.value)} />
      </Field>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={pending}>
            {t('action.cancel')}
          </Button>
        </DialogClose>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
          {section ? t('action.save') : t('action.add')}
        </Button>
      </DialogFooter>
    </form>
  )
}

export interface SectionDialogState {
  open: boolean
  /** `null` adds a new section. */
  section: SectionDto | null
}

interface SectionDialogProps {
  courseId: string
  state: SectionDialogState
  onClose: () => void
}

export function SectionDialog({ courseId, state, onClose }: SectionDialogProps) {
  return (
    <Dialog open={state.open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <SectionForm key={state.section?.id ?? 'new'} courseId={courseId} section={state.section} onDone={onClose} />
      </DialogContent>
    </Dialog>
  )
}
