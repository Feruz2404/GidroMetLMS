'use client'

import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { api } from '@/lib/api'
import { useNav } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  AlertTriangle,
  Send,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  ListChecks,
  Eye,
  ShieldAlert,
  Loader2,
  FileQuestion,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/lib/i18n'

// --- Types ---

type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'fill_blank'

interface OptionView {
  id: string
  text: string
  isCorrect?: boolean
  order: number
}

interface QuestionView {
  id: string
  type: QuestionType
  text: string
  points: number
  explanation?: string | null
  order: number
  options: OptionView[]
}

interface AttemptStartResponse {
  status: string
  data: {
    attemptId: string
    quiz: {
      id: string
      title: string
      description?: string | null
      timeLimitMin: number
      passingScore: number
      showAnswers: boolean
      shuffleQuestions: boolean
    }
    questions: QuestionView[]
    startedAt: string
    attemptsRemaining: number
  }
}

interface SubmitAnswerInput {
  questionId: string
  selectedOptions?: string[]
  textAnswer?: string
}

interface QuestionResult {
  id: string
  type: QuestionType
  text: string
  points: number
  explanation?: string | null
  isCorrect: boolean
  pointsAwarded: number
  selectedOptions: { id: string; text: string }[]
  correctOptions: { id: string; text: string }[]
  allOptions: OptionView[]
  textAnswer: string | null
}

interface SubmitResult {
  id: string
  quizId: string
  status: string
  score: number
  maxScore: number
  percentage: number
  passed: boolean
  startedAt: string
  submittedAt: string
  timeSpentSec: number
  canSeeAnswers: boolean
  questions: QuestionResult[]
}

interface SubmitResponse {
  status: string
  data: SubmitResult
}

interface QuizDetailResponse {
  status: string
  data: {
    id: string
    title: string
    description?: string | null
    timeLimitMin: number
    passingScore: number
    maxAttempts: number
    showAnswers: boolean
    status: string
    questions: QuestionView[]
    myAttempts: Array<{
      id: string
      status: string
      score: number
      maxScore: number
      percentage: number
      passed: boolean
      startedAt: string
      submittedAt: string | null
    }>
    maxAttemptsExceeded: boolean
    gradedAttempts: number
  }
}

interface ReviewResponse {
  status: string
  data: SubmitResult & {
    quiz: { id: string; title: string; description?: string | null; timeLimitMin: number; passingScore: number; showAnswers: boolean }
  }
}

function formatTime(sec: number): string {
  if (sec < 0) sec = 0
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// --- Main Component ---

export function QuizTakingView() {
  const params = useNav((s) => s.params)
  const navigate = useNav((s) => s.navigate)
  const { toast } = useToast()
  const { t } = useTranslation()

  const typeLabel = (type: QuestionType): string => {
    switch (type) {
      case 'single_choice':
        return t('quizzes.type.singleChoice')
      case 'multiple_choice':
        return t('quizzes.type.multipleChoice')
      case 'true_false':
        return t('quizzes.type.trueFalse')
      case 'fill_blank':
        return t('quizzes.type.fillBlank')
    }
  }

  const quizId = params.id
  const isReviewMode = params.mode === 'review'

  const [phase, setPhase] = useState<'loading' | 'taking' | 'submitting' | 'results'>('loading')
  const [quizInfo, setQuizInfo] = useState<{
    id: string
    title: string
    description?: string | null
    timeLimitMin: number
    passingScore: number
    maxAttempts: number
    showAnswers: boolean
  } | null>(null)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [startedAt, setStartedAt] = useState<number>(0)
  const [questions, setQuestions] = useState<QuestionView[]>([])
  const [answers, setAnswers] = useState<Record<string, { selected: string[]; text: string }>>({})
  const [currentIdx, setCurrentIdx] = useState(0)
  const [remainingSec, setRemainingSec] = useState(0)
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attemptsRemaining, setAttemptsRemaining] = useState(0)

  // --- Start attempt (taking mode) ---
  const startAttempt = useCallback(async () => {
    if (!quizId) return
    setPhase('loading')
    setError(null)
    try {
      const res = await api.post<AttemptStartResponse>(`/quizzes/${quizId}/attempt`)
      const d = res.data
      setQuizInfo({
        id: d.quiz.id,
        title: d.quiz.title,
        description: d.quiz.description,
        timeLimitMin: d.quiz.timeLimitMin,
        passingScore: d.quiz.passingScore,
        maxAttempts: 0,
        showAnswers: d.quiz.showAnswers,
      })
      setAttemptId(d.attemptId)
      setQuestions(d.questions)
      setStartedAt(new Date(d.startedAt).getTime())
      setRemainingSec(d.quiz.timeLimitMin * 60)
      setAnswers({})
      setCurrentIdx(0)
      setAttemptsRemaining(d.attemptsRemaining)
      setResult(null)
      setPhase('taking')
    } catch (e) {
      const msg = e instanceof Error ? e.message : t('quizzes.attemptCreateFailed')
      setError(msg)
      setPhase('loading')
    }
  }, [quizId, t])

  // --- Fetch review (review mode) ---
  const fetchReview = useCallback(async () => {
    if (!quizId) return
    setPhase('loading')
    setError(null)
    try {
      // First fetch quiz detail to find latest graded attempt
      const detail = await api.get<QuizDetailResponse>(`/quizzes/${quizId}`)
      const graded = detail.data.myAttempts.filter((a) => a.status === 'graded')
      if (graded.length === 0) {
        // No graded attempts → fall back to starting a new attempt
        await startAttempt()
        return
      }
      // Get the latest graded attempt
      const latest = graded.sort(
        (a, b) => new Date(b.submittedAt ?? b.startedAt).getTime() - new Date(a.submittedAt ?? a.startedAt).getTime()
      )[0]
      const review = await api.get<ReviewResponse>(`/quizzes/attempts/${latest.id}`)
      setQuizInfo({
        id: detail.data.id,
        title: detail.data.title,
        description: detail.data.description,
        timeLimitMin: detail.data.timeLimitMin,
        passingScore: detail.data.passingScore,
        maxAttempts: detail.data.maxAttempts,
        showAnswers: review.data.quiz.showAnswers,
      })
      setResult(review.data)
      setAttemptId(latest.id)
      setPhase('results')
    } catch (e) {
      const msg = e instanceof Error ? e.message : t('quizzes.reviewLoadFailed')
      setError(msg)
      setPhase('loading')
    }
  }, [quizId, startAttempt, t])

  // --- Submit ---
  const submitAnswers = useCallback(
    async (auto = false) => {
      if (!attemptId) return
      setSubmitDialogOpen(false)
      setPhase('submitting')
      try {
        const payload: SubmitAnswerInput[] = questions.map((q) => {
          const a = answers[q.id] ?? { selected: [], text: '' }
          if (q.type === 'fill_blank') {
            return { questionId: q.id, textAnswer: a.text.trim() }
          }
          return { questionId: q.id, selectedOptions: a.selected }
        })
        const res = await api.post<SubmitResponse>(`/quizzes/attempts/${attemptId}`, {
          answers: payload,
        })
        setResult(res.data)
        setPhase('results')
        if (auto) {
          toast({
            title: t('quizzes.timeUp'),
            description: t('quizzes.autoSubmitted'),
          })
        } else {
          toast({
            title: t('quizzes.submitted'),
            description: res.data.passed
              ? t('quizzes.passedToast').replace('{n}', String(res.data.percentage))
              : t('quizzes.failedToast').replace('{n}', String(res.data.percentage)),
            variant: res.data.passed ? 'default' : 'destructive',
          })
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : t('quizzes.submitFailed')
        toast({
          title: t('common.error'),
          description: msg,
          variant: 'destructive',
        })
        setPhase('taking')
      }
    },
    [attemptId, questions, answers, toast, t]
  )

  // Mount: kick off based on mode. Guarded so it runs exactly once per
  // quiz+mode — never on every render and never on a language switch — which
  // would otherwise restart the attempt (and re-issue POST /attempt) because
  // startAttempt/fetchReview change identity when the language changes.
  const initedKeyRef = useRef<string | null>(null)
  useEffect(() => {
    if (!quizId) return
    const key = `${quizId}:${isReviewMode ? 'review' : 'take'}`
    if (initedKeyRef.current === key) return
    initedKeyRef.current = key
    // Defer state updates via microtask to avoid synchronous setState in effect body
    if (isReviewMode) {
      Promise.resolve().then(() => fetchReview())
    } else {
      Promise.resolve().then(() => startAttempt())
    }
    // Intentionally keyed on quizId/mode only; the callbacks are excluded so a
    // re-created `startAttempt`/`fetchReview` cannot re-trigger initialization.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId, isReviewMode])

  // Timer tick
  useEffect(() => {
    if (phase !== 'taking') return
    if (remainingSec <= 0) return
    const t = setInterval(() => {
      setRemainingSec((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(t)
  }, [phase, remainingSec])

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (phase === 'taking' && remainingSec === 0 && startedAt > 0) {
      // Defer to microtask to avoid synchronous setState in effect
      Promise.resolve().then(() => submitAnswers(true))
    }
  }, [phase, remainingSec, startedAt, submitAnswers])

  // --- Answer handlers ---

  const setSingleAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { selected: [optionId], text: prev[questionId]?.text ?? '' },
    }))
  }

  const toggleMultiAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const cur = prev[questionId] ?? { selected: [], text: '' }
      const exists = cur.selected.includes(optionId)
      const next = exists
        ? cur.selected.filter((o) => o !== optionId)
        : [...cur.selected, optionId]
      return { ...prev, [questionId]: { selected: next, text: cur.text } }
    })
  }

  const setTextAnswer = (questionId: string, text: string) => {
    setAnswers((prev) => {
      const cur = prev[questionId] ?? { selected: [], text: '' }
      return { ...prev, [questionId]: { selected: cur.selected, text } }
    })
  }

  const isQuestionAnswered = (q: QuestionView): boolean => {
    const a = answers[q.id]
    if (!a) return false
    if (q.type === 'fill_blank') return a.text.trim().length > 0
    return a.selected.length > 0
  }

  const answeredCount = useMemo(
    () =>
      questions.filter((q) => {
        const a = answers[q.id]
        if (!a) return false
        if (q.type === 'fill_blank') return a.text.trim().length > 0
        return a.selected.length > 0
      }).length,
    [questions, answers]
  )

  // --- Render ---

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{t('quizzes.errorOccurred')}</h2>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
            <Button variant="outline" onClick={() => navigate('quizzes')}>
              <ArrowLeft className="w-4 h-4" /> {t('quizzes.backToQuizzes')}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (phase === 'loading') {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-16 w-full" />
        <div className="grid lg:grid-cols-[200px_1fr] gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (phase === 'submitting') {
    return (
      <div className="max-w-2xl mx-auto py-20">
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <div>
              <h2 className="text-lg font-semibold">{t('quizzes.grading')}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t('quizzes.pleaseWait')}</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (phase === 'results' && result && quizInfo) {
    return (
      <ResultsView
        result={result}
        quizTitle={quizInfo.title}
        quizDescription={quizInfo.description}
        passingScore={quizInfo.passingScore}
        maxAttempts={quizInfo.maxAttempts}
        onRetry={startAttempt}
        onBack={() => navigate('quizzes')}
        canRetry={attemptsRemaining > 0 && !isReviewMode}
        attemptsRemaining={attemptsRemaining}
      />
    )
  }

  // Taking mode
  if (!quizInfo || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20">
        <Card className="p-8 text-center">
          <FileQuestion className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">{t('quizzes.noQuestionsInTest')}</p>
          <Button variant="outline" onClick={() => navigate('quizzes')} className="mt-4">
            <ArrowLeft className="w-4 h-4" /> {t('quizzes.backToQuizzes')}
          </Button>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentIdx]
  const isLast = currentIdx === questions.length - 1
  const isFirst = currentIdx === 0
  const timerLow = remainingSec <= 60
  const answeredRatio = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Top bar */}
      <Card className="p-4 gap-0 sticky top-16 z-20">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold truncate flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate min-w-0">{quizInfo.title}</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {answeredCount} / {questions.length} {t('quizzes.questionsAnswered')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-semibold tabular-nums',
                timerLow
                  ? 'bg-destructive/10 text-destructive border-destructive/30 animate-pulse'
                  : 'bg-primary/5 text-primary border-primary/20'
              )}
            >
              <Clock className="w-4 h-4" />
              {formatTime(remainingSec)}
            </div>
            <Button onClick={() => setSubmitDialogOpen(true)} size="sm">
              <Send className="w-4 h-4" /> {t('quizzes.submit')}
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <Progress value={answeredRatio} className="h-1" />
        </div>
      </Card>

      {/* Anti-cheat banner */}
      <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md px-3 py-2">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span>{t('quizzes.antiCheatDesc')}</span>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-4">
        {/* Navigator */}
        <Card className="p-4 gap-2 self-start lg:sticky lg:top-[180px]">
          <div className="flex items-center gap-2 mb-2 text-sm font-medium">
            <ListChecks className="w-4 h-4 text-primary" />
            {t('quizzes.questions')}
          </div>
          <ScrollArea className="max-h-72 lg:max-h-[60vh] pr-2">
            <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
              {questions.map((q, i) => {
                const answered = isQuestionAnswered(q)
                const isCurrent = i === currentIdx
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(i)}
                    className={cn(
                      'aspect-square rounded-md text-sm font-medium border transition-colors',
                      isCurrent
                        ? 'bg-primary text-primary-foreground border-primary'
                        : answered
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 hover:bg-emerald-100'
                        : 'bg-background text-muted-foreground border-input hover:bg-accent'
                    )}
                    aria-label={`${t('quizzes.questionLabel').replace('{n}', String(i + 1))}${answered ? ` (${t('quizzes.questionAnsweredSuffix')})` : ''}`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </ScrollArea>
          <div className="mt-3 space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800" />
              {t('quizzes.answered')}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-background border border-input" />
              {t('quizzes.unanswered')}
            </div>
          </div>
        </Card>

        {/* Question card */}
        <Card className="gap-0">
          <CardHeader className="border-b pb-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary">
                  {t('quizzes.question')} {currentIdx + 1} / {questions.length}
                </Badge>
                <Badge variant="outline">
                  {typeLabel(currentQuestion.type)}
                </Badge>
                <Badge variant="outline" className="text-primary">
                  {t('quizzes.pointsWithValue').replace('{n}', String(currentQuestion.points))}
                </Badge>
              </div>
            </div>
            <CardTitle className="text-base leading-snug pt-1">
              {currentQuestion.text}
            </CardTitle>
            {currentQuestion.type === 'multiple_choice' && (
              <CardDescription className="text-xs flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {t('quizzes.multipleAnswersHint')}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="pt-5">
            <QuestionInput
              question={currentQuestion}
              selected={answers[currentQuestion.id]?.selected ?? []}
              textValue={answers[currentQuestion.id]?.text ?? ''}
              onSingle={(optId) => setSingleAnswer(currentQuestion.id, optId)}
              onToggle={(optId) => toggleMultiAnswer(currentQuestion.id, optId)}
              onText={(t) => setTextAnswer(currentQuestion.id, t)}
            />
          </CardContent>

          {/* Nav buttons */}
          <div className="flex items-center justify-between gap-2 p-5 pt-0 mt-auto border-t bg-muted/20">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              disabled={isFirst}
            >
              <ArrowLeft className="w-4 h-4" /> {t('common.prev')}
            </Button>
            <span className="text-xs text-muted-foreground">
              {isQuestionAnswered(currentQuestion) ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('quizzes.answered')}
                </span>
              ) : (
                t('quizzes.unanswered')
              )}
            </span>
            {isLast ? (
              <Button size="sm" onClick={() => setSubmitDialogOpen(true)}>
                <Send className="w-4 h-4" /> {t('quizzes.submit')}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
              >
                {t('common.next')} <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Submit confirmation dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('quizzes.submitTitle')}</DialogTitle>
            <DialogDescription>
              {answeredCount < questions.length
                ? t('quizzes.submitConfirmUnanswered')
                    .replace('{total}', String(questions.length))
                    .replace('{answered}', String(answeredCount))
                : t('quizzes.submitConfirmAllAnswered')}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('quizzes.answered')}</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{answeredCount} / {questions.length}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-muted-foreground">{t('quizzes.unanswered')}</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">{questions.length - answeredCount}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={() => submitAnswers(false)}>
              <Send className="w-4 h-4" /> {t('quizzes.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// --- Question input component ---

function QuestionInput({
  question,
  selected,
  textValue,
  onSingle,
  onToggle,
  onText,
}: {
  question: QuestionView
  selected: string[]
  textValue: string
  onSingle: (optId: string) => void
  onToggle: (optId: string) => void
  onText: (t: string) => void
}) {
  const { t } = useTranslation()

  if (question.type === 'fill_blank') {
    return (
      <div className="space-y-2">
        <Input
          value={textValue}
          onChange={(e) => onText(e.target.value)}
          placeholder={t('quizzes.fillBlankPlaceholder')}
          className="text-base"
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          {t('quizzes.fillBlankHint')}
        </p>
      </div>
    )
  }

  if (question.type === 'multiple_choice') {
    return (
      <div className="space-y-2">
        {question.options.map((opt) => {
          const checked = selected.includes(opt.id)
          return (
            <label
              key={opt.id}
              htmlFor={opt.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                checked
                  ? 'bg-primary/5 border-primary/40 ring-1 ring-primary/20'
                  : 'border-input hover:bg-accent'
              )}
            >
              <Checkbox
                id={opt.id}
                checked={checked}
                onCheckedChange={() => onToggle(opt.id)}
              />
              <span className="text-sm">{opt.text}</span>
            </label>
          )
        })}
      </div>
    )
  }

  // single_choice OR true_false
  return (
    <RadioGroup
      value={selected[0] ?? ''}
      onValueChange={onSingle}
      className="space-y-2"
    >
      {question.options.map((opt) => {
        const checked = selected[0] === opt.id
        return (
          <label
            key={opt.id}
            htmlFor={opt.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
              checked
                ? 'bg-primary/5 border-primary/40 ring-1 ring-primary/20'
                : 'border-input hover:bg-accent'
            )}
          >
            <RadioGroupItem id={opt.id} value={opt.id} />
            <span className="text-sm">{opt.text}</span>
          </label>
        )
      })}
    </RadioGroup>
  )
}

// --- Results view component ---

function ResultsView({
  result,
  quizTitle,
  quizDescription,
  passingScore,
  maxAttempts: _maxAttempts,
  onRetry,
  onBack,
  canRetry,
  attemptsRemaining,
}: {
  result: SubmitResult
  quizTitle: string
  quizDescription?: string | null
  passingScore: number
  maxAttempts: number
  onRetry: () => void
  onBack: () => void
  canRetry: boolean
  attemptsRemaining: number
}) {
  const passed = result.passed
  const canSeeAnswers = result.canSeeAnswers
  const correctCount = result.questions.filter((q) => q.isCorrect).length
  const timeMin = Math.floor(result.timeSpentSec / 60)
  const timeSec = result.timeSpentSec % 60
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Back */}
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="w-4 h-4" /> {t('quizzes.backToQuizzes')}
      </Button>

      {/* Score card */}
      <Card className="overflow-hidden gap-0">
        <div
          className={cn(
            'p-6 text-center',
            passed
              ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/10'
              : 'bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-900/10'
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                'w-20 h-20 rounded-full flex items-center justify-center ring-4',
                passed
                  ? 'bg-emerald-500 text-white ring-emerald-200 dark:ring-emerald-900'
                  : 'bg-amber-500 text-white ring-amber-200 dark:ring-amber-900'
              )}
            >
              {passed ? <Trophy className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
            </div>
            <Badge
              variant="outline"
              className={cn(
                'text-sm font-semibold px-3 py-1',
                passed
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800'
              )}
            >
              {passed ? t('quizzes.passedBadge') : t('quizzes.failedBadge')}
            </Badge>
            <h2 className="text-2xl font-bold">{quizTitle}</h2>
            {quizDescription && (
              <p className="text-sm text-muted-foreground max-w-md">{quizDescription}</p>
            )}
          </div>
        </div>

        <CardContent className="p-6">
          {/* Big score */}
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-primary">
              {result.percentage}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {t('quizzes.scoreOfTotal').replace('{score}', String(result.score)).replace('{max}', String(result.maxScore))}
            </div>
          </div>

          {/* Progress bar to passing score */}
          <div className="space-y-1.5 mb-6">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t('quizzes.passingScoreWithValue').replace('{n}', String(passingScore))}</span>
              <span className="font-medium">{t('quizzes.yourResult').replace('{n}', String(result.percentage))}</span>
            </div>
            <div className="relative h-3 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  'absolute top-0 left-0 h-full rounded-full transition-all',
                  passed ? 'bg-emerald-500' : 'bg-amber-500'
                )}
                style={{ width: `${Math.min(100, result.percentage)}%` }}
              />
              <div
                className="absolute top-0 h-full w-0.5 bg-foreground/40"
                style={{ left: `${passingScore}%` }}
                title={t('quizzes.passingTitle').replace('{n}', String(passingScore))}
              />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border bg-muted/30 p-3 text-center">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{correctCount}</div>
              <div className="text-xs text-muted-foreground">{t('quizzes.correctCount')}</div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 text-center">
              <div className="text-lg font-bold text-rose-600 dark:text-rose-400">{result.questions.length - correctCount}</div>
              <div className="text-xs text-muted-foreground">{t('quizzes.incorrectCount')}</div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 text-center">
              <div className="text-lg font-bold text-primary">{result.questions.length}</div>
              <div className="text-xs text-muted-foreground">{t('quizzes.total')}</div>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 text-center">
              <div className="text-lg font-bold text-primary">
                {timeMin > 0 ? `${timeMin}${t('time.minutes_short')} ` : ''}{timeSec}{t('time.seconds_short')}
              </div>
              <div className="text-xs text-muted-foreground">{t('quizzes.timeSpent')}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            {canRetry && (
              <Button onClick={onRetry} variant="default" className="flex-1">
                <RotateCcw className="w-4 h-4" /> {t('quizzes.retry')}
                {attemptsRemaining > 0 && (
                  <span className="ml-1 text-xs opacity-80">({t('quizzes.attemptsRemainingParen').replace('{n}', String(attemptsRemaining))})</span>
                )}
              </Button>
            )}
            <Button onClick={onBack} variant="outline" className="flex-1">
              <ListChecks className="w-4 h-4" /> {t('quizzes.backToQuizzes')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Per-question review */}
      {canSeeAnswers ? (
        <Card className="gap-0">
          <CardHeader className="border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              {t('quizzes.answersAnalysis')}
            </CardTitle>
            <CardDescription>
              {t('quizzes.answersAnalysisDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {result.questions.map((q, i) => (
                <QuestionReviewItem key={q.id} question={q} index={i} />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm">{t('quizzes.answersHidden')}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('quizzes.answersHiddenDescFull')}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

function QuestionReviewItem({ question, index }: { question: QuestionResult; index: number }) {
  const { t } = useTranslation()
  const isFillBlank = question.type === 'fill_blank'
  const userAnswerText = isFillBlank
    ? question.textAnswer
    : question.selectedOptions.map((o) => o.text).join(', ') || '—'

  const correctAnswerText = isFillBlank
    ? question.correctOptions.map((o) => o.text).join(' / ')
    : question.correctOptions.map((o) => o.text).join(', ')

  return (
    <div className="p-5">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold',
            question.isCorrect
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
              : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
          )}
        >
          {question.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h4 className="text-sm font-medium leading-snug">
              {index + 1}. {question.text}
            </h4>
            <Badge variant="outline" className="text-xs shrink-0">
              {t('quizzes.pointsFraction').replace('{awarded}', String(question.pointsAwarded)).replace('{total}', String(question.points))}
            </Badge>
          </div>

          {/* Options review (only for non-fill_blank) */}
          {!isFillBlank && question.allOptions.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {question.allOptions.map((opt) => {
                const isUserSelected = question.selectedOptions.some((s) => s.id === opt.id)
                const isCorrectOpt = opt.isCorrect === true
                return (
                  <div
                    key={opt.id}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-md text-sm border',
                      isCorrectOpt && isUserSelected
                        ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                        : isCorrectOpt
                        ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800'
                        : isUserSelected
                        ? 'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800'
                        : 'bg-background border-input'
                    )}
                  >
                    <span className="flex-1">{opt.text}</span>
                    {isCorrectOpt && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                    {isUserSelected && !isCorrectOpt && (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    )}
                    {isUserSelected && (
                      <span className="text-xs text-muted-foreground ml-1">{t('quizzes.yourAnswerInline')}</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Fill blank answer display */}
          {isFillBlank && (
            <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
              <div className="rounded-md border border-input p-2">
                <div className="text-xs text-muted-foreground mb-1">{t('quizzes.yourAnswer')}</div>
                <div className={question.isCorrect ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-rose-700 dark:text-rose-400'}>
                  {userAnswerText || '—'}
                </div>
              </div>
              <div className="rounded-md border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10 p-2">
                <div className="text-xs text-muted-foreground mb-1">{t('quizzes.correctAnswer')}</div>
                <div className="text-emerald-700 dark:text-emerald-400 font-medium">
                  {correctAnswerText}
                </div>
              </div>
            </div>
          )}

          {/* Explanation */}
          {question.explanation && (
            <div className="mt-3 rounded-md bg-primary/5 border border-primary/20 p-3 text-sm">
              <div className="text-xs font-medium text-primary mb-1">{t('quizzes.explanation')}</div>
              <p className="text-muted-foreground">{question.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
