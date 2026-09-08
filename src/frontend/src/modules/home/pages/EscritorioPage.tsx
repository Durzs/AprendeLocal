import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../../shared/contexts/AuthContext";
import { supabase } from "../../../shared/lib/supabaseClient";
import { completitudPaso1, leer, type Expedicion } from "../../sequences/crear/expedicion";
import { huecosPendientes } from "../../sequences/crear/generar";
import { RUTAS, cursoCorto } from "../../sequences/rutas/catalogo";

/**
 * El inicio de quien ya entró.
 *
 * La portada le habla a alguien que no sabe qué es esto: explica la idea,
 * enseña los dibujos, invita a escribir. A un docente que ya tiene cuenta y
 * abrió el sitio un lunes a las siete de la mañana eso le sobra entero. Él
 * viene a seguir con lo que dejó a medias, o a empezar algo nuevo.
 *
 * Lo que se muestra aquí sale de dos sitios y de ninguno más: la expedición
 * que quedó guardada en este computador, y el perfil de la persona. No hay
 * paneles con números, porque no hay números que contar todavía; inventar un
 * «3 rutas creadas» sería el mismo error de las 24 escuelas conectadas.
 */
export default function EscritorioPage() {
  const { user } = useAuth();
  const [expedicion, setExpedicion] = useState<Expedicion | null>(null);
  const [escuela, setEscuela] = useState<string | null>(null);

  useEffect(() => {
    setExpedicion(leer());
  }, []);

  // El nombre de la escuela es lo único que se pide a la base, y si falla no
  // pasa nada: el saludo se arregla sin él.
  useEffect(() => {
    if (!user) return;
    let vigente = true;
    supabase
      .from("profiles")
      .select("school_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (vigente && data?.school_name) setEscuela(data.school_name);
      });
    return () => {
      vigente = false;
    };
  }, [user]);

  const nombre =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.nome as string) ||
    user?.email?.split("@")?.[0] ||
    "";

  // Una expedición cuenta como empezada cuando ya hay algo escrito, no por el
  // hecho de haber abierto la página una vez.
  const avance = expedicion ? completitudPaso1(expedicion) : 0;
  const empezada = Boolean(
    expedicion &&
      (expedicion.oa.length > 0 ||
        expedicion.ubicacion.trim() ||
        expedicion.preguntaGuia.trim() ||
        expedicion.rutaIA)
  );
  const faltan = expedicion?.rutaIA ? huecosPendientes(expedicion.rutaIA) : [];

  return (
    <main className="min-h-screen bg-white text-[#111217]">
      {/* ── Saludo ──────────────────────────────────────────────────────── */}
      <header className="border-b border-slate-100 bg-[var(--tinta-50)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
            {escuela ?? "Tu escuela"}
          </p>
          <h1 className="mt-2.5 text-3xl font-semibold leading-[0.95] tracking-[-0.055em] text-[#111217] sm:text-4xl">
            {nombre ? `Hola, ${nombre}` : "Hola"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {empezada
              ? "Tienes una ruta a medio armar. Sigue por donde la dejaste."
              : "Arma la clase de esta unidad con el lugar donde está tu escuela."}
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Lo que dejó a medias ──────────────────────────────────────── */}
        {empezada && expedicion ? (
          <section className="animar-asoma rounded-3xl border border-[var(--tinta-200)] bg-[var(--tinta-50)] p-7 sm:p-9">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 max-w-2xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--tinta-600)]">
                  Donde la dejaste
                </p>

                <h2 className="mt-2.5 text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                  {expedicion.rutaIA?.titulo ||
                    expedicion.preguntaGuia ||
                    expedicion.ubicacion ||
                    "Una ruta sin nombre todavía"}
                </h2>

                {expedicion.rutaIA?.titulo && expedicion.preguntaGuia && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {expedicion.preguntaGuia}
                  </p>
                )}

                {/* Lo que falta, dicho con nombre y no con un porcentaje. Un
                    «68% completado» no le dice a nadie qué tiene que hacer. */}
                <ul className="mt-4 flex flex-wrap gap-2">
                  {expedicion.oa.length > 0 && (
                    <Ficha listo>
                      {expedicion.oa.length} objetivo{expedicion.oa.length === 1 ? "" : "s"}
                    </Ficha>
                  )}
                  {expedicion.ubicacion.trim() && <Ficha listo>{expedicion.ubicacion}</Ficha>}
                  {expedicion.preguntaGuia.trim() && <Ficha listo>La pregunta</Ficha>}
                  {expedicion.oa.length === 0 && <Ficha>Faltan los objetivos</Ficha>}
                  {!expedicion.ubicacion.trim() && <Ficha>Falta el lugar</Ficha>}
                  {!expedicion.preguntaGuia.trim() && <Ficha>Falta la pregunta</Ficha>}
                  {faltan.length > 0 && (
                    <Ficha>
                      {faltan.length} cosa{faltan.length === 1 ? "" : "s"} que pones tú
                    </Ficha>
                  )}
                </ul>
              </div>

              <div className="flex shrink-0 flex-col gap-3">
                <Link
                  to="/crear"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--tinta-950)] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[var(--tinta-800)]"
                >
                  Seguir con esta
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <p className="max-w-[15rem] text-xs leading-relaxed text-slate-500">
                  Va {avance}% del primer paso. Queda guardada en este
                  computador, no en tu cuenta: en otro equipo no va a estar.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className="animar-asoma rounded-3xl border border-[var(--tinta-200)] bg-[var(--tinta-50)] p-7 sm:p-9">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <h2 className="text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                  Armar una ruta
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Cuatro láminas: lo que te toca pasar, lo que hay al otro lado
                  de la puerta, la pregunta que la sostiene, y la ruta armada
                  con sus documentos.
                </p>
              </div>
              <Link
                to="/crear"
                className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--tinta-950)] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[var(--tinta-800)]"
              >
                Empezar
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </section>
        )}

        {/* ── Lo que puede hacer ────────────────────────────────────────── */}
        <h2 className="mt-12 mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
          Lo que hay
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Tarjeta
            a="/rutas"
            titulo="Las cuatro rutas escritas"
            cuerpo="Agua, bosque, suelo y calor. Se ajustan a tu escuela y se imprimen."
          />
          <Tarjeta
            a="/crear"
            titulo="Qué vive junto a tu escuela"
            cuerpo="Lo que se ha registrado alrededor del lugar donde vas a salir."
          />
          <Tarjeta
            a="/metodologia"
            titulo="En qué se apoya"
            cuerpo="La educación basada en el lugar, y la formación para llevarla a la sala."
          />
          <Tarjeta
            a="/comunidades"
            titulo="Comunidades"
            cuerpo="Otras escuelas y docentes trabajando lo mismo."
          />
          <Tarjeta
            a="/perfil"
            titulo="Tu perfil y tu escuela"
            cuerpo="Los datos que salen firmados en la carta a las familias."
          />
        </ul>

        {/* ── Las rutas escritas, de un vistazo ─────────────────────────── */}
        <h2 className="mt-12 mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
          Rutas escritas
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {RUTAS.map((r, i) => (
            <li key={r.id} className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)}`}>
              <Link
                to="/rutas"
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--tinta-600)]">
                  {r.titulo}
                </span>
                <span className="mt-2 text-[15px] leading-snug text-slate-900">
                  {r.preguntaGuia}
                </span>
                <span className="mt-2.5 text-xs text-slate-500">
                  {r.semanas} semanas · {r.cubre.map((c) => cursoCorto(c.nivel)).join(" ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

/** Una pieza de la expedición: la que ya está, o la que falta. */
function Ficha({ children, listo = false }: { children: React.ReactNode; listo?: boolean }) {
  return (
    <li
      className={`rounded-full border px-3 py-1 text-xs ${
        listo
          ? "border-[var(--tinta-200)] bg-white text-slate-700"
          : "border-orange-200 bg-orange-50 text-orange-900"
      }`}
    >
      {children}
    </li>
  );
}

function Tarjeta({ a, titulo, cuerpo }: { a: string; titulo: string; cuerpo: string }) {
  return (
    <li>
      <Link
        to={a}
        className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold leading-snug text-slate-900">{titulo}</h3>
          <span
            aria-hidden
            className="shrink-0 text-[var(--tinta-600)] transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{cuerpo}</p>
      </Link>
    </li>
  );
}
