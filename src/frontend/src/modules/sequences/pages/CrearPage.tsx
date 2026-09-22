/**
 * Crear una ruta, por diapositivas.
 *
 * Reemplaza el formulario largo que había antes: todo a la vista, todo
 * obligatorio, y la sensación de trámite antes de haber escrito una palabra.
 * Ahora son tres láminas, una cosa a la vez, y lo escrito se guarda solo
 * después de cada tecla.
 *
 * El paso uno viene partido en dos porque son dos conversaciones distintas:
 * una se contesta con la planificación al lado y la otra mirando por la
 * ventana. Juntarlas era lo que hacía pesado el formulario viejo.
 */

import { useState } from "react";

import Diapositivas, { type Lamina } from "../crear/Diapositivas";
import { PasoLugar, PasoPrograma } from "../crear/Paso1";
import Paso3 from "../crear/Paso3";
import type { EstadoNube } from "../crear/nube";
import { useExpedicion } from "../crear/useExpedicion";
import { useTx } from "../../../shared/tx";

/**
 * Dónde quedó lo escrito, en una línea.
 *
 * Reemplaza al botón «Guardar y salir», que decía dos cosas y solo una era
 * cierta: salir sí, pero guardar no hacía nada que no hubiera pasado ya,
 * porque el cuaderno se guarda en cada tecla. Lo que la persona necesitaba
 * saber era eso, y ahora se dice todo el rato en vez de solo al irse.
 */
const GUARDADO: Record<EstadoNube, { es: string; pt: string }> = {
  sin_cuenta: { es: "Guardado en este computador", pt: "Salvo neste computador" },
  guardando: { es: "Guardando…", pt: "Salvando…" },
  guardado: { es: "Guardado en tu cuenta", pt: "Salvo na sua conta" },
  sin_conexion: {
    es: "Guardado en este computador · sin señal para subirlo",
    pt: "Salvo neste computador · sem sinal para enviar",
  },
  sin_tabla: { es: "Guardado en este computador", pt: "Salvo neste computador" },
};

export default function CrearPage() {
  const [indice, setIndice] = useState(0);
  const tx = useTx();

  /*
   * Se guarda en cada cambio, en dos sitios.
   *
   * En el navegador, de inmediato: en una escuela rural la luz se corta y la
   * sesión se cierra sola, y que veinte minutos de trabajo dependan de que eso
   * no pase es pedir demasiado. Y en la cuenta, un momento después, para que
   * lo que se armó el viernes en la sala de profesores esté el lunes en la
   * casa. El hook lleva las dos y decide cuál gana al abrir.
   */
  const { expedicion: e, cambiar: setE, estado } = useExpedicion();

  const hayLugar = Boolean(e.entorno || e.ubicacion.trim());

  const laminas: Lamina[] = [
    {
      id: "programa",
      marca: tx("I · Lo que pide el programa", "I · O que o currículo pede"),
      titulo: tx("El curso y el tiempo que hay", "A turma e o tempo que existe"),
      bajada: tx(
        "Los cursos que tienes y cuántas clases hay de verdad para esto.",
        "As turmas que você tem e quantas aulas existem de verdade para isto."
      ),
      contenido: <PasoPrograma e={e} onCambio={setE} />,
      puedeAvanzar: true,
    },
    {
      id: "lugar",
      marca: tx("II · Lo que pone el lugar", "II · O que o lugar traz"),
      titulo: tx("El lugar y la problemática", "O lugar e a problemática"),
      bajada: tx(
        "Busca tu escuela, elige la problemática y sus Objetivos de Aprendizaje, y prepara la clase previa a la salida.",
        "Encontre sua escola, escolha a problemática e as habilidades da BNCC, e prepare a aula anterior à saída."
      ),
      contenido: <PasoLugar e={e} onCambio={setE} />,
      puedeAvanzar: hayLugar,
      faltaPara: tx(
        "Falta decir qué hay alrededor de la escuela.",
        "Falta dizer o que há ao redor da escola."
      ),
    },
    {
      id: "ruta",
      marca: tx("III · Lo que queda armado", "III · O que fica pronto"),
      titulo: tx("Lo que queda armado", "O que fica pronto"),
      bajada: tx(
        "El producto, los indicadores y los papeles de la salida. Todo sale de lo que ya elegiste. El plan de clases se anota en el seguimiento, que es donde se marca a medida que se dan.",
        "O produto, os indicadores e os documentos da saída. Tudo sai do que você já escolheu. O plano de aulas se anota no acompanhamento, onde se marca à medida que as aulas acontecem."
      ),
      contenido: <Paso3 e={e} onCambio={setE} />,
    },
  ];

  return (
    <Diapositivas
      laminas={laminas}
      indice={indice}
      onIndice={setIndice}
      guardado={tx.de(GUARDADO[estado])}
      alTerminar={{ a: "/proyecto", texto: tx("Ir al seguimiento", "Ir para o acompanhamento") }}
    />
  );
}
