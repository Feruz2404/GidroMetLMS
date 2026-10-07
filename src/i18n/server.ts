import 'server-only'
import { cookies } from 'next/headers'
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from './config'
import { translate, type MessageKey, type TranslateParams } from './index'

export async function getRequestLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : DEFAULT_LOCALE
}

/** Translator for server components (metadata, static text). */
export async function getServerTranslator() {
  const locale = await getRequestLocale()
  return (key: MessageKey, params?: TranslateParams) => translate(locale, key, params)
}
