import { useState, useEffect } from 'react'

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Other']
const COLORS = ['#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#d4d4d8', '#e4e4e7']

export default function Dashboard({ user }) {
  const [expenses, setExpenses] = useState([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [search, setSearch] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetch('http://localhost:5000/expenses', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setExpenses)
  }, [])

  async function addExpense() {
    if (!name || !amount) return
    const res = await fetch('http://localhost:5000/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, amount, category })
    })
    const newExpense = await res.json()
    setExpenses([newExpense, ...expenses])
    setName('')
    setAmount('')
  }

  async function deleteExpense(id) {
    await fetch(`http://localhost:5000/expenses/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    setExpenses(expenses.filter(e => e._id !== id))
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const filtered = expenses.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  )
  const categoryTotals = CATEGORIES.map(cat => ({
    name: cat,
    value: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0)
  })).filter(c => c.value > 0).sort((a, b) => b.value - a.value)

  const currency = user?.currency || '₹'

  return (
    <div style={s.content}>
      {/* STATS */}
      <div style={s.stats}>
        <div style={s.stat}>
          <div style={s.statLabel}>Total Spent</div>
          <div style={s.statValue}>{currency}{total.toFixed(2)}</div>
          <div style={s.statFooter}>All time</div>
        </div>
        <div style={s.stat}>
          <div style={s.statLabel}>Transactions</div>
          <div style={s.statValue}>{expenses.length}</div>
          <div style={s.statFooter}>Total entries</div>
        </div>
        <div style={s.stat}>
          <div style={s.statLabel}>Top Category</div>
          <div style={{ ...s.statValue, fontSize: '1.1rem', paddingTop: '5px' }}>
            {categoryTotals[0]?.name || '—'}
          </div>
          <div style={s.statFooter}>
            {categoryTotals[0] ? `${((categoryTotals[0].value / total) * 100).toFixed(0)}% of spending` : 'No data'}
          </div>
        </div>
        <div style={s.stat}>
          <div style={s.statLabel}>Average</div>
          <div style={s.statValue}>
            {expenses.length ? `${currency}${(total / expenses.length).toFixed(2)}` : '—'}
          </div>
          <div style={s.statFooter}>Per transaction</div>
        </div>
      </div>

      {/* FORM + BREAKDOWN */}
      <div style={s.row}>
        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardTitle}>Add Expense</div>
            <div style={s.cardMeta}>All fields required</div>
          </div>
          <div style={s.cardBody}>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>Description</label>
                <input style={s.input} placeholder="e.g. Grocery run" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Amount ({currency})</label>
                <input style={s.input} placeholder="0.00" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Category</label>
              <select style={s.select} value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button style={s.addBtn} onClick={addExpense}>Add Expense</button>
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardTitle}>Breakdown</div>
            <div style={s.cardMeta}>By category</div>
          </div>
          <div style={s.cardBody}>
            {categoryTotals.length === 0 && <div style={s.empty}>No expenses yet</div>}
            <div style={s.bars}>
              {categoryTotals.map((c, i) => (
                <div key={c.name} style={s.barRow}>
                  <div style={s.barMeta}>
                    <div style={s.barName}>{c.name}</div>
                    <div style={s.barPct}>{((c.value / total) * 100).toFixed(0)}%</div>
                  </div>
                  <div style={s.barTrack}>
                    <div style={{ ...s.barFill, width: `${(c.value / total) * 100}%`, background: COLORS[i] || '#d4d4d8' }} />
                  </div>
                  <div style={s.barAmount}>{currency}{c.value.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div style={s.tableCard}>
        <div style={s.tableHead}>
          <div style={s.cardTitle}>Transactions</div>
          <input style={s.search} placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table style={s.table}>
          <thead>
            <tr style={s.thead}>
              <th style={s.th}>Description</th>
              <th style={s.th}>Category</th>
              <th style={s.th}>Date</th>
              <th style={s.th}>Amount</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan="5" style={s.empty}>No expenses found</td></tr>
            )}
            {filtered.map(e => (
              <tr key={e._id}>
                <td style={{ ...s.td, fontWeight: 500, color: '#18181b' }}>{e.name}</td>
                <td style={s.td}><span style={s.pill}>{e.category}</span></td>
                <td style={{ ...s.td, color: '#a1a1aa' }}>{new Date(e.date).toLocaleDateString()}</td>
                <td style={{ ...s.td, fontWeight: 600, color: '#18181b' }}>{currency}{e.amount.toFixed(2)}</td>
                <td style={s.td}><button style={s.del} onClick={() => deleteExpense(e._id)}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const s = {
  content: { padding: '1.8rem 2rem' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '1.2rem' },
  stat: { background: '#fff', border: '1px solid #ebebeb', borderRadius: '10px', padding: '1.1rem 1.2rem' },
  statLabel: { fontSize: '0.72rem', fontWeight: 500, color: '#a1a1aa', marginBottom: '0.5rem' },
  statValue: { fontSize: '1.45rem', fontWeight: 700, color: '#18181b', letterSpacing: '-0.8px', marginBottom: '4px' },
  statFooter: { fontSize: '0.72rem', color: '#a1a1aa' },
  row: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '12px', marginBottom: '12px' },
  card: { background: '#fff', border: '1px solid #ebebeb', borderRadius: '10px' },
  cardHead: { padding: '1rem 1.3rem', borderBottom: '1px solid #f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: '0.82rem', fontWeight: 600, color: '#18181b' },
  cardMeta: { fontSize: '0.72rem', color: '#a1a1aa' },
  cardBody: { padding: '1.2rem 1.3rem' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' },
  formGroup: { marginBottom: '8px' },
  label: { fontSize: '0.72rem', fontWeight: 500, color: '#52525b', display: 'block', marginBottom: '5px' },
  input: { width: '100%', background: '#fafafa', border: '1px solid #e4e4e7', color: '#18181b', fontSize: '0.82rem', padding: '0.55rem 0.85rem', borderRadius: '7px', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', background: '#fafafa', border: '1px solid #e4e4e7', color: '#18181b', fontSize: '0.82rem', padding: '0.55rem 0.85rem', borderRadius: '7px', outline: 'none' },
  addBtn: { width: '100%', background: '#18181b', color: '#fff', border: 'none', padding: '0.65rem', borderRadius: '7px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 500, marginTop: '4px' },
  bars: { display: 'flex', flexDirection: 'column', gap: '14px' },
  barRow: { display: 'flex', flexDirection: 'column', gap: '5px' },
  barMeta: { display: 'flex', justifyContent: 'space-between' },
  barName: { fontSize: '0.78rem', fontWeight: 500, color: '#3f3f46' },
  barPct: { fontSize: '0.72rem', color: '#a1a1aa' },
  barTrack: { background: '#f4f4f5', borderRadius: '3px', height: '5px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '3px' },
  barAmount: { fontSize: '0.72rem', color: '#a1a1aa' },
  tableCard: { background: '#fff', border: '1px solid #ebebeb', borderRadius: '10px', overflow: 'hidden' },
  tableHead: { padding: '0.9rem 1.3rem', borderBottom: '1px solid #f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  search: { background: '#fafafa', border: '1px solid #e4e4e7', color: '#18181b', fontSize: '0.78rem', padding: '0.4rem 0.8rem', borderRadius: '6px', outline: 'none', width: '180px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#fafafa', borderBottom: '1px solid #f0f0f0' },
  th: { fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.7rem 1.3rem', textAlign: 'left' },
  td: { fontSize: '0.82rem', padding: '0.8rem 1.3rem', borderBottom: '1px solid #fafafa', color: '#3f3f46' },
  pill: { display: 'inline-flex', fontSize: '0.7rem', fontWeight: 500, padding: '0.18rem 0.6rem', borderRadius: '5px', background: '#f4f4f5', color: '#3f3f46' },
  del: { background: 'transparent', border: '1px solid #e4e4e7', color: '#a1a1aa', width: '24px', height: '24px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.65rem' },
  empty: { textAlign: 'center', color: '#a1a1aa', padding: '2rem', fontSize: '0.85rem' },
}