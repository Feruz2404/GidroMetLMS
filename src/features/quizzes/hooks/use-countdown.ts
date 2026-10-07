'use client'

import { useEffect, useEffectEvent, useState } from 'react'

/**
 * Whole seconds left until `deadline` (ISO), or null before the first tick.
 * `onExpire` fires once, from the timer, when the countdown reaches zero.
 */
export function useCountdown(deadline: string, onExpire: () => void): number | null {
  const [remaining, setRemaining] = useState<number | null>(null)
  const expire = useEffectEvent(onExpire)

  useEffect(() => {
    const end = new Date(deadline).getTime()
    let expired = false
    const tick = () => {
      const next = Math.max(0, Math.ceil((end - Date.now()) / 1000))
      setRemaining(next)
      if (next === 0 && !expired) {
        expired = true
        expire()
      }
    }
    // A short interval keeps the display on second boundaries; equal values do not re-render.
    const first = setTimeout(tick, 0)
    const interval = setInterval(tick, 250)
    return () => {
      clearTimeout(first)
      clearInterval(interval)
    }
  }, [deadline])

  return remaining
}
