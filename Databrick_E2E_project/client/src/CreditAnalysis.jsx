import { useEffect, useState } from 'react'

const amount = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const percent = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 })

function CreditAnalysis({ refreshKey }) {
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadAnalysis() {
      setIsLoading(true)
      setError('')
      try {
        const response = await fetch('/api/v1/credit-analysis', { signal: controller.signal })
        if (!response.ok) throw new Error(`Credit analysis request failed (${response.status})`)
        setAnalysis(await response.json())
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    loadAnalysis()
    return () => controller.abort()
  }, [refreshKey])

  if (isLoading && !analysis) return <div className="credit-loading">Loading credit analysis…</div>
  if (error && !analysis) {
    return <div className="error-banner credit-error" role="alert">{error}. Check the FastAPI service and credit Gold tables.</div>
  }

  const summary = analysis.summary

  return (
    <>
      <p className="credit-disclaimer">Historical labels only. This descriptive dataset analysis is not a credit score, lending recommendation, or decision system.</p>
      {error && <div className="error-banner credit-error" role="alert">Refresh failed: {error}</div>}
      <section className="credit-metrics" aria-label="Credit dataset summary">
        <article className="credit-metric"><span>Applications</span><strong>{summary.application_count.toLocaleString()}</strong></article>
        <article className="credit-metric"><span>Historical bad labels</span><strong>{percent.format(summary.bad_rate)}</strong></article>
        <article className="credit-metric"><span>Average credit amount</span><strong>{amount.format(summary.avg_credit_amount)}</strong></article>
        <article className="credit-metric"><span>Average duration</span><strong>{summary.avg_duration.toFixed(1)} mo</strong></article>
      </section>

      <section className="credit-analysis-grid" aria-label="Historical risk breakdowns">
        <article className="credit-panel">
          <div className="credit-panel-heading">
            <div><p className="eyebrow">HISTORICAL LABEL RATE</p><h2>By loan purpose</h2></div>
            <span>Bad labels / applications</span>
          </div>
          <div className="risk-list">
            {analysis.by_purpose.map((item) => (
              <div className="risk-row" key={item.purpose}>
                <div className="risk-row-heading">
                  <span className="risk-purpose">{item.purpose}</span>
                  <span className="risk-value">{percent.format(item.bad_rate)}</span>
                </div>
                <div className="risk-track"><div className="risk-fill" style={{ width: `${Math.min(item.bad_rate * 100, 100)}%` }} /></div>
                <div className="risk-row-meta"><span>{item.bad_count} bad labels</span><span>{item.application_count} applications</span></div>
              </div>
            ))}
          </div>
        </article>

        <article className="credit-panel">
          <div className="credit-panel-heading">
            <div><p className="eyebrow">HISTORICAL LABEL RATE</p><h2>By loan duration</h2></div>
          </div>
          <div className="duration-list">
            {analysis.by_duration.map((item) => (
              <div className="duration-row" key={item.duration_band}>
                <span className="duration-name">{item.duration_band}</span>
                <span className="duration-rate">{percent.format(item.bad_rate)}</span>
                <span className="duration-count">{item.bad_count} bad labels · {item.application_count} applications</span>
              </div>
            ))}
          </div>
        </article>
      </section>
      <div className="credit-source">{analysis.source === 'databricks' ? 'Databricks Gold tables' : 'Demo data'} · updated {new Date(analysis.updated_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
    </>
  )
}

export default CreditAnalysis