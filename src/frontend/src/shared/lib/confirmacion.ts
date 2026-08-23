/**
 * Utilidades del paso de confirmación por correo.
 *
 * Supabase devuelve al usuario a la aplicación tanto si la verificación salió
 * bien como si falló, y en ambos casos la información viaja en la URL. Estas
 * funciones la extraen para que las pantallas puedan explicar lo ocurrido en
 * lugar de mostrar la portada como si nada hubiese pasado.
 */

import { supabase, urlDeRetorno, urlDeReset } from "./supabaseClient";

export type ErrorDeRetorno = {
  codigo: string;
  descripcion: string;
  /** El enlace ya se usó o pasó su plazo: se puede ofrecer reenviarlo. */
  caducado: boolean;
};

/**
 * Lee el error que Supabase adjunta al volver. Llega en el fragmento
 * (`#error=...`) con el flujo implícito y en la query (`?error=...`) en
 * algunos casos, así que se miran los dos.
 */
export function leerErrorDeRetorno(href: string): ErrorDeRetorno | null {
  const url = new URL(href);
  const fragmento = new URLSearchParams(url.hash.replace(/^#/, ""));

  const codigo =
    fragmento.get("error_code") ||
    fragmento.get("error") ||
    url.searchParams.get("error_code") ||
    url.searchParams.get("error");

  if (!codigo) return null;

  const descripcion =
    fragmento.get("error_description") ||
    url.searchParams.get("error_description") ||
    codigo;

  return {
    codigo,
    // Supabase codifica la descripción con «+» en lugar de espacios.
    descripcion: descripcion.replace(/\+/g, " "),
    caducado: /expired|invalid/i.test(`${codigo} ${descripcion}`),
  };
}

/** ¿La URL trae credenciales que el cliente vaya a canjear por una sesión? */
export function traeCredenciales(href: string): boolean {
  const url = new URL(href);
  const fragmento = new URLSearchParams(url.hash.replace(/^#/, ""));
  return Boolean(fragmento.get("access_token") || url.searchParams.get("code"));
}

/**
 * Borra de la barra de direcciones los tokens y errores ya procesados, para
 * que no queden a la vista ni se reenvíen al recargar.
 */
export function limpiarUrl(): void {
  if (typeof window === "undefined") return;
  window.history.replaceState({}, "", window.location.pathname);
}

/**
 * Reenvía el correo de confirmación. Es el remedio habitual: el emisor
 * integrado de Supabase limita los envíos por hora y muchos correos no llegan.
 */
export async function reenviarConfirmacion(email: string) {
  return supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: urlDeRetorno() },
  });
}

/**
 * Envía el correo con el enlace para fijar una contraseña nueva.
 *
 * Supabase responde igual exista o no la cuenta, y conviene que siga siendo
 * así: distinguir ambos casos en la interfaz permitiría averiguar qué correos
 * están registrados probándolos uno a uno.
 */
export async function enviarEnlaceDeRecuperacion(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: urlDeReset(),
  });
}
