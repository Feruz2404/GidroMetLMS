'use client'

import { useEffect, useRef, useState } from 'react'
import type { SubmittedAnswerDto } from '@/shared/dto'
import { useSaveAnswers } from '../api'
import { isAttemptClosed } from '../session-model'

export type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error'

const DEBOUNCE_MS = 800
const RETRY_MS = 5000

interface AutosaveOptions {
  attemptId: string
  /** Builds the payload for the given question ids from the latest answers. */
  payload: (questionIds: string[]) => SubmittedAnswerDto[]
  /** Called once when the server reports the attempt is already closed. */
  onClosed: () => void
}

/**
 * Debounced, serialised autosave of changed answers. Saves never overlap, failed
 * ones are retried, and `stop()` waits for the in-flight save before submitting.
 */
export function useAutosave({ attemptId, payload, onClosed }: AutosaveOptions) {
  const save = useSaveAnswers(attemptId)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const dirty = useRef(new Set<string>())
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const chain = useRef<Promise<void>>(Promise.resolve())
  const stopped = useRef(false)
  const latest = useRef({ payload, onClosed })

  useEffect(() => {
    latest.current = { payload, onClosed }
  })

  useEffect(() => () => clearTimeout(timer.current), [])

  const run = async () => {
    const ids = [...dirty.current]
    if (ids.length === 0 || stopped.current) return
    dirty.current.clear()
    setStatus('saving')
    try {
      await save.mutateAsync(latest.current.payload(ids))
      setStatus(dirty.current.size > 0 ? 'pending' : 'saved')
    } catch (error) {
      ids.forEach((id) => dirty.current.add(id))
      if (isAttemptClosed(error)) {
        stopped.current = true
        latest.current.onClosed()
        return
      }
      setStatus('error')
      timer.current = setTimeout(flush, RETRY_MS)
    }
  }

  function flush(): Promise<void> {
    clearTimeout(timer.current)
    chain.current = chain.current.then(run)
    return chain.current
  }

  return {
    status,
    /** Marks a question as changed and schedules a save. */
    mark(questionId: string) {
      dirty.current.add(questionId)
      setStatus('pending')
      clearTimeout(timer.current)
      timer.current = setTimeout(flush, DEBOUNCE_MS)
    },
    flush,
    /** Stops saving and resolves once no save is in flight. */
    async stop() {
      clearTimeout(timer.current)
      stopped.current = true
      await chain.current
    },
    /** Re-enables saving after a failed submit. */
    resume() {
      stopped.current = false
    },
  }
}
