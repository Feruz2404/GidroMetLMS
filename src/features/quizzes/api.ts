'use client'

import { useCallback } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type {
  AttemptResultDto,
  AttemptSessionDto,
  AttemptSummaryDto,
  QuizDetailDto,
  QuizEditorDto,
  QuizListItemDto,
  SubmittedAnswerDto,
  UserSummaryDto,
} from '@/shared/dto'
import type { QuizInput, QuizUpdateInput } from '@/shared/schemas'

export interface QuizListParams {
  search?: string
  status?: string
  courseId?: string
  view?: 'all' | 'available' | 'passed' | 'managed'
  page?: number
  limit?: number
}

/** GET /api/quizzes/attempts/[id]: the open session to resume, or the graded result. */
export type AttemptView = { kind: 'session'; session: AttemptSessionDto } | { kind: 'result'; result: AttemptResultDto }

/** A row of GET /api/quizzes/[id]/attempts (authors' results table). */
export type QuizResultRowDto = AttemptSummaryDto & { learner: UserSummaryDto }

export const quizKeys = {
  all: ['quizzes'] as const,
  list: (params: QuizListParams) => ['quizzes', 'list', params] as const,
  detail: (id: string) => ['quizzes', 'detail', id] as const,
  results: (id: string) => ['quizzes', 'results', id] as const,
  editor: (id: string) => ['quizzes', 'editor', id] as const,
  attempt: (id: string) => ['quizzes', 'attempt', id] as const,
  savedAnswers: (id: string) => ['quizzes', 'attempt', id, 'answers'] as const,
}

export function useQuizzes(params: QuizListParams) {
  return useQuery({
    queryKey: quizKeys.list(params),
    queryFn: () => api.page<QuizListItemDto>('/quizzes', { ...params }),
    placeholderData: keepPreviousData,
  })
}

export function useQuiz(id: string) {
  return useQuery({ queryKey: quizKeys.detail(id), queryFn: () => api.get<QuizDetailDto>(`/quizzes/${id}`) })
}

export function useQuizResults(id: string) {
  return useQuery({ queryKey: quizKeys.results(id), queryFn: () => api.get<QuizResultRowDto[]>(`/quizzes/${id}/attempts`) })
}

export function useQuizEditor(id: string) {
  // Always fresh: the editor must never overwrite questions from a stale copy.
  return useQuery({ queryKey: quizKeys.editor(id), queryFn: () => api.get<QuizEditorDto>(`/quizzes/${id}/editor`), staleTime: 0 })
}

export function useAttempt(id: string) {
  return useQuery({ queryKey: quizKeys.attempt(id), queryFn: () => api.get<AttemptView>(`/quizzes/attempts/${id}`), staleTime: 0 })
}

export function useSavedAnswers(attemptId: string) {
  return useQuery({
    queryKey: quizKeys.savedAnswers(attemptId),
    queryFn: () => api.get<SubmittedAnswerDto[]>(`/quizzes/attempts/${attemptId}/answers`),
    staleTime: 0,
    gcTime: 0,
  })
}

function invalidateLearning(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: quizKeys.all })
  void queryClient.invalidateQueries({ queryKey: ['courses'] })
  void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  void queryClient.invalidateQueries({ queryKey: ['notifications'] })
  void queryClient.invalidateQueries({ queryKey: ['certificates'] })
}

/** Starts a new attempt, or resumes the open one; the session is cached for the attempt page. */
export function useStartAttempt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (quizId: string) => api.post<AttemptSessionDto>(`/quizzes/${quizId}/attempt`),
    onSuccess: (session) => {
      const view: AttemptView = { kind: 'session', session }
      queryClient.setQueryData(quizKeys.attempt(session.attemptId), view)
      void queryClient.invalidateQueries({ queryKey: quizKeys.detail(session.quiz.id) })
      void queryClient.invalidateQueries({ queryKey: ['quizzes', 'list'] })
    },
  })
}

/**
 * Refetches assessment data (including an open attempt) after the server closed
 * an attempt on its own — time limit or another tab — so the result shows.
 */
export function useRefreshAssessments() {
  const queryClient = useQueryClient()
  return useCallback(() => invalidateLearning(queryClient), [queryClient])
}

export function useSaveAnswers(attemptId: string) {
  return useMutation({
    mutationFn: (answers: SubmittedAnswerDto[]) => api.put<{ saved: number }>(`/quizzes/attempts/${attemptId}/answers`, { answers }),
  })
}

export function useSubmitAttempt(attemptId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (answers: SubmittedAnswerDto[]) => api.post<AttemptResultDto>(`/quizzes/attempts/${attemptId}`, { answers }),
    onSuccess: (result) => {
      const view: AttemptView = { kind: 'result', result }
      queryClient.setQueryData(quizKeys.attempt(attemptId), view)
      invalidateLearning(queryClient)
    },
  })
}

export function useCreateQuiz() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: QuizInput) => api.post<QuizEditorDto>('/quizzes', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: quizKeys.all })
      void queryClient.invalidateQueries({ queryKey: ['courses'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateQuiz(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: QuizUpdateInput) => api.patch<QuizEditorDto>(`/quizzes/${id}`, input),
    onSuccess: (editor) => {
      queryClient.setQueryData(quizKeys.editor(id), editor)
      void queryClient.invalidateQueries({ queryKey: quizKeys.all })
      void queryClient.invalidateQueries({ queryKey: ['courses'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useArchiveQuiz(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.delete<{ archived: boolean }>(`/quizzes/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: quizKeys.all })
      void queryClient.invalidateQueries({ queryKey: ['courses'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
