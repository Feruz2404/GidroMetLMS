import { expect, test } from '@playwright/test'
import { signIn, t, USERS, watchForErrors } from './support'

test.describe('Instructor', () => {
  test('creates a course, builds its curriculum and publishes it', async ({ page }) => {
    const assertClean = watchForErrors(page)
    const title = `Anemometr bilan ishlash ${Date.now()}`
    await signIn(page, USERS.instructor)

    await page.goto('/courses/new')
    await page.locator('#title').fill(title)
    await page.getByRole('button', { name: t('courses.create.submit') }).click()
    await expect(page).toHaveURL(/\/courses\/[^/]+\/edit/)
    const courseId = page.url().split('/courses/')[1].split('/')[0]

    await page.getByRole('button', { name: t('courses.editor.section.add') }).first().click()
    await page.locator('#section-title').fill('Shamol o‘lchash asoslari')
    await page.getByRole('dialog').getByRole('button', { name: t('action.add') }).click()
    await expect(page.getByText('Shamol o‘lchash asoslari').first()).toBeVisible()

    await page.getByRole('button', { name: t('courses.editor.lesson.add') }).first().click()
    const lessonDialog = page.getByRole('dialog')
    await lessonDialog.locator('#lesson-title').fill('Anemometrni o‘rnatish balandligi')
    await lessonDialog.locator('textarea').last().fill('## Standart balandlik\n\nShamol 10 m balandlikda o‘lchanadi.')
    await lessonDialog.getByRole('button', { name: t('action.add') }).click()
    await expect(page.getByText('Anemometrni o‘rnatish balandligi').first()).toBeVisible()

    await page.getByRole('tab', { name: t('courses.editor.tab.publishing') }).click()
    await page.getByText(t('status.published'), { exact: true }).first().click()
    await page.getByRole('button', { name: t('action.publish') }).click()
    await expect.poll(async () => (await (await page.request.get(`/api/courses/${courseId}`)).json()).data.status).toBe('published')

    await page.goto(`/courses/${courseId}`)
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
    await page.request.delete(`/api/courses/${courseId}`)
    assertClean()
  })

  test('sees own learners and course performance on the dashboard', async ({ page }) => {
    await signIn(page, USERS.instructor)
    await page.goto('/dashboard')
    await expect(page.getByText('Gidrometeorologiyaga kirish').first()).toBeVisible()
    await page.goto('/courses/production-course-01/edit?tab=learners')
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByRole('row')).not.toHaveCount(1)
  })

  test('opens the quiz builder with the existing questions', async ({ page }) => {
    await signIn(page, USERS.instructor)
    await page.goto('/quizzes/production-course-01-final-quiz/edit')
    await expect(page.locator('input').first()).toHaveValue(/yakuniy test/)
  })
})

test.describe('Administrator', () => {
  test('creates a user from the directory dialog', async ({ page }) => {
    const assertClean = watchForErrors(page)
    const suffix = Date.now()
    await signIn(page, USERS.admin)
    await page.goto('/users?new=1')
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.locator('#user-lastName').fill('Sinovov')
    await dialog.locator('#user-firstName').fill('Bekzod')
    await dialog.locator('#user-email').fill(`b.sinovov.${suffix}@demo.gidroedu.uz`)
    await dialog.locator('#user-username').fill(`b.sinovov.${suffix}`)
    await dialog.locator('input[type="password"], input[id*="password"]').first().fill('Vaqtinchalik!2026')
    await dialog.getByRole('button', { name: t('users.form.submitCreate') }).click()
    await expect(dialog).toBeHidden()
    await page.goto(`/users?search=b.sinovov.${suffix}`)
    await expect(page.getByText(`b.sinovov.${suffix}@demo.gidroedu.uz`).first()).toBeVisible()
    assertClean()
  })

  test('reports: every tab renders and CSV export downloads', async ({ page }) => {
    const assertClean = watchForErrors(page)
    await signIn(page, USERS.admin)
    await page.goto('/reports')
    for (const tab of ['reports.tab.learners', 'reports.tab.courses', 'reports.tab.assessments', 'reports.tab.certificates', 'reports.tab.library', 'reports.tab.audit'] as const) {
      await page.getByRole('tab', { name: t(tab) }).click()
      await expect(page.getByRole('table').first()).toBeVisible()
    }
    const download = page.waitForEvent('download')
    await page.getByRole('link', { name: new RegExp(t('action.exportCsv')) }).first().click()
    expect((await download).suggestedFilename()).toMatch(/\.csv$/)
    assertClean()
  })

  test('publishes an announcement to learners', async ({ page }) => {
    await signIn(page, USERS.admin)
    await page.goto('/notifications')
    await page.getByRole('button', { name: t('notifications.announce.open') }).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByLabel(t('notifications.announce.heading')).fill('Yangi o‘quv mavsumi')
    await dialog.getByLabel(t('notifications.announce.message')).fill('Kuzgi malaka oshirish kurslari boshlandi.')
    await dialog.getByRole('button', { name: t('notifications.announce.submit') }).click()
    await expect(page.getByText(/foydalanuvchiga yuborildi/)).toBeVisible()
  })

  test('certificate registry lists issued certificates', async ({ page }) => {
    await signIn(page, USERS.admin)
    await page.goto('/certificates')
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByText(/SRT-\d{6}-/).first()).toBeVisible()
  })
})

test.describe('Department manager', () => {
  test('sees department-scoped dashboard and reports', async ({ page }) => {
    const assertClean = watchForErrors(page)
    await signIn(page, USERS.manager)
    await page.goto('/dashboard')
    await expect(page.getByText('Meteorologiya boshqarmasi').first()).toBeVisible()
    await page.goto('/reports')
    await expect(page.getByRole('tab', { name: t('reports.tab.audit') })).toHaveCount(0)
    await page.getByRole('tab', { name: t('reports.tab.learners') }).click()
    await expect(page.getByRole('table').first()).toBeVisible()
    assertClean()
  })
})
