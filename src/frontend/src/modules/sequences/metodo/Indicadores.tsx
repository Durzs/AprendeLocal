import { useState } from "react";

import { Hoja } from "../crear/Campos";
import { indicadoresDe } from "../crear/indicadores";
import type { Expedicion } from "../crear/expedicion";
import { buscarObjetivo } from "../contenido/curriculo";
import { useContenido } from "../contenido";
import { useTx, type Idioma } from "../../../shared/tx";
import { etapasEn } from "./etapas";
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
 * QUÉ SE MUESTRA
 *
 * Primero, tres indicadores escritos para ese objetivo en concreto, que viven
 * en `indicadores.ts` y están a la vista para marcar. Antes lo único que había
 * eran las frases del método, las mismas para los noventa y tres objetivos, y
 * eso no es un indicador de nada: uno que sirve para cualquier objetivo no
 * distingue ninguno.
 *
 * Después, plegadas, esas frases del método. Siguen sirviendo porque describen
 * lo que se ve en cada etapa, pero ya no son lo único.
 *
 * Y siempre, el campo para escribir los suyos y el botón para editar los
 * propuestos, que es como trabaja un docente de verdad: corrige, que es mucho
 * más rápido que redactar de cero.
 *
 * NO SON LOS DEL MINISTERIO, Y SE DICE
 *
 * Se intentó traerlos. No están en las Bases Curriculares ni en las fichas por
 * objetivo del sitio del currículum: viven dentro de los Programas de Estudio,
 * que hay que descargar en PDF. Una profesora entrevistada los describió como
 * imposibles de encontrar, y tenía razón.
 *
 * El aviso va arriba y no en letra chica, porque alguien va a copiar esta hoja
 * en un documento que se firma y tiene que saber qué está copiando.
 */

/** Un indicador candidato, con de dónde salió para poder decirlo. */
type Candidato = { texto: string; deDonde: string };

/**
 * Los indicadores escritos para ESTE objetivo.
 *
 * Van primero y son la respuesta a lo que se pidió. Antes lo único que se
 * ofrecía eran las frases del método, las mismas para los noventa y tres
 * objetivos, y eso no es un indicador de nada: un indicador que sirve para
 * cualquier objetivo no distingue ninguno.
 */
function candidatosDelObjetivo(codigo: string, idioma: Idioma): Candidato[] {
  return indicadoresDe(codigo).map((texto) => ({
    texto,
    deDonde: idioma === "pt" ? "Escrito para esta habilidade" : "Escrito para este objetivo",
  }));
}

/**
 * Los indicadores que este proyecto ya tiene escritos.
 *
 * No se filtran por objetivo, y es a propósito: un mismo indicador sirve para
 * objetivos distintos según lo que se mire, y esa decisión la toma quien hace
 * la clase. Ordenarlos por etapa sí ayuda, porque así se ve en qué momento del
 * proyecto se puede mirar cada cosa.
 */
function candidatosDe(e: Expedicion, idioma: Idioma): Candidato[] {
  const salida: Candidato[] = [];
  const pt = idioma === "pt";

  for (const etapa of etapasEn(idioma)) {
    for (const a of etapa.aprendizajes) {
      salida.push({
        texto: `${a.nombre}: ${pt ? "nota-se quando" : "se nota en que"} ${a.seNotaEn}`,
        deDonde: etapa.nombre,
      });
    }
  }

  for (const id of e.tecnicas) {
    const t = tecnicaPorId(id, idioma);
    if (!t) continue;
    salida.push({
      texto: pt
        ? `Aplica ${t.nombre.toLowerCase()} e volta com o registro completo e legível.`
        : `Aplica ${t.nombre.toLowerCase()} y vuelve con el registro completo y legible.`,
      deDonde: pt ? "A técnica que ensaiaram" : "La técnica que ensayaron",
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
  const tx = useTx();
  const c = useContenido();
  const marcados = e.oa.map((cod) => ({ cod, oa: buscarObjetivo(cod) })).filter((x) => x.oa);
  const titulo = tx("Indicadores de evaluación", "Indicadores de avaliação");

  if (marcados.length === 0) {
    return (
      <Hoja titulo={titulo} orden={orden}>
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/82">
          {tx(
            "Esto aparece cuando marques objetivos de aprendizaje. Para cada uno vas a poder dejar escrito qué se mira en la sala para saber si ocurrió.",
            "Isto aparece quando você marcar habilidades. Para cada uma vai poder deixar escrito o que se observa em sala para saber se aconteceu."
          )}
        </p>
      </Hoja>
    );
  }

  const candidatos = candidatosDe(e, tx.idioma);

  return (
    <Hoja titulo={titulo} orden={orden}>
      {/* El aviso va arriba y no en letra chica: alguien va a copiar esta hoja
          en un documento que se firma y tiene que saber qué está copiando. */}
      <p className="mb-5 max-w-2xl rounded-xl border border-[var(--tierra-300)]/30 bg-[var(--tierra-300)]/[0.06] px-4 py-2.5 text-[15px] leading-relaxed text-[var(--tierra-300)]">
        {tx(
          "No son los indicadores oficiales del programa. Son los de este proyecto, escritos para poder mirarlos en clase.",
          `Não são indicadores oficiais da ${c.palabras.fuente} nem da rede. São os deste projeto, escritos para poder observá-los em aula.`
        )}
      </p>

      <div className="space-y-3">
        {marcados.map(({ cod, oa }) => (
          <PorObjetivo
            key={cod}
            codigo={cod}
            texto={oa!.texto}
            puestos={e.indicadores[cod] ?? []}
            propios={candidatosDelObjetivo(cod, tx.idioma)}
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
  propios,
  candidatos,
  onCambio,
}: {
  codigo: string;
  texto: string;
  puestos: string[];
  /** Los escritos para este objetivo. Van a la vista, sin plegar. */
  propios: Candidato[];
  /** Los del método, que sirven para cualquiera. Van plegados. */
  candidatos: Candidato[];
  onCambio: (lista: string[]) => void;
}) {
  const [abierto, ponerAbierto] = useState(false);
  const [escribiendo, ponerEscribiendo] = useState("");
  /** Cuál se está editando, por su posición. */
  const [editando, ponerEditando] = useState<number | null>(null);
  const [borrador, ponerBorrador] = useState("");
  const tx = useTx();

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

      {/* Los de este objetivo, a la vista y para marcar. Estaban plegados
          junto con los genéricos, y plegado nadie los abría. */}
      {propios.length > 0 && (
        <ul className="mt-3.5 space-y-1.5">
          {propios.map((c) => {
            const puesto = puestos.includes(c.texto);
            return (
              <li key={c.texto}>
                <button
                  type="button"
                  onClick={() =>
                    onCambio(
                      puesto
                        ? puestos.filter((x) => x !== c.texto)
                        : [...puestos, c.texto]
                    )
                  }
                  aria-pressed={puesto}
                  className={`flex w-full items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-left transition ${
                    puesto
                      ? "border-[var(--tierra-600)] bg-[var(--tierra-600)]/[0.1]"
                      : "border-[var(--crema)]/12 hover:border-[var(--crema)]/30"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[11px] font-bold ${
                      puesto
                        ? "border-[var(--tierra-600)] bg-[var(--tierra-600)] text-[#1e2a24]"
                        : "border-[var(--crema)]/30 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span className="min-w-0 flex-1 text-[15px] leading-relaxed text-[var(--crema)]/85">
                    {c.texto}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Los que el docente escribió o editó, aparte de los propuestos. */}
      {puestos.filter((x) => !propios.some((c) => c.texto === x)).length > 0 && (
        <ul className="mt-2.5 space-y-2">
          {puestos.map((x, i) =>
            propios.some((c) => c.texto === x) ? null : (
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
                    {tx("Guardar", "Salvar")}
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
                    {tx("Editar", "Editar")}
                  </button>
                  <button
                    type="button"
                    onClick={() => onCambio(puestos.filter((_, j) => j !== i))}
                    className="min-h-11 shrink-0 px-2 text-sm text-[var(--crema)]/70 hover:text-[var(--tierra-300)]"
                  >
                    {tx("Quitar", "Remover")}
                  </button>
                </div>
              )}
            </li>
            )
          )}
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
          placeholder={tx(
            "Escribe un indicador tuyo: qué vas a ver en la sala",
            "Escreva um indicador seu: o que você vai observar em aula"
          )}
          aria-label={tx("Indicador propio", "Indicador próprio")}
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
          {tx("Agregar", "Adicionar")}
        </button>
      </div>

      <button
        type="button"
        onClick={() => ponerAbierto(!abierto)}
        aria-expanded={abierto}
        className="mt-3 min-h-11 text-sm text-[var(--crema)]/78 underline decoration-[var(--crema)]/30 underline-offset-4 hover:text-[var(--crema-clara)]"
      >
        {abierto
          ? tx("Cerrar los del método", "Fechar os do método")
          : tx(
              "Ver también los del método, que sirven para cualquier objetivo",
              "Ver também os do método, que servem para qualquer habilidade"
            )}
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
