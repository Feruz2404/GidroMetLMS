import { ApiError } from '@/lib/api-client'
import type { QuestionType, SubmittedAnswerDto, TakingQuestionDto } from '@/shared/dto'
import type { MessageKey } from '@/i18n'

/** A learner's in-progress answer: chosen option ids, or the typed text for fill-in questions. */
export interface AnswerDraft {
  selected: string[]
  text: string
}

export type AnswerMap = Record<string, AnswerDraft>

export const EMPTY_ANSWER: AnswerDraft = { selected: [], text: '' }

export const QUESTION_TYPE_LABEL: Record<QuestionType, MessageKey> = {
  single_choice: 'quizzes.type.single_choice',
  multiple_choice: 'quizzes.type.multiple_choice',
  true_false: 'quizzes.type.true_false',
  fill_blank: 'quizzes.type.fill_blank',
}

/** Splits fill-in question text on its gap marker (two or more underscores). */
export const GAP_PATTERN = /_{2,}/

export function answersFromSaved(saved: SubmittedAnswerDto[]): AnswerMap {
  return Object.fromEntries(saved.map((answer) => [answer.questionId, { selected: answer.selectedOptions ?? [], text: answer.textAnswer ?? '' }]))
}

export function isAnswered(question: TakingQuestionDto, answer: AnswerDraft | undefined): boolean {
  if (!answer) return false
  return question.type === 'fill_blank' ? answer.text.trim().length > 0 : answer.selected.length > 0
}

export function toSubmitted(question: TakingQuestionDto, answer: AnswerDraft | undefined): SubmittedAnswerDto {
  const draft = answer ?? EMPTY_ANSWER
  return question.type === 'fill_blank'
    ? { questionId: question.id, textAnswer: draft.text }
    : { questionId: question.id, selectedOptions: draft.selected }
}

/** The server has already closed the attempt (time limit or another tab), so its result is ready. */
export function isAttemptClosed(error: unknown): boolean {
  return error instanceof ApiError && (error.code === 'ATTEMPT_FINALIZED' || error.code === 'TIME_LIMIT_EXCEEDED')
}

/** `h:mm:ss` above an hour, `mm:ss` otherwise. */
export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const rest = String(seconds % 60).padStart(2, '0')
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}:${rest}` : `${String(minutes).padStart(2, '0')}:${rest}`
}
