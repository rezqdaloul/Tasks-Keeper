import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Hardcode the repo name — this MUST match your GitHub repo name exactly
  base: '/Tasks-Keeper/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.svg'],
      manifest: {
        name: 'Daily Tasks',
        short_name: 'Tasks',
        description: 'Personal task manager — manage tasks by user and topic',
        theme_color: '#1F2937',
        background_color: '#111827',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/Tasks-Keeper/',
        scope: '/Tasks-Keeper/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true
      }
    })
  ]
})
