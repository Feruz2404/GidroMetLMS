// API client for GidroEdu LMS frontend
// Token-based auth: token stored in localStorage, sent as Bearer header.
// This avoids all cookie/SameSite/third-party-cookie-blocking issues in
// iframe-embedded preview environments.

const API_BASE = '/api'
const TOKEN_KEY = 'gidroedu_token'

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: unknown
  ) {
    super(message)
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

// --- Token storage (localStorage) ---

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

// --- Auth-error callback ---
// Registered by the auth store so the API client can trigger a session
// reset when any request returns 401.
type AuthErrorCallback = () => void
let onAuthError: AuthErrorCallback | null = null

export function registerAuthErrorHandler(cb: AuthErrorCallback) {
  onAuthError = cb
}

// --- Request helper ---

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  // Attach Bearer token if available (skip for login endpoint itself)
  if (token && !endpoint.startsWith('/auth')) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, { ...options, headers })

  if (!res.ok) {
    let body: { message?: string; errors?: unknown } = {}
    try {
      body = await res.json()
    } catch {
      // ignore
    }

    // On 401, clear auth state globally so the app returns to the login
    // screen instead of crashing into an unhandled rejection.
    if (res.status === 401 && onAuthError) {
      onAuthError()
    }

    throw new ApiError(body.message || `HTTP ${res.status}`, res.status, body.errors)
  }

  const text = await res.text()
  if (!text) return null as T
  return JSON.parse(text)
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
}

// Format helpers
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('uz-UZ', opts ?? { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('uz-UZ', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export function timeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return 'hozir'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} daqiqa oldin`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} soat oldin`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day} kun oldin`
  const month = Math.floor(day / 30)
  if (month < 12) return `${month} oy oldin`
  return `${Math.floor(month / 12)} yil oldin`
}

// Shared types
export type Role = 'admin' | 'tutor' | 'student'

export interface User {
  id: string
  email: string
  username: string
  role: Role
  firstName: string
  lastName: string
  middleName?: string | null
  phone?: string | null
  avatarUrl?: string | null
  department?: string | null
  position?: string | null
  isActive: boolean
  lastLoginAt?: string | null
  createdAt: string
  token?: string // present in login response
}

export interface Course {
  id: string
  title: string
  description?: string | null
  slug: string
  categoryId?: string | null
  tutorId?: string | null
  thumbnailUrl?: string | null
  durationHours: number
  level: 'beginner' | 'intermediate' | 'advanced'
  status: 'draft' | 'published' | 'archived'
  isMandatory: boolean
  passPercentage: number
  maxAttempts: number
  validDays?: number | null
  publishedAt?: string | null
  createdAt: string
  category?: { id: string; name: string; slug: string; icon?: string | null } | null
  tutor?: { id: string; firstName: string; lastName: string } | null
  _count?: { enrollments: number; lessons: number }
  enrollment?: { id: string; progress: number; status: string } | null
}

export interface Lesson {
  id: string
  courseId: string
  sectionId?: string | null
  title: string
  description?: string | null
  content?: string | null
  type: 'video' | 'text' | 'pdf' | 'assignment'
  videoUrl?: string | null
  fileUrl?: string | null
  durationMin: number
  order: number
  isFree: boolean
  section?: { id: string; title: string; order: number } | null
  progress?: { isCompleted: boolean; watchTimeSec: number; lastPosition: number } | null
}

export interface Quiz {
  id: string
  title: string
  description?: string | null
  courseId?: string | null
  timeLimitMin: number
  passingScore: number
  maxAttempts: number
  shuffleQuestions: boolean
  showAnswers: boolean
  status: string
  createdAt: string
  course?: { id: string; title: string } | null
  _count?: { questions: number; attempts: number }
}

export interface Question {
  id: string
  type: 'single_choice' | 'multiple_choice' | 'true_false' | 'fill_blank'
  text: string
  points: number
  explanation?: string | null
  order: number
  options: { id: string; text: string; isCorrect?: boolean; order: number }[]
}

export interface LibraryResource {
  id: string
  title: string
  description?: string | null
  type: string
  category?: string | null
  author?: string | null
  publisher?: string | null
  year?: number | null
  language: string
  pages?: number | null
  fileUrl?: string | null
  fileSize: number
  fileType?: string | null
  coverUrl?: string | null
  tags?: string | null
  downloadCount: number
  viewCount: number
  status: string
  createdAt: string
  bookmarked?: boolean
}

export interface Certificate {
  id: string
  certNumber: string
  userId: string
  courseId: string
  score: number
  maxScore: number
  percentage: number
  issuedAt: string
  validUntil?: string | null
  status: string
  verifyHash: string
  course?: { id: string; title: string } | null
  user?: { id: string; firstName: string; lastName: string; middleName?: string | null } | null
  template?: { id: string; titleText: string; primaryColor: string; accentColor: string; signerName?: string | null; signerTitle?: string | null } | null
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  link?: string | null
  isRead: boolean
  createdAt: string
}
