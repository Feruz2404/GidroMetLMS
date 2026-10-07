'use client'

import { keepPreviousData, useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { CertificateDto, CertificateStatus, CertificateSyncResultDto, CourseLearnerDto, PublicCertificateDto } from '@/shared/dto'

export interface CertificateListParams {
  search?: string
  courseId?: string
  status?: CertificateStatus
  page?: number
  limit?: number
}

export const certificateKeys = {
  all: ['certificates'] as const,
  list: (params: CertificateListParams) => ['certificates', 'list', params] as const,
  detail: (id: string) => ['certificates', 'detail', id] as const,
  verify: (hash: string) => ['certificates', 'verify', hash] as const,
  learners: (courseId: string) => ['certificates', 'learners', courseId] as const,
}

export function useCertificates(params: CertificateListParams) {
  return useQuery({
    queryKey: certificateKeys.list(params),
    queryFn: () => api.page<CertificateDto>('/certificates', { ...params }),
    placeholderData: keepPreviousData,
  })
}

export function useCertificate(id: string) {
  return useQuery({ queryKey: certificateKeys.detail(id), queryFn: () => api.get<CertificateDto>(`/certificates/${id}`) })
}

/** Public lookup by verification code; works without a session. */
export function useCertificateVerification(hash: string) {
  return useQuery({
    queryKey: certificateKeys.verify(hash),
    queryFn: () => api.get<PublicCertificateDto>('/certificates/verify', { hash }),
  })
}

/** Course roster used to pick a learner when issuing a certificate manually. */
export function useCourseLearners(courseId: string | null) {
  return useQuery({
    queryKey: certificateKeys.learners(courseId ?? ''),
    queryFn: () => api.get<CourseLearnerDto[]>(`/courses/${courseId}/learners`),
    enabled: Boolean(courseId),
  })
}

function invalidateAfterChange(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: certificateKeys.all })
  void queryClient.invalidateQueries({ queryKey: ['courses'] })
  void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  void queryClient.invalidateQueries({ queryKey: ['notifications'] })
}

export function useIssueCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { userId: string; courseId: string }) => api.post<CertificateDto>('/certificates/generate', input),
    onSuccess: () => invalidateAfterChange(queryClient),
  })
}

export function useSyncCertificates() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.post<CertificateSyncResultDto>('/certificates/auto'),
    onSuccess: () => invalidateAfterChange(queryClient),
  })
}

export function useRevokeCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string | null }) => api.patch<CertificateDto>(`/certificates/${id}`, { status: 'revoked', reason }),
    onSuccess: (certificate) => {
      queryClient.setQueryData(certificateKeys.detail(certificate.id), certificate)
      invalidateAfterChange(queryClient)
    },
  })
}
