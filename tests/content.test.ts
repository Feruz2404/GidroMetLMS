import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { CATEGORIES, COURSES, DEPARTMENTS, LIBRARY_RESOURCES, REGIONAL_DIVISIONS, ROLE_DEFINITIONS } from '../prisma/content'
import { validateCourse, validateLibraryResource } from '../prisma/content/validate'

const root = path.resolve(import.meta.dirname, '..')

test('catalogue has the expected size and organisation reference data', () => {
  assert.equal(COURSES.length, 18)
  assert.equal(LIBRARY_RESOURCES.length, 25)
  assert.equal(DEPARTMENTS.length, 10)
  assert.equal(REGIONAL_DIVISIONS.length, 14)
  assert.equal(CATEGORIES.length, 18)
  for (const role of ['super_admin', 'administrator', 'instructor', 'department_manager', 'learner']) {
    assert.ok(ROLE_DEFINITIONS.some((definition) => definition.key === role), role)
  }
})

test('every course passes the authoring rules', () => {
  const problems = COURSES.flatMap(validateCourse)
  assert.deepEqual(problems, [])
})

test('course slugs are unique and reference existing categories', () => {
  const categories: ReadonlySet<string> = new Set(CATEGORIES.map(([slug]): string => slug))
  assert.equal(new Set(COURSES.map((course) => course.slug)).size, COURSES.length)
  for (const course of COURSES) assert.ok(categories.has(course.categorySlug), `${course.slug} → ${course.categorySlug}`)
})

test('the catalogue keeps 162 lessons and 180 final-assessment questions', () => {
  const lessons = COURSES.flatMap((course) => course.sections.flatMap((section) => section.lessons))
  assert.equal(lessons.length, 162)
  assert.equal(COURSES.reduce((total, course) => total + course.quiz.questions.length, 0), 180)
  assert.equal(new Set(lessons.map((lesson) => lesson.title)).size > 150, true, 'lesson titles should be specific')
})

test('correct answers are not guessable from option length', () => {
  // Across a whole quiz the correct option must not systematically be the longest.
  for (const course of COURSES) {
    const choice = course.quiz.questions.filter((question) => question.type === 'single_choice')
    const longestIsCorrect = choice.filter((question) => {
      const longest = Math.max(...question.options.map((option) => option.text.length))
      return question.options.find((option) => option.correct)!.text.length === longest
    })
    assert.ok(longestIsCorrect.length < choice.length, `${course.slug}: the correct option is always the longest`)
  }
})

test('library resources are real documents with vetted https links and unique slugs', () => {
  assert.deepEqual(LIBRARY_RESOURCES.flatMap(validateLibraryResource), [])
  assert.equal(new Set(LIBRARY_RESOURCES.map((resource) => resource.slug)).size, LIBRARY_RESOURCES.length)
  assert.equal(LIBRARY_RESOURCES.some((resource) => /qrserver|example\.com/.test(resource.fileUrl)), false)
})

test('production initializer is guarded and never runs destructive statements on user data', () => {
  const initializer = fs.readFileSync(path.join(root, 'prisma', 'init-production-content.ts'), 'utf8')
  const catalog = fs.readFileSync(path.join(root, 'prisma', 'seed', 'catalog.ts'), 'utf8')
  const legacyCopy = fs.readFileSync(path.join(root, 'prisma', 'migrate-legacy-production-data.ts'), 'utf8')
  const migrations = fs
    .readdirSync(path.join(root, 'prisma', 'migrations'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => fs.readFileSync(path.join(root, 'prisma', 'migrations', entry.name, 'migration.sql'), 'utf8'))
    .join('\n')

  assert.match(initializer, /ALLOW_PRODUCTION_CONTENT_INIT/)
  for (const variable of ['INIT_ADMIN_PASSWORD', 'INIT_INSTRUCTOR_PASSWORD', 'INIT_MANAGER_PASSWORD', 'INIT_LEARNER_PASSWORD']) {
    assert.match(initializer, new RegExp(variable))
  }
  assert.doesNotMatch(initializer, /deleteMany|\.delete\(|\$executeRaw|\$queryRawUnsafe|migrate\s+reset|db\s+push/i)
  assert.doesNotMatch(initializer, /password\s*[:=]\s*['"][^'"]+['"]/i)

  // The catalogue only deletes the questions of quizzes nobody has attempted.
  const deletions = catalog.match(/\.delete(Many)?\(/g) ?? []
  assert.equal(deletions.length, 1)
  assert.match(catalog, /quizAttempt\.count\(\{ where: \{ quizId: id \} \}\)[\s\S]*?if \(attempts > 0\)[\s\S]*?question\.deleteMany/)

  assert.match(legacyCopy, /ALLOW_LEGACY_PRODUCTION_MIGRATION/)
  assert.match(legacyCopy, /skipDuplicates:\s*true/)
  assert.doesNotMatch(legacyCopy, /deleteMany|\.delete\(|\.update\(/)
  assert.doesNotMatch(migrations, /^\s*(DROP\s|TRUNCATE\s|DELETE\s+FROM\s|ALTER\s+TABLE.+\sDROP\s)/im)
})
