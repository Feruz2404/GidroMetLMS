'use client'

import { useCallback } from 'react'
import { useErrorToast } from '@/lib/use-api-error'
import { useRegisterDownload } from './api'

/**
 * Registers the download, then opens the vetted URL in a new tab.
 * The tab is opened synchronously inside the click so popup blockers allow it,
 * and its opener is cut before navigating (the noopener guarantee).
 */
export function useOpenDocument() {
  const { mutate, isPending, variables } = useRegisterDownload()
  const onError = useErrorToast()

  const open = useCallback(
    (resourceId: string) => {
      const tab = window.open('', '_blank')
      if (tab) tab.opener = null
      mutate(resourceId, {
        onSuccess: ({ url }) => {
          if (tab) tab.location.replace(url)
          else window.open(url, '_blank', 'noopener,noreferrer')
        },
        onError: (error) => {
          tab?.close()
          onError(error)
        },
      })
    },
    [mutate, onError]
  )

  return { open, pendingId: isPending ? variables : undefined }
}
