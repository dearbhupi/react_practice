import { useEffect } from 'react'
import type { Article } from '../types'
import { useArticlePreview } from '../hooks/useArticlePreview'

type ReaderModalProps = {
  article: Article
  saved: boolean
  onClose: () => void
  onSave: (article: Article) => void
  onShare: (article: Article) => void
}

export function ReaderModal({ article, saved, onClose, onSave, onShare }: ReaderModalProps) {
  const { article: story, loading, error } = useArticlePreview(article)

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <div className="reader-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <article className="reader-modal" role="dialog" aria-modal="true" aria-labelledby="reader-title">
        <div className="reader-modal-topbar">
          <span className="reader-modal-brand">folio<span>.</span></span>
          <div className="reader-modal-actions">
            <button type="button" className={`modal-icon-button ${saved ? 'is-saved' : ''}`} aria-label={saved ? 'Remove bookmark' : 'Save article'} onClick={() => onSave(article)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4V4.75Z" /></svg>
            </button>
            <button type="button" className="modal-icon-button" aria-label="Share article" onClick={() => onShare(article)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" /></svg>
            </button>
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close article">×</button>
          </div>
        </div>
        <div className="reader-modal-scroll">
          {story.videoEmbedUrl
            ? <div className="reader-modal-player"><iframe src={`${story.videoEmbedUrl}?autoplay=1&rel=0`} title={`Play ${story.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
            : <img className="reader-modal-image" src={story.image} alt="" />}
          <div className="reader-modal-copy">
            <div className="reader-modal-meta"><span>{story.category}</span><i />{story.readTime}{loading && <small>UPDATING PREVIEW</small>}</div>
            <h2 id="reader-title">{story.title}</h2>
            <div className="reader-byline">
              <span className="byline-monogram">{story.author.charAt(0)}</span>
              <div><strong>{story.author}</strong><span>{story.source} · {new Date(story.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span></div>
            </div>
            <p className="reader-modal-excerpt">{story.excerpt}</p>
            <p className="reader-modal-body">{story.videoEmbedUrl
              ? 'The video is ready to watch above, or open the original YouTube link to view it there.'
              : `Continue reading on ${story.source} for the complete story.`}</p>
            {error && <p className="reader-preview-error" role="status">Showing the saved preview. {error}</p>}
            <a className="reader-source-link" href={story.url} target="_blank" rel="noreferrer">{story.videoEmbedUrl ? 'Open on YouTube' : `Read the full story at ${story.source}`}<span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </article>
    </div>
  )
}
