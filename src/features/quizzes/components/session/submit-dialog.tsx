'use client'

import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'

interface SubmitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  answered: number
  total: number
  flagged: number
  submitting: boolean
  onSubmit: () => void
  onReviewUnanswered: () => void
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: 'warning' | 'success' }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2.5 text-center">
      <p
        className={cn(
          'text-xl font-semibold tabular-nums',
          tone === 'warning' && 'text-warning-foreground dark:text-warning',
          tone === 'success' && 'text-success'
        )}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

/** Final confirmation before grading, with a summary of unanswered and flagged questions. */
export function SubmitDialog({ open, onOpenChange, answered, total, flagged, submitting, onSubmit, onReviewUnanswered }: SubmitDialogProps) {
  const { t } = useI18n()
  const unanswered = total - answered

  return (
    <AlertDialog open={open} onOpenChange={(next) => !submitting && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('quizzes.submit.title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('quizzes.submit.description')}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid grid-cols-3 gap-2">
          <Stat label={t('quizzes.session.stateAnswered')} value={answered} tone={unanswered === 0 ? 'success' : undefined} />
          <Stat label={t('quizzes.session.stateUnanswered')} value={unanswered} tone={unanswered > 0 ? 'warning' : undefined} />
          <Stat label={t('quizzes.session.stateFlagged')} value={flagged} tone={flagged > 0 ? 'warning' : undefined} />
        </div>

        {unanswered > 0 ? (
          <p className="flex gap-2.5 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-foreground dark:text-warning" aria-hidden="true" />
            {t('quizzes.submit.unansweredWarning', { count: unanswered })}
          </p>
        ) : (
          <p className="flex gap-2.5 rounded-lg border border-success/30 bg-success/10 p-3 text-sm">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            {t('quizzes.submit.allAnswered')}
          </p>
        )}

        <AlertDialogFooter className="gap-2">
          {unanswered > 0 ? (
            <Button variant="outline" onClick={onReviewUnanswered} disabled={submitting}>
              {t('quizzes.submit.reviewUnanswered')}
            </Button>
          ) : (
            <AlertDialogCancel disabled={submitting}>{t('quizzes.submit.keepWorking')}</AlertDialogCancel>
          )}
          <Button onClick={onSubmit} disabled={submitting}>
            {submitting && <Loader2 className="animate-spin" aria-hidden="true" />}
            {t('quizzes.submit.confirm')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
