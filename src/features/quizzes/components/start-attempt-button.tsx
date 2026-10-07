'use client'

import { useRouter } from 'next/navigation'
import { PlayCircle, RotateCcw } from 'lucide-react'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { useErrorToast } from '@/lib/use-api-error'
import { useStartAttempt } from '../api'

interface StartAttemptButtonProps {
  quiz: { id: string; questionCount: number; timeLimitMin: number; attemptsRemaining: number | null }
  /** A retake: labelled "Try again" instead of "Start". */
  retry?: boolean
  variant?: 'default' | 'outline'
  size?: 'default' | 'lg'
  className?: string
}

/** Starts an attempt after a confirmation (the timer cannot be paused), then opens it. */
export function StartAttemptButton({ quiz, retry = false, variant = 'default', size = 'default', className }: StartAttemptButtonProps) {
  const { t } = useI18n()
  const router = useRouter()
  const start = useStartAttempt()
  const showError = useErrorToast()

  const begin = async () => {
    try {
      const session = await start.mutateAsync(quiz.id)
      router.push(routes.attempt(session.attemptId))
    } catch (error) {
      showError(error)
    }
  }

  return (
    <ConfirmDialog
      title={t('quizzes.start.confirmTitle')}
      description={t('quizzes.start.confirmBody', {
        questions: t('common.questions', { count: quiz.questionCount }),
        duration: t('common.minutes', { count: quiz.timeLimitMin }),
        remaining: quiz.attemptsRemaining ?? 0,
      })}
      confirmLabel={t('quizzes.action.start')}
      onConfirm={begin}
      trigger={
        <Button variant={variant} size={size} className={className}>
          {retry ? <RotateCcw aria-hidden="true" /> : <PlayCircle aria-hidden="true" />}
          {retry ? t('quizzes.action.retry') : t('quizzes.action.start')}
        </Button>
      }
    />
  )
}
