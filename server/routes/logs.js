import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { supabaseAs } from '../lib/supabase.js'

const router = Router()

const todayKey = () => new Date().toISOString().slice(0, 10)

// GET /api/logs/today — récupère le log du jour
router.get('/today', requireAuth, async (req, res) => {
  const db = supabaseAs(req.token)

  const { data, error } = await db
    .from('daily_logs')
    .select('*')
    .eq('user_id', req.user.id)
    .eq('date', todayKey())
    .single()

  if (error && error.code !== 'PGRST116') {
    return res.status(500).json({ error: error.message })
  }

  // Si pas de log aujourd'hui, on renvoie les valeurs par défaut
  res.json(data ?? {
    credit:          0,
    solidity:        100,
    checked_habits:  [],
    streak:          0,
    date:            todayKey(),
  })
})

// PUT /api/logs/today — sauvegarde le log du jour
router.put('/today', requireAuth, async (req, res) => {
  const { credit, solidity, checked_habits, streak } = req.body
  const db = supabaseAs(req.token)

  const { data, error } = await db
    .from('daily_logs')
    .upsert({
      user_id:        req.user.id,
      date:           todayKey(),
      credit:         credit         ?? 0,
      solidity:       solidity       ?? 100,
      checked_habits: checked_habits ?? [],
      streak:         streak         ?? 0,
    }, { onConflict: 'user_id,date' })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
})

export default router
