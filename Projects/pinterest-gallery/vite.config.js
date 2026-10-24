import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative base keeps the built site working from any sub-path
  // (GitHub Pages project sites, Cloudflare Pages, Netlify, ...).
  base: './',
})
