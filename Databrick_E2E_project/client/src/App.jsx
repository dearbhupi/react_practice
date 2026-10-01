import { useEffect, useState } from 'react'
import CreditAnalysis from './CreditAnalysis.jsx'
import './App.css'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
    new Date(`${value}T00:00:00`),
  )
}

function App() {
  const [activePage, setActivePage] = useState(() =>
    window.location.hash === '#credit-analysis' ? 'credit-analysis' : 'overview',
  )
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    function syncPage() {
      setActivePage(window.location.hash === '#credit-analysis' ? 'credit-analysis' : 'overview')
    }
    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  useEffect(() => {
    if (activePage !== 'overview') return
    const controller = new AbortController()

    async function loadDashboard() {
      setIsLoading(true)
      setError('')
      try {
        const response = await fetch('/api/v1/dashboard', { signal: controller.signal })
        if (!response.ok) throw new Error(`Dashboard request failed (${response.status})`)
        setDashboard(await response.json())
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    loadDashboard()
    return () => controller.abort()
  }, [activePage, refreshKey])

  const series = dashboard?.series ?? []
  const maxRevenue = Math.max(...series.map((day) => day.revenue), 1)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" aria-label="Fieldnote home">
          <span className="brand-mark">F</span>
          <span>fieldnote</span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <a className={`nav-link ${activePage === 'overview' ? 'active' : ''}`} href="#overview" title="Sales overview">
          <span className="nav-glyph" aria-hidden="true">▦</span> Sales overview
        </a>
        <a className={`nav-link ${activePage === 'credit-analysis' ? 'active' : ''}`} href="#credit-analysis" title="Credit analysis">
          <span className="nav-glyph" aria-hidden="true">◷</span> Credit analysis
        </a>
        <div className="sidebar-bottom">
          <span className="status-dot" />
          <span>Data services</span>
          <span className="service-status">ready</span>
        </div>
      </aside>

      <main className="main-content" id={activePage}>
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> {activePage === 'overview' ? 'Sales overview' : 'Credit analysis'}</div>
          <div className="topbar-meta"><span className="live-dot" /> Data pipeline</div>
        </header>

        <section className="page-heading">
          <div>
            <p className="eyebrow">{activePage === 'overview' ? 'BUSINESS INTELLIGENCE • LAST 7 DAYS' : 'GERMAN CREDIT DATA • HISTORICAL LABELS'}</p>
            <h1>{activePage === 'overview' ? 'Sales overview' : 'Credit analysis'}</h1>
            <p className="subheading">{activePage === 'overview' ? 'A clear view of your latest sales performance.' : 'Descriptive patterns in historical credit outcomes.'}</p>
          </div>
          <button className="refresh-button" type="button" onClick={() => setRefreshKey((key) => key + 1)} disabled={activePage === 'overview' && isLoading}>
            <span aria-hidden="true">↻</span> {activePage === 'overview' && isLoading ? 'Refreshing' : 'Refresh data'}
          </button>
        </section>

        {activePage === 'overview' && error && (
          <div className="error-banner" role="alert">
            <span>{error}. Check that the FastAPI server is running.</span>
            <button type="button" onClick={() => setRefreshKey((key) => key + 1)}>Retry</button>
          </div>
        )}

        {activePage === 'credit-analysis' ? <CreditAnalysis refreshKey={refreshKey} /> : <>
        <section className="metrics-grid" aria-label="Sales summary">
          <article className="metric-panel revenue-panel">
            <div className="metric-topline"><span>Gross revenue</span><span className="metric-icon">↗</span></div>
            <strong>{dashboard ? currency.format(dashboard.summary.revenue) : '—'}</strong>
            <span className="metric-caption">Across the selected period</span>
          </article>
          <article className="metric-panel">
            <div className="metric-topline"><span>Orders</span><span className="metric-icon">⌑</span></div>
            <strong>{dashboard ? dashboard.summary.orders.toLocaleString() : '—'}</strong>
            <span className="metric-caption">Completed orders</span>
          </article>
          <article className="metric-panel">
            <div className="metric-topline"><span>Average order value</span><span className="metric-icon">◎</span></div>
            <strong>{dashboard ? currency.format(dashboard.summary.average_order_value) : '—'}</strong>
            <span className="metric-caption">Revenue per order</span>
          </article>
        </section>

        <section className="chart-panel" aria-labelledby="chart-title">
          <div className="section-heading">
            <div><p className="eyebrow">REVENUE TREND</p><h2 id="chart-title">Daily sales</h2></div>
            <span className={`source-badge ${dashboard?.source === 'databricks' ? 'connected' : ''}`}>
              <span />{dashboard?.source === 'databricks' ? 'Databricks' : 'Demo data'}
            </span>
          </div>
          {isLoading && !dashboard ? (
            <div className="chart-placeholder">Loading sales data…</div>
          ) : series.length ? (
            <div className="chart" role="img" aria-label="Daily revenue for the last seven days">
              {series.map((day) => (
                <div className="chart-column" key={day.date}>
                  <span className="bar-value">{currency.format(day.revenue)}</span>
                  <div className="bar-track"><div className="bar" style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, 4)}%` }} /></div>
                  <span className="bar-label">{formatDate(day.date)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="chart-placeholder">No sales data is available for this period.</div>
          )}
          <footer className="chart-footer">
            <span><span className="legend-swatch" /> Revenue</span>
            <span>{dashboard?.updated_at ? `Updated ${new Date(dashboard.updated_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'Waiting for data'}</span>
          </footer>
        </section>
        </>}

        <footer className="page-footer">Fieldnote <span>•</span> Analytics workspace</footer>
      </main>
    </div>
  )
}

export default App
