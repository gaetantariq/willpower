import React from 'react'
import { CREDIT_BONUS } from '../data/themes'

export default function HabitItem({ habit, done, accent, onToggle }) {
  return (
    <button
      onClick={() => onToggle(habit.id, done)}
      className="flex items-center gap-4 px-4 py-4 rounded-2xl mb-3 text-left w-full relative overflow-hidden transition-all duration-200 active:scale-95"
      style={{
        background: done ? 'rgba(0,255,136,0.04)' : 'var(--surface)',
        border: done ? `1px solid rgba(0,255,136,0.2)` : '1px solid var(--border)',
      }}
    >
      {done && (
        <span className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: accent }} />
      )}
      <span
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all duration-200"
        style={done
          ? { background: accent, border: `2px solid ${accent}`, color: '#000', boxShadow: `0 0 10px ${accent}66` }
          : { border: '2px solid var(--border)' }
        }
      >
        {done ? '✓' : ''}
      </span>
      <span
        className="font-mono-tech text-sm flex-1 text-left"
        style={{ color: done ? 'var(--muted)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}
      >
        {habit.name}
      </span>
      <span className="font-orbitron text-xs" style={{ color: accent, opacity: done ? 1 : 0.5 }}>
        {done ? `-${CREDIT_BONUS}` : `+${CREDIT_BONUS}`}
      </span>
    </button>
  )
}
