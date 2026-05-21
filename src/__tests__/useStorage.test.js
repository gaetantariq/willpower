import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStorage } from '../hooks/useStorage'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = String(value) }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()

Object.defineProperty(global, 'localStorage', { value: localStorageMock })

describe('useStorage', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('retourne la valeur par défaut si rien en storage', () => {
    const { result } = renderHook(() => useStorage('test_key', 42))
    expect(result.current[0]).toBe(42)
  })

  it('retourne la valeur stockée si elle existe', () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(99))
    const { result } = renderHook(() => useStorage('test_key', 42))
    expect(result.current[0]).toBe(99)
  })

  it('met à jour la valeur et la sauvegarde dans localStorage', () => {
    const { result } = renderHook(() => useStorage('test_key', 0))
    act(() => { result.current[1](100) })
    expect(result.current[0]).toBe(100)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test_key', JSON.stringify(100))
  })

  it('supporte les mises à jour fonctionnelles', () => {
    const { result } = renderHook(() => useStorage('test_key', 10))
    act(() => { result.current[1](prev => prev + 5) })
    expect(result.current[0]).toBe(15)
  })

  it('remet la valeur par défaut et supprime du storage avec clear()', () => {
    const { result } = renderHook(() => useStorage('test_key', 0))
    act(() => { result.current[1](50) })
    act(() => { result.current[2]() })
    expect(result.current[0]).toBe(0)
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('test_key')
  })

  it('fonctionne avec des objets', () => {
    const { result } = renderHook(() => useStorage('test_obj', {}))
    act(() => { result.current[1]({ a: 1, b: 2 }) })
    expect(result.current[0]).toEqual({ a: 1, b: 2 })
  })
})
