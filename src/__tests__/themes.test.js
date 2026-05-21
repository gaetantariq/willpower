import { describe, it, expect } from 'vitest'
import { THEMES, CREDIT_BONUS, SOLIDITY_DRAIN, DEFAULT_GOAL, MAX_CREDIT_DISPLAY } from '../data/themes'

describe('themes.js — données statiques', () => {
  it('contient exactement 3 thèmes', () => {
    expect(Object.keys(THEMES)).toHaveLength(3)
  })

  it('chaque thème a exactement 3 habitudes', () => {
    Object.values(THEMES).forEach(theme => {
      expect(theme.habits).toHaveLength(3)
    })
  })

  it('chaque thème a les propriétés requises', () => {
    Object.values(THEMES).forEach(theme => {
      expect(theme).toHaveProperty('key')
      expect(theme).toHaveProperty('name')
      expect(theme).toHaveProperty('icon')
      expect(theme).toHaveProperty('accent')
      expect(theme).toHaveProperty('habits')
    })
  })

  it('chaque habitude a un id et un nom', () => {
    Object.values(THEMES).forEach(theme => {
      theme.habits.forEach(habit => {
        expect(habit).toHaveProperty('id')
        expect(habit).toHaveProperty('name')
        expect(habit.name.length).toBeGreaterThan(0)
      })
    })
  })

  it('les ids des habitudes sont uniques globalement', () => {
    const ids = Object.values(THEMES).flatMap(t => t.habits.map(h => h.id))
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('CREDIT_BONUS est un nombre positif', () => {
    expect(CREDIT_BONUS).toBeGreaterThan(0)
  })

  it('SOLIDITY_DRAIN est un nombre positif', () => {
    expect(SOLIDITY_DRAIN).toBeGreaterThan(0)
  })

  it('DEFAULT_GOAL est supérieur à 0', () => {
    expect(DEFAULT_GOAL).toBeGreaterThan(0)
  })

  it('MAX_CREDIT_DISPLAY est supérieur à DEFAULT_GOAL', () => {
    expect(MAX_CREDIT_DISPLAY).toBeGreaterThanOrEqual(DEFAULT_GOAL)
  })
})
