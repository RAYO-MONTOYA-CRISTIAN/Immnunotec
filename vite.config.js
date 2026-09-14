import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    allowedHosts: [
      'prewashed-curly-lunar.ngrok-free.dev'
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  }
})