'use client'

import { useState } from 'react'
import { Copy, Eye, EyeOff, Info, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Field } from '@/components/shared/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordChecklist } from '@/features/auth/password-input'
import { useI18n } from '@/i18n/provider'
import { generatePassword } from '../lib'

interface TemporaryPasswordFieldProps {
  id: string
  value: string
  onChange: (value: string) => void
  error?: string | null
}

/** Administrator-issued password with a generator, copy button and policy checklist. */
export function TemporaryPasswordField({ id, value, onChange, error }: TemporaryPasswordFieldProps) {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)

  const generate = () => {
    onChange(generatePassword())
    setVisible(true)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(t('users.password.copied'))
    } catch {
      toast.error(t('users.password.copyFailed'))
    }
  }

  return (
    <div className="space-y-3">
      <Field id={id} label={t('users.password.temporary')} required error={error}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id={id}
              type={visible ? 'text' : 'password'}
              autoComplete="new-password"
              spellCheck={false}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              className="pr-10 font-mono"
            />
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              className="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              aria-label={visible ? t('auth.field.hidePassword') : t('auth.field.showPassword')}
            >
              {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <Button type="button" variant="outline" size="icon" onClick={copy} disabled={!value} aria-label={t('users.password.copy')}>
            <Copy aria-hidden="true" />
          </Button>
        </div>
      </Field>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PasswordChecklist value={value} />
        <Button type="button" variant="soft" size="sm" onClick={generate} className="self-start">
          <Sparkles aria-hidden="true" />
          {t('users.password.generate')}
        </Button>
      </div>
      <p className="flex items-start gap-2 rounded-lg border border-info/20 bg-info/[0.07] px-3 py-2.5 text-xs leading-relaxed">
        <Info className="mt-px size-4 shrink-0 text-info" aria-hidden="true" />
        {t('users.password.firstSignIn')}
      </p>
    </div>
  )
}
