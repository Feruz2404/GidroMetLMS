'use client'

import { ErrorState } from '@/components/shared/error-state'
import { PageHeader } from '@/components/shared/page-header'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { useAttempt } from './api'
import { AttemptResult } from './components/result/attempt-result'
import { AttemptSession, SessionSkeleton } from './components/session/attempt-session'

/** One attempt: the focused test-taking screen while open, the result once graded. */
export function AttemptPage({ attemptId }: { attemptId: string }) {
  const { t } = useI18n()
  const attempt = useAttempt(attemptId)

  if (attempt.isPending) return <SessionSkeleton />
  if (attempt.isError) {
    return (
      <div>
        <PageHeader title={t('quizzes.attempt.title')} back={{ href: routes.quizzes, label: t('quizzes.back') }} />
        <ErrorState error={attempt.error} onRetry={() => attempt.refetch()} />
      </div>
    )
  }
  return attempt.data.kind === 'session' ? <AttemptSession session={attempt.data.session} /> : <AttemptResult result={attempt.data.result} />
}
