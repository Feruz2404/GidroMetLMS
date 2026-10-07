'use client'

import { keepPreviousData, useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type {
  CategoryDto,
  CourseCardDto,
  CourseDetailDto,
  CourseEnrollmentDto,
  CourseLearnerDto,
  DepartmentDto,
  LearnerCandidateDto,
  LessonDetailDto,
  LessonProgressResultDto,
  SectionDto,
  UserListItemDto,
} from '@/shared/dto'
import type { CourseInput, CourseUpdateInput, LessonInput, LessonUpdateInput, SectionInput } from '@/shared/schemas'

export interface CourseListParams {
  search?: string
  categoryId?: string
  level?: string
  status?: string
  view?: 'all' | 'enrolled' | 'completed' | 'managed'
  sort?: 'newest' | 'popular' | 'title'
  page?: number
  limit?: number
}

export const courseKeys = {
  all: ['courses'] as const,
  lists: ['courses', 'list'] as const,
  list: (params: CourseListParams) => ['courses', 'list', params] as const,
  detail: (id: string) => ['courses', 'detail', id] as const,
  categories: ['courses', 'categories'] as const,
  lesson: (id: string) => ['courses', 'lesson', id] as const,
  learners: (id: string) => ['courses', 'learners', id] as const,
  departments: ['courses', 'departments'] as const,
  people: (role: 'instructor' | 'learner', search: string) => ['courses', 'people', role, search] as const,
  candidates: (courseId: string, search: string) => ['courses', 'candidates', courseId, search] as const,
}

export function useCourses(params: CourseListParams) {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => api.page<CourseCardDto>('/courses', { ...params }),
    placeholderData: keepPreviousData,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: courseKeys.categories,
    queryFn: () => api.get<CategoryDto[]>('/categories'),
    staleTime: 5 * 60_000,
  })
}

export function useCourse(id: string) {
  return useQuery({ queryKey: courseKeys.detail(id), queryFn: () => api.get<CourseDetailDto>(`/courses/${id}`) })
}

export function useEnroll() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (courseId: string) => api.post<CourseEnrollmentDto>(`/courses/${courseId}/enroll`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.all })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

// --- Learning -------------------------------------------------------------------

export function useLesson(id: string) {
  return useQuery({ queryKey: courseKeys.lesson(id), queryFn: () => api.get<LessonDetailDto>(`/lessons/${id}`) })
}

function patchLesson(queryClient: QueryClient, lessonId: string, patch: Partial<LessonDetailDto>) {
  queryClient.setQueryData<LessonDetailDto>(courseKeys.lesson(lessonId), (lesson) => (lesson ? { ...lesson, ...patch } : lesson))
}

/** Silent watch-time heartbeat: keeps the cached lesson in sync without refetching anything. */
export function useRecordWatchTime(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { lessonId: string; watchTimeSec: number }) =>
      api.post<LessonProgressResultDto>(`/courses/${courseId}/progress`, input),
    onSuccess: (result) => patchLesson(queryClient, result.lessonId, { watchTimeSec: result.watchTimeSec }),
  })
}

export function useCompleteLesson(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { lessonId: string; watchTimeSec?: number }) =>
      api.post<LessonProgressResultDto>(`/courses/${courseId}/progress`, { ...input, completed: true }),
    onSuccess: (result) => {
      patchLesson(queryClient, result.lessonId, { isCompleted: result.isCompleted, watchTimeSec: result.watchTimeSec })
      void queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) })
      void queryClient.invalidateQueries({ queryKey: courseKeys.lists })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
      if (result.certificateIssued) void queryClient.invalidateQueries({ queryKey: ['certificates'] })
    },
  })
}

// --- Authoring --------------------------------------------------------------------

/** Course data visible in lists, the course page and the dashboard after an authoring change. */
function invalidateCourse(queryClient: QueryClient, courseId: string) {
  void queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) })
  void queryClient.invalidateQueries({ queryKey: courseKeys.lists })
  void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
}

/** Course fields edited in the details form; status changes go through publishing. */
export type CourseDraftInput = Omit<CourseInput, 'status' | 'tutorId'> & { tutorId?: string | null }

export function useCreateCourse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CourseDraftInput) => api.post<CourseCardDto>('/courses', input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.lists })
      void queryClient.invalidateQueries({ queryKey: courseKeys.categories })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateCourse(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CourseUpdateInput) => api.patch<CourseCardDto>(`/courses/${courseId}`, input),
    onSuccess: () => {
      invalidateCourse(queryClient, courseId)
      void queryClient.invalidateQueries({ queryKey: courseKeys.categories })
    },
  })
}

export function useArchiveCourse(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.delete<{ archived: boolean }>(`/courses/${courseId}`),
    onSuccess: () => {
      invalidateCourse(queryClient, courseId)
      void queryClient.invalidateQueries({ queryKey: courseKeys.categories })
    },
  })
}

/** Applies a local reorder immediately and rolls it back if the server rejects it. */
function useOptimisticReorder<TVars>(
  courseId: string,
  request: (vars: TVars) => Promise<unknown>,
  reorder: (sections: SectionDto[], vars: TVars) => SectionDto[]
) {
  const queryClient = useQueryClient()
  const key = courseKeys.detail(courseId)
  return useMutation({
    mutationFn: request,
    onMutate: async (vars: TVars) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<CourseDetailDto>(key)
      if (previous) queryClient.setQueryData<CourseDetailDto>(key, { ...previous, sections: reorder(previous.sections, vars) })
      return { previous }
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },
    onSettled: () => invalidateCourse(queryClient, courseId),
  })
}

function byIds<T extends { id: string }>(items: T[], ids: string[]): T[] {
  const rank = new Map(ids.map((id, index) => [id, index]))
  return [...items].sort((a, b) => (rank.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.id) ?? Number.MAX_SAFE_INTEGER))
}

export function useReorderSections(courseId: string) {
  return useOptimisticReorder<string[]>(
    courseId,
    (ids) => api.put(`/courses/${courseId}/sections`, { ids }),
    (sections, ids) => byIds(sections, ids)
  )
}

export function useReorderLessons(courseId: string) {
  return useOptimisticReorder<{ sectionId: string; ids: string[] }>(
    courseId,
    ({ sectionId, ids }) => api.put(`/sections/${sectionId}/order`, { ids }),
    (sections, { sectionId, ids }) =>
      sections.map((section) => (section.id === sectionId ? { ...section, lessons: byIds(section.lessons, ids) } : section))
  )
}

export function useCreateSection(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SectionInput) => api.post<{ id: string }>(`/courses/${courseId}/sections`, input),
    onSuccess: () => invalidateCourse(queryClient, courseId),
  })
}

export function useUpdateSection(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }: SectionInput & { id: string }) => api.patch<{ id: string }>(`/sections/${id}`, input),
    onSuccess: () => invalidateCourse(queryClient, courseId),
  })
}

export function useDeleteSection(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sectionId: string) => api.delete<{ deleted: boolean }>(`/sections/${sectionId}`),
    onSuccess: () => invalidateCourse(queryClient, courseId),
  })
}

export function useCreateLesson(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: LessonInput) => api.post<{ id: string }>(`/courses/${courseId}/lessons`, input),
    onSuccess: () => invalidateCourse(queryClient, courseId),
  })
}

export function useUpdateLesson(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...input }: LessonUpdateInput & { id: string }) => api.patch<{ id: string }>(`/lessons/${id}`, input),
    onSuccess: (_lesson, { id }) => {
      invalidateCourse(queryClient, courseId)
      void queryClient.invalidateQueries({ queryKey: courseKeys.lesson(id) })
    },
  })
}

export function useDeleteLesson(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (lessonId: string) => api.delete<{ deleted: boolean }>(`/lessons/${lessonId}`),
    onSuccess: (_result, lessonId) => {
      queryClient.removeQueries({ queryKey: courseKeys.lesson(lessonId) })
      invalidateCourse(queryClient, courseId)
    },
  })
}

// --- Learners & assignment ------------------------------------------------------------

export function useCourseLearners(courseId: string) {
  return useQuery({ queryKey: courseKeys.learners(courseId), queryFn: () => api.get<CourseLearnerDto[]>(`/courses/${courseId}/learners`) })
}

export interface AssignCourseInput {
  userIds?: string[]
  department?: string
  deadlineAt?: string
}

export function useAssignCourse(courseId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: AssignCourseInput) => api.post<{ matched: number; created: number }>(`/courses/${courseId}/assign`, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.learners(courseId) })
      invalidateCourse(queryClient, courseId)
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useDepartments() {
  return useQuery({
    queryKey: courseKeys.departments,
    queryFn: () => api.get<DepartmentDto[]>('/departments'),
    staleTime: 10 * 60_000,
  })
}

/** Directory lookup for tutor and learner pickers; the endpoint requires `users.manage`. */
export function usePeople(role: 'instructor' | 'learner', search: string, enabled = true) {
  return useQuery({
    queryKey: courseKeys.people(role, search),
    queryFn: () => api.page<UserListItemDto>('/users', { role, search: search || undefined, status: 'active', limit: role === 'instructor' ? 100 : 20 }),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    enabled,
  })
}

/** Learners a course manager can assign individually (scoped endpoint, available to instructors too). */
export function useAssignableLearners(courseId: string, search: string) {
  return useQuery({
    queryKey: courseKeys.candidates(courseId, search),
    queryFn: () => api.get<LearnerCandidateDto[]>(`/courses/${courseId}/candidates`, { search: search || undefined }),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })
}
