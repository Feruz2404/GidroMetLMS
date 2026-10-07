// API contracts: the JSON shapes returned by /api routes. Server mappers
// produce them and client features consume them, so both sides stay in sync.
import type { Permission, Role } from './roles'

export type ISODate = string

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type CourseStatus = 'draft' | 'published' | 'archived'
export type LessonType = 'text' | 'video' | 'pdf'
export type EnrollmentStatus = 'active' | 'completed' | 'dropped'
export type QuizStatus = 'draft' | 'published' | 'archived'
export type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'fill_blank'
export type AttemptStatus = 'in_progress' | 'graded'
export type CertificateStatus = 'active' | 'revoked' | 'expired'
export type ResourceType = 'book' | 'manual' | 'article' | 'document' | 'normative' | 'presentation' | 'video' | 'audio'
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

// --- Users -------------------------------------------------------------------

export interface UserSummaryDto {
  id: string
  firstName: string
  lastName: string
  middleName: string | null
  position: string | null
  department: string | null
  avatarUrl: string | null
}

export interface CurrentUserDto {
  id: string
  email: string
  username: string
  role: Role
  firstName: string
  lastName: string
  middleName: string | null
  phone: string | null
  avatarUrl: string | null
  department: string | null
  position: string | null
  mustChangePassword: boolean
  lastLoginAt: ISODate | null
  createdAt: ISODate
  permissions: Permission[]
}

export interface UserListItemDto {
  id: string
  email: string
  username: string
  role: Role
  firstName: string
  lastName: string
  middleName: string | null
  phone: string | null
  department: string | null
  position: string | null
  isActive: boolean
  mustChangePassword: boolean
  lastLoginAt: ISODate | null
  createdAt: ISODate
}

export interface UserDetailDto extends UserListItemDto {
  stats: { enrollments: number; completedCourses: number; certificates: number; quizAttempts: number }
}

export interface DepartmentDto {
  id: string
  code: string
  name: string
}

// --- Catalogue -----------------------------------------------------------------

export interface CategoryDto {
  id: string
  slug: string
  name: string
  nameRu: string | null
  icon: string | null
  description: string | null
  courseCount: number
}

export interface CourseEnrollmentDto {
  id: string
  status: EnrollmentStatus
  progress: number
  startedAt: ISODate
  completedAt: ISODate | null
  deadlineAt: ISODate | null
}

export interface CourseCardDto {
  id: string
  slug: string
  title: string
  titleRu: string | null
  shortSummary: string | null
  level: CourseLevel
  status: CourseStatus
  durationHours: number
  isMandatory: boolean
  category: { id: string; name: string; slug: string; icon: string | null } | null
  tutor: UserSummaryDto | null
  lessonCount: number
  enrollmentCount: number
  enrollment: CourseEnrollmentDto | null
  canManage: boolean
  publishedAt: ISODate | null
  updatedAt: ISODate
}

export interface LessonOutlineDto {
  id: string
  sectionId: string | null
  title: string
  description: string | null
  type: LessonType
  durationMin: number
  order: number
  isFree: boolean
  isLocked: boolean
  isCompleted: boolean
}

export interface SectionDto {
  id: string
  title: string
  description: string | null
  order: number
  lessons: LessonOutlineDto[]
}

export interface CourseQuizSummaryDto {
  id: string
  title: string
  status: QuizStatus
  questionCount: number
  timeLimitMin: number
  passingScore: number
  maxAttempts: number
  attemptsUsed: number
  bestPercentage: number | null
  passed: boolean
}

export interface CourseDetailDto extends CourseCardDto {
  description: string | null
  targetAudience: string | null
  learningOutcomes: string[]
  prerequisites: string[]
  language: string
  certificateEnabled: boolean
  passPercentage: number
  maxAttempts: number
  validDays: number | null
  generalTrainingNotice: string | null
  thumbnailUrl: string | null
  categoryId: string | null
  tutorId: string | null
  sections: SectionDto[]
  completedLessons: number
  nextLessonId: string | null
  quizzes: CourseQuizSummaryDto[]
  certificate: { id: string; certNumber: string; verifyHash: string } | null
}

export interface LessonDetailDto extends LessonOutlineDto {
  courseId: string
  content: string | null
  videoUrl: string | null
  fileUrl: string | null
  watchTimeSec: number
  requiredWatchSec: number
  previousLessonId: string | null
  nextLessonId: string | null
}

export interface LessonProgressResultDto {
  lessonId: string
  isCompleted: boolean
  watchTimeSec: number
  courseProgress: number
  completedLessons: number
  totalLessons: number
  enrollmentStatus: EnrollmentStatus
  certificateIssued: { id: string; certNumber: string } | null
}

/** A learner who can be assigned to a course (directory search scoped to course managers). */
export interface LearnerCandidateDto extends UserSummaryDto {
  email: string
  enrolled: boolean
}

export interface CourseLearnerDto {
  enrollmentId: string
  user: UserSummaryDto & { email: string }
  status: EnrollmentStatus
  progress: number
  startedAt: ISODate
  completedAt: ISODate | null
  bestPercentage: number | null
  certificateId: string | null
}

// --- Assessments ---------------------------------------------------------------

export interface QuizListItemDto {
  id: string
  title: string
  description: string | null
  status: QuizStatus
  timeLimitMin: number
  passingScore: number
  maxAttempts: number
  questionCount: number
  attemptCount: number
  course: { id: string; title: string } | null
  canManage: boolean
  my: {
    attemptsUsed: number
    bestPercentage: number | null
    passed: boolean
    inProgressAttemptId: string | null
  } | null
  updatedAt: ISODate
}

export interface AttemptSummaryDto {
  id: string
  status: AttemptStatus
  score: number
  maxScore: number
  percentage: number
  passed: boolean
  startedAt: ISODate
  submittedAt: ISODate | null
  timeSpentSec: number
}

export interface QuizDetailDto extends QuizListItemDto {
  shuffleQuestions: boolean
  showAnswers: boolean
  attempts: AttemptSummaryDto[]
  attemptsRemaining: number | null
  /** Why a learner cannot start right now, if they cannot. */
  blockedReason: 'NOT_ENROLLED' | 'ATTEMPTS_EXHAUSTED' | 'QUIZ_EMPTY' | 'NOT_PUBLISHED' | null
}

export interface EditableOptionDto {
  id?: string
  text: string
  isCorrect: boolean
}

export interface EditableQuestionDto {
  id?: string
  type: QuestionType
  text: string
  points: number
  explanation: string | null
  options: EditableOptionDto[]
}

export interface QuizEditorDto {
  id: string
  title: string
  description: string | null
  courseId: string | null
  status: QuizStatus
  timeLimitMin: number
  passingScore: number
  maxAttempts: number
  shuffleQuestions: boolean
  showAnswers: boolean
  hasAttempts: boolean
  questions: EditableQuestionDto[]
}

export interface TakingQuestionDto {
  id: string
  type: QuestionType
  text: string
  points: number
  options: Array<{ id: string; text: string }>
}

export interface AttemptSessionDto {
  attemptId: string
  quiz: { id: string; title: string; description: string | null; passingScore: number; timeLimitMin: number }
  questions: TakingQuestionDto[]
  startedAt: ISODate
  expiresAt: ISODate
  attemptsRemaining: number
  resumed: boolean
}

export interface SubmittedAnswerDto {
  questionId: string
  selectedOptions?: string[]
  textAnswer?: string
}

export interface AttemptResultQuestionDto {
  id: string
  type: QuestionType
  text: string
  points: number
  pointsAwarded: number
  isCorrect: boolean
  textAnswer: string | null
  explanation: string | null
  options: Array<{ id: string; text: string; selected: boolean; isCorrect: boolean | null }>
  acceptedAnswers: string[] | null
}

export interface AttemptResultDto extends AttemptSummaryDto {
  quiz: { id: string; title: string; passingScore: number; course: { id: string; title: string } | null }
  learner: UserSummaryDto
  canSeeAnswers: boolean
  questions: AttemptResultQuestionDto[]
  certificate: { id: string; certNumber: string } | null
}

// --- Library -------------------------------------------------------------------

export interface LibraryResourceDto {
  id: string
  slug: string | null
  title: string
  description: string | null
  type: ResourceType
  category: string | null
  author: string | null
  publisher: string | null
  year: number | null
  language: string
  pages: number | null
  fileUrl: string | null
  fileType: string | null
  fileSize: number
  coverUrl: string | null
  tags: string[]
  downloadCount: number
  viewCount: number
  bookmarkCount: number
  status: 'active' | 'archived'
  bookmarked: boolean
  canManage: boolean
  createdAt: ISODate
}

export interface LibraryFacetsDto {
  categories: Array<{ value: string; count: number }>
  types: Array<{ value: ResourceType; count: number }>
  languages: Array<{ value: string; count: number }>
  years: number[]
}

// --- Certificates --------------------------------------------------------------

export interface CertificateTemplateDto {
  titleText: string
  bodyText: string | null
  primaryColor: string
  accentColor: string
  signerName: string | null
  signerTitle: string | null
}

export interface CertificateDto {
  id: string
  certNumber: string
  verifyHash: string
  status: CertificateStatus
  score: number
  maxScore: number
  percentage: number
  issuedAt: ISODate
  validUntil: ISODate | null
  course: { id: string; title: string; durationHours: number }
  recipient: { id: string; fullName: string; department: string | null; position: string | null }
  template: CertificateTemplateDto | null
}

export interface PublicCertificateDto {
  status: CertificateStatus
  certNumber: string
  recipientName: string
  courseTitle: string
  courseHours: number
  percentage: number
  issuedAt: ISODate
  validUntil: ISODate | null
  template: CertificateTemplateDto | null
}

export interface CertificateSyncResultDto {
  created: number
  certificates: Array<{ id: string; certNumber: string; recipientName: string; courseTitle: string }>
}

// --- Notifications ---------------------------------------------------------------

export interface NotificationDto {
  id: string
  type: NotificationType
  title: string
  message: string
  link: string | null
  isRead: boolean
  createdAt: ISODate
}

export interface NotificationListDto {
  items: NotificationDto[]
  unreadCount: number
}

// --- Dashboard ---------------------------------------------------------------------

export interface DailyPointDto {
  date: string
  value: number
}

export interface LearnerDashboardDto {
  kind: 'learner'
  stats: { enrolled: number; inProgress: number; completed: number; certificates: number; averageProgress: number; studyMinutes: number }
  continueLearning: Array<CourseCardDto & { nextLessonId: string | null }>
  deadlines: Array<{ courseId: string; title: string; deadlineAt: ISODate; progress: number }>
  recentResults: Array<{ attemptId: string; quizTitle: string; percentage: number; passed: boolean; submittedAt: ISODate }>
  certificates: Array<{ id: string; certNumber: string; courseTitle: string; issuedAt: ISODate }>
  activity: DailyPointDto[]
  recommended: CourseCardDto[]
}

export interface InstructorDashboardDto {
  kind: 'instructor'
  stats: { courses: number; publishedCourses: number; learners: number; enrollments: number; completionRate: number; averageScore: number; quizzes: number }
  courses: Array<{ id: string; title: string; status: CourseStatus; enrollments: number; completionRate: number; averageProgress: number }>
  recentAttempts: Array<{ attemptId: string; learnerName: string; quizTitle: string; percentage: number; passed: boolean; submittedAt: ISODate }>
  activity: DailyPointDto[]
}

export interface OrganizationDashboardDto {
  kind: 'organization'
  scope: { department: string | null }
  stats: {
    learners: number
    instructors: number
    publishedCourses: number
    enrollments: number
    completionRate: number
    certificates: number
    passRate: number
    averageScore: number
    activeUsers30d: number
    resources: number
  }
  activity: DailyPointDto[]
  enrollmentsByCategory: Array<{ name: string; value: number }>
  topCourses: Array<{ id: string; title: string; enrollments: number; completionRate: number }>
  recentCertificates: Array<{ id: string; recipientName: string; courseTitle: string; issuedAt: ISODate }>
  departments: Array<{ name: string; learners: number; completionRate: number }>
}

export type DashboardDto = LearnerDashboardDto | InstructorDashboardDto | OrganizationDashboardDto

// --- Reports ---------------------------------------------------------------------------

export type ReportType = 'overview' | 'learners' | 'courses' | 'assessments' | 'certificates' | 'library' | 'audit'

export interface ReportOverviewDto {
  totals: {
    learners: number
    courses: number
    enrollments: number
    completed: number
    completionRate: number
    attempts: number
    passRate: number
    averageScore: number
    certificates: number
    downloads: number
  }
  monthly: Array<{ month: string; enrollments: number; completions: number; certificates: number }>
  scoreDistribution: Array<{ range: string; count: number }>
}

export interface LearnerReportRowDto {
  id: string
  name: string
  email: string
  department: string | null
  position: string | null
  enrolled: number
  completed: number
  averageProgress: number
  attempts: number
  passed: number
  averageScore: number | null
  certificates: number
  lastLoginAt: ISODate | null
}

export interface CourseReportRowDto {
  id: string
  title: string
  category: string | null
  tutor: string | null
  status: CourseStatus
  lessons: number
  enrolled: number
  completed: number
  completionRate: number
  averageProgress: number
  averageScore: number | null
  certificates: number
}

export interface AssessmentReportRowDto {
  id: string
  learner: string
  email: string
  quiz: string
  course: string | null
  score: number
  maxScore: number
  percentage: number
  passed: boolean
  submittedAt: ISODate | null
  timeSpentSec: number
}

export interface CertificateReportRowDto {
  id: string
  certNumber: string
  learner: string
  department: string | null
  course: string
  percentage: number
  issuedAt: ISODate
  validUntil: ISODate | null
  status: CertificateStatus
}

export interface LibraryReportRowDto {
  id: string
  title: string
  type: ResourceType
  category: string | null
  views: number
  downloads: number
  bookmarks: number
}

export interface AuditReportRowDto {
  id: string
  user: string
  email: string
  role: string
  action: string
  entity: string | null
  entityId: string | null
  ipAddress: string | null
  createdAt: ISODate
}

// --- Search --------------------------------------------------------------------------------

export interface SearchResultsDto {
  courses: Array<{ id: string; title: string; category: string | null }>
  resources: Array<{ id: string; title: string; type: ResourceType }>
  users: Array<{ id: string; name: string; email: string }>
}
