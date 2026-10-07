'use client'

import { useCallback, useState } from 'react'
import type { MessageKey } from '@/i18n'
import { useI18n } from '@/i18n/provider'
import { ApiError } from '@/lib/api-client'

/**
 * Open state plus the record a dialog acts on. The record is kept after
 * closing so the content does not change while the close animation runs.
 */
export function useDialogTarget<T>() {
  const [state, setState] = useState<{ target: T | null; open: boolean }>({ target: null, open: false })
  const show = useCallback((target: T) => setState({ target, open: true }), [])
  const onOpenChange = useCallback((open: boolean) => setState((current) => ({ ...current, open })), [])
  return { target: state.target, open: state.open, show, onOpenChange }
}

/** Maps server-side validation issues (VALIDATION_FAILED) to localized messages keyed by field. */
export function useFieldIssues() {
  const { t } = useI18n()
  return useCallback(
    (error: unknown): Record<string, string> => {
      if (!(error instanceof ApiError)) return {}
      return Object.fromEntries(
        error.issues.map((issue) => {
          if (issue.message.startsWith('PASSWORD_')) return [issue.path, t(`validation.${issue.message}` as MessageKey)]
          if (issue.path === 'email') return [issue.path, t('validation.invalidEmail')]
          if (issue.path === 'username') return [issue.path, t('auth.field.usernameHint')]
          return [issue.path, t('errors.VALIDATION_FAILED')]
        })
      )
    },
    [t]
  )
}
