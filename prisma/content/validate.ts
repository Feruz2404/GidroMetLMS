import type { CourseContent, LibraryResourceContent, QuestionContent } from './types'

const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length
const RAW_HTML = /<\/?[a-z][^>]*>/i
// Uzbek Latin uses ‘ (U+2018) after o/g and ’ (U+2019) as the tutuq belgisi.
// A straight apostrophe inside a word usually means an inconsistent spelling.
const STRAIGHT_APOSTROPHE_IN_WORD = /[A-Za-z]'[A-Za-z]/

function validateQuestion(question: QuestionContent, where: string): string[] {
  const errors: string[] = []
  const correct = question.options.filter((option) => option.correct).length
  if (question.text.trim().length < 15) errors.push(`${where}: question text is too short`)
  if (question.explanation.trim().length < 20) errors.push(`${where}: explanation is too short`)
  if (new Set(question.options.map((option) => option.text.trim().toLowerCase())).size !== question.options.length) {
    errors.push(`${where}: duplicate option texts`)
  }
  switch (question.type) {
    case 'single_choice':
      if (question.options.length !== 4 || correct !== 1) errors.push(`${where}: single_choice needs 4 options with exactly 1 correct`)
      break
    case 'multiple_choice':
      if (question.options.length < 4 || question.options.length > 5 || correct < 2 || correct === question.options.length) {
        errors.push(`${where}: multiple_choice needs 4–5 options with at least 2 (but not all) correct`)
      }
      break
    case 'true_false':
      if (question.options.length !== 2 || correct !== 1) errors.push(`${where}: true_false needs 2 options with 1 correct`)
      break
    case 'fill_blank':
      if (question.options.length < 1 || correct !== question.options.length) errors.push(`${where}: fill_blank options must all be accepted answers`)
      if (!question.text.includes('____')) errors.push(`${where}: fill_blank text must contain a ____ gap`)
      break
  }
  return errors
}

export function validateCourse(course: CourseContent): string[] {
  const errors: string[] = []
  const at = (path: string) => `${course.slug}${path}`

  if (course.summary.length < 60) errors.push(at(': summary must be at least 60 characters'))
  if (wordCount(course.description) < 60) errors.push(at(': description must be at least 60 words'))
  if (course.outcomes.length < 4 || course.outcomes.length > 6) errors.push(at(': 4–6 outcomes required'))
  if (course.prerequisites.length < 2 || course.prerequisites.length > 4) errors.push(at(': 2–4 prerequisites required'))
  if (course.sections.length !== 3) errors.push(at(': exactly 3 sections required'))

  course.sections.forEach((section, sectionIndex) => {
    if (section.lessons.length !== 3) errors.push(at(` section ${sectionIndex + 1}: exactly 3 lessons required`))
    if (section.summary.length < 30) errors.push(at(` section ${sectionIndex + 1}: summary too short`))
    section.lessons.forEach((lesson, lessonIndex) => {
      const where = at(` lesson ${sectionIndex + 1}.${lessonIndex + 1}`)
      const words = wordCount(lesson.body)
      if (words < 300) errors.push(`${where}: body has ${words} words (min 300)`)
      if (lesson.summary.length < 30) errors.push(`${where}: summary too short`)
      if (lesson.durationMin < 10 || lesson.durationMin > 90) errors.push(`${where}: durationMin out of range`)
      if (RAW_HTML.test(lesson.body)) errors.push(`${where}: raw HTML is not allowed`)
      if (/^#\s/m.test(lesson.body)) errors.push(`${where}: use ## or deeper headings (the title is rendered separately)`)
      if (!/##\s+Nazorat savollari/.test(lesson.body)) errors.push(`${where}: missing "## Nazorat savollari" section`)
      if (STRAIGHT_APOSTROPHE_IN_WORD.test(lesson.body)) errors.push(`${where}: use ‘ / ’ instead of straight apostrophes`)
      if (lesson.type === 'video') {
        if (!lesson.videoUrl || !/^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/.test(lesson.videoUrl)) {
          errors.push(`${where}: video lessons need a https://www.youtube.com/watch?v=ID url`)
        }
      } else if (lesson.videoUrl) {
        errors.push(`${where}: videoUrl is only allowed on video lessons`)
      }
    })
  })

  const quiz = course.quiz
  if (quiz.questions.length < 10 || quiz.questions.length > 12) errors.push(at(': quiz needs 10–12 questions'))
  const types = new Set(quiz.questions.map((question) => question.type))
  for (const required of ['single_choice', 'multiple_choice', 'true_false', 'fill_blank'] as const) {
    if (!types.has(required)) errors.push(at(`: quiz must include at least one ${required} question`))
  }
  quiz.questions.forEach((question, index) => errors.push(...validateQuestion(question, at(` question ${index + 1}`))))
  return errors
}

export function validateLibraryResource(resource: LibraryResourceContent): string[] {
  const errors: string[] = []
  const at = (message: string) => `${resource.slug}: ${message}`
  if (!/^https:\/\//.test(resource.fileUrl)) errors.push(at('fileUrl must be an https URL'))
  if (resource.description.length < 80) errors.push(at('description must be at least 80 characters'))
  if (resource.year < 1950 || resource.year > 2026) errors.push(at('year out of range'))
  if (resource.tags.length < 2) errors.push(at('at least 2 tags required'))
  return errors
}
