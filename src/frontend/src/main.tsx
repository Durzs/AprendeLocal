import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './shared/contexts/AuthContext'
import ConfigErrorScreen from './shared/components/ConfigErrorScreen'
import ErrorBoundary from './shared/components/ErrorBoundary'
import StartupErrorScreen from './shared/components/StartupErrorScreen'
import { missingSupabaseEnvVars } from './shared/lib/supabaseClient'

const raiz = createRoot(document.getElementById('root')!)

// Sin credenciales de Supabase la aplicación no puede funcionar, así que
// se muestra qué falta en lugar de dejar la página en blanco.
//
// El resto va envuelto en ErrorBoundary y en un try/catch: cualquier otro
// fallo del arranque o del render se muestra en pantalla, en vez de
// desmontar el árbol y dejar la página vacía y muda.
try {
  raiz.render(
    missingSupabaseEnvVars.length > 0 ? (
      <StrictMode>
        <ConfigErrorScreen missing={missingSupabaseEnvVars} />
      </StrictMode>
    ) : (
      <StrictMode>
        <ErrorBoundary>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ErrorBoundary>
      </StrictMode>
    ),
  )
} catch (error) {
  console.error('Fallo al montar la aplicación:', error)
  raiz.render(<StartupErrorScreen error={error} />)
}
