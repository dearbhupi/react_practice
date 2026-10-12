export type Article = {
  id: string
  title: string
  url: string
  source: string
  author: string
  publishedAt: string
  image: string
  excerpt: string
  category: string
  readTime: string
  style: 'hero' | 'headline' | 'photo' | 'note' | 'compact'
  accent: string
  directLink?: boolean
  videoEmbedUrl?: string
}

export type ArticlePreview = Partial<
  Pick<Article, 'title' | 'excerpt' | 'image' | 'author' | 'category' | 'readTime'>
> & {
  source?: string
  siteName?: string
}

export type StoryPage = {
  articles: Article[]
  date: string
  label: string
}
