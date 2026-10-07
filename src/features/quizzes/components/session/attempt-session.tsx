'use client'

import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { History } from 'lucide-react'
import { toast } from 'sonner'
import { ErrorState } from '@/components/shared/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { useI18n } from '@/i18n/provider'
import { useErrorToast } from '@/lib/use-api-error'
import type { AttemptSessionDto } from '@/shared/dto'
import { useRefreshAssessments, useSavedAnswers, useSubmitAttempt } from '../../api'
import { useAutosave } from '../../hooks/use-autosave'
import { useCountdown } from '../../hooks/use-countdown'
import { answersFromSaved, EMPTY_ANSWER, isAnswered, isAttemptClosed, toSubmitted, type AnswerDraft, type AnswerMap } from '../../session-model'
import { QuestionCard } from './question-card'
import { QuestionNavigator } from './question-navigator'
import { SessionHeader } from './session-header'
import { SubmitDialog } from './submit-dialog'

export function SessionSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-5" aria-busy="true">
      <Skeleton className="h-[5.5rem] rounded-xl" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  )
}

/** Restores autosaved answers, then hands over to the runner. */
export function AttemptSession({ session }: { session: AttemptSessionDto }) {
  const saved = useSavedAnswers(session.attemptId)
  if (saved.isPending) return <SessionSkeleton />
  if (saved.isError) return <ErrorState error={saved.error} onRetry={() => saved.refetch()} />
  return <SessionRunner key={session.attemptId} session={session} initialAnswers={answersFromSaved(saved.data)} />
}

function SessionRunner({ session, initialAnswers }: { session: AttemptSessionDto; initialAnswers: AnswerMap }) {
  const { t } = useI18n()
  const showError = useErrorToast()
  const reload = useRefreshAssessments()
  const submit = useSubmitAttempt(session.attemptId)
  const questions = session.questions

  const [answers, setAnswers] = useState(initialAnswers)
  const answersRef = useRef(initialAnswers)
  const [restored] = useState(() => questions.filter((question) => isAnswered(question, initialAnswers[question.id])).length)
  const [index, setIndex] = useState(() => Math.max(0, questions.findIndex((question) => !isAnswered(question, initialAnswers[question.id]))))
  const [flagged, setFlagged] = useState<string[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const finishing = useRef(false)
  const moved = useRef(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const autosave = useAutosave({
    attemptId: session.attemptId,
    payload: (ids) => questions.filter((question) => ids.includes(question.id)).map((question) => toSubmitted(question, answersRef.current[question.id])),
    onClosed: () => {
      toast.info(t('quizzes.session.closedElsewhere'))
      reload()
    },
  })

  const answeredCount = questions.filter((question) => isAnswered(question, answers[question.id])).length
  const question = questions[index]

  const updateAnswer = (questionId: string, answer: AnswerDraft) => {
    answersRef.current = { ...answersRef.current, [questionId]: answer }
    setAnswers(answersRef.current)
    autosave.mark(questionId)
  }

  const goTo = (next: number) => {
    moved.current = true
    setIndex(Math.max(0, Math.min(questions.length - 1, next)))
  }

  const toggleFlag = (questionId: string) =>
    setFlagged((current) => (current.includes(questionId) ? current.filter((id) => id !== questionId) : [...current, questionId]))

  const finish = async (reason: 'manual' | 'timeout') => {
    if (finishing.current) return
    finishing.current = true
    setSubmitting(true)
    await autosave.stop()
    const payload = questions
      .filter((item) => isAnswered(item, answersRef.current[item.id]))
      .map((item) => toSubmitted(item, answersRef.current[item.id]))
    try {
      await submit.mutateAsync(payload)
      if (reason === 'timeout') toast.info(t('quizzes.session.timeUp'))
      window.scrollTo({ top: 0 })
    } catch (error) {
      if (isAttemptClosed(error)) {
        reload()
        return
      }
      finishing.current = false
      autosave.resume()
      setSubmitting(false)
      showError(error)
    }
  }

  const remaining = useCountdown(session.expiresAt, () => {
    setConfirmOpen(false)
    void finish('timeout')
  })

  // Move focus to the new question so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (!moved.current) return
    moved.current = false
    const heading = headingRef.current
    heading?.focus({ preventScroll: true })
    const card = heading?.closest('section')
    if (card && card.getBoundingClientRect().top < 160) card.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [index])

  const flushNow = useEffectEvent(() => void autosave.flush())

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    const onHide = () => {
      if (document.visibilityState === 'hidden') flushNow()
    }
    window.addEventListener('beforeunload', warn)
    document.addEventListener('visibilitychange', onHide)
    return () => {
      window.removeEventListener('beforeunload', warn)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [])

  const reviewUnanswered = () => {
    setConfirmOpen(false)
    const target = questions.findIndex((item) => !isAnswered(item, answersRef.current[item.id]))
    if (target >= 0) goTo(target)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <SessionHeader
        title={session.quiz.title}
        remaining={remaining}
        answered={answeredCount}
        total={questions.length}
        saveStatus={autosave.status}
        submitting={submitting}
        onSubmit={() => setConfirmOpen(true)}
      />

      {restored > 0 && (
        <p className="mt-4 flex items-center gap-2 rounded-lg border border-info/30 bg-info/10 px-4 py-2.5 text-sm">
          <History className="size-4 shrink-0 text-info" aria-hidden="true" />
          {t('quizzes.session.restored', { count: restored })}
        </p>
      )}

      <div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <QuestionCard
          question={question}
          index={index}
          total={questions.length}
          answer={answers[question.id] ?? EMPTY_ANSWER}
          flagged={flagged.includes(question.id)}
          onAnswer={(answer) => updateAnswer(question.id, answer)}
          onToggleFlag={() => toggleFlag(question.id)}
          onPrevious={() => goTo(index - 1)}
          onNext={() => goTo(index + 1)}
          onFinish={() => setConfirmOpen(true)}
          headingRef={headingRef}
        />
        <QuestionNavigator
          items={questions.map((item) => ({ id: item.id, answered: isAnswered(item, answers[item.id]), flagged: flagged.includes(item.id) }))}
          current={index}
          onSelect={goTo}
          onSubmit={() => setConfirmOpen(true)}
          submitting={submitting}
          className="lg:sticky lg:top-40"
        />
      </div>

      <SubmitDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        answered={answeredCount}
        total={questions.length}
        flagged={flagged.length}
        submitting={submitting}
        onSubmit={() => void finish('manual')}
        onReviewUnanswered={reviewUnanswered}
      />
    </div>
  )
}
