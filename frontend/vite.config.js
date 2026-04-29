import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Needed for Docker to expose the port outside the container
    port: 5173,
    watch: {
      usePolling: true, // Enables HMR in Docker
    }
  }
})
