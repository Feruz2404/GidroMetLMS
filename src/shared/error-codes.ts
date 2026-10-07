// Stable machine-readable error codes returned by the API. The client maps
// them to localized messages (see `errors.*` keys in the i18n catalogue), so
// server messages never need translating.
export const ERROR_CODES = [
  'BAD_REQUEST',
  'VALIDATION_FAILED',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'RATE_LIMITED',
  'INVALID_CREDENTIALS',
  'ACCOUNT_DISABLED',
  'REGISTRATION_DISABLED',
  'USER_EXISTS',
  'WEAK_PASSWORD',
  'CANNOT_MODIFY_SELF',
  'DEPARTMENT_SCOPE_MISSING',
  'COURSE_NOT_PUBLISHED',
  'COURSE_EMPTY',
  'NOT_ENROLLED',
  'LEARNERS_ONLY',
  'VIDEO_INCOMPLETE',
  'QUIZ_NOT_AVAILABLE',
  'QUIZ_EMPTY',
  'QUIZ_HAS_ATTEMPTS',
  'ATTEMPTS_EXHAUSTED',
  'ATTEMPT_FINALIZED',
  'TIME_LIMIT_EXCEEDED',
  'COURSE_NOT_COMPLETED',
  'ASSESSMENT_NOT_PASSED',
  'CERTIFICATE_EXISTS',
  'CERTIFICATES_DISABLED',
  'SERVER_CONFIG_ERROR',
  'DATABASE_UNAVAILABLE',
  'INTERNAL_ERROR',
] as const

export type ErrorCode = (typeof ERROR_CODES)[number]

export interface ApiErrorBody {
  status: 'error'
  code: ErrorCode
  message: string
  details?: unknown
}

export interface ApiSuccessBody<T, M = PageMeta | undefined> {
  status: 'success'
  data: T
  meta?: M
}

export interface PageMeta {
  total: number
  page: number
  pages: number
  limit: number
}

export interface FieldIssue {
  path: string
  message: string
}
