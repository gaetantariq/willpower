import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { supabaseAs } from '../lib/supabase.js'

const router = Router()

// GET /api/profile — récupère le profil de l'utilisateur connecté
router.get('/', requireAuth, async (req, res) => {
  const db = supabaseAs(req.token)

  const { data, error } = await db
    .from('profiles')
    .select('*')
    .eq('user_id', req.user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    return res.status(500).json({ error: error.message })
  }

  res.json(data ?? { theme: null, goal_minutes: 60 })
})

// PUT /api/profile — met à jour thème et objectif
router.put('/', requireAuth, async (req, res) => {
  const { theme, goal_minutes } = req.body
  const db = supabaseAs(req.token)

  const { data, error } = await db
    .from('profiles')
    .upsert({ user_id: req.user.id, theme, goal_minutes }, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
})

export default router
