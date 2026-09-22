import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    /**
     * Aplicación instalable y utilizable sin señal.
     *
     * No es una comodidad: en las escuelas rurales de La Araucanía internet
     * llega por el celular del docente y en la sala se cae. Y la salida a
     * terreno —que es el centro del modelo— ocurre en un estero donde no hay
     * cobertura. Sin esto, la parte más importante de la plataforma es
     * justamente la que nunca se puede usar.
     */
    VitePWA({
      // El registro se controla desde la aplicación para poder avisar al
      // docente en vez de recargarle la página mientras trabaja.
      registerType: 'prompt',
      injectRegister: null,
      includeAssets: ['favicon.svg', 'icons.svg'],

      manifest: {
        name: 'AprendeLocal',
        short_name: 'AprendeLocal',
        description:
          'Proyectos STEM anclados en el territorio de cada escuela rural.',
        lang: 'es-CL',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#0a0047',
        icons: [
          { src: '/icono-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icono-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icono-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        // Accesos directos a lo que se abre de verdad, para que la aplicación
        // instalada no obligue a navegar desde la portada.
        shortcuts: [
          { name: 'Cuaderno', url: '/crear' },
          { name: 'Seguimiento', url: '/proyecto' },
        ],
      },

      workbox: {
        // El logo y el fondo pesan más de 2 MB juntos; sin subir el tope
        // quedarían fuera del precacheo y la portada se vería rota sin señal.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff,woff2}'],
        // Con rutas de SPA, cualquier URL desconocida debe resolver al índice.
        navigateFallback: '/index.html',
        // El retorno de los correos de Supabase trae credenciales en la URL y
        // tiene que llegar a la red, no a una copia guardada.
        navigateFallbackDenylist: [/^\/auth\//],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Catálogos: objetivos, lugares y escuelas. Cambian poco y son lo
            // primero que hace falta para que la pantalla no aparezca vacía.
            urlPattern: /\/rest\/v1\/(curriculum_objectives|points_of_interest|schools)/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'catalogos',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Tipografías: sin ellas la portada se ve rota aun con todo lo
            // demás en caché.
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tipografias',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
        // La sesión y la generación no se cachean a propósito: servir una
        // secuencia vieja desde la caché confunde más de lo que ayuda.
      },

      devOptions: { enabled: true },
    }),
  ],
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
