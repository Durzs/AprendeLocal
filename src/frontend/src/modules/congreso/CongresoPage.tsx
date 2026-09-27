/**
 * El demo del stand: armar una ruta en cuatro pasos, sin cuenta.
 *
 *   /congreso                  el demo, dentro del sitio
 *   /congreso?kiosco           para la tablet del stand: pantalla completa,
 *                              sin cabecera, vuelve al inicio sola si nadie
 *                              la toca, y guarda los correos si se cae el wifi
 *   /congreso?p=…&a=…&l=…      una ruta ya armada (el QR y el correo)
 *
 * QUÉ MUESTRA Y POR QUÉ ASÍ
 *
 * Es la primera lámina del cuaderno, comprimida: problemática, asignaturas,
 * lugar. Con eso sale una ruta de seis etapas que ya dice algo concreto en
 * cada una, porque todo lo que muestra viene del mismo catálogo que usa el
 * cuaderno: las noticias verificadas, los ángulos por asignatura, los
 * objetivos del currículum, las técnicas. Nada está escrito para el demo.
 *
 * Lo que sí es del demo es el énfasis: se muestra en congresos de educación
 * para el desarrollo sostenible, así que cada problemática lleva sus ODS, las
 * asignaturas marcan cuáles son STEM, y el paso del lugar trae en vivo lo
 * que la comunidad de iNaturalist registró ahí.
 *
 * Al final la persona se lleva la ruta: por correo, con su número para el
 * sorteo (§ruta.ts), o en el teléfono con el QR. Y ve lo que el cuaderno
 * hace con una cuenta, que es la razón de haber venido al stand.
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Expand, Mail } from "lucide-react";

import { useTx } from "../../shared/tx";
import { elegirSede, useSede, useSedeFijada, type Sede } from "../../shared/sede";
import { useContenido } from "../sequences/contenido";
import { pedirUbicacion } from "../sequences/rutas/inaturalist";
import { odsDe } from "./ods";
import { LUGARES, consultar, guardado, precargar, type Lugar } from "./especies";
import {
  HAY_SORTEO,
  aEnlace,
  deEnlace,
  enviarRuta,
  sembrarCuaderno,
  vaciarFila,
  type Armada,
} from "./ruta";
import {
  BotonPrincipal,
  FranjaOds,
  Noticia,
  PasoAsignaturas,
  PasoEspecies,
  PasoLlevar,
  PasoProblema,
  PasoRuta,
  Portada,
  type EstadoCorreo,
  type EstadoEspecies,
} from "./Pasos";

/**
 * El demo es de la edición chilena: se muestra en congresos en Chile, con las
 * problemáticas, el currículum y los lugares de aquí. Quien llega con el
 * navegador en portugués lo ve igual en Chile. Las pantallas siguen leyendo
 * `useContenido()`, así que si un día hace falta en Brasil basta con cambiar
 * esto.
 */
const EDICION_DEL_DEMO: Sede = "cl";

/** Sin tocar la tablet este tiempo, se pregunta si sigue alguien ahí. */
const INACTIVIDAD_MS = 90_000;
/** Y este es el margen para contestar antes de volver al inicio. */
const CUENTA_REGRESIVA_S = 15;

export default function CongresoPage() {
  const tx = useTx();
  const c = useContenido();
  const sede = useSede();
  const fijada = useSedeFijada();
  const navegar = useNavigate();
  const [q] = useSearchParams();
  const kiosco = q.has("kiosco");
  const quieto = useReducedMotion();
  const lugares = LUGARES[sede];
  // iNaturalist nombra las especies en el idioma que se le pida.
  const locale = tx("es", "pt-BR");

  // Deja puesta la edición del demo. Al cambiar, el `Layout` vuelve a montar
  // la página ya con el contenido chileno. Una cuenta con otra sede no se
  // toca: la sede de una cuenta no se cambia desde aquí.
  useEffect(() => {
    if (!fijada && sede !== EDICION_DEL_DEMO) elegirSede(EDICION_DEL_DEMO);
  }, [fijada, sede]);

  /* ── Lo elegido ────────────────────────────────────────────────────────── */

  // Una ruta que llega armada en la dirección abre directo en el paso 4. En
  // el kiosco no: la tablet siempre empieza por la portada.
  const [desdeEnlace] = useState(() => (kiosco ? null : deEnlace(q, c.problemas, lugares)));
  const [lugarInicial] = useState(() => lugares.find((l) => l.id === desdeEnlace?.lugar) ?? null);

  const [paso, setPaso] = useState(desdeEnlace ? 4 : 0);
  const [problemaId, setProblemaId] = useState<string | null>(desdeEnlace?.problemaId ?? null);
  const [asignaturas, setAsignaturas] = useState<string[]>(desdeEnlace?.asignaturas ?? []);
  const [lugar, setLugar] = useState<Lugar | null>(lugarInicial);
  const [especies, setEspecies] = useState<EstadoEspecies>(() => {
    if (!lugarInicial) return null;
    const previo = guardado(lugarInicial, locale);
    return previo ? { estado: "listo", r: previo } : { estado: "cargando" };
  });
  const [ubicando, setUbicando] = useState(false);
  const [sinUbicacion, setSinUbicacion] = useState(false);
  const [correo, setCorreo] = useState<EstadoCorreo>({ estado: "libre" });
  // Sube en cada reinicio, para que el formulario del final se vacíe.
  const [ronda, setRonda] = useState(0);

  const problema = c.problemas.find((p) => p.id === problemaId);
  const armada: Armada | null = problema
    ? { problemaId: problema.id, asignaturas, lugar: lugar && lugar.id !== "aqui" ? lugar.id : null }
    : null;

  /* ── Las especies ──────────────────────────────────────────────────────── */

  // Solo cuenta la última consulta: si alguien toca tres lugares seguidos,
  // no se quiere ver aparecer la lista del primero al final.
  const pedido = useRef(0);

  const cargarEspecies = useCallback(
    (l: Lugar) => {
      const id = ++pedido.current;
      const previo = guardado(l, locale);
      setEspecies(previo ? { estado: "listo", r: previo } : { estado: "cargando" });
      consultar(l, locale, sede).then((r) => {
        if (pedido.current === id) setEspecies({ estado: "listo", r });
      });
    },
    [locale, sede]
  );

  // La ruta que llegó por enlace trae su lugar: se consulta al abrir.
  useEffect(() => {
    if (!lugarInicial) return;
    const id = ++pedido.current;
    consultar(lugarInicial, locale, sede).then((r) => {
      if (pedido.current === id) setEspecies({ estado: "listo", r });
    });
  }, [lugarInicial, locale, sede]);

  const elegirLugar = (l: Lugar) => {
    setLugar(l);
    setSinUbicacion(false);
    cargarEspecies(l);
  };

  const usarAqui = async () => {
    setUbicando(true);
    setSinUbicacion(false);
    try {
      const { lat, lng } = await pedirUbicacion();
      elegirLugar({ id: "aqui", nombre: tx("Cerca de aquí", "Perto daqui"), lat, lng });
    } catch {
      setSinUbicacion(true);
    } finally {
      setUbicando(false);
    }
  };

  /* ── Moverse entre pasos ───────────────────────────────────────────────── */

  const contenedor = useRef<HTMLDivElement>(null);
  const principal = useRef<HTMLElement>(null);

  // Cada paso empieza arriba, y el foco va al contenido para que un lector de
  // pantalla anuncie el paso nuevo y no se quede en el botón que ya no está.
  useEffect(() => {
    contenedor.current?.scrollTo({ top: 0 });
    if (!kiosco) window.scrollTo({ top: 0 });
    principal.current?.focus({ preventScroll: true });
  }, [paso, kiosco]);

  const puedeSeguir =
    paso === 0 || (paso === 1 && !!problema) || (paso === 2 && asignaturas.length > 0) || paso === 3 || paso === 4;

  const siguiente = () => {
    if (!puedeSeguir) return;
    // Al llegar al lugar ya hay uno elegido, para que se vea algo al instante.
    if (paso === 2 && !lugar && lugares[0]) elegirLugar(lugares[0]);
    setPaso((p) => Math.min(p + 1, 5));
  };
  const atras = () => setPaso((p) => Math.max(p - 1, 0));

  const elegirProblema = (id: string) => {
    if (id === problemaId) return;
    setProblemaId(id);
    // Las asignaturas de otra problemática no tienen por qué existir en esta.
    setAsignaturas([]);
  };

  const reiniciar = useCallback(() => {
    setPaso(0);
    setProblemaId(null);
    setAsignaturas([]);
    setLugar(null);
    setEspecies(null);
    setCorreo({ estado: "libre" });
    setSinUbicacion(false);
    setRonda((r) => r + 1);
    pedido.current++;
  }, []);

  /* ── El kiosco ─────────────────────────────────────────────────────────── */

  const [cuenta, setCuenta] = useState<number | null>(null);

  // Si nadie toca la pantalla, se pregunta; si nadie contesta, al inicio. La
  // siguiente persona que se acerque no tiene que encontrarse la ruta a medias
  // de otro, ni su correo escrito.
  useEffect(() => {
    if (!kiosco || paso === 0) return;
    let reloj = setTimeout(() => setCuenta(CUENTA_REGRESIVA_S), INACTIVIDAD_MS);
    const tocar = () => {
      clearTimeout(reloj);
      reloj = setTimeout(() => setCuenta(CUENTA_REGRESIVA_S), INACTIVIDAD_MS);
    };
    const eventos = ["pointerdown", "keydown", "wheel", "touchmove"] as const;
    eventos.forEach((e) => window.addEventListener(e, tocar, { passive: true }));
    return () => {
      clearTimeout(reloj);
      eventos.forEach((e) => window.removeEventListener(e, tocar));
    };
  }, [kiosco, paso]);

  useEffect(() => {
    if (cuenta === null) return;
    if (cuenta <= 0) {
      const t = setTimeout(() => {
        setCuenta(null);
        reiniciar();
      }, 0);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCuenta((n) => (n === null ? null : n - 1)), 1000);
    return () => clearTimeout(t);
  }, [cuenta, reiniciar]);

  // En el kiosco, con señal, deja guardados los lugares de ejemplo.
  useEffect(() => {
    if (kiosco) void precargar(sede, locale);
  }, [kiosco, sede, locale]);

  // Manda lo que haya quedado en la fila sin señal. Se repite cada minuto y
  // cada vez que vuelve la red; en la tablet y también en un teléfono.
  useEffect(() => {
    const vaciar = () => void vaciarFila();
    vaciar();
    const t = setInterval(vaciar, 60_000);
    window.addEventListener("online", vaciar);
    return () => {
      clearInterval(t);
      window.removeEventListener("online", vaciar);
    };
  }, []);


  const pantallaCompleta = () => {
    const el = document.documentElement;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.().catch(() => undefined);
  };

  /* ── El correo ─────────────────────────────────────────────────────────── */

  const enviar = async (direccion: string, trampa: string) => {
    if (!armada) return;
    setCorreo({ estado: "enviando" });
    setCorreo(await enviarRuta({ ...armada, correo: direccion, idioma: tx.idioma, sitio_web: trampa }));
  };

  const alCuaderno = () => {
    if (armada) sembrarCuaderno(armada);
    navegar("/crear");
  };

  /* ── Lo que se ve ──────────────────────────────────────────────────────── */

  const etiquetas = [
    tx("Problemática", "Problemática"),
    tx("Asignaturas", "Componentes"),
    tx("Lugar", "Lugar"),
    tx("Tu ruta", "Sua rota"),
    HAY_SORTEO ? tx("Sorteo", "Sorteio") : tx("Llévatela", "Leve"),
  ];

  let pantalla: ReactNode = null;
  if (paso === 0) pantalla = <Portada onEmpezar={siguiente} kiosco={kiosco} />;
  else if (paso === 1) pantalla = <PasoProblema elegido={problemaId} onElegir={elegirProblema} />;
  else if (paso === 2 && problema)
    pantalla = <PasoAsignaturas p={problema} elegidas={asignaturas} onCambiar={setAsignaturas} />;
  else if (paso === 3)
    pantalla = (
      <PasoEspecies
        lugares={lugares}
        lugar={lugar}
        especies={especies}
        onLugar={elegirLugar}
        onAqui={usarAqui}
        onReintentar={() => lugar && cargarEspecies(lugar)}
        ubicando={ubicando}
        sinUbicacion={sinUbicacion}
        kiosco={kiosco}
      />
    );
  else if (paso === 4 && problema)
    pantalla = (
      <PasoRuta
        p={problema}
        asignaturas={asignaturas}
        lugar={lugar}
        especies={especies?.estado === "listo" ? especies.r.especies : []}
      />
    );
  else if (paso === 5 && armada)
    pantalla = (
      <PasoLlevar
        key={ronda}
        enlace={aEnlace(armada, sede)}
        kiosco={kiosco}
        correo={correo}
        onEnviar={enviar}
        onOtra={reiniciar}
        onCuaderno={alCuaderno}
      />
    );

  const colorProblema = problema ? odsDe(problema.id)[0]?.color : undefined;

  return (
    <div
      ref={contenedor}
      className={kiosco ? "fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white" : "flex flex-1 flex-col bg-white"}
    >
      <FranjaOds alto={kiosco ? "h-3" : "h-2"} />

      {kiosco && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <button type="button" onClick={reiniciar} className="text-xl font-bold tracking-tight text-[#0a0047]">
            AprendeLocal
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={pantallaCompleta}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600"
              aria-label={tx("Pantalla completa", "Tela cheia")}
            >
              <Expand className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {paso > 0 && (
        <nav aria-label={tx("Pasos del demo", "Passos da demonstração")} className="px-4 pt-4 sm:px-8">
          <ol className="mx-auto flex max-w-6xl gap-2">
            {etiquetas.map((e, i) => {
              const n = i + 1;
              const hecho = n < paso;
              const actual = n === paso;
              return (
                <li key={e} className="flex-1">
                  <span
                    className="block h-2 rounded-full transition-colors"
                    style={{ background: actual ? (colorProblema ?? "#0a0047") : hecho ? "#0a0047" : "#e2e8f0" }}
                  />
                  <span
                    className={`mt-1.5 hidden text-xs font-semibold sm:block ${actual ? "text-[#111217]" : "text-slate-400"}`}
                    aria-current={actual ? "step" : undefined}
                  >
                    {e}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <main
        ref={principal}
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-4 pb-40 pt-8 outline-none sm:px-8 sm:pt-12"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${paso}-${ronda}`}
            initial={quieto ? { opacity: 0 } : { opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={quieto ? { opacity: 0 } : { opacity: 0, x: -32 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {pantalla}
          </motion.div>
        </AnimatePresence>
      </main>

      {paso > 0 && paso < 5 && (
        <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
          <div className="mx-auto flex max-w-6xl items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={atras}
              aria-label={tx("Atrás", "Voltar")}
              className="inline-flex min-h-14 shrink-0 items-center gap-2 rounded-full border-2 border-slate-200 px-4 font-bold text-slate-700 transition hover:border-slate-400 sm:px-6"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
              <span className="hidden sm:inline">{tx("Atrás", "Voltar")}</span>
            </button>
            {/* La noticia no cabe en un teléfono: ahí la barra es solo para avanzar. */}
            <div className="hidden min-w-0 flex-1 sm:block">
              {paso === 1 && problema && <Noticia p={problema} />}
              {paso === 2 && asignaturas.length === 0 && (
                <p className="text-slate-500">{tx("Elige al menos una asignatura.", "Escolha pelo menos um componente.")}</p>
              )}
            </div>
<div className="ml-auto">
            <BotonPrincipal onClick={siguiente} disabled={!puedeSeguir}>
              {paso === 3 ? (
                <>
                  {tx("Ver mi ruta", "Ver minha rota")} <ArrowRight className="h-5 w-5" aria-hidden />
                </>
              ) : paso === 4 ? (
                <>
                  <Mail className="h-5 w-5" aria-hidden />
                  {HAY_SORTEO ? tx("Quiero mi número para el sorteo", "Quero meu número para o sorteio") : tx("Llevarme la ruta", "Levar a rota")}
                </>
              ) : (
                <>
                  {tx("Siguiente", "Próximo")} <ArrowRight className="h-5 w-5" aria-hidden />
                </>
              )}
            </BotonPrincipal>
            </div>
          </div>
        </div>
      )}

      {cuenta !== null && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="congreso-sigues"
          className="fixed inset-0 z-[70] grid place-items-center bg-[#0a0047]/70 p-4"
          onPointerDown={() => setCuenta(null)}
        >
          <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-2xl">
            <p id="congreso-sigues" className="display text-4xl text-[#111217]">
              {tx("¿Sigues ahí?", "Ainda está aí?")}
            </p>
            <p className="mt-3 text-lg text-slate-600">
              {tx("Volvemos al inicio en ", "Voltamos ao início em ")}
              <span className="cifra font-bold text-[#DD1367]">{cuenta}</span> s
            </p>
            <div className="mt-6">
              <BotonPrincipal onClick={() => setCuenta(null)}>{tx("Sigo aquí", "Estou aqui")}</BotonPrincipal>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
