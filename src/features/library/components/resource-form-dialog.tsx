'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Field } from '@/components/shared/field'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/i18n/provider'
import { ApiError } from '@/lib/api-client'
import { useErrorToast } from '@/lib/use-api-error'
import type { LibraryResourceDto, ResourceType } from '@/shared/dto'
import { useCreateResource, useLibraryFacets, useUpdateResource, type ResourcePayload } from '../api'
import { isLanguage, RESOURCE_LANGUAGES, RESOURCE_TYPES, useLibraryLabels, type ResourceLanguage } from '../labels'
import { TagsInput } from './tags-input'

const FILE_TYPES = ['pdf', 'docx', 'pptx', 'xlsx', 'html', 'mp4', 'mp3', 'zip']
const MAX_TAGS = 15

interface FormState {
  title: string
  description: string
  type: ResourceType
  category: string
  author: string
  publisher: string
  year: string
  language: ResourceLanguage
  pages: string
  fileUrl: string
  fileType: string
  tags: string[]
}

type FieldErrors = Partial<Record<keyof FormState, string>>

function toForm(resource: LibraryResourceDto | null): FormState {
  return {
    title: resource?.title ?? '',
    description: resource?.description ?? '',
    type: resource?.type ?? 'book',
    category: resource?.category ?? '',
    author: resource?.author ?? '',
    publisher: resource?.publisher ?? '',
    year: resource?.year ? String(resource.year) : '',
    language: resource && isLanguage(resource.language) ? resource.language : 'uz',
    pages: resource?.pages ? String(resource.pages) : '',
    fileUrl: resource?.fileUrl ?? '',
    fileType: resource?.fileType ?? '',
    tags: resource?.tags ?? [],
  }
}

function isIntInRange(value: string, min: number, max: number) {
  const number = Number(value)
  return Number.isInteger(number) && number >= min && number <= max
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

interface ResourceFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The resource to edit; omit to create a new one. */
  resource?: LibraryResourceDto | null
}

export function ResourceFormDialog({ open, onOpenChange, resource = null }: ResourceFormDialogProps) {
  const { t } = useI18n()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] flex-col gap-0 p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-6 py-4 pr-12">
          <DialogTitle>{resource ? t('library.form.editTitle') : t('library.form.createTitle')}</DialogTitle>
          <DialogDescription>{t('library.form.description')}</DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so every opening starts from the current resource. */}
        <ResourceForm resource={resource} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function ResourceForm({ resource, onDone }: { resource: LibraryResourceDto | null; onDone: () => void }) {
  const { t } = useI18n()
  const labels = useLibraryLabels()
  const facets = useLibraryFacets()
  const create = useCreateResource()
  const update = useUpdateResource()
  const onError = useErrorToast()
  const [form, setForm] = useState<FormState>(() => toForm(resource))
  const [errors, setErrors] = useState<FieldErrors>({})
  const pending = create.isPending || update.isPending

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current))
  }
  const text = (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, event.target.value)

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    const title = form.title.trim()
    if (!title) next.title = t('validation.required')
    else if (title.length < 3) next.title = t('validation.tooShort')
    if (form.year && !isIntInRange(form.year, 1900, 2100)) next.year = t('library.form.yearInvalid')
    if (form.pages && !isIntInRange(form.pages, 1, 20_000)) next.pages = t('library.form.pagesInvalid')
    if (form.fileUrl.trim() && !isHttpsUrl(form.fileUrl.trim())) next.fileUrl = t('validation.invalidUrl')
    return next
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) return

    const payload: ResourcePayload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      type: form.type,
      category: form.category.trim() || null,
      author: form.author.trim() || null,
      publisher: form.publisher.trim() || null,
      year: form.year ? Number(form.year) : null,
      language: form.language,
      pages: form.pages ? Number(form.pages) : null,
      fileUrl: form.fileUrl.trim() || null,
      fileType: form.fileType.trim().toLowerCase() || null,
      tags: form.tags,
    }
    const handlers = {
      onSuccess: () => {
        toast.success(resource ? t('state.saved') : t('library.form.created'))
        onDone()
      },
      onError: (error: unknown) => {
        if (error instanceof ApiError && error.issues.length) {
          setErrors(Object.fromEntries(error.issues.map((issue) => [issue.path.split('.')[0], t('errors.VALIDATION_FAILED')])))
        }
        onError(error)
      },
    }
    if (resource) update.mutate({ id: resource.id, input: payload }, handlers)
    else create.mutate(payload, handlers)
  }

  return (
    <>
      <form id="resource-form" onSubmit={submit} noValidate className="scrollbar-thin flex-1 space-y-6 overflow-y-auto px-6 py-5">
        <fieldset className="space-y-4">
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('library.form.section.main')}</legend>
          <Field id="resource-title" label={t('common.title')} required error={errors.title}>
            <Input id="resource-title" value={form.title} onChange={text('title')} maxLength={300} aria-invalid={!!errors.title} />
          </Field>
          <Field id="resource-description" label={t('common.description')}>
            <Textarea id="resource-description" value={form.description} onChange={text('description')} rows={4} maxLength={4000} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="resource-type" label={t('common.type')} required>
              <Select value={form.type} onValueChange={(value) => set('type', value as ResourceType)}>
                <SelectTrigger id="resource-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {labels.type(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field id="resource-category" label={t('common.category')} hint={t('library.form.categoryHint')}>
              <Input id="resource-category" list="resource-category-options" value={form.category} onChange={text('category')} maxLength={120} autoComplete="off" />
              <datalist id="resource-category-options">
                {facets.data?.categories.map((category) => <option key={category.value} value={category.value} />)}
              </datalist>
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('library.form.section.publication')}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="resource-author" label={t('common.author')}>
              <Input id="resource-author" value={form.author} onChange={text('author')} maxLength={200} />
            </Field>
            <Field id="resource-publisher" label={t('library.field.publisher')}>
              <Input id="resource-publisher" value={form.publisher} onChange={text('publisher')} maxLength={200} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field id="resource-year" label={t('common.year')} error={errors.year}>
              <Input id="resource-year" type="number" inputMode="numeric" min={1900} max={2100} value={form.year} onChange={text('year')} aria-invalid={!!errors.year} />
            </Field>
            <Field id="resource-language" label={t('common.language')} required>
              <Select value={form.language} onValueChange={(value) => set('language', value as ResourceLanguage)}>
                <SelectTrigger id="resource-language" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_LANGUAGES.map((language) => (
                    <SelectItem key={language} value={language}>
                      {labels.language(language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field id="resource-pages" label={t('library.field.pages')} error={errors.pages}>
              <Input id="resource-pages" type="number" inputMode="numeric" min={1} max={20000} value={form.pages} onChange={text('pages')} aria-invalid={!!errors.pages} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('library.form.section.file')}</legend>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
            <Field id="resource-file-url" label={t('library.field.fileUrl')} hint={t('library.form.fileUrlHint')} error={errors.fileUrl}>
              <Input
                id="resource-file-url"
                type="url"
                inputMode="url"
                placeholder="https://"
                value={form.fileUrl}
                onChange={text('fileUrl')}
                maxLength={1000}
                aria-invalid={!!errors.fileUrl}
              />
            </Field>
            <Field id="resource-file-type" label={t('library.field.fileType')}>
              <Input id="resource-file-type" list="resource-file-type-options" value={form.fileType} onChange={text('fileType')} maxLength={20} autoComplete="off" />
              <datalist id="resource-file-type-options">
                {FILE_TYPES.map((type) => <option key={type} value={type} />)}
              </datalist>
            </Field>
          </div>
          <Field id="resource-tags" label={t('library.field.tags')} hint={t('library.form.tagsHint', { max: MAX_TAGS })} error={errors.tags}>
            <TagsInput
              id="resource-tags"
              value={form.tags}
              onChange={(tags) => set('tags', tags)}
              max={MAX_TAGS}
              placeholder={t('library.form.tagsPlaceholder')}
              invalid={!!errors.tags}
              describedBy="resource-tags-hint"
            />
          </Field>
        </fieldset>
      </form>
      <DialogFooter className="border-t px-6 py-4">
        <Button type="button" variant="outline" onClick={onDone} disabled={pending}>
          {t('action.cancel')}
        </Button>
        <Button type="submit" form="resource-form" disabled={pending}>
          {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
          {resource ? t('action.saveChanges') : t('action.create')}
        </Button>
      </DialogFooter>
    </>
  )
}
