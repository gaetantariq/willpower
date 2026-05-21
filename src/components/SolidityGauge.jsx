import React from 'react'

function gaugeColor(solidity) {
  if (solidity > 60) return '#00ff88'
  if (solidity > 30) return '#ffd60a'
  return '#ff2d55'
}

export default function SolidityGauge({ solidity }) {
  const color = gaugeColor(solidity)
  return (
    <div className="rounded-2xl p-5 mb-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <p className="font-mono-tech text-xs tracking-widest mb-3" style={{ color: 'var(--muted)' }}>◈ SOLIDITÉ MENTALE</p>
      <div className="rounded h-2 overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
        <div
          className="h-full rounded relative gauge-fill transition-all duration-500"
          style={{ width: `${solidity}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-orbitron text-4xl font-black leading-none transition-colors duration-500" style={{ color }}>
          {Math.round(solidity)}
        </span>
        <span className="font-mono-tech text-xs" style={{ color: 'var(--muted)' }}>/ 100</span>
      </div>
      {solidity < 30 && (
        <p className="font-mono-tech text-xs mt-2 animate-blink" style={{ color: 'var(--danger)' }}>
          ⚠ ALERTE — RÉSISTANCE CRITIQUE
        </p>
      )}
    </div>
  )
}
