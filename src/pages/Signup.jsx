import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup({ setAuth }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSignup() {
    if (!name || !email || !password) return setError('Please fill all fields')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    try {
      const res = await fetch('https://spendwise-server-2wl0.onrender.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (data.error) return setError(data.error)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setAuth(data.user)
      navigate('/dashboard')
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.root}>
      <div style={s.card}>
        <div style={s.logo}>SpendWise</div>
        <h2 style={s.title}>Create an account</h2>
        <p style={s.sub}>Start tracking your expenses today</p>
        {error && <div style={s.error}>{error}</div>}
        <div style={s.formGroup}>
          <label style={s.label}>Full Name</label>
          <input style={s.input} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={s.formGroup}>
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={s.formGroup}>
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSignup()} />
        </div>
        <button style={s.btn} onClick={handleSignup} disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
        <p style={s.footer}>Already have an account? <Link to="/login" style={s.link}>Sign in</Link></p>
      </div>
    </div>
  )
}

const s = {
  root: { minHeight: '100vh', background: '#f8f8f7', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { background: '#fff', border: '1px solid #ebebeb', borderRadius: '14px', padding: '2.5rem', width: '100%', maxWidth: '400px' },
  logo: { fontSize: '1rem', fontWeight: 700, color: '#18181b', marginBottom: '1.5rem' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: '#18181b', letterSpacing: '-0.4px', marginBottom: '0.3rem' },
  sub: { fontSize: '0.83rem', color: '#a1a1aa', marginBottom: '1.5rem' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.7rem 1rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem' },
  formGroup: { marginBottom: '1rem' },
  label: { fontSize: '0.75rem', fontWeight: 500, color: '#52525b', display: 'block', marginBottom: '5px' },
  input: { width: '100%', background: '#fafafa', border: '1px solid #e4e4e7', color: '#18181b', fontSize: '0.88rem', padding: '0.65rem 0.9rem', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', background: '#18181b', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '8px', fontSize: '0.88rem', cursor: 'pointer', fontWeight: 500, marginTop: '0.5rem' },
  footer: { fontSize: '0.82rem', color: '#a1a1aa', textAlign: 'center', marginTop: '1.2rem' },
  link: { color: '#18181b', fontWeight: 500 },
}