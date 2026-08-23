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

const MODELO = "claude-sonnet-5";

/**
 * Seis etapas completas —con el ejemplo resuelto paso a paso— no caben en 4000
 * tokens: se cortaba a mitad del JSON y el fallo aparecía como «no devolvió
 * JSON válido», que no dice nada de la causa real.
 */
const MAX_TOKENS = 8000;

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

Responde SOLO con un JSON válido, sin markdown, con esta forma:
{"titulo":"","objetivo_codigo":"","sesiones":4,"sintesis_docente":"","instruccion_explicita":{"duracion_min":20,"notas_para_el_docente":[],"conceptos_clave":[],"errores_frecuentes":[]},"ejemplo_resuelto":{"situacion":"","pasos":[{"paso":1,"accion":"","razonamiento":"","resultado":""}],"respuesta":""},"practica_guiada":{"instrucciones_docente":"","ejercicios":[{"enunciado":"","apoyo":"","respuesta_esperada":""}]},"practica_autonoma":{"ejercicios":[{"enunciado":"","respuesta_esperada":""}]},"salida_terreno":{"duracion_min":90,"preparacion":[],"protocolo":[{"campo":"","instruccion":"","unidad":"","tipo":"numero"}],"seguridad":[]},"recuperacion_espaciada":[{"semanas_despues":1,"pregunta":"","respuesta_esperada":""}],"materiales":[],"requiere_consulta":false}

Con más de un objetivo, añade además la clave "por_nivel", con una entrada por curso:
"por_nivel":[{"nivel":"","objetivo_codigo":"","practica_guiada":{"ejercicios":[{"enunciado":"","apoyo":"","respuesta_esperada":""}]},"practica_autonoma":{"ejercicios":[{"enunciado":"","respuesta_esperada":""}]},"rol_en_terreno":""}]`;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function responder(cuerpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

/** Tolera que el modelo envuelva el JSON en un bloque de código. */
function parsear(texto: string): Record<string, unknown> {
  let limpio = texto.trim();
  if (limpio.startsWith("```")) {
    limpio = limpio.slice(limpio.indexOf("\n") + 1);
    limpio = limpio.slice(0, limpio.lastIndexOf("```")).trim();
    if (limpio.startsWith("json")) limpio = limpio.slice(4).trim();
  }
  const datos = JSON.parse(limpio);
  if (typeof datos !== "object" || datos === null || Array.isArray(datos)) {
    throw new Error("el modelo no devolvió un objeto");
  }
  return datos as Record<string, unknown>;
}

/**
 * Los campos vienen con nombre de variable (`tiempo_flotador_s`) y estos avisos
 * los lee el docente. Es la misma conversión que hace la pantalla; aquí va
 * repetida en corto porque una Edge Function no comparte código con el bundle.
 */
function legible(campo: string): string {
  const partes = String(campo).trim().split(/[_\s-]+/).filter(Boolean);
  if (partes.length === 0) return campo;
  if (partes.length > 1 && /^(m|cm|mm|km|m2|m3|ha|l|ml|kg|g|s|seg|min|h|c|pct)$/i.test(partes[partes.length - 1])) {
    partes.pop();
  }
  const texto = partes.join(" ");
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Comprueba lo que sostiene el diseño, no la mera presencia de claves. Los
 * mensajes van redactados para el docente, que es quien los lee.
 */
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

  // En multigrado, un curso sin práctica propia es un curso que se queda
  // mirando. Es el fallo que haría abandonar la secuencia en la primera clase.
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
  const semanas = recuperacion.map((r: any) => r?.semanas_despues);
  if (semanas.length !== new Set(semanas).size) {
    problemas.push("Hay dos rondas de preguntas en la misma semana");
  }

  return problemas;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return responder({ error: "Usa POST" }, 405);

  const claveAnthropic = Deno.env.get("ANTHROPIC_API_KEY");
  if (!claveAnthropic) {
    // Mensaje explícito en vez de un 500 opaco: sin la clave no hay generación
    // posible, y conviene que se sepa por qué.
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

  const { objective_code, objective_codes, point_id, sesiones = 4, notas_docente = "" } = cuerpo;

  // `objective_code` se sigue aceptando: es lo que envían las versiones
  // anteriores del sitio, que pueden estar cacheadas en el navegador de un
  // docente durante días.
  const codigos = (objective_codes?.length ? objective_codes : objective_code ? [objective_code] : [])
    .map((c) => String(c).trim())
    .filter(Boolean);

  if (codigos.length === 0 || !point_id) {
    return responder({ error: "Faltan los objetivos y el point_id" }, 400);
  }

  // Un aula multigrado real no pasa de cuatro o cinco cursos, y cada objetivo
  // extra alarga la respuesta: por encima de eso se corta por longitud y el
  // docente recibe una secuencia incompleta.
  const MAX_OBJETIVOS = 5;
  if (codigos.length > MAX_OBJETIVOS) {
    return responder(
      { error: `Son demasiados objetivos para una sola secuencia (máximo ${MAX_OBJETIVOS}).` },
      400,
    );
  }

  // Se reenvía el token de quien llama —así siguen aplicándose las políticas
  // RLS— pero SOLO si es un JWT. Con las claves publicables nuevas
  // (`sb_publishable_…`) el encabezado no lo es, PostgREST rechaza la consulta
  // y el resultado llegaba como «No existe el objetivo», que señala al sitio
  // equivocado. Ambas tablas son de lectura pública, así que cuando no hay JWT
  // se consulta con la clave anónima y no se pierde ninguna restricción.
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

  // Un fallo de lectura no es un «no existe». Confundirlos fue justo lo que
  // mandó a buscar el problema al lado contrario.
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

  // Se conserva el orden en que el docente los eligió: es el de su planificación.
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
    "Genera la secuencia completa. El ejemplo resuelto debe estar totalmente " +
      "desarrollado y ambientado en este lugar, y la salida a terreno va después " +
      "de la práctica, no antes.",
    multigrado
      ? "Es UNA sola clase para todos los cursos juntos. Devuelve además " +
        '"por_nivel" con una entrada por cada curso listado, y reparte las ' +
        "mediciones de la salida de modo que los cursos se necesiten entre sí."
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  // Corte propio antes del límite de la plataforma: si se agota el tiempo del
  // entorno, el docente recibe un fallo opaco. Así recibe una explicación y
  // sabe que puede reintentar.
  const reloj = AbortSignal.timeout(TIEMPO_MAXIMO_MS);

  let respuestaIA: Response;
  try {
    respuestaIA = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: reloj,
      headers: {
        "content-type": "application/json",
        "x-api-key": claveAnthropic,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODELO,
        max_tokens: MAX_TOKENS,
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: prompt }],
      }),
    });
  } catch (e) {
    const porTiempo = e instanceof DOMException && e.name === "TimeoutError";
    return responder(
      {
        error: porTiempo
          ? "La secuencia tardó demasiado en generarse y se cortó. " +
            "Vuelve a intentarlo, o pide menos sesiones."
          : `No se pudo contactar al generador: ${e}`,
      },
      504,
    );
  }

  if (!respuestaIA.ok) {
    const detalle = await respuestaIA.text();
    return responder({ error: `La generación falló: ${detalle.slice(0, 300)}` }, 502);
  }

  const datos = await respuestaIA.json();

  // Una respuesta cortada por longitud llega como JSON incompleto, y el error
  // de parseo no dice por qué. Conviene distinguirlo: la salida es pedir menos
  // sesiones, no reintentar lo mismo.
  if (datos.stop_reason === "max_tokens") {
    return responder(
      {
        error:
          "La secuencia salió más larga de lo que cabe en una respuesta y quedó " +
          "incompleta. Prueba con menos sesiones.",
      },
      502,
    );
  }

  let secuencia: Record<string, any>;
  try {
    secuencia = parsear(datos.content?.[0]?.text ?? "");
  } catch (e) {
    // 502 en vez de guardar una secuencia rota que el docente descubriría
    // delante del curso.
    return responder({ error: `El modelo no devolvió JSON válido: ${e}` }, 502);
  }

  // La procedencia la pone el servidor, no el modelo: es dato, no texto generado.
  secuencia.procedencia = {
    de_datos: {
      punto: poi.name,
      comuna: poi.commune,
      ecosistema: poi.ecosystem_type ?? "",
      objetivo: codigos.join(", "),
    },
    generado_por_modelo: [...ETAPAS],
    modelo: MODELO,
  };
  secuencia.objetivo_descripcion = oa.description;
  secuencia.niveles = objetivos.map((o: any) => o.level).filter(Boolean);

  // La descripción de cada objetivo la pone el servidor: es dato del currículo,
  // no texto del modelo, y así el docente ve el enunciado oficial junto a la
  // práctica que le tocó a ese curso.
  if (Array.isArray(secuencia.por_nivel)) {
    for (const bloque of secuencia.por_nivel) {
      const suyo = objetivos.find((o: any) => o.code === bloque?.objetivo_codigo);
      if (suyo) {
        bloque.objetivo_descripcion = suyo.description;
        bloque.nivel = bloque.nivel || suyo.level;
      }
    }
  }

  // Campo de trabajo para el validador: se retira antes de responder para que
  // no viaje al navegador ni se guarde con la secuencia.
  secuencia.__codigos_pedidos = codigos;
  const problemas = validar(secuencia);
  delete secuencia.__codigos_pedidos;

  return responder({
    secuencia,
    resumen: {
      titulo: secuencia.titulo ?? "",
      pasos_del_ejemplo: secuencia.ejemplo_resuelto?.pasos?.length ?? 0,
      campos_de_terreno: secuencia.salida_terreno?.protocolo?.length ?? 0,
      momentos_de_recuperacion: secuencia.recuperacion_espaciada?.length ?? 0,
    },
    // Se devuelven al docente en lugar de ocultarse: él edita antes de usar.
    problemas,
    utilizable: problemas.length === 0,
  });
});
