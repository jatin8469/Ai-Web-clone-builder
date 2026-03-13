import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy local /api calls to the live production server seamlessly
      '/api': {
        target: 'https://ai-clone-builder.vercel.app',
        changeOrigin: true,
      }
    }
  }
})
