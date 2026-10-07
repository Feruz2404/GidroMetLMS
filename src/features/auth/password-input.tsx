'use client'

import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/i18n/provider'

export const PasswordInput = forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(function PasswordInput(props, ref) {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Input ref={ref} {...props} type={visible ? 'text' : 'password'} className={`pr-10 ${props.className ?? ''}`} />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        className="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={visible ? t('auth.field.hidePassword') : t('auth.field.showPassword')}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
})

const RULES = [
  { key: 'auth.password.length', test: (value: string) => value.length >= 12 },
  { key: 'auth.password.lower', test: (value: string) => /[a-z]/.test(value) },
  { key: 'auth.password.upper', test: (value: string) => /[A-Z]/.test(value) },
  { key: 'auth.password.digit', test: (value: string) => /[0-9]/.test(value) },
  { key: 'auth.password.symbol', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
] as const

/** Live checklist mirroring the server password policy. */
export function PasswordChecklist({ value }: { value: string }) {
  const { t } = useI18n()
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs" aria-label={t('auth.password.requirements')}>
      {RULES.map((rule) => {
        const met = rule.test(value)
        return (
          <li key={rule.key} className={met ? 'text-success' : 'text-muted-foreground'}>
            <span aria-hidden="true">{met ? '✓' : '○'}</span> {t(rule.key)}
          </li>
        )
      })}
    </ul>
  )
}

export function passwordMeetsPolicy(value: string): boolean {
  return RULES.every((rule) => rule.test(value))
}
