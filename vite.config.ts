import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server:{
    port: 4422
  },
  resolve: {
    alias: {
      '@goalst': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features'),
      '@ui': path.resolve(__dirname, './src/ui'),
    },
  },
})
