import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Gates a route behind the shared admin session. Unauthenticated visitors
// are sent to /admin to sign in, then bounced back to where they started.
export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <p>Cargando…</p>

  if (!user) {
    return <Navigate to="/admin" state={{ from: location }} replace />
  }

  return children
}
