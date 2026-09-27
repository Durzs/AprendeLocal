/**
 * Lo que el correo de la ruta necesita saber del catálogo.
 *
 * El correo lo escribe una función del servidor (§supabase/functions/
 * enviar-ruta), no el navegador. Si el navegador mandara el texto, cualquiera
 * podría usar el formulario del stand para enviar lo que quisiera, con
 * nuestro remitente, a la dirección que quisiera. Así que el navegador manda
 * solo los identificadores —qué problemática, qué asignaturas, qué lugar— y
 * la función arma el texto con esto.
 *
 * Esto no se copia a mano: `scripts/catalogo-correo.mjs` lo genera desde los
 * mismos archivos que usa el sitio y lo deja en
 * `supabase/functions/enviar-ruta/catalogo.json`. El build falla si el JSON
 * quedó viejo, así que una problemática nueva llega al correo sin que nadie
 * tenga que acordarse.
 */

import { ASIGNATURAS, PROBLEMAS } from "../sequences/metodo/problemas";
import { ASIGNATURAS_BR, PROBLEMAS_BR } from "../sequences/metodo/problemas.br";
import { ETAPAS } from "../sequences/metodo/etapas";
import { ETAPAS_PT } from "../sequences/metodo/etapas.pt";
import { LUGARES } from "./lugares";
import { ODS, odsDe } from "./ods";

export function catalogoCorreo() {
  const problemas: Record<string, unknown> = {};
  for (const [sede, lista] of [["cl", PROBLEMAS], ["br", PROBLEMAS_BR]] as const) {
    for (const p of lista) {
      const n = p.respaldo[0];
      problemas[p.id] = {
        sede,
        nombre: p.nombre,
        noticia: n ? { titular: n.titular, medio: n.medio, fecha: n.fecha ?? null } : null,
        ods: odsDe(p.id).map((o) => o.n),
        angulos: p.angulos.map((a) => ({ asignatura: a.asignatura, enfoque: a.enfoque })),
      };
    }
  }

  // Por edición: «historia» existe en las dos y no se llama igual.
  const nombres = (l: { id: string; nombre: string }[]) => Object.fromEntries(l.map((a) => [a.id, a.nombre]));
  const asignaturas = { cl: nombres(ASIGNATURAS), br: nombres(ASIGNATURAS_BR) };

  const lugares: Record<string, string> = {};
  for (const l of [...LUGARES.cl, ...LUGARES.br]) lugares[l.id] = l.nombre;

  const etapa = (e: { id: string; nombre: string; enUnaLinea: string }) => ({
    id: e.id,
    nombre: e.nombre,
    enUnaLinea: e.enUnaLinea,
  });

  return {
    problemas,
    asignaturas,
    lugares,
    etapas: { es: ETAPAS.map(etapa), pt: ETAPAS_PT.map(etapa) },
    ods: Object.fromEntries(
      Object.values(ODS).map((o) => [o.n, { color: o.color, claro: o.claro, es: o.nombre.es, pt: o.nombre.pt }])
    ),
  };
}
