// Shape of the authored learning catalogue. The seed and the production
// content initializer both read these structures, so the catalogue lives in
// one place and is validated by tests (see tests/content.test.ts).

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type LessonType = 'text' | 'video'
export type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'fill_blank'

export interface LessonContent {
  title: string
  /** One-sentence learning objective, shown under the lesson title. */
  summary: string
  durationMin: number
  type: LessonType
  /** Only for `video` lessons: a verified https://www.youtube.com/watch?v=… URL. */
  videoUrl?: string
  /** Markdown body (GFM tables allowed, no raw HTML). */
  body: string
}

export interface SectionContent {
  title: string
  summary: string
  lessons: LessonContent[]
}

export interface AnswerOptionContent {
  text: string
  correct: boolean
}

export interface QuestionContent {
  type: QuestionType
  text: string
  /**
   * single_choice: 4 options, exactly 1 correct.
   * multiple_choice: 4–5 options, at least 2 correct.
   * true_false: exactly ["To‘g‘ri", "Noto‘g‘ri"], one correct.
   * fill_blank: every option is an accepted answer (all `correct: true`).
   */
  options: AnswerOptionContent[]
  explanation: string
  points?: number
}

export interface QuizContent {
  title: string
  description: string
  timeLimitMin: number
  passingScore: number
  questions: QuestionContent[]
}

export interface CourseContent {
  slug: string
  title: string
  titleRu: string
  categorySlug: string
  level: CourseLevel
  durationHours: number
  mandatory: boolean
  summary: string
  /** Markdown overview shown on the course page. */
  description: string
  targetAudience: string
  outcomes: string[]
  prerequisites: string[]
  sections: SectionContent[]
  quiz: QuizContent
}

export type LibraryResourceType =
  | 'book'
  | 'manual'
  | 'article'
  | 'document'
  | 'normative'
  | 'presentation'
  | 'video'

export interface LibraryResourceContent {
  slug: string
  title: string
  description: string
  type: LibraryResourceType
  category: string
  author: string
  publisher: string
  year: number
  language: 'uz' | 'ru' | 'en'
  pages?: number
  /** Official public URL of the document (PDF or landing page). */
  fileUrl: string
  fileType: 'pdf' | 'html' | 'video'
  tags: string[]
}
