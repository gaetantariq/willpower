import { supabase, supabaseAs } from '../lib/supabase.js'

/**
 * Middleware d'authentification.
 * Vérifie le Bearer token JWT et injecte req.user, req.token, req.role.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' })
  }

  const token = authHeader.split(' ')[1]
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ error: 'Token invalide ou expiré' })
  }

  // Récupérer le rôle depuis la table profiles
  const db = supabaseAs(token)
  const { data: profile } = await db
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  req.user  = user
  req.token = token
  req.role  = profile?.role ?? 'user'
  next()
}

/**
 * Middleware RBAC — restreint l'accès aux admins uniquement.
 * À utiliser après requireAuth.
 */
export function requireAdmin(req, res, next) {
  if (req.role !== 'admin') {
    return res.status(403).json({ error: 'Accès refusé — rôle admin requis' })
  }
  next()
}
