import { useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const [tab, setTab]       = useState('login')
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [name, setName]     = useState('')
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const body = new URLSearchParams({ username: email, password: pass })
      const res = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.detail || 'Login failed'); setLoading(false); return }
      Cookies.set('token', data.access_token, { expires: 1/48 })
      Cookies.set('user_email', email, { expires: 1/48 })
      router.push('/dashboard')
    } catch {
      setError('Cannot reach backend — is it running on port 8000?')
    }
    setLoading(false)
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, full_name: name }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.detail || 'Registration failed'); setLoading(false); return }
      setSuccess('Account created! Switching to login…')
      setTimeout(() => { setTab('login'); setSuccess(''); setError('') }, 1800)
    } catch {
      setError('Cannot reach backend — is it running on port 8000?')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fb', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>◈ NeuralGate</div>
        <div style={{ color: '#6b7280', fontSize: 13, marginBottom: '1.5rem' }}>AI Platform — Enterprise login</div>

        {/* Tabs */}
        <div style={{ display: 'flex', border: '1px solid #e2e6ea', borderRadius: 8, overflow: 'hidden', marginBottom: '1.5rem' }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); setSuccess('') }}
              style={{ flex: 1, borderRadius: 0, background: tab === t ? '#f3f4f6' : 'transparent', color: tab === t ? '#111' : '#6b7280', fontWeight: tab === t ? 500 : 400, padding: '8px 0' }}>
              {t === 'login' ? 'Sign in' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={tab === 'login' ? handleLogin : handleRegister}>
          {tab === 'register' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Full name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Ada Lovelace" required />
            </div>
          )}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Password</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" required minLength={8} />
          </div>

          {tab === 'register' && (
            <div style={{ fontSize: 12, color: '#6b7280', background: '#f3f4f6', borderRadius: 8, padding: '8px 10px', marginBottom: '1rem' }}>
              🔒 Hashed with Argon2 via <code>pwdlib</code> before saving to MongoDB
            </div>
          )}

          {error   && <div style={{ color: '#ef4444', fontSize: 13, marginBottom: '0.75rem' }}>{error}</div>}
          {success && <div style={{ color: '#10b981', fontSize: 13, marginBottom: '0.75rem' }}>{success}</div>}

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: 14 }} disabled={loading}>
            {loading ? '…' : tab === 'login' ? 'Sign in via /token' : 'Create account via /register'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: 12, color: '#9ca3af' }}>← Back to landing</Link>
        </div>
      </div>
    </div>
  )
}
