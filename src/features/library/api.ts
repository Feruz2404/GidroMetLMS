'use client'

import { keepPreviousData, useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { api, type Page } from '@/lib/api-client'
import type { z } from 'zod'
import type { LibraryFacetsDto, LibraryResourceDto } from '@/shared/dto'
import type { resourceInputSchema, resourceUpdateSchema } from '@/shared/schemas'

/** Request bodies as the API accepts them (before server-side defaults and normalisation). */
export type ResourcePayload = z.input<typeof resourceInputSchema>
export type ResourcePatch = z.input<typeof resourceUpdateSchema>

export type LibrarySort = 'newest' | 'popular' | 'downloads' | 'title' | 'year'

export interface LibraryListParams {
  search?: string
  type?: string
  category?: string
  language?: string
  year?: string
  status?: 'active' | 'archived'
  bookmarked?: boolean
  sort?: LibrarySort
  page?: number
  limit?: number
}

export const libraryKeys = {
  all: ['library'] as const,
  lists: ['library', 'list'] as const,
  list: (params: LibraryListParams) => ['library', 'list', params] as const,
  facets: ['library', 'facets'] as const,
  detail: (id: string) => ['library', 'detail', id] as const,
  related: (id: string) => ['library', 'related', id] as const,
}

export function useLibrary(params: LibraryListParams) {
  return useQuery({
    queryKey: libraryKeys.list(params),
    queryFn: () => api.page<LibraryResourceDto>('/library', { ...params, bookmarked: params.bookmarked ? 'true' : undefined }),
    placeholderData: keepPreviousData,
  })
}

export function useLibraryFacets() {
  return useQuery({
    queryKey: libraryKeys.facets,
    queryFn: () => api.get<LibraryFacetsDto>('/library/facets'),
    staleTime: 5 * 60_000,
  })
}

export function useResource(id: string) {
  return useQuery({ queryKey: libraryKeys.detail(id), queryFn: () => api.get<LibraryResourceDto>(`/library/${id}`) })
}

export function useRelatedResources(id: string) {
  return useQuery({
    queryKey: libraryKeys.related(id),
    queryFn: () => api.get<LibraryResourceDto[]>(`/library/${id}/related`),
  })
}

type CachedLibraryData = Page<LibraryResourceDto> | LibraryResourceDto | LibraryResourceDto[] | LibraryFacetsDto

/** Applies `update` to one resource wherever it is cached (lists, detail, related). */
function patchCachedResource(queryClient: QueryClient, id: string, update: (resource: LibraryResourceDto) => LibraryResourceDto) {
  const apply = (resource: LibraryResourceDto) => (resource.id === id ? update(resource) : resource)
  queryClient.setQueriesData<CachedLibraryData>({ queryKey: libraryKeys.all }, (data) => {
    if (!data) return data
    if (Array.isArray(data)) return data.map(apply)
    if ('items' in data) return { ...data, items: data.items.map(apply) }
    if ('id' in data) return apply(data)
    return data
  })
}

/** Optimistic bookmark toggle, reverted if the request fails. */
export function useToggleBookmark() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (resource: LibraryResourceDto) => api.post<{ bookmarked: boolean }>(`/library/${resource.id}/bookmark`),
    onMutate: async (resource) => {
      await queryClient.cancelQueries({ queryKey: libraryKeys.all })
      const snapshot = queryClient.getQueriesData<CachedLibraryData>({ queryKey: libraryKeys.all })
      const bookmarked = !resource.bookmarked
      patchCachedResource(queryClient, resource.id, (current) => ({
        ...current,
        bookmarked,
        bookmarkCount: Math.max(0, current.bookmarkCount + (bookmarked ? 1 : -1)),
      }))
      return { snapshot }
    },
    onError: (_error, _resource, context) => {
      context?.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data))
    },
    onSuccess: ({ bookmarked }, resource) => {
      patchCachedResource(queryClient, resource.id, (current) => ({ ...current, bookmarked }))
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: libraryKeys.lists }),
  })
}

/** Records the download and returns the vetted file URL. */
export function useRegisterDownload() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.post<{ url: string; downloadCount: number }>(`/library/${id}/download`),
    onSuccess: ({ downloadCount }, id) => {
      patchCachedResource(queryClient, id, (current) => ({ ...current, downloadCount }))
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Detail queries are patched in place rather than invalidated: every GET of a resource counts as a view.
function invalidateCollections(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: libraryKeys.lists })
  void queryClient.invalidateQueries({ queryKey: libraryKeys.facets })
  void queryClient.invalidateQueries({ queryKey: ['library', 'related'] })
  void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
}

export function useCreateResource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ResourcePayload) => api.post<LibraryResourceDto>('/library', input),
    onSuccess: () => invalidateCollections(queryClient),
  })
}

export function useUpdateResource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ResourcePatch }) => api.patch<LibraryResourceDto>(`/library/${id}`, input),
    onSuccess: (resource) => {
      queryClient.setQueryData(libraryKeys.detail(resource.id), resource)
      invalidateCollections(queryClient)
    },
  })
}

export function useArchiveResource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete<{ archived: boolean }>(`/library/${id}`),
    onSuccess: (_result, id) => {
      patchCachedResource(queryClient, id, (current) => ({ ...current, status: 'archived' }))
      invalidateCollections(queryClient)
    },
  })
}
