'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRecordWatchTime } from '../api'

const TICK_MS = 1000
const HEARTBEAT_MS = 15_000

interface WatchTimeOptions {
  courseId: string
  lessonId: string
  initialSec: number
  /** Track at all (enrolled learner on an unfinished video lesson). */
  enabled: boolean
  /** Whether the viewer is actively watching right now (e.g. the player is playing). */
  active: boolean
}

/**
 * Counts seconds of active viewing while the tab is visible and reports the
 * running total to the server every few seconds, when the tab is hidden and on
 * leave. The server keeps the maximum, so repeated reports are harmless.
 */
export function useWatchTime({ courseId, lessonId, initialSec, enabled, active }: WatchTimeOptions) {
  const [watched, setWatched] = useState(initialSec)
  const watchedRef = useRef(initialSec)
  const reportedRef = useRef(initialSec)
  const { mutate } = useRecordWatchTime(courseId)

  useEffect(() => {
    if (!enabled || !active) return
    const timer = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return
      watchedRef.current += 1
      setWatched(watchedRef.current)
    }, TICK_MS)
    return () => window.clearInterval(timer)
  }, [enabled, active])

  const report = useCallback(() => {
    if (watchedRef.current <= reportedRef.current) return
    reportedRef.current = watchedRef.current
    mutate({ lessonId, watchTimeSec: watchedRef.current })
  }, [lessonId, mutate])

  useEffect(() => {
    if (!enabled) return
    const timer = window.setInterval(report, HEARTBEAT_MS)
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') report()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibility)
      report()
    }
  }, [enabled, report])

  return watched
}
