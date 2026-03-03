import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/Calendar-app/' : '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        landing: resolve(__dirname, 'landing.html'),
        login: resolve(__dirname, 'login.html'),
        app: resolve(__dirname, 'app.html'),
      },
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'vendor-mediapipe': ['@mediapipe/hands', '@mediapipe/camera_utils', '@mediapipe/drawing_utils'],
          'vendor-zustand': ['zustand'],
        },
      },
    },
  },
})
