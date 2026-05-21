import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLeisureTimer } from '../hooks/useLeisureTimer'

describe('useLeisureTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('démarre inactif', () => {
    const { result } = renderHook(() =>
      useLeisureTimer({ onDecrementCredit: vi.fn(), onDrainSolidity: vi.fn() })
    )
    expect(result.current.active).toBe(false)
  })

  it('start() active le timer', () => {
    const { result } = renderHook(() =>
      useLeisureTimer({ onDecrementCredit: vi.fn(), onDrainSolidity: vi.fn() })
    )
    act(() => { result.current.start() })
    expect(result.current.active).toBe(true)
  })

  it('stop() désactive le timer', () => {
    const { result } = renderHook(() =>
      useLeisureTimer({ onDecrementCredit: vi.fn(), onDrainSolidity: vi.fn() })
    )
    act(() => { result.current.start() })
    act(() => { result.current.stop() })
    expect(result.current.active).toBe(false)
  })

  it('toggle() inverse l\'état actif', () => {
    const { result } = renderHook(() =>
      useLeisureTimer({ onDecrementCredit: vi.fn(), onDrainSolidity: vi.fn() })
    )
    act(() => { result.current.toggle() })
    expect(result.current.active).toBe(true)
    act(() => { result.current.toggle() })
    expect(result.current.active).toBe(false)
  })

  it('appelle onDecrementCredit après 60 secondes', () => {
    const onDecrementCredit = vi.fn(cb => typeof cb === 'function' ? cb(10) : null)
    const onDrainSolidity   = vi.fn()

    const { result } = renderHook(() =>
      useLeisureTimer({ onDecrementCredit, onDrainSolidity })
    )

    act(() => { result.current.start() })
    act(() => { vi.advanceTimersByTime(60000) })

    expect(onDecrementCredit).toHaveBeenCalled()
  })

  it('ne déclenche pas le timer si inactif', () => {
    const onDecrementCredit = vi.fn()
    const { result } = renderHook(() =>
      useLeisureTimer({ onDecrementCredit, onDrainSolidity: vi.fn() })
    )
    act(() => { vi.advanceTimersByTime(60000) })
    expect(onDecrementCredit).not.toHaveBeenCalled()
  })
})
