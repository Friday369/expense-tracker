import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import History from './pages/History'
import Settings from './pages/Settings'

function Layout({ user, setUser, children, page }) {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  return (
    <div style={s.root}>
      <div style={s.sidebar}>
        <div style={s.sidebarLogo}>
          <div style={s.logoIcon}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="#fff">
              <path d="M1 2h6v6H1V2zm0 7h6v6H1V9zm7-7h6v6H8V2zm0 7h6v6H8V9z"/>
            </svg>
          </div>
          <div style={s.logoText}>SpendWise</div>
        </div>
        <div style={s.sidebarSection}>Main</div>
        <div style={{...s.navItem, ...(page==='dashboard'?s.navActive:{})}} onClick={()=>navigate('/dashboard')}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2h6v6H1V2zm0 7h6v6H1V9zm7-7h6v6H8V2zm0 7h6v6H8V9z"/></svg>
          Dashboard
        </div>
        <div style={{...s.navItem, ...(page==='analytics'?s.navActive:{})}} onClick={()=>navigate('/analytics')}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M0 11l6-6 4 4 6-7v2l-6 7-4-4-6 6v-2z"/></svg>
          Analytics
        </div>
        <div style={{...s.navItem, ...(page==='history'?s.navActive:{})}} onClick={()=>navigate('/history')}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zM0 8a8 8 0 1116 0A8 8 0 010 8zm8-3v3l2 2-1 1-2.5-2.5V5h1.5z"/></svg>
          History
        </div>
        <div style={s.sidebarSection}>Account</div>
        <div style={{...s.navItem, ...(page==='settings'?s.navActive:{})}} onClick={()=>navigate('/settings')}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M7.5 1a.5.5 0 01.5.5v1a5 5 0 010 9v1a.5.5 0 01-1 0v-1a5 5 0 010-9v-1a.5.5 0 01.5-.5zM8 3a4 4 0 100 8A4 4 0 008 3zm0 2a2 2 0 110 4 2 2 0 010-4z"/></svg>
          Settings
        </div>
        <div style={s.sidebarBottom}>
          <div style={s.user}>
            <div style={s.userAvatar}>{user?.name?.[0]?.toUpperCase()||'U'}</div>
            <div>
              <div style={s.userName}>{user?.name||'User'}</div>
              <div style={s.userRole}>Personal account</div>
            </div>
          </div>
        </div>
      </div>
      <div style={s.main}>
        <div style={s.topbar}>
          <div>
            <div style={s.topbarTitle}>{page.charAt(0).toUpperCase()+page.slice(1)}</div>
            <div style={s.topbarSub}>SpendWise · Personal Finance</div>
          </div>
          <div style={s.topbarRight}>
            <button style={s.btnGhost} onClick={logout}>Sign out</button>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login setAuth={setUser} /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <Signup setAuth={setUser} /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={user ? <Layout user={user} setUser={setUser} page="dashboard"><Dashboard user={user} /></Layout> : <Navigate to="/login" />} />
      <Route path="/analytics" element={user ? <Layout user={user} setUser={setUser} page="analytics"><Analytics user={user} /></Layout> : <Navigate to="/login" />} />
      <Route path="/history" element={user ? <Layout user={user} setUser={setUser} page="history"><History user={user} /></Layout> : <Navigate to="/login" />} />
      <Route path="/settings" element={user ? <Layout user={user} setUser={setUser} page="settings"><Settings user={user} setUser={setUser} /></Layout> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  )
}

const s = {
  root: { display: 'flex', fontFamily: "'Inter', sans-serif", background: '#f8f8f7', minHeight: '100vh', fontSize: '14px' },
  sidebar: { width: '220px', minHeight: '100vh', background: '#fff', borderRight: '1px solid #ebebeb', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh' },
  sidebarLogo: { padding: '1.3rem 1.4rem', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '8px' },
  logoIcon: { width: '26px', height: '26px', background: '#18181b', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: '0.88rem', fontWeight: 600, color: '#18181b', letterSpacing: '-0.3px' },
  sidebarSection: { padding: '1rem 1.4rem 0.4rem', fontSize: '0.68rem', fontWeight: 600, color: '#a1a1aa', letterSpacing: '0.08em', textTransform: 'uppercase' },
  navItem: { display: 'flex', alignItems: 'center', gap: '9px', padding: '0.5rem 0.9rem', margin: '1px 0.5rem', borderRadius: '7px', cursor: 'pointer', fontSize: '0.82rem', color: '#71717a' },
  navActive: { background: '#f4f4f5', color: '#18181b', fontWeight: 500 },
  sidebarBottom: { marginTop: 'auto', padding: '1rem', borderTop: '1px solid #f0f0f0' },
  user: { display: 'flex', alignItems: 'center', gap: '10px' },
  userAvatar: { width: '28px', height: '28px', background: '#18181b', borderRadius: '50%', color: '#fff', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  userName: { fontSize: '0.8rem', fontWeight: 500, color: '#18181b' },
  userRole: { fontSize: '0.72rem', color: '#a1a1aa' },
  main: { flex: 1, minHeight: '100vh', marginLeft: '220px' },
  topbar: { background: '#fff', borderBottom: '1px solid #ebebeb', padding: '0 2rem', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 },
  topbarTitle: { fontSize: '0.9rem', fontWeight: 600, color: '#18181b', letterSpacing: '-0.2px' },
  topbarSub: { fontSize: '0.72rem', color: '#a1a1aa', marginTop: '1px' },
  topbarRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  btnGhost: { background: '#fff', color: '#374151', border: '1px solid #e4e4e7', padding: '0.45rem 1rem', borderRadius: '7px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 },
}