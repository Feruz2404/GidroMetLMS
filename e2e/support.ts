import { expect, type APIRequestContext, type Page } from '@playwright/test'

export const PASSWORD = process.env.DEMO_SEED_PASSWORD ?? ''

export const USERS = {
  learner: 'learner@demo.gidroedu.uz',
  learner2: 'a.hamidov@demo.gidroedu.uz',
  instructor: 'instructor@demo.gidroedu.uz',
  manager: 'manager@demo.gidroedu.uz',
  admin: 'administrator@demo.gidroedu.uz',
  superAdmin: 'super.admin@demo.gidroedu.uz',
} as const

/** Signs in through the API; the session cookie is shared with the page's browser context. */
export async function signIn(page: Page, email: string) {
  const response = await page.request.post('/api/auth', { data: { email, password: PASSWORD } })
  expect(response.ok(), `sign in as ${email}`).toBeTruthy()
}

/** Signs in through the real login form. */
export async function signInWithForm(page: Page, email: string, password = PASSWORD) {
  await page.goto('/login')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: /Kirish|Войти|Sign in/ }).click()
}

export async function apiAs(request: APIRequestContext, email: string) {
  const response = await request.post('/api/auth', { data: { email, password: PASSWORD } })
  expect(response.ok(), `sign in as ${email}`).toBeTruthy()
  return request
}

/** Fails the test on uncaught page errors or server errors seen by the page. */
export function watchForErrors(page: Page) {
  const problems: string[] = []
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`))
  page.on('response', (response) => {
    if (response.status() >= 500) problems.push(`HTTP ${response.status()} ${response.url()}`)
  })
  return () => expect(problems, problems.join('\n')).toEqual([])
}

/** UI text as the Uzbek interface renders it, so selectors follow the message catalogue. */
export { translate } from '../src/i18n'
import { translate as translateMessage, type MessageKey, type TranslateParams } from '../src/i18n'
export const t = (key: MessageKey, params?: TranslateParams) => translateMessage('uz', key, params)
