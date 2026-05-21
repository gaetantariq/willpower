const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Wrapper fetch qui ajoute automatiquement le token JWT dans les headers.
 */
async function apiFetch(path, token, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur réseau' }))
    throw new Error(err.error || 'Erreur API')
  }

  return res.json()
}

// ── PROFILE ──
export const getProfile      = (token)        => apiFetch('/api/profile', token)
export const updateProfile   = (token, body)  => apiFetch('/api/profile', token, { method: 'PUT', body: JSON.stringify(body) })

// ── HABITS ──
export const getHabits       = (token)        => apiFetch('/api/habits', token)
export const createHabit     = (token, name)  => apiFetch('/api/habits', token, { method: 'POST', body: JSON.stringify({ name }) })
export const deleteHabit     = (token, id)    => apiFetch(`/api/habits/${id}`, token, { method: 'DELETE' })

// ── LOGS ──
export const getTodayLog     = (token)        => apiFetch('/api/logs/today', token)
export const updateTodayLog  = (token, body)  => apiFetch('/api/logs/today', token, { method: 'PUT', body: JSON.stringify(body) })

// ── STREAK ──
export const getStreak       = (token)        => apiFetch('/api/streak', token)
