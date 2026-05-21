import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStreak } from '../hooks/useStreak'

// Mock localStorage
const store = {}
const localStorageMock = {
  getItem: vi.fn((key) => store[key] ?? null),
  setItem: vi.fn((key, value) => { store[key] = String(value) }),
  removeItem: vi.fn((key) => { delete store[key] }),
  clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
}
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

const today     = new Date().toISOString().slice(0, 10)
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

describe('useStreak', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('démarre avec un streak à 0', () => {
    const { result } = renderHook(() => useStreak())
    expect(result.current.streak).toBe(0)
    expect(result.current.completedToday).toBe(false)
  })

  it('markDone() passe le streak à 1 au premier appel', () => {
    const { result } = renderHook(() => useStreak())
    act(() => { result.current.markDone() })
    expect(result.current.streak).toBe(1)
    expect(result.current.completedToday).toBe(true)
  })

  it('markDone() ne fait rien si déjà appelé aujourd\'hui', () => {
    const { result } = renderHook(() => useStreak())
    act(() => { result.current.markDone() })
    act(() => { result.current.markDone() })
    expect(result.current.streak).toBe(1)
  })

  it('streak continue si le dernier log était hier', () => {
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'wpos_streak') return JSON.stringify(3)
      if (key === 'wpos_streak_date') return JSON.stringify(yesterday)
      return null
    })
    const { result } = renderHook(() => useStreak())
    act(() => { result.current.markDone() })
    expect(result.current.streak).toBe(4)
  })

  it('streak repart à 1 si le dernier log n\'était pas hier', () => {
    const oldDate = '2020-01-01'
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'wpos_streak') return JSON.stringify(10)
      if (key === 'wpos_streak_date') return JSON.stringify(oldDate)
      return null
    })
    const { result } = renderHook(() => useStreak())
    act(() => { result.current.markDone() })
    expect(result.current.streak).toBe(1)
  })

  it('reset() remet streak à 0', () => {
    const { result } = renderHook(() => useStreak())
    act(() => { result.current.markDone() })
    act(() => { result.current.reset() })
    expect(result.current.streak).toBe(0)
    expect(result.current.completedToday).toBe(false)
  })
})
