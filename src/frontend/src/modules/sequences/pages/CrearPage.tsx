/**
 * Crear una ruta, por diapositivas.
 *
 * Reemplaza el formulario largo que había antes: todo a la vista, todo
 * obligatorio, y la sensación de trámite antes de haber escrito una palabra.
 * Ahora son cuatro láminas, una cosa a la vez, y lo escrito se guarda solo
 * después de cada tecla.
 *
 * El paso uno viene partido en dos porque son dos conversaciones distintas:
 * una se contesta con la planificación al lado y la otra mirando por la
 * ventana. Juntarlas era lo que hacía pesado el formulario viejo.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Diapositivas, { type Lamina } from "../crear/Diapositivas";
import { PasoLugar, PasoPrograma } from "../crear/Paso1";
import Paso2 from "../crear/Paso2";
import Paso3 from "../crear/Paso3";
import { completitudPaso1 } from "../crear/expedicion";
import { useExpedicion } from "../crear/useExpedicion";

export default function CrearPage() {
  const navegar = useNavigate();
  const [indice, setIndice] = useState(0);

  /*
   * Se guarda en cada cambio, en dos sitios.
   *
   * En el navegador, de inmediato: en una escuela rural la luz se corta y la
   * sesión se cierra sola, y que veinte minutos de trabajo dependan de que eso
   * no pase es pedir demasiado. Y en la cuenta, un momento después, para que
   * lo que se armó el viernes en la sala de profesores esté el lunes en la
   * casa. El hook lleva las dos y decide cuál gana al abrir.
   */
  const { expedicion: e, avance, estado, cambiar: setE, cambiarAvance } = useExpedicion();

  const completo = completitudPaso1(e);
  const hayLugar = Boolean(e.entorno || e.ubicacion.trim() || e.fenomeno.trim());
  const hayPregunta = Boolean(e.preguntaGuia.trim());

  const laminas: Lamina[] = [
    {
      id: "programa",
      marca: "I · Lo que pide el programa",
      titulo: "Antes de salir, lo que ya está decidido",
      bajada:
        "Los cursos que tienes, las semanas que hay y lo que la unidad exige. Es lo que no se elige, y por eso conviene ponerlo primero.",
      contenido: <PasoPrograma e={e} onCambio={setE} />,
      puedeAvanzar: true,
    },
    {
      id: "lugar",
      marca: "II · Lo que pone el lugar",
      titulo: "Qué hay al otro lado de la puerta",
      bajada:
        "Lo que se alcanza caminando, cómo se llama y qué pasa ahí que en otra escuela no pasaría igual. De aquí sale todo lo demás.",
      contenido: <PasoLugar e={e} onCambio={setE} />,
      puedeAvanzar: hayLugar,
      faltaPara: "Falta decir qué hay alrededor de la escuela.",
    },
    {
      id: "preguntas",
      marca: "III · Las preguntas",
      titulo: "La pregunta que aguanta tres semanas",
      bajada:
        "Aquí el sistema propone y tú corriges. Las de abajo son borradores armados con lo que escribiste; la que llegue a la ruta debería llevar tus palabras.",
      contenido: <Paso2 e={e} onCambio={setE} />,
      puedeAvanzar: hayPregunta,
      faltaPara: "Falta la pregunta que va al centro.",
    },
    {
      id: "ruta",
      marca: "IV · La ruta armada",
      titulo: "Las sesiones, el curso y lo que vive ahí",
      bajada:
        "De los objetivos que marcaste y del lugar que describiste sale una ruta, con sus sesiones, su material, la evaluación que elegiste y lo que vive alrededor. Si no te convence, hay otras.",
      contenido: (
        <Paso3
          e={e}
          onCambio={setE}
          avance={avance}
          onAvance={cambiarAvance}
          estadoNube={estado}
        />
      ),
    },
  ];

  return (
    <>
      <Diapositivas
        laminas={laminas}
        indice={indice}
        onIndice={setIndice}
        onSalir={() => navegar("/")}
      />
      {/* Lo escrito no se pierde al salir: se lee de vuelta al entrar. Se dice
          en voz baja, para que nadie tenga que averiguarlo probando. */}
      <p className="sr-only">
        Llevas {completo}% del primer paso. Todo queda guardado en este
        computador.
      </p>
    </>
  );
}
