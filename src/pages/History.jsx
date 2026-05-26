import { useState, useEffect } from 'react'

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Other']

export default function History({ user }) {
  const [expenses, setExpenses] = useState([])
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const token = localStorage.getItem('token')
  const currency = user?.currency || '₹'

  useEffect(() => {
    fetch('http://localhost:5000/expenses', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setExpenses)
  }, [])

  async function deleteExpense(id) {
    await fetch(`http://localhost:5000/expenses/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    setExpenses(expenses.filter(e => e._id !== id))
  }

  const filtered = expenses
    .filter(e => category === 'All' || e.category === category)
    .filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date)
      if (sortBy === 'amount') return b.amount - a.amount
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div style={s.content}>
      {/* FILTERS */}
      <div style={s.filters}>
        <div style={s.filterLeft}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              style={{ ...s.filterBtn, ...(category === c ? s.filterBtnActive : {}) }}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div style={s.filterRight}>
          <input
            style={s.search}
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select style={s.select} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div style={s.tableCard}>
        <div style={s.tableHead}>
          <div style={s.cardTitle}>
            All Transactions
            <span style={s.count}>{filtered.length} results</span>
          </div>
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
              <tr><td colSpan="5" style={s.empty}>No transactions found</td></tr>
            )}
            {filtered.map(e => (
              <tr key={e._id} style={s.tr}>
                <td style={{ ...s.td, fontWeight: 500, color: '#18181b' }}>{e.name}</td>
                <td style={s.td}><span style={s.pill}>{e.category}</span></td>
                <td style={{ ...s.td, color: '#a1a1aa' }}>
                  {new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
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
  filters: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '10px' },
  filterLeft: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  filterBtn: { background: '#fff', border: '1px solid #e4e4e7', color: '#71717a', padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 400 },
  filterBtnActive: { background: '#18181b', border: '1px solid #18181b', color: '#fff', fontWeight: 500 },
  filterRight: { display: 'flex', gap: '8px' },
  search: { background: '#fff', border: '1px solid #e4e4e7', color: '#18181b', fontSize: '0.78rem', padding: '0.4rem 0.8rem', borderRadius: '6px', outline: 'none', width: '160px' },
  select: { background: '#fff', border: '1px solid #e4e4e7', color: '#18181b', fontSize: '0.78rem', padding: '0.4rem 0.8rem', borderRadius: '6px', outline: 'none' },
  tableCard: { background: '#fff', border: '1px solid #ebebeb', borderRadius: '10px', overflow: 'hidden' },
  tableHead: { padding: '0.9rem 1.3rem', borderBottom: '1px solid #f4f4f5' },
  cardTitle: { fontSize: '0.82rem', fontWeight: 600, color: '#18181b', display: 'flex', alignItems: 'center', gap: '10px' },
  count: { fontSize: '0.72rem', color: '#a1a1aa', background: '#f4f4f5', padding: '0.18rem 0.65rem', borderRadius: '20px', fontWeight: 400 },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#fafafa', borderBottom: '1px solid #f0f0f0' },
  th: { fontSize: '0.7rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.7rem 1.3rem', textAlign: 'left' },
  td: { fontSize: '0.82rem', padding: '0.8rem 1.3rem', borderBottom: '1px solid #fafafa', color: '#3f3f46' },
  tr: { cursor: 'default' },
  pill: { display: 'inline-flex', fontSize: '0.7rem', fontWeight: 500, padding: '0.18rem 0.6rem', borderRadius: '5px', background: '#f4f4f5', color: '#3f3f46' },
  del: { background: 'transparent', border: '1px solid #e4e4e7', color: '#a1a1aa', width: '24px', height: '24px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.65rem' },
  empty: { textAlign: 'center', color: '#a1a1aa', padding: '2rem', fontSize: '0.85rem' },
}