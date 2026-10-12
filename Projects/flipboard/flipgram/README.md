# folio. — a little reading magazine

A responsive React, TypeScript, and Tailwind CSS magazine reader. Flip through
the links in `../data/links.txt`, browse the sample editorial cards, filter by
topic, save stories, or add a URL to your issue.

## Run locally

```sh
npm install
npm run dev
```

Useful checks:

```sh
npm run build
npm run lint
```

## Link preview API

Links from `../data/links.txt` are included as saved stories; where the source
file has no title, the magazine shows a transparent publisher-based fallback.
The editorial sample cards use local mock metadata so the magazine works
without a backend. Browsers cannot reliably fetch Open Graph tags from arbitrary
publisher sites because of cross-origin restrictions. To load real metadata,
set
`VITE_LINK_PREVIEW_API` to a same-origin server or serverless endpoint that
accepts a `url` query parameter:

```sh
VITE_LINK_PREVIEW_API=/api/link-preview npm run dev
```

The endpoint should return JSON with this shape:

```json
{
  "title": "Article title",
  "description": "A short article summary.",
  "image": "https://publisher.example/article-image.jpg",
  "author": "Author name",
  "siteName": "Publisher",
  "category": "FEATURE",
  "readTime": "5 min read"
}
```

The metadata request runs for visible cards and when a reader opens a story.
Without the service, shared-link cards show the direct URL instead of an
invented title. Fields are optional; any missing values keep the story's saved
fallback. The API endpoint must validate and safely fetch URLs server-side (including
restricting private-network and non-HTTP targets) before scraping metadata.
Preview-service failures are shown in the reader while the saved preview stays
available.

Story cards open the original source in a new tab. YouTube cards use the
video's public thumbnail and open an embedded player; YouTube metadata and
non-YouTube social preview images require the configured preview API.
