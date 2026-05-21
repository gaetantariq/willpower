import React, { useEffect, useState } from 'react'
import { THEMES, CREDIT_BONUS, SOLIDITY_DRAIN, DEFAULT_GOAL } from '../data/themes'
import { useStorage }      from '../hooks/useStorage'
import { useLeisureTimer } from '../hooks/useLeisureTimer'
import { useStreak }       from '../hooks/useStreak'
import { useDailyReset }   from '../hooks/useDailyReset'
import SolidityGauge       from './SolidityGauge'
import CreditCounter       from './CreditCounter'
import LeisureButton       from './LeisureButton'
import HabitItem           from './HabitItem'
import FlashMessage        from './FlashMessage'
import StreakBadge         from './StreakBadge'
import GoalSettings        from './GoalSettings'
import History             from './History'
import Badges              from './Badges'
import Pomodoro            from './Pomodoro'

const TABS = [
  { key: 'home',     icon: '⊞', label: 'Accueil'    },
  { key: 'history',  icon: '◈', label: 'Historique' },
  { key: 'badges',   icon: '🏆', label: 'Badges'     },
  { key: 'pomodoro', icon: '◉', label: 'Pomodoro'   },
]

export default function Dashboard({ themeKey, setThemeKey, onReset, onSignOut }) {
  const [currentThemeKey, setCurrentThemeKey] = useState(themeKey)
  const theme = THEMES[currentThemeKey]

  const [credit,       setCredit]       = useStorage('wpos_credit',        0)
  const [solidity,     setSolidity]     = useStorage('wpos_solid',         100)
  const [checked,      setChecked]      = useStorage('wpos_checked',       {})
  const [goal,         setGoal]         = useStorage('wpos_goal',          DEFAULT_GOAL)
  const [customHabits, setCustomHabits] = useStorage('wpos_custom_habits', [])
  const [flash,        setFlash]        = useState(null)
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [showTheme,    setShowTheme]    = useState(false)
  const [activeTab,    setActiveTab]    = useState('home')

  const { streak, completedToday, markDone, reset: resetStreak } = useStreak()

  // Reset journalier automatique
  useDailyReset(() => {
    setCredit(0)
    setSolidity(100)
    setChecked({})
    showFlash('☀ Nouveau jour — habitudes réinitialisées !')
  })

  const allHabits = [...theme.habits, ...customHabits]

  useEffect(() => {
    if (credit >= goal && !completedToday) {
      markDone()
      showFlash('🔥 Objectif atteint ! Streak +1')
    }
  }, [credit, goal])

  const showFlash = (msg) => { setFlash(msg); setTimeout(() => setFlash(null), 2500) }

  const { active: leisureActive, toggle: toggleLeisure } = useLeisureTimer({
    onDecrementCredit: setCredit,
    onDrainSolidity: () => setSolidity(s => Math.max(0, s - SOLIDITY_DRAIN)),
  })

  const handleToggleHabit = (id, wasDone) => {
    if (wasDone) {
      setChecked(prev => { const n = { ...prev }; delete n[id]; return n })
      setCredit(c => Math.max(0, c - CREDIT_BONUS))
      showFlash(`-${CREDIT_BONUS} min crédit`)
    } else {
      setChecked(prev => ({ ...prev, [id]: true }))
      setCredit(c => c + CREDIT_BONUS)
      showFlash(`+${CREDIT_BONUS} min crédit`)
    }
  }

  // Appelé par le Pomodoro quand le focus se termine
  const handlePomodoroComplete = (habitId) => {
    if (!checked[habitId]) {
      setChecked(prev => ({ ...prev, [habitId]: true }))
      setCredit(c => c + CREDIT_BONUS)
      showFlash(`✓ Habitude complétée via Pomodoro ! +${CREDIT_BONUS} min`)
    }
  }

  const handleLeisureToggle = () => {
    if (!leisureActive && credit <= 0 && solidity <= 0) { showFlash('⚠ Aucun crédit disponible'); return }
    toggleLeisure()
  }

  // Changer de thème sans tout réinitialiser
  const handleChangeTheme = (key) => {
    setCurrentThemeKey(key)
    localStorage.setItem('wpos_theme', JSON.stringify(key))
    setShowTheme(false)
    showFlash(`Protocole changé : ${THEMES[key].name}`)
  }

  const handleBack    = () => { localStorage.removeItem('wpos_theme'); onReset() }
  const handleReset   = () => { localStorage.clear(); resetStreak(); onReset() }
  const handleSignOut = () => { localStorage.clear(); onSignOut() }

  const blurPx  = ((100 - solidity) / 100) * 14
  const now     = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const goalPct = Math.min(100, (credit / goal) * 100)

  return (
    <div className="min-h-screen flex flex-col transition-all duration-500"
      style={{ filter: `blur(${blurPx}px)`, background: 'var(--bg)' }}>

      {/* ── Header ── */}
      <div className="sticky top-0 z-40 px-4 pt-safe"
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex justify-between items-center py-3 font-mono-tech text-xs" style={{ color: 'var(--muted)' }}>
          <span>WILLPOWER OS</span>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
            style={{ background: theme.accent, boxShadow: `0 0 6px ${theme.accent}` }} />
          <span>{now}</span>
        </div>
        <div className="flex items-center gap-2 pb-3">
          {/* Retour */}
          <button onClick={handleBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center font-orbitron text-lg transition-all active:scale-90"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            ‹
          </button>

          {/* Titre + changement de thème */}
          <button onClick={() => setShowTheme(true)} className="flex-1 min-w-0 text-left">
            <h2 className="font-orbitron text-xl font-black text-white tracking-widest">DASHBOARD</h2>
            <p className="font-mono-tech text-xs tracking-widest flex items-center gap-1" style={{ color: theme.accent }}>
              {theme.icon} PROTOCOLE {theme.name}
              <span style={{ color: 'var(--muted)', fontSize: 9 }}>▾</span>
            </p>
          </button>

          {/* Déconnexion */}
          <button onClick={() => setShowConfirm(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
            ⏻
          </button>
        </div>
      </div>

      {/* ── Contenu ── */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-lg mx-auto px-4 py-4">

          {activeTab === 'home' && <>
            <StreakBadge streak={streak} completedToday={completedToday} accent={theme.accent} />
            <SolidityGauge solidity={solidity} />
            <CreditCounter credit={credit} accent={theme.accent} goal={goal} goalPct={goalPct} />
            <div className="mb-4">
              <LeisureButton active={leisureActive} onToggle={handleLeisureToggle} />
            </div>
            <GoalSettings goal={goal} onGoalChange={setGoal}
              customHabits={customHabits} onHabitsChange={setCustomHabits} accent={theme.accent} />
            <p className="font-mono-tech text-xs tracking-widest mb-3 px-1 mt-2" style={{ color: 'var(--muted)' }}>
              ▸ PROTOCOLE DU JOUR
            </p>
            {allHabits.map(h => (
              <HabitItem key={h.id} habit={h} done={!!checked[h.id]}
                accent={theme.accent} onToggle={handleToggleHabit} />
            ))}
            {allHabits.length === 0 && (
              <p className="font-mono-tech text-xs text-center py-6" style={{ color: 'var(--muted)' }}>
                Aucune habitude. Ajoutez-en via ⚙ Personnaliser.
              </p>
            )}
            <button onClick={handleReset}
              className="font-mono-tech text-xs tracking-widest px-4 py-3 rounded-xl mt-4 mb-4 w-full transition-all active:scale-95"
              style={{ border: '1px solid var(--border)', color: 'var(--muted)', background: 'none' }}>
              ⟳ RÉINITIALISER LE PROTOCOLE
            </button>
          </>}

          {activeTab === 'history'  && <History accent={theme.accent} />}
          {activeTab === 'badges'   && <Badges streak={streak} solidity={solidity} credit={credit} accent={theme.accent} />}
          {activeTab === 'pomodoro' && (
            <Pomodoro
              accent={theme.accent}
              habits={allHabits}
              checkedHabits={checked}
              onHabitComplete={handlePomodoroComplete}
            />
          )}
        </div>
      </div>

      {/* ── Bottom nav ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex"
        style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="flex-1 flex flex-col items-center py-3 gap-1 transition-all"
            style={{ color: activeTab === tab.key ? theme.accent : 'var(--muted)' }}>
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span className="font-mono-tech" style={{ fontSize: 9 }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Modal changement de thème ── */}
      {showTheme && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-lg rounded-t-3xl p-6"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="font-orbitron text-sm font-bold text-white mb-1">CHANGER DE PROTOCOLE</p>
            <p className="font-mono-tech text-xs mb-4" style={{ color: 'var(--muted)' }}>
              Tes habitudes perso et ton crédit sont conservés.
            </p>
            <div className="flex flex-col gap-2 mb-4">
              {Object.values(THEMES).map(t => (
                <button key={t.key} onClick={() => handleChangeTheme(t.key)}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all active:scale-95"
                  style={{
                    background: currentThemeKey === t.key ? `${t.accent}15` : 'var(--bg)',
                    border: currentThemeKey === t.key ? `1px solid ${t.accent}44` : '1px solid var(--border)',
                  }}>
                  <span style={{ fontSize: 24 }}>{t.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-orbitron text-sm font-bold" style={{ color: t.accent }}>{t.name}</div>
                    <div className="font-mono-tech text-xs" style={{ color: 'var(--muted)' }}>
                      {t.habits.map(h => h.name).join(' · ')}
                    </div>
                  </div>
                  {currentThemeKey === t.key && (
                    <span className="font-mono-tech text-xs" style={{ color: t.accent }}>✓</span>
                  )}
                </button>
              ))}
            </div>
            <button onClick={() => setShowTheme(false)}
              className="w-full py-3 rounded-xl font-mono-tech text-xs transition-all active:scale-95"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
              ANNULER
            </button>
          </div>
        </div>
      )}

      {/* ── Modal déconnexion ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="font-orbitron text-sm font-bold text-white mb-2">SE DÉCONNECTER ?</p>
            <p className="font-mono-tech text-xs mb-6" style={{ color: 'var(--muted)' }}>
              Tes données sont sauvegardées. Tu pourras te reconnecter à tout moment.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl font-mono-tech text-xs transition-all active:scale-95"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                ANNULER
              </button>
              <button onClick={handleSignOut}
                className="flex-1 py-3 rounded-xl font-mono-tech text-xs font-bold transition-all active:scale-95"
                style={{ background: 'var(--danger)', border: 'none', color: '#fff' }}>
                DÉCONNECTER
              </button>
            </div>
          </div>
        </div>
      )}

      <FlashMessage message={flash} />
    </div>
  )
}
