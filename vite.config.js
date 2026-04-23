import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/Tasks-Keeper/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Daily Tasks',
        short_name: 'Daily Tasks',
        description: 'Personal task manager — focus, clarity, momentum',
        theme_color: '#F2F2F7',
        background_color: '#F2F2F7',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/Tasks-Keeper/',
        scope: '/Tasks-Keeper/',
        icons: [
          { src: '/Tasks-Keeper/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/Tasks-Keeper/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
  build: { outDir: 'dist', sourcemap: false },
});
