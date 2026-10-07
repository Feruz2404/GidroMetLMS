import { expect, test, type APIRequestContext } from '@playwright/test'
import { apiAs, PASSWORD, USERS } from './support'

type Envelope<T> = { status: 'success'; data: T; meta?: { total: number } } | { status: 'error'; code: string }

async function json<T>(promise: Promise<{ status(): number; json(): Promise<unknown> }>) {
  const response = await promise
  return { status: response.status(), body: (await response.json()) as Envelope<T> & { data: T; code?: string } }
}

test.describe('API · public', () => {
  test('health reports a reachable database', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.status()).toBe(200)
    expect((await response.json()).checks.databaseReachable).toBe(true)
  })

  test('login rejects wrong passwords generically and malformed JSON with 400', async ({ request }) => {
    const wrong = await json(request.post('/api/auth', { data: { email: USERS.learner, password: 'wrong-password' } }))
    expect(wrong.status).toBe(401)
    expect(wrong.body.code).toBe('INVALID_CREDENTIALS')
    const malformed = await request.post('/api/auth', { headers: { 'Content-Type': 'application/json' }, data: '{oops' })
    expect(malformed.status()).toBe(400)
  })

  test('protected endpoints require a session', async ({ request }) => {
    for (const path of ['/api/dashboard', '/api/courses', '/api/users', '/api/reports']) {
      expect((await request.get(path)).status(), path).toBe(401)
    }
  })

  test('cookie mutations from another origin are rejected', async ({ request }) => {
    await apiAs(request, USERS.learner)
    const response = await request.post('/api/courses/production-course-05/enroll', { headers: { Origin: 'https://evil.example' } })
    expect(response.status()).toBe(401)
  })

  test('certificate verification is public and validates the code format', async ({ request }) => {
    expect((await request.get('/api/certificates/verify?hash=not-a-hash')).status()).toBe(404)
  })
})

test.describe('API · learner', () => {
  let api: APIRequestContext
  test.beforeEach(async ({ request }) => {
    api = await apiAs(request, USERS.learner)
  })

  test('dashboard, catalogue and case-insensitive search', async () => {
    const dashboard = await json<{ kind: string; stats: { enrolled: number } }>(api.get('/api/dashboard'))
    expect(dashboard.body.data.kind).toBe('learner')
    expect(dashboard.body.data.stats.enrolled).toBeGreaterThan(0)
    const catalogue = await json<unknown[]>(api.get('/api/courses?limit=50'))
    expect(catalogue.body.data.length).toBeGreaterThanOrEqual(18)
    const search = await json<unknown[]>(api.get('/api/courses?search=GIDROLOG'))
    expect(search.body.data.length).toBeGreaterThan(0)
  })

  test('locked lessons stay locked until enrolment', async () => {
    const course = await json<{ enrollment: unknown; sections: Array<{ lessons: Array<{ id: string; isLocked: boolean; isFree: boolean }> }> }>(
      api.get('/api/courses/production-course-14')
    )
    test.skip(Boolean(course.body.data.enrollment), 'already enrolled in this run')
    const locked = course.body.data.sections[0].lessons.find((lesson) => !lesson.isFree)!
    expect(locked.isLocked).toBe(true)
    const blocked = await json(api.get(`/api/lessons/${locked.id}`))
    expect(blocked.status).toBe(403)
    expect(blocked.body.code).toBe('NOT_ENROLLED')
    const preview = course.body.data.sections[0].lessons.find((lesson) => lesson.isFree)!
    expect((await api.get(`/api/lessons/${preview.id}`)).status()).toBe(200)
  })

  test('assessments never leak answers before submission and cannot be submitted twice', async () => {
    // Pick any enrolled course whose final assessment still has attempts left.
    const courses = await json<Array<{ id: string; enrollment: { status: string } | null }>>(api.get('/api/courses?view=enrolled'))
    let quizId: string | undefined
    for (const course of courses.body.data.filter((item) => item.enrollment?.status === 'active')) {
      const detail = await json<{ quizzes: Array<{ id: string; attemptsUsed: number; maxAttempts: number }> }>(api.get(`/api/courses/${course.id}`))
      quizId = detail.body.data.quizzes.find((quiz) => quiz.attemptsUsed < quiz.maxAttempts)?.id
      if (quizId) break
    }
    test.skip(!quizId, 'no attempts left in this database; re-seed to rerun')
    const start = await json<{ attemptId: string; questions: Array<{ id: string; options: Array<{ id: string }> }> }>(api.post(`/api/quizzes/${quizId}/attempt`))
    expect(start.status).toBe(200)
    expect(JSON.stringify(start.body.data)).not.toContain('isCorrect')

    const answers = start.body.data.questions.map((question) => ({ questionId: question.id, selectedOptions: question.options.slice(0, 1).map((option) => option.id), textAnswer: 'x' }))
    expect((await api.put(`/api/quizzes/attempts/${start.body.data.attemptId}/answers`, { data: { answers: answers.slice(0, 2) } })).status()).toBe(200)
    const submitted = await json<{ status: string; percentage: number }>(api.post(`/api/quizzes/attempts/${start.body.data.attemptId}`, { data: { answers } }))
    expect(submitted.body.data.status).toBe('graded')
    const again = await json(api.post(`/api/quizzes/attempts/${start.body.data.attemptId}`, { data: { answers } }))
    expect(again.status).toBe(409)
  })

  test('own certificates verify publicly', async ({ playwright }) => {
    const mine = await json<Array<{ verifyHash: string }>>(api.get('/api/certificates?mine=true'))
    expect(mine.body.data.length).toBeGreaterThan(0)
    const anonymous = await playwright.request.newContext({ baseURL: test.info().project.use.baseURL })
    const verified = await json<{ status: string; recipientName: string }>(anonymous.get(`/api/certificates/verify?hash=${mine.body.data[0].verifyHash}`))
    expect(verified.body.data.status).toBe('active')
    expect(verified.body.data.recipientName).toContain('Ergasheva')
    await anonymous.dispose()
  })

  test('administrative endpoints are forbidden', async () => {
    for (const path of ['/api/users', '/api/reports?type=overview', '/api/certificates/auto']) {
      const response = path.endsWith('auto') ? await api.post(path) : await api.get(path)
      expect(response.status(), path).toBe(403)
    }
  })
})

test.describe('API · staff', () => {
  test('instructor authors a course end to end and cannot touch foreign courses', async ({ request }) => {
    const api = await apiAs(request, USERS.instructor)
    const created = await json<{ id: string; status: string }>(api.post('/api/courses', { data: { title: `E2E kurs ${Date.now()}`, level: 'beginner', durationHours: 2 } }))
    expect(created.body.data.status).toBe('draft')
    const id = created.body.data.id
    try {
      const empty = await json(api.patch(`/api/courses/${id}`, { data: { status: 'published' } }))
      expect(empty.body.code).toBe('COURSE_EMPTY')
      const section = await json<{ id: string }>(api.post(`/api/courses/${id}/sections`, { data: { title: 'Kirish' } }))
      await api.post(`/api/courses/${id}/lessons`, { data: { sectionId: section.body.data.id, title: 'Birinchi dars', content: '## Matn' } })
      const published = await json<{ status: string }>(api.patch(`/api/courses/${id}`, { data: { status: 'published' } }))
      expect(published.body.data.status).toBe('published')
      const foreign = await api.post('/api/quizzes', {
        data: { title: 'Begona test', courseId: 'production-course-07', questions: [{ type: 'true_false', text: 'Savolmi?', options: [{ text: 'To‘g‘ri', isCorrect: true }, { text: 'Noto‘g‘ri', isCorrect: false }] }] },
      })
      expect(foreign.status()).toBe(403)
      expect((await api.patch('/api/courses/production-course-07', { data: { title: 'Begona kurs nomi' } })).status()).toBe(403)
    } finally {
      expect((await api.delete(`/api/courses/${id}`)).status()).toBe(200)
    }
  })

  test('department manager sees only their department', async ({ request }) => {
    const api = await apiAs(request, USERS.manager)
    const rows = await json<Array<{ department: string }>>(api.get('/api/reports?type=learners'))
    expect(rows.body.data.length).toBeGreaterThan(0)
    expect(rows.body.data.every((row) => row.department === 'Meteorologiya boshqarmasi')).toBe(true)
    expect((await api.get('/api/reports?type=audit')).status()).toBe(403)
  })

  test('administrator manages users and exports reports', async ({ request }) => {
    const api = await apiAs(request, USERS.admin)
    const suffix = Date.now()
    const created = await json<{ id: string; mustChangePassword: boolean }>(
      api.post('/api/users', { data: { email: `e2e.${suffix}@demo.gidroedu.uz`, username: `e2e.${suffix}`, password: 'Gidromet!2026x', role: 'learner', firstName: 'Sinov', lastName: 'Foydalanuvchi' } })
    )
    expect(created.body.data.mustChangePassword).toBe(true)
    const updated = await json<{ firstName: string; position: string }>(api.patch(`/api/users/${created.body.data.id}`, { data: { position: 'Stajyor' } }))
    expect(updated.body.data).toMatchObject({ firstName: 'Sinov', position: 'Stajyor' })
    const duplicate = await json(api.post('/api/users', { data: { email: `e2e.${suffix}@demo.gidroedu.uz`, username: `other.${suffix}`, password: 'Gidromet!2026x', role: 'learner', firstName: 'A', lastName: 'B' } }))
    expect(duplicate.body.code).toBe('USER_EXISTS')
    const blocked = await json<{ isActive: boolean }>(api.patch(`/api/users/${created.body.data.id}/status`, { data: { isActive: false } }))
    expect(blocked.body.data.isActive).toBe(false)
    const signIn = await request.post('/api/auth', { data: { email: `e2e.${suffix}@demo.gidroedu.uz`, password: 'Gidromet!2026x' } })
    expect(signIn.status()).toBe(401)

    await apiAs(request, USERS.admin)
    const csv = await request.get('/api/reports?type=learners&format=csv')
    expect(csv.headers()['content-type']).toContain('text/csv')
    expect(await csv.text()).toContain('email')
  })

  test('super administrators cannot be created through the user API', async ({ request }) => {
    const api = await apiAs(request, USERS.admin)
    const response = await api.post('/api/users', { data: { email: 'root2@demo.gidroedu.uz', username: 'root2', password: PASSWORD || 'Gidromet!2026x', role: 'super_admin', firstName: 'R', lastName: 'T' } })
    expect(response.status()).toBe(400)
  })
})
