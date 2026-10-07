'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Field } from '@/components/shared/field'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/i18n/provider'
import { useErrorToast } from '@/lib/use-api-error'
import type { CertificateDto } from '@/shared/dto'
import { useRevokeCertificate } from '../api'

const REASON_MAX = 500

interface RevokeDialogProps {
  certificate: Pick<CertificateDto, 'id' | 'certNumber' | 'recipient'> | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Revokes a certificate with an optional reason that is sent to the learner. */
export function RevokeDialog({ certificate, open, onOpenChange }: RevokeDialogProps) {
  const { t } = useI18n()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('certificates.revoke.title')}</DialogTitle>
          {certificate && (
            <DialogDescription>{t('certificates.revoke.description', { number: certificate.certNumber, name: certificate.recipient.fullName })}</DialogDescription>
          )}
        </DialogHeader>
        {certificate && <RevokeForm certificateId={certificate.id} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function RevokeForm({ certificateId, onDone }: { certificateId: string; onDone: () => void }) {
  const { t } = useI18n()
  const revoke = useRevokeCertificate()
  const onError = useErrorToast()
  const [reason, setReason] = useState('')

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    revoke.mutate(
      { id: certificateId, reason: reason.trim() || null },
      {
        onSuccess: () => {
          toast.success(t('certificates.revoke.done'))
          onDone()
        },
        onError,
      }
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field id="revoke-reason" label={t('certificates.revoke.reason')} hint={t('certificates.revoke.reasonHint')}>
        <Textarea
          id="revoke-reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          maxLength={REASON_MAX}
          rows={3}
          placeholder={t('certificates.revoke.reasonPlaceholder')}
          aria-describedby="revoke-reason-hint"
        />
      </Field>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={revoke.isPending}>
          {t('action.close')}
        </Button>
        <Button type="submit" variant="destructive" disabled={revoke.isPending}>
          {revoke.isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
          {t('certificates.revoke.confirm')}
        </Button>
      </DialogFooter>
    </form>
  )
}
