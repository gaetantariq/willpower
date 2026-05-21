export const THEMES = {
  sport: {
    key: 'sport',
    name: 'SPORT',
    icon: '⚡',
    accent: '#00ff88',
    habits: [
      { id: 's1', name: 'Séance cardio 20 min' },
      { id: 's2', name: 'Séries de pompes' },
      { id: 's3', name: '8 000 pas marche' },
    ],
  },
  culture: {
    key: 'culture',
    name: 'CULTURE',
    icon: '◈',
    accent: '#ff6b35',
    habits: [
      { id: 'c1', name: 'Lire 30 min' },
      { id: 'c2', name: 'Apprendre 1 concept' },
      { id: 'c3', name: 'Écrire dans le journal' },
    ],
  },
  focus: {
    key: 'focus',
    name: 'FOCUS',
    icon: '◉',
    accent: '#7c3aed',
    habits: [
      { id: 'f1', name: 'Méditation 10 min' },
      { id: 'f2', name: 'Deep work 45 min' },
      { id: 'f3', name: 'Aucun écran -1h dodo' },
    ],
  },
}

export const CREDIT_BONUS       = 15   // minutes par habitude cochée
export const SOLIDITY_DRAIN     = 2    // % solidité perdue par minute sans crédit
export const MAX_CREDIT_DISPLAY = 120  // minutes max pour la barre
export const DEFAULT_GOAL       = 60   // objectif crédit quotidien par défaut (min)
