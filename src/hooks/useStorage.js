import { useState } from 'react'

/**
 * useState avec persistance automatique dans localStorage.
 * @param {string} key   - clé localStorage
 * @param {*} initial    - valeur par défaut si rien en storage
 */
export function useStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initial
    } catch {
      return initial
    }
  })

  const set = (next) => {
    setValue(prev => {
      const resolved = typeof next === 'function' ? next(prev) : next
      try { localStorage.setItem(key, JSON.stringify(resolved)) } catch {}
      return resolved
    })
  }

  const clear = () => {
    try { localStorage.removeItem(key) } catch {}
    setValue(initial)
  }

  return [value, set, clear]
}
