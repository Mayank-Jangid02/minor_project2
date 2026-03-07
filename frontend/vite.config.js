import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  optimizeDeps: {
    force: true, // Forces dependency pre-bundling, blowing away the bad cache!
    include: ['react', 'react-dom', 'react-redux', '@reduxjs/toolkit']
  }
})
