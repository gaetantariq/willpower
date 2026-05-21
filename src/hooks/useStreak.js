import { useState, useEffect } from 'react'

function todayKey() {
  return new Date().toISOString().slice(0, 10) // "2026-05-18"
}

function yesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

/**
 * Gère le streak de jours consécutifs.
 * - markDone()   : marque aujourd'hui comme complété, met à jour le streak
 * - streak       : nombre de jours consécutifs
 * - completedToday : true si aujourd'hui est déjà validé
 */
export function useStreak() {
  const load = (k, fb) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : fb } catch { return fb } }
  const save = (k, v)  => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

  const [streak,         setStreak]         = useState(() => load('wpos_streak', 0))
  const [lastDate,       setLastDate]       = useState(() => load('wpos_streak_date', null))
  const [completedToday, setCompletedToday] = useState(() => load('wpos_streak_date', null) === todayKey())

  const markDone = () => {
    const today = todayKey()
    if (lastDate === today) return // déjà validé aujourd'hui

    const newStreak = lastDate === yesterday() ? streak + 1 : 1
    setStreak(newStreak)
    setLastDate(today)
    setCompletedToday(true)
    save('wpos_streak', newStreak)
    save('wpos_streak_date', today)
  }

  const reset = () => {
    setStreak(0); setLastDate(null); setCompletedToday(false)
    localStorage.removeItem('wpos_streak')
    localStorage.removeItem('wpos_streak_date')
  }

  return { streak, completedToday, markDone, reset }
}
