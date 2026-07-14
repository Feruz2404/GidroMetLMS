// Auth & navigation stores using Zustand
// Token-based auth: token stored in localStorage, sent as Bearer header.
'use client'

import { create } from 'zustand'
import {
  api,
  registerAuthErrorHandler,
  clearToken,
  ApiError,
  type User,
} from '@/lib/api'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
  updateUser: (data: Partial<User>) => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  login: async (email, password) => {
    set({ loading: true })
    try {
      const res = await api.post<{ status: string; data: User }>('/auth', { email, password })
      // Store token in localStorage — sent as Bearer header on all subsequent requests
      clearToken()
      set({ user: res.data, initialized: true })
      useNav.setState({ view: res.data.mustChangePassword ? 'settings' : 'dashboard', params: {} })
      return res.data
    } finally {
      set({ loading: false })
    }
  },

  logout: async () => {
    try {
      await api.delete('/auth')
    } catch {
      // ignore — token may already be invalid
    }
    clearToken()
    set({ user: null })
  },

  fetchUser: async () => {
    // If no token in localStorage, skip the API call (not logged in)
    try {
      const res = await api.get<{ status: string; data: User }>('/auth/me')
      set({ user: res.data, initialized: true })
      if (res.data.mustChangePassword) useNav.setState({ view: 'settings', params: {} })
    } catch {
      clearToken()
      set({ user: null, initialized: true })
    }
  },

  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}))

// Register a global auth-error handler so that ANY API request returning 401
// clears the auth state and returns the user to the login screen.
registerAuthErrorHandler(() => {
  if (useAuth.getState().user) {
    clearToken()
    useAuth.setState({ user: null })
    useNav.setState({ view: 'dashboard', params: {} })
  }
})

// Global safety net: swallow unhandled 401 ApiErrors so they never reach the
// Next.js dev error overlay.
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason
    if (reason instanceof ApiError && reason.statusCode === 401) {
      event.preventDefault()
    }
  })
}

interface NavState {
  view: string
  params: Record<string, string>
  navigate: (view: string, params?: Record<string, string>) => void
}

// Detect public certificate verification URL on initial load
function getInitialNav(): { view: string; params: Record<string, string> } {
  if (typeof window === 'undefined') {
    return { view: 'dashboard', params: {} }
  }
  try {
    const sp = new URLSearchParams(window.location.search)
    const v = sp.get('view')
    const hash = sp.get('hash') ?? sp.get('cert')
    if (v === 'verify' && hash) {
      return { view: 'certificate-verify', params: { hash } }
    }
  } catch {
    // ignore
  }
  return { view: 'dashboard', params: {} }
}

const initialNav = getInitialNav()

export const useNav = create<NavState>((set) => ({
  view: initialNav.view,
  params: initialNav.params,
  navigate: (view, params = {}) => set({ view, params }),
}))
