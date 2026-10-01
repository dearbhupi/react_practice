import { useEffect, useState } from 'react'
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
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
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
  }, [refreshKey])

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
        <a className="nav-link active" href="#overview">
          <span className="nav-glyph" aria-hidden="true">▦</span> Overview
        </a>
        <div className="sidebar-bottom">
          <span className="status-dot" />
          <span>Data services</span>
          <span className="service-status">ready</span>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> Sales overview</div>
          <div className="topbar-meta"><span className="live-dot" /> Pipeline monitor</div>
        </header>

        <section className="page-heading">
          <div>
            <p className="eyebrow">BUSINESS INTELLIGENCE <span>•</span> LAST 7 DAYS</p>
            <h1>Sales overview</h1>
            <p className="subheading">A clear view of your latest sales performance.</p>
          </div>
          <button className="refresh-button" type="button" onClick={() => setRefreshKey((key) => key + 1)} disabled={isLoading}>
            <span aria-hidden="true">↻</span> {isLoading ? 'Refreshing' : 'Refresh data'}
          </button>
        </section>

        {error && (
          <div className="error-banner" role="alert">
            <span>{error}. Check that the FastAPI server is running.</span>
            <button type="button" onClick={() => setRefreshKey((key) => key + 1)}>Retry</button>
          </div>
        )}

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

        <footer className="page-footer">Fieldnote <span>•</span> Analytics workspace</footer>
      </main>
    </div>
  )
}

export default App
