import { useState } from "react";

import { Hoja } from "../crear/Campos";
import { buscarOA } from "../crear/oa";
import type { Expedicion } from "../crear/expedicion";
import { ETAPAS } from "./etapas";
import { tecnicaPorId } from "./tecnicas";

/**
 * Los indicadores con que se va a mirar cada objetivo.
 *
 * POR QUÉ ESTO EXISTE
 *
 * Lo pidieron dos docentes por separado, en dos entrevistas distintas, sin
 * conocerse. Uno lo dijo como «falta el desglose de indicadores derivados de
 * los objetivos, para que el docente pueda verificar». La otra lo mostró en
 * pantalla: abrió su plataforma de planificación, abrió un objetivo, y debajo
 * aparecían los indicadores, con la posibilidad de elegir cuáles iba a usar,
 * editarlos y agregar los suyos. Eso es exactamente lo que falta aquí.
 *
 * Que dos personas pidan lo mismo sin hablar entre ellas es la señal más
 * fuerte que da una validación.
 *
 * POR QUÉ NO SE COPIAN LOS DEL MINISTERIO
 *
 * Por dos razones, y la segunda pesa más.
 *
 * La primera es que no los tenemos. Los indicadores viven en los programas de
 * estudio, que son documentos aparte de las Bases Curriculares y que ella misma
 * describió como imposibles de encontrar. Escribirlos de memoria sería
 * inventar datos del currículum y ponerlos en una hoja que se firma.
 *
 * La segunda es que, cuando los tuvo delante, no le servían. Leyó uno en voz
 * alta y su conclusión fue: «jamás voy a evaluar nada con eso». Un indicador
 * sirve si dice qué se va a mirar en la sala este jueves, y los del programa
 * están escritos para otra cosa.
 *
 * DE DÓNDE SALEN ENTONCES
 *
 * De lo que ya está escrito en este proyecto y es observable. Cada etapa del
 * método trae aprendizajes y cada aprendizaje trae un «se nota en que», que es
 * un indicador en todo menos en el nombre: dice qué se ve cuando ocurrió. La
 * técnica que van a ensayar trae lo que queda registrado. Esas frases existen,
 * no se generan, y describen a este curso.
 *
 * Se ofrecen para marcar, se pueden editar y se pueden escribir otros. Y se
 * dice en pantalla que no son los del programa, porque alguien va a copiar esta
 * hoja en un documento oficial y tiene que saber qué está copiando.
 */

/** Un indicador candidato, con de dónde salió para poder decirlo. */
type Candidato = { texto: string; deDonde: string };

/**
 * Los indicadores que este proyecto ya tiene escritos.
 *
 * No se filtran por objetivo, y es a propósito: un mismo indicador sirve para
 * objetivos distintos según lo que se mire, y esa decisión la toma quien hace
 * la clase. Ordenarlos por etapa sí ayuda, porque así se ve en qué momento del
 * proyecto se puede mirar cada cosa.
 */
function candidatosDe(e: Expedicion): Candidato[] {
  const salida: Candidato[] = [];

  for (const etapa of ETAPAS) {
    for (const a of etapa.aprendizajes) {
      salida.push({
        texto: `${a.nombre}: se nota en que ${a.seNotaEn}`,
        deDonde: etapa.nombre,
      });
    }
  }

  for (const id of e.tecnicas) {
    const t = tecnicaPorId(id);
    if (!t) continue;
    salida.push({
      texto: `Aplica ${t.nombre.toLowerCase()} y vuelve con el registro completo y legible.`,
      deDonde: "La técnica que ensayaron",
    });
  }

  return salida;
}

export function Indicadores({
  e,
  onCambio,
  orden = 5,
}: {
  e: Expedicion;
  onCambio: (e: Expedicion) => void;
  orden?: number;
}) {
  const marcados = e.oa.map((cod) => ({ cod, oa: buscarOA(cod) })).filter((x) => x.oa);

  if (marcados.length === 0) {
    return (
      <Hoja titulo="Con qué vas a mirar cada objetivo" orden={orden}>
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/82">
          Esto aparece cuando marques objetivos de aprendizaje. Para cada uno
          vas a poder dejar escrito qué se mira en la sala para saber si
          ocurrió.
        </p>
      </Hoja>
    );
  }

  const candidatos = candidatosDe(e);

  return (
    <Hoja titulo="Con qué vas a mirar cada objetivo" orden={orden}>
      <p className="mb-3 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        Un objetivo del programa no se puede mirar directamente: hay que decir
        qué se ve en la sala cuando ocurrió. Eso es lo que va aquí, y es lo que
        después se copia en la pauta de evaluación.
      </p>

      {/* Esto va arriba y no en letra chica al final. Alguien va a copiar esta
          hoja en un documento oficial, y tiene que saber qué está copiando. */}
      <p className="mb-5 max-w-2xl rounded-xl border border-[var(--tierra-300)]/30 bg-[var(--tierra-300)]/[0.06] px-4 py-3 text-[15px] leading-relaxed text-[var(--tierra-300)]">
        Estos no son los indicadores oficiales del programa de estudio. Son los
        de este proyecto, escritos para poder mirarlos en clase. Si tu
        establecimiento te pide los del programa, estos van además, no en lugar
        de aquellos.
      </p>

      <div className="space-y-3">
        {marcados.map(({ cod, oa }) => (
          <PorObjetivo
            key={cod}
            codigo={cod}
            texto={oa!.texto}
            puestos={e.indicadores[cod] ?? []}
            candidatos={candidatos}
            onCambio={(lista) =>
              onCambio({ ...e, indicadores: { ...e.indicadores, [cod]: lista } })
            }
          />
        ))}
      </div>
    </Hoja>
  );
}

function PorObjetivo({
  codigo,
  texto,
  puestos,
  candidatos,
  onCambio,
}: {
  codigo: string;
  texto: string;
  puestos: string[];
  candidatos: Candidato[];
  onCambio: (lista: string[]) => void;
}) {
  const [abierto, ponerAbierto] = useState(false);
  const [escribiendo, ponerEscribiendo] = useState("");
  /** Cuál se está editando, por su posición. */
  const [editando, ponerEditando] = useState<number | null>(null);
  const [borrador, ponerBorrador] = useState("");

  function agregar(t: string) {
    const limpio = t.trim();
    if (!limpio || puestos.includes(limpio)) return;
    onCambio([...puestos, limpio]);
  }

  function guardarEdicion() {
    if (editando === null) return;
    const limpio = borrador.trim();
    onCambio(
      limpio
        ? puestos.map((x, i) => (i === editando ? limpio : x))
        : puestos.filter((_, i) => i !== editando)
    );
    ponerEditando(null);
  }

  return (
    <section className="rounded-xl border border-[var(--crema)]/14 p-4">
      <p className="font-mono text-xs text-[var(--tierra-600)]">{codigo}</p>
      <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--crema-clara)]">
        {texto}
      </p>

      {puestos.length > 0 && (
        <ul className="mt-3.5 space-y-2">
          {puestos.map((x, i) => (
            <li key={`${x}-${i}`}>
              {editando === i ? (
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={borrador}
                    autoFocus
                    onChange={(ev) => ponerBorrador(ev.target.value)}
                    onKeyDown={(ev) => {
                      if (ev.key === "Enter") {
                        ev.preventDefault();
                        guardarEdicion();
                      }
                      if (ev.key === "Escape") ponerEditando(null);
                    }}
                    className="min-h-11 min-w-0 flex-1 rounded-lg border border-[var(--tierra-600)] bg-transparent px-3 py-2 text-[15px] text-[var(--crema-clara)]"
                  />
                  <button
                    type="button"
                    onClick={guardarEdicion}
                    className="min-h-11 rounded-full bg-[var(--tierra-600)] px-4 text-sm font-medium text-[#1e2a24]"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <div className="flex items-start gap-2.5">
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tierra-600)]"
                  />
                  <span className="min-w-0 flex-1 text-[15px] leading-relaxed text-[var(--crema)]/85">
                    {x}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      ponerEditando(i);
                      ponerBorrador(x);
                    }}
                    className="min-h-11 shrink-0 px-2 text-sm text-[var(--crema)]/70 hover:text-[var(--crema-clara)]"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onCambio(puestos.filter((_, j) => j !== i))}
                    className="min-h-11 shrink-0 px-2 text-sm text-[var(--crema)]/70 hover:text-[var(--tierra-300)]"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3.5 flex flex-wrap gap-2.5">
        <input
          type="text"
          value={escribiendo}
          onChange={(ev) => ponerEscribiendo(ev.target.value)}
          onKeyDown={(ev) => {
            if (ev.key !== "Enter") return;
            ev.preventDefault();
            agregar(escribiendo);
            ponerEscribiendo("");
          }}
          placeholder="Escribe un indicador tuyo: qué vas a ver en la sala"
          className="min-h-11 min-w-0 flex-1 rounded-lg border border-[var(--crema)]/18 bg-transparent px-3 py-2 text-[15px] text-[var(--crema-clara)] placeholder:text-[var(--crema)]/30"
        />
        <button
          type="button"
          onClick={() => {
            agregar(escribiendo);
            ponerEscribiendo("");
          }}
          className="min-h-11 rounded-full border border-[var(--crema)]/25 px-4 text-sm text-[var(--crema-clara)] transition hover:bg-[var(--crema)]/10"
        >
          Agregar
        </button>
      </div>

      <button
        type="button"
        onClick={() => ponerAbierto(!abierto)}
        aria-expanded={abierto}
        className="mt-3 min-h-11 text-sm text-[var(--crema)]/78 underline decoration-[var(--crema)]/30 underline-offset-4 hover:text-[var(--crema-clara)]"
      >
        {abierto
          ? "Cerrar los de este proyecto"
          : "Tomar uno de los que ya tiene este proyecto"}
      </button>

      {abierto && (
        <ul className="mt-3 space-y-1.5 border-t border-[var(--crema)]/12 pt-3.5">
          {candidatos
            .filter((c) => !puestos.includes(c.texto))
            .map((c) => (
              <li key={c.texto}>
                <button
                  type="button"
                  onClick={() => agregar(c.texto)}
                  className="w-full rounded-lg border border-[var(--crema)]/12 px-3.5 py-2.5 text-left transition hover:border-[var(--crema)]/32"
                >
                  <span className="rotulo block text-[var(--crema)]/60">
                    {c.deDonde}
                  </span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-[var(--crema)]/85">
                    {c.texto}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
