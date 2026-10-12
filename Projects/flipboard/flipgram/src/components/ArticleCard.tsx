import type { Article } from '../types'
import { useArticlePreview } from '../hooks/useArticlePreview'

type ArticleCardProps = {
  article: Article
  saved: boolean
  onOpen: (article: Article) => void
  onSave: (article: Article) => void
  onShare: (article: Article) => void
}

export function ArticleCard({ article, saved, onOpen, onSave, onShare }: ArticleCardProps) {
  const { article: preview } = useArticlePreview(article)
  const articleClasses = [
    `article-card--${article.style}`,
    article.directLink ? 'article-card--direct-link' : '',
    article.directLink && preview.title === article.url ? 'article-card--url-fallback' : '',
  ].filter(Boolean).join(' ')
  const cardContent = (
    <>
      {preview.image && (preview.style !== 'note' || preview.videoEmbedUrl) && <img className="article-image" src={preview.image} alt="" loading="lazy" />}
      {preview.style === 'headline' && <span className="headline-decoration" aria-hidden="true">✳</span>}
      {preview.style === 'note' && !preview.videoEmbedUrl && <span className="note-decoration" aria-hidden="true">“</span>}
      <span className="article-content">
        <span className="article-category">{preview.category}</span>
        <span className="article-title">{preview.title}</span>
        <span className="article-excerpt">{preview.excerpt}</span>
        <span className="article-meta">
          <span>{preview.source}</span><i />{preview.author}
        </span>
      </span>
    </>
  )

  return (
    <article className={`article-card ${articleClasses}`} style={{ '--article-accent': article.accent } as React.CSSProperties}>
      {preview.videoEmbedUrl
        ? <button className="article-open" type="button" onClick={() => onOpen(preview)} aria-label={`Play YouTube video: ${preview.title}`}>{cardContent}</button>
        : <a className="article-open" href={preview.url} target="_blank" rel="noreferrer" aria-label={`Open story from ${preview.source} in a new tab: ${preview.title}`}>{cardContent}</a>}
      <div className="article-actions" aria-label={`Actions for ${preview.title}`}>
        <button type="button" className={`icon-button ${saved ? 'is-saved' : ''}`} aria-label={saved ? 'Remove bookmark' : 'Add to magazine'} title={saved ? 'Remove bookmark' : 'Add to magazine'} onClick={() => onSave(preview)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.75A1.75 1.75 0 0 1 7.75 3h8.5A1.75 1.75 0 0 1 18 4.75V21l-6-4-6 4V4.75Z" /></svg>
        </button>
        <button type="button" className="icon-button" aria-label="Share article" title="Share article" onClick={() => onShare(preview)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" /></svg>
        </button>
      </div>
    </article>
  )
}
