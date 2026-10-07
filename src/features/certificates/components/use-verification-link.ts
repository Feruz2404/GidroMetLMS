'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { useI18n } from '@/i18n/provider'
import { verificationUrl } from './certificate-qr'

/** Copy / share helpers for a certificate's public verification link. */
export function useVerificationLink(hash: string) {
  const { t } = useI18n()

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl(hash))
      toast.success(t('certificates.detail.linkCopied'))
    } catch {
      toast.error(t('certificates.detail.copyFailed'))
    }
  }, [hash, t])

  const share = useCallback(
    async (title: string) => {
      if (typeof navigator.share !== 'function') return copy()
      try {
        await navigator.share({ title, text: t('certificates.detail.shareText', { course: title }), url: verificationUrl(hash) })
      } catch (error) {
        // Closing the share sheet is not an error worth reporting.
        if (!(error instanceof DOMException && error.name === 'AbortError')) await copy()
      }
    },
    [copy, hash, t]
  )

  return { copy, share }
}
