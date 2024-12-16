import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'] // Add this to handle file extensions
  }
})