import { expect, test, type Page } from '@playwright/test'
import { apiAs, signIn, t, USERS, watchForErrors } from './support'

const COURSE = 'production-course-02'
const QUIZ = `${COURSE}-final-quiz`

type EditorQuestion = { type: string; text: string; options: Array<{ text: string; isCorrect: boolean }> }

/** Answers the visible question correctly using the answer key. */
async function answerCurrentQuestion(page: Page, key: EditorQuestion[]) {
  const heading = page.locator('section h2').first()
  const text = (await heading.innerText()).trim()
  const question = key.find((candidate) => text.includes(candidate.text.split('____')[0].trim().slice(0, 40)))
  expect(question, `answer key for "${text.slice(0, 60)}"`).toBeTruthy()
  const correct = question!.options.filter((option) => option.isCorrect)
  if (question!.type === 'fill_blank') {
    await page.getByRole('textbox').last().fill(correct[0].text)
  } else if (question!.type === 'multiple_choice') {
    for (const option of correct) await page.getByRole('checkbox', { name: option.text, exact: true }).click()
  } else {
    await page.getByRole('radio', { name: correct[0].text, exact: true }).click()
  }
}

test.describe.serial('Learner journey: finish a course, pass the final test, verify the certificate', () => {
  test('the dashboard greets the learner and lists courses in progress', async ({ page }) => {
    const assertClean = watchForErrors(page)
    await signIn(page, USERS.learner)
    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: /Dilnoza/ })).toBeVisible()
    await expect(page.getByText('Meteorologik kuzatuvlarni tashkil etish').first()).toBeVisible()
    assertClean()
  })

  test('completes the remaining lessons from the lesson player', async ({ page }) => {
    const assertClean = watchForErrors(page)
    await signIn(page, USERS.learner)
    await page.goto(`/courses/${COURSE}`)
    // The call to action is Continue/Start, or Review once the course is complete (re-runs).
    await page.getByRole('link', { name: new RegExp(`${t('courses.card.continue')}|${t('courses.card.start')}|${t('courses.actions.review')}`) }).first().click()
    await expect(page).toHaveURL(new RegExp(`/courses/${COURSE}/lessons/`))

    for (let guard = 0; guard < 9; guard += 1) {
      const complete = page.getByRole('button', { name: t('courses.lesson.markComplete') })
      const done = page.getByRole('main').getByText(t('courses.lesson.completed'))
      await expect(complete.or(done).first()).toBeVisible()
      if (await complete.isVisible()) {
        await complete.click()
        await expect(complete).toBeHidden()
      }
      const next = page.getByRole('link', { name: new RegExp(t('courses.lesson.next')) }).first()
      if (!(await next.isVisible())) break
      const current = page.url()
      await next.click()
      await expect(page).not.toHaveURL(current)
    }
    const progress = await page.request.get(`/api/courses/${COURSE}`)
    expect((await progress.json()).data.enrollment.progress).toBe(100)
    assertClean()
  })

  test('passes the final assessment and receives a certificate', async ({ page, request }) => {
    const assertClean = watchForErrors(page)
    const staff = await apiAs(request, USERS.instructor)
    const key = (await (await staff.get(`/api/quizzes/${QUIZ}/editor`)).json()).data.questions as EditorQuestion[]

    await signIn(page, USERS.learner)
    const detail = (await (await page.request.get(`/api/quizzes/${QUIZ}`)).json()).data
    test.skip(detail.attemptsRemaining === 0, 'no attempts left in this database; re-seed to rerun')
    await page.goto(`/quizzes/${QUIZ}`)
    await page.getByRole('button', { name: new RegExp(`${t('quizzes.action.start')}|${t('quizzes.action.resume')}|${t('quizzes.action.retry')}`) }).first().click()
    const confirm = page.getByRole('alertdialog')
    if (await confirm.isVisible().catch(() => false)) await confirm.getByRole('button', { name: t('quizzes.action.start') }).click()
    await expect(page).toHaveURL(/\/attempts\//)

    for (let index = 0; index < key.length; index += 1) {
      await answerCurrentQuestion(page, key)
      const next = page.getByRole('button', { name: t('action.next'), exact: true })
      if (await next.isVisible()) await next.click()
    }
    await page.getByRole('button', { name: t('quizzes.session.finish') }).click()
    await page.getByRole('alertdialog').getByRole('button', { name: t('quizzes.submit.confirm') }).click()

    await expect(page.getByText(t('quizzes.result.passedTitle'))).toBeVisible()
    await expect(page.getByText(t('quizzes.result.certificateTitle'))).toBeVisible()
    await page.getByRole('link', { name: t('quizzes.result.viewCertificate') }).click()
    await expect(page).toHaveURL(/\/certificates\//)
    await expect(page.getByText('Ergasheva Dilnoza Farhodovna').first()).toBeVisible()
    assertClean()
  })

  test('anyone can verify the new certificate on the public page', async ({ page, browser }) => {
    await signIn(page, USERS.learner)
    const certificates = (await (await page.request.get('/api/certificates?mine=true')).json()).data as Array<{ verifyHash: string; course: { id: string } }>
    const issued = certificates.find((certificate) => certificate.course.id === COURSE)
    expect(issued).toBeTruthy()

    const anonymous = await browser.newContext()
    const publicPage = await anonymous.newPage()
    await publicPage.goto(`/verify/${issued!.verifyHash}`)
    await expect(publicPage.getByText('Ergasheva Dilnoza Farhodovna').first()).toBeVisible()
    await expect(publicPage.getByText('Meteorologik kuzatuvlarni tashkil etish').first()).toBeVisible()
    await anonymous.close()
  })

  test('library: search, bookmark and open a document page', async ({ page }) => {
    const assertClean = watchForErrors(page)
    await signIn(page, USERS.learner)
    await page.goto('/library')
    await page.getByPlaceholder(t('library.search')).fill('WMO')
    await expect(page).toHaveURL(/q=WMO|search=WMO/)
    const first = page.getByRole('article').first()
    await expect(first).toBeVisible()
    await first.getByRole('link').first().click()
    await expect(page).toHaveURL(/\/library\//)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    assertClean()
  })

  test('notifications page lists the certificate notice and marks all read', async ({ page }) => {
    await signIn(page, USERS.learner)
    await page.goto('/notifications')
    await expect(page.getByText('Sertifikatingiz tayyor').first()).toBeVisible()
    const markAll = page.getByRole('button', { name: t('action.markAllRead') })
    if (await markAll.isVisible()) await markAll.click()
    const summary = await (await page.request.get('/api/notifications')).json()
    expect(summary.data.unreadCount).toBe(0)
  })
})
