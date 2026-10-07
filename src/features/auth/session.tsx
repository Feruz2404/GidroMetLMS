'use client'

import { createContext, useCallback, useContext, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import { routes } from '@/lib/routes'
import type { CurrentUserDto } from '@/shared/dto'
import {
  canManageContent,
  canViewReports,
  isAdminRole,
  isInstructorRole,
  isLearnerRole,
  isManagerRole,
  type Permission,
} from '@/shared/roles'

export const sessionKey = ['auth', 'me'] as const

interface SessionValue {
  user: CurrentUserDto
  can: (permission: Permission) => boolean
  isLearner: boolean
  isInstructor: boolean
  isManager: boolean
  isAdmin: boolean
  canManageContent: boolean
  canViewReports: boolean
  setUser: (user: CurrentUserDto) => void
  signOut: () => Promise<void>
}

const SessionContext = createContext<SessionValue | null>(null)

/** Holds the signed-in user. The server layout resolves it, so pages never render signed-out. */
export function SessionProvider({ initialUser, children }: { initialUser: CurrentUserDto; children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data } = useQuery({
    queryKey: sessionKey,
    queryFn: () => api.get<CurrentUserDto>('/auth/me'),
    initialData: initialUser,
    staleTime: 5 * 60_000,
  })
  const user = data ?? initialUser

  const setUser = useCallback((next: CurrentUserDto) => queryClient.setQueryData(sessionKey, next), [queryClient])
  const signOut = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      queryClient.clear()
      router.replace(routes.login())
      router.refresh()
    }
  }, [queryClient, router])

  const value = useMemo<SessionValue>(
    () => ({
      user,
      can: (permission) => user.permissions.includes(permission),
      isLearner: isLearnerRole(user.role),
      isInstructor: isInstructorRole(user.role),
      isManager: isManagerRole(user.role),
      isAdmin: isAdminRole(user.role),
      canManageContent: canManageContent(user.role),
      canViewReports: canViewReports(user.role),
      setUser,
      signOut,
    }),
    [user, setUser, signOut]
  )
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionValue {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession must be used inside <SessionProvider>')
  return context
}
