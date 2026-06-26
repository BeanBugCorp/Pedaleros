import { useState } from 'react'
import { tournament } from '../../data/content'
import { useAuth } from '../../hooks/useAuth'
import MarqueeTitle from '../../components/guest/MarqueeTitle'
import { ImportData } from '../../components/admin/ImportData/ImportData'
import './AdminPage.css'

function AdminFooter() {
  return (
    <footer className="admin-footer">
      <p className="admin-footer-copy">
        © {tournament.year} Calcuta Floü · Pedaleros
      </p>
      <div className="admin-footer-brand">
        <a
          className="admin-footer-link"
          href="https://instagram.com/beanbug.corp"
          target="_blank"
          rel="noreferrer"
        >
          <svg
            className="admin-footer-ig-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
          </svg>
          beanbug.corp
        </a>
        <img
          className="admin-footer-logo"
          src="/beanbug-logo.png"
          alt="BeanBug Corp"
        />
        <a
          className="admin-footer-link"
          href="https://beanbugcorp.com"
          target="_blank"
          rel="noreferrer"
        >
          beanbugcorp.com
        </a>
      </div>
    </footer>
  )
}

export default function AdminPage() {
  const { user, loading, signInWithPassword, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [working, setWorking] = useState(false)

  if (loading) {
    return <div className="admin-loading">Cargando…</div>
  }

  if (user) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <span className="admin-user-email">{user.email}</span>
          <button className="admin-signout-btn" type="button" onClick={signOut}>
            Cerrar sesión
          </button>
        </div>
        <ImportData />
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setWorking(true)
    const { error: authError } = await signInWithPassword(email, password)
    if (authError) setError(authError.message)
    setWorking(false)
  }

  return (
    <div className="admin-layout">
      <div className="admin-page">
        <header className="admin-header">
          <div className="admin-header-marquee">
            <MarqueeTitle text="Torneo 2do|Aniversario" variant="duo" />
          </div>
          <div className="admin-header-meta">
            <span>{tournament.club}</span>
            <span className="admin-dates">{tournament.dates}</span>
          </div>
        </header>

        <main className="admin-main">
          <form className="admin-login-card" onSubmit={handleSubmit}>
            <h1 className="admin-login-title">Acceso Administrador</h1>
            <input
              className="admin-input"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              className="admin-input"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error && <p className="admin-error">{error}</p>}
            <button
              className="admin-submit-btn"
              type="submit"
              disabled={working}
            >
              {working ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </main>
      </div>

      <AdminFooter />
    </div>
  )
}
