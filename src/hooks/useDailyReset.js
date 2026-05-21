import { useEffect } from 'react'

const todayKey = () => new Date().toISOString().slice(0, 10)

/**
 * Hook de reset journalier.
 * Au chargement, si le dernier accès était un autre jour :
 * - Sauvegarde le log de la veille dans wpos_history
 * - Remet à zéro les habitudes cochées et le crédit
 * - Remet la solidité à 100
 * - Met à jour la date du dernier accès
 */
export function useDailyReset(onReset) {
  useEffect(() => {
    const today    = todayKey()
    const lastDate = localStorage.getItem('wpos_last_date')

    if (lastDate && lastDate !== today) {
      // Sauvegarder le log de la veille dans l'historique
      const history  = JSON.parse(localStorage.getItem('wpos_history') || '{}')
      const credit   = JSON.parse(localStorage.getItem('wpos_credit')  || '0')
      const goal     = JSON.parse(localStorage.getItem('wpos_goal')    || '60')
      const solidity = JSON.parse(localStorage.getItem('wpos_solid')   || '100')
      const checked  = JSON.parse(localStorage.getItem('wpos_checked') || '{}')

      history[lastDate] = { credit, goal, solidity, checkedCount: Object.keys(checked).length }
      localStorage.setItem('wpos_history', JSON.stringify(history))

      // Reset du jour
      localStorage.setItem('wpos_credit',  JSON.stringify(0))
      localStorage.setItem('wpos_solid',   JSON.stringify(100))
      localStorage.setItem('wpos_checked', JSON.stringify({}))

      if (onReset) onReset()
    }

    // Mettre à jour la date du dernier accès
    localStorage.setItem('wpos_last_date', today)
  }, [])
}
