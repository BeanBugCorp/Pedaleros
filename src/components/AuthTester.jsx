import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

// Throwaway component for exercising the auth flow during development.
// Remove it once you build the real sign-in UI.
export function AuthTester() {
  const { user, loading, signInWithPassword, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  if (loading) return <p>Loading session…</p>

  const run = (fn) => async () => {
    setMessage('Working…')
    const { error } = await fn(email, password)
    setMessage(error ? `Error: ${error.message}` : 'Success')
  }

  if (user) {
    return (
      <div className="auth-tester">
        <p>Signed in as {user.email}</p>
        <button type="button" onClick={signOut}>
          Sign out
        </button>
        {message && <p>{message}</p>}
      </div>
    )
  }

  return (
    <div className="auth-tester">
      <h2>Auth tester</h2>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <button type="button" onClick={run(signInWithPassword)}>
          Sign in
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  )
}
