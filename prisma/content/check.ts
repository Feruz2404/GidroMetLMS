// Usage: npx tsx prisma/content/check.ts [course files…]
// Validates authored course files against the catalogue rules; without
// arguments it checks every file in prisma/content/courses.
import { readdirSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import type { CourseContent } from './types'
import { validateCourse } from './validate'

async function main() {
  const directory = path.join('prisma', 'content', 'courses')
  const files = process.argv.length > 2
    ? process.argv.slice(2)
    : readdirSync(directory).filter((name) => name.endsWith('.ts')).sort().map((name) => path.join(directory, name))
  let failed = false
  for (const file of files) {
    const loaded = (await import(pathToFileURL(path.resolve(file)).href)) as { course?: CourseContent }
    if (!loaded.course) {
      console.error(`${file}: missing \`export const course\``)
      failed = true
      continue
    }
    const errors = validateCourse(loaded.course)
    const words = loaded.course.sections.flatMap((section) => section.lessons).reduce((total, lesson) => total + lesson.body.split(/\s+/).length, 0)
    if (errors.length) {
      failed = true
      console.error(`✗ ${file}\n  ${errors.join('\n  ')}`)
    } else {
      process.stdout.write(`✓ ${file} (${words} lesson words, ${loaded.course.quiz.questions.length} questions)\n`)
    }
  }
  process.exit(failed ? 1 : 0)
}

void main()
