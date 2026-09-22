import { useRef } from "react";

import { Hoja } from "../crear/Campos";
import { Copiar } from "../crear/Copiar";
import type { Expedicion } from "../crear/expedicion";
import { buscarObjetivo } from "../contenido/curriculo";
import { useContenido } from "../contenido";
import { useTx } from "../../../shared/tx";
import { problemaPorId } from "./problemas";
import { tecnicaPorId } from "./tecnicas";

/**
 * Los dos papeles de la salida a terreno.
 *
 * Esto salió entero de una entrevista de validación y es de las cosas más
 * útiles que se han agregado, porque es trabajo administrativo puro: una
 * salida a terreno en Chile necesita DOS documentos distintos, el formulario
 * de la Superintendencia de Educación y la autorización de los apoderados, y
 * los dos piden campos que el docente ya escribió aquí.
 *
 * El formulario de la Superintendencia pide nombre de la actividad, fecha y
 * hora, lugar, curso, docente responsable, objetivos, objetivos de
 * aprendizaje, diseño pedagógico, ejes transversales, transporte y seguro
 * escolar. De esos, siete ya están en la expedición. Los cuatro que faltan
 * —fecha, hora, transporte y seguro— son los únicos que hay que escribir, y
 * van marcados con líneas para llenar a mano o en pantalla.
 *
 * LA LISTA DE QUÉ LLEVAR
 *
 * La pidió ella y no se me había ocurrido: el equipo cambia con la estación,
 * el terreno y la hora. Bloqueador y agua en enero, botas y capa en junio. Va
 * aquí y no en la técnica porque es cosa de la salida, no del instrumento.
 *
 * EN BRASIL
 *
 * No sabemos qué formulario pide cada rede de ensino de Río para sacar un
 * curso del recinto, y no se inventa uno. Lo que se arma es un modelo con los
 * campos que casi cualquier escuela pide —qué, cuándo, dónde, con quién, para
 * qué y con qué cuidados— y la autorización de los responsables, y se dice
 * arriba que es un modelo: si la escuela tiene el suyo, se usa el suyo. La
 * lista de qué llevar sigue el clima de Río, que no tiene las estaciones del
 * sur de Chile: el riesgo del verano es la tormenta de la tarde.
 */

/** Lo que hay que llevar puesto o encima, según cuándo y adónde se va. */
type Llevar = { titulo: string; cosas: string[]; cuando: string };

/** Lo mismo, para una escuela de Río. */
const QUE_LLEVAR_BR: Llevar[] = [
  {
    titulo: "Sempre",
    cuando: "Para qualquer saída, em qualquer mês",
    cosas: [
      "Garrafa de água, uma por pessoa",
      "Calçado fechado que possa molhar ou sujar",
      "Um lanche: uma saída de noventa minutos pega o recreio",
      "O caderno ou a ficha de campo, em papel",
      "Kit de primeiros socorros, com o professor",
      "Um celular carregado: serve para fotografar, para a hora e para ligar para a escola",
    ],
  },
  {
    titulo: "De dezembro a março",
    cuando: "Calor forte e temporais de verão",
    cosas: [
      "Protetor solar, passado antes de sair e não no caminho",
      "Boné ou chapéu",
      "Mais água do que parece necessário",
      "Os temporais costumam vir à tarde: prefira sair de manhã e confira o alerta de chuva antes",
    ],
  },
  {
    titulo: "De junho a agosto",
    cuando: "Manhãs mais frescas e menos chuva",
    cosas: [
      "Um casaco leve para o começo da manhã",
      "Protetor solar também: o sol continua forte",
      "Com menos chuva, é a melhor época para medir rio e encosta",
    ],
  },
  {
    titulo: "Se for à beira de rio, canal ou praia",
    cuando: "Rio, canal, lagoa ou manguezal",
    cosas: [
      "Ninguém desce a margem nem entra na água",
      "Luvas se for tocar água suspeita",
      "Álcool em gel ou sabão para depois",
      "Um saco para a roupa que molhar",
    ],
  },
  {
    titulo: "Se for a encosta ou morro",
    cuando: "Morro, barranco, escadaria",
    cosas: [
      "Calçado com sola que não escorregue",
      "Ninguém fica ao pé de um barranco: pode descer terra",
      "Combine o trajeto com alguém da comunidade antes de subir",
    ],
  },
];

const QUE_LLEVAR: { titulo: string; cosas: string[]; cuando: string }[] = [
  {
    titulo: "Siempre",
    cuando: "Vaya donde vaya el curso y en cualquier mes",
    cosas: [
      "Botella de agua, una por persona",
      "Calzado cerrado que se pueda mojar o embarrar",
      "Una colación: una salida de noventa minutos pilla el recreo",
      "El cuaderno o la hoja de terreno, en papel",
      "Botiquín pequeño, con el docente",
      "Un teléfono cargado, aunque no haya señal: sirve para fotografiar y para la hora",
    ],
  },
  {
    titulo: "De noviembre a marzo",
    cuando: "Sol fuerte y días largos",
    cosas: [
      "Bloqueador, aplicado antes de salir y no en el camino",
      "Gorro con visera o de ala",
      "Manga larga liviana: cubre mejor que el bloqueador",
      "Más agua de la que parece necesaria",
    ],
  },
  {
    titulo: "De abril a octubre",
    cuando: "Lluvia, barro y poca luz",
    cosas: [
      "Capa de agua o parka impermeable, no paraguas: se necesitan las dos manos",
      "Botas de goma si se va a un cauce o a un terreno blando",
      "Una muda de calcetines en la mochila",
      "Salir temprano: a las seis ya está oscuro",
    ],
  },
  {
    titulo: "Si se entra al agua o a la orilla",
    cuando: "Río, estero, canal o humedal",
    cosas: [
      "Botas altas, y nadie entra por sobre la rodilla",
      "Guantes si se va a tocar agua sospechosa",
      "Bolsa para la ropa que se moje",
      "Jabón o alcohol gel para después",
    ],
  },
  {
    titulo: "Si se camina por ladera o corte",
    cuando: "Cerro, barranca, corte de camino",
    cosas: [
      "Calzado con suela que agarre",
      "Nadie se pone al pie de un corte: se desprende tierra",
      "Guantes de trabajo si se va a cavar",
    ],
  },
];

export function Permisos({ e, orden = 7 }: { e: Expedicion; orden?: number }) {
  const c = useContenido();
  if (c.papeles === "br") return <PermisosBR e={e} orden={orden} />;
  return <PermisosCL e={e} orden={orden} />;
}

function PermisosCL({ e, orden }: { e: Expedicion; orden: number }) {
  const papeles = useRef<HTMLDivElement>(null);
  const problema = e.problemaId ? problemaPorId(e.problemaId) : null;
  const titulo = problema?.nombre || e.problemaPropioNombre.trim() || e.problemaPropio.trim();
  const tecnicas = e.tecnicas.map((t) => tecnicaPorId(t, "es")).filter(Boolean);
  const oas = e.oa.map((cod) => ({ cod, oa: buscarObjetivo(cod) })).filter((x) => x.oa);
  const sale = Boolean(e.ubicacion.trim());

  if (!sale) {
    return (
      <Hoja titulo="Los permisos de la salida" orden={orden}>
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/82">
          Los dos permisos aparecen cuando quede elegido el lugar al que va el
          curso. Si el proyecto se resuelve dentro del recinto no hace falta
          ninguno de los dos.
        </p>
      </Hoja>
    );
  }

  const linea = "________________";

  return (
    <Hoja
      titulo="Los permisos de la salida"
      orden={orden}
      resumen="El formulario de la Superintendencia y la autorización de apoderados, armados con lo que ya escribiste, más la lista de qué llevar."
    >
      <p className="mb-5 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        Los campos salen de lo que ya escribiste. Los que llevan línea son los
        que hay que completar a mano.
      </p>

      {/* ── Superintendencia ──────────────────────────────────────────── */}
      <div ref={papeles}>
      <div className="space-y-3.5 rounded-xl border border-[var(--crema)]/12 p-5 text-[15px] leading-relaxed text-[var(--crema)]/85">
        <p className="rotulo text-[var(--tierra-600)]">
          Formulario de la Superintendencia de Educación
        </p>

        <Campo etiqueta="Nombre de la actividad" valor={titulo || linea} />
        <Campo etiqueta="Fecha y hora" valor={linea} falta />
        <Campo etiqueta="Lugar" valor={e.ubicacion} />
        <Campo
          etiqueta="Curso o cursos"
          valor={e.cursos.length ? e.cursos.join(", ") : linea}
        />
        <Campo etiqueta="Docente responsable" valor={e.docente || linea} />
        <Campo
          etiqueta="Número de estudiantes"
          valor={e.estudiantes ? String(e.estudiantes) : linea}
        />

        <div>
          <p className="text-[var(--crema-clara)]">Objetivo de la actividad</p>
          <p className="mt-1">
            {`Que el curso levante en terreno los datos que necesita para trabajar la problemática de ${titulo.toLowerCase()}.`}
          </p>
        </div>

        {oas.length > 0 && (
          <div>
            <p className="text-[var(--crema-clara)]">Objetivos de aprendizaje</p>
            <ul className="mt-1 space-y-1">
              {oas.map(({ cod, oa }) => (
                <li key={cod} className="flex gap-2.5">
                  <span className="shrink-0 font-mono text-xs text-[var(--tierra-600)]">
                    {cod}
                  </span>
                  <span>{oa?.texto}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="text-[var(--crema-clara)]">Diseño pedagógico</p>
          <p className="mt-1">
            El curso trabajó en aula los conceptos
            {e.conceptos.length ? ` de ${e.conceptos.join(", ")}` : " del objetivo"} y
            ensayó en la sala
            {tecnicas.length
              ? ` la técnica de ${tecnicas.map((t) => t!.nombre.toLowerCase()).join(" y ")}`
              : " la técnica de recolección"}
            . En terreno la aplica, y en las clases siguientes contrasta lo que
            recolectó con lo que suponía antes de salir. Cierra construyendo y
            entregando un producto a un destinatario de la comunidad.
          </p>
        </div>

        <Campo
          etiqueta="Ejes transversales"
          valor="Formación ciudadana; cuidado del entorno; trabajo en equipo y responsabilidad en el espacio público."
        />
        <Campo etiqueta="Transporte" valor={linea} falta />
        <Campo etiqueta="Seguro escolar" valor={linea} falta />

        {tecnicas.length > 0 && (
          <div>
            <p className="text-[var(--crema-clara)]">Medidas de seguridad</p>
            <p className="mt-1">
              {[...new Set(tecnicas.flatMap((t) => t!.seguridad))].join("; ")}.
            </p>
          </div>
        )}
      </div>

      {/* ── Apoderados ────────────────────────────────────────────────── */}
      <div className="mt-4 space-y-3.5 rounded-xl border border-[var(--crema)]/12 p-5 text-[15px] leading-relaxed text-[var(--crema)]/85">
        <p className="rotulo text-[var(--tierra-600)]">
          Autorización de apoderados
        </p>
        <p>
          Yo, {linea}, apoderado o apoderada de {linea}, del curso{" "}
          {e.cursos.length ? e.cursos.join(", ") : linea}, autorizo su
          participación en la salida pedagógica a {e.ubicacion}, el día {linea},
          entre las {linea} y las {linea} horas, a cargo de{" "}
          {e.docente || linea}.
        </p>
        <p>
          Declaro estar en conocimiento de que la actividad forma parte del
          trabajo de la asignatura, que el estudiante permanecerá acompañado por
          personal del establecimiento durante toda la salida, y que cuenta con
          la cobertura del seguro escolar.
        </p>
        <p className="text-[var(--crema)]/78">
          Alguna condición de salud, alergia o medicamento que debamos saber:{" "}
          {linea}
        </p>
        <p className="border-t border-[var(--crema)]/12 pt-3.5 text-[var(--crema)]/72">
          Firma: {linea} · RUT: {linea} · Teléfono de contacto: {linea} · Fecha:
          ____ / ____ / ______
        </p>
      </div>

      </div>

      {/* ── Qué llevar ────────────────────────────────────────────────── */}
      <QueLlevar
        lista={QUE_LLEVAR}
        titulo="Qué tiene que llevar el curso"
        bajada="Va en la circular a las familias."
      />

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-11 rounded-full border border-[var(--crema)]/25 px-5 text-sm font-medium text-[var(--crema-clara)] transition hover:bg-[var(--crema)]/10"
        >
          Imprimir los dos documentos
        </button>
        <Copiar de={papeles} que="los dos documentos" />
      </div>
    </Hoja>
  );
}

/** Una fila del formulario. `falta` marca lo que la plataforma no puede saber. */
function Campo({
  etiqueta,
  valor,
  falta,
}: {
  etiqueta: string;
  valor: string;
  falta?: boolean;
}) {
  return (
    <p>
      <span className="text-[var(--crema-clara)]">{etiqueta}:</span>{" "}
      <span className={falta ? "text-[var(--tierra-300)]" : ""}>{valor}</span>
    </p>
  );
}

/** La lista de qué llevar, en bloques por estación y por tipo de lugar. */
function QueLlevar({
  lista,
  titulo,
  bajada,
}: {
  lista: Llevar[];
  titulo: string;
  bajada: string;
}) {
  return (
    <div className="mt-6 border-t border-[var(--crema)]/12 pt-5">
      <p className="rotulo text-[var(--crema)]/75">{titulo}</p>
      <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--crema)]/78">{bajada}</p>
      <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
        {lista.map((b) => (
          <div key={b.titulo} className="rounded-xl border border-[var(--crema)]/12 p-4">
            <p className="text-base text-[var(--crema-clara)]">{b.titulo}</p>
            <p className="mt-0.5 text-sm text-[var(--crema)]/72">{b.cuando}</p>
            <ul className="mt-2.5 space-y-1.5">
              {b.cosas.map((x) => (
                <li
                  key={x}
                  className="flex gap-2.5 text-[15px] leading-relaxed text-[var(--crema)]/85"
                >
                  <span aria-hidden className="text-[var(--crema)]/45">
                    ·
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Los papeles de la salida para una escuela de Río.
 *
 * Son un modelo y lo dicen arriba, porque no sabemos qué formulario pide cada
 * rede. Los campos son los que ya se escribieron en el cuaderno; los que
 * llevan línea se llenan a mano.
 */
function PermisosBR({ e, orden }: { e: Expedicion; orden: number }) {
  const papeles = useRef<HTMLDivElement>(null);
  const c = useContenido();
  const tx = useTx();
  const problema = e.problemaId ? problemaPorId(e.problemaId) : null;
  const titulo = problema?.nombre || e.problemaPropioNombre.trim() || e.problemaPropio.trim();
  const tecnicas = e.tecnicas.map((t) => tecnicaPorId(t, "pt")).filter(Boolean);
  const oas = e.oa.map((cod) => ({ cod, oa: buscarObjetivo(cod) })).filter((x) => x.oa);
  const sale = Boolean(e.ubicacion.trim());
  const turmas = e.cursos.length ? e.cursos.map(c.nombreCurso).join(", ") : "";

  if (!sale) {
    return (
      <Hoja titulo="Os documentos da saída de campo" orden={orden}>
        <p className="text-[15px] leading-relaxed text-[var(--crema)]/82">
          Os documentos aparecem quando o lugar aonde a turma vai estiver
          escolhido. Se o projeto se resolve dentro da escola, não é preciso
          nenhum dos dois.
        </p>
      </Hoja>
    );
  }

  const linea = "________________";

  return (
    <Hoja
      titulo="Os documentos da saída de campo"
      orden={orden}
      resumen="O plano da saída para a direção e a autorização dos responsáveis, montados com o que você já escreveu, e a lista do que levar."
    >
      <p className="mb-3 max-w-2xl text-[15px] leading-relaxed text-[var(--crema)]/82">
        Os campos saem do que você já escreveu. Os que têm linha são os que
        precisam ser preenchidos à mão.
      </p>
      <p className="mb-5 max-w-2xl rounded-xl border border-[var(--tierra-300)]/30 bg-[var(--tierra-300)]/[0.06] px-4 py-3 text-[15px] leading-relaxed text-[var(--tierra-300)]">
        São modelos. Se a sua escola ou a sua rede de ensino tiver formulário
        próprio para saída pedagógica, use o dela: os campos costumam ser os
        mesmos, e daqui dá para copiar o texto.
      </p>

      <div ref={papeles}>
        {/* ── Para a direção ───────────────────────────────────────────── */}
        <div className="space-y-3.5 rounded-xl border border-[var(--crema)]/12 p-5 text-[15px] leading-relaxed text-[var(--crema)]/85">
          <p className="rotulo text-[var(--tierra-600)]">Plano da saída de campo, para a direção</p>

          <Campo etiqueta="Nome da atividade" valor={titulo || linea} />
          <Campo etiqueta="Data e horário" valor={linea} falta />
          <Campo etiqueta="Local" valor={e.ubicacion} />
          <Campo etiqueta="Turma ou turmas" valor={turmas || linea} />
          <Campo etiqueta="Professor(a) responsável" valor={e.docente || linea} />
          <Campo
            etiqueta="Número de alunos"
            valor={e.estudiantes ? String(e.estudiantes) : linea}
          />
          <Campo etiqueta="Adultos acompanhantes" valor={linea} falta />

          <div>
            <p className="text-[var(--crema-clara)]">Objetivo da atividade</p>
            <p className="mt-1">
              {`Que a turma colete em campo os dados de que precisa para trabalhar a problemática «${titulo}».`}
            </p>
          </div>

          {oas.length > 0 && (
            <div>
              <p className="text-[var(--crema-clara)]">Habilidades da BNCC</p>
              <ul className="mt-1 space-y-1">
                {oas.map(({ cod, oa }) => (
                  <li key={cod} className="flex gap-2.5">
                    <span className="shrink-0 font-mono text-xs text-[var(--tierra-600)]">
                      {cod}
                    </span>
                    <span>{oa?.texto}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="text-[var(--crema-clara)]">Como a saída se encaixa no projeto</p>
            <p className="mt-1">
              A turma trabalhou em sala os conceitos
              {e.conceptos.length ? ` de ${e.conceptos.join(", ")}` : " da habilidade"} e
              ensaiou em sala
              {tecnicas.length
                ? ` a técnica de ${tecnicas.map((t) => t!.nombre.toLowerCase()).join(" e ")}`
                : " a técnica de coleta"}
              . No campo ela a aplica, e nas aulas seguintes compara o que
              coletou com o que supunha antes de sair. O projeto termina com a
              turma construindo e entregando um produto a um destinatário da
              comunidade.
            </p>
          </div>

          <Campo etiqueta="Transporte" valor={linea} falta />

          {(tecnicas.length > 0 || e.queCuidar.trim()) && (
            <div>
              <p className="text-[var(--crema-clara)]">Cuidados de segurança</p>
              <p className="mt-1">
                {[
                  ...(e.queCuidar.trim() ? [e.queCuidar.trim().replace(/\.$/, "")] : []),
                  ...new Set(tecnicas.flatMap((t) => t!.seguridad)),
                ].join("; ")}
                .
              </p>
            </div>
          )}
        </div>

        {/* ── Para os responsáveis ─────────────────────────────────────── */}
        <div className="mt-4 space-y-3.5 rounded-xl border border-[var(--crema)]/12 p-5 text-[15px] leading-relaxed text-[var(--crema)]/85">
          <p className="rotulo text-[var(--tierra-600)]">Autorização dos responsáveis</p>
          <p>
            Eu, {linea}, responsável por {linea}, da turma {turmas || linea},
            autorizo a sua participação na saída pedagógica a {e.ubicacion}, no
            dia {linea}, das {linea} às {linea} horas, sob a responsabilidade de{" "}
            {e.docente || linea}.
          </p>
          <p>
            Declaro estar ciente de que a atividade faz parte do trabalho em sala
            de aula e de que o aluno ficará acompanhado por profissionais da
            escola durante toda a saída.
          </p>
          <p className="text-[var(--crema)]/78">
            Alguma condição de saúde, alergia ou medicamento que precisemos
            saber: {linea}
          </p>
          <p className="border-t border-[var(--crema)]/12 pt-3.5 text-[var(--crema)]/72">
            Assinatura: {linea} · Telefone para contato: {linea} · Data: ____ /
            ____ / ______
          </p>
        </div>
      </div>

      <QueLlevar
        lista={QUE_LLEVAR_BR}
        titulo="O que a turma precisa levar"
        bajada="Vai no bilhete para as famílias."
      />

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-11 rounded-full border border-[var(--crema)]/25 px-5 text-sm font-medium text-[var(--crema-clara)] transition hover:bg-[var(--crema)]/10"
        >
          {tx("Imprimir los dos documentos", "Imprimir os dois documentos")}
        </button>
        <Copiar de={papeles} que={tx("los dos documentos", "os dois documentos")} />
      </div>
    </Hoja>
  );
}
