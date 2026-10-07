'use client'

import { useSyncExternalStore } from 'react'

const MINUTE = 60_000
let snapshot = 0

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, MINUTE)
  return () => window.clearInterval(timer)
}

// Cached per minute so React sees a stable snapshot between renders.
function getSnapshot(): number {
  const now = Date.now()
  if (now - snapshot >= MINUTE) snapshot = now
  return snapshot
}

/**
 * Current time on the client, `null` while rendering on the server. Greetings
 * and "days left" depend on the viewer's clock, so they must not be rendered
 * from the server's time zone.
 */
export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null)
}

export const DAY_MS = 24 * 60 * 60 * 1000
