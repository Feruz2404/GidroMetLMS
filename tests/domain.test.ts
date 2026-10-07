import assert from 'node:assert/strict'
import test from 'node:test'
import { average, dailySeries, lastDays, lastMonths, rate } from '../src/server/modules/analytics/time-series'
import { certificateStatus } from '../src/server/modules/certificates/certificate-status'
import { joinLines, slugify, splitLines } from '../src/server/modules/courses/mapper'
import { orderLessons, progressPercent, requiredWatchSeconds } from '../src/server/modules/courses/progress'
import { canManageCourse, canManageQuiz, canManageResource } from '../src/server/auth/permissions'
import { canonicalRole, canViewReports } from '../src/shared/roles'
import { resolveAppLink, routes } from '../src/lib/routes'

test('lessons are ordered by section order, then lesson order, unsectioned last', () => {
  const sections = [
    { id: 's2', order: 2 },
    { id: 's1', order: 1 },
  ]
  const lessons = [
    { id: 'c', order: 1, sectionId: 's2' },
    { id: 'x', order: 1, sectionId: null },
    { id: 'b', order: 2, sectionId: 's1' },
    { id: 'a', order: 1, sectionId: 's1' },
  ]
  assert.deepEqual(orderLessons(sections, lessons).map((lesson) => lesson.id), ['a', 'b', 'c', 'x'])
})

test('progress and video watch requirements', () => {
  assert.equal(progressPercent(0, 0), 0)
  assert.equal(progressPercent(8, 9), 89)
  assert.equal(progressPercent(10, 9), 100)
  assert.equal(requiredWatchSeconds({ type: 'text', durationMin: 40 }), 0)
  assert.equal(requiredWatchSeconds({ type: 'video', durationMin: 10 }), 480)
  assert.equal(requiredWatchSeconds({ type: 'video', durationMin: 0 }), 30)
})

test('course text helpers', () => {
  assert.deepEqual(splitLines('• Birinchi\n- Ikkinchi\n\n  Uchinchi '), ['Birinchi', 'Ikkinchi', 'Uchinchi'])
  assert.equal(joinLines([]), null)
  assert.equal(slugify('Sun’iy yo‘ldosh tasvirlari'), 'suniy-yoldosh-tasvirlari')
  assert.equal(slugify('Гидрология рек'), 'gidrologiya-rek')
  assert.equal(slugify('!!!'), 'kurs')
})

test('certificate status derives expiry from the validity date', () => {
  const now = new Date('2026-10-01T00:00:00Z')
  assert.equal(certificateStatus({ status: 'active', validUntil: null }, now), 'active')
  assert.equal(certificateStatus({ status: 'active', validUntil: new Date('2026-09-30T00:00:00Z') }, now), 'expired')
  assert.equal(certificateStatus({ status: 'revoked', validUntil: null }, now), 'revoked')
})

test('ownership policies', () => {
  const instructor = { id: 'u1', role: 'instructor', department: null }
  const admin = { id: 'u2', role: 'administrator', department: null }
  const learner = { id: 'u3', role: 'learner', department: null }
  const ownCourse = { tutorId: 'u1', createdBy: 'u9' }
  const foreignCourse = { tutorId: 'u8', createdBy: 'u9' }
  assert.equal(canManageCourse(instructor, ownCourse), true)
  assert.equal(canManageCourse(instructor, foreignCourse), false)
  assert.equal(canManageCourse(admin, foreignCourse), true)
  assert.equal(canManageCourse(learner, ownCourse), false)
  assert.equal(canManageQuiz(instructor, { createdBy: 'u9', course: ownCourse }), true)
  assert.equal(canManageQuiz(instructor, { createdBy: 'u9', course: foreignCourse }), false)
  assert.equal(canManageResource(instructor, { uploadedBy: 'u8' }), false)
  assert.equal(canManageResource(admin, { uploadedBy: 'u8' }), true)
})

test('role helpers map legacy values', () => {
  assert.equal(canonicalRole('admin'), 'administrator')
  assert.equal(canonicalRole('student'), 'learner')
  assert.equal(canonicalRole('tutor'), 'instructor')
  assert.equal(canViewReports('department_manager'), true)
  assert.equal(canViewReports('learner'), false)
})

test('analytics helpers', () => {
  const now = new Date('2026-10-06T12:00:00Z')
  const days = lastDays(3, now)
  assert.deepEqual(days, ['2026-10-04', '2026-10-05', '2026-10-06'])
  assert.deepEqual(lastMonths(2, now), ['2026-09', '2026-10'])
  const series = dailySeries(days, [
    { at: new Date('2026-10-05T08:00:00Z'), key: 'a' },
    { at: new Date('2026-10-05T09:00:00Z'), key: 'a' },
    { at: new Date('2026-10-06T09:00:00Z'), key: 'b' },
    { at: new Date('2026-09-01T09:00:00Z'), key: 'c' },
  ], true)
  assert.deepEqual(series.map((point) => point.value), [0, 1, 1])
  assert.equal(rate(1, 3), 33)
  assert.equal(rate(1, 0), 0)
  assert.equal(average([70, 80, 91]), 80)
})

test('notification links resolve to app routes, including legacy view names', () => {
  assert.equal(resolveAppLink('/courses/abc'), '/courses/abc')
  assert.equal(resolveAppLink('course-detail:abc'), routes.course('abc'))
  assert.equal(resolveAppLink('certificates'), routes.certificates)
  assert.equal(resolveAppLink('//evil.example'), null)
  assert.equal(resolveAppLink('unknown'), null)
})
