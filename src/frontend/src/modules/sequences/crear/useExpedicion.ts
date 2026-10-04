import { useCallback, useEffect, useRef, useState } from "react";

import { guardar, leer, type Expedicion } from "./expedicion";
import { AVANCE_VACIO, normalizarAvance, type Avance } from "./avance";
import { llaveDeSede } from "../../../shared/sede";
import { bajarUltima, masReciente, subir, tieneContenido, type EstadoNube } from "./nube";

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
/*
 * Son funciones y no constantes porque dependen de la edición activa: cada
 * una guarda su trabajo aparte. Ver `llaveDeSede` en §sede.ts. La página que
 * usa este enganche lo vuelve a montar al cambiar de edición.
 */
const LLAVE_TOCADA = () => llaveDeSede("aprendelocal:expedicion:tocada");
export const LLAVE_AVANCE = () => llaveDeSede("aprendelocal:expedicion:avance");
const LLAVE_ID = () => llaveDeSede("aprendelocal:expedicion:id");

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
    normalizarAvance(leerLocal(LLAVE_AVANCE(), AVANCE_VACIO))
  );
  const [estado, ponerEstado] = useState<EstadoNube>("sin_cuenta");
  const [bajada, ponerBajada] = useState(false);

  const id = useRef<string | null>(leerLocal(LLAVE_ID(), null));
  const reloj = useRef<ReturnType<typeof setTimeout> | null>(null);
  /**
   * Lo último escrito que todavía no subió a la cuenta.
   *
   * La subida espera unos segundos a que se deje de escribir. Si en ese rato
   * se cerraba la pestaña o se pasaba a otra página, la espera se cancelaba y
   * lo último —los objetivos recién marcados, típicamente— quedaba solo en
   * este navegador. En otro computador la cuenta mostraba la versión vieja.
   */
  const pendiente = useRef<{ expedicion: Expedicion; avance: Avance } | null>(null);
  const enCurso = useRef<Promise<void> | null>(null);

  /**
   * Sube lo pendiente, si hay. Toma lo pendiente antes de esperar a la red,
   * para que dos llamadas seguidas (la espera que vence y la pestaña que se
   * oculta) no suban lo mismo dos veces ni creen dos filas.
   */
  const vaciar = useCallback(async () => {
    // Si hay una subida en curso se espera a que termine: la primera de una
    // expedición nueva crea la fila y trae su id, y la siguiente tiene que
    // actualizar esa fila, no crear otra.
    while (enCurso.current) await enCurso.current;
    const p = pendiente.current;
    if (!p) return;
    pendiente.current = null;
    if (reloj.current) clearTimeout(reloj.current);
    ponerEstado("guardando");
    enCurso.current = (async () => {
      const r = await subir(p.expedicion, p.avance, id.current);
      id.current = r.id;
      escribirLocal(LLAVE_ID(), r.id);
      ponerEstado(r.estado);
    })();
    try {
      await enCurso.current;
    } finally {
      enCurso.current = null;
    }
  }, []);

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
            avance: normalizarAvance(leerLocal(LLAVE_AVANCE(), AVANCE_VACIO)),
            tocada: leerLocal<string | null>(LLAVE_TOCADA(), null),
          },
          remoto
        );
        id.current = gana.id;
        escribirLocal(LLAVE_ID(), gana.id);
        if (gana.vieneDeLaNube) {
          ponerExpedicion(gana.expedicion);
          ponerAvance(gana.avance);
          guardar(gana.expedicion);
          escribirLocal(LLAVE_AVANCE(), gana.avance);
          ponerEstado("guardado");
        } else {
          // Ganó la de este computador. Si es más nueva que la de la cuenta,
          // se sube ahora: antes quedaba esperando a la próxima edición, y
          // mientras tanto la cuenta seguía con la versión vieja.
          const tocada = leerLocal<string | null>(LLAVE_TOCADA(), null);
          const masNueva = !remoto.actualizada || !tocada || new Date(tocada) > new Date(remoto.actualizada);
          if (masNueva && tieneContenido(gana.expedicion)) {
            pendiente.current = { expedicion: gana.expedicion, avance: gana.avance };
            void vaciar();
          } else {
            ponerEstado("guardado");
          }
        }
      } else {
        // Nada en la cuenta todavía, pero sí en este computador: se sube.
        const local = leer();
        if (tieneContenido(local)) {
          pendiente.current = {
            expedicion: local,
            avance: normalizarAvance(leerLocal(LLAVE_AVANCE(), AVANCE_VACIO)),
          };
          void vaciar();
        }
      }
      ponerBajada(true);
    })();
    return () => {
      vigente = false;
    };
  }, [vaciar]);

  /* ── Al escribir: local ya, cuenta después ─────────────────────────── */
  useEffect(() => {
    if (!montado.current) {
      montado.current = true;
      return;
    }
    guardar(expedicion);
    escribirLocal(LLAVE_AVANCE(), avance);
    escribirLocal(LLAVE_TOCADA(), new Date().toISOString());

    pendiente.current = { expedicion, avance };
    if (reloj.current) clearTimeout(reloj.current);
    reloj.current = setTimeout(() => void vaciar(), ESPERA_MS);

    return () => {
      if (reloj.current) clearTimeout(reloj.current);
    };
  }, [expedicion, avance, vaciar]);

  /* ── Al irse: subir lo que haya quedado esperando ──────────────────── */
  useEffect(() => {
    const alOcultar = () => {
      if (document.visibilityState === "hidden") void vaciar();
    };
    document.addEventListener("visibilitychange", alOcultar);
    window.addEventListener("pagehide", alOcultar);
    return () => {
      document.removeEventListener("visibilitychange", alOcultar);
      window.removeEventListener("pagehide", alOcultar);
      // Salir del cuaderno a otra página del sitio desmonta esto sin cerrar
      // la pestaña: ahí todavía hay tiempo de subir.
      void vaciar();
    };
  }, [vaciar]);

  const cambiar = useCallback((e: Expedicion) => ponerExpedicion(e), []);
  const cambiarAvance = useCallback((a: Avance) => ponerAvance(a), []);

  return { expedicion, avance, estado, bajada, cambiar, cambiarAvance };
}
