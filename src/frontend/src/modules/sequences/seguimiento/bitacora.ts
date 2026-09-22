/**
 * La bitácora: por dónde va el proyecto, etapa por etapa.
 *
 * QUÉ FALTABA
 *
 * El cuaderno sabía llevar el calendario de la ruta: las semanas que trae la
 * ruta armada, marcadas a medida que se dan. Eso contesta «cuánto llevo» y no
 * contesta la pregunta que de verdad tiene alguien a mitad de un proyecto de
 * dos meses: en qué parte del método está, si esa parte ya se puede dar por
 * terminada, y qué se le está quedando atrás.
 *
 * Las dos cosas conviven porque son distintas. Las semanas son el calendario y
 * las pone la ruta; las etapas son el método y valen igual con ruta armada o
 * sin ella. Una etapa puede ocupar tres semanas o media clase.
 *
 * QUÉ GUARDA CADA ETAPA
 *
 * Lo mismo para las seis: en qué estado está, cuándo se abrió, cuándo se
 * cerró, cuáles de sus condiciones de término están marcadas, cuántos
 * entregaron el cierre escrito y lo que el docente quiera anotar.
 *
 * Y después una cosa distinta en cada una, que es `registro`. Una etapa que
 * termina con el curso partido en dos no se sigue igual que una que termina
 * con una salida a terreno ni que una que termina con una propuesta corregida
 * dos veces. Cada etapa guarda lo suyo y ninguna guarda lo de otra.
 *
 * LO QUE ESTO NO ES
 *
 * No es un porcentaje de cumplimiento ni un panel para que alguien de arriba
 * mire cuánto avanzó cada escuela. Todo se puede desmarcar sin explicar por
 * qué, y las advertencias son observaciones y no reproches: una etapa que
 * lleva un mes abierta porque llovió tres martes seguidos no es un
 * incumplimiento, es el invierno en La Araucanía.
 */

import { ETAPAS, etapasEn, type Etapa } from "../metodo/etapas";
import type { Idioma } from "../../../shared/tx";
import type { Expedicion } from "../crear/expedicion";

/** En qué estado está una etapa. */
export type EstadoEtapa = "sin_abrir" | "abierta" | "cerrada";

/** Un punto del terreno, con lo que se trajo de ahí. */
export type Punto = { id: string; donde: string; que: string };

/** Una versión de la propuesta, con la crítica que la provocó. */
export type Version = { id: string; fecha: string; critica: string };

/** A quién se le entregó, y si contestó. */
export type Entrega = { id: string; aQuien: string; fecha: string; respuesta: string };

/**
 * Lo propio de cada etapa. Cada campo lo escribe una sola de las seis.
 *
 * Van todos en un mismo objeto y no en seis tipos distintos porque esto se
 * guarda como JSON en una columna, y seis formas distintas dentro de la misma
 * columna se convierten en seis maneras de que una fila vieja rompa la
 * pantalla. Aquí una fila vieja tiene campos vacíos y ya está.
 */
export type Registro = {
  /* ── 01 · la problemática: el curso partido en dos ─────────────────── */
  /** Lo que sostiene una mitad de la sala. */
  ladoA: string;
  /** Lo que sostiene la otra. */
  ladoB: string;
  cuantosA: number | null;
  cuantosB: number | null;
  /**
   * Si las razones del primer día ya se destaparon.
   *
   * Se escriben en la etapa 1 y se guardan tapadas hasta la 4, que es donde
   * sirven: el curso compara lo que creía con lo que encontró. Destaparlas
   * antes convierte el terreno en una confirmación de lo que ya pensaban.
   */
  destapado: boolean;

  /* ── 02 · el aula: qué se pasó y qué se ensayó ─────────────────────── */
  conceptosVistos: string[];
  tecnicasEnsayadas: string[];

  /* ── 03 · el terreno: la salida ────────────────────────────────────── */
  salida: string | null;
  puntos: Punto[];
  /** Cuando la salida se corrió de día, con el motivo si lo hay. */
  suspension: string;

  /* ── 04 · el análisis: el hallazgo ─────────────────────────────────── */
  /** La frase que queda escrita. Una sola, y por eso es difícil. */
  hallazgo: string;
  /** Si lo encontrado contradice lo que creían el primer día. */
  contradice: "si" | "no" | null;

  /* ── 05 · la propuesta: las versiones ──────────────────────────────── */
  versiones: Version[];

  /* ── 06 · la difusión: a quién llegó y qué contestaron ─────────────── */
  entregas: Entrega[];
  /** Lo que el curso mira de sí mismo al terminar. */
  queCambio: string;
};

export const REGISTRO_VACIO: Registro = {
  ladoA: "",
  ladoB: "",
  cuantosA: null,
  cuantosB: null,
  destapado: false,
  conceptosVistos: [],
  tecnicasEnsayadas: [],
  salida: null,
  puntos: [],
  suspension: "",
  hallazgo: "",
  contradice: null,
  versiones: [],
  entregas: [],
  queCambio: "",
};

/** La hoja de una etapa. */
export type HojaEtapa = {
  estado: EstadoEtapa;
  /** Cuándo se abrió, en formato corto: «2026-09-15». */
  abierta: string | null;
  cerrada: string | null;
  /** Los índices de `estaListoCuando` que están marcados. */
  listo: number[];
  /** Cuántos entregaron el cierre escrito de esta etapa. */
  entregaron: number | null;
  /** Quiénes quedaron pendientes, con las palabras del docente. */
  faltan: string;
  nota: string;
  registro: Registro;
};

export const HOJA_VACIA: HojaEtapa = {
  estado: "sin_abrir",
  abierta: null,
  cerrada: null,
  listo: [],
  entregaron: null,
  faltan: "",
  nota: "",
  registro: REGISTRO_VACIO,
};

/** Las seis hojas, por id de etapa. */
export type Bitacora = Record<string, HojaEtapa>;

export const BITACORA_VACIA: Bitacora = {};

/** El día de hoy, en el formato corto que se guarda. */
export function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Un identificador para una fila que el docente acaba de agregar. */
function nuevoId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `f${Date.now()}${Math.random().toString(36).slice(2, 7)}`;
  }
}

/**
 * La hoja de una etapa, exista o no.
 *
 * Nunca devuelve `undefined`: una etapa que todavía no se toca se comporta
 * igual que una recién creada, y así ninguna pantalla tiene que preguntarse si
 * la hoja existe antes de leerla.
 */
export function hojaDe(b: Bitacora, etapa: string): HojaEtapa {
  const h = b[etapa];
  if (!h) return HOJA_VACIA;
  // Se mezcla contra las vacías por lo mismo que en el resto del cuaderno: una
  // bitácora guardada antes de que existiera un campo no debe dejarlo en
  // `undefined` y reventar al leerlo.
  return { ...HOJA_VACIA, ...h, registro: { ...REGISTRO_VACIO, ...h.registro } };
}

/** Cambia parte de una hoja. Devuelve una bitácora nueva. */
export function ponerHoja(
  b: Bitacora,
  etapa: string,
  cambio: Partial<HojaEtapa>
): Bitacora {
  return { ...b, [etapa]: { ...hojaDe(b, etapa), ...cambio } };
}

/** Cambia parte del registro propio de una etapa. */
export function ponerRegistro(
  b: Bitacora,
  etapa: string,
  cambio: Partial<Registro>
): Bitacora {
  const h = hojaDe(b, etapa);
  return ponerHoja(b, etapa, { registro: { ...h.registro, ...cambio } });
}

/**
 * Abre una etapa.
 *
 * Abrir no cierra la anterior. En multigrado pasa de verdad que los mayores
 * están armando la propuesta mientras los menores todavía ordenan lo que
 * trajeron, y una bitácora que obligue a cerrar para seguir estaría pidiendo
 * mentir sobre lo que ocurre en la sala.
 */
export function abrir(b: Bitacora, etapa: string, fecha = hoy()): Bitacora {
  const h = hojaDe(b, etapa);
  return ponerHoja(b, etapa, {
    estado: "abierta",
    abierta: h.abierta ?? fecha,
    cerrada: null,
  });
}

/** Cierra una etapa. Se puede reabrir, y sin dar explicaciones. */
export function cerrar(b: Bitacora, etapa: string, fecha = hoy()): Bitacora {
  const h = hojaDe(b, etapa);
  return ponerHoja(b, etapa, {
    estado: "cerrada",
    abierta: h.abierta ?? fecha,
    cerrada: fecha,
  });
}

/** La devuelve a «abierta», sin borrar nada de lo escrito. */
export function reabrir(b: Bitacora, etapa: string): Bitacora {
  return ponerHoja(b, etapa, { estado: "abierta", cerrada: null });
}

/** Marca o desmarca una de las condiciones de término. */
export function alternarListo(b: Bitacora, etapa: string, i: number): Bitacora {
  const h = hojaDe(b, etapa);
  return ponerHoja(b, etapa, {
    listo: h.listo.includes(i) ? h.listo.filter((x) => x !== i) : [...h.listo, i].sort(),
  });
}

/* ── Las filas que el docente agrega ───────────────────────────────────── */

export function agregarPunto(b: Bitacora, etapa: string): Bitacora {
  const r = hojaDe(b, etapa).registro;
  return ponerRegistro(b, etapa, {
    puntos: [...r.puntos, { id: nuevoId(), donde: "", que: "" }],
  });
}

export function cambiarPunto(
  b: Bitacora,
  etapa: string,
  id: string,
  cambio: Partial<Punto>
): Bitacora {
  const r = hojaDe(b, etapa).registro;
  return ponerRegistro(b, etapa, {
    puntos: r.puntos.map((p) => (p.id === id ? { ...p, ...cambio } : p)),
  });
}

export function quitarPunto(b: Bitacora, etapa: string, id: string): Bitacora {
  const r = hojaDe(b, etapa).registro;
  return ponerRegistro(b, etapa, { puntos: r.puntos.filter((p) => p.id !== id) });
}

export function agregarVersion(b: Bitacora, etapa: string): Bitacora {
  const r = hojaDe(b, etapa).registro;
  return ponerRegistro(b, etapa, {
    versiones: [...r.versiones, { id: nuevoId(), fecha: hoy(), critica: "" }],
  });
}

export function cambiarVersion(
  b: Bitacora,
  etapa: string,
  id: string,
  cambio: Partial<Version>
): Bitacora {
  const r = hojaDe(b, etapa).registro;
  return ponerRegistro(b, etapa, {
    versiones: r.versiones.map((v) => (v.id === id ? { ...v, ...cambio } : v)),
  });
}

export function quitarVersion(b: Bitacora, etapa: string, id: string): Bitacora {
  const r = hojaDe(b, etapa).registro;
  return ponerRegistro(b, etapa, { versiones: r.versiones.filter((v) => v.id !== id) });
}

export function agregarEntrega(
  b: Bitacora,
  etapa: string,
  aQuien = ""
): Bitacora {
  const r = hojaDe(b, etapa).registro;
  return ponerRegistro(b, etapa, {
    entregas: [...r.entregas, { id: nuevoId(), aQuien, fecha: hoy(), respuesta: "" }],
  });
}

export function cambiarEntrega(
  b: Bitacora,
  etapa: string,
  id: string,
  cambio: Partial<Entrega>
): Bitacora {
  const r = hojaDe(b, etapa).registro;
  return ponerRegistro(b, etapa, {
    entregas: r.entregas.map((x) => (x.id === id ? { ...x, ...cambio } : x)),
  });
}

export function quitarEntrega(b: Bitacora, etapa: string, id: string): Bitacora {
  const r = hojaDe(b, etapa).registro;
  return ponerRegistro(b, etapa, { entregas: r.entregas.filter((x) => x.id !== id) });
}

/* ── Lo que se deriva de la bitácora ───────────────────────────────────── */

/** Cuántos días lleva abierta una etapa. Null si no se ha abierto. */
export function diasAbierta(h: HojaEtapa, desde = hoy()): number | null {
  if (!h.abierta) return null;
  const fin = h.cerrada ?? desde;
  const ms = new Date(fin).getTime() - new Date(h.abierta).getTime();
  if (Number.isNaN(ms)) return null;
  return Math.max(0, Math.round(ms / 86_400_000));
}

/**
 * En qué etapa está el proyecto.
 *
 * La primera abierta, y si no hay ninguna abierta, la primera sin cerrar. Se
 * lee así y no al revés porque lo que el docente quiere ver al abrir esto un
 * lunes es dónde tiene el trabajo, no cuál es la siguiente casilla vacía.
 */
export function etapaEnCurso(b: Bitacora, idioma: Idioma = "es"): Etapa | null {
  const ETAPAS = etapasEn(idioma);
  const abierta = ETAPAS.find((e) => hojaDe(b, e.id).estado === "abierta");
  if (abierta) return abierta;
  const pendiente = ETAPAS.find((e) => hojaDe(b, e.id).estado !== "cerrada");
  return pendiente ?? null;
}

/** Cuántas etapas están cerradas. */
export function cerradas(b: Bitacora): number {
  return ETAPAS.filter((e) => hojaDe(b, e.id).estado === "cerrada").length;
}

/**
 * Qué decir del proyecto, en una línea.
 *
 * Se usa en el escritorio, que es donde el docente aterriza el lunes con un
 * minuto antes de entrar a la sala. No devuelve un porcentaje: devuelve en qué
 * parte está, que es lo que resuelve ese minuto.
 */
export function resumenBitacora(b: Bitacora, idioma: Idioma = "es"): string | null {
  const ETAPAS = etapasEn(idioma);
  const T = (es: string, pt: string) => (idioma === "pt" ? pt : es);
  const hechas = cerradas(b);
  if (hechas === ETAPAS.length)
    return T("Las seis etapas cerradas. Queda el informe.", "As seis etapas fechadas. Falta o relatório.");

  const actual = etapaEnCurso(b, idioma);
  if (!actual) return null;

  const h = hojaDe(b, actual.id);
  const n = ETAPAS.findIndex((e) => e.id === actual.id) + 1;

  if (h.estado === "abierta") {
    const dias = diasAbierta(h);
    const cuanto =
      dias === null
        ? ""
        : dias === 0
          ? T(", abierta hoy", ", aberta hoje")
          : T(
              `, abierta hace ${dias} día${dias === 1 ? "" : "s"}`,
              `, aberta há ${dias} dia${dias === 1 ? "" : "s"}`
            );
    return `Etapa ${n} ${T("de", "de")} ${ETAPAS.length}: ${actual.nombre}${cuanto}.`;
  }
  if (hechas === 0)
    return T(
      `Armado y sin empezar en la sala. Empieza la etapa 1: ${actual.nombre}.`,
      `Montado e ainda não começou em sala. Começa a etapa 1: ${actual.nombre}.`
    );
  return T(
    `Van ${hechas} de ${ETAPAS.length} etapas. Sigue: ${actual.nombre}.`,
    `${hechas} de ${ETAPAS.length} etapas feitas. Próxima: ${actual.nombre}.`
  );
}

/* ── Lo que conviene mirar ─────────────────────────────────────────────── */

/**
 * Una cosa que vale la pena que el docente vea.
 *
 * `aviso` es lo que puede costarle el proyecto si sigue así; `nota` es algo
 * que conviene saber y no urge. Ninguna de las dos es un reproche, y por eso
 * todas dicen qué se puede hacer con ellas: una advertencia que no viene con
 * una salida es solo una manera elegante de retar a alguien.
 */
export type Aviso = {
  id: string;
  tono: "aviso" | "nota";
  /** La etapa a la que lleva, para poder abrirla desde el aviso. */
  etapa: string;
  texto: string;
};

/** Cuántos días abierta antes de que valga la pena decir algo. */
const DEMASIADO = 28;

/**
 * Las cosas que conviene mirar hoy.
 *
 * Sale de cruzar la bitácora con lo que el docente ya escribió en el cuaderno.
 * El caso que más importa es el tercero: la etapa 3 es salir a terreno, y
 * salir sin haber ensayado la técnica en la sala devuelve un dato inservible y
 * una hora perdida en la orilla de un río con viento. Es lo que dice la propia
 * etapa 2, y es lo que más se salta.
 */
export function avisos(e: Expedicion, b: Bitacora, idioma: Idioma = "es"): Aviso[] {
  const ETAPAS = etapasEn(idioma);
  const T = (es: string, pt: string) => (idioma === "pt" ? pt : es);
  const lista: Aviso[] = [];
  const hoja = (id: string) => hojaDe(b, id);

  // Una etapa que lleva un mes abierta. Puede ser normal y puede ser que se
  // haya quedado ahí; el docente es quien sabe cuál de las dos.
  for (const etapa of ETAPAS) {
    const h = hoja(etapa.id);
    if (h.estado !== "abierta") continue;
    const dias = diasAbierta(h);
    if (dias !== null && dias >= DEMASIADO) {
      lista.push({
        id: `larga-${etapa.id}`,
        tono: "nota",
        etapa: etapa.id,
        texto: T(
          `«${etapa.nombre}» lleva ${dias} días abierta. Si ya pasó, ciérrala; si se atrasó, la fecha de apertura se puede corregir.`,
          `«${etapa.nombre}» está aberta há ${dias} dias. Se já passou, feche; se atrasou, a data de abertura pode ser corrigida.`
        ),
      });
    }
  }

  // Salir a terreno sin haber ensayado la técnica.
  const aula = hoja("aula");
  const terreno = hoja("terreno");
  const tecnicasPendientes = e.tecnicas.filter(
    (t) => !aula.registro.tecnicasEnsayadas.includes(t)
  );
  // Solo mientras el terreno está abierto. Cerrado ya es agua pasada, y una
  // advertencia sobre algo que no se puede corregir es solo un reproche.
  if (terreno.estado === "abierta" && tecnicasPendientes.length > 0) {
    lista.push({
      id: "sin-ensayo",
      tono: "aviso",
      etapa: "aula",
      texto:
        tecnicasPendientes.length === 1
          ? T(
              "El terreno ya está abierto y queda una técnica sin marcar como ensayada en la sala. Aprender a usarla en la orilla cuesta una hora y devuelve un dato que no sirve.",
              "O campo já está aberto e falta uma técnica marcada como ensaiada em sala. Aprender a usá-la na margem do rio custa uma hora e devolve um dado que não serve."
            )
          : T(
              `El terreno ya está abierto y quedan ${tecnicasPendientes.length} técnicas sin marcar como ensayadas en la sala. Aprenderlas en la orilla cuesta una hora y devuelve un dato que no sirve.`,
              `O campo já está aberto e faltam ${tecnicasPendientes.length} técnicas marcadas como ensaiadas em sala. Aprendê-las na margem do rio custa uma hora e devolve um dado que não serve.`
            ),
    });
  }

  // El cierre escrito: quien no entiende qué está haciendo se detecta aquí.
  if (e.estudiantes) {
    for (const etapa of ETAPAS) {
      const h = hoja(etapa.id);
      if (h.estado === "sin_abrir" || h.entregaron === null) continue;
      const faltaron = e.estudiantes - h.entregaron;
      if (faltaron >= 3) {
        lista.push({
          id: `cierre-${etapa.id}`,
          tono: "aviso",
          etapa: etapa.id,
          texto: T(
            `En «${etapa.nombre}» entregaron el cierre ${h.entregaron} de ${e.estudiantes}. Los que no escriben suelen ser los mismos, y son los que no van a levantar la mano.`,
            `Em «${etapa.nombre}» entregaram o fechamento ${h.entregaron} de ${e.estudiantes}. Quem não escreve costuma ser sempre o mesmo, e é quem não vai levantar a mão.`
          ),
        });
      }
    }
  }

  // Una propuesta con una sola versión no pasó por la crítica de nadie.
  const propuesta = hoja("propuesta");
  if (propuesta.estado !== "sin_abrir" && propuesta.registro.versiones.length <= 1) {
    lista.push({
      id: "una-version",
      tono: "nota",
      etapa: "propuesta",
      texto: T(
        "La propuesta va en una sola versión. La etapa pide una primera, que se la critiquen entre ellos, y rehacerla: la segunda versión es donde se aprende.",
        "A proposta está numa versão só. A etapa pede uma primeira, que os colegas critiquem, e refazer: é na segunda versão que se aprende."
      ),
    });
  }

  // Se entregó y todavía no contesta nadie.
  const difusion = hoja("difusion");
  const sinRespuesta = difusion.registro.entregas.filter((x) => !x.respuesta.trim());
  if (difusion.estado !== "sin_abrir" && sinRespuesta.length > 0) {
    lista.push({
      id: "sin-respuesta",
      tono: "nota",
      etapa: "difusion",
      texto: T(
        `Hay ${sinRespuesta.length} entrega${
          sinRespuesta.length === 1 ? "" : "s"
        } sin respuesta anotada. Que no contesten también es una respuesta, y el curso puede hacer algo con ella.`,
        `Há ${sinRespuesta.length} entrega${
          sinRespuesta.length === 1 ? "" : "s"
        } sem resposta anotada. Não responder também é uma resposta, e a turma pode fazer algo com ela.`
      ),
    });
  }

  // Las razones del primer día siguen tapadas cuando ya toca destaparlas.
  const problematica = hoja("problematica");
  const analisis = hoja("analisis");
  const hayRazones = Boolean(
    problematica.registro.ladoA.trim() || problematica.registro.ladoB.trim()
  );
  const volvieron = terreno.estado === "cerrada" || analisis.estado !== "sin_abrir";
  if (volvieron && hayRazones && !problematica.registro.destapado) {
    lista.push({
      id: "destapar",
      tono: "nota",
      etapa: analisis.estado !== "sin_abrir" ? "analisis" : "terreno",
      texto: T(
        "El curso ya volvió del terreno y las razones que escribieron el primer día siguen tapadas. Ponerlas al lado de lo que trajeron es lo que hace que la salida haya servido para algo.",
        "A turma já voltou do campo e as razões que escreveram no primeiro dia continuam cobertas. Colocá-las ao lado do que trouxeram é o que faz a saída ter servido para alguma coisa."
      ),
    });
  }

  return lista;
}
