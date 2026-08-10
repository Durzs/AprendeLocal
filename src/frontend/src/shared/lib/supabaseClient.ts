import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Variables que faltan, si es que falta alguna.
 *
 * Este módulo se carga a través de AuthContext antes de que React monte,
 * así que lanzar aquí dejaba la página completamente en blanco y sin
 * ningún mensaje. En su lugar se reporta el problema y main.tsx muestra
 * una pantalla explicando qué configurar.
 */
export const missingSupabaseEnvVars: string[] = [
  ...(supabaseUrl ? [] : ["VITE_SUPABASE_URL"]),
  ...(supabaseAnonKey ? [] : ["VITE_SUPABASE_ANON_KEY"]),
];

/** Ruta que recibe la vuelta del enlace de confirmación. */
export const RUTA_CALLBACK = "/auth/callback";

/** URL absoluta a la que Supabase debe devolver al usuario tras confirmar. */
export function urlDeRetorno(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}${RUTA_CALLBACK}`;
}

// Con la configuración incompleta se crea el cliente con valores de
// marcador para que los módulos que lo importan sigan cargando. Nunca
// llega a usarse: main.tsx corta antes de renderizar la aplicación.
export const supabase = createClient(
  supabaseUrl || "https://missing-config.invalid",
  supabaseAnonKey || "missing-config",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Necesario para que el enlace de confirmación establezca la sesión al
      // volver: los tokens llegan en el fragmento de la URL.
      detectSessionInUrl: true,
      // Se mantiene el flujo implícito a propósito. PKCE exige que el
      // verificador guardado al registrarse siga en el mismo navegador, y aquí
      // es corriente registrarse en el computador de la escuela y abrir el
      // correo en el teléfono. Con PKCE ese caso falla siempre.
      flowType: "implicit",
    },
  }
);
