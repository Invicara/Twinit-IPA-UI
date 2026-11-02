import * as React from "react"

/**
 * Debounced callback that always invokes the latest function instance.
 * Leading calls within `delayMs` are coalesced; the trailing call runs after quiet.
 */
export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delayMs: number
) {
  const callbackRef = React.useRef(callback)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useLayoutEffect(() => {
    callbackRef.current = callback
  })

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return React.useCallback(
    (...args: TArgs) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        callbackRef.current(...args)
      }, delayMs)
    },
    [delayMs]
  )
}
