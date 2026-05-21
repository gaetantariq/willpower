import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { supabaseAs } from '../lib/supabase.js'

const router = Router()

// GET /api/streak — récupère le streak actuel
router.get('/', requireAuth, async (req, res) => {
  const db = supabaseAs(req.token)

  // Récupère les 2 derniers logs pour calculer si le streak est toujours actif
  const { data, error } = await db
    .from('daily_logs')
    .select('date, streak')
    .eq('user_id', req.user.id)
    .order('date', { ascending: false })
    .limit(2)

  if (error) return res.status(500).json({ error: error.message })

  if (!data || data.length === 0) {
    return res.json({ streak: 0, lastDate: null })
  }

  const latest    = data[0]
  const today     = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  // Le streak est valide si le dernier log est aujourd'hui ou hier
  const isActive = latest.date === today || latest.date === yesterday

  res.json({
    streak:   isActive ? latest.streak : 0,
    lastDate: latest.date,
  })
})

export default router
