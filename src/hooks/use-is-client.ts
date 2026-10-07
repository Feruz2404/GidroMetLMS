import { useSyncExternalStore } from 'react'

const subscribe = () => () => undefined

/** True after hydration; false during server rendering. Avoids hydration mismatches for client-only UI. */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false)
}
