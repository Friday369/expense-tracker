import { useState, useEffect } from 'react'

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Other']
const COLORS = ['#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#d4d4d8', '#e4e4e7']

export default function Analytics({ user }) {
  const [expenses, setExpenses] = useState([])
  const token = localStorage.getItem('token')
  const currency = user?.currency || '₹'

  useEffect(() => {
    fetch('http://localhost:5000/expenses', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(setExpenses)
  }, [])

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  const categoryTotals = CATEGORIES.map((cat, i) => ({
    name: cat,
    value: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
    count: expenses.filter(e => e.category === cat).length,
    color: COLORS[i]
  })).filter(c => c.value > 0).sort((a, b) => b.value - a.value)

  const monthlyData = expenses.reduce((acc, e) => {
    const month = new Date(e.date).toLocaleString('default', { month: 'short', year: '2-digit' })
    acc[month] = (acc[month] || 0) + e.amount
    return acc
  }, {})

  const months = Object.entries(monthlyData).slice(-6)
  const maxMonth = Math.max(...months.map(m => m[1]), 1)

  return (
    <div style={s.content}>
      <div style={s.row}>
        {/* CATEGORY BREAKDOWN */}
        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardTitle}>Spending by Category</div>
            <div style={s.cardMeta}>All time</div>
          </div>
          <div style={s.cardBody}>
            {categoryTotals.length === 0 && <div style={s.empty}>No data yet</div>}
            {categoryTotals.map((c, i) => (
              <div key={c.name} style={s.catRow}>
                <div style={s.catLeft}>
                  <div style={{ ...s.catDot, background: c.color }} />
                  <div>
                    <div style={s.catName}>{c.name}</div>
                    <div style={s.catCount}>{c.count} transaction{c.count !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                <div style={s.catRight}>
                  <div style={s.catAmount}>{currency}{c.value.toFixed(2)}</div>
                  <div style={s.catPct}>{total ? ((c.value / total) * 100).toFixed(1) : 0}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUMMARY STATS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={s.card}>
            <div style={s.cardHead}>
              <div style={s.cardTitle}>Summary</div>
            </div>
            <div style={s.cardBody}>
              <div style={s.summaryRow}>
                <div style={s.summaryLabel}>Total Spent</div>
                <div style={s.summaryValue}>{currency}{total.toFixed(2)}</div>
              </div>
              <div style={s.divider} />
              <div style={s.summaryRow}>
                <div style={s.summaryLabel}>Transactions</div>
                <div style={s.summaryValue}>{expenses.length}</div>
              </div>
              <div style={s.divider} />
              <div style={s.summaryRow}>
                <div style={s.summaryLabel}>Average</div>
                <div style={s.summaryValue}>{expenses.length ? `${currency}${(total / expenses.length).toFixed(2)}` : '—'}</div>
              </div>
              <div style={s.divider} />
              <div style={s.summaryRow}>
                <div style={s.summaryLabel}>Highest Expense</div>
                <div style={s.summaryValue}>
                  {expenses.length ? `${currency}${Math.max(...expenses.map(e => e.amount)).toFixed(2)}` : '—'}
                </div>
              </div>
              <div style={s.divider} />
              <div style={s.summaryRow}>
                <div style={s.summaryLabel}>Categories Used</div>
                <div style={s.summaryValue}>{categoryTotals.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MONTHLY CHART */}
      <div style={s.card}>
        <div style={s.cardHead}>
          <div style={s.cardTitle}>Monthly Spending</div>
          <div style={s.cardMeta}>Last 6 months</div>
        </div>
        <div style={s.cardBody}>
          {months.length === 0 && <div style={s.empty}>No data yet</div>}
          <div style={s.monthChart}>
            {months.map(([month, val]) => (
              <div key={month} style={s.monthCol}>
                <div style={s.monthVal}>{currency}{val.toFixed(0)}</div>
                <div style={s.monthBarWrap}>
                  <div style={{ ...s.monthBar, height: `${(val / maxMonth) * 100}%` }} />
                </div>
                <div style={s.monthLabel}>{month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  content: { padding: '1.8rem 2rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: '12px', marginBottom: '12px' },
  card: { background: '#fff', border: '1px solid #ebebeb', borderRadius: '10px' },
  cardHead: { padding: '1rem 1.3rem', borderBottom: '1px solid #f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: '0.82rem', fontWeight: 600, color: '#18181b' },
  cardMeta: { fontSize: '0.72rem', color: '#a1a1aa' },
  cardBody: { padding: '1.2rem 1.3rem' },
  catRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #fafafa' },
  catLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  catDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  catName: { fontSize: '0.83rem', fontWeight: 500, color: '#18181b' },
  catCount: { fontSize: '0.72rem', color: '#a1a1aa', marginTop: '2px' },
  catRight: { textAlign: 'right' },
  catAmount: { fontSize: '0.83rem', fontWeight: 600, color: '#18181b' },
  catPct: { fontSize: '0.72rem', color: '#a1a1aa', marginTop: '2px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0' },
  summaryLabel: { fontSize: '0.8rem', color: '#71717a' },
  summaryValue: { fontSize: '0.85rem', fontWeight: 600, color: '#18181b' },
  divider: { height: '1px', background: '#fafafa' },
  monthChart: { display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px', paddingTop: '2rem' },
  monthCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' },
  monthVal: { fontSize: '0.68rem', color: '#a1a1aa', marginBottom: '6px' },
  monthBarWrap: { flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' },
  monthBar: { width: '100%', background: '#18181b', borderRadius: '4px 4px 0 0', minHeight: '4px' },
  monthLabel: { fontSize: '0.72rem', color: '#71717a', marginTop: '8px' },
  empty: { textAlign: 'center', color: '#a1a1aa', padding: '2rem', fontSize: '0.85rem' },
}