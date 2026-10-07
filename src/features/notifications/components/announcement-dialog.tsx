'use client'

import { useState } from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Field } from '@/components/shared/field'
import { NotificationIcon } from '@/components/shared/notification-icon'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/i18n/provider'
import { ApiError } from '@/lib/api-client'
import { useErrorToast } from '@/lib/use-api-error'
import type { AnnouncementInput } from '@/shared/schemas'
import { usePublishAnnouncement } from '../api'

const TYPES = ['info', 'success', 'warning'] as const
const AUDIENCES = ['all', 'learners', 'staff'] as const
const TITLE_MAX = 200
const MESSAGE_MAX = 2000

export function AnnouncementDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('notifications.announce.title')}</DialogTitle>
          <DialogDescription>{t('notifications.announce.description')}</DialogDescription>
        </DialogHeader>
        <AnnouncementForm onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

interface Values {
  title: string
  message: string
  type: AnnouncementInput['type']
  audience: AnnouncementInput['audience']
  link: string
}

type Errors = Partial<Record<'title' | 'message' | 'link', string>>

const isAppPath = (value: string) => value.startsWith('/') && !value.startsWith('//')

function AnnouncementForm({ onDone }: { onDone: () => void }) {
  const { t } = useI18n()
  const publish = usePublishAnnouncement()
  const errorToast = useErrorToast()
  const [values, setValues] = useState<Values>({ title: '', message: '', type: 'info', audience: 'all', link: '' })
  const [errors, setErrors] = useState<Errors>({})

  const update = (patch: Partial<Values>) => {
    setValues((current) => ({ ...current, ...patch }))
    setErrors((current) => {
      const next = { ...current }
      for (const key of Object.keys(patch)) delete next[key as keyof Errors]
      return next
    })
  }

  const validate = (): Errors => {
    const found: Errors = {}
    const length = (value: string) => value.trim().length
    if (length(values.title) < 3) found.title = length(values.title) ? t('validation.tooShort') : t('validation.required')
    if (length(values.message) < 3) found.message = length(values.message) ? t('validation.tooShort') : t('validation.required')
    if (values.link.trim() && !isAppPath(values.link.trim())) found.link = t('notifications.announce.linkInvalid')
    return found
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) return
    try {
      const { recipients } = await publish.mutateAsync({
        title: values.title.trim(),
        message: values.message.trim(),
        type: values.type,
        audience: values.audience,
        link: values.link.trim() || null,
      })
      toast.success(t('notifications.announce.sent', { count: recipients }))
      onDone()
    } catch (error) {
      if (error instanceof ApiError && error.issues.length) {
        setErrors(Object.fromEntries(error.issues.map((issue) => [issue.path, t('errors.VALIDATION_FAILED')])))
      } else {
        errorToast(error)
      }
    }
  }

  const describedBy = (key: keyof Errors, hint = false) => (errors[key] ? `announcement-${key}-error` : hint ? `announcement-${key}-hint` : undefined)

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="space-y-2">
        <p id="announcement-type-label" className="text-sm font-medium">
          {t('notifications.announce.type')}
        </p>
        <RadioGroupPrimitive.Root
          value={values.type}
          onValueChange={(type) => update({ type: type as Values['type'] })}
          aria-labelledby="announcement-type-label"
          className="grid grid-cols-3 gap-2"
        >
          {TYPES.map((type) => (
            <RadioGroupPrimitive.Item
              key={type}
              value={type}
              className="flex flex-col items-center gap-1.5 rounded-lg border bg-card px-2 py-2.5 text-center text-xs font-medium outline-none transition-colors hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/[0.04] data-[state=checked]:ring-1 data-[state=checked]:ring-primary sm:flex-row sm:px-3 sm:text-left sm:text-sm"
            >
              <NotificationIcon type={type} className="size-7" />
              <span className="min-w-0 truncate">{t(`notifications.type.${type}`)}</span>
            </RadioGroupPrimitive.Item>
          ))}
        </RadioGroupPrimitive.Root>
      </div>

      <Field id="announcement-title" label={t('notifications.announce.heading')} required error={errors.title}>
        <Input
          id="announcement-title"
          maxLength={TITLE_MAX}
          value={values.title}
          onChange={(event) => update({ title: event.target.value })}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={describedBy('title')}
        />
      </Field>

      <Field
        id="announcement-message"
        label={t('notifications.announce.message')}
        required
        error={errors.message}
        hint={`${values.message.length} / ${MESSAGE_MAX}`}
      >
        <Textarea
          id="announcement-message"
          rows={4}
          maxLength={MESSAGE_MAX}
          value={values.message}
          onChange={(event) => update({ message: event.target.value })}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy('message', true)}
          className="min-h-24"
        />
      </Field>

      <Field id="announcement-audience" label={t('notifications.announce.audience')} required>
        <Select value={values.audience} onValueChange={(audience) => update({ audience: audience as Values['audience'] })}>
          <SelectTrigger id="announcement-audience" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AUDIENCES.map((audience) => (
              <SelectItem key={audience} value={audience}>
                {t(`notifications.audience.${audience}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field id="announcement-link" label={t('notifications.announce.link')} hint={t('notifications.announce.linkHint')} error={errors.link}>
        <Input
          id="announcement-link"
          placeholder="/courses"
          spellCheck={false}
          value={values.link}
          onChange={(event) => update({ link: event.target.value })}
          aria-invalid={Boolean(errors.link)}
          aria-describedby={describedBy('link', true)}
        />
      </Field>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('notifications.announce.preview')}</p>
        <div className="flex gap-3 rounded-lg border bg-muted/40 p-3" aria-hidden="true">
          <NotificationIcon type={values.type} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{values.title.trim() || t('notifications.announce.previewTitle')}</p>
            <p className="line-clamp-2 text-xs text-muted-foreground">{values.message.trim() || t('notifications.announce.previewMessage')}</p>
          </div>
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={publish.isPending}>
            {t('action.cancel')}
          </Button>
        </DialogClose>
        <Button type="submit" disabled={publish.isPending}>
          {publish.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
          {t('notifications.announce.submit')}
        </Button>
      </DialogFooter>
    </form>
  )
}
