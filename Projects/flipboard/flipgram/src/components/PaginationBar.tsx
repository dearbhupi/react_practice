type PaginationBarProps = {
  page: number
  pageCount: number
  pageDates: string[]
  onSelect: (page: number) => void
  onPrevious: () => void
  onNext: () => void
}

export function PaginationBar({ page, pageCount, pageDates, onSelect, onPrevious, onNext }: PaginationBarProps) {
  return (
    <nav className="pagination-bar" aria-label="Magazine pages">
      <button className="timeline-label timeline-label-latest" type="button" onClick={() => onSelect(0)} aria-label="Go to latest stories">
        <span className="timeline-dot" />LATEST
      </button>
      <button className="timeline-arrow" type="button" onClick={onPrevious} aria-label="Previous page" disabled={page === 0}>←</button>
      <div className="timeline-track" style={{ '--page-count': pageCount } as React.CSSProperties}>
        <div className="timeline-line"><span style={{ width: `${pageCount > 1 ? (page / (pageCount - 1)) * 100 : 0}%` }} /></div>
        <div className="timeline-markers">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              className={`timeline-marker ${page === index ? 'is-active' : ''}`}
              type="button"
              key={index}
              aria-label={`Go to page ${index + 1}, ${pageDates[index] ?? ''}`}
              aria-current={page === index ? 'page' : undefined}
              onClick={() => onSelect(index)}
            >
              <span />
            </button>
          ))}
        </div>
        <div className="timeline-dates">
          {pageDates.map((date, index) => <span className={index === page ? 'is-active' : ''} key={`${date}-${index}`}>{date}</span>)}
        </div>
      </div>
      <button className="timeline-arrow" type="button" onClick={onNext} aria-label="Next page" disabled={page === pageCount - 1}>→</button>
      <span className="timeline-label timeline-label-end">{pageDates[pageCount - 1] ?? ''}</span>
    </nav>
  )
}
