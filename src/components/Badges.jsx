import React from 'react'

const BADGES = [
  { id: 'first',    icon: '⚡', label: 'Premier jour',    condition: (streak) => streak >= 1  },
  { id: 'three',    icon: '🔥', label: '3 jours streak',  condition: (streak) => streak >= 3  },
  { id: 'week',     icon: '🏆', label: '7 jours streak',  condition: (streak) => streak >= 7  },
  { id: 'warrior',  icon: '⚔️', label: '30 jours streak', condition: (streak) => streak >= 30 },
  { id: 'solid',    icon: '🛡️', label: 'Solidité max',    condition: (_, solid) => solid >= 100 },
  { id: 'credited', icon: '💎', label: '120 min crédit',  condition: (_, __, credit) => credit >= 120 },
]

export default function Badges({ streak, solidity, credit, accent }) {
  return (
    <div className="rounded-2xl p-5 mb-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <p className="font-mono-tech text-xs tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
        ◈ BADGES
      </p>
      <div className="grid grid-cols-3 gap-3">
        {BADGES.map(badge => {
          const unlocked = badge.condition(streak, solidity, credit)
          return (
            <div key={badge.id}
              className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300"
              style={{
                background: unlocked ? `${accent}15` : 'rgba(255,255,255,0.03)',
                border: unlocked ? `1px solid ${accent}44` : '1px solid var(--border)',
                opacity: unlocked ? 1 : 0.4,
              }}>
              <span style={{ fontSize: 24, filter: unlocked ? 'none' : 'grayscale(100%)' }}>
                {badge.icon}
              </span>
              <span className="font-mono-tech text-center leading-tight"
                style={{ fontSize: 9, color: unlocked ? accent : 'var(--muted)' }}>
                {badge.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
