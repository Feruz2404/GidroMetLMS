'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Archive, CheckCircle2, Eye, Loader2, Lock, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { ErrorState } from '@/components/shared/error-state'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useI18n } from '@/i18n/provider'
import { ApiError } from '@/lib/api-client'
import { routes } from '@/lib/routes'
import { useErrorToast } from '@/lib/use-api-error'
import type { QuestionType, QuizEditorDto } from '@/shared/dto'
import { useArchiveQuiz, useCreateQuiz, useQuizEditor, useUpdateQuiz } from './api'
import { QUESTION_TYPES, QuestionEditor } from './components/editor/question-editor'
import { QuestionPreview } from './components/editor/question-preview'
import { SettingsCard } from './components/editor/settings-card'
import {
  changeQuestionType,
  createQuestion,
  draftFromEditor,
  duplicateQuestion,
  emptySettings,
  MAX_QUESTIONS,
  snapshotQuestions,
  snapshotSettings,
  validateQuestion,
  validateSettings,
  type DraftQuestion,
  type DraftSettings,
} from './editor-model'
import { QUESTION_TYPE_LABEL } from './session-model'

function EditorSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-80 max-w-full" />
      </div>
      <Skeleton className="h-80 rounded-xl" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  )
}

export function QuizEditorPage({ quizId, courseId }: { quizId?: string; courseId?: string }) {
  return quizId ? <ExistingQuizEditor quizId={quizId} /> : <QuizEditorForm courseId={courseId} />
}

function ExistingQuizEditor({ quizId }: { quizId: string }) {
  const { t } = useI18n()
  const editor = useQuizEditor(quizId)
  if (editor.isPending) return <EditorSkeleton />
  if (editor.isError) {
    return (
      <div className="mx-auto max-w-5xl">
        <PageHeader title={t('quizzes.editor.editTitle')} back={{ href: routes.quizzes, label: t('quizzes.back') }} />
        <ErrorState error={editor.error} onRetry={() => editor.refetch()} />
      </div>
    )
  }
  return <QuizEditorForm key={quizId} editor={editor.data} />
}

interface Draft {
  settings: DraftSettings
  questions: DraftQuestion[]
}

function QuizEditorForm({ editor, courseId }: { editor?: QuizEditorDto; courseId?: string }) {
  const { t } = useI18n()
  const router = useRouter()
  const showError = useErrorToast()
  const labels = { trueLabel: t('quizzes.editor.trueOption'), falseLabel: t('quizzes.editor.falseOption') }
  const isNew = !editor

  const [saved, setSaved] = useState<Draft>(() =>
    editor ? draftFromEditor(editor) : { settings: emptySettings(courseId), questions: [createQuestion('single_choice', labels)] }
  )
  const [settings, setSettings] = useState(saved.settings)
  const [questions, setQuestions] = useState(saved.questions)
  const [locked, setLocked] = useState(editor?.hasAttempts ?? false)
  const [showErrors, setShowErrors] = useState(false)
  const [focusKey, setFocusKey] = useState<string | null>(null)

  const create = useCreateQuiz()
  const update = useUpdateQuiz(editor?.id ?? '')
  const archive = useArchiveQuiz(editor?.id ?? '')
  const pending = create.isPending || update.isPending

  const questionsChanged = snapshotQuestions(questions) !== snapshotQuestions(saved.questions)
  const dirty = questionsChanged || snapshotSettings(settings) !== snapshotSettings(saved.settings)
  const settingsCheck = validateSettings(settings)
  const questionChecks = locked ? [] : questions.map(validateQuestion)
  const invalidCount = questionChecks.filter((check) => check.errors).length + (settingsCheck.value ? 0 : 1)
  const totalPoints = questions.reduce((total, question) => total + (Number(question.points) || 0), 0)

  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const patchQuestion = (index: number, question: DraftQuestion) => setQuestions((current) => current.map((item, i) => (i === index ? question : item)))

  const insertQuestion = (index: number, question: DraftQuestion) => {
    setFocusKey(question.key)
    setQuestions((current) => [...current.slice(0, index), question, ...current.slice(index)])
  }

  const moveQuestion = (index: number, offset: -1 | 1) =>
    setQuestions((current) => {
      const next = [...current]
      ;[next[index], next[index + offset]] = [next[index + offset], next[index]]
      return next
    })

  const deleteQuestion = (index: number) => {
    const removed = questions[index]
    setQuestions((current) => current.filter((_, i) => i !== index))
    toast(t('quizzes.editor.questionDeleted'), {
      action: { label: t('quizzes.editor.undo'), onClick: () => setQuestions((current) => [...current.slice(0, index), removed, ...current.slice(index)]) },
    })
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setShowErrors(true)
    const firstInvalid = questionChecks.findIndex((check) => check.errors)
    if (!settingsCheck.value || firstInvalid >= 0) {
      toast.error(t('quizzes.editor.fixErrors'))
      if (!settingsCheck.value) window.scrollTo({ top: 0, behavior: 'smooth' })
      else document.querySelector(`[data-question-index="${firstInvalid}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    const questionInputs = questionChecks.flatMap((check) => (check.value ? [check.value] : []))
    try {
      if (isNew) {
        const created = await create.mutateAsync({ ...settingsCheck.value, questions: questionInputs })
        toast.success(t('quizzes.editor.created'))
        router.push(routes.quiz(created.id))
        return
      }
      await update.mutateAsync({ ...settingsCheck.value, ...(questionsChanged && !locked ? { questions: questionInputs } : {}) })
      setSaved({ settings, questions })
      setShowErrors(false)
      toast.success(t('quizzes.editor.saved'))
    } catch (error) {
      if (error instanceof ApiError && error.code === 'QUIZ_HAS_ATTEMPTS') {
        setLocked(true)
        setQuestions(saved.questions)
      }
      showError(error)
    }
  }

  const archiveQuiz = async () => {
    try {
      await archive.mutateAsync()
      toast.success(t('quizzes.editor.archived'))
      router.push(routes.quizzes)
    } catch (error) {
      showError(error)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-5xl">
      <PageHeader
        back={isNew ? { href: routes.quizzes, label: t('quizzes.back') } : { href: routes.quiz(editor.id), label: t('quizzes.editor.backToQuiz') }}
        title={isNew ? t('quizzes.editor.newTitle') : t('quizzes.editor.editTitle')}
        description={isNew ? t('quizzes.editor.newDescription') : editor.title}
        actions={
          !isNew && (
            <>
              <Button asChild variant="outline">
                <Link href={routes.quiz(editor.id)}>
                  <Eye aria-hidden="true" />
                  {t('action.view')}
                </Link>
              </Button>
              {saved.settings.status !== 'archived' && (
                <ConfirmDialog
                  destructive
                  title={t('quizzes.editor.archiveTitle')}
                  description={t('quizzes.editor.archiveBody')}
                  confirmLabel={t('action.archive')}
                  onConfirm={archiveQuiz}
                  trigger={
                    <Button type="button" variant="outline" className="text-destructive hover:text-destructive">
                      <Archive aria-hidden="true" />
                      {t('action.archive')}
                    </Button>
                  }
                />
              )}
            </>
          )
        }
      />

      <div className="space-y-8">
        <SettingsCard settings={settings} errors={showErrors ? settingsCheck.errors : {}} isNew={isNew} onChange={(patch) => setSettings((current) => ({ ...current, ...patch }))} />

        <section className="space-y-4" aria-labelledby="questions-title">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 id="questions-title" className="text-lg font-semibold tracking-tight">
                {t('quizzes.editor.questions')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('common.questions', { count: questions.length })} · {t('quizzes.points', { count: totalPoints })}
              </p>
            </div>
          </div>

          {locked ? (
            <>
              <div className="flex gap-3 rounded-xl border border-info/30 bg-info/10 p-4 text-sm">
                <Lock className="mt-0.5 size-4 shrink-0 text-info" aria-hidden="true" />
                <div className="space-y-0.5">
                  <p className="font-medium">{t('quizzes.editor.lockedTitle')}</p>
                  <p className="text-muted-foreground">{t('quizzes.editor.lockedHint')}</p>
                </div>
              </div>
              {questions.map((question, index) => (
                <QuestionPreview key={question.key} question={question} index={index} />
              ))}
            </>
          ) : (
            <>
              {questions.map((question, index) => (
                <QuestionEditor
                  key={question.key}
                  question={question}
                  index={index}
                  total={questions.length}
                  errors={showErrors ? questionChecks[index]?.errors ?? null : null}
                  onChange={(next) => patchQuestion(index, next)}
                  onTypeChange={(type) => patchQuestion(index, changeQuestionType(question, type, labels))}
                  onMove={(offset) => moveQuestion(index, offset)}
                  onDuplicate={() => insertQuestion(index + 1, duplicateQuestion(question))}
                  onDelete={() => deleteQuestion(index)}
                  autoFocus={question.key === focusKey}
                />
              ))}
              {questions.length < MAX_QUESTIONS && <AddQuestionBar onAdd={(type) => insertQuestion(questions.length, createQuestion(type, labels))} />}
            </>
          )}
        </section>
      </div>

      <div className="sticky bottom-4 z-20 mt-8 flex items-center justify-between gap-3 rounded-xl border bg-card/95 p-3 pl-4 shadow-[var(--shadow-elevated)] backdrop-blur sm:pl-5">
        <p className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground sm:text-sm" role="status">
          {showErrors && invalidCount > 0 ? (
            <>
              <AlertCircle className="size-4 shrink-0 text-destructive" aria-hidden="true" />
              {t('quizzes.editor.invalidCount', { count: invalidCount })}
            </>
          ) : dirty || isNew ? (
            <>
              <span className="size-2 shrink-0 rounded-full bg-warning" aria-hidden="true" />
              {isNew && !dirty ? t('quizzes.editor.notSavedYet') : t('state.unsavedChanges')}
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />
              {t('quizzes.editor.allSaved')}
            </>
          )}
        </p>
        <div className="flex shrink-0 gap-2">
          {!isNew && dirty && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSettings(saved.settings)
                setQuestions(saved.questions)
                setShowErrors(false)
              }}
              disabled={pending}
              className="hidden sm:inline-flex"
            >
              {t('quizzes.editor.discard')}
            </Button>
          )}
          <Button type="submit" disabled={pending || (!isNew && !dirty)}>
            {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
            {isNew ? t('quizzes.editor.create') : t('action.saveChanges')}
          </Button>
        </div>
      </div>
    </form>
  )
}

function AddQuestionBar({ onAdd }: { onAdd: (type: QuestionType) => void }) {
  const { t } = useI18n()
  return (
    <div className="rounded-xl border border-dashed bg-card/50 p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-medium">
        <Plus className="size-4 text-primary" aria-hidden="true" />
        {t('quizzes.editor.addQuestion')}
      </p>
      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 md:grid-cols-4">
        {QUESTION_TYPES.map(({ type, icon: Icon }) => (
          <Button key={type} type="button" variant="outline" onClick={() => onAdd(type)} className="justify-start bg-card">
            <Icon className="text-primary" aria-hidden="true" />
            {t(QUESTION_TYPE_LABEL[type])}
          </Button>
        ))}
      </div>
    </div>
  )
}
