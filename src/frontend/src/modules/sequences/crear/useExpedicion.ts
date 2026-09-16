import { useCallback, useEffect, useRef, useState } from "react";

import { guardar, leer, type Expedicion } from "./expedicion";
import { AVANCE_VACIO, normalizarAvance, type Avance } from "./avance";
import { bajarUltima, masReciente, subir, type EstadoNube } from "./nube";

/**
 * La expedición viva: la del navegador y la de la cuenta, en un solo sitio.
 *
 * El cuaderno leía con `leer()` y escribía con `guardar()` en cada cambio.
 * Eso sigue siendo el corazón —es instantáneo y funciona sin nada—, pero
 * ahora además sube a la cuenta cuando hay sesión.
 *
 * TRES DECISIONES QUE IMPORTAN
 *
 * Primero, lo local se escribe siempre y de inmediato. El respaldo nunca
 * bloquea ni hace esperar: si la red está mala, el docente no se entera
 * porque su trabajo ya está a salvo en el navegador.
 *
 * Segundo, la subida espera. Guardar en cada tecla serían cientos de
 * peticiones para escribir «El estero Trailelfu». Se espera a que pare de
 * escribir. Un segundo y medio es suficiente para no cortar una frase y poco
 * para no perder nada si cierra la pestaña.
 *
 * Tercero, al abrir se mira qué hay en los dos sitios y gana el más reciente,
 * con una excepción escrita en `masReciente`: ante la duda, gana lo local,
 * porque es lo que la persona tiene en pantalla.
 */

/** Cuánto se espera a que pare de escribir antes de subir. */
const ESPERA_MS = 1500;

/** La marca de cuándo se tocó por última vez en este navegador. */
const LLAVE_TOCADA = "aprendelocal:expedicion:tocada";
const LLAVE_AVANCE = "aprendelocal:expedicion:avance";
const LLAVE_ID = "aprendelocal:expedicion:id";

function leerLocal<T>(llave: string, porDefecto: T): T {
  try {
    const crudo = localStorage.getItem(llave);
    return crudo ? (JSON.parse(crudo) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function escribirLocal(llave: string, valor: unknown): void {
  try {
    localStorage.setItem(llave, JSON.stringify(valor));
  } catch {
    /* Ventana privada o sin espacio. Sigue en memoria. */
  }
}

export function useExpedicion() {
  const [expedicion, ponerExpedicion] = useState<Expedicion>(() => leer());
  const [avance, ponerAvance] = useState<Avance>(() =>
    normalizarAvance(leerLocal(LLAVE_AVANCE, AVANCE_VACIO))
  );
  const [estado, ponerEstado] = useState<EstadoNube>("sin_cuenta");
  const [bajada, ponerBajada] = useState(false);

  const id = useRef<string | null>(leerLocal(LLAVE_ID, null));
  const reloj = useRef<ReturnType<typeof setTimeout> | null>(null);
  // El primer render no debe subir nada: no ha cambiado nada todavía, y
  // subir al abrir crearía una fila por cada visita a la página.
  const montado = useRef(false);

  /* ── Al abrir: mirar si hay algo en la cuenta ───────────────────────── */
  useEffect(() => {
    let vigente = true;
    (async () => {
      const remoto = await bajarUltima();
      if (!vigente) return;
      if (remoto) {
        const gana = masReciente(
          {
            expedicion: leer(),
            avance: normalizarAvance(leerLocal(LLAVE_AVANCE, AVANCE_VACIO)),
            tocada: leerLocal<string | null>(LLAVE_TOCADA, null),
          },
          remoto
        );
        id.current = gana.id;
        escribirLocal(LLAVE_ID, gana.id);
        if (gana.vieneDeLaNube) {
          ponerExpedicion(gana.expedicion);
          ponerAvance(gana.avance);
          guardar(gana.expedicion);
          escribirLocal(LLAVE_AVANCE, gana.avance);
        }
        ponerEstado("guardado");
      }
      ponerBajada(true);
    })();
    return () => {
      vigente = false;
    };
  }, []);

  /* ── Al escribir: local ya, cuenta después ─────────────────────────── */
  useEffect(() => {
    if (!montado.current) {
      montado.current = true;
      return;
    }
    guardar(expedicion);
    escribirLocal(LLAVE_AVANCE, avance);
    escribirLocal(LLAVE_TOCADA, new Date().toISOString());

    if (reloj.current) clearTimeout(reloj.current);
    reloj.current = setTimeout(async () => {
      ponerEstado("guardando");
      const r = await subir(expedicion, avance, id.current);
      id.current = r.id;
      escribirLocal(LLAVE_ID, r.id);
      ponerEstado(r.estado);
    }, ESPERA_MS);

    return () => {
      if (reloj.current) clearTimeout(reloj.current);
    };
  }, [expedicion, avance]);

  const cambiar = useCallback((e: Expedicion) => ponerExpedicion(e), []);
  const cambiarAvance = useCallback((a: Avance) => ponerAvance(a), []);

  return { expedicion, avance, estado, bajada, cambiar, cambiarAvance };
}
