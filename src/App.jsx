import React from 'react'
import { useAuth }    from './hooks/useAuth'
import { useStorage } from './hooks/useStorage'
import { useSync }    from './hooks/useSync'
import AuthScreen     from './components/AuthScreen'
import BootScreen     from './components/BootScreen'
import Dashboard      from './components/Dashboard'

export default function App() {
  const { user, token, loading, signIn, signUp, signOut, resetPassword } = useAuth()
  const [theme, setTheme, clearTheme] = useStorage('wpos_theme', null)

  const handleCloudLoad = (data) => {
    if (data.theme)          { localStorage.setItem('wpos_theme',         JSON.stringify(data.theme)); setTheme(data.theme) }
    if (data.credit)           localStorage.setItem('wpos_credit',        JSON.stringify(data.credit))
    if (data.solidity != null) localStorage.setItem('wpos_solid',         JSON.stringify(data.solidity))
    if (data.checked)          localStorage.setItem('wpos_checked',       JSON.stringify(data.checked))
    if (data.goal)             localStorage.setItem('wpos_goal',          JSON.stringify(data.goal))
    if (data.customHabits)     localStorage.setItem('wpos_custom_habits', JSON.stringify(data.customHabits))
    if (data.streak != null)   localStorage.setItem('wpos_streak',        JSON.stringify(data.streak))
  }

  const syncState = {
    theme:        JSON.parse(localStorage.getItem('wpos_theme')         || 'null'),
    credit:       JSON.parse(localStorage.getItem('wpos_credit')        || '0'),
    solidity:     JSON.parse(localStorage.getItem('wpos_solid')         || '100'),
    checked:      JSON.parse(localStorage.getItem('wpos_checked')       || '{}'),
    goal:         JSON.parse(localStorage.getItem('wpos_goal')          || '60'),
    customHabits: JSON.parse(localStorage.getItem('wpos_custom_habits') || '[]'),
    streak:       JSON.parse(localStorage.getItem('wpos_streak')        || '0'),
  }

  useSync(user, token, syncState, handleCloudLoad)

  const handleReset = () => {
    localStorage.clear()
    clearTheme()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <span className="font-orbitron text-xs tracking-widest" style={{ color: 'var(--muted)' }}>
          INITIALISATION...
        </span>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen" style={{ background: 'var(--bg)' }}>
      {!user
        ? <AuthScreen onSignIn={signIn} onSignUp={signUp} onResetPassword={resetPassword} />
        : !theme
          ? <BootScreen onSelectTheme={setTheme} onSignOut={signOut} />
          : <Dashboard themeKey={theme} onReset={handleReset} onSignOut={signOut} />
      }
    </div>
  )
}
