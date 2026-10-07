'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { buttonVariants } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: React.ReactNode
  confirmLabel?: string
  destructive?: boolean
  onConfirm: () => Promise<unknown> | unknown
}

/** Confirmation for irreversible or significant actions; stays open while the action runs. */
export function ConfirmDialog({ trigger, open, onOpenChange, title, description, confirmLabel, destructive, onConfirm }: ConfirmDialogProps) {
  const { t } = useI18n()
  const [internalOpen, setInternalOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const isOpen = open ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  return (
    <AlertDialog open={isOpen} onOpenChange={(next) => !pending && setOpen(next)}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{t('action.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            className={cn(destructive && buttonVariants({ variant: 'destructive' }))}
            onClick={async (event) => {
              event.preventDefault()
              setPending(true)
              try {
                await onConfirm()
                setOpen(false)
              } finally {
                setPending(false)
              }
            }}
          >
            {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
            {confirmLabel ?? t('action.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
