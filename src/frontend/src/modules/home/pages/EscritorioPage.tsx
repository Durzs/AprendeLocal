import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../../shared/contexts/AuthContext";
import { llaveDeSede, useSede } from "../../../shared/sede";
import { useTx } from "../../../shared/tx";
import { supabase } from "../../../shared/lib/supabaseClient";
import { completitud, leer, type Expedicion } from "../../sequences/crear/expedicion";
import {
  AVANCE_VACIO,
  normalizarAvance,
  resumen,
  semanasDe,
  type Avance,
} from "../../sequences/crear/avance";
import { cerradas, resumenBitacora } from "../../sequences/seguimiento/bitacora";
import { etapasEn } from "../../sequences/metodo/etapas";
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
 *
 * CADA BLOQUE CON SU FONDO
 *
 * Era una pantalla blanca con cuatro montones de tarjetas, y los cuatro se
 * leían como uno: había que ir leyendo los títulos para saber dónde terminaba
 * una cosa y empezaba otra. Ahora cada bloque va a sangre con su color, y los
 * colores son los mismos de la portada y en el mismo orden, así que un docente
 * que vio el sitio antes de tener cuenta reconoce dónde está por el fondo
 * antes de leer nada:
 *
 *   · el saludo, con el color de la lámina en la que va su ruta;
 *   · la ruta a medias, en el lila claro: es la mesa de trabajo, y el trabajo
 *     se hace sobre fondo claro;
 *   · lo que hay, en blanco, que es la parte de navegar;
 *   · las rutas escritas, en el verde del territorio, porque de eso tratan.
 *
 * Ese ultimo bloque era verde oscuro a sangre y ahora es el mismo verde
 * papel que usa la seccion del territorio en la portada. Era el unico
 * oscuro entre tres claros y se leia como algo pegado de otro sitio, que
 * es exactamente lo que pasaba en la portada.
 *
 * EL SALUDO CAMBIA DE COLOR CON EL TRABAJO
 *
 * El primero de los cuatro no tiene un color fijo: toma el de la lamina del
 * cuaderno en la que va su ruta, con los mismos cuatro colores que la
 * seccion de los dibujos usa en la portada y en el mismo orden. Abrir el
 * sitio el lunes y encontrarlo terracota en vez de indigo dice, antes de
 * leer una palabra, que el viernes se avanzo.
 *
 * Debajo van las cuatro laminas numeradas, para que el color no sea un
 * acertijo: se ve cual esta encendida y cuantas quedan. Un color que cambia
 * y no se explica es un adorno; con la barra al lado, es un estado.
 */

/**
 * Las láminas del cuaderno, con el color de cada una.
 *
 * SON LAS QUE HAY, Y ANTES NO LO ERAN
 *
 * Aquí había cuatro y el cuaderno tiene tres, así que el escritorio anunciaba
 * «Lámina 2 de 4» para un recorrido de tres. Peor todavía, la segunda decía
 * «ya tienes los objetivos» cuando los objetivos se marcan justamente en la
 * segunda, no antes: quien llegaba ahí leía que ya tenía hecho lo que estaba
 * a punto de hacer. Ahora son las mismas tres, con el mismo nombre que les da
 * el cuaderno.
 *
 * Los colores no son nuevos: vienen de la portada, en el mismo orden. Lo que
 * hace que esto no sea decoración es de dónde sale la lámina: de lo que el
 * docente tiene efectivamente escrito, no de un contador. El color cambia
 * cuando cambia su trabajo, y por eso significa algo.
 */
const LAMINAS = [
  {
    numero: 1,
    nombre: { es: "El programa", pt: "O currículo" },
    fondo: "var(--tinta-950)",
    acento: "text-tierra-300",
    dice: {
      es: "Los cursos que tienes y cuántas clases hay de verdad para esto.",
      pt: "As turmas que você tem e quantas aulas existem de verdade para isto.",
    },
  },
  {
    numero: 2,
    nombre: { es: "El lugar", pt: "O lugar" },
    fondo: "#c9612a",
    // Sobre el terracota, el ámbar no se despega del fondo: van los dos al
    // mismo matiz y a la misma luz. El blanco sí se lee.
    acento: "text-white/85",
    dice: {
      es: "Busca tu escuela, elige la problemática y marca los objetivos que abre.",
      pt: "Encontre sua escola, escolha a problemática e marque as habilidades que ela abre.",
    },
  },
  {
    numero: 3,
    nombre: { es: "Lo que queda armado", pt: "O que fica pronto" },
    fondo: "#1e2a24",
    acento: "text-tierra-300",
    dice: {
      es: "Qué van a construir y para quién, con qué se evalúa y los papeles de la salida.",
      pt: "O que vão construir e para quem, como se avalia e os documentos da saída.",
    },
  },
] as const;

/**
 * En qué lámina va, según lo que hay escrito.
 *
 * Se lee de atrás para adelante: la lámina es la última que alcanzó, no la
 * primera que le falta. Un docente que ya decidió el producto pero borró el
 * lugar sigue estando en la tercera, porque volver a mandarlo a la segunda por
 * un campo vacío sería decirle que perdió el trabajo.
 */
function laminaDe(e: Expedicion | null): number {
  if (!e) return 0;
  // La última era «hay ruta armada por el modelo». Al retirarse esa ruta, lo
  // que marca haber llegado ahí es haber decidido lo que se decide ahí: qué
  // van a construir y para quién.
  if (e.formato || e.destinatario.trim() || (Array.isArray(e.semanas) && e.semanas.length)) return 2;
  if (e.ubicacion.trim() || e.entorno || e.problemaId || e.oa.length) return 1;
  return 0;
}

export default function EscritorioPage() {
  const { user } = useAuth();
  const tx = useTx();
  const sede = useSede();
  const ETAPAS = etapasEn(tx.idioma);
  const [escuela, setEscuela] = useState<string | null>(null);

  // Lo guardado se lee al crear el estado y no en un efecto. Leerlo en un
  // efecto pintaba primero el escritorio vacío —«Empezar», «Armar una ruta»—
  // y un instante después lo reemplazaba por el proyecto a medias, delante de
  // la persona.
  const [expedicion] = useState<Expedicion | null>(() => leer());
  // El avance se guarda al lado de la expedición, con su propia llave: lo
  // escribe quien vuelve de la sala un martes, no quien planifica un domingo.
  const [avance] = useState<Avance>(() => {
    try {
      const crudo = localStorage.getItem(llaveDeSede("aprendelocal:expedicion:avance"));
      return crudo ? normalizarAvance(JSON.parse(crudo)) : AVANCE_VACIO;
    } catch {
      return AVANCE_VACIO; /* Ventana privada: lo mismo que sin empezar. */
    }
  });

  /*
   * El nombre de la escuela, para el saludo.
   *
   * Se pedía `profiles.school_name`, una columna que no existe: la consulta
   * fallaba sin decir nada y el saludo decía siempre «Tu escuela». La escuela
   * está en `schools`, y el perfil la apunta con `school_id`, que es como la
   * lee también la pantalla del perfil. Se pide en una sola consulta siguiendo
   * esa relación.
   */
  useEffect(() => {
    if (!user) return;
    let vigente = true;
    supabase
      .from("profiles")
      .select("schools(name)")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        const nombre = (data?.schools as { name?: string } | null)?.name;
        if (vigente && nombre) setEscuela(nombre);
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
  const lleno = expedicion ? completitud(expedicion) : 0;
  const empezada = Boolean(
    expedicion &&
      (expedicion.oa.length > 0 ||
        expedicion.ubicacion.trim() ||
        expedicion.preguntaGuia.trim() ||
        expedicion.problemaId)
  );
  const etapa = LAMINAS[laminaDe(expedicion)];

  // Lo que falta, con nombre. Eran cuatro: el destinatario y los tres campos
  // de «Lo que solo sabes tú del lugar». Esa lámina se retiró del cuaderno, y
  // avisar de algo que ya no se puede llenar es un aviso que no se apaga nunca.
  const faltan = expedicion
    ? [
        expedicion.destinatario.trim()
          ? null
          : tx("Falta a quién le entregan", "Falta para quem entregam"),
      ].filter(Boolean)
    : [];

  // Por dónde va en la sala, en dos escalas. La del método vale siempre y es
  // la que va primero: contesta en qué parte del proyecto está el curso. La
  // del calendario aparece cuando haya clases anotadas, y contesta qué toca el
  // martes.
  const etapas = expedicion ? cerradas(avance.bitacora) : 0;
  const enMetodo = empezada ? resumenBitacora(avance.bitacora, tx.idioma) : null;
  const semanas = expedicion ? semanasDe(expedicion) : [];
  const enSala = expedicion && semanas.length ? resumen(expedicion, avance, tx.idioma) : null;

  return (
    <main className="min-h-screen bg-white text-texto">

      {/* ── Saludo, con el color de la lámina en la que va ─────────────── */}
      <header
        className="grano relative overflow-hidden px-4 py-14 transition-colors duration-700 sm:px-6 sm:py-16 lg:px-8"
        style={{ backgroundColor: etapa.fondo }}
      >
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-white/12 pb-4">
            <span className={`rotulo ${etapa.acento}`}>{escuela ?? tx("Tu escuela", "Sua escola")}</span>
            <span className="rotulo text-white/70">
              {tx("Lámina", "Lâmina")} {etapa.numero} {tx("de", "de")} {LAMINAS.length} ·{" "}
              {tx.de(etapa.nombre)}
            </span>
          </div>

          <h1 className="display mt-8 text-3xl text-white sm:text-4xl md:text-5xl">
            {nombre ? `${tx("Hola", "Olá")}, ${nombre}` : tx("Hola", "Olá")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            {tx.de(etapa.dice)}
          </p>

          {/* Las láminas, para que el color no sea un misterio: se ve
              cuál está encendida y cuántas quedan. Es la misma barra que la
              sección de los dibujos usa en la portada. */}
          <ol className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
            {LAMINAS.map((l) => {
              const puesta = l.numero === etapa.numero;
              const pasada = l.numero < etapa.numero;
              return (
                <li key={l.numero} className="flex items-center gap-2">
                  <span
                    className={`cifra grid h-7 w-7 place-items-center rounded-full text-xs font-semibold transition ${
                      puesta
                        ? "bg-white text-texto ring-4 ring-white/20"
                        : pasada
                          ? "bg-white/35 text-white"
                          : "bg-white/12 text-white/70"
                    }`}
                  >
                    {String(l.numero).padStart(2, "0")}
                  </span>
                  <span
                    className={`hidden text-xs sm:inline ${
                      puesta ? "font-semibold text-white" : "text-white/50"
                    }`}
                  >
                    {tx.de(l.nombre)}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </header>

      {/* ── La mesa de trabajo, en claro ───────────────────────────────── */}
      <section className="border-b border-slate-200/70 bg-[var(--tinta-50)] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <span className="rotulo block text-tierra-700">
            {empezada ? tx("Donde la dejaste", "Onde você parou") : tx("Empezar", "Começar")}
          </span>

          {empezada && expedicion ? (
            <div className="animar-asoma mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 max-w-2xl">
                <h2 className="titulo text-xl text-texto sm:text-2xl">
                  {expedicion.problemaPropioNombre ||
                    expedicion.preguntaGuia ||
                    expedicion.ubicacion ||
                    tx("Una ruta sin nombre todavía", "Uma rota ainda sem nome")}
                </h2>

                {expedicion.problemaPropioNombre && expedicion.preguntaGuia && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {expedicion.preguntaGuia}
                  </p>
                )}

                {/* Lo que falta, dicho con nombre y no con un porcentaje. Un
                    «68% completado» no le dice a nadie qué tiene que hacer. */}
                {/* Por dónde va en la sala. Va antes que las fichas de lo que
                    falta por escribir porque, a partir de la primera semana
                    dada, esta es la pregunta: no qué me queda por planificar,
                    sino qué toca el martes. */}
                {enMetodo && (
                  <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-700">
                    <span className="rotulo rounded-full bg-white px-2.5 py-1.5 text-tierra-700 shadow-sm">
                      {etapas} {tx("de", "de")} {ETAPAS.length} etapas
                    </span>
                    {enMetodo}
                  </p>
                )}

                {/* El calendario va debajo y en voz más baja: dice qué toca el
                    martes, que es útil, pero la pregunta de arriba es en qué
                    parte del proyecto está el curso. */}
                {enSala && (
                  <p className="mt-2 text-sm text-slate-500">
                    {enSala}
                  </p>
                )}

                <ul className="mt-4 flex flex-wrap gap-2">
                  {expedicion.oa.length > 0 && (
                    <Ficha listo>
                      {expedicion.oa.length}{" "}
                      {tx(
                        expedicion.oa.length === 1 ? "objetivo" : "objetivos",
                        expedicion.oa.length === 1 ? "habilidade" : "habilidades"
                      )}
                    </Ficha>
                  )}
                  {expedicion.ubicacion.trim() && <Ficha listo>{expedicion.ubicacion}</Ficha>}
                  {expedicion.preguntaGuia.trim() && (
                    <Ficha listo>{tx("La pregunta", "A pergunta")}</Ficha>
                  )}
                  {expedicion.oa.length === 0 && (
                    <Ficha>{tx("Faltan los objetivos", "Faltam as habilidades")}</Ficha>
                  )}
                  {!expedicion.ubicacion.trim() && <Ficha>{tx("Falta el lugar", "Falta o lugar")}</Ficha>}
                  {!expedicion.preguntaGuia.trim() && (
                    <Ficha>{tx("Falta la pregunta", "Falta a pergunta")}</Ficha>
                  )}
                  {/* Con nombre y no contadas. «4 cosas que pones tú» obliga a
                      entrar a averiguar cuáles son; «falta dónde se para el
                      curso» se puede resolver o dejar pasar sin abrir nada. */}
                  {faltan.map((f) => (
                    <Ficha key={f}>{f}</Ficha>
                  ))}
                </ul>
              </div>

              {/* Dos puertas y no una, porque son dos momentos. El seguimiento
                  va primero en cuanto el proyecto empezó en la sala: a partir
                  de ahí, quien abre esto un martes viene a ver dónde quedó, no
                  a seguir armando. */}
              <div className="flex shrink-0 flex-col gap-3">
                {etapas > 0 ? (
                  <>
                    <Boton a="/proyecto">{tx("Ver por dónde va", "Ver onde está")}</Boton>
                    <Link
                      to="/crear"
                      className="text-center text-sm text-slate-600 underline underline-offset-4 transition hover:text-slate-900"
                    >
                      {tx("Abrir el cuaderno", "Abrir o caderno")}
                    </Link>
                  </>
                ) : (
                  <>
                    <Boton a="/crear">{tx("Seguir con esta", "Continuar esta")}</Boton>
                    <Link
                      to="/proyecto"
                      className="text-center text-sm text-slate-600 underline underline-offset-4 transition hover:text-slate-900"
                    >
                      {tx("Empezar el seguimiento", "Começar o acompanhamento")}
                    </Link>
                  </>
                )}
                <p className="max-w-[15rem] text-xs leading-relaxed text-slate-500">
                  {tx(
                    `Va ${lleno}% del cuaderno. Queda guardada en este computador, y también en tu cuenta si entraste con ella.`,
                    `${lleno}% do caderno preenchido. Fica salvo neste computador, e também na sua conta se você entrou com ela.`
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="animar-asoma mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <h2 className="titulo text-xl text-texto sm:text-2xl">
                  {tx("Armar una ruta", "Montar uma rota")}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {tx(
                    "Tres láminas: lo que te toca pasar, la problemática del lugar con los objetivos que abre, y lo que queda armado con sus documentos.",
                    "Três lâminas: o que você precisa trabalhar, a problemática do lugar com as habilidades que ela abre, e o que fica pronto com os documentos."
                  )}
                </p>
              </div>
              <Boton a="/crear">{tx("Empezar", "Começar")}</Boton>
            </div>
          )}
        </div>
      </section>

      {/* ── Lo que hay, en blanco ──────────────────────────────────────── */}
      <section className="border-b border-slate-200/70 bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <span className="rotulo block text-tierra-700">{tx("Lo que hay", "O que tem aqui")}</span>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Las rutas escritas son chilenas: Agua, bosque, suelo y calor
                de La Araucanía, con los objetivos del Mineduc. En la edición
                brasileña no se ofrecen. */}
            {sede === "cl" && (
              <Tarjeta
                a="/crear"
                titulo="Las cuatro rutas escritas"
                cuerpo="Agua, bosque, suelo y calor. Se ajustan a tu escuela y se imprimen."
              />
            )}
            <Tarjeta
              a="/crear"
              titulo={tx("Qué vive junto a tu escuela", "O que vive perto da sua escola")}
              cuerpo={tx(
                "Lo que se ha registrado alrededor del lugar donde vas a salir.",
                "O que já foi registrado ao redor do lugar aonde você vai sair."
              )}
            />
            <Tarjeta
              a="/#habilidades"
              titulo={tx("En qué se apoya", "Em que se apoia")}
              cuerpo={tx(
                "La educación basada en el lugar, y la formación para llevarla a la sala.",
                "A educação baseada no lugar, e a formação para levá-la à sala de aula."
              )}
            />
            <Tarjeta
              a="/comunidades"
              titulo={tx("Comunidades", "Comunidades")}
              cuerpo={tx(
                "Otras escuelas y docentes trabajando lo mismo.",
                "Outras escolas e professores trabalhando no mesmo."
              )}
            />
            <Tarjeta
              a="/perfil"
              titulo={tx("Tu perfil y tu escuela", "Seu perfil e sua escola")}
              cuerpo={tx(
                "Los datos que salen firmados en la carta a las familias.",
                "Os dados que saem assinados na autorização para as famílias."
              )}
            />
          </ul>
        </div>
      </section>

      {/* ── Las rutas escritas, en el verde del territorio ───────────────
          El mismo verde papel que la sección del territorio en la portada,
          por la misma razón: era un bloque oscuro entre tres claros, y se
          leía como algo de otro sitio. */}
      {sede === "cl" && (
      <section
        className="relative overflow-hidden border-t border-slate-200/70 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        style={{ backgroundColor: "var(--verde-papel)" }}
      >
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-slate-300/70 pb-4">
            <span className="rotulo text-tierra-700">Rutas escritas</span>
            <span className="rotulo text-slate-500">
              {RUTAS.length} listas para ajustar
            </span>
          </div>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {RUTAS.map((r, i) => (
              <li key={r.id} className={`animar-asoma animar-asoma-${Math.min(i + 1, 4)}`}>
                <Link
                  to="/crear"
                  className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  <span className="rotulo text-tierra-700">{r.titulo}</span>
                  <span className="mt-3 text-[15px] leading-snug text-slate-900">
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
      </section>
      )}
    </main>
  );
}

/** El botón que lleva al cuaderno. Uno solo, para que los dos casos coincidan. */
function Boton({ a, children }: { a: string; children: React.ReactNode }) {
  return (
    <Link
      to={a}
      className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--tinta-950)] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--tinta-800)]"
    >
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

/** Una pieza de la expedición: la que ya está, o la que falta. */
function Ficha({ children, listo = false }: { children: React.ReactNode; listo?: boolean }) {
  return (
    <li
      className={`rounded-full border px-3 py-1 text-xs ${
        listo
          ? "border-[var(--tinta-200)] bg-white text-slate-700"
          : "border-tierra-200 bg-tierra-50 text-tierra-900"
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
          <h3 className="titulo text-slate-900">{titulo}</h3>
          <span
            aria-hidden
            className="shrink-0 text-tierra-700 transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{cuerpo}</p>
      </Link>
    </li>
  );
}
