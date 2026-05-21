import React from 'react'

export default function CreditCounter({ credit, accent, goal, goalPct }) {
  return (
    <div className="rounded-2xl p-5 mb-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="flex justify-between items-center mb-3">
        <p className="font-mono-tech text-xs tracking-widest" style={{ color: 'var(--muted)' }}>◉ CRÉDIT TEMPS</p>
        <p className="font-mono-tech text-xs" style={{ color: 'var(--muted)' }}>
          objectif : <span style={{ color: accent }}>{goal} min</span>
        </p>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-orbitron text-5xl font-black leading-none" style={{ color: accent }}>{credit}</span>
        <span className="font-mono-tech text-xs" style={{ color: 'var(--muted)' }}>/ {goal} MIN</span>
      </div>
      {/* Barre objectif */}
      <div className="h-2 rounded-full mt-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${goalPct}%`,
            background: goalPct >= 100
              ? `linear-gradient(90deg, ${accent}88, ${accent})`
              : `linear-gradient(90deg, ${accent}55, ${accent}99)`,
          }}
        />
      </div>
      {goalPct >= 100 && (
        <p className="font-mono-tech text-xs mt-2" style={{ color: accent }}>✓ OBJECTIF ATTEINT</p>
      )}
    </div>
  )
}
