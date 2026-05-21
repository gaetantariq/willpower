import { useEffect, useRef } from 'react'
import * as api from '../lib/api.js'

const todayKey = () => new Date().toISOString().slice(0, 10)

/**
 * Synchronise les données locales vers l'API Express.
 * Stratégie : last-write-wins, debounce 2s.
 */
export function useSync(user, token, state, onLoad) {
  const initialized = useRef(false)

  // ── Chargement initial depuis l'API ──
  useEffect(() => {
    if (!user || !token || initialized.current) return

    const load = async () => {
      try {
        const [profile, log, habits, streakData] = await Promise.all([
          api.getProfile(token),
          api.getTodayLog(token),
          api.getHabits(token),
          api.getStreak(token),
        ])

        if (onLoad) {
          onLoad({
            theme:        profile?.theme        ?? null,
            goal:         profile?.goal_minutes ?? 60,
            credit:       log?.credit           ?? 0,
            solidity:     log?.solidity         ?? 100,
            checked:      log?.checked_habits
                            ? Object.fromEntries(log.checked_habits.map(id => [id, true]))
                            : {},
            streak:       streakData?.streak    ?? 0,
            customHabits: habits?.map(h => ({ id: h.id, name: h.name })) ?? [],
          })
        }

        initialized.current = true
      } catch (err) {
        console.error('Erreur chargement cloud:', err)
        initialized.current = true
      }
    }

    load()
  }, [user, token])

  // ── Sauvegarde automatique (debounce 2s) ──
  const saveTimer = useRef(null)

  useEffect(() => {
    if (!user || !token || !initialized.current) return

    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      try {
        await Promise.all([
          api.updateProfile(token, { theme: state.theme, goal_minutes: state.goal }),
          api.updateTodayLog(token, {
            credit:         state.credit,
            solidity:       state.solidity,
            checked_habits: Object.keys(state.checked),
            streak:         state.streak,
          }),
        ])
      } catch (err) {
        console.error('Erreur sync cloud:', err)
      }
    }, 2000)

    return () => clearTimeout(saveTimer.current)
  }, [user, token, state])
}
