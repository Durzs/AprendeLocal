import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './shared/contexts/AuthContext'
import ConfigErrorScreen from './shared/components/ConfigErrorScreen'
import { missingSupabaseEnvVars } from './shared/lib/supabaseClient'

// Sin credenciales de Supabase la aplicación no puede funcionar, así que
// se muestra qué falta en lugar de dejar la página en blanco.
createRoot(document.getElementById('root')!).render(
  missingSupabaseEnvVars.length > 0 ? (
    <StrictMode>
      <ConfigErrorScreen missing={missingSupabaseEnvVars} />
    </StrictMode>
  ) : (
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>
  ),
)
