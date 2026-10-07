// Client-side draft of an assessment in the editor, its conversions to the API
// payload, and validation that mirrors the server schemas for early feedback.
import type { MessageKey } from '@/i18n'
import type { QuestionType, QuizEditorDto, QuizStatus } from '@/shared/dto'
import { questionInputSchema, quizInputSchema, type QuestionInput } from '@/shared/schemas'

export const MAX_OPTIONS = 10
export const MAX_QUESTIONS = 200

export interface DraftOption {
  key: string
  text: string
  isCorrect: boolean
}

export interface DraftQuestion {
  key: string
  type: QuestionType
  text: string
  points: string
  explanation: string
  options: DraftOption[]
}

export interface DraftSettings {
  title: string
  description: string
  courseId: string
  status: QuizStatus
  timeLimitMin: string
  passingScore: string
  maxAttempts: string
  shuffleQuestions: boolean
  showAnswers: boolean
}

/** Default option texts for true/false questions, in the author's language. */
export interface TrueFalseLabels {
  trueLabel: string
  falseLabel: string
}

let sequence = 0
/** Stable client-side identity for list rendering; never sent to the server. */
export const newKey = () => `draft-${++sequence}`

const option = (text: string, isCorrect: boolean): DraftOption => ({ key: newKey(), text, isCorrect })

function blankOptions(type: QuestionType, labels: TrueFalseLabels): DraftOption[] {
  if (type === 'true_false') return [option(labels.trueLabel, false), option(labels.falseLabel, false)]
  if (type === 'fill_blank') return [option('', true)]
  return [option('', false), option('', false), option('', false), option('', false)]
}

export function createQuestion(type: QuestionType, labels: TrueFalseLabels): DraftQuestion {
  return { key: newKey(), type, text: '', points: '1', explanation: '', options: blankOptions(type, labels) }
}

export function duplicateQuestion(question: DraftQuestion): DraftQuestion {
  return { ...question, key: newKey(), options: question.options.map((item) => option(item.text, item.isCorrect)) }
}

/** Switches a question's type, keeping whatever options still make sense. */
export function changeQuestionType(question: DraftQuestion, type: QuestionType, labels: TrueFalseLabels): DraftQuestion {
  if (type === question.type) return question
  const choiceSource = question.type === 'single_choice' || question.type === 'multiple_choice'
  let options: DraftOption[]
  if (type === 'fill_blank') {
    const answers = choiceSource ? question.options.filter((item) => item.isCorrect && item.text.trim()) : []
    options = answers.length ? answers.map((item) => option(item.text, true)) : blankOptions(type, labels)
  } else if (type === 'true_false' || !choiceSource) {
    options = blankOptions(type, labels)
  } else {
    let seenCorrect = false
    options = question.options.map((item) => {
      // A single-answer question keeps only the first correct option.
      const isCorrect = type === 'single_choice' ? item.isCorrect && !seenCorrect : item.isCorrect
      if (isCorrect) seenCorrect = true
      return { ...item, isCorrect }
    })
  }
  return { ...question, type, options }
}

export function emptySettings(courseId: string | undefined): DraftSettings {
  return {
    title: '',
    description: '',
    courseId: courseId ?? '',
    status: 'draft',
    timeLimitMin: '30',
    passingScore: '70',
    maxAttempts: '3',
    shuffleQuestions: false,
    showAnswers: true,
  }
}

export function draftFromEditor(editor: QuizEditorDto): { settings: DraftSettings; questions: DraftQuestion[] } {
  return {
    settings: {
      title: editor.title,
      description: editor.description ?? '',
      courseId: editor.courseId ?? '',
      status: editor.status,
      timeLimitMin: String(editor.timeLimitMin),
      passingScore: String(editor.passingScore),
      maxAttempts: String(editor.maxAttempts),
      shuffleQuestions: editor.shuffleQuestions,
      showAnswers: editor.showAnswers,
    },
    questions: editor.questions.map((question) => ({
      key: newKey(),
      type: question.type,
      text: question.text,
      points: String(question.points),
      explanation: question.explanation ?? '',
      options: question.options.map((item) => option(item.text, item.isCorrect)),
    })),
  }
}

function rawQuestion(question: DraftQuestion) {
  return {
    type: question.type,
    text: question.text,
    points: question.points,
    explanation: question.explanation,
    options: question.options.map(({ text, isCorrect }) => ({ text, isCorrect })),
  }
}

function rawSettings(settings: DraftSettings) {
  return { ...settings, courseId: settings.courseId || null }
}

/** Comparable snapshots, used to detect unsaved changes and whether questions changed. */
export const snapshotSettings = (settings: DraftSettings) => JSON.stringify(rawSettings(settings))
export const snapshotQuestions = (questions: DraftQuestion[]) => JSON.stringify(questions.map(rawQuestion))

export interface QuestionErrors {
  text?: MessageKey
  points?: MessageKey
  options?: MessageKey
  /** Option keys whose text is missing or too long. */
  optionKeys: string[]
}

const OPTION_ERRORS: Record<string, MessageKey> = {
  FILL_BLANK_ANSWERS: 'quizzes.editor.error.FILL_BLANK_ANSWERS',
  TOO_FEW_OPTIONS: 'quizzes.editor.error.TOO_FEW_OPTIONS',
  NO_CORRECT_OPTION: 'quizzes.editor.error.NO_CORRECT_OPTION',
  SINGLE_CORRECT_ONLY: 'quizzes.editor.error.SINGLE_CORRECT_ONLY',
}

export function validateQuestion(question: DraftQuestion): { errors: QuestionErrors | null; value: QuestionInput | null } {
  const parsed = questionInputSchema.safeParse(rawQuestion(question))
  if (parsed.success) return { errors: null, value: parsed.data }
  const errors: QuestionErrors = { optionKeys: [] }
  for (const issue of parsed.error.issues) {
    const [field, index, child] = issue.path
    if (field === 'text') errors.text = 'quizzes.editor.error.text'
    else if (field === 'points') errors.points = 'quizzes.editor.error.points'
    else if (field === 'options' && typeof index === 'number' && child === 'text') {
      const key = question.options[index]?.key
      if (key) errors.optionKeys.push(key)
      errors.options ??= 'quizzes.editor.error.optionText'
    } else if (field === 'options') {
      errors.options = OPTION_ERRORS[issue.message] ?? 'quizzes.editor.error.NO_OPTIONS'
    }
  }
  return { errors, value: null }
}

const settingsSchema = quizInputSchema.omit({ questions: true })

export type SettingsField = 'title' | 'description' | 'timeLimitMin' | 'passingScore' | 'maxAttempts'
export type SettingsErrors = Partial<Record<SettingsField, MessageKey>>

const SETTINGS_ERRORS: Record<SettingsField, MessageKey> = {
  title: 'quizzes.editor.error.title',
  description: 'quizzes.editor.error.description',
  timeLimitMin: 'quizzes.editor.error.timeLimit',
  passingScore: 'quizzes.editor.error.passingScore',
  maxAttempts: 'quizzes.editor.error.maxAttempts',
}

export function validateSettings(settings: DraftSettings) {
  const parsed = settingsSchema.safeParse(rawSettings(settings))
  if (parsed.success) return { errors: {} as SettingsErrors, value: parsed.data }
  const errors: SettingsErrors = {}
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as SettingsField
    if (field in SETTINGS_ERRORS) errors[field] = SETTINGS_ERRORS[field]
  }
  return { errors, value: null }
}
