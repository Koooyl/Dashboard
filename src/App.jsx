import { useMemo, useState } from 'react'
import './App.css'

const TODAY = new Date()

function daysAgo(n) {
  const d = new Date(TODAY)
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

const INITIAL_REPORTS = [
  { id: 'RPT-1041', title: 'Q3 Revenue Reconciliation', department: 'Finance', owner: 'Elena Rostova', date: daysAgo(1), turnaround: 6.5, accuracy: 99.2, status: 'Approved' },
  { id: 'RPT-1040', title: 'Warehouse SLA Audit', department: 'Operations', owner: 'Marcus Vance', date: daysAgo(2), turnaround: 14.2, accuracy: 94.8, status: 'In Review' },
  { id: 'RPT-1039', title: 'Enterprise Pipeline Forecast', department: 'Sales', owner: 'Priya Patel', date: daysAgo(3), turnaround: 4.0, accuracy: 98.5, status: 'Approved' },
  { id: 'RPT-1038', title: 'GDPR Access Log Review', department: 'Compliance', owner: "Liam O'Connor", date: daysAgo(4), turnaround: 28.0, accuracy: 88.4, status: 'Flagged' },
  { id: 'RPT-1037', title: 'Monthly Headcount & Attrition', department: 'HR', owner: 'Sofia Chen', date: daysAgo(5), turnaround: 8.5, accuracy: 97.9, status: 'Approved' },
  { id: 'RPT-1036', title: 'AP/AR Aging Summary', department: 'Finance', owner: 'Elena Rostova', date: daysAgo(6), turnaround: 11.0, accuracy: 96.1, status: 'Approved' },
  { id: 'RPT-1035', title: 'Vendor Risk Assessment', department: 'Compliance', owner: "Liam O'Connor", date: daysAgo(7), turnaround: 22.5, accuracy: 91.0, status: 'Pending' },
  { id: 'RPT-1034', title: 'Regional Quota Attainment', department: 'Sales', owner: 'David Kim', date: daysAgo(9), turnaround: 5.5, accuracy: 99.0, status: 'Approved' },
  { id: 'RPT-1033', title: 'Fleet Utilization Telemetry', department: 'Operations', owner: 'Marcus Vance', date: daysAgo(11), turnaround: 16.0, accuracy: 93.4, status: 'Approved' },
  { id: 'RPT-1032', title: 'Expense Anomaly Audit', department: 'Finance', owner: 'Hannah Brooks', date: daysAgo(13), turnaround: 25.4, accuracy: 85.2, status: 'Flagged' },
  { id: 'RPT-1031', title: 'Onboarding Cycle Metrics', department: 'HR', owner: 'Sofia Chen', date: daysAgo(15), turnaround: 9.2, accuracy: 97.1, status: 'Approved' },
  { id: 'RPT-1030', title: 'SOC2 Control Evidence', department: 'Compliance', owner: "Liam O'Connor", date: daysAgo(18), turnaround: 19.8, accuracy: 95.6, status: 'In Review' },
  { id: 'RPT-1029', title: 'Churn & Renewal Cohort', department: 'Sales', owner: 'Priya Patel', date: daysAgo(21), turnaround: 7.4, accuracy: 98.1, status: 'Approved' },
  { id: 'RPT-1028', title: 'Supply Chain Bottlenecks', department: 'Operations', owner: 'Noah Garcia', date: daysAgo(24), turnaround: 18.5, accuracy: 90.5, status: 'Pending' },
  { id: 'RPT-1027', title: 'Payroll Variance Check', department: 'Finance', owner: 'Hannah Brooks', date: daysAgo(27), turnaround: 6.8, accuracy: 99.6, status: 'Approved' },
  { id: 'RPT-1026', title: 'Quarterly Diversity Report', department: 'HR', owner: 'Sofia Chen', date: daysAgo(35), turnaround: 12.1, accuracy: 98.0, status: 'Approved' },
  { id: 'RPT-1025', title: 'EMEA Sales Conversion', department: 'Sales', owner: 'David Kim', date: daysAgo(44), turnaround: 8.0, accuracy: 96.8, status: 'Approved' },
  { id: 'RPT-1024', title: 'ISO 27001 Gap Analysis', department: 'Compliance', owner: "Liam O'Connor", date: daysAgo(58), turnaround: 31.0, accuracy: 89.0, status: 'Flagged' },
  { id: 'RPT-1023', title: 'Inventory Shrinkage Log', department: 'Operations', owner: 'Noah Garcia', date: daysAgo(72), turnaround: 15.3, accuracy: 94.2, status: 'Approved' },
  { id: 'RPT-1022', title: 'Annual Tax Provisioning', department: 'Finance', owner: 'Elena Rostova', date: daysAgo(120), turnaround: 14.0, accuracy: 99.4, status: 'Approved' },
]

const DEPARTMENTS = ['Finance', 'Operations', 'Sales', 'Compliance', 'HR']

const VIEW_META = {
  overview: {
    title: 'Analytics Overview',
    subtitle: 'Submission volume, approval rates, and turnaround trends',
  },
  records: {
    title: 'Reporting Records',
    subtitle: 'Separate workflow tables for Action Required, In Review, and Approved Archive',
  },
  departments: {
    title: 'Department Analytics',
    subtitle: 'Performance, throughput, and quality breakdown by business unit',
  },
  sla: {
    title: 'SLA & Data Quality',
    subtitle: 'Compliance against 24-hour SLA and 95% quality benchmarks',
  },
}

function downloadCsv(rows, filename) {
  const headers = ['ID', 'Title', 'Department', 'Owner', 'Submitted Date', 'Turnaround (hrs)', 'Data Quality (%)', 'Status']
  const csv = [
    headers.join(','),
    ...rows.map((r) =>
      [r.id, `"${r.title}"`, r.department, `"${r.owner}"`, r.date, r.turnaround, r.accuracy, r.status].join(',')
    ),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function sortRecords(rows, { key, asc }) {
  return [...rows].sort((a, b) => {
    const valA = a[key]
    const valB = b[key]
    if (typeof valA === 'string') {
      return asc ? valA.localeCompare(valB) : valB.localeCompare(valA)
    }
    return asc ? valA - valB : valB - valA
  })
}

/* --- Reusable SVG Trend Chart --- */
function TrendChart({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const points = useMemo(() => {
    const byDate = {}
    ;[...data]
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((r) => {
        if (!byDate[r.date]) byDate[r.date] = { date: r.date, submitted: 0, approved: 0 }
        byDate[r.date].submitted += 1
        if (r.status === 'Approved') byDate[r.date].approved += 1
      })
    return Object.values(byDate)
  }, [data])

  if (!points.length) {
    return <div className="empty-state">No trend data for selected filters.</div>
  }

  const width = 620
  const height = 240
  const padX = 36
  const padY = 24
  const maxVal = Math.max(2, ...points.map((p) => p.submitted))

  const getX = (i) =>
    points.length === 1
      ? width / 2
      : padX + (i / (points.length - 1)) * (width - padX * 2)
  const getY = (val) => height - padY - (val / maxVal) * (height - padY * 2)

  const subLine = points.map((p, i) => `${getX(i)},${getY(p.submitted)}`).join(' ')
  const appLine = points.map((p, i) => `${getX(i)},${getY(p.approved)}`).join(' ')
  const subArea = `${getX(0)},${height - padY} ${subLine} ${getX(points.length - 1)},${height - padY}`

  return (
    <div className="svg-chart-box">
      <div className="chart-legend-inline">
        <span><i className="dot dot-blue" /> Submitted</span>
        <span><i className="dot dot-green" /> Approved</span>
        {hoveredIdx !== null && points[hoveredIdx] && (
          <span className="chart-hover-readout">
            <strong>{points[hoveredIdx].date}</strong>: {points[hoveredIdx].submitted} submitted, {points[hoveredIdx].approved} approved
          </span>
        )}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
        {[0, 0.5, 1].map((ratio) => {
          const y = getY(maxVal * ratio)
          return (
            <g key={ratio}>
              <line x1={padX} y1={y} x2={width - padX} y2={y} className="chart-grid-line" />
              <text x={padX - 8} y={y + 4} textAnchor="end" className="chart-axis-text">
                {Math.round(maxVal * ratio)}
              </text>
            </g>
          )
        })}

        <polygon points={subArea} fill="rgba(59, 130, 246, 0.14)" />
        <polyline points={subLine} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
        <polyline points={appLine} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />

        {points.map((p, i) => (
          <g
            key={p.date}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ cursor: 'pointer' }}
          >
            <circle cx={getX(i)} cy={getY(p.submitted)} r={hoveredIdx === i ? 5.5 : 3.5} fill="#3b82f6" />
            <circle cx={getX(i)} cy={getY(p.approved)} r={hoveredIdx === i ? 5.5 : 3.5} fill="#10b981" />
            {(i === 0 || i === points.length - 1 || i % Math.ceil(points.length / 5) === 0) && (
              <text x={getX(i)} y={height - 4} textAnchor="middle" className="chart-axis-text">
                {p.date.slice(5)}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}

/* --- Reusable SVG Doughnut Chart --- */
function StatusDoughnut({ data }) {
  const segments = [
    { label: 'Approved', color: '#10b981', count: data.filter((r) => r.status === 'Approved').length },
    { label: 'In Review', color: '#3b82f6', count: data.filter((r) => r.status === 'In Review').length },
    { label: 'Pending', color: '#f59e0b', count: data.filter((r) => r.status === 'Pending').length },
    { label: 'Flagged', color: '#ef4444', count: data.filter((r) => r.status === 'Flagged').length },
  ]

  const total = data.length
  const radius = 58
  const circumference = 2 * Math.PI * radius
  let cumulative = 0

  return (
    <div className="doughnut-layout">
      <svg viewBox="0 0 160 160" className="doughnut-svg">
        <circle cx="80" cy="80" r={radius} fill="none" className="doughnut-track" strokeWidth="20" />
        {total > 0 &&
          segments.map((seg) => {
            const dash = (seg.count / total) * circumference
            const offset = -cumulative
            cumulative += dash
            return (
              <circle
                key={seg.label}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="20"
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={offset}
                transform="rotate(-90 80 80)"
              />
            )
          })}
        <text x="80" y="76" textAnchor="middle" className="doughnut-total">
          {total}
        </text>
        <text x="80" y="94" textAnchor="middle" className="doughnut-sub">
          Reports
        </text>
      </svg>

      <div className="doughnut-legend">
        {segments.map((seg) => (
          <div key={seg.label} className="doughnut-legend-row">
            <span className="legend-label">
              <i className="dot" style={{ background: seg.color }} />
              {seg.label}
            </span>
            <strong>{seg.count}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

/* --- Reusable Separate Table Component --- */
function ReportingTable({ title, badgeClass, rows, sortState, onSort, onExport, timeHeader }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <span className="card-title">{title}</span>
          <span className={`badge ${badgeClass}`}>{rows.length}</span>
        </div>
        <div className="table-toolbar">
          <button type="button" className="btn-sm" onClick={onExport}>
            ⬇ Export CSV
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => onSort('id')}>Report ID ↕</th>
              <th onClick={() => onSort('title')}>Report Title ↕</th>
              <th onClick={() => onSort('department')}>Department ↕</th>
              <th onClick={() => onSort('owner')}>Owner ↕</th>
              <th onClick={() => onSort('date')}>Submitted Date ↕</th>
              <th onClick={() => onSort('turnaround')}>{timeHeader} ↕</th>
              <th onClick={() => onSort('accuracy')}>Data Quality ↕</th>
              <th onClick={() => onSort('status')}>Status ↕</th>
            </tr>
          </thead>
          <tbody>
            {!rows.length ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  No records in this category for the selected filters.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.id}</strong></td>
                  <td>{r.title}</td>
                  <td>{r.department}</td>
                  <td>{r.owner}</td>
                  <td>{r.date}</td>
                  <td>{r.turnaround.toFixed(1)}h</td>
                  <td>{r.accuracy.toFixed(1)}%</td>
                  <td>
                    <span className={`status-pill status-${r.status.replace(/\s+/g, '')}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function App() {
  const [activeView, setActiveView] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const [dateDays, setDateDays] = useState(30)
  const [deptFilter, setDeptFilter] = useState('All')
  const [recordsSearch, setRecordsSearch] = useState('')
  const [sortMap, setSortMap] = useState({
    action: { key: 'date', asc: false },
    review: { key: 'date', asc: false },
    approved: { key: 'date', asc: false },
  })

  const filteredData = useMemo(() => {
    const cutoff = new Date(TODAY)
    cutoff.setDate(cutoff.getDate() - dateDays)

    return INITIAL_REPORTS.filter((r) => {
      const rDate = new Date(`${r.date}T00:00:00`)
      if (rDate < cutoff) return false
      if (deptFilter !== 'All' && r.department !== deptFilter) return false
      return true
    })
  }, [dateDays, deptFilter])

  const searchedData = useMemo(() => {
    const q = recordsSearch.trim().toLowerCase()
    if (!q) return filteredData
    return filteredData.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q)
    )
  }, [filteredData, recordsSearch])

  const kpis = useMemo(() => {
    const total = filteredData.length
    const approved = filteredData.filter((r) => r.status === 'Approved').length
    const actionCount = filteredData.filter((r) => r.status === 'Flagged' || r.status === 'Pending').length
    const avgTurnaround = total
      ? (filteredData.reduce((sum, r) => sum + r.turnaround, 0) / total).toFixed(1)
      : '0.0'
    const approvalRate = total ? ((approved / total) * 100).toFixed(1) : '0.0'
    const actionPct = total ? ((actionCount / total) * 100).toFixed(1) : '0.0'

    return { total, approvalRate, avgTurnaround, actionCount, actionPct }
  }, [filteredData])

  const deptStats = useMemo(() => {
    return DEPARTMENTS.map((dept) => {
      const items = filteredData.filter((r) => r.department === dept)
      const total = items.length
      const approved = items.filter((r) => r.status === 'Approved').length
      const review = items.filter((r) => r.status === 'In Review').length
      const action = items.filter((r) => r.status === 'Flagged' || r.status === 'Pending').length
      const rate = total ? ((approved / total) * 100).toFixed(1) : '0.0'
      const avgTurnaround = total ? +(items.reduce((s, r) => s + r.turnaround, 0) / total).toFixed(1) : 0
      const avgQuality = total ? (items.reduce((s, r) => s + r.accuracy, 0) / total).toFixed(1) : '0.0'
      return { dept, total, approved, review, action, rate, avgTurnaround, avgQuality }
    })
  }, [filteredData])

  const actionRows = useMemo(
    () => sortRecords(searchedData.filter((r) => r.status === 'Flagged' || r.status === 'Pending'), sortMap.action),
    [searchedData, sortMap.action]
  )
  const reviewRows = useMemo(
    () => sortRecords(searchedData.filter((r) => r.status === 'In Review'), sortMap.review),
    [searchedData, sortMap.review]
  )
  const approvedRows = useMemo(
    () => sortRecords(searchedData.filter((r) => r.status === 'Approved'), sortMap.approved),
    [searchedData, sortMap.approved]
  )

  const slaMetrics = useMemo(() => {
    const total = filteredData.length
    const avgQuality = total ? (filteredData.reduce((s, r) => s + r.accuracy, 0) / total).toFixed(1) : '0.0'
    const withinSla = filteredData.filter((r) => r.turnaround <= 24).length
    const breaches = filteredData.filter((r) => r.turnaround > 24).length
    const compliance = total ? ((withinSla / total) * 100).toFixed(1) : '0.0'
    const auditRows = filteredData.filter((r) => r.turnaround > 24 || r.accuracy < 92)
    return { avgQuality, compliance, breaches, auditRows }
  }, [filteredData])

  const handleSort = (tableKey, colKey) => {
    setSortMap((prev) => ({
      ...prev,
      [tableKey]: {
        key: colKey,
        asc: prev[tableKey].key === colKey ? !prev[tableKey].asc : true,
      },
    }))
  }

  const handleNavClick = (view) => {
    setActiveView(view)
    setSidebarOpen(false)
  }

  const maxDeptCount = Math.max(1, ...deptStats.map((d) => d.total))
  const maxTurnaround = Math.max(1, ...deptStats.map((d) => d.avgTurnaround))

  return (
    <div className="dashboard-shell" data-theme={theme}>
      {sidebarOpen && (
        <div className="sidenav-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidenav */}
      <aside className={`sidenav ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">RA</div>
          <div>
            <span className="brand-text">ReportPulse</span>
            <span className="brand-sub">Analytics Workspace</span>
          </div>
        </div>

        <div className="nav-section">Analytics</div>
        <ul className="nav-list">
          <li
            className={`nav-item ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => handleNavClick('overview')}
          >
            <span className="nav-item-left">📊 Overview</span>
          </li>
          <li
            className={`nav-item ${activeView === 'records' ? 'active' : ''}`}
            onClick={() => handleNavClick('records')}
          >
            <span className="nav-item-left">📑 Reporting Records</span>
            <span className="nav-badge nav-badge-alert">{kpis.actionCount}</span>
          </li>
          <li
            className={`nav-item ${activeView === 'departments' ? 'active' : ''}`}
            onClick={() => handleNavClick('departments')}
          >
            <span className="nav-item-left">🏢 Departments</span>
          </li>
          <li
            className={`nav-item ${activeView === 'sla' ? 'active' : ''}`}
            onClick={() => handleNavClick('sla')}
          >
            <span className="nav-item-left">⏱️ SLA &amp; Quality</span>
          </li>
        </ul>

        <div className="sidenav-footer">
          <div><strong>Data Refresh:</strong> Live</div>
          <div>React + Vite Workspace</div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="menu-btn"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle Menu"
            >
              ☰
            </button>
            <div>
              <div className="page-title">{VIEW_META[activeView].title}</div>
              <div className="page-subtitle">{VIEW_META[activeView].subtitle}</div>
            </div>
          </div>

          <div className="topbar-actions">
            <select
              value={dateDays}
              onChange={(e) => setDateDays(Number(e.target.value))}
              aria-label="Date Range"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 90 Days</option>
              <option value={365}>All Time</option>
            </select>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              aria-label="Department"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            >
              {theme === 'light' ? '🌙 Theme' : '☀️ Theme'}
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={() => downloadCsv(filteredData, `reporting-all-${new Date().toISOString().slice(0, 10)}.csv`)}
            >
              ⬇ Export All CSV
            </button>
          </div>
        </header>

        <main className="content">
          {/* OVERVIEW VIEW */}
          {activeView === 'overview' && (
            <>
              <div className="kpi-grid">
                <div className="card">
                  <div className="kpi-label">Total Reports</div>
                  <div className="kpi-value">{kpis.total}</div>
                  <div className="kpi-meta">
                    <span className="badge badge-up">+12.4%</span>
                    <span>vs. previous period</span>
                  </div>
                </div>

                <div className="card">
                  <div className="kpi-label">Approval Rate</div>
                  <div className="kpi-value">{kpis.approvalRate}%</div>
                  <div className="kpi-meta">
                    <span className="badge badge-up">+3.1%</span>
                    <span>SLA target: 80%</span>
                  </div>
                </div>

                <div className="card">
                  <div className="kpi-label">Avg. Turnaround Time</div>
                  <div className="kpi-value">{kpis.avgTurnaround}h</div>
                  <div className="kpi-meta">
                    <span className="badge badge-up">-1.8h</span>
                    <span>faster resolution</span>
                  </div>
                </div>

                <div className="card">
                  <div className="kpi-label">Action Required</div>
                  <div className="kpi-value">{kpis.actionCount}</div>
                  <div className="kpi-meta">
                    <span className="badge badge-down">{kpis.actionPct}% of total</span>
                    <span>Flagged or Pending</span>
                  </div>
                </div>
              </div>

              <div className="charts-grid">
                <div className="card">
                  <div className="card-header">
                    <div>
                      <div className="card-title">Report Volume &amp; Approval Trend</div>
                      <div className="card-subtitle">Submitted vs. approved reports over selected timeframe</div>
                    </div>
                  </div>
                  <TrendChart data={filteredData} />
                </div>

                <div className="card">
                  <div className="card-header">
                    <div>
                      <div className="card-title">Status Distribution</div>
                      <div className="card-subtitle">Breakdown across workflow stages</div>
                    </div>
                  </div>
                  <StatusDoughnut data={filteredData} />
                </div>
              </div>

              <div className="charts-secondary">
                <div className="card">
                  <div className="card-header">
                    <div>
                      <div className="card-title">Reports by Department</div>
                      <div className="card-subtitle">Volume across business units</div>
                    </div>
                  </div>
                  <div className="bar-list">
                    {deptStats.map((d) => (
                      <div key={d.dept} className="bar-row">
                        <span className="bar-label">{d.dept}</span>
                        <div className="bar-track">
                          <div
                            className="bar-fill bar-fill-blue"
                            style={{ width: `${(d.total / maxDeptCount) * 100}%` }}
                          />
                        </div>
                        <span className="bar-value">{d.total}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <div>
                      <div className="card-title">Avg. Turnaround by Department (Hours)</div>
                      <div className="card-subtitle">Lower indicates faster processing</div>
                    </div>
                  </div>
                  <div className="bar-list">
                    {deptStats.map((d) => (
                      <div key={d.dept} className="bar-row">
                        <span className="bar-label">{d.dept}</span>
                        <div className="bar-track">
                          <div
                            className="bar-fill bar-fill-purple"
                            style={{ width: `${(d.avgTurnaround / maxTurnaround) * 100}%` }}
                          />
                        </div>
                        <span className="bar-value">{d.avgTurnaround}h</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SEPARATE TABLES FOR REPORTING RECORDS */}
          {activeView === 'records' && (
            <div className="stack-gap">
              <div className="card" style={{ padding: '14px 20px' }}>
                <div className="card-header" style={{ marginBottom: 0 }}>
                  <div>
                    <div className="card-title">Reporting Records Directory</div>
                    <div className="card-subtitle">
                      Separated into Action Required, In Review Queue, and Approved Archive
                    </div>
                  </div>
                  <input
                    type="text"
                    className="table-search"
                    value={recordsSearch}
                    onChange={(e) => setRecordsSearch(e.target.value)}
                    placeholder="Filter all tables by ID, title, or owner..."
                  />
                </div>
              </div>

              <ReportingTable
                title="🚨 Action Required (Flagged & Pending)"
                badgeClass="badge-down"
                rows={actionRows}
                sortState={sortMap.action}
                onSort={(col) => handleSort('action', col)}
                onExport={() => downloadCsv(actionRows, 'reporting-action-required.csv')}
                timeHeader="Wait Time"
              />

              <ReportingTable
                title="🔍 In Review Queue"
                badgeClass="badge-primary"
                rows={reviewRows}
                sortState={sortMap.review}
                onSort={(col) => handleSort('review', col)}
                onExport={() => downloadCsv(reviewRows, 'reporting-in-review.csv')}
                timeHeader="Elapsed (hrs)"
              />

              <ReportingTable
                title="✅ Approved Reports Archive"
                badgeClass="badge-up"
                rows={approvedRows}
                sortState={sortMap.approved}
                onSort={(col) => handleSort('approved', col)}
                onExport={() => downloadCsv(approvedRows, 'reporting-approved-archive.csv')}
                timeHeader="Turnaround (hrs)"
              />
            </div>
          )}

          {/* DEPARTMENTS VIEW */}
          {activeView === 'departments' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Department Performance Matrix</div>
                  <div className="card-subtitle">
                    Aggregated reporting volume, approval rates, and quality scores by department
                  </div>
                </div>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Total Reports</th>
                      <th>Approved</th>
                      <th>In Review</th>
                      <th>Flagged / Pending</th>
                      <th>Approval Rate</th>
                      <th>Avg. Turnaround</th>
                      <th>Avg. Data Quality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptStats.map((d) => (
                      <tr key={d.dept}>
                        <td><strong>{d.dept}</strong></td>
                        <td>{d.total}</td>
                        <td>{d.approved}</td>
                        <td>{d.review}</td>
                        <td>{d.action}</td>
                        <td>
                          <span className={`badge ${parseFloat(d.rate) >= 75 ? 'badge-up' : 'badge-neutral'}`}>
                            {d.rate}%
                          </span>
                        </td>
                        <td>{d.avgTurnaround}h</td>
                        <td>{d.avgQuality}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SLA & QUALITY VIEW */}
          {activeView === 'sla' && (
            <div className="stack-gap">
              <div className="kpi-grid">
                <div className="card">
                  <div className="kpi-label">Avg. Data Quality Score</div>
                  <div className="kpi-value">{slaMetrics.avgQuality}%</div>
                  <div className="kpi-meta"><span className="badge badge-up">Target: 95%</span></div>
                </div>
                <div className="card">
                  <div className="kpi-label">Within 24h SLA</div>
                  <div className="kpi-value">{slaMetrics.compliance}%</div>
                  <div className="kpi-meta"><span className="badge badge-primary">24h Threshold</span></div>
                </div>
                <div className="card">
                  <div className="kpi-label">SLA Breaches (&gt; 24h)</div>
                  <div className="kpi-value">{slaMetrics.breaches}</div>
                  <div className="kpi-meta"><span className="badge badge-down">Escalated</span></div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">SLA Breaches &amp; Low Quality Audit (&gt;24h or &lt;92% Quality)</div>
                    <div className="card-subtitle">Reports requiring data remediation or escalation</div>
                  </div>
                </div>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Report ID</th>
                        <th>Report Title</th>
                        <th>Department</th>
                        <th>Owner</th>
                        <th>Turnaround (hrs)</th>
                        <th>Data Quality</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!slaMetrics.auditRows.length ? (
                        <tr>
                          <td colSpan="7" className="empty-state">No SLA breaches or quality issues found.</td>
                        </tr>
                      ) : (
                        slaMetrics.auditRows.map((r) => (
                          <tr key={r.id}>
                            <td><strong>{r.id}</strong></td>
                            <td>{r.title}</td>
                            <td>{r.department}</td>
                            <td>{r.owner}</td>
                            <td>
                              <span className={`badge ${r.turnaround > 24 ? 'badge-down' : 'badge-neutral'}`}>
                                {r.turnaround.toFixed(1)}h
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${r.accuracy < 92 ? 'badge-down' : 'badge-neutral'}`}>
                                {r.accuracy.toFixed(1)}%
                              </span>
                            </td>
                            <td>
                              <span className={`status-pill status-${r.status.replace(/\s+/g, '')}`}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App