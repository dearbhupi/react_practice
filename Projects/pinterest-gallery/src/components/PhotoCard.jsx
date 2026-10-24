import { useState } from 'react'
import { Heart } from 'lucide-react'

/**
 * One pin. Hovering leans the photograph in (scale + slow easing); clicking
 * opens the zoomable lightbox.
 */
export default function PhotoCard({ photo, onOpen, saved, onToggleSave }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <figure
      className="group relative isolate overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_18px_40px_-30px_rgba(0,0,0,0.9)] transition-colors duration-500 hover:border-line"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${photo.title} in the zoom view`}
        className="block w-full cursor-zoom-in"
      >
        <div
          className="w-full overflow-hidden bg-surface-2"
          style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover transition-[transform,opacity,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.08] ${
              loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
            }`}
          />
        </div>
      </button>

      {/* Hover wash + caption */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-sm font-medium tracking-tight text-white">
          {photo.title}
        </p>
        <p className="mt-0.5 text-xs text-white/60">
          {photo.tag} · {photo.author}
        </p>
      </figcaption>

      <button
        type="button"
        onClick={onToggleSave}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${photo.title} from saved` : `Save ${photo.title}`}
        className={`absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full backdrop-blur-md transition-all duration-300 ${
          saved
            ? 'bg-accent text-ink opacity-100'
            : 'bg-black/45 text-white opacity-0 hover:bg-black/70 group-hover:opacity-100 focus-visible:opacity-100'
        }`}
      >
        <Heart
          className="size-4"
          strokeWidth={2}
          fill={saved ? 'currentColor' : 'none'}
        />
      </button>
    </figure>
  )
}
