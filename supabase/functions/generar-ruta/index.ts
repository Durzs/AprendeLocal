/**
 * Genera una ruta para una escuela concreta, con huecos que el docente llena.
 *
 * Las cuatro rutas escritas a mano sirven mientras el lugar se parezca al que
 * tenían en la cabeza quienes las escribieron. En cuanto una escuela tiene un
 * estero que se seca en enero y un objetivo de fotosíntesis, la que más calza
 * sigue sin calzar. Esto arma una para ese lugar y esos objetivos.
 *
 * LO QUE NO HACE, Y ES LO IMPORTANTE
 *
 * No inventa la parte local. Hay cuatro campos que el modelo deja vacíos a
 * propósito, porque son los únicos que no puede saber y los únicos donde
 * equivocarse cuesta caro:
 *
 *   · a quién se le entrega el producto     (una persona u organización real)
 *   · a quién de la comunidad se le pregunta (alguien con nombre)
 *   · el punto exacto de la salida           (dónde se para el curso)
 *   · qué cuidar en ese lugar                (lo que el docente ya sabe)
 *
 * Un modelo que rellena esos cuatro escribe «el Comité de Agua Potable Rural
 * de la localidad», que suena bien y no existe. El docente manda a su curso a
 * entregarle un informe a nadie. Por eso vuelven vacíos y la pantalla no deja
 * dar la ruta por lista hasta que estén escritos: ahí está la co-construcción,
 * no en un botón de editar.
 *
 * QUIÉN PUEDE LLAMARLA
 *
 * Solo alguien con sesión iniciada, y con un tope por día.
 *
 * Cada llamada le cuesta plata a AprendeLocal. La clave anónima con que el
 * navegador invoca las funciones va dentro del JavaScript que se descarga: es
 * pública por diseño, la lee cualquiera con la consola abierta. Sin esta
 * comprobación, cualquiera en internet puede escribir un bucle y gastarse el
 * presupuesto de la cuenta en una tarde.
 *
 * Todo lo demás de armar una ruta sigue sin pedir cuenta: las cuatro rutas
 * escritas, las cuatro láminas, las preguntas y los documentos para imprimir
 * funcionan sin sesión y sin señal. Lo único detrás de la puerta es lo que
 * cuesta dinero.
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

const MODELOS_CANDIDATOS = [
  Deno.env.get("ANTHROPIC_MODEL"),
  "claude-sonnet-5",
  "claude-haiku-4-5-20251001",
].filter(Boolean) as string[];

const MAX_TOKENS = 8000;

/** Cuántas rutas puede armar una persona en un día. */
const TOPE_DIARIO = 20;
const TIEMPO_MAXIMO_MS = 100_000;

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

/** Los cuatro campos que el modelo no llena nunca. */
const HUECOS = ["producto_para_quien", "preguntar_a", "punto_de_salida", "que_cuidar"] as const;

const SYSTEM_PROMPT = `Eres un profesor rural de La Araucanía, en Chile, que lleva veinte años haciendo clases en una sala con varios cursos a la vez. Le estás pasando a un colega una ruta de trabajo para su escuela.

Escribes como se le habla a otro profesor: frases cortas, en voz activa, diciendo qué hace la gente. Nunca uses estas palabras ni ninguna de su familia: andamiaje, metacognición, constructivismo, competencias, aprendizaje significativo, zona de desarrollo, transversal, holístico, empoderar, potenciar, facilitar procesos, dispositivo pedagógico, mediar, significatividad, praxis. Si una frase se puede decir con menos palabras, dila con menos.

QUÉ ESTÁS ARMANDO
Un proyecto de tres a seis semanas que sale del lugar donde está esa escuela, cubre los objetivos del programa que te den, y termina con algo que el curso le entrega a alguien de afuera.

CÓMO REPARTES EL TRABAJO POR EDAD
De 8 a 11 años el trabajo es conocer el lugar: mirar, contar, dibujar, medir cosas simples. De 12 a 15 aparece hacer algo por él: comparar, sacar cuentas, escribir lo que encontraron para que alguien lo lea. A un niño de nueve años no le pides que resuelva la contaminación del río; le pides que dibuje por dónde pasa el agua. En una sala con varios cursos, los chicos levantan los datos que los grandes necesitan para sacar la cuenta.

LO QUE NO SABES Y NO VAS A INVENTAR
Hay cuatro cosas de esa escuela que no puedes saber. Las devuelves como texto vacío, siempre, sin excepción:
- producto_para_quien: a quién se le entrega el trabajo. Inventar una organización que no existe manda al curso a entregarle algo a nadie.
- preguntar_a: quién de esa comunidad sabe del tema.
- punto_de_salida: dónde se para exactamente el curso.
- que_cuidar: qué hay que mirar en ese lugar para que nadie se lastime.
No escribas «el comité local», ni «un vecino», ni «la directiva»: eso es inventar con otras palabras. Vacío.

RESPONDE SOLO CON JSON, sin texto antes ni después, con esta forma exacta:
{
"titulo":"",
"pregunta_guia":"",
"producto_que":"",
"producto_para_quien":"",
"semanas":3,
"fases":[{"semana":1,"titulo":"","que_ocurre":""}],
"por_curso":[{"nivel":"5º","postura":"explorar","papel":"","codigos":[]}],
"materiales":[""],
"preguntar_a":"",
"pregunta_a_la_comunidad":"",
"punto_de_salida":"",
"que_cuidar":"",
"mapuzugun":[{"termino":"","castellano":""}]
}

Reglas de las claves:
- pregunta_guia: si el profesor ya escribió la suya, respétala tal cual. Si no, escribe una que se conteste midiendo y que aguante todas las semanas.
- postura: "explorar" para los cursos menores, "actuar" para los mayores.
- codigos: solo los códigos de objetivo que te pasaron, repartidos entre los cursos. No inventes códigos.
- materiales: cosas que hay en una escuela rural o en una casa. Nada que haya que comprar. Nada de placas ni sensores.
- mapuzugun: dos a cuatro palabras del lugar o del fenómeno, en grafemario Azümchefe. Si no estás seguro de una, no la pongas.
- fases: una por semana, con lo que ocurre esa semana, incluida la salida a terreno.`;

/** Saca el texto de todos los bloques, no solo del primero. */
function textoDe(datos: any): string {
  const bloques = Array.isArray(datos?.content) ? datos.content : [];
  return bloques
    .filter((b: any) => b?.type === "text" && typeof b.text === "string")
    .map((b: any) => b.text)
    .join("");
}

/** Acepta JSON con cerca o sin ella. */
function parsear(texto: string): Record<string, any> | null {
  if (!texto?.trim()) return null;
  const limpio = texto.replace(/^[\s\S]*?```(?:json)?\s*/i, "").replace(/```[\s\S]*$/i, "");
  for (const candidato of [texto, limpio]) {
    const desde = candidato.indexOf("{");
    const hasta = candidato.lastIndexOf("}");
    if (desde === -1 || hasta <= desde) continue;
    try {
      return JSON.parse(candidato.slice(desde, hasta + 1));
    } catch {
      /* se prueba el siguiente */
    }
  }
  return null;
}

/**
 * Deja los cuatro huecos vacíos pase lo que pase.
 *
 * El prompt lo pide, pero un prompt es una petición y no una garantía. Si el
 * modelo se entusiasma e inventa a quién entregarle el informe, aquí se borra:
 * más vale un campo vacío que el docente ve, que uno inventado que no revisa.
 */
function vaciarHuecos(r: Record<string, any>): string[] {
  const inventados: string[] = [];
  for (const clave of HUECOS) {
    if (typeof r[clave] === "string" && r[clave].trim()) {
      inventados.push(clave);
    }
    r[clave] = "";
  }
  return inventados;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS, status: 200 });
  }
  if (req.method !== "POST") {
    return responder({ error: "Solo POST." }, 405);
  }

  /*
   * Quién llama. La clave anónima es un JWT válido, así que el portón de
   * Supabase la deja pasar: hay que preguntar por el usuario de verdad.
   */
  const autorizacion = req.headers.get("Authorization") ?? "";
  const token = autorizacion.replace(/^Bearer\s+/i, "");
  const urlSupabase = Deno.env.get("SUPABASE_URL");
  const claveServicio = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!urlSupabase || !claveServicio) {
    return responder(
      { error: "sin_configurar", mensaje: "Falta configurar el proyecto de Supabase." },
      503
    );
  }

  const admin = createClient(urlSupabase, claveServicio);
  const { data: quien } = await admin.auth.getUser(token);
  const usuario = quien?.user ?? null;

  if (!usuario) {
    return responder(
      {
        error: "sin_sesion",
        mensaje:
          "Para armar una ruta con el modelo hay que entrar con una cuenta. " +
          "Todo lo demás —las rutas escritas, las láminas y los documentos— " +
          "funciona sin cuenta.",
      },
      401
    );
  }

  /*
   * El tope diario. Un docente arma una o dos rutas por unidad, no cuarenta;
   * si alguien llega a veinte en un día, o está probando o algo va mal, y en
   * los dos casos conviene parar antes de que la cuenta lo note.
   *
   * Se lleva con la clave de servicio para que nadie pueda editarse su propio
   * contador desde el navegador.
   */
  const hoy = new Date().toISOString().slice(0, 10);
  const { data: uso } = await admin
    .from("usos_ia")
    .select("veces")
    .eq("usuario", usuario.id)
    .eq("dia", hoy)
    .maybeSingle();

  const veces = uso?.veces ?? 0;
  if (veces >= TOPE_DIARIO) {
    return responder(
      {
        error: "tope",
        mensaje:
          `Llegaste a ${TOPE_DIARIO} rutas armadas hoy. Mañana se puede de nuevo, ` +
          "y mientras tanto las rutas escritas siguen ahí.",
      },
      429
    );
  }

  const clave = Deno.env.get("ANTHROPIC_API_KEY");
  if (!clave) {
    return responder(
      {
        error: "sin_clave",
        mensaje:
          "Falta configurar ANTHROPIC_API_KEY en los secretos del proyecto de Supabase. " +
          "Mientras tanto la aplicación usa las rutas escritas a mano.",
      },
      503
    );
  }

  let cuerpo: Record<string, any>;
  try {
    cuerpo = await req.json();
  } catch {
    return responder({ error: "El cuerpo tiene que ser JSON." }, 400);
  }

  const {
    objetivos = [],
    cursos = [],
    semanas,
    entorno = "",
    ubicacion = "",
    fenomeno = "",
    indagacion = "",
    producto = "",
    tematicas = "",
    preguntaGuia = "",
    evaluacion = [],
  } = cuerpo;

  if (!Array.isArray(objetivos) || objetivos.length === 0) {
    return responder(
      { error: "sin_objetivos", mensaje: "Hacen falta los objetivos de aprendizaje." },
      400
    );
  }

  const encargo = [
    `CURSOS EN LA SALA: ${cursos.join(", ") || "sin decir"}`,
    `SEMANAS: ${semanas ?? 3}`,
    "",
    "OBJETIVOS DEL PROGRAMA QUE HAY QUE CUBRIR:",
    ...objetivos.map(
      (o: any) => `- ${o.codigo} (${o.nivel}): ${o.texto}`
    ),
    "",
    `LUGAR: ${ubicacion || entorno || "sin decir"}`,
    `QUÉ PASA AHÍ: ${fenomeno || "sin decir"}`,
    `QUÉ SE PODRÍA AVERIGUAR: ${indagacion || "sin decir"}`,
    `TEMÁTICAS: ${tematicas || "sin decir"}`,
    `PRODUCTO QUE ESPERA EL PROFESOR: ${producto || "sin decir"}`,
    `CÓMO VA A EVALUAR: ${(evaluacion as string[]).join(", ") || "sin decir"}`,
    "",
    preguntaGuia
      ? `LA PREGUNTA QUE EL PROFESOR YA ESCRIBIÓ, y que tienes que respetar tal cual: ${preguntaGuia}`
      : "El profesor todavía no escribió su pregunta: propón una.",
  ].join("\n");

  const arranque = Date.now();
  let ultimoError = "";

  for (const modelo of MODELOS_CANDIDATOS) {
    if (Date.now() - arranque > TIEMPO_MAXIMO_MS) break;
    try {
      const respuesta = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": clave,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: modelo,
          max_tokens: MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: encargo }],
        }),
      });

      if (!respuesta.ok) {
        ultimoError = `${modelo}: ${respuesta.status} ${await respuesta.text()}`.slice(0, 400);
        continue;
      }

      const datos = await respuesta.json();
      const texto = textoDe(datos);
      if (!texto) {
        ultimoError = `${modelo}: la respuesta no traía texto (stop_reason ${datos?.stop_reason}).`;
        continue;
      }

      const ruta = parsear(texto);
      if (!ruta) {
        ultimoError = `${modelo}: la respuesta no era JSON.`;
        continue;
      }

      const inventados = vaciarHuecos(ruta);

      // Se cuenta solo cuando la llamada salió bien: cobrarle al docente un
      // intento que falló por nuestra parte sería cobrarle nuestro error.
      await admin
        .from("usos_ia")
        .upsert({ usuario: usuario.id, dia: hoy, veces: veces + 1 }, { onConflict: "usuario,dia" });

      return responder({
        ruta,
        // Los huecos van explícitos para que la pantalla sepa cuáles pedir sin
        // tener que acordarse de la lista.
        huecos: HUECOS,
        modelo,
        // Si el modelo rellenó algo que no debía, queda anotado. No se le
        // muestra al docente, pero sirve para saber si el prompt se está
        // desobedeciendo.
        inventados,
      });
    } catch (e) {
      ultimoError = `${modelo}: ${e instanceof Error ? e.message : String(e)}`.slice(0, 400);
    }
  }

  return responder(
    {
      error: "sin_respuesta",
      mensaje:
        "No se pudo armar la ruta. Puedes seguir con una de las rutas escritas mientras tanto.",
      detalle: ultimoError,
    },
    502
  );
});
