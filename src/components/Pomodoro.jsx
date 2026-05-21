import React, { useState, useEffect, useRef } from 'react'

const MODES = {
  work:        { label: 'FOCUS',        duration: 25 * 60, color: '#7c3aed' },
  short_break: { label: 'PAUSE',        duration: 5  * 60, color: '#00ff88' },
  long_break:  { label: 'GRANDE PAUSE', duration: 15 * 60, color: '#ff6b35' },
}

export default function Pomodoro({ accent, habits = [], checkedHabits = {}, onHabitComplete }) {
  const [mode,        setMode]        = useState('work')
  const [timeLeft,    setTimeLeft]    = useState(MODES.work.duration)
  const [running,     setRunning]     = useState(false)
  const [cycles,      setCycles]      = useState(0)
  const [linkedHabit, setLinkedHabit] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current)
            setRunning(false)

            // Si une habitude est liée et qu'on finit un focus → la cocher automatiquement
            if (mode === 'work' && linkedHabit && !checkedHabits[linkedHabit]) {
              onHabitComplete?.(linkedHabit)
            }

            // Auto switch
            if (mode === 'work') {
              const newCycles = cycles + 1
              setCycles(newCycles)
              const next = newCycles % 4 === 0 ? 'long_break' : 'short_break'
              setMode(next)
              setTimeLeft(MODES[next].duration)
            } else {
              setMode('work')
              setTimeLeft(MODES.work.duration)
            }
            return 0
          }
          return t - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [running, mode, cycles, linkedHabit, checkedHabits])

  const switchMode = (m) => {
    setRunning(false)
    setMode(m)
    setTimeLeft(MODES[m].duration)
  }

  const mins  = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs  = String(timeLeft % 60).padStart(2, '0')
  const pct   = ((MODES[mode].duration - timeLeft) / MODES[mode].duration) * 100
  const color = MODES[mode].color

  // Habitudes non encore cochées
  const unchecked = habits.filter(h => !checkedHabits[h.id])

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="font-mono-tech text-xs tracking-widest mb-3" style={{ color: 'var(--muted)' }}>◉ POMODORO</p>

        {/* Mode tabs */}
        <div className="flex gap-2 mb-4">
          {Object.entries(MODES).map(([key, m]) => (
            <button key={key} onClick={() => switchMode(key)}
              className="flex-1 py-1.5 rounded-lg font-mono-tech transition-all active:scale-95"
              style={{
                fontSize: 9,
                background: mode === key ? color : 'var(--bg)',
                color: mode === key ? '#000' : 'var(--muted)',
                border: `1px solid ${mode === key ? color : 'var(--border)'}`,
                fontWeight: mode === key ? 700 : 400,
              }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Timer */}
        <div className="text-center mb-4">
          <div className="font-orbitron text-6xl font-black leading-none" style={{ color }}>
            {mins}:{secs}
          </div>
          <div className="h-2 rounded-full mt-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: color }} />
          </div>
        </div>

        {/* Contrôles */}
        <div className="flex gap-3">
          <button onClick={() => setRunning(r => !r)}
            className="flex-1 py-3 rounded-xl font-orbitron text-xs font-bold tracking-widest transition-all active:scale-95"
            style={{ background: color, color: '#000', border: 'none' }}>
            {running ? '⏸ PAUSE' : '▶ DÉMARRER'}
          </button>
          <button onClick={() => { setRunning(false); setTimeLeft(MODES[mode].duration) }}
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-95"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
            ⟳
          </button>
        </div>

        <p className="font-mono-tech text-xs text-center mt-3" style={{ color: 'var(--muted)' }}>
          Cycles complétés : <span style={{ color: accent }}>{cycles}</span>
        </p>
      </div>

      {/* Lier une habitude */}
      {unchecked.length > 0 && (
        <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p className="font-mono-tech text-xs tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
            ▸ LIER UNE HABITUDE AU FOCUS
          </p>
          <p className="font-mono-tech text-xs mb-3" style={{ color: 'var(--muted)' }}>
            L'habitude sera cochée automatiquement quand le focus se termine.
          </p>
          {unchecked.map(h => (
            <button key={h.id} onClick={() => setLinkedHabit(linkedHabit === h.id ? null : h.id)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl mb-2 transition-all active:scale-95"
              style={{
                background: linkedHabit === h.id ? `${accent}15` : 'var(--bg)',
                border: linkedHabit === h.id ? `1px solid ${accent}44` : '1px solid var(--border)',
              }}>
              <span style={{
                width: 18, height: 18, borderRadius: 6, flexShrink: 0,
                background: linkedHabit === h.id ? accent : 'transparent',
                border: `2px solid ${linkedHabit === h.id ? accent : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, color: '#000',
              }}>
                {linkedHabit === h.id ? '✓' : ''}
              </span>
              <span className="font-mono-tech text-sm" style={{ color: 'var(--text)' }}>{h.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
