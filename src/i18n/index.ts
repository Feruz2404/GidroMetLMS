import type { Locale } from './config'
import { auth } from './messages/auth'
import { certificates } from './messages/certificates'
import { common } from './messages/common'
import { courses } from './messages/courses'
import { dashboard } from './messages/dashboard'
import { library } from './messages/library'
import { notifications } from './messages/notifications'
import { quizzes } from './messages/quizzes'
import { reports } from './messages/reports'
import { settings } from './messages/settings'
import { users } from './messages/users'

const modules = [common, auth, dashboard, courses, quizzes, library, certificates, notifications, reports, users, settings] as const

export type Messages = typeof common.uz &
  typeof auth.uz &
  typeof dashboard.uz &
  typeof courses.uz &
  typeof quizzes.uz &
  typeof library.uz &
  typeof certificates.uz &
  typeof notifications.uz &
  typeof reports.uz &
  typeof users.uz &
  typeof settings.uz

export type MessageKey = keyof Messages

function merge(locale: Locale): Record<string, string> {
  return Object.assign({}, ...modules.map((module) => module[locale] as Record<string, string>))
}

export const messages: Record<Locale, Record<string, string>> = {
  uz: merge('uz'),
  ru: merge('ru'),
  en: merge('en'),
}

export type TranslateParams = Record<string, string | number>

const PLURAL_RULES = new Map<Locale, Intl.PluralRules>()
const PLURAL_ORDER: Record<Locale, Intl.LDMLPluralRule[]> = {
  uz: ['one', 'other'],
  en: ['one', 'other'],
  ru: ['one', 'few', 'many', 'other'],
}

function selectPlural(locale: Locale, template: string, count: number): string {
  const variants = template.split('|')
  if (variants.length === 1) return template
  let rules = PLURAL_RULES.get(locale)
  if (!rules) {
    rules = new Intl.PluralRules(locale)
    PLURAL_RULES.set(locale, rules)
  }
  const index = PLURAL_ORDER[locale].indexOf(rules.select(count))
  return variants[index] ?? variants[variants.length - 1]
}

/** Resolves a message, falling back to Uzbek, then to the key itself. */
export function translate(locale: Locale, key: MessageKey | string, params?: TranslateParams): string {
  let template = messages[locale][key] ?? messages.uz[key] ?? key
  if (params && typeof params.count === 'number') template = selectPlural(locale, template, params.count)
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match))
}
