import type { Locale } from './config'

/**
 * Declares a feature's messages in every locale. Uzbek is the source
 * language; the type forces Russian and English to provide the same keys.
 *
 * Plurals: when a message is called with a numeric `count`, variants may be
 * separated by `|` in Intl.PluralRules order — "one|other" for uz/en and
 * "one|few|many|other" for ru. `{name}` placeholders are interpolated.
 */
export function defineMessages<const T extends Record<string, string>>(
  messages: { uz: T } & { [L in Exclude<Locale, 'uz'>]: { [K in keyof T]: string } }
) {
  return messages
}
