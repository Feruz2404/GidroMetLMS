'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from '@/features/auth/session'
import { api } from '@/lib/api-client'
import type { CurrentUserDto } from '@/shared/dto'
import type { ChangePasswordInput, ProfileUpdateInput } from '@/shared/schemas'

/** Updates the signed-in user's profile and refreshes the session with the result. */
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { setUser } = useSession()
  return useMutation({
    mutationFn: (input: ProfileUpdateInput) => api.patch<CurrentUserDto>('/auth/me', input),
    onSuccess: (user) => {
      setUser(user)
      // The user directory shows names and positions.
      void queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/** Changes the password; the server signs out every other session and clears `mustChangePassword`. */
export function useChangePassword() {
  const { setUser } = useSession()
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => api.post<CurrentUserDto>('/auth/password', input),
    onSuccess: setUser,
  })
}
