import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Heart, Search, X } from 'lucide-react'
import { photos, tags } from './data/photos'
import PhotoCard from './components/PhotoCard'
import Lightbox from './components/Lightbox'

const SAVED_KEY = 'lumen:saved'
const FILTERS = ['All', ...tags]

/** Column count for the pinboard, based on the available width. */
function useColumnCount(ref) {
  const [count, setCount] = useState(3)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      setCount(width >= 1480 ? 4 : width >= 1024 ? 3 : width >= 620 ? 2 : 1)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return count
}

export default function App() {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [showSaved, setShowSaved] = useState(false)
  const [openIndex, setOpenIndex] = useState(null)
  const [saved, setSaved] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(SAVED_KEY)) ?? [])
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify([...saved]))
    } catch {
      // Private mode / storage disabled — saving simply won't persist.
    }
  }, [saved])

  const toggleSave = useCallback((id) => {
    setSaved((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return photos.filter((photo) => {
      if (showSaved && !saved.has(photo.id)) return false
      if (activeTag !== 'All' && photo.tag !== activeTag) return false
      if (!q) return true
      return `${photo.title} ${photo.tag} ${photo.author}`
        .toLowerCase()
        .includes(q)
    })
  }, [query, activeTag, showSaved, saved])

  // Place each photograph in the currently shortest column. Using the known
  // aspect ratios means no measuring and no layout shift, and the visual order
  // still reads left to right.
  const gridRef = useRef(null)
  const columnCount = useColumnCount(gridRef)
  const columns = useMemo(() => {
    const buckets = Array.from({ length: columnCount }, () => [])
    const heights = new Array(columnCount).fill(0)

    visible.forEach((photo, index) => {
      let shortest = 0
      for (let i = 1; i < columnCount; i += 1) {
        if (heights[i] < heights[shortest]) shortest = i
      }
      buckets[shortest].push({ photo, index })
      heights[shortest] += photo.height / photo.width
    })

    return buckets
  }, [visible, columnCount])

  const closeLightbox = useCallback(() => setOpenIndex(null), [])

  const navigate = useCallback(
    (direction) => {
      setOpenIndex((current) => {
        if (current === null || visible.length === 0) return current
        return (current + direction + visible.length) % visible.length
      })
    },
    [visible.length],
  )

  const activePhoto = openIndex === null ? null : visible[openIndex]
  const savedCount = saved.size
  const filtering = showSaved || activeTag !== 'All' || query.trim() !== ''

  const resetFilters = () => {
    setQuery('')
    setActiveTag('All')
    setShowSaved(false)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1680px] items-center gap-3 px-4 py-3 sm:gap-6 sm:px-8">
          <a href="#top" className="group flex shrink-0 items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-accent text-[13px] font-semibold text-ink transition-transform duration-500 group-hover:rotate-6">
              L
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-lg tracking-tight text-white">
                Lumen
              </span>
              <span className="mt-0.5 text-[10px] tracking-[0.22em] text-white/40 uppercase">
                Photo pinboard
              </span>
            </span>
          </a>

          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/35" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, moods, photographers…"
              aria-label="Search photographs"
              className="w-full rounded-full border border-line bg-surface py-2.5 pr-10 pl-10 text-sm text-white placeholder:text-white/35 transition focus:border-white/25 focus:bg-surface-2 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowSaved((value) => !value)}
            aria-pressed={showSaved}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition ${
              showSaved
                ? 'border-accent/50 bg-accent text-ink'
                : 'border-line bg-surface text-white/75 hover:border-white/20 hover:text-white'
            }`}
          >
            <Heart className="size-4" fill={showSaved ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">Saved</span>
            <span className="tabular-nums opacity-60">{savedCount}</span>
          </button>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-[1680px] px-4 sm:px-8">
        <section className="pt-10 pb-6 sm:pt-16 sm:pb-8">
          <p className="text-[11px] tracking-[0.28em] text-accent/80 uppercase">
            100 photographs · 8 moods
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight text-white sm:text-6xl">
            A hundred ways of looking at the world.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
            An endless pinboard that leans in when you hover and opens all the
            way when you click. Save what stays with you.
          </p>
        </section>

        <nav
          aria-label="Filter by mood"
          className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {FILTERS.map((tag) => {
            const active = activeTag === tag
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                aria-pressed={active}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-[13px] transition ${
                  active
                    ? 'border-white bg-white text-ink'
                    : 'border-line bg-surface text-white/60 hover:border-white/25 hover:text-white'
                }`}
              >
                {tag}
              </button>
            )
          })}
        </nav>

        <div className="mb-4 flex items-center justify-between text-xs text-white/40">
          <p aria-live="polite" className="tabular-nums">
            {visible.length} {visible.length === 1 ? 'photograph' : 'photographs'}
            {filtering && ` of ${photos.length}`}
          </p>
          {filtering && (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full px-2 py-1 text-white/50 transition hover:bg-white/5 hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>

        {visible.length > 0 ? (
          <div ref={gridRef} className="flex items-start gap-4">
            {columns.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className="flex min-w-0 flex-1 flex-col gap-4"
              >
                {column.map(({ photo, index }) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onOpen={() => setOpenIndex(index)}
                    saved={saved.has(photo.id)}
                    onToggleSave={() => toggleSave(photo.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid place-items-center rounded-3xl border border-dashed border-line py-24 text-center">
            <p className="font-display text-2xl text-white">Nothing pinned here yet</p>
            <p className="mt-2 max-w-sm px-6 text-sm text-white/45">
              {showSaved
                ? 'Tap the heart on any photograph to keep it here.'
                : 'No photograph matches that search. Try a different mood.'}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-full bg-white px-5 py-2 text-sm font-medium text-ink transition hover:bg-accent"
            >
              Show the whole collection
            </button>
          </div>
        )}

        <footer className="mt-16 flex flex-col gap-2 border-t border-line/70 py-8 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>Lumen · a demo collection of placeholder photography.</p>
          <p className="tracking-wide">
            Swap in your own 100 photos in{' '}
            <code className="text-white/50">src/data/photos.js</code>
          </p>
        </footer>
      </main>

      {activePhoto && (
        <Lightbox
          photos={visible}
          index={openIndex}
          onClose={closeLightbox}
          onNavigate={navigate}
          saved={saved.has(activePhoto.id)}
          onToggleSave={() => toggleSave(activePhoto.id)}
        />
      )}
    </div>
  )
}
