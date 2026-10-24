import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Maximize2,
  Minus,
  Plus,
  X,
} from 'lucide-react'

const MIN_SCALE = 1
const MAX_SCALE = 4
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

/**
 * Full-screen viewer with real zoom: wheel (or trackpad pinch), the +/-
 * buttons, double-click to toggle, and drag to pan once zoomed in.
 */
export default function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
  saved,
  onToggleSave,
}) {
  const photo = photos[index]
  const stageRef = useRef(null)
  const dragRef = useRef(null)

  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [fullLoaded, setFullLoaded] = useState(false)

  // Reset the view whenever the photo changes.
  useEffect(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
    setFullLoaded(false)
  }, [photo.id])

  // Lock background scrolling while the viewer is open.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  /** Zoom while keeping the point under the cursor fixed. */
  const zoomTo = useCallback(
    (nextScale, clientX, clientY) => {
      const stage = stageRef.current
      if (!stage) return
      const target = clamp(nextScale, MIN_SCALE, MAX_SCALE)
      const rect = stage.getBoundingClientRect()
      const originX = clientX ?? rect.left + rect.width / 2
      const originY = clientY ?? rect.top + rect.height / 2
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      setScale((current) => {
        if (Math.abs(target - 1) < 0.001) {
          setOffset({ x: 0, y: 0 })
          return 1
        }
        setOffset((o) => {
          const px = originX - cx - o.x
          const py = originY - cy - o.y
          const ratio = target / current
          return {
            x: clamp(o.x - px * (ratio - 1), -1200, 1200),
            y: clamp(o.y - py * (ratio - 1), -1200, 1200),
          }
        })
        return target
      })
    },
    [],
  )

  // Wheel needs a non-passive listener so the page doesn't scroll underneath.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const onWheel = (event) => {
      event.preventDefault()
      const factor = Math.exp(-event.deltaY * 0.0015)
      zoomTo(scale * factor, event.clientX, event.clientY)
    }

    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [scale, zoomTo])

  // Keyboard shortcuts.
  useEffect(() => {
    const onKeyDown = (event) => {
      switch (event.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          onNavigate(-1)
          break
        case 'ArrowRight':
          onNavigate(1)
          break
        case '+':
        case '=':
          zoomTo(scale + 0.5)
          break
        case '-':
        case '_':
          zoomTo(scale - 0.5)
          break
        case '0':
          zoomTo(1)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, onNavigate, scale, zoomTo])

  const handlePointerDown = (event) => {
    if (scale <= 1) return
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    }
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    const drag = dragRef.current
    if (!drag) return
    setOffset({
      x: clamp(drag.originX + event.clientX - drag.startX, -1400, 1400),
      y: clamp(drag.originY + event.clientY - drag.startY, -1400, 1400),
    })
  }

  const endDrag = () => {
    dragRef.current = null
    setDragging(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.title} — zoom view`}
      className="fixed inset-0 z-50 flex flex-col bg-ink/95 backdrop-blur-xl"
    >
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{photo.title}</p>
          <p className="truncate text-xs text-white/50">
            {photo.tag} · {photo.author} · {index + 1} / {photos.length}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <IconButton
            label={saved ? 'Remove from saved' : 'Save photo'}
            onClick={onToggleSave}
            active={saved}
          >
            <Heart className="size-4" fill={saved ? 'currentColor' : 'none'} />
          </IconButton>
          <a
            href={photo.full}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white sm:block"
            aria-label="Open full-resolution image in a new tab"
          >
            <Maximize2 className="size-4" />
          </a>
          <IconButton label="Close zoom view" onClick={onClose}>
            <X className="size-4" />
          </IconButton>
        </div>
      </header>

      {/* Stage */}
      <div
        ref={stageRef}
        onDoubleClick={(event) =>
          zoomTo(scale > 1 ? 1 : 2.5, event.clientX, event.clientY)
        }
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`relative flex flex-1 items-center justify-center overflow-hidden px-2 sm:px-10 ${
          scale > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
        }`}
      >
        <img
          key={photo.id}
          src={photo.full}
          alt={photo.alt}
          draggable={false}
          onLoad={() => setFullLoaded(true)}
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
            transition: dragging ? 'none' : 'transform 260ms cubic-bezier(0.22,1,0.36,1)',
          }}
          className={`max-h-full max-w-full select-none rounded-lg object-contain shadow-2xl ${
            fullLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {!fullLoaded && (
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-xs tracking-[0.2em] text-white/40 uppercase">
              Loading
            </span>
          </div>
        )}

        <NavButton
          side="left"
          label="Previous photo"
          onClick={() => onNavigate(-1)}
        />
        <NavButton side="right" label="Next photo" onClick={() => onNavigate(1)} />
      </div>

      {/* Bottom bar */}
      <footer className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="hidden text-[11px] tracking-wide text-white/40 sm:block">
          Scroll or double-click to zoom · drag to pan · ← → to browse
        </p>

        <div className="ml-auto flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          <IconButton
            label="Zoom out"
            onClick={() => zoomTo(scale - 0.5)}
            disabled={scale <= MIN_SCALE}
          >
            <Minus className="size-4" />
          </IconButton>
          <button
            type="button"
            onClick={() => zoomTo(1)}
            className="w-14 rounded-full py-1 text-center text-xs font-medium tabular-nums text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Reset zoom to 100 percent"
          >
            {Math.round(scale * 100)}%
          </button>
          <IconButton
            label="Zoom in"
            onClick={() => zoomTo(scale + 0.5)}
            disabled={scale >= MAX_SCALE}
          >
            <Plus className="size-4" />
          </IconButton>
        </div>
      </footer>
    </div>
  )
}

function IconButton({ children, label, onClick, disabled, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`grid size-9 place-items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? 'bg-accent text-ink'
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

function NavButton({ side, label, onClick }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      aria-label={label}
      className={`absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/45 text-white/80 backdrop-blur-md transition hover:bg-black/75 hover:text-white ${
        side === 'left' ? 'left-2 sm:left-4' : 'right-2 sm:right-4'
      }`}
    >
      <Icon className="size-5" />
    </button>
  )
}
