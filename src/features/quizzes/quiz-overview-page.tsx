'use client'

import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { ErrorState } from '@/components/shared/error-state'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useI18n } from '@/i18n/provider'
import { routes } from '@/lib/routes'
import { useQuiz } from './api'
import { AttemptHistory } from './components/attempt-history'
import { QuizResults } from './components/quiz-results'
import { QuizRules } from './components/quiz-rules'
import { StartPanel } from './components/start-panel'

function OverviewSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-96 max-w-full" />
        <Skeleton className="h-4 w-[32rem] max-w-full" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  )
}

export function QuizOverviewPage({ quizId }: { quizId: string }) {
  const { t } = useI18n()
  const quiz = useQuiz(quizId)

  if (quiz.isPending) return <OverviewSkeleton />
  if (quiz.isError) {
    return (
      <div>
        <PageHeader title={t('quizzes.list.title')} back={{ href: routes.quizzes, label: t('quizzes.back') }} />
        <ErrorState error={quiz.error} onRetry={() => quiz.refetch()} />
      </div>
    )
  }

  const data = quiz.data
  const learner = data.my !== null

  return (
    <div>
      <PageHeader
        back={{ href: routes.quizzes, label: t('quizzes.back') }}
        eyebrow={data.course?.title ?? t('quizzes.standalone')}
        title={
          <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
            {data.title}
            {data.status !== 'published' && <StatusBadge status={data.status} className="align-middle" />}
          </span>
        }
        description={data.description}
        actions={
          data.canManage && (
            <Button asChild variant="outline">
              <Link href={routes.quizEditor(data.id)}>
                <Pencil aria-hidden="true" />
                {t('action.edit')}
              </Link>
            </Button>
          )
        }
      />

      {learner ? (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <aside className="lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1">
            <StartPanel quiz={data} />
          </aside>
          <div className="min-w-0 space-y-6 lg:col-start-1 lg:row-start-1">
            <QuizRules quiz={data} />
            <AttemptHistory attempts={data.attempts} passingScore={data.passingScore} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <QuizRules quiz={data} />
          {data.canManage && <QuizResults quizId={data.id} passingScore={data.passingScore} />}
        </div>
      )}
    </div>
  )
}
