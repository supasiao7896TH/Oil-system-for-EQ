/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
// PWA is only wired up here (the Netlify-hosted build) — it needs a real HTTPS
// origin for the service worker to register at all, so it's meaningless for the
// vite.single.config.ts standalone/file:// build, which gets its offline support
// a different way (everything inlined into one file, no service worker involved).
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'OilMate — ผู้ช่วยงานหล่อลื่น GC-M PTA',
        short_name: 'OilMate',
        description: 'ผู้ช่วยค้นหาสารหล่อลื่นและจุดหล่อลื่นของอุปกรณ์ในโรงงาน GC-M PTA',
        lang: 'th',
        theme_color: '#0f766e',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Small, fully self-contained app (data is bundled into the JS, not fetched
        // separately) — precache everything so it works fully offline after one visit.
        globPatterns: ['**/*.{js,css,html,woff2,png,svg}'],
      },
    }),
  ],
  test: {
    environment: 'node',
  },
})
