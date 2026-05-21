import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { supabaseAs } from '../lib/supabase.js'

const router = Router()

// GET /api/habits — liste les habitudes perso de l'utilisateur
router.get('/', requireAuth, async (req, res) => {
  const db = supabaseAs(req.token)

  const { data, error } = await db
    .from('habits')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })

  res.json(data)
})

// POST /api/habits — ajoute une habitude perso
router.post('/', requireAuth, async (req, res) => {
  const { name } = req.body

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Le nom est requis' })
  }

  const db = supabaseAs(req.token)

  const { data, error } = await db
    .from('habits')
    .insert({ user_id: req.user.id, name: name.trim() })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  res.status(201).json(data)
})

// DELETE /api/habits/:id — supprime une habitude perso
router.delete('/:id', requireAuth, async (req, res) => {
  const db = supabaseAs(req.token)

  const { error } = await db
    .from('habits')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id) // sécurité : on ne peut supprimer que ses propres habitudes

  if (error) return res.status(500).json({ error: error.message })

  res.json({ success: true })
})

export default router
