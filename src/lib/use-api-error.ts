'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { useI18n } from '@/i18n/provider'
import type { MessageKey } from '@/i18n'
import { ApiError } from './api-client'

/** Turns any thrown error into a localized, user-facing message. */
export function useErrorMessage() {
  const { t } = useI18n()
  return useCallback(
    (error: unknown): string => {
      if (error instanceof ApiError) return t(`errors.${error.code}` as MessageKey)
      return t('errors.INTERNAL_ERROR')
    },
    [t]
  )
}

/** Shows a localized error toast; returns a handler suitable for `onError`. */
export function useErrorToast() {
  const message = useErrorMessage()
  return useCallback((error: unknown) => toast.error(message(error)), [message])
}
