'use client'

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { DepartmentDto, UserDetailDto, UserListItemDto } from '@/shared/dto'
import type { CreateUserInput, UpdateUserInput } from '@/shared/schemas'

export interface UserListParams {
  search?: string
  role?: string
  status?: 'active' | 'inactive'
  department?: string
  page?: number
  limit?: number
}

export const userKeys = {
  all: ['users'] as const,
  list: (params: UserListParams) => ['users', 'list', params] as const,
  detail: (id: string) => ['users', 'detail', id] as const,
  departments: ['departments'] as const,
}

export function useUsers(params: UserListParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => api.page<UserListItemDto>('/users', { ...params }),
    placeholderData: keepPreviousData,
  })
}

export function useUser(id: string | null) {
  return useQuery({
    queryKey: userKeys.detail(id ?? ''),
    queryFn: () => api.get<UserDetailDto>(`/users/${id}`),
    enabled: Boolean(id),
  })
}

export function useDepartments() {
  return useQuery({
    queryKey: userKeys.departments,
    queryFn: () => api.get<DepartmentDto[]>('/departments'),
    staleTime: 10 * 60_000,
  })
}

function useInvalidateUsers() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: userKeys.all })
    void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }
}

export function useCreateUser() {
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: (input: CreateUserInput) => api.post<UserListItemDto>('/users', input),
    onSuccess: invalidate,
  })
}

export function useUpdateUser() {
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) => api.patch<UserListItemDto>(`/users/${id}`, input),
    onSuccess: invalidate,
  })
}

export function useResetUserPassword() {
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) => api.post<UserListItemDto>(`/users/${id}/password`, { password }),
    onSuccess: invalidate,
  })
}

export function useSetUserStatus() {
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => api.patch<UserListItemDto>(`/users/${id}/status`, { isActive }),
    onSuccess: invalidate,
  })
}
