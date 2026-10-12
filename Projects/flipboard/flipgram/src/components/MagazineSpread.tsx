import type { Article } from '../types'
import { ArticleCard } from './ArticleCard'
import type { TouchEventHandler } from 'react'

type Topic = { name: string; category: string; image: string }

type MagazineSpreadProps = {
  articles: Article[]
  topics: Topic[]
  savedIds: Set<string>
  onOpen: (article: Article) => void
  onSave: (article: Article) => void
  onShare: (article: Article) => void
  onTopic: (category: string) => void
  onTouchStart: TouchEventHandler<HTMLDivElement>
  onTouchEnd: TouchEventHandler<HTMLDivElement>
}

export function MagazineSpread({ articles, topics, savedIds, onOpen, onSave, onShare, onTopic, onTouchStart, onTouchEnd }: MagazineSpreadProps) {
  return (
    <div className="spread" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="spread-topline">
        <span><span className="live-dot" /> THE DAILY EDIT</span>
        <span>IDEAS TO KEEP YOU TURNING PAGES</span>
      </div>
      {articles.length > 0 ? (
        <section className="article-grid" aria-label="Stories in this magazine spread">
          {articles.map((article) => (
            <ArticleCard
              article={article}
              key={article.id}
              saved={savedIds.has(article.id)}
              onOpen={onOpen}
              onSave={onSave}
              onShare={onShare}
            />
          ))}
        </section>
      ) : (
        <section className="empty-spread">
          <span aria-hidden="true">✳</span>
          <h2>No stories on this page just yet.</h2>
          <p>Try another topic or add a link to your magazine.</p>
        </section>
      )}
      <section className="topic-section" aria-label="Explore topics">
        <div className="topic-heading"><span>KEEP EXPLORING</span><span className="topic-rule" /></div>
        <div className="topic-grid">
          {topics.map((topic) => (
            <button className="topic-tile" type="button" key={topic.name} onClick={() => onTopic(topic.category)} style={{ '--topic-image': `url("${topic.image}")` } as React.CSSProperties}>
              <span>{topic.name}</span><span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
