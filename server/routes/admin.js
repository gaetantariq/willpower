import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { supabaseAs } from '../lib/supabase.js'

const router = Router()

/**
 * Toutes les routes admin sont protégées par requireAuth + requireAdmin.
 * Matrice RBAC :
 * - GET  /api/admin/users     → liste tous les utilisateurs (admin)
 * - PUT  /api/admin/users/:id/role → change le rôle d'un user (admin)
 */

// GET /api/admin/users — liste tous les profils
router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  const db = supabaseAs(req.token)

  const { data, error } = await db
    .from('profiles')
    .select('user_id, role, theme, goal_minutes, created_at')
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
})

// PUT /api/admin/users/:id/role — change le rôle d'un utilisateur
router.put('/users/:id/role', requireAuth, requireAdmin, async (req, res) => {
  const { role } = req.body

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Rôle invalide. Valeurs acceptées : user, admin' })
  }

  const db = supabaseAs(req.token)

  const { data, error } = await db
    .from('profiles')
    .update({ role })
    .eq('user_id', req.params.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
})

export default router
