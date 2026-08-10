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

// En desarrollo la aplicación arranca aunque falten las credenciales: si no,
// no se puede ni mirar la interfaz sin tener claves de Supabase, y hay
// pantallas enteras que no dependen de ellas. Lo que sí se hace es avisar de
// forma permanente, para que nadie confunda esto con un entorno funcionando.
//
// En producción se mantiene el bloqueo: ahí faltar credenciales significa que
// nada va a funcionar, y callarlo fue justamente lo que dejaba el sitio en
// blanco.
const bloquearPorConfig = missingSupabaseEnvVars.length > 0 && !import.meta.env.DEV

function AvisoDesarrollo() {
  if (!import.meta.env.DEV || missingSupabaseEnvVars.length === 0) return null
  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        bottom: 12,
        left: 12,
        zIndex: 9999,
        maxWidth: '22rem',
        padding: '10px 14px',
        borderRadius: 12,
        border: '1px solid #fcd34d',
        background: '#fffbeb',
        color: '#78350f',
        font: '13px/1.5 ui-sans-serif, system-ui, sans-serif',
        boxShadow: '0 4px 16px rgba(0,0,0,.08)',
      }}
    >
      <strong>Desarrollo sin Supabase.</strong> Faltan{' '}
      {missingSupabaseEnvVars.join(' y ')}. La sesión y los cursos no
      funcionarán; el resto de la interfaz sí.
    </div>
  )
}

// El resto va envuelto en ErrorBoundary y en un try/catch: cualquier otro
// fallo del arranque o del render se muestra en pantalla, en vez de
// desmontar el árbol y dejar la página vacía y muda.
try {
  raiz.render(
    bloquearPorConfig ? (
      <StrictMode>
        <ConfigErrorScreen missing={missingSupabaseEnvVars} />
      </StrictMode>
    ) : (
      <StrictMode>
        <ErrorBoundary>
          <AuthProvider>
            <App />
            <AvisoDesarrollo />
          </AuthProvider>
        </ErrorBoundary>
      </StrictMode>
    ),
  )
} catch (error) {
  console.error('Fallo al montar la aplicación:', error)
  raiz.render(<StartupErrorScreen error={error} />)
}
