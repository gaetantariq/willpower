import React, { useState, useEffect } from 'react'

const DAYS_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })
}

export default function History({ accent }) {
  const [logs, setLogs] = useState({})

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('wpos_history') || '{}')
    const today  = new Date().toISOString().slice(0, 10)

    // Ajoute le jour courant dans les logs pour l'affichage
    const credit   = JSON.parse(localStorage.getItem('wpos_credit') || '0')
    const goal     = JSON.parse(localStorage.getItem('wpos_goal')   || '60')
    const solidity = JSON.parse(localStorage.getItem('wpos_solid')  || '100')
    const checked  = JSON.parse(localStorage.getItem('wpos_checked')|| '{}')

    setLogs({
      ...stored,
      [today]: { credit, goal, solidity, checkedCount: Object.keys(checked).length }
    })
  }, [])

  const days = getLast7Days()

  return (
    <div className="flex flex-col gap-3">
      {/* Barres 7 jours */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="font-mono-tech text-xs tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
          ◈ CRÉDIT — 7 DERNIERS JOURS
        </p>
        <div className="flex justify-between gap-2">
          {days.map((date, i) => {
            const log     = logs[date]
            const pct     = log ? Math.min(100, (log.credit / (log.goal || 60)) * 100) : 0
            const isToday = i === 6
            const label   = DAYS_SHORT[new Date(date + 'T12:00:00').getDay()]

            return (
              <div key={date} className="flex flex-col items-center gap-1 flex-1">
                <span className="font-mono-tech" style={{ fontSize: 9, color: pct >= 100 ? accent : 'var(--muted)' }}>
                  {log ? `${Math.round(pct)}%` : '—'}
                </span>
                <div className="w-full rounded-lg overflow-hidden flex flex-col justify-end"
                  style={{ height: 64, background: 'rgba(255,255,255,0.05)' }}>
                  <div className="w-full rounded-lg transition-all duration-500"
                    style={{
                      height: `${Math.max(pct > 0 ? 4 : 0, pct)}%`,
                      background: pct >= 100 ? accent : pct > 0 ? `${accent}55` : 'transparent',
                    }} />
                </div>
                <span className="font-mono-tech" style={{
                  fontSize: 9,
                  color: isToday ? accent : 'var(--muted)',
                  fontWeight: isToday ? 700 : 400,
                }}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats résumé */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="font-mono-tech text-xs tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
          ◉ RÉSUMÉ DE LA SEMAINE
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: 'Jours actifs',
              value: days.filter(d => logs[d]?.credit > 0).length,
              unit: '/ 7',
            },
            {
              label: 'Objectifs atteints',
              value: days.filter(d => logs[d] && logs[d].credit >= logs[d].goal).length,
              unit: '/ 7',
            },
            {
              label: 'Habitudes totales',
              value: days.reduce((acc, d) => acc + (logs[d]?.checkedCount || 0), 0),
              unit: 'faites',
            },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl p-3 text-center"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="font-orbitron text-2xl font-black" style={{ color: accent }}>
                {stat.value}
              </div>
              <div className="font-mono-tech leading-tight mt-1" style={{ fontSize: 9, color: 'var(--muted)' }}>
                {stat.unit}
              </div>
              <div className="font-mono-tech leading-tight mt-0.5" style={{ fontSize: 9, color: 'var(--muted)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
