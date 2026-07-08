import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Gates content behind the shared admin session. By default, unauthenticated
// visitors are redirected to /admin to sign in, then bounced back to where
// they started. Pass `fallback` to render something in place instead (e.g.
// the login form itself, when this *is* the admin page).
export function RequireAuth({ children, fallback, loadingFallback = <p>Cargando…</p> }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return loadingFallback

  if (!user) {
    return fallback ?? <Navigate to="/admin" state={{ from: location }} replace />
  }

  return children
}
