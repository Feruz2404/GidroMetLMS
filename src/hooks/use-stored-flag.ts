import { useCallback, useSyncExternalStore } from 'react'

const EVENT = 'gidroedu:storage'

function read(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener(EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(EVENT, callback)
  }
}

/** A boolean UI preference persisted in localStorage (false on the server and when storage is unavailable). */
export function useStoredFlag(key: string): [boolean, (value: boolean) => void] {
  const value = useSyncExternalStore(subscribe, () => read(key), () => false)
  const setValue = useCallback(
    (next: boolean) => {
      try {
        localStorage.setItem(key, next ? '1' : '0')
      } catch {
        // Storage can be unavailable (private mode); the preference simply isn't kept.
      }
      window.dispatchEvent(new Event(EVENT))
    },
    [key]
  )
  return [value, setValue]
}
