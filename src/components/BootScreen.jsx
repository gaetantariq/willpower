import React from 'react'
import { THEMES } from '../data/themes'

export default function BootScreen({ onSelectTheme }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(0,255,136,0.06) 0%, transparent 70%), var(--bg)' }}
    >
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <h1
          className="font-orbitron text-4xl font-black text-white tracking-widest text-center"
          style={{ textShadow: '0 0 20px #00ff88, 0 0 40px rgba(0,255,136,0.3)' }}
        >
          WILLPOWER
        </h1>
        <p className="font-mono-tech text-xs tracking-widest mt-1 mb-12 text-center" style={{ color: 'var(--muted)' }}>
          OS v1.0 — INITIALISATION
        </p>

        <p className="font-mono-tech text-xs tracking-widest mb-5 text-center" style={{ color: 'var(--muted)' }}>
          [ CHOISIR UN PROTOCOLE ]
        </p>

        <div className="flex flex-col gap-3 w-full">
          {Object.values(THEMES).map(theme => (
            <ThemeCard key={theme.key} theme={theme} onSelect={() => onSelectTheme(theme.key)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ThemeCard({ theme, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-4 p-5 rounded-2xl text-left w-full relative overflow-hidden transition-all duration-200 active:scale-95"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <span className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: theme.accent }} />
      <span className="text-3xl w-10 text-center">{theme.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-orbitron text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>{theme.name}</div>
        <div className="font-mono-tech text-xs leading-relaxed" style={{ color: 'var(--muted)', whiteSpace: 'pre-line' }}>
          {theme.habits.map(h => `• ${h.name}`).join('\n')}
        </div>
      </div>
      <span className="text-xl" style={{ color: 'var(--muted)' }}>›</span>
    </button>
  )
}
