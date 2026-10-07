import { expect, test } from '@playwright/test'
import { PASSWORD, signIn, signInWithForm, USERS, watchForErrors } from './support'

test.describe('Authentication', () => {
  test('signed-out visitors are sent to the sign-in page', async ({ page }) => {
    await page.goto('/courses')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: 'Tizimga kirish' })).toBeVisible()
  })

  test('the sign-in page shows real catalogue figures', async ({ page }) => {
    await page.goto('/login')
    const stats = page.locator('dl')
    await expect(stats.getByText('kurs', { exact: true })).toBeVisible()
    await expect(stats.locator('dd').first()).toHaveText(/^\d+$/)
  })

  test('wrong credentials show a generic error', async ({ page }) => {
    await signInWithForm(page, USERS.learner, 'Wrong-Password!1')
    await expect(page.locator('form').getByRole('alert')).toContainText('Email yoki parol noto‘g‘ri')
    await expect(page).toHaveURL(/\/login/)
  })

  test('a learner signs in, lands on the dashboard and signs out', async ({ page }) => {
    const assertClean = watchForErrors(page)
    await signInWithForm(page, USERS.learner)
    await expect(page).toHaveURL(/\/dashboard/)
    await page.getByRole('button', { name: 'Profil' }).click()
    await page.getByRole('menuitem', { name: 'Chiqish' }).click()
    await expect(page).toHaveURL(/\/login/)
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
    assertClean()
  })

  test('returns to the requested page after signing in', async ({ page }) => {
    await page.goto('/library')
    await expect(page).toHaveURL(/\/login\?next=%2Flibrary/)
    await page.locator('#email').fill(USERS.learner)
    await page.locator('#password').fill(PASSWORD)
    await page.getByRole('button', { name: 'Kirish' }).click()
    await expect(page).toHaveURL(/\/library$/)
  })

  test('self-registration creates a learner account', async ({ page }) => {
    const suffix = Date.now()
    await page.goto('/register')
    await page.locator('#lastName').fill('Sinovov')
    await page.locator('#firstName').fill('Aziz')
    await page.locator('#email').fill(`aziz.${suffix}@meteo.uz`)
    await page.locator('#username').fill(`aziz.${suffix}`)
    await page.locator('#password').fill('Gidromet!2026x')
    await page.locator('#confirm').fill('Gidromet!2026x')
    await page.getByRole('button', { name: 'Hisob yaratish' }).click()
    await expect(page).toHaveURL(/\/dashboard/)
    const me = await page.request.get('/api/auth/me')
    expect((await me.json()).data.role).toBe('learner')
  })

  test('registration validates the password policy on the client', async ({ page }) => {
    await page.goto('/register')
    await page.locator('#password').fill('short')
    await page.getByRole('button', { name: 'Hisob yaratish' }).click()
    await expect(page.getByText('Parol talablarga javob bermaydi.')).toBeVisible()
  })
})

test.describe('Shell and preferences', () => {
  test('language and theme switch without a reload and persist', async ({ page }) => {
    await signIn(page, USERS.learner)
    await page.goto('/courses')
    await page.getByRole('button', { name: 'Profil' }).click()
    await page.getByRole('menuitem', { name: 'Til' }).hover()
    await page.getByRole('menuitemradio', { name: 'Русский' }).click()
    await expect(page.getByRole('heading', { name: 'Каталог курсов' })).toBeVisible()
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Каталог курсов' })).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru')

    await page.getByRole('button', { name: 'Тёмная' }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await page.context().clearCookies({ name: 'gidroedu_lang' })
  })

  test('global search finds courses with Ctrl+K', async ({ page }) => {
    await signIn(page, USERS.learner)
    await page.goto('/dashboard')
    await page.keyboard.press('Control+k')
    await page.getByPlaceholder('Kurs, resurs yoki foydalanuvchini qidiring…').fill('radar')
    await page.getByRole('option', { name: /Meteorologik radar/ }).click()
    await expect(page).toHaveURL(/\/courses\/production-course-14/)
  })

  test('role-restricted pages redirect learners to the dashboard', async ({ page }) => {
    await signIn(page, USERS.learner)
    for (const path of ['/users', '/reports']) {
      await page.goto(path)
      await expect(page).toHaveURL(/\/dashboard/)
    }
  })

  test('navigation reflects the role', async ({ page }) => {
    await signIn(page, USERS.admin)
    await page.goto('/dashboard')
    const nav = page.getByRole('navigation', { name: 'Main' })
    await expect(nav.getByRole('link', { name: 'Foydalanuvchilar' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Hisobotlar' })).toBeVisible()
  })

  test('legacy certificate QR links redirect to the verification page', async ({ request }) => {
    const hash = '0123456789abcdef0123456789abcdef01234567'
    const response = await request.get(`/?view=verify&hash=${hash}`, { maxRedirects: 0 })
    expect(response.status()).toBe(308)
    expect(response.headers().location).toContain(`/verify/${hash}`)
  })

  test('mobile layout opens the navigation drawer @mobile', async ({ page }) => {
    await signIn(page, USERS.learner)
    await page.goto('/dashboard')
    await page.getByRole('button', { name: 'Menyuni ochish' }).click()
    await page.getByRole('dialog').getByRole('link', { name: 'Kutubxona' }).click()
    await expect(page).toHaveURL(/\/library/)
  })
})
