/**
 * Envía la ruta del demo del stand, con su número — Edge Function.
 *
 * Al terminar el demo (/congreso) la persona deja su correo. Esta función le
 * da su número para el sorteo del cierre, guarda la ruta en `rutas_demo` y le
 * manda un correo con la ruta y el número, con copia a la casilla del equipo.
 *
 * POR QUÉ EL NAVEGADOR NO MANDA EL TEXTO
 *
 * Un formulario público que envía correos es, si se descuida, un servicio
 * gratuito de spam con nuestro remitente. Por eso:
 *
 * - El navegador manda solo identificadores (problemática, asignaturas,
 *   lugar). El texto sale de `catalogo.json`, que se genera desde el sitio
 *   (§scripts/catalogo-correo.mjs). Un identificador que no está en el
 *   catálogo se rechaza.
 * - No hay ningún campo de texto libre que llegue al correo.
 * - Hay límites: personas nuevas por conexión y hora (holgado, porque en un
 *   congreso toda la gente del stand sale por el mismo wifi), rutas por
 *   persona, y un tope diario total que protege la cuota del proveedor.
 *
 * EL NÚMERO ES PARA EL SORTEO
 *
 * Uno por persona y evento: si la misma persona arma otra ruta, recibe la
 * ruta nueva con el mismo número. Ver la migración 0008.
 *
 * SECRETOS (en Supabase → Edge Functions → Secrets, nunca en el repositorio)
 *
 *   RESEND_API_KEY     la clave de Resend (también se acepta RESEND_KEY).
 *   CORREO_REMITENTE   opcional; por defecto «AprendeLocal <hola@aprendelocal.com>».
 *                      El dominio tiene que estar verificado en Resend.
 *   SMTP_USER          opcional, el respaldo: una casilla que manda por SMTP,
 *   SMTP_PASS          por ejemplo aprendelocal@gmail.com con una contraseña
 *                      de aplicación de Google. Ver «Dos caminos» más abajo.
 *   SMTP_HOST          opcional; por defecto smtp.gmail.com.
 *   SMTP_PORT          opcional; por defecto 465. Supabase no deja salir por
 *                      los puertos 25 ni 587, así que tiene que ser 465.
 *   CORREO_COPIA       opcional; por defecto aprendelocal@gmail.com.
 *   SITIO_URL          opcional; por defecto https://www.aprendelocal.com.
 *   HASH_SAL           opcional; para el resumen de la conexión.
 *
 * SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los pone Supabase solo.
 */

import { createClient } from "jsr:@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.16";
import catalogo from "./catalogo.json" with { type: "json" };

type Idioma = "es" | "pt";

type Problema = {
  sede: "cl" | "br";
  nombre: string;
  noticia: { titular: string; medio: string; fecha: string | null } | null;
  ods: number[];
  angulos: { asignatura: string; enfoque: string }[];
};

const PROBLEMAS = catalogo.problemas as Record<string, Problema>;
const ASIGNATURAS = catalogo.asignaturas as Record<"cl" | "br", Record<string, string>>;
const LUGARES = catalogo.lugares as Record<string, string>;
const ETAPAS = catalogo.etapas as Record<Idioma, { id: string; nombre: string; enUnaLinea: string }[]>;
const ODS = catalogo.ods as Record<string, { color: string; claro: boolean; es: string; pt: string }>;

const COPIA = Deno.env.get("CORREO_COPIA") || "aprendelocal@gmail.com";

/** El primero de estos secretos que exista. */
function secreto(nombres: string[]): string | undefined {
  for (const n of nombres) {
    const v = Deno.env.get(n)?.trim();
    if (v) return v;
  }
  return undefined;
}

/**
 * La clave y el remitente de Resend.
 *
 * Se aceptan los nombres con que suele cargarse cada secreto, no solo el de
 * la documentación: la primera semana los correos no salían porque la clave
 * estaba, pero no con el nombre exacto que la función buscaba. Si falta el
 * remitente se usa el del dominio del sitio, que es el verificado en Resend.
 */
function configCorreo(): { clave?: string; remitente: string } {
  return {
    clave: secreto(["RESEND_API_KEY", "RESEND_KEY", "RESEND_TOKEN", "RESEND_APIKEY", "RESEND"]),
    remitente:
      secreto(["CORREO_REMITENTE", "RESEND_FROM", "EMAIL_FROM", "CORREO_FROM", "REMITENTE"]) ||
      "AprendeLocal <hola@aprendelocal.com>",
  };
}

/**
 * La casilla de respaldo por SMTP, si está configurada.
 *
 * Google muestra la contraseña de aplicación en cuatro grupos separados por
 * espacios; se aceptan con o sin ellos.
 */
function configSmtp(): { usuario: string; clave: string; host: string; puerto: number } | null {
  const usuario = secreto(["SMTP_USER", "GMAIL_USER", "SMTP_USUARIO"]);
  const clave = secreto(["SMTP_PASS", "SMTP_PASSWORD", "GMAIL_APP_PASSWORD", "GMAIL_PASS"])?.replace(/\s+/g, "");
  if (!usuario || !clave) return null;
  return {
    usuario,
    clave,
    host: secreto(["SMTP_HOST"]) || "smtp.gmail.com",
    puerto: Number(secreto(["SMTP_PORT"])) || 465,
  };
}

/**
 * Qué secretos de correo ve la función, solo por nombre y nunca su valor,
 * para que `error_envio` diga qué falta en vez de un genérico.
 */
function diagnosticoCorreo(): string {
  let vistos: string[] = [];
  try {
    vistos = Object.keys(Deno.env.toObject()).filter((k) => /RESEND|CORREO|MAIL|REMITENTE|SMTP/i.test(k));
  } catch {
    /* Sin permiso para listar: se dice lo que falta y nada más. */
  }
  return (
    "falta RESEND_API_KEY o SMTP_USER y SMTP_PASS en los secretos de las Edge Functions" +
    (vistos.length ? ` (la función ve: ${vistos.join(", ")})` : " (la función no ve ningún secreto de correo)")
  );
}

type Armado = { asunto: string; html: string; texto: string };

/**
 * Manda un correo. Devuelve null si salió, o el motivo si no.
 *
 * DOS CAMINOS
 *
 * El principal es Resend, con remitente del dominio del sitio. Pero Resend
 * solo manda si el dominio está verificado, y eso pide agregar registros en el
 * DNS, que no siempre se puede hacer a tiempo (pasó la semana del congreso).
 * El respaldo es una casilla común por SMTP, típicamente la de Gmail del
 * equipo: llega bien porque sale desde los servidores de Google con su propia
 * firma, y no necesita tocar el DNS.
 *
 * Se intenta Resend primero y, si falla por lo que sea, el respaldo. Así,
 * cuando el dominio quede verificado, los correos vuelven a salir por Resend
 * sin cambiar nada; los secretos SMTP se pueden dejar como respaldo.
 */
async function mandar(correo: string, armado: Armado): Promise<string | null> {
  const smtp = configSmtp();
  const { clave } = configCorreo();
  if (!clave && !smtp) return diagnosticoCorreo();

  const porResend = clave ? await mandarPorResend(clave, correo, armado) : "sin RESEND_API_KEY";
  if (porResend === null || !smtp) return porResend;

  const porSmtp = await mandarPorSmtp(smtp, correo, armado);
  if (porSmtp !== null) console.error("enviar-ruta: falló Resend y el respaldo", porResend);
  return porSmtp === null ? null : `${porSmtp} | antes, ${porResend}`.slice(0, 400);
}

// deno-lint-ignore no-explicit-any
let transporte: any = null;

async function mandarPorSmtp(
  smtp: NonNullable<ReturnType<typeof configSmtp>>,
  correo: string,
  armado: Armado
): Promise<string | null> {
  try {
    transporte ??= nodemailer.createTransport({
      host: smtp.host,
      port: smtp.puerto,
      secure: smtp.puerto === 465,
      auth: { user: smtp.usuario, pass: smtp.clave },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
    await transporte.sendMail({
      // Gmail exige que el remitente sea la misma casilla que inicia sesión.
      from: { name: "AprendeLocal", address: smtp.usuario },
      to: correo,
      cc: COPIA,
      replyTo: COPIA,
      subject: armado.asunto,
      html: armado.html,
      text: armado.texto,
    });
    return null;
  } catch (e) {
    transporte = null; // la próxima vez se reconecta desde cero
    return `smtp: ${String((e as Error)?.message ?? e).slice(0, 200)}`;
  }
}

async function mandarPorResend(clave: string, correo: string, armado: Armado): Promise<string | null> {
  const { remitente } = configCorreo();
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${clave}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: remitente,
        to: [correo],
        cc: [COPIA],
        reply_to: COPIA,
        subject: armado.asunto,
        html: armado.html,
        text: armado.texto,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    return r.ok ? null : `resend ${r.status}: ${(await r.text()).slice(0, 200)}`;
  } catch (e) {
    return String(e).slice(0, 200);
  }
}
const SITIO = (Deno.env.get("SITIO_URL") || "https://www.aprendelocal.com").replace(/\/$/, "");

/** Límites. Ver el comentario de arriba. */
const POR_ORIGEN_HORA = 60;
/** Cuántas rutas se le mandan, en total, a una misma persona en un evento. */
const MAX_ENVIOS_PERSONA = 5;
const TOPE_DIARIO = 90;

const COLOR_ETAPA: Record<string, [string, string]> = {
  problematica: ["#FD6925", "#1a1a1a"],
  aula: ["#26BDE2", "#1a1a1a"],
  terreno: ["#56C02B", "#1a1a1a"],
  analisis: ["#FCC30B", "#1a1a1a"],
  propuesta: ["#DD1367", "#ffffff"],
  difusion: ["#19486A", "#ffffff"],
};

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

/** Lo que viene del catálogo es nuestro, pero se escapa igual: es HTML. */
function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const CORREO_VALIDO = /^[^\s@<>()[\]\\,;:"]{1,64}@[a-z0-9.-]{1,253}\.[a-z]{2,24}$/i;
const ID = /^[a-z0-9_]{1,60}$/;

async function resumen(texto: string): Promise<string> {
  const datos = new TextEncoder().encode(texto + (Deno.env.get("HASH_SAL") || "aprendelocal"));
  const h = await crypto.subtle.digest("SHA-256", datos);
  return Array.from(new Uint8Array(h), (b) => b.toString(16).padStart(2, "0")).join("");
}

function numeroVisible(n: number): string {
  return String(n).padStart(4, "0");
}

function enlaceRuta(sede: string, problema: string, asignaturas: string[], lugar: string | null, numero: number): string {
  const q = new URLSearchParams({ edicion: sede, p: problema, a: asignaturas.join(","), n: String(numero) });
  if (lugar) q.set("l", lugar);
  return `${SITIO}/congreso?${q}`;
}

type Datos = {
  numero: number;
  /** Si el número va como número de sorteo o solo como número de ruta. */
  sorteo: boolean;
  idioma: Idioma;
  problemaId: string;
  problema: Problema;
  asignaturas: string[];
  lugar: string | null;
};

function armarCorreo(d: Datos): { asunto: string; html: string; texto: string } {
  const pt = d.idioma === "pt";
  const t = (es: string, p: string) => (pt ? p : es);
  const n = numeroVisible(d.numero);
  const ver = enlaceRuta(d.problema.sede, d.problemaId, d.asignaturas, d.lugar, d.numero);
  const cuenta = `${SITIO}/cadastrar?origen=congreso`;
  const angulos = d.problema.angulos.filter((a) => d.asignaturas.includes(a.asignatura));
  // Una asignatura puede tener dos ángulos en el catálogo: basta el primero.
  const vistos = new Set<string>();
  const unAngulo = angulos.filter((a) => (vistos.has(a.asignatura) ? false : (vistos.add(a.asignatura), true)));
  const lugar = d.lugar ? LUGARES[d.lugar] : null;
  const etapas = ETAPAS[d.idioma];

  const asunto = d.sorteo
    ? t(`Tu número para el sorteo: Nº ${n} · Tu ruta AprendeLocal`, `Seu número para o sorteio: Nº ${n} · Sua rota AprendeLocal`)
    : t(`Tu ruta AprendeLocal Nº ${n}: ${d.problema.nombre}`, `Sua rota AprendeLocal Nº ${n}: ${d.problema.nombre}`);

  const franja = [
    "#E5243B", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21", "#26BDE2", "#FCC30B", "#A21942", "#FD6925",
    "#DD1367", "#FD9D24", "#BF8B2E", "#3F7E44", "#0A97D9", "#56C02B", "#00689D", "#19486A",
  ]
    .map((c) => `<td style="background:${c};height:8px;font-size:0;line-height:0">&nbsp;</td>`)
    .join("");

  const ods = d.problema.ods
    .filter((k) => ODS[String(k)])
    .map((k) => {
      const o = ODS[String(k)];
      return `<span style="display:inline-block;margin:0 6px 6px 0;padding:4px 10px;border-radius:999px;background:${o.color};color:${o.claro ? "#1a1a1a" : "#fff"};font-size:13px;font-weight:600">ODS ${k} · ${esc(pt ? o.pt : o.es)}</span>`;
    })
    .join("");

  const filasAngulos = unAngulo
    .map(
      (a) =>
        `<tr><td style="padding:6px 0;font-size:15px;line-height:1.45;color:#1f2937"><strong>${esc(ASIGNATURAS[d.problema.sede][a.asignatura] ?? a.asignatura)}</strong>: ${esc(a.enfoque)}</td></tr>`
    )
    .join("");

  const filasEtapas = etapas
    .map((e, i) => {
      const [fondo, tinta] = COLOR_ETAPA[e.id] ?? ["#0a0047", "#fff"];
      return `<tr>
  <td width="44" valign="top" style="padding:0 12px 10px 0"><div style="width:36px;height:36px;border-radius:10px;background:${fondo};color:${tinta};font:700 16px/36px Arial,sans-serif;text-align:center">${i + 1}</div></td>
  <td valign="top" style="padding:0 0 10px 0;font-size:15px;line-height:1.4;color:#1f2937"><strong>${esc(e.nombre)}</strong><br><span style="color:#4b5563">${esc(e.enUnaLinea)}</span></td>
</tr>`;
    })
    .join("");

  const noticia = d.problema.noticia
    ? `<p style="margin:12px 0 0;padding:12px 14px;border-left:4px solid #FD6925;background:#fff7f2;font-size:14px;line-height:1.45;color:#374151">${t("Así empieza la clase", "Assim começa a aula")}: «${esc(d.problema.noticia.titular)}» <span style="color:#6b7280">(${esc(d.problema.noticia.medio)}${d.problema.noticia.fecha ? `, ${esc(d.problema.noticia.fecha)}` : ""})</span></p>`
    : "";

  const html = `<!doctype html>
<html lang="${pt ? "pt-BR" : "es"}"><body style="margin:0;padding:0;background:#f3f2fc;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f2fc"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden">
<tr>${franja}</tr>
<tr><td colspan="17" style="padding:28px 28px 8px">
  <p style="margin:0;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#6b7280">${d.sorteo ? t("Tu número para el sorteo", "Seu número para o sorteio") : t("Tu número", "Seu número")}</p>
  <p style="margin:6px 0 0;font:700 52px/1 Arial,sans-serif;color:#0a0047">Nº ${n}</p>
  ${d.sorteo ? `<p style="margin:10px 0 0;font-size:15px;line-height:1.5;color:#374151">${t(
    "Con este número participas en el sorteo que haremos al cierre del congreso. Guarda este correo.",
    "Com este número você participa do sorteio que faremos no encerramento do congresso. Guarde este e-mail."
  )}</p>` : ""}
  <p style="margin:22px 0 0;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#6b7280">${t("Tu ruta", "Sua rota")} · AprendeLocal</p>
  <h1 style="margin:6px 0 0;font-size:24px;line-height:1.2;color:#111217">${esc(d.problema.nombre)}</h1>
  ${lugar ? `<p style="margin:6px 0 0;font-size:15px;color:#4b5563">${t("En", "Em")} ${esc(lugar)}</p>` : ""}
  <div style="margin-top:12px">${ods}</div>
  ${noticia}
</td></tr>
<tr><td colspan="17" style="padding:18px 28px 4px">
  <p style="margin:0 0 6px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#6b7280">${t("Desde las asignaturas", "A partir dos componentes")}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${filasAngulos}</table>
</td></tr>
<tr><td colspan="17" style="padding:18px 28px 4px">
  <p style="margin:0 0 10px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#6b7280">${t("El proyecto en seis etapas", "O projeto em seis etapas")}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${filasEtapas}</table>
</td></tr>
<tr><td colspan="17" style="padding:12px 28px 28px">
  <a href="${esc(ver)}" style="display:inline-block;margin:0 8px 8px 0;padding:14px 22px;border-radius:999px;background:#0a0047;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px">${t("Ver mi ruta", "Ver minha rota")}</a>
  <a href="${esc(cuenta)}" style="display:inline-block;margin:0 8px 8px 0;padding:14px 22px;border-radius:999px;background:#b8561f;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px">${t("Crear mi cuenta gratis", "Criar minha conta grátis")}</a>
  <p style="margin:16px 0 0;font-size:14px;line-height:1.5;color:#4b5563">${t(
    "Con tu cuenta, esta ruta sigue en el cuaderno completo: los objetivos del currículum, los indicadores para evaluar, las técnicas de terreno, los papeles de la salida, el calendario de clases y la bitácora de cada etapa.",
    "Com a sua conta, esta rota continua no caderno completo: as habilidades da BNCC, os indicadores para avaliar, as técnicas de campo, os documentos da saída, o calendário de aulas e o diário de cada etapa."
  )}</p>
  <p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:#9ca3af">${t(
    `Recibes este correo porque armaste esta ruta en el stand de AprendeLocal y dejaste tu dirección para el sorteo. Va con copia al equipo (${esc(COPIA)}), que puede escribirte para avisarte si ganaste y contarte cómo sumarte. Si no quieres que te escriban, responde este correo y lo borramos.`,
    `Você recebe este e-mail porque montou esta rota no estande da AprendeLocal e deixou seu endereço para o sorteio. Vai com cópia para a equipe (${esc(COPIA)}), que pode escrever para avisar se você ganhou e contar como participar. Se não quiser que escrevam, responda este e-mail e apagamos.`
  )}</p>
</td></tr>
</table></td></tr></table></body></html>`;

  const texto = [
    `${d.sorteo ? t("Tu número para el sorteo", "Seu número para o sorteio") : t("Tu número", "Seu número")}: Nº ${n}`,
    d.sorteo
      ? t(
          "Con este número participas en el sorteo que haremos al cierre del congreso.",
          "Com este número você participa do sorteio que faremos no encerramento do congresso."
        )
      : "",
    "",
    `${t("Tu ruta", "Sua rota")}: ${d.problema.nombre}` + (lugar ? ` · ${lugar}` : ""),
    "",
    ...unAngulo.map((a) => `${ASIGNATURAS[d.problema.sede][a.asignatura] ?? a.asignatura}: ${a.enfoque}`),
    "",
    ...etapas.map((e, i) => `${i + 1}. ${e.nombre}: ${e.enUnaLinea}`),
    "",
    `${t("Ver mi ruta", "Ver minha rota")}: ${ver}`,
    `${t("Crear mi cuenta", "Criar minha conta")}: ${cuenta}`,
  ].join("\n");

  return { asunto, html, texto };
}

/**
 * Manda los correos que quedaron sin salir, de a cinco por vez.
 *
 * Todo lo necesario para rearmar el correo está en la fila: problemática,
 * asignaturas, lugar e idioma. El número es el mismo, que es lo que importa
 * para el sorteo.
 */
// deno-lint-ignore no-explicit-any
async function reintentarPendientes(db: any, yaEnviadosHoy: number): Promise<void> {
  const cupo = Math.min(5, TOPE_DIARIO - yaEnviadosHoy);
  if (cupo <= 0) return;
  const { data: filas } = await db
    .from("rutas_demo")
    .select("numero, correo, evento, idioma, problema, asignaturas, lugar, envios")
    .eq("enviado", false)
    .order("creada", { ascending: true })
    .limit(cupo);
  for (const f of filas ?? []) {
    const problema = PROBLEMAS[f.problema];
    if (!problema) continue;
    const motivo = await mandar(
      f.correo,
      armarCorreo({
        numero: f.numero,
        sorteo: f.evento === "congreso",
        idioma: f.idioma === "pt" ? "pt" : "es",
        problemaId: f.problema,
        problema,
        asignaturas: f.asignaturas ?? [],
        lugar: f.lugar,
      })
    );
    await db
      .from("rutas_demo")
      .update(
        motivo === null
          ? { enviado: true, error_envio: null, envios: (f.envios ?? 0) + 1, enviado_en: new Date().toISOString() }
          : { error_envio: motivo }
      )
      .eq("numero", f.numero);
    if (motivo) break; // si uno falla, los demás fallarían igual
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return responder({ error: "metodo" }, 405);

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await req.json();
  } catch {
    return responder({ error: "cuerpo" }, 400);
  }

  // Campo trampa: invisible para una persona, y los robots lo llenan.
  if (typeof cuerpo.sitio_web === "string" && cuerpo.sitio_web.trim()) {
    return responder({ numero: null, enviado: false });
  }

  const correo = String(cuerpo.correo ?? "").trim().toLowerCase();
  const idioma: Idioma = cuerpo.idioma === "pt" ? "pt" : "es";
  const problemaId = String(cuerpo.problema ?? "");
  const asignaturas = Array.isArray(cuerpo.asignaturas)
    ? [...new Set(cuerpo.asignaturas.map(String))].slice(0, 4)
    : [];
  const lugar = typeof cuerpo.lugar === "string" && ID.test(cuerpo.lugar) && LUGARES[cuerpo.lugar] ? cuerpo.lugar : null;
  // Solo elige entre dos textos fijos del correo: no hay texto libre.
  const sorteo = cuerpo.sorteo === true;
  const evento = typeof cuerpo.evento === "string" && ID.test(cuerpo.evento) ? cuerpo.evento : "congreso";

  if (!CORREO_VALIDO.test(correo) || correo.length > 254) return responder({ error: "correo" }, 400);
  if (cuerpo.acepta !== true) return responder({ error: "acepta" }, 400);
  const problema = ID.test(problemaId) ? PROBLEMAS[problemaId] : undefined;
  if (!problema) return responder({ error: "problema" }, 400);
  if (!asignaturas.length || !asignaturas.every((a) => problema.angulos.some((x) => x.asignatura === a))) {
    return responder({ error: "asignaturas" }, 400);
  }

  const url = Deno.env.get("SUPABASE_URL");
  const servicio = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !servicio) return responder({ error: "configuracion" }, 500);
  const db = createClient(url, servicio, { auth: { persistSession: false } });

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "sin-ip";
  const origenHash = await resumen(ip);
  const haceUnaHora = new Date(Date.now() - 3_600_000).toISOString();
  const haceUnDia = new Date(Date.now() - 86_400_000).toISOString();

  // ¿Ya tiene número en este evento? Entonces es la misma persona con otra
  // ruta: conserva su número. Ver «Un número por persona» en la migración.
  const { data: previa } = await db
    .from("rutas_demo")
    .select("numero, envios")
    .eq("evento", evento)
    .eq("correo", correo)
    .maybeSingle();

  if (previa && previa.envios >= MAX_ENVIOS_PERSONA) return responder({ error: "limite" }, 429);

  if (!previa) {
    const { count } = await db
      .from("rutas_demo")
      .select("numero", { count: "exact", head: true })
      .eq("origen_hash", origenHash)
      .gte("creada", haceUnaHora);
    if ((count ?? 0) >= POR_ORIGEN_HORA) return responder({ error: "limite" }, 429);
  }

  const ruta = { sede: problema.sede, idioma, problema: problemaId, asignaturas, lugar, actualizada: new Date().toISOString() };
  let numero: number;
  let envios: number;
  if (previa) {
    numero = previa.numero as number;
    envios = previa.envios as number;
    const { error } = await db.from("rutas_demo").update(ruta).eq("numero", numero);
    if (error) {
      console.error("enviar-ruta: no se pudo actualizar", error);
      return responder({ error: "guardar" }, 500);
    }
  } else {
    const { data: fila, error } = await db
      .from("rutas_demo")
      .insert({ ...ruta, correo, acepta_contacto: true, evento, origen_hash: origenHash })
      .select("numero")
      .single();
    if (error || !fila) {
      // Dos envíos casi a la vez del mismo correo: el segundo choca con el
      // índice único. Se contesta con el número que quedó.
      const { data: otra } = await db
        .from("rutas_demo")
        .select("numero")
        .eq("evento", evento)
        .eq("correo", correo)
        .maybeSingle();
      if (otra) return responder({ numero: otra.numero, enviado: false, repetido: true });
      console.error("enviar-ruta: no se pudo guardar", error);
      return responder({ error: "guardar" }, 500);
    }
    numero = fila.numero as number;
    envios = 0;
  }

  const { count: delDia } = await db
    .from("rutas_demo")
    .select("numero", { count: "exact", head: true })
    .gte("enviado_en", haceUnDia);

  // Pasado el tope del día la ruta queda guardada con su número y el equipo
  // la manda a mano. Mejor eso que agotar la cuota y que no llegue ninguna.
  let motivo: string | null;
  if ((delDia ?? 0) >= TOPE_DIARIO) {
    motivo = "tope diario";
  } else {
    motivo = await mandar(correo, armarCorreo({ numero, sorteo, idioma, problemaId, problema, asignaturas, lugar }));
  }
  const enviado = motivo === null;

  await db
    .from("rutas_demo")
    .update({
      enviado,
      error_envio: motivo,
      envios: envios + (enviado ? 1 : 0),
      ...(enviado ? { enviado_en: new Date().toISOString() } : {}),
    })
    .eq("numero", numero);
  if (motivo) console.error(`enviar-ruta Nº ${numero}:`, motivo);

  // Si este salió, el correo ya funciona: se mandan de a pocos los que
  // quedaron pendientes de antes (por ejemplo, los del rato en que faltaba la
  // configuración), sin hacer esperar a quien está en la tablet.
  if (enviado) {
    const pendientes = reintentarPendientes(db, (delDia ?? 0) + 1);
    // @ts-ignore EdgeRuntime existe en Supabase; en otro entorno se espera.
    if (typeof EdgeRuntime !== "undefined") EdgeRuntime.waitUntil(pendientes);
    else await pendientes;
  }

  return responder({ numero, enviado, repetido: Boolean(previa) });
});
