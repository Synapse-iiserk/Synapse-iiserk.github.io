import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        // Only React is shared by every route, so only React is split out.
        //
        // The charting libraries used to be a manual chunk too, which made
        // index.html modulepreload them on every route: pricing, team and
        // contact each downloaded ~24 kB gzip of anime.js and d3 that they
        // never used, because only three components on the home page draw a
        // chart. Letting Rollup decide keeps those libraries inside the home
        // page's own chunk, where they are needed immediately and fetched
        // once.
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
