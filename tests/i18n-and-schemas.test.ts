import assert from 'node:assert/strict'
import test from 'node:test'
import { messages, translate } from '../src/i18n'
import { LOCALES } from '../src/i18n/config'
import { ERROR_CODES } from '../src/shared/error-codes'
import {
  courseInputSchema,
  courseUpdateSchema,
  createUserSchema,
  passwordSchema,
  profileUpdateSchema,
  questionInputSchema,
  quizUpdateSchema,
  registrationSchema,
} from '../src/shared/schemas'

test('every locale defines exactly the same message keys', () => {
  const reference = Object.keys(messages.uz).sort()
  for (const locale of LOCALES) {
    assert.deepEqual(Object.keys(messages[locale]).sort(), reference, `locale ${locale}`)
  }
})

test('no message is left empty or untranslated placeholder text', () => {
  for (const locale of LOCALES) {
    for (const [key, value] of Object.entries(messages[locale])) {
      assert.ok(value.trim().length > 0, `${locale}:${key} is empty`)
      assert.doesNotMatch(value, /TODO|FIXME|lorem ipsum/i, `${locale}:${key}`)
    }
  }
})

test('every API error code has a localized message', () => {
  for (const code of ERROR_CODES) {
    for (const locale of LOCALES) assert.ok(messages[locale][`errors.${code}`], `${locale}: errors.${code}`)
  }
})

test('translate interpolates values and selects plural forms', () => {
  assert.equal(translate('uz', 'common.hours', { count: 5 }), '5 soat')
  assert.equal(translate('en', 'common.hours', { count: 1 }), '1 hour')
  assert.equal(translate('en', 'common.hours', { count: 4 }), '4 hours')
  assert.equal(translate('ru', 'common.hours', { count: 1 }), '1 час')
  assert.equal(translate('ru', 'common.hours', { count: 3 }), '3 часа')
  assert.equal(translate('ru', 'common.hours', { count: 11 }), '11 часов')
  assert.equal(translate('uz', 'app.copyright', { year: 2026 }).includes('2026'), true)
  assert.equal(translate('uz', 'missing.key' as never), 'missing.key')
})

test('password policy requires length and character variety', () => {
  assert.equal(passwordSchema.safeParse('Short1!').success, false)
  assert.equal(passwordSchema.safeParse('alllowercase123!').success, false)
  assert.equal(passwordSchema.safeParse('NoDigitsHere!!').success, false)
  assert.equal(passwordSchema.safeParse('NoSymbols12345').success, false)
  assert.equal(passwordSchema.safeParse('Gidromet!2026x').success, true)
})

test('update schemas never inject defaults for omitted fields', () => {
  assert.deepEqual(courseUpdateSchema.parse({ title: 'Yangi nom' }), { title: 'Yangi nom' })
  assert.deepEqual(quizUpdateSchema.parse({}), {})
  assert.deepEqual(profileUpdateSchema.parse({ phone: null }), { phone: null })
  const created = courseInputSchema.parse({ title: 'Kurs' })
  assert.equal(created.status, 'draft')
  assert.equal(created.passPercentage, 70)
})

test('question validation enforces answer keys per type', () => {
  const base = { text: 'Standart dengiz sathi bosimi?', points: 1 }
  assert.equal(questionInputSchema.safeParse({ ...base, type: 'single_choice', options: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }] }).success, true)
  assert.equal(questionInputSchema.safeParse({ ...base, type: 'single_choice', options: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: true }] }).success, false)
  assert.equal(questionInputSchema.safeParse({ ...base, type: 'multiple_choice', options: [{ text: 'A', isCorrect: false }, { text: 'B', isCorrect: false }] }).success, false)
  assert.equal(questionInputSchema.safeParse({ ...base, type: 'fill_blank', options: [{ text: '1013,25', isCorrect: true }] }).success, true)
  assert.equal(questionInputSchema.safeParse({ ...base, type: 'fill_blank', options: [{ text: '1013,25', isCorrect: false }] }).success, false)
})

test('account schemas normalise identity fields and restrict roles', () => {
  const registration = registrationSchema.parse({
    email: ' New.User@Meteo.UZ ',
    username: 'New.User',
    password: 'Gidromet!2026x',
    firstName: ' Ali ',
    lastName: 'Valiyev',
  })
  assert.equal(registration.email, 'new.user@meteo.uz')
  assert.equal(registration.username, 'new.user')
  assert.equal(registration.firstName, 'Ali')
  assert.equal(registration.middleName, null)
  const base = { email: 'a@b.uz', username: 'abc', password: 'Gidromet!2026x', firstName: 'A', lastName: 'B' }
  assert.equal(createUserSchema.safeParse({ ...base, role: 'super_admin' }).success, false)
  assert.equal(createUserSchema.safeParse({ ...base, role: 'instructor' }).success, true)
})

test('Uzbek dates use Uzbek month names regardless of browser CLDR data', async () => {
  const { formatDateValue, formatNumberValue } = await import('../src/i18n/format')
  const date = new Date(2026, 9, 7, 14, 5)
  assert.equal(formatDateValue('uz', date, 'short'), '07.10.2026')
  assert.equal(formatDateValue('uz', date, 'medium'), '7-okt, 2026')
  assert.equal(formatDateValue('uz', date, 'long'), '2026-yil 7-oktabr')
  assert.equal(formatDateValue('uz', date, 'datetime'), '07.10.2026 14:05')
  assert.equal(formatDateValue('uz', null), '—')
  assert.equal(formatDateValue('uz', 'not a date'), '—')
  assert.match(formatDateValue('ru', date, 'long'), /октября 2026/)
  assert.equal(formatNumberValue('uz', 1234.5).replace(/\s/g, ' '), '1 234,5')
})
