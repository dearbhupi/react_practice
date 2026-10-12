import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { articles as editorialArticles, topics } from './data/articles'
import sharedLinksText from '../../data/links.txt?raw'
import { MagazineSpread } from './components/MagazineSpread'
import { PaginationBar } from './components/PaginationBar'
import { ReaderModal } from './components/ReaderModal'
import type { Article } from './types'
import './App.css'

const pageSize = 5
function parseSharedLinks(text: string): Article[] {
  return text.split(/\r?\n/).flatMap((line, lineIndex) => {
    const dateText = line.match(/^\[([^\]]+)\]/)?.[1]
    const links = line.match(/https?:\/\/[^\s<>"']+/g) ?? []

    return links.flatMap((untrimmedUrl, linkIndex) => {
      const cleanUrl = untrimmedUrl.replace(/[),.;]+$/, '')
      let parsedUrl: URL
      try {
        parsedUrl = new URL(cleanUrl)
      } catch {
        return []
      }

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) return []

      const host = parsedUrl.hostname.replace(/^www\./, '')
      const source = host === 'youtu.be' || host.endsWith('youtube.com')
        ? 'YouTube'
        : host.endsWith('facebook.com')
          ? 'Facebook'
          : host === 'x.com'
            ? 'X'
            : host.endsWith('linkedin.com')
              ? 'LinkedIn'
              : host
      const category = source === 'YouTube'
        ? 'Videos'
        : source === 'LinkedIn'
          ? 'Career'
          : source === 'X' || source === 'Facebook'
            ? 'Shared links'
            : /python|morioh/i.test(cleanUrl)
              ? 'Python Programming'
              : 'Shared links'

      const date = dateText ? new Date(dateText.replace(/\u202f/g, ' ')) : new Date(Number.NaN)
      const publishedAt = Number.isNaN(date.valueOf()) ? '2024-01-01' : date.toISOString().slice(0, 10)
      const id = `shared-${lineIndex}-${linkIndex}`
      const videoId = getYouTubeVideoId(parsedUrl)
      const image = videoId
        ? `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`
        : ''
      const title = parsedUrl.href
      const style: Article['style'] = lineIndex % 5 === 0
        ? 'hero'
        : lineIndex % 5 === 1
          ? 'headline'
          : lineIndex % 5 === 2
            ? 'photo'
            : lineIndex % 5 === 3
              ? 'note'
              : 'compact'

      return [{
        id,
        title,
        url: parsedUrl.href,
        source,
        author: 'Saved link',
        publishedAt,
        image,
        excerpt: 'Preview details are not available yet. Open the direct link to view the original post or video.',
        category,
        readTime: source === 'YouTube' ? 'Watch video' : 'Open link',
        style,
        accent: ['#c8d3b3', '#e9c4ad', '#b8d8da', '#d7c7e8', '#ead690'][lineIndex % 5],
        directLink: true,
        videoEmbedUrl: videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` : undefined,
      }]
    })
  })
}

function getYouTubeVideoId(url: URL) {
  if (url.hostname === 'youtu.be') return url.pathname.slice(1).split('/')[0]
  if (url.hostname.endsWith('youtube.com')) {
    return url.pathname.match(/\/(?:shorts|embed|live)\/([^/]+)/)?.[1]
      ?? url.searchParams.get('v')
  }
  return undefined
}

const savedArticles = parseSharedLinks(sharedLinksText)
const initialArticles = [...savedArticles, ...editorialArticles]

function formatDate(date: string) {
  const parsedDate = new Date(`${date}T12:00:00`)
  return Number.isNaN(parsedDate.valueOf())
    ? 'DATE UNKNOWN'
    : parsedDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()
}

function storyFromUrl(url: string): Article {
  const parsedUrl = new URL(url)
  const source = parsedUrl.hostname.replace(/^www\./, '')
  const publisher = source.split('.')[0]
  const publisherName = publisher.charAt(0).toUpperCase() + publisher.slice(1)
  const videoId = getYouTubeVideoId(parsedUrl)
  return {
    id: crypto.randomUUID(),
    title: parsedUrl.href,
    url: parsedUrl.href,
    source,
    author: publisherName,
    publishedAt: new Date().toISOString().slice(0, 10),
    image: videoId ? `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg` : '',
    excerpt: videoId
      ? 'A YouTube video from your collection. Select the preview to play it.'
      : 'Preview details are not available yet. Open the direct link to view the original story.',
    category: 'Your links',
    readTime: 'Open link',
    style: 'compact',
    accent: '#ddd0bd',
    directLink: true,
    videoEmbedUrl: videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` : undefined,
  }
}

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
}

type HeaderProps = {
  categories: string[]
  category: string
  query: string
  searchOpen: boolean
  menuOpen: boolean
  savedCount: number
  onCategory: (category: string) => void
  onQuery: (query: string) => void
  onToggleSearch: () => void
  onToggleMenu: () => void
}

function Header({
  categories,
  category,
  query,
  searchOpen,
  menuOpen,
  savedCount,
  onCategory,
  onQuery,
  onToggleSearch,
  onToggleMenu,
}: HeaderProps) {
  return (
    <header className="topbar">
      <a className="brand" href="#" aria-label="folio home"><BrandMark /><span>folio<span className="brand-period">.</span></span></a>
      <div className="header-center">
        <label className="sr-only" htmlFor="category-picker">Choose a magazine topic</label>
        <select id="category-picker" className="category-picker" value={category} onChange={(event) => onCategory(event.target.value)}>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <span className="category-chevron" aria-hidden="true">⌄</span>
      </div>
      <div className="header-actions">
        {searchOpen && (
          <label className="search-field">
            <span className="sr-only">Search stories</span>
            <input autoFocus type="search" placeholder="Search stories…" value={query} onChange={(event) => onQuery(event.target.value)} />
          </label>
        )}
        <button className={`header-icon-button ${searchOpen ? 'is-active' : ''}`} type="button" aria-label={searchOpen ? 'Close search' : 'Search stories'} aria-expanded={searchOpen} onClick={onToggleSearch}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3" /><path d="m15.5 15.5 4.2 4.2" /></svg>
        </button>
        <button className={`header-icon-button menu-toggle ${menuOpen ? 'is-active' : ''}`} type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={onToggleMenu}>
          {menuOpen ? <span className="close-glyph">×</span> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>}
        </button>
      </div>
      {menuOpen && (
        <nav className="menu-popover" aria-label="Magazine menu">
          <p>YOUR MAGAZINE</p>
          {categories.map((item) => (
            <button type="button" className={category === item ? 'is-current' : ''} key={item} onClick={() => onCategory(item)}>
              <span>{item}</span>
              {item === 'Saved' && <span className="menu-count">{savedCount}</span>}
            </button>
          ))}
        </nav>
      )}
    </header>
  )
}

function AddLinkForm({ onAdd }: { onAdd: (article: Article) => void }) {
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const parsedUrl = new URL(url.trim())
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        setMessage('Please use a link that starts with http:// or https://')
        return
      }
      onAdd(storyFromUrl(parsedUrl.href))
      setUrl('')
      setMessage('Added to your magazine!')
    } catch {
      setMessage('That link does not look quite right yet.')
    }
  }

  return (
    <section className="add-link-panel">
      <div className="add-link-copy"><span className="add-link-plus">＋</span><div><h2>Bring a good read</h2><p>Add a link from anywhere on the web.</p></div></div>
      <form className="add-link-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="article-url">Paste an article URL</label>
        <input id="article-url" type="url" placeholder="Paste a story link…" value={url} onChange={(event) => { setUrl(event.target.value); setMessage('') }} required />
        <button type="submit">Add to magazine <span aria-hidden="true">↗</span></button>
        {message && <span className="add-link-message" role="status">{message}</span>}
      </form>
    </section>
  )
}

function App() {
  const [allArticles, setAllArticles] = useState(initialArticles)
  const [category, setCategory] = useState('For You')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set())
  const [activeArticle, setActiveArticle] = useState<Article | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const categories = useMemo(() => [
    'For You',
    ...new Set(allArticles.map((article) => article.category)),
    'Saved',
  ], [allArticles])

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return allArticles.filter((article) => {
      const matchesCategory = category === 'For You'
        || (category === 'Saved' ? savedIds.has(article.id) : article.category === category)
      const matchesSearch = !normalizedQuery
        || `${article.title} ${article.excerpt} ${article.source} ${article.author} ${article.category}`.toLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesSearch
    })
  }, [allArticles, category, query, savedIds])

  const pageCount = Math.max(1, Math.ceil(filteredArticles.length / pageSize))
  const activePage = Math.min(page, pageCount - 1)
  const pageArticles = filteredArticles.slice(activePage * pageSize, (activePage + 1) * pageSize)
  const pageDates = Array.from({ length: pageCount }, (_, index) => {
    const article = filteredArticles[index * pageSize]
    return article ? formatDate(article.publishedAt) : '—'
  })

  const closeReader = useCallback(() => setActiveArticle(null), [])

  useEffect(() => {
    if (!announcement) return
    const timeout = window.setTimeout(() => setAnnouncement(''), 2800)
    return () => window.clearTimeout(timeout)
  }, [announcement])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (activeArticle) return
      if (event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
        if (event.key === 'Escape' && searchOpen) setSearchOpen(false)
        return
      }
      if (event.key === 'ArrowRight') setPage((current) => Math.min(current + 1, pageCount - 1))
      if (event.key === 'ArrowLeft') setPage((current) => Math.max(current - 1, 0))
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeArticle, pageCount, searchOpen])

  function chooseCategory(nextCategory: string) {
    setCategory(nextCategory)
    setPage(0)
    setMenuOpen(false)
  }

  function toggleSaved(article: Article) {
    const wasSaved = savedIds.has(article.id)
    setSavedIds((current) => {
      const next = new Set(current)
      if (wasSaved) next.delete(article.id)
      else next.add(article.id)
      return next
    })
    setAnnouncement(wasSaved ? 'Removed from your saved stories.' : 'Saved to your magazine.')
  }

  async function shareArticle(article: Article) {
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url: article.url })
      } else {
        await navigator.clipboard.writeText(article.url)
        setAnnouncement('Story link copied to clipboard.')
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setAnnouncement('Could not share this link. You can copy it from the address bar.')
    }
  }

  function addArticle(article: Article) {
    setAllArticles((current) => [article, ...current])
    setSavedIds((current) => new Set(current).add(article.id))
    setCategory('Your links')
    setQuery('')
    setPage(0)
    setAnnouncement('Your link was added to the magazine.')
  }

  function handleTouchStart(event: React.TouchEvent<HTMLElement>) {
    const touch = event.touches[0]
    if (touch) touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLElement>) {
    const start = touchStart.current
    const touch = event.changedTouches[0]
    touchStart.current = null
    if (!start || !touch) return

    const horizontalDistance = touch.clientX - start.x
    const verticalDistance = touch.clientY - start.y
    if (Math.abs(horizontalDistance) < 55 || Math.abs(horizontalDistance) < Math.abs(verticalDistance) * 1.3) return
    setPage((current) => Math.max(0, Math.min(current + (horizontalDistance < 0 ? 1 : -1), pageCount - 1)))
  }

  return (
    <div className="app-frame min-h-screen bg-stone-100 text-stone-900">
      <Header
        categories={categories}
        category={category}
        query={query}
        searchOpen={searchOpen}
        menuOpen={menuOpen}
        savedCount={savedIds.size}
        onCategory={chooseCategory}
        onQuery={(nextQuery) => { setQuery(nextQuery); setPage(0) }}
        onToggleSearch={() => { setSearchOpen((open) => !open); setMenuOpen(false) }}
        onToggleMenu={() => { setMenuOpen((open) => !open); setSearchOpen(false) }}
      />

      <main>
        <section className="intro-row">
          <div>
            <p className="eyebrow"><span aria-hidden="true">✳</span> THE WORLD, IN YOUR POCKET</p>
            <h1>Good stories.<br /><span>Fresh perspective.</span></h1>
          </div>
          <p className="intro-aside">A magazine of ideas, people, and places worth discovering. Follow a curiosity, find a new one.</p>
        </section>

        <section className="edition-heading" aria-live="polite">
          <div><p className="edition-kicker">YOUR PERSONAL EDITION</p><h2>{category}</h2></div>
          <span>{filteredArticles.length} {filteredArticles.length === 1 ? 'STORY' : 'STORIES'} <i /> PAGE {activePage + 1} OF {pageCount}</span>
        </section>

        <MagazineSpread
          articles={pageArticles}
          topics={topics}
          savedIds={savedIds}
          onOpen={setActiveArticle}
          onSave={toggleSaved}
          onShare={shareArticle}
          onTopic={chooseCategory}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />

        <PaginationBar
          page={activePage}
          pageCount={pageCount}
          pageDates={pageDates}
          onSelect={(nextPage) => setPage(nextPage)}
          onPrevious={() => setPage((current) => Math.max(current - 1, 0))}
          onNext={() => setPage((current) => Math.min(current + 1, pageCount - 1))}
        />

        <AddLinkForm onAdd={addArticle} />
      </main>

      <footer className="site-footer">
        <span className="footer-brand">folio<span>.</span> <i>Stories worth turning pages for.</i></span>
        <span>MADE FOR THE JOY OF DISCOVERY <b aria-hidden="true">✳</b></span>
      </footer>

      {activeArticle && (
        <ReaderModal
          key={activeArticle.id}
          article={activeArticle}
          saved={savedIds.has(activeArticle.id)}
          onClose={closeReader}
          onSave={toggleSaved}
          onShare={shareArticle}
        />
      )}
      {announcement && <div className="toast-message" role="status">{announcement}</div>}
    </div>
  )
}

export default App
