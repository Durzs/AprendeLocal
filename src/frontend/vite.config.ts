import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/health": "http://127.0.0.1:8000",
      "/points": "http://127.0.0.1:8000",
      "/projects": "http://127.0.0.1:8000",
      "/communes": "http://127.0.0.1:8000",
      "/generate-project": "http://127.0.0.1:8000",
      "/schools": "http://127.0.0.1:8000",
      "/curriculum": "http://127.0.0.1:8000",
      "/students": "http://127.0.0.1:8000",
      "/share-code": "http://127.0.0.1:8000",
      "/enrollments": "http://127.0.0.1:8000",
    },
  },
})
