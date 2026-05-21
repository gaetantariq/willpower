import React, { useState } from 'react'
import { DEFAULT_GOAL, CREDIT_BONUS } from '../data/themes'

export default function GoalSettings({ goal, onGoalChange, customHabits, onHabitsChange, accent }) {
  const [open, setOpen]       = useState(false)
  const [newHabit, setNewHabit] = useState('')

  const addHabit = () => {
    const name = newHabit.trim()
    if (!name) return
    const id = 'custom_' + Date.now()
    onHabitsChange([...customHabits, { id, name }])
    setNewHabit('')
  }

  const removeHabit = (id) => {
    onHabitsChange(customHabits.filter(h => h.id !== id))
  }

  const goalOptions = [30, 45, 60, 90, 120]

  return (
    <div className="mb-3">
      {/* Toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl font-mono-tech text-xs tracking-widest transition-all duration-200 active:scale-95"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
      >
        <span>⚙ PERSONNALISER</span>
        <span style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
      </button>

      {open && (
        <div
          className="rounded-2xl mt-2 p-4 flex flex-col gap-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {/* ── Objectif crédit ── */}
          <div>
            <p className="font-mono-tech text-xs tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
              🎯 OBJECTIF CRÉDIT QUOTIDIEN
            </p>
            <div className="flex gap-2 flex-wrap">
              {goalOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => onGoalChange(opt)}
                  className="font-orbitron text-xs px-3 py-2 rounded-xl transition-all duration-150 active:scale-95"
                  style={goal === opt ? {
                    background: accent,
                    color: '#000',
                    border: `1px solid ${accent}`,
                    fontWeight: 700,
                  } : {
                    background: 'var(--bg)',
                    color: 'var(--muted)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {opt} min
                </button>
              ))}
            </div>
            <p className="font-mono-tech text-xs mt-2" style={{ color: 'var(--muted)' }}>
              = {Math.ceil(goal / CREDIT_BONUS)} habitude{Math.ceil(goal / CREDIT_BONUS) > 1 ? 's' : ''} à compléter
            </p>
          </div>

          {/* ── Habitudes perso ── */}
          <div>
            <p className="font-mono-tech text-xs tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
              ✏️ HABITUDES PERSONNALISÉES
            </p>

            {customHabits.length === 0 && (
              <p className="font-mono-tech text-xs mb-3" style={{ color: 'var(--muted)' }}>
                Aucune habitude perso. Ajoutez-en une !
              </p>
            )}

            {customHabits.map(h => (
              <div key={h.id} className="flex items-center gap-2 mb-2">
                <span className="font-mono-tech text-xs flex-1 truncate" style={{ color: 'var(--text)' }}>
                  {h.name}
                </span>
                <button
                  onClick={() => removeHabit(h.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
                  style={{ background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.3)', color: 'var(--danger)' }}
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Champ ajout */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newHabit}
                onChange={e => setNewHabit(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addHabit()}
                placeholder="Nouvelle habitude..."
                maxLength={40}
                className="flex-1 rounded-xl px-3 py-2 font-mono-tech text-xs outline-none"
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              />
              <button
                onClick={addHabit}
                className="w-9 h-9 rounded-xl font-bold flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
                style={{ background: accent, color: '#000', border: 'none' }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
