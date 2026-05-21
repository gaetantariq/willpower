import React, { useState } from 'react'

export default function AuthScreen({ onSignIn, onSignUp, onResetPassword }) {
  const [mode,     setMode]     = useState('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [success,  setSuccess]  = useState(null)

  const handleSubmit = async () => {
    setError(null); setSuccess(null)
    if (!email.trim() || (mode !== 'reset' && !password.trim())) {
      setError('Champs requis manquants.'); return
    }
    if (mode === 'register' && password !== confirm) {
      setError('Les mots de passe ne correspondent pas.'); return
    }
    if (mode !== 'reset' && password.length < 6) {
      setError('Mot de passe trop court (6 caractères min).'); return
    }
    setLoading(true)
    try {
      if (mode === 'login') {
        await onSignIn(email.trim(), password)
      } else if (mode === 'register') {
        await onSignUp(email.trim(), password)
        setSuccess('Compte créé ! Tu peux maintenant te connecter.')
        setMode('login'); setPassword(''); setConfirm('')
      } else if (mode === 'reset') {
        await onResetPassword(email.trim())
        setSuccess('Email envoyé ! Vérifie ta boite mail.')
        setMode('login')
      }
    } catch (e) {
      setError(e.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }

  const tabs = [
    { key: 'login',    label: 'CONNEXION' },
    { key: 'register', label: 'INSCRIPTION' },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(0,255,136,0.05) 0%, transparent 70%), var(--bg)' }}>
      <div className="w-full max-w-sm">
        <h1 className="font-orbitron text-3xl font-black text-white tracking-widest text-center mb-1"
          style={{ textShadow: '0 0 20px #00ff88, 0 0 40px rgba(0,255,136,0.3)' }}>
          WILLPOWER
        </h1>
        <p className="font-mono-tech text-xs tracking-widest text-center mb-10" style={{ color: 'var(--muted)' }}>
          OS v1.0 — {mode === 'reset' ? 'MOT DE PASSE OUBLIÉ' : mode === 'login' ? 'CONNEXION' : 'INSCRIPTION'}
        </p>

        {/* Tabs */}
        {mode !== 'reset' && (
          <div className="flex rounded-xl overflow-hidden mb-6" style={{ border: '1px solid var(--border)' }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => { setMode(t.key); setError(null); setSuccess(null) }}
                className="flex-1 py-3 font-orbitron text-xs tracking-widest transition-all duration-200"
                style={mode === t.key
                  ? { background: '#00ff88', color: '#000', fontWeight: 700 }
                  : { background: 'var(--surface)', color: 'var(--muted)' }}>
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Formulaire */}
        <div className="flex flex-col gap-3">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="ton@email.com"
            className="w-full rounded-xl px-4 py-4 font-mono-tech text-sm outline-none" style={inputStyle} />

          {mode !== 'reset' && (
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Mot de passe (6 min)"
              className="w-full rounded-xl px-4 py-4 font-mono-tech text-sm outline-none" style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && mode === 'login' && handleSubmit()} />
          )}

          {mode === 'register' && (
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Confirmer le mot de passe"
              className="w-full rounded-xl px-4 py-4 font-mono-tech text-sm outline-none" style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          )}
        </div>

        {error   && <p className="font-mono-tech text-xs mt-3 text-center" style={{ color: 'var(--danger)' }}>⚠ {error}</p>}
        {success && <p className="font-mono-tech text-xs mt-3 text-center" style={{ color: '#00ff88' }}>✓ {success}</p>}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full rounded-xl py-4 font-orbitron text-sm font-bold tracking-widest mt-4 transition-all duration-200 active:scale-95"
          style={{ background: loading ? 'var(--surface)' : '#00ff88', color: '#000', border: 'none', opacity: loading ? 0.6 : 1 }}>
          {loading ? 'CHARGEMENT...' : mode === 'login' ? 'SE CONNECTER ▶' : mode === 'register' ? 'CRÉER MON COMPTE ▶' : 'ENVOYER LE LIEN ▶'}
        </button>

        {/* Mot de passe oublié */}
        {mode === 'login' && (
          <button onClick={() => { setMode('reset'); setError(null); setSuccess(null) }}
            className="w-full font-mono-tech text-xs mt-3 text-center transition-all"
            style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            Mot de passe oublié ?
          </button>
        )}
        {mode === 'reset' && (
          <button onClick={() => { setMode('login'); setError(null) }}
            className="w-full font-mono-tech text-xs mt-3 text-center"
            style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Retour à la connexion
          </button>
        )}
      </div>
    </div>
  )
}
