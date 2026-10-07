'use client'

import { Award, BarChart3, BookOpenCheck, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { LocaleSwitcher } from '@/components/layout/locale-switcher'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useI18n } from '@/i18n/provider'

const FEATURES = [
  { icon: BookOpenCheck, key: 'auth.feature.courses' },
  { icon: ShieldCheck, key: 'auth.feature.assessment' },
  { icon: Award, key: 'auth.feature.certificates' },
  { icon: BarChart3, key: 'auth.feature.reports' },
] as const

export function AuthHero({ stats }: { stats: { courses: number; lessons: number; resources: number } | null }) {
  const { t, formatNumber } = useI18n()
  return (
    <aside className="relative hidden overflow-hidden bg-[oklch(0.2_0.05_258)] text-white lg:flex lg:flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.55_0.17_250/0.55),transparent_60%),radial-gradient(ellipse_at_bottom_left,oklch(0.7_0.12_210/0.35),transparent_55%)]" />
      <svg className="absolute inset-x-0 bottom-0 w-full opacity-[0.18]" viewBox="0 0 800 260" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 160 C 120 120 240 200 400 160 S 680 120 800 150 V260 H0 Z" fill="white" />
        <path d="M0 200 C 140 170 260 240 420 200 S 690 170 800 196 V260 H0 Z" fill="white" fillOpacity="0.6" />
      </svg>

      <div className="relative flex flex-1 flex-col px-12 py-10 xl:px-16">
        <div className="flex items-center justify-between">
          <Logo inverted subtitle={t('app.institution')} />
          <div className="flex items-center gap-1">
            <LocaleSwitcher tone="inverted" />
            <ThemeToggle tone="inverted" />
          </div>
        </div>

        <div className="my-auto max-w-xl py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">{t('auth.hero.eyebrow')}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.15] tracking-tight text-balance xl:text-[2.6rem]">{t('auth.hero.title')}</h1>
          <p className="mt-5 text-base leading-7 text-white/70">{t('auth.hero.description')}</p>

          {stats && (
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
              {(
                [
                  ['auth.hero.courses', stats.courses],
                  ['auth.hero.lessons', stats.lessons],
                  ['auth.hero.resources', stats.resources],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="flex flex-col">
                  <dt className="order-2 text-sm text-white/60">{t(label)}</dt>
                  <dd className="order-1 text-3xl font-semibold tabular-nums">{formatNumber(value)}</dd>
                </div>
              ))}
            </dl>
          )}

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, key }) => (
              <li key={key} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-sm">
                <Icon className="mt-0.5 size-5 shrink-0 text-sky-300" aria-hidden="true" />
                <span className="text-sm leading-5 text-white/85">{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/45">{t('app.copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </aside>
  )
}
