import { useState } from 'react'

export default function Settings({ user, setUser }) {
  const [name, setName] = useState(user?.name || '')
  const [currency, setCurrency] = useState(user?.currency || '₹')
  const [theme, setTheme] = useState(user?.theme || 'light')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')

  async function saveSettings() {
    setLoading(true)
    setSuccess('')
    setError('')
    try {
      const res = await fetch('http://localhost:5000/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, currency, theme })
      })
      const data = await res.json()
      if (data.error) return setError(data.error)
      const updated = { ...user, name: data.name, currency: data.currency, theme: data.theme }
      setUser(updated)
      localStorage.setItem('user', JSON.stringify(updated))
      setSuccess('Settings saved successfully!')
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <div style={s.content}>
      <div style={s.grid}>

        {/* PROFILE SETTINGS */}
        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardTitle}>Profile</div>
            <div style={s.cardMeta}>Update your personal info</div>
          </div>
          <div style={s.cardBody}>
            {success && <div style={s.success}>{success}</div>}
            {error && <div style={s.error}>{error}</div>}
            <div style={s.formGroup}>
              <label style={s.label}>Full Name</label>
              <input style={s.input} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Email</label>
              <input style={{ ...s.input, ...s.disabled }} value={user?.email || ''} disabled />
              <div style={s.hint}>Email cannot be changed</div>
            </div>
          </div>
        </div>

        {/* PREFERENCES */}
        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardTitle}>Preferences</div>
            <div style={s.cardMeta}>Customise your experience</div>
          </div>
          <div style={s.cardBody}>
            <div style={s.formGroup}>
              <label style={s.label}>Currency Symbol</label>
              <select style={s.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                <option value="₹">₹ — Indian Rupee</option>
                <option value="$">$ — US Dollar</option>
                <option value="€">€ — Euro</option>
                <option value="£">£ — British Pound</option>
                <option value="¥">¥ — Japanese Yen</option>
              </select>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Theme</label>
              <select style={s.select} value={theme} onChange={e => setTheme(e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark (coming soon)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ACCOUNT */}
        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardTitle}>Account</div>
            <div style={s.cardMeta}>Manage your account</div>
          </div>
          <div style={s.cardBody}>
            <div style={s.accountRow}>
              <div>
                <div style={s.accountLabel}>Signed in as</div>
                <div style={s.accountValue}>{user?.email}</div>
              </div>
            </div>
            <div style={s.divider} />
            <div style={s.accountRow}>
              <div>
                <div style={s.accountLabel}>Account type</div>
                <div style={s.accountValue}>Personal</div>
              </div>
            </div>
            <div style={s.divider} />
            <button style={s.logoutBtn} onClick={logout}>Sign out</button>
          </div>
        </div>

      </div>

      {/* SAVE BUTTON */}
      <div style={s.saveRow}>
        <button style={s.saveBtn} onClick={saveSettings} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

const s = {
  content: { padding: '1.8rem 2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' },
  card: { background: '#fff', border: '1px solid #ebebeb', borderRadius: '10px' },
  cardHead: { padding: '1rem 1.3rem', borderBottom: '1px solid #f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: '0.82rem', fontWeight: 600, color: '#18181b' },
  cardMeta: { fontSize: '0.72rem', color: '#a1a1aa' },
  cardBody: { padding: '1.2rem 1.3rem' },
  formGroup: { marginBottom: '1rem' },
  label: { fontSize: '0.75rem', fontWeight: 500, color: '#52525b', display: 'block', marginBottom: '5px' },
  input: { width: '100%', background: '#fafafa', border: '1px solid #e4e4e7', color: '#18181b', fontSize: '0.88rem', padding: '0.65rem 0.9rem', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' },
  disabled: { color: '#a1a1aa', cursor: 'not-allowed' },
  hint: { fontSize: '0.72rem', color: '#a1a1aa', marginTop: '4px' },
  select: { width: '100%', background: '#fafafa', border: '1px solid #e4e4e7', color: '#18181b', fontSize: '0.88rem', padding: '0.65rem 0.9rem', borderRadius: '8px', outline: 'none' },
  success: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '0.7rem 1rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.7rem 1rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem' },
  accountRow: { padding: '0.7rem 0' },
  accountLabel: { fontSize: '0.72rem', color: '#a1a1aa', marginBottom: '3px' },
  accountValue: { fontSize: '0.85rem', fontWeight: 500, color: '#18181b' },
  divider: { height: '1px', background: '#fafafa', margin: '0.2rem 0' },
  logoutBtn: { width: '100%', background: '#fff', color: '#dc2626', border: '1px solid #fecaca', padding: '0.65rem', borderRadius: '8px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 500, marginTop: '0.5rem' },
  saveRow: { display: 'flex', justifyContent: 'flex-end' },
  saveBtn: { background: '#18181b', color: '#fff', border: 'none', padding: '0.7rem 2rem', borderRadius: '8px', fontSize: '0.88rem', cursor: 'pointer', fontWeight: 500 },
}