import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Automatically uses the repo name as the base path when deployed via GitHub Actions.
  // This makes the app work at https://username.github.io/repo-name/
  base: process.env.GITHUB_REPO_NAME ? `/${process.env.GITHUB_REPO_NAME}/` : '/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.svg'],

      // PWA manifest — controls how the app looks when installed on a phone
      manifest: {
        name: 'Daily Tasks',
        short_name: 'Tasks',
        description: 'Personal task manager — manage tasks by user and topic',
        theme_color: '#1F2937',
        background_color: '#111827',
        display: 'standalone',        // hides the browser UI — feels like a real app
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'   // Android adaptive icon support
          }
        ]
      },

      // Service worker — caches the app so it works offline
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/unpkg\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      }
    })
  ]
})
