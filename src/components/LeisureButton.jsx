import React from 'react'

export default function LeisureButton({ active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full rounded-2xl py-5 font-orbitron text-sm font-bold tracking-widest flex items-center justify-center gap-3 transition-all duration-200 active:scale-95"
      style={active ? {
        background: 'linear-gradient(135deg, #2d0a14, #3d0a0a)',
        border: '1px solid var(--danger)',
        color: 'var(--danger)',
      } : {
        background: 'linear-gradient(135deg, #0a1a2a, #0d2030)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
      }}
    >
      <span>{active ? '■' : '▶'}</span>
      <span>{active ? 'STOPPER LOISIR' : 'DÉMARRER LOISIR'}</span>
    </button>
  )
}
