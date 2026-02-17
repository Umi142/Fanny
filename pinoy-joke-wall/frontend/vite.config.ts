import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://cuddly-goldfish-q7x7pw7j5xw6247j-3000.app.github.dev'
    }
  }
})
