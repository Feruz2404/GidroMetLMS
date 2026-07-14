import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeResourceUrl(value: string | null | undefined): string | null {
  if (!value) return null
  const candidate = value.trim()
  if (candidate.startsWith('/') && !candidate.startsWith('//')) return candidate
  try {
    const url = new URL(candidate)
    if (url.protocol === 'https:') return url.toString()
    if (url.protocol === 'http:' && ['localhost', '127.0.0.1', '::1'].includes(url.hostname)) return url.toString()
  } catch {
    return null
  }
  return null
}
