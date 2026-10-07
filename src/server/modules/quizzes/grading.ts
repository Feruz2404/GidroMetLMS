// Pure assessment rules: answer normalisation, per-question grading and
// deterministic question ordering. No I/O, fully unit tested.

export interface GradableOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface GradableQuestion {
  id: string
  type: string
  points: number
  options: GradableOption[]
}

export interface SubmittedAnswer {
  selectedOptions?: string[]
  textAnswer?: string | null
}

export interface QuestionGrade {
  questionId: string
  selectedOptions: string[]
  textAnswer: string | null
  isCorrect: boolean
  pointsAwarded: number
}

export interface AttemptGrade {
  score: number
  maxScore: number
  percentage: number
  questions: QuestionGrade[]
}

/**
 * Normalises free-text answers so that equivalent spellings match: case,
 * surrounding/duplicate whitespace, the many Uzbek apostrophe variants
 * (o‘ oʻ o' o`), and decimal comma vs. point.
 */
export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFC')
    .toLowerCase()
    .replace(/[‘’ʻʼ`´']/g, "'")
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/\s+/g, ' ')
    .trim()
}

export function gradeQuestion(question: GradableQuestion, answer: SubmittedAnswer | undefined): QuestionGrade {
  const validIds = new Set(question.options.map((option) => option.id))
  const selected = [...new Set((answer?.selectedOptions ?? []).filter((id) => validIds.has(id)))]
  const textAnswer = answer?.textAnswer?.trim() ? answer.textAnswer.trim().slice(0, 4000) : null
  const correctIds = question.options.filter((option) => option.isCorrect).map((option) => option.id)

  let isCorrect = false
  switch (question.type) {
    case 'single_choice':
    case 'true_false':
      isCorrect = selected.length === 1 && correctIds.includes(selected[0])
      break
    case 'multiple_choice':
      // All-or-nothing: every correct option and no incorrect one.
      isCorrect = selected.length === correctIds.length && selected.every((id) => correctIds.includes(id))
      break
    case 'fill_blank': {
      const accepted = question.options.filter((option) => option.isCorrect).map((option) => normalizeAnswer(option.text))
      isCorrect = textAnswer !== null && accepted.includes(normalizeAnswer(textAnswer))
      break
    }
  }

  return {
    questionId: question.id,
    selectedOptions: question.type === 'fill_blank' ? [] : selected,
    textAnswer: question.type === 'fill_blank' ? textAnswer : null,
    isCorrect,
    pointsAwarded: isCorrect ? question.points : 0,
  }
}

export function gradeAttempt(questions: GradableQuestion[], answers: Map<string, SubmittedAnswer>): AttemptGrade {
  const graded = questions.map((question) => gradeQuestion(question, answers.get(question.id)))
  const maxScore = questions.reduce((total, question) => total + question.points, 0)
  const score = graded.reduce((total, grade) => total + grade.pointsAwarded, 0)
  return { score, maxScore, percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0, questions: graded }
}

/** Small, fast seeded PRNG (mulberry32). */
function mulberry32(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashSeed(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/** Shuffles deterministically by seed, so a resumed attempt keeps its question order. */
export function seededShuffle<T>(items: T[], seed: string): T[] {
  const random = mulberry32(hashSeed(seed))
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap], result[index]]
  }
  return result
}

export const ATTEMPT_GRACE_SECONDS = 30

export function attemptDeadline(startedAt: Date, timeLimitMin: number): Date {
  return new Date(startedAt.getTime() + Math.max(1, timeLimitMin) * 60_000)
}

export function isAttemptExpired(startedAt: Date, timeLimitMin: number, now = new Date()): boolean {
  return now.getTime() > attemptDeadline(startedAt, timeLimitMin).getTime() + ATTEMPT_GRACE_SECONDS * 1000
}
