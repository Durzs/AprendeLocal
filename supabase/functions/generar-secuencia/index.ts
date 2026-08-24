/**
 * Generación de secuencias de enseñanza — Edge Function.
 *
 * Sustituye al endpoint `POST /sequences` de la API FastAPI. Era lo único que
 * de verdad necesitaba un servidor: la clave de Anthropic no puede viajar al
 * navegador. Todo lo demás —objetivos, puntos, progreso— lo sirve Supabase
 * directamente con sus políticas de lectura, así que con esto desaparece la
 * necesidad de desplegar y mantener un servicio aparte.
 *
 * Se consulta la base con el token de quien llama, no con la clave de
 * servicio: así siguen aplicándose las políticas RLS en lugar de saltárselas,
 * que era el problema de la API anterior.
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * Modelos por orden de preferencia.
 *
 * La lista anterior —claude-3-*, claude-2.1, claude-instant— estaba entera
 * descatalogada, y ese fue el origen de casi todo lo demás: las llamadas
 * fallaban, y para que algo volviera se añadieron reparador de JSON y relleno
 * de estructura. Con un modelo vigente esas muletas dejan de hacer falta.
 *
 * Sonnet primero por equilibrio entre calidad y latencia; Haiku como
 * alternativa rápida si Sonnet no estuviera disponible.
 */
const MODELOS_CANDIDATOS = [
  Deno.env.get("ANTHROPIC_MODEL"),
  "claude-sonnet-5",
  "claude-haiku-4-5-20251001",
  "claude-opus-5",
].filter(Boolean) as string[];

/**
 * Seis etapas con el ejemplo resuelto paso a paso no caben en 4096 tokens: la
 * respuesta se truncaba siempre. El tamaño lo controlan las cotas por lista
 * del prompt; esto es holgura para que no se corte a mitad del JSON.
 */
const MAX_TOKENS = 16000;

/**
 * Por debajo del límite del entorno, para poder responder con un motivo en vez
 * de que la ejecución muera sin dejar respuesta.
 */
const TIEMPO_MAXIMO_MS = 110_000;

const ETAPAS = [
  "instruccion_explicita",
  "ejemplo_resuelto",
  "practica_guiada",
  "practica_autonoma",
  "salida_terreno",
  "recuperacion_espaciada",
] as const;

const NOMBRE_VISIBLE: Record<string, string> = {
  instruccion_explicita: "lo que explicas tú en la clase 1",
  ejemplo_resuelto: "el ejemplo que muestras en la clase 1",
  practica_guiada: "los ejercicios que resuelven contigo",
  practica_autonoma: "los ejercicios que resuelven solos",
  salida_terreno: "la salida a medir",
  recuperacion_espaciada: "las preguntas de las semanas siguientes",
};

const SYSTEM_PROMPT =
  `Eres un diseñador instruccional que prepara material para docentes rurales del sur de Chile (La Araucanía), muchos de ellos a cargo de aulas multigrado donde un solo profesor atiende varios cursos a la vez.

Tu trabajo NO es diseñar un proyecto para que el estudiante descubra por su cuenta. Es preparar una secuencia de enseñanza en la que la guía empieza alta y se retira progresivamente, siguiendo la evidencia sobre carga cognitiva y ejemplos resueltos.

Reglas que no puedes romper:

1. EL LUGAR ES EL CONTEXTO, NO EL MÉTODO. El territorio es el material del que están hechos el ejemplo y la práctica, no el punto de partida de una exploración libre.
2. EL EJEMPLO RESUELTO ES EL CENTRO. Debe estar completamente desarrollado, paso a paso, con los números o las observaciones ya hechas y explicadas.
3. LA SALIDA A TERRENO VA DESPUÉS de la práctica guiada, nunca antes.
4. HABLAS AL DOCENTE. La instrucción explícita se redacta como notas para que el profesor las explique él.
5. MATERIALES DE ZONA RURAL: cuaderno, huincha, lupa, termómetro, botellas recicladas, agua del estero.
6. EL PROTOCOLO DE TERRENO LLEVA CAMPOS CONCRETOS Y MEDIBLES, con unidad.
7. LA RECUPERACIÓN ESPACIADA USA LOS DATOS QUE LOS PROPIOS ESTUDIANTES TOMARON, con marcadores {dato_del_estudiante}.
8. CULTURA MAPUCHE: solo si es pertinente, como fuente de conocimiento y nunca como adorno. Si la incluyes, márcalo en requiere_consulta.
9. AULA MULTIGRADO: cuando recibas más de un objetivo, son cursos distintos sentados en la MISMA sala con UN solo docente. No escribas varias clases paralelas: escribe UNA. La instrucción explícita, el ejemplo resuelto y la salida a terreno son comunes a todos. Lo que cambia por curso es la práctica y qué mide cada uno en la salida, y eso va en "por_nivel". Reparte el trabajo de terreno para que los cursos dependan unos de otros: el curso mayor toma la medición que el menor necesita para su tarea.

LARGO Y CONCISIÓN. Sé sintético y preciso:
- notas_para_el_docente: 3 a 4 notas concisas
- pasos del ejemplo resuelto: 3 a 5 pasos claros con razonamiento y resultado
- ejercicios de práctica guiada: 2 a 3 ejercicios breves
- ejercicios de práctica autónoma: 2 a 3 ejercicios breves
- protocolo de terreno: 2 a 4 campos con unidad
- recuperacion_espaciada: 2 preguntas breves
- en por_nivel, por cada curso: 1 a 2 ejercicios guiados y 1 autónomo (enunciados breves)

Responde ÚNICAMENTE con el objeto JSON (sin texto introductorio ni explicaciones):
{"titulo":"","objetivo_codigo":"","sesiones":2,"sintesis_docente":"","instruccion_explicita":{"duracion_min":20,"notas_para_el_docente":[],"conceptos_clave":[],"errores_frecuentes":[]},"ejemplo_resuelto":{"situacion":"","pasos":[{"paso":1,"accion":"","razonamiento":"","resultado":""}],"respuesta":""},"practica_guiada":{"instrucciones_docente":"","ejercicios":[{"enunciado":"","apoyo":"","respuesta_esperada":""}]},"practica_autonoma":{"ejercicios":[{"enunciado":"","respuesta_esperada":""}]},"salida_terreno":{"duracion_min":90,"preparacion":[],"protocolo":[{"campo":"","instruccion":"","unidad":"","tipo":"numero"}],"seguridad":[]},"recuperacion_espaciada":[{"semanas_despues":1,"pregunta":"","respuesta_esperada":""}],"materiales":[],"requiere_consulta":false}

Con más de un objetivo, añade además la clave "por_nivel", con una entrada por curso:
"por_nivel":[{"nivel":"","objetivo_codigo":"","practica_guiada":{"ejercicios":[{"enunciado":"","apoyo":"","respuesta_esperada":""}]},"practica_autonoma":{"ejercicios":[{"enunciado":"","respuesta_esperada":""}]},"rol_en_terreno":""}]`;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function responder(cuerpo: unknown, status = 200): Response {
  if (status === 204 || cuerpo === null) {
    return new Response(null, {
      status,
      headers: CORS,
    });
  }
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

/**
 * Parser y reparador de JSON ultra robusto.
 * Tolera bloques de código, texto exterior y respuestas truncadas cerrando llaves abiertas.
 * Si todo falla, devuelve un objeto seguro para que asegurarEstructura() genere la secuencia completa.
 */
function parsear(texto: string): Record<string, unknown> {
  if (!texto || typeof texto !== "string" || !texto.trim()) {
    return {};
  }

  let limpio = texto.trim();

  // Quitar markdown ```json ... ```
  if (limpio.includes("```")) {
    limpio = limpio.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  }

  // Extraer desde el primer '{'
  const primerBrace = limpio.indexOf("{");
  if (primerBrace !== -1) {
    limpio = limpio.slice(primerBrace);
  } else {
    return {};
  }

  // 1. Intento de parseo directo
  try {
    const datos = JSON.parse(limpio);
    if (typeof datos === "object" && datos !== null && !Array.isArray(datos)) {
      return datos as Record<string, unknown>;
    }
  } catch {}

  // 2. Si falló, intentar extraer hasta el último '}'
  const ultimoBrace = limpio.lastIndexOf("}");
  if (ultimoBrace !== -1 && ultimoBrace > 0) {
    try {
      const subLimpio = limpio.slice(0, ultimoBrace + 1);
      const datos = JSON.parse(subLimpio);
      if (typeof datos === "object" && datos !== null && !Array.isArray(datos)) {
        return datos as Record<string, unknown>;
      }
    } catch {}
  }

  // 3. Auto-reparador de JSON truncado / abierto
  let s = limpio;
  s = s.replace(/:\s*$/, ': ""');
  s = s.replace(/,\s*$/, "");

  let enString = false;
  let escapado = false;
  const pila: string[] = [];

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (escapado) {
      escapado = false;
      continue;
    }
    if (c === "\\") {
      escapado = true;
      continue;
    }
    if (c === '"') {
      enString = !enString;
      continue;
    }
    if (!enString) {
      if (c === "{" || c === "[") {
        pila.push(c);
      } else if (c === "}" && pila[pila.length - 1] === "{") {
        pila.pop();
      } else if (c === "]" && pila[pila.length - 1] === "[") {
        pila.pop();
      }
    }
  }

  // Cerrar string abierto
  if (enString) {
    s += '"';
  }
  s = s.replace(/:\s*$/, ': ""');
  s = s.replace(/,\s*$/, "");

  // Cerrar todas las estructuras pendientes en orden inverso
  while (pila.length > 0) {
    const abierto = pila.pop();
    if (abierto === "{") s += "}";
    if (abierto === "[") s += "]";
  }

  try {
    const datosReparados = JSON.parse(s);
    if (typeof datosReparados === "object" && datosReparados !== null && !Array.isArray(datosReparados)) {
      return datosReparados as Record<string, unknown>;
    }
  } catch {}

  // Fallback seguro si no se pudo reconstruir
  return {};
}

/**
 * Asegura que todas las etapas y campos mínimos requeridos existan en la secuencia.
 */
/**
 * Completa lo que el modelo no devolvió, para que la pantalla no se rompa.
 *
 * Lo que rellena NO es una clase: son marcadores de posición genéricos. Antes
 * viajaban con el mismo sello de «generado» que el resto, así que el docente
 * los habría descubierto delante del curso. Ahora se anota qué se rellenó y se
 * devuelve al frontend, que ya sabe mostrar esa lista como algo a revisar.
 *
 * Devuelve las etapas sustituidas por relleno.
 */
function asegurarEstructura(s: Record<string, any>, codigos: string[], objetivos: any[], poi: any): string[] {
  const rellenadas: string[] = [];
  s.titulo = s.titulo || `Secuencia de Enseñanza: ${poi?.name || "Territorio Local"}`;
  s.sesiones = s.sesiones || 2;
  s.sintesis_docente = s.sintesis_docente || "Secuencia de enseñanza territorial adaptada para el aula.";

  if (!s.instruccion_explicita || typeof s.instruccion_explicita !== "object") {
    rellenadas.push("instruccion_explicita");
    s.instruccion_explicita = {
      duracion_min: 20,
      notas_para_el_docente: ["Explicar el concepto central anclado al lugar."],
      conceptos_clave: ["Observación", "Medición"],
      errores_frecuentes: ["Confundir estimación con medición directa."],
    };
  }

  if (
    !s.ejemplo_resuelto ||
    typeof s.ejemplo_resuelto !== "object" ||
    !Array.isArray(s.ejemplo_resuelto.pasos) ||
    s.ejemplo_resuelto.pasos.length === 0
  ) {
    rellenadas.push("ejemplo_resuelto");
    s.ejemplo_resuelto = {
      situacion: `Análisis de terreno en ${poi?.name || "el territorio"}.`,
      pasos: [
        { paso: 1, accion: "Identificar la variable a medir en el lugar.", razonamiento: "Permite delimitar el alcance del estudio.", resultado: "Variable definida." },
        { paso: 2, accion: "Registrar datos con la unidad correspondiente.", razonamiento: "Asegura la comparabilidad de las mediciones.", resultado: "Registro completo." },
      ],
      respuesta: "Datos registrados y analizados correctamente.",
    };
  }

  if (!s.practica_guiada || typeof s.practica_guiada !== "object") {
    rellenadas.push("practica_guiada");
    s.practica_guiada = {
      instrucciones_docente: "Guiar a los estudiantes en la resolución conjunta.",
      ejercicios: [{ enunciado: `Calcular la medición en ${poi?.name}.`, apoyo: "Revisar los pasos del ejemplo.", respuesta_esperada: "Resultado obtenido." }],
    };
  }

  if (!s.practica_autonoma || typeof s.practica_autonoma !== "object") {
    rellenadas.push("practica_autonoma");
    s.practica_autonoma = {
      ejercicios: [{ enunciado: "Resolver el ejercicio individualmente en el cuaderno.", respuesta_esperada: "Respuesta correcta." }],
    };
  }

  if (!s.salida_terreno || typeof s.salida_terreno !== "object") {
    rellenadas.push("salida_terreno");
    s.salida_terreno = {
      duracion_min: 90,
      preparacion: ["Revisar materiales y libreta de campo."],
      protocolo: [{ campo: "Medición principal", instruccion: "Medir en el punto indicado", unidad: "m", tipo: "numero" }],
      seguridad: ["No alejarse del grupo."],
    };
  }

  if (!Array.isArray(s.recuperacion_espaciada) || s.recuperacion_espaciada.length === 0) {
    rellenadas.push("recuperacion_espaciada");
    s.recuperacion_espaciada = [
      { semanas_despues: 1, pregunta: "¿Qué medición realizamos en la salida?", respuesta_esperada: "La variable estudiada." },
      { semanas_despues: 3, pregunta: "¿Cómo se relaciona ese dato con el ecosistema?", respuesta_esperada: "Explica el fenómeno observado." },
    ];
  }

  if (!Array.isArray(s.materiales) || s.materiales.length === 0) {
    s.materiales = ["Cuaderno de campo", "Lápiz", "Huincha de medir", "Lupa"];
  }

  if (codigos.length > 1 && (!Array.isArray(s.por_nivel) || s.por_nivel.length === 0)) {
    rellenadas.push("por_nivel");
    s.por_nivel = objetivos.map((o: any) => ({
      nivel: o.level || "Básico",
      objetivo_codigo: o.code,
      practica_guiada: { ejercicios: [{ enunciado: `Actividad práctica guiada para ${o.level || o.code}`, apoyo: "Guiarse por el ejemplo resuelto", respuesta_esperada: "Completado" }] },
      practica_autonoma: { ejercicios: [{ enunciado: `Actividad autónoma para ${o.level || o.code}`, respuesta_esperada: "Completado" }] },
      rol_en_terreno: `Encargado de la medición específica del nivel ${o.level || o.code}`,
    }));
  }

  return rellenadas;
}

function legible(campo: string): string {
  const partes = String(campo).trim().split(/[_\s-]+/).filter(Boolean);
  if (partes.length === 0) return campo;
  if (partes.length > 1 && /^(m|cm|mm|km|m2|m3|ha|l|ml|kg|g|s|seg|min|h|c|pct)$/i.test(partes[partes.length - 1])) {
    partes.pop();
  }
  const texto = partes.join(" ");
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function validar(s: Record<string, any>): string[] {
  const problemas: string[] = [];

  for (const etapa of ETAPAS) {
    if (!(etapa in s)) problemas.push(`Falta ${NOMBRE_VISIBLE[etapa]}`);
  }

  const pasos = s.ejemplo_resuelto?.pasos ?? [];
  if (pasos.length === 0) {
    problemas.push("El ejemplo no trae los pasos resueltos");
  } else {
    const sinPorque = pasos
      .map((p: any, i: number) => (String(p?.razonamiento ?? "").trim() ? null : p?.paso ?? i + 1))
      .filter((x: unknown) => x !== null);
    if (sinPorque.length > 0) {
      problemas.push(
        `En el ejemplo, ${sinPorque.length > 1 ? "los pasos" : "el paso"} ${sinPorque.join(", ")} no explican por qué se hacen así`,
      );
    }
  }
  if (!String(s.ejemplo_resuelto?.respuesta ?? "").trim()) {
    problemas.push("El ejemplo no termina en un resultado");
  }

  const protocolo = s.salida_terreno?.protocolo ?? [];
  if (protocolo.length === 0) problemas.push("La salida no dice qué hay que medir");
  for (const campo of protocolo) {
    if (!String(campo?.campo ?? "").trim()) problemas.push("Una de las mediciones no tiene nombre");
    if (campo?.tipo === "numero" && !String(campo?.unidad ?? "").trim()) {
      problemas.push(
        `La medición «${legible(campo?.campo ?? "?")}» no dice en qué unidad anotarla`,
      );
    }
  }

  if (Array.isArray(s.__codigos_pedidos) && s.__codigos_pedidos.length > 1) {
    const bloques = Array.isArray(s.por_nivel) ? s.por_nivel : [];
    if (bloques.length === 0) {
      problemas.push("La secuencia no reparte el trabajo entre los cursos de la sala");
    } else {
      const cubiertos = new Set(bloques.map((b: any) => b?.objetivo_codigo));
      const sinTrabajo = s.__codigos_pedidos.filter((c: string) => !cubiertos.has(c));
      if (sinTrabajo.length > 0) {
        problemas.push(`Sin actividad propia para ${sinTrabajo.join(", ")}`);
      }
      for (const b of bloques) {
        const guiada = b?.practica_guiada?.ejercicios?.length ?? 0;
        const autonoma = b?.practica_autonoma?.ejercicios?.length ?? 0;
        if (guiada + autonoma === 0) {
          problemas.push(`El curso ${b?.nivel ?? b?.objetivo_codigo ?? "?"} no tiene ejercicios`);
        }
      }
    }
  }

  const recuperacion = s.recuperacion_espaciada ?? [];
  if (recuperacion.length < 2) {
    problemas.push("Hay que volver a preguntar al menos en dos momentos distintos");
  }

  return problemas;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS, status: 200 });
  }
  if (req.method !== "POST") return responder({ error: "Método no permitido" }, 405);

  const claveAnthropic = Deno.env.get("ANTHROPIC_API_KEY");
  if (!claveAnthropic) {
    return responder(
      {
        error:
          "Falta configurar ANTHROPIC_API_KEY en los secretos del proyecto. " +
          "Sin ella no se puede generar la secuencia.",
      },
      503,
    );
  }

  let cuerpo: {
    objective_code?: string;
    objective_codes?: string[];
    point_id?: string;
    sesiones?: number;
    notas_docente?: string;
  };
  try {
    cuerpo = await req.json();
  } catch {
    return responder({ error: "El cuerpo de la petición no es JSON válido" }, 400);
  }

  const { objective_code, objective_codes, point_id, sesiones = 2, notas_docente = "" } = cuerpo;

  const codigos = (objective_codes?.length ? objective_codes : objective_code ? [objective_code] : [])
    .map((c) => String(c).trim())
    .filter(Boolean);

  if (codigos.length === 0 || !point_id) {
    return responder({ error: "Faltan los objetivos y el point_id" }, 400);
  }

  const MAX_OBJETIVOS = 5;
  if (codigos.length > MAX_OBJETIVOS) {
    return responder(
      { error: `Son demasiados objetivos para una sola secuencia (máximo ${MAX_OBJETIVOS}).` },
      400,
    );
  }

  const autorizacion = req.headers.get("Authorization") ?? "";
  const esJwt = /^Bearer\s+[\w-]+\.[\w-]+\.[\w-]+$/.test(autorizacion);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    esJwt ? { global: { headers: { Authorization: autorizacion } } } : undefined,
  );

  const [oaRes, poiRes] = await Promise.all([
    supabase.from("curriculum_objectives").select("*").in("code", codigos),
    supabase.from("points_of_interest").select("*").eq("id", point_id).maybeSingle(),
  ]);

  const falloLectura = oaRes.error ?? poiRes.error;
  if (falloLectura) {
    return responder(
      { error: `No se pudo leer el catálogo: ${falloLectura.message}` },
      502,
    );
  }

  const encontrados = oaRes.data ?? [];
  const poi = poiRes.data;

  const faltantes = codigos.filter((c) => !encontrados.some((o: any) => o.code === c));
  if (faltantes.length > 0) {
    return responder(
      { error: `No ${faltantes.length > 1 ? "existen los objetivos" : "existe el objetivo"} ${faltantes.join(", ")}` },
      404,
    );
  }
  if (!poi) return responder({ error: "No existe ese punto de interés" }, 404);

  const objetivos = codigos.map((c) => encontrados.find((o: any) => o.code === c));
  const oa = objetivos[0];
  const multigrado = objetivos.length > 1;

  const prompt = [
    multigrado
      ? `AULA MULTIGRADO: ${objetivos.length} cursos en la misma sala, con un solo docente.`
      : "",
    ...objetivos.map((o: any) =>
      [
        `OBJETIVO DE APRENDIZAJE (${o.code}): ${o.description}`,
        o.subject ? `  Asignatura: ${o.subject}` : "",
        o.level ? `  Nivel: ${o.level}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    ),
    "",
    "LUGAR DONDE SE ANCLA LA ENSEÑANZA",
    `Nombre: ${poi.name}`,
    `Comuna: ${poi.commune}`,
    `Ecosistema: ${poi.ecosystem_type ?? "desconocido"}`,
    `Descripción: ${poi.description ?? ""}`,
    poi.threats?.length ? `Amenazas locales: ${poi.threats.join(", ")}` : "",
    poi.heritage_type ? `Patrimonio: ${poi.heritage_type}` : "",
    "",
    `Sesiones disponibles: ${sesiones}`,
    notas_docente ? `Notas del docente: ${notas_docente}` : "",
    "",
    "Genera la secuencia completa. El ejemplo resuelto debe estar totalmente desarrollado y ambientado en este lugar.",
    multigrado
      ? "Es UNA sola clase para todos los cursos juntos. Devuelve 'por_nivel' con una entrada por cada curso listado. Sé sintético y conciso."
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const reloj = AbortSignal.timeout(TIEMPO_MAXIMO_MS);

  let respuestaIA: Response | null = null;
  let modeloElegido = "";
  let ultimoDetalleError = "";

  for (const mod of MODELOS_CANDIDATOS) {
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal: reloj,
        headers: {
          "content-type": "application/json",
          "x-api-key": claveAnthropic,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: mod,
          max_tokens: MAX_TOKENS,
          system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (resp.ok) {
        respuestaIA = resp;
        modeloElegido = mod;
        break;
      } else {
        const detalle = await resp.text();
        ultimoDetalleError = detalle;
        if (resp.status === 401 || resp.status === 403) {
          return responder({ error: `Clave de Anthropic no autorizada: ${detalle.slice(0, 300)}` }, 502);
        }
      }
    } catch (e) {
      const porTiempo = e instanceof DOMException && e.name === "TimeoutError";
      if (porTiempo) {
        return responder({ error: "La secuencia tardó demasiado en generarse y se cortó. Vuelve a intentarlo." }, 504);
      }
      ultimoDetalleError = String(e);
    }
  }

  // Ningún modelo respondió. Sin esta comprobación el fallo era mudo: el texto
  // quedaba vacío, el relleno completaba la secuencia entera y la función
  // devolvía 200 con una clase que nadie escribió.
  if (!respuestaIA) {
    return responder(
      {
        error:
          "Ningún modelo respondió. Ocurre cuando el identificador de modelo ya " +
          "no existe o la cuenta no tiene acceso a él. " +
          `Detalle: ${ultimoDetalleError.slice(0, 300) || "sin detalle"}`,
      },
      502,
    );
  }

  let textoGenerado = "";
  let motivoDeCorte = "";
  let tiposDeBloque: string[] = [];

  try {
    const datos = await respuestaIA.json();
    motivoDeCorte = String(datos?.stop_reason ?? "");
    const bloques = Array.isArray(datos?.content) ? datos.content : [];
    tiposDeBloque = bloques.map((b: any) => String(b?.type ?? "?"));

    // Se juntan TODOS los bloques de texto. Leer solo `content[0].text` daba
    // cadena vacía en cuanto el primer bloque no era de texto, y esa cadena
    // vacía viajaba sin ruido hasta convertirse en una secuencia de relleno.
    textoGenerado = bloques
      .filter((b: any) => b?.type === "text" && typeof b?.text === "string")
      .map((b: any) => b.text)
      .join("");
  } catch (e) {
    return responder(
      { error: `No se pudo leer la respuesta del generador: ${String(e).slice(0, 200)}` },
      502,
    );
  }

  // La respuesta llegó vacía. Antes esto era indistinguible de un éxito y
  // terminaba en una clase inventada; ahora se dice, con lo que hace falta
  // para saber por qué.
  if (!textoGenerado.trim()) {
    return responder(
      {
        error:
          `El generador (${modeloElegido}) respondió sin texto. ` +
          `Motivo de corte: ${motivoDeCorte || "desconocido"}. ` +
          `Bloques recibidos: ${tiposDeBloque.join(", ") || "ninguno"}.`,
      },
      502,
    );
  }

  let secuencia = parsear(textoGenerado);

  // Se cortó por longitud y no quedó nada aprovechable. Distinguirlo importa:
  // la salida es acotar la secuencia, no reintentar lo mismo.
  if (motivoDeCorte === "max_tokens" && Object.keys(secuencia).length === 0) {
    return responder(
      {
        error:
          "La secuencia salió demasiado larga y quedó incompleta. Con varios " +
          "cursos a la vez es lo que suele pasar: prueba con menos objetivos.",
      },
      502,
    );
  }

  // Completa lo que falte para que la pantalla no se rompa, y anota qué tuvo
  // que inventar: eso no es material de clase y el docente debe saberlo.
  const rellenadas = asegurarEstructura(secuencia, codigos, objetivos, poi);

  secuencia.procedencia = {
    de_datos: {
      punto: poi.name,
      comuna: poi.commune,
      ecosistema: poi.ecosystem_type ?? "",
      objetivo: codigos.join(", "),
    },
    generado_por_modelo: [...ETAPAS],
    modelo: modeloElegido || "anthropic-claude",
  };
  secuencia.objetivo_descripcion = oa.description;
  secuencia.niveles = objetivos.map((o: any) => o.level).filter(Boolean);

  if (Array.isArray(secuencia.por_nivel)) {
    for (const bloque of secuencia.por_nivel) {
      const suyo = objetivos.find((o: any) => o.code === bloque?.objetivo_codigo);
      if (suyo) {
        bloque.objetivo_descripcion = suyo.description;
        bloque.nivel = bloque.nivel || suyo.level;
      }
    }
  }

  secuencia.__codigos_pedidos = codigos;
  const problemas = validar(secuencia);
  delete secuencia.__codigos_pedidos;

  // Lo que hubo que rellenar encabeza la lista: no es material de clase, y el
  // docente tiene que verlo antes que cualquier otra observación.
  for (const etapa of rellenadas.reverse()) {
    problemas.unshift(
      `${NOMBRE_VISIBLE[etapa] ?? etapa}: el generador no lo devolvió. Lo que aparece es un texto de relleno, no una clase: escríbelo tú o vuelve a generar.`,
    );
  }

  return responder({
    secuencia,
    resumen: {
      titulo: secuencia.titulo ?? "",
      pasos_del_ejemplo: secuencia.ejemplo_resuelto?.pasos?.length ?? 0,
      campos_de_terreno: secuencia.salida_terreno?.protocolo?.length ?? 0,
      momentos_de_recuperacion: secuencia.recuperacion_espaciada?.length ?? 0,
    },
    problemas,
    utilizable: problemas.length === 0,
  });
});
