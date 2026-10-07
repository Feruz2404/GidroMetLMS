import assert from 'node:assert/strict'
import test from 'node:test'
import {
  attemptDeadline,
  gradeAttempt,
  gradeQuestion,
  isAttemptExpired,
  normalizeAnswer,
  seededShuffle,
  type GradableQuestion,
} from '../src/server/modules/quizzes/grading'

const single: GradableQuestion = {
  id: 'q1',
  type: 'single_choice',
  points: 1,
  options: [
    { id: 'a', text: '1013,25 gPa', isCorrect: true },
    { id: 'b', text: '1000 gPa', isCorrect: false },
    { id: 'c', text: '980 gPa', isCorrect: false },
  ],
}

const multiple: GradableQuestion = {
  id: 'q2',
  type: 'multiple_choice',
  points: 2,
  options: [
    { id: 'a', text: 'Harorat', isCorrect: true },
    { id: 'b', text: 'Namlik', isCorrect: true },
    { id: 'c', text: 'Rang', isCorrect: false },
  ],
}

const fill: GradableQuestion = {
  id: 'q3',
  type: 'fill_blank',
  points: 1,
  options: [
    { id: 'x', text: '1013,25', isCorrect: true },
    { id: 'y', text: 'o‘lchov', isCorrect: true },
  ],
}

test('free-text answers ignore case, spacing, apostrophe style and decimal separator', () => {
  assert.equal(normalizeAnswer('  1013.25 '), normalizeAnswer('1013,25'))
  assert.equal(normalizeAnswer("O'LCHOV"), normalizeAnswer('o‘lchov'))
  assert.equal(normalizeAnswer('oʻlchov'), normalizeAnswer('o’lchov'))
  assert.equal(normalizeAnswer('suv   sarfi'), 'suv sarfi')
})

test('single choice is correct only with the one correct option', () => {
  assert.equal(gradeQuestion(single, { selectedOptions: ['a'] }).pointsAwarded, 1)
  assert.equal(gradeQuestion(single, { selectedOptions: ['b'] }).isCorrect, false)
  assert.equal(gradeQuestion(single, { selectedOptions: ['a', 'b'] }).isCorrect, false)
  assert.equal(gradeQuestion(single, undefined).isCorrect, false)
})

test('unknown option ids are discarded before grading', () => {
  const grade = gradeQuestion(single, { selectedOptions: ['forged', 'a', 'a'] })
  assert.deepEqual(grade.selectedOptions, ['a'])
  assert.equal(grade.isCorrect, true)
})

test('multiple choice is all-or-nothing', () => {
  assert.equal(gradeQuestion(multiple, { selectedOptions: ['a', 'b'] }).pointsAwarded, 2)
  assert.equal(gradeQuestion(multiple, { selectedOptions: ['b', 'a'] }).isCorrect, true)
  assert.equal(gradeQuestion(multiple, { selectedOptions: ['a'] }).pointsAwarded, 0)
  assert.equal(gradeQuestion(multiple, { selectedOptions: ['a', 'b', 'c'] }).pointsAwarded, 0)
})

test('fill-in answers match any accepted variant', () => {
  assert.equal(gradeQuestion(fill, { textAnswer: '1013.25' }).isCorrect, true)
  assert.equal(gradeQuestion(fill, { textAnswer: "O'lchov" }).isCorrect, true)
  assert.equal(gradeQuestion(fill, { textAnswer: '1013' }).isCorrect, false)
  assert.equal(gradeQuestion(fill, { textAnswer: '   ' }).textAnswer, null)
})

test('attempt grade sums points and rounds the percentage', () => {
  const answers = new Map([
    ['q1', { selectedOptions: ['a'] }],
    ['q2', { selectedOptions: ['a'] }],
    ['q3', { textAnswer: '1013,25' }],
  ])
  const grade = gradeAttempt([single, multiple, fill], answers)
  assert.equal(grade.maxScore, 4)
  assert.equal(grade.score, 2)
  assert.equal(grade.percentage, 50)
  assert.equal(gradeAttempt([], new Map()).percentage, 0)
})

test('seeded shuffle is deterministic per seed and keeps every item', () => {
  const items = Array.from({ length: 10 }, (_, index) => index)
  const first = seededShuffle(items, 'attempt-1')
  assert.deepEqual(seededShuffle(items, 'attempt-1'), first)
  assert.notDeepEqual(seededShuffle(items, 'attempt-2'), first)
  assert.deepEqual([...first].sort((a, b) => a - b), items)
})

test('attempt deadline honours the time limit plus a short grace period', () => {
  const startedAt = new Date('2026-10-01T10:00:00Z')
  assert.equal(attemptDeadline(startedAt, 20).toISOString(), '2026-10-01T10:20:00.000Z')
  assert.equal(isAttemptExpired(startedAt, 20, new Date('2026-10-01T10:20:20Z')), false)
  assert.equal(isAttemptExpired(startedAt, 20, new Date('2026-10-01T10:20:31Z')), true)
})
