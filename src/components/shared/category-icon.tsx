import { createElement } from 'react'
import {
  BookOpen,
  CloudSun,
  Earth,
  Gauge,
  Landmark,
  ListChecks,
  Map,
  Orbit,
  Radar,
  Satellite,
  ShieldCheck,
  Siren,
  Sprout,
  ThermometerSun,
  TriangleAlert,
  Droplets,
  Waves,
  Wind,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Category records store a lucide icon name; only this vetted set is rendered.
const ICONS: Record<string, LucideIcon> = {
  CloudSun,
  Map,
  Sprout,
  Droplets,
  ThermometerSun,
  Earth,
  Gauge,
  Waves,
  Satellite,
  Orbit,
  Radar,
  Wind,
  TriangleAlert,
  Siren,
  Wrench,
  ListChecks,
  ShieldCheck,
  Landmark,
}

export function categoryIcon(name: string | null | undefined): LucideIcon {
  return (name && ICONS[name]) || BookOpen
}

export function CategoryIcon({ name, className }: { name: string | null | undefined; className?: string }) {
  return createElement(categoryIcon(name), { className: cn('size-5', className), 'aria-hidden': true })
}

const GRADIENTS = [
  'from-sky-500 to-blue-700',
  'from-cyan-500 to-teal-700',
  'from-indigo-500 to-blue-800',
  'from-emerald-500 to-teal-700',
  'from-blue-500 to-indigo-700',
  'from-teal-500 to-cyan-700',
  'from-violet-500 to-indigo-700',
  'from-amber-500 to-orange-600',
]

/** Deterministic cover gradient per category, so the catalogue reads as a coherent set. */
export function coverGradient(seed: string | null | undefined): string {
  let hash = 0
  for (const char of seed ?? 'course') hash = (hash * 33 + char.charCodeAt(0)) >>> 0
  return GRADIENTS[hash % GRADIENTS.length]
}

export function CourseCover({ icon, seed, className, children }: { icon?: string | null; seed?: string | null; className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn('relative overflow-hidden bg-gradient-to-br text-white', coverGradient(seed), className)}>
      <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 110 C 60 90 120 130 200 110 S 340 90 400 105 V160 H0 Z" fill="white" fillOpacity="0.35" />
        <path d="M0 130 C 80 115 140 150 220 130 S 350 120 400 132 V160 H0 Z" fill="white" fillOpacity="0.5" />
      </svg>
      {createElement(categoryIcon(icon), { className: 'absolute -right-4 -top-4 size-28 opacity-15', 'aria-hidden': true })}
      <div className="relative">{children}</div>
    </div>
  )
}
