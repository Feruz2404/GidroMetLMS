'use client'

import { AlarmClock, Check, CloudOff, Loader2, Send } from 'lucide-react'
import { ProgressBar } from '@/components/shared/progress-bar'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'
import type { SaveStatus } from '../../hooks/use-autosave'
import { formatClock } from '../../session-model'

const WARNING_SECONDS = 5 * 60
const DANGER_SECONDS = 60

function SaveIndicator({ status }: { status: SaveStatus }) {
  const { t } = useI18n()
  if (status === 'idle') return null
  const config = {
    pending: { icon: null, label: t('quizzes.session.unsaved'), className: 'text-muted-foreground' },
    saving: { icon: Loader2, label: t('state.saving'), className: 'text-muted-foreground' },
    saved: { icon: Check, label: t('state.saved'), className: 'text-success' },
    error: { icon: CloudOff, label: t('quizzes.session.saveFailed'), className: 'text-destructive' },
  }[status]
  const Icon = config.icon
  return (
    <span className={cn('inline-flex items-center gap-1', config.className)}>
      {Icon ? (
        <Icon className={cn('size-3.5', status === 'saving' && 'animate-spin')} aria-hidden="true" />
      ) : (
        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      )}
      {config.label}
    </span>
  )
}

function TimerPill({ remaining }: { remaining: number | null }) {
  const { t } = useI18n()
  const tone = remaining === null ? 'normal' : remaining <= DANGER_SECONDS ? 'danger' : remaining <= WARNING_SECONDS ? 'warning' : 'normal'
  return (
    <div
      role="timer"
      aria-label={t('quizzes.session.timeLeft')}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-semibold tabular-nums transition-colors',
        tone === 'normal' && 'bg-muted/50',
        tone === 'warning' && 'border-warning/50 bg-warning/15 text-warning-foreground dark:text-warning',
        tone === 'danger' && 'border-destructive/40 bg-destructive/10 text-destructive'
      )}
    >
      <AlarmClock className={cn('size-4', tone === 'danger' && 'animate-pulse')} aria-hidden="true" />
      <span className="min-w-[3.25rem] text-center font-mono">{remaining === null ? '--:--' : formatClock(remaining)}</span>
    </div>
  )
}

/** Live announcement when the time crosses the 5-minute and 1-minute marks. */
function TimeAnnouncer({ remaining }: { remaining: number | null }) {
  const { t } = useI18n()
  const message =
    remaining === null || remaining > WARNING_SECONDS ? '' : remaining > DANGER_SECONDS ? t('quizzes.session.fiveMinutesLeft') : t('quizzes.session.oneMinuteLeft')
  return (
    <p className="sr-only" aria-live="assertive">
      {message}
    </p>
  )
}

interface SessionHeaderProps {
  title: string
  remaining: number | null
  answered: number
  total: number
  saveStatus: SaveStatus
  submitting: boolean
  onSubmit: () => void
}

/** Sticky bar of the test-taking screen: title, save state, countdown, progress and submit. */
export function SessionHeader({ title, remaining, answered, total, saveStatus, submitting, onSubmit }: SessionHeaderProps) {
  const { t } = useI18n()
  return (
    <div className="sticky top-16 z-20 -mt-2 bg-background pt-2">
      <div className="rounded-xl border bg-card px-4 py-3 shadow-[var(--shadow-card)] sm:px-5">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold sm:text-base">{title}</h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
              <span className="tabular-nums">{t('quizzes.session.answered', { answered, total })}</span>
              <SaveIndicator status={saveStatus} />
            </div>
          </div>
          <TimerPill remaining={remaining} />
          <Button onClick={onSubmit} disabled={submitting} className="hidden sm:inline-flex">
            {submitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
            {t('quizzes.session.submit')}
          </Button>
        </div>
        <ProgressBar value={total ? (answered / total) * 100 : 0} size="sm" className="mt-3" />
      </div>
      <TimeAnnouncer remaining={remaining} />
    </div>
  )
}
