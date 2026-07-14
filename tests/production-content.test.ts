import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import {
  ANNOUNCEMENTS,
  CATEGORIES,
  COURSES,
  DEPARTMENTS,
  LIBRARY_RESOURCES,
  REGIONAL_DIVISIONS,
  ROLE_DEFINITIONS,
} from '../prisma/production-content-data'

test('production content catalog meets the required minimums', () => {
  assert.equal(DEPARTMENTS.length, 10)
  assert.equal(REGIONAL_DIVISIONS.length, 14)
  assert.equal(CATEGORIES.length, 18)
  assert.equal(COURSES.length, 18)
  assert.equal(LIBRARY_RESOURCES.length, 25)
  assert.equal(ANNOUNCEMENTS.length, 4)
  assert.equal(ROLE_DEFINITIONS.some((role) => role.key === 'super_admin'), true)
  assert.equal(ROLE_DEFINITIONS.some((role) => role.key === 'admin'), true)
  assert.equal(ROLE_DEFINITIONS.some((role) => role.key === 'instructor'), true)
  assert.equal(ROLE_DEFINITIONS.some((role) => role.key === 'department_manager'), true)
  assert.equal(ROLE_DEFINITIONS.some((role) => role.key === 'learner'), true)
})

test('every production course contains complete structured learning content', () => {
  const slugs = new Set<string>()
  let lessonCount = 0
  for (const course of COURSES) {
    assert.equal(slugs.has(course.slug), false)
    slugs.add(course.slug)
    assert.ok(course.summary.length >= 60)
    assert.ok(course.titleRu.length >= 5)
    assert.ok(course.targetAudience.length >= 5)
    assert.ok(course.outcomes.length >= 3)
    assert.ok(course.prerequisites.length >= 2)
    assert.ok(course.sections.length >= 3 && course.sections.length <= 6)
    for (const section of course.sections) {
      assert.ok(section.title.length >= 5)
      assert.ok(section.lessons.length >= 3 && section.lessons.length <= 5)
      for (const lesson of section.lessons) {
        assert.ok(lesson.title.length >= 5)
        assert.ok(lesson.focus.length >= 30)
        lessonCount += 1
      }
    }
  }
  assert.equal(lessonCount, 162)
})

test('production initializer and migration contain no destructive database operations or fixed passwords', () => {
  const root = path.resolve(import.meta.dirname, '..')
  const initializer = fs.readFileSync(path.join(root, 'prisma', 'init-production-content.ts'), 'utf8')
  const migration = fs.readFileSync(path.join(root, 'prisma', 'migrations', '20260714110000_production_content_models', 'migration.sql'), 'utf8')
  const legacyCopy = fs.readFileSync(path.join(root, 'prisma', 'migrate-legacy-production-data.ts'), 'utf8')
  const combined = `${initializer}\n${legacyCopy}\n${migration}`

  assert.doesNotMatch(initializer, /deleteMany|\$executeRaw|\$queryRawUnsafe|migrate\s+reset|db\s+push/i)
  assert.doesNotMatch(legacyCopy, /deleteMany|\$executeRaw|\$queryRawUnsafe|\.delete\(|\.update\(|migrate\s+reset|db\s+push/i)
  assert.doesNotMatch(combined, /^\s*(DROP\s|TRUNCATE\s|DELETE\s+FROM\s|ALTER\s+TABLE.+\sDROP\s)/im)
  assert.match(initializer, /ALLOW_PRODUCTION_CONTENT_INIT/)
  assert.match(initializer, /INIT_ADMIN_PASSWORD/)
  assert.match(initializer, /INIT_INSTRUCTOR_PASSWORD/)
  assert.match(initializer, /INIT_MANAGER_PASSWORD/)
  assert.match(initializer, /INIT_LEARNER_PASSWORD/)
  assert.match(legacyCopy, /ALLOW_LEGACY_PRODUCTION_MIGRATION/)
  assert.match(legacyCopy, /createMany/)
  assert.match(legacyCopy, /skipDuplicates:\s*true/)
  assert.doesNotMatch(initializer, /password\s*[:=]\s*['"][^'"]+['"]/i)
})
