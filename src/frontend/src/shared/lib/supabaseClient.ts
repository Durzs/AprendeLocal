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

// Con la configuración incompleta se crea el cliente con valores de
// marcador para que los módulos que lo importan sigan cargando. Nunca
// llega a usarse: main.tsx corta antes de renderizar la aplicación.
export const supabase = createClient(
  supabaseUrl || "https://missing-config.invalid",
  supabaseAnonKey || "missing-config",
);
