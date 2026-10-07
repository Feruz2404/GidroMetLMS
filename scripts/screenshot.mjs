// Developer tool: signs in as a demo user and captures full-page screenshots.
//
//   node scripts/screenshot.mjs <outDir> <email|-> <path> [path...]
//
// Paths may omit the leading slash (Git Bash rewrites "/x" into a Windows path).
// Env: BASE (default http://localhost:3000), WIDTH (1440), HEIGHT (900),
// THEME=dark, LOCALE=uz|ru|en, FULL=0 for viewport-only, WAIT=ms after load.
// The password is read from DEMO_SEED_PASSWORD (loaded from .env when present).
import { existsSync } from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'

if (existsSync('.env')) process.loadEnvFile('.env')

const [outDir, email, ...targets] = process.argv.slice(2)
if (!outDir || !targets.length) {
  console.error('Usage: node scripts/screenshot.mjs <outDir> <email|-> <path> [path...]')
  process.exit(2)
}

const base = process.env.BASE ?? 'http://localhost:3000'
const width = Number(process.env.WIDTH ?? 1440)
const dark = process.env.THEME === 'dark'
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width, height: Number(process.env.HEIGHT ?? 900) }, colorScheme: dark ? 'dark' : 'light' })
if (process.env.LOCALE) await context.addCookies([{ name: 'gidroedu_lang', value: process.env.LOCALE, url: base }])
await context.addInitScript((theme) => {
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // ignore
  }
}, dark ? 'dark' : 'light')

const page = await context.newPage()
const problems = []
page.on('console', (message) => message.type() === 'error' && problems.push(`console: ${message.text()}`))
page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`))
page.on('response', (response) => response.status() >= 500 && problems.push(`HTTP ${response.status()} ${response.url()}`))

if (email && email !== '-') {
  await page.goto(`${base}/login`)
  await page.fill('#email', email)
  await page.fill('#password', process.env.DEMO_SEED_PASSWORD ?? '')
  await page.click('button[type=submit]')
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 30_000 })
}

for (const raw of targets) {
  const target = raw.startsWith('/') ? raw : `/${raw}`
  await page.goto(`${base}${target}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(Number(process.env.WAIT ?? 700))
  const name = `${(email ?? 'anon').split('@')[0]}${target.replace(/[^a-z0-9]+/gi, '_')}-${width}${dark ? '-dark' : ''}.png`
  const file = path.join(outDir, name)
  await page.screenshot({ path: file, fullPage: process.env.FULL !== '0' })
  console.log(file)
}

if (problems.length) console.log(`PROBLEMS:\n${problems.join('\n')}`)
await browser.close()
