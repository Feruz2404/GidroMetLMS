'use client'

import { useSyncExternalStore } from 'react'

export type ViewMode = 'grid' | 'list'

const STORAGE_KEY = 'gidroedu.library.view'
const listeners = new Set<() => void>()
// Fallback for when storage is unavailable (private mode), so the toggle still works for the session.
let memoryMode: ViewMode | null = null

function read(): ViewMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'grid' || stored === 'list') return stored
  } catch {
    // Storage unavailable; fall through to the in-memory value.
  }
  return memoryMode ?? 'grid'
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

function write(mode: ViewMode) {
  memoryMode = mode
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // Storage unavailable; the in-memory value is used instead.
  }
  listeners.forEach((listener) => listener())
}

/** Grid/list preference for the library, remembered across visits. */
export function useViewMode() {
  const mode = useSyncExternalStore(subscribe, read, () => 'grid' as const)
  return [mode, write] as const
}
