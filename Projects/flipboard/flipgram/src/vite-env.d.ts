/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LINK_PREVIEW_API?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
