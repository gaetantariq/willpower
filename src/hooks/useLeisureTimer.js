import { useState, useEffect, useRef } from 'react'

/**
 * Gère le timer de loisir.
 * Chaque tick (60s) : décrémente le crédit.
 * Si crédit = 0, appelle onDrainSolidity.
 */
export function useLeisureTimer({ onDecrementCredit, onDrainSolidity }) {
  const [active, setActive] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (active) {
      timerRef.current = setInterval(() => {
        onDecrementCredit(current => {
          if (current > 0) return current - 1
          onDrainSolidity()
          return 0
        })
      }, 60_000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [active])   // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => setActive(true)
  const stop  = () => setActive(false)
  const toggle = () => setActive(a => !a)

  return { active, start, stop, toggle }
}
