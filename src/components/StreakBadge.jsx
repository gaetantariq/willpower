import React from 'react'

export default function StreakBadge({ streak, completedToday, accent }) {
  const fire = streak === 0 ? '○' : '🔥'

  return (
    <div
      className="rounded-2xl p-4 mb-3 flex items-center gap-4"
      style={{
        background: 'var(--surface)',
        border: completedToday ? `1px solid ${accent}44` : '1px solid var(--border)',
      }}
    >
      <span className="text-3xl">{fire}</span>
      <div className="flex-1">
        <p className="font-mono-tech text-xs tracking-widest mb-0.5" style={{ color: 'var(--muted)' }}>
          STREAK JOURNALIER
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-orbitron text-2xl font-black" style={{ color: completedToday ? accent : 'var(--text)' }}>
            {streak}
          </span>
          <span className="font-mono-tech text-xs" style={{ color: 'var(--muted)' }}>
            {streak <= 1 ? 'JOUR' : 'JOURS'}
          </span>
        </div>
      </div>
      {completedToday && (
        <span
          className="font-mono-tech text-xs px-2 py-1 rounded-lg"
          style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}
        >
          ✓ VALIDÉ
        </span>
      )}
    </div>
  )
}
