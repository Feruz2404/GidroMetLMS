// Input validation schemas shared by API routes (authoritative) and client
// forms (early feedback). Keep them free of server-only imports.
import { z } from 'zod'
import { ASSIGNABLE_ROLES } from './roles'

const trimmed = (max: number) => z.string().trim().max(max)
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => (value ? value : null))

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email().max(254))

export const PASSWORD_MIN_LENGTH = 12

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, 'PASSWORD_TOO_SHORT')
  .max(256)
  .regex(/[a-z]/, 'PASSWORD_NEEDS_LOWERCASE')
  .regex(/[A-Z]/, 'PASSWORD_NEEDS_UPPERCASE')
  .regex(/[0-9]/, 'PASSWORD_NEEDS_DIGIT')
  .regex(/[^A-Za-z0-9]/, 'PASSWORD_NEEDS_SYMBOL')

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(64)
  .regex(/^[a-z0-9._-]+$/)

const personName = trimmed(80).min(1)

// --- Auth ---------------------------------------------------------------------

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(256),
})

export const registrationSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  firstName: personName,
  lastName: personName,
  middleName: optionalText(80),
  phone: optionalText(32),
  department: optionalText(120),
  position: optionalText(120),
})

export const profileUpdateSchema = z
  .object({
    firstName: personName,
    lastName: personName,
    middleName: optionalText(80),
    phone: optionalText(32),
    position: optionalText(120),
  })
  .partial()

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(256),
  newPassword: passwordSchema,
})

// --- Users --------------------------------------------------------------------

export const assignableRoleSchema = z.enum(ASSIGNABLE_ROLES)

export const createUserSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  role: assignableRoleSchema,
  firstName: personName,
  lastName: personName,
  middleName: optionalText(80),
  phone: optionalText(32),
  department: optionalText(120),
  position: optionalText(120),
})

export const updateUserSchema = z
  .object({
    role: assignableRoleSchema,
    firstName: personName,
    lastName: personName,
    middleName: optionalText(80),
    phone: optionalText(32),
    department: optionalText(120),
    position: optionalText(120),
  })
  .partial()

export const resetPasswordSchema = z.object({ password: passwordSchema })

// --- Courses ------------------------------------------------------------------

export const courseLevelSchema = z.enum(['beginner', 'intermediate', 'advanced'])
export const courseStatusSchema = z.enum(['draft', 'published', 'archived'])

const lines = z
  .array(trimmed(300).min(1))
  .max(20)

const nullableId = z.string().trim().min(1).nullish().transform((value) => value ?? null)
const nullableInt = (min: number, max: number) =>
  z.coerce.number().int().min(min).max(max).nullish().transform((value) => value ?? null)

// Field definitions carry no defaults so that `.partial()` update schemas never
// overwrite omitted fields (zod applies defaults even inside optional keys).
const courseFields = {
  title: trimmed(200).min(3),
  titleRu: optionalText(200),
  shortSummary: optionalText(400),
  description: optionalText(10_000),
  targetAudience: optionalText(400),
  learningOutcomes: lines,
  prerequisites: lines,
  categoryId: nullableId,
  tutorId: nullableId,
  level: courseLevelSchema,
  status: courseStatusSchema,
  durationHours: z.coerce.number().int().min(0).max(1000),
  isMandatory: z.boolean(),
  certificateEnabled: z.boolean(),
  passPercentage: z.coerce.number().int().min(1).max(100),
  maxAttempts: z.coerce.number().int().min(1).max(20),
  validDays: nullableInt(1, 3650),
}

export const courseInputSchema = z.object({
  ...courseFields,
  learningOutcomes: lines.default([]),
  prerequisites: lines.default([]),
  level: courseLevelSchema.default('beginner'),
  status: courseStatusSchema.default('draft'),
  durationHours: courseFields.durationHours.default(0),
  isMandatory: courseFields.isMandatory.default(false),
  certificateEnabled: courseFields.certificateEnabled.default(true),
  passPercentage: courseFields.passPercentage.default(70),
  maxAttempts: courseFields.maxAttempts.default(3),
})

export const courseUpdateSchema = z.object(courseFields).partial()

export const sectionInputSchema = z.object({
  title: trimmed(200).min(2),
  description: optionalText(1000),
})

export const lessonTypeSchema = z.enum(['text', 'video', 'pdf'])

const lessonFields = {
  sectionId: z.string().min(1),
  title: trimmed(200).min(2),
  description: optionalText(1000),
  type: lessonTypeSchema,
  content: optionalText(100_000),
  videoUrl: optionalText(500),
  fileUrl: optionalText(500),
  durationMin: z.coerce.number().int().min(0).max(600),
  isFree: z.boolean(),
}

export const lessonInputSchema = z.object({
  ...lessonFields,
  type: lessonTypeSchema.default('text'),
  durationMin: lessonFields.durationMin.default(30),
  isFree: lessonFields.isFree.default(false),
})

export const lessonUpdateSchema = z.object(lessonFields).partial()

export const reorderSchema = z.object({ ids: z.array(z.string().min(1)).min(1).max(500) })

export const lessonProgressSchema = z.object({
  completed: z.boolean().optional(),
  watchTimeSec: z.coerce.number().min(0).max(86_400).optional(),
})

// --- Assessments ---------------------------------------------------------------

export const questionTypeSchema = z.enum(['single_choice', 'multiple_choice', 'true_false', 'fill_blank'])

export const questionInputSchema = z
  .object({
    type: questionTypeSchema,
    text: trimmed(2000).min(3),
    points: z.coerce.number().int().min(1).max(100).default(1),
    explanation: optionalText(2000),
    options: z
      .array(z.object({ text: trimmed(500).min(1), isCorrect: z.boolean() }))
      .min(1)
      .max(10),
  })
  .superRefine((question, ctx) => {
    const correct = question.options.filter((option) => option.isCorrect).length
    if (question.type === 'fill_blank') {
      if (correct !== question.options.length) ctx.addIssue({ code: 'custom', path: ['options'], message: 'FILL_BLANK_ANSWERS' })
      return
    }
    if (question.options.length < 2) ctx.addIssue({ code: 'custom', path: ['options'], message: 'TOO_FEW_OPTIONS' })
    if (correct === 0) ctx.addIssue({ code: 'custom', path: ['options'], message: 'NO_CORRECT_OPTION' })
    if ((question.type === 'single_choice' || question.type === 'true_false') && correct > 1) {
      ctx.addIssue({ code: 'custom', path: ['options'], message: 'SINGLE_CORRECT_ONLY' })
    }
  })

export const quizStatusSchema = z.enum(['draft', 'published', 'archived'])

const quizFields = {
  title: trimmed(200).min(3),
  description: optionalText(2000),
  courseId: nullableId,
  status: quizStatusSchema,
  timeLimitMin: z.coerce.number().int().min(1).max(600),
  passingScore: z.coerce.number().int().min(1).max(100),
  maxAttempts: z.coerce.number().int().min(1).max(20),
  shuffleQuestions: z.boolean(),
  showAnswers: z.boolean(),
  questions: z.array(questionInputSchema).min(1).max(200),
}

export const quizInputSchema = z.object({
  ...quizFields,
  status: quizStatusSchema.default('draft'),
  timeLimitMin: quizFields.timeLimitMin.default(30),
  passingScore: quizFields.passingScore.default(70),
  maxAttempts: quizFields.maxAttempts.default(3),
  shuffleQuestions: quizFields.shuffleQuestions.default(false),
  showAnswers: quizFields.showAnswers.default(true),
})

export const quizUpdateSchema = z.object(quizFields).partial()

export const attemptSubmissionSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        selectedOptions: z.array(z.string().min(1)).max(20).optional(),
        textAnswer: z.string().max(4000).optional(),
      })
    )
    .max(500),
})

// --- Library ------------------------------------------------------------------

export const resourceTypeSchema = z.enum(['book', 'manual', 'article', 'document', 'normative', 'presentation', 'video', 'audio'])

const resourceFields = {
  title: trimmed(300).min(3),
  description: optionalText(4000),
  type: resourceTypeSchema,
  category: optionalText(120),
  author: optionalText(200),
  publisher: optionalText(200),
  year: nullableInt(1900, 2100),
  language: z.enum(['uz', 'ru', 'en']),
  pages: nullableInt(1, 20_000),
  fileUrl: optionalText(1000),
  fileType: optionalText(20),
  coverUrl: optionalText(1000),
  tags: z.array(trimmed(40).min(1)).max(15),
}

export const resourceInputSchema = z.object({
  ...resourceFields,
  type: resourceTypeSchema.default('book'),
  language: resourceFields.language.default('uz'),
  tags: resourceFields.tags.default([]),
})

export const resourceUpdateSchema = z
  .object({ ...resourceFields, status: z.enum(['active', 'archived']) })
  .partial()

// --- Certificates & notifications ---------------------------------------------

export const issueCertificateSchema = z.object({
  userId: z.string().min(1),
  courseId: z.string().min(1),
})

export const announcementSchema = z.object({
  title: trimmed(200).min(3),
  message: trimmed(2000).min(3),
  type: z.enum(['info', 'success', 'warning']).default('info'),
  link: optionalText(300),
  audience: z.enum(['all', 'learners', 'staff']).default('all'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegistrationInput = z.infer<typeof registrationSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type CourseInput = z.infer<typeof courseInputSchema>
export type CourseUpdateInput = z.infer<typeof courseUpdateSchema>
export type SectionInput = z.infer<typeof sectionInputSchema>
export type LessonInput = z.infer<typeof lessonInputSchema>
export type LessonUpdateInput = z.infer<typeof lessonUpdateSchema>
export type QuestionInput = z.infer<typeof questionInputSchema>
export type QuizInput = z.infer<typeof quizInputSchema>
export type QuizUpdateInput = z.infer<typeof quizUpdateSchema>
export type AttemptSubmissionInput = z.infer<typeof attemptSubmissionSchema>
export type ResourceInput = z.infer<typeof resourceInputSchema>
export type ResourceUpdateInput = z.infer<typeof resourceUpdateSchema>
export type AnnouncementInput = z.infer<typeof announcementSchema>
