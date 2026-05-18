import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/health": "http://127.0.0.1:8000",
      "/points": "http://127.0.0.1:8000",
      "/projects": "http://127.0.0.1:8000",
      "/communes": "http://127.0.0.1:8000",
      "/generate-project": "http://127.0.0.1:8000",
    },
  },
})
