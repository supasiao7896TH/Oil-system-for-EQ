import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Separate build target from vite.config.ts (used by Netlify): produces one
// fully self-contained standalone/index.html — JS, CSS, and fonts all inlined
// (assetsInlineLimit set past the largest font file so nothing is emitted as
// a separate request) — so it can be downloaded from GitHub and opened
// directly via file://, offline, like the original site.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'standalone',
    emptyOutDir: true,
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
  },
})
