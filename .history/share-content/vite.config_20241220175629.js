import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',  // This will make Vite use 'localhost' instead of '127.0.0.1'
    port: 5173,         // Use the desired port
  },
})
