import { useEffect, useState } from 'react'
import type { Article, ArticlePreview } from '../types'

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readString(record: Record<string, unknown>, key: string) {
  return typeof record[key] === 'string' ? record[key] : undefined
}

export function useArticlePreview(article: Article) {
  const [result, setResult] = useState<{ id: string; preview: ArticlePreview } | null>(null)
  const [failure, setFailure] = useState<{ id: string; message: string } | null>(null)
  const endpoint = import.meta.env.VITE_LINK_PREVIEW_API

  useEffect(() => {
    if (!endpoint) return

    const controller = new AbortController()
    const separator = endpoint.includes('?') ? '&' : '?'

    fetch(`${endpoint}${separator}url=${encodeURIComponent(article.url)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Preview service responded with ${response.status}.`)
        const payload: unknown = await response.json()
        if (!isObject(payload)) throw new Error('Preview service returned an invalid response.')

        return {
          title: readString(payload, 'title'),
          excerpt: readString(payload, 'excerpt') ?? readString(payload, 'description'),
          image: readString(payload, 'image'),
          author: readString(payload, 'author'),
          source: readString(payload, 'source') ?? readString(payload, 'siteName'),
          category: readString(payload, 'category'),
          readTime: readString(payload, 'readTime'),
        } satisfies ArticlePreview
      })
      .then((preview) => setResult({ id: article.id, preview }))
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return
        const message = reason instanceof Error ? reason.message : 'The preview could not be refreshed.'
        setFailure({ id: article.id, message })
      })

    return () => controller.abort()
  }, [article.id, article.url, endpoint])

  const preview = result?.id === article.id ? result.preview : {}
  const error = failure?.id === article.id ? failure.message : ''
  const loading = Boolean(endpoint) && result?.id !== article.id && failure?.id !== article.id

  return {
    article: {
      ...article,
      ...preview,
    },
    loading,
    error,
  }
}
