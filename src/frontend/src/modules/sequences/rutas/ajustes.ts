/**
 * Lo que cada escuela cambia de una ruta escrita.
 *
 * Una ruta es la misma en las nueve escuelas del piloto: la misma pregunta,
 * el mismo ejemplo resuelto, los mismos ejercicios. Lo que no es igual en
 * ninguna es un puñado de datos, y son justo los que el papel necesita: qué
 * cursos hay sentados en esa sala, cómo se llama su estero, quién firma la
 * carta a las familias.
 *
 * Esa es la diferencia entre una ruta y una plantilla genérica. Sin estos
 * datos la carta dice «un estero, una vertiente o un río al que se pueda
 * llegar caminando» y el docente la corrige a mano cuarenta veces.
 *
 * Se guardan en dos sitios y no en uno, porque no caducan igual:
 *
 *   · Lo de la ESCUELA —nombre, docente, cursos de la sala— se pregunta una
 *     vez y vale para todas las rutas y todo el año.
 *   · Lo de la RUTA —el lugar concreto, la fecha de la salida, a quién se le
 *     entrega— cambia con cada una.
 *
 * Todo vive en el navegador. Sin cuenta, sin señal y sin servidor: pedirle
 * a un docente rural que cree un usuario antes de poder imprimir una hoja es
 * exactamente el paso donde se pierde.
 */

export type AjustesEscuela = {
  escuela: string;
  docente: string;
  /** Los cursos que de verdad hay en la sala. Vacío significa «todavía no lo dijo». */
  cursos: string[];
};

export type AjustesRuta = {
  /** El nombre propio del sitio: «Estero Mahuidanche», no «un estero». */
  lugar: string;
  /** Para la carta a las familias. Formato ISO, que es lo que da el navegador. */
  fechaSalida: string;
  /** A quién se le entrega. Viene propuesto por la ruta y se puede cambiar. */
  destinatario: string;
};

const CLAVE_ESCUELA = "aprendelocal:escuela";
const claveRuta = (id: string) => `aprendelocal:ruta:${id}`;

export const ESCUELA_VACIA: AjustesEscuela = { escuela: "", docente: "", cursos: [] };

/**
 * Leer y escribir nunca deben tumbar la pantalla.
 *
 * En una ventana privada, con las cookies bloqueadas o con el disco lleno,
 * `localStorage` no solo devuelve vacío: lanza. Y esto se llama al pintar,
 * así que una excepción aquí deja al docente delante de una página en blanco
 * por no haber podido recordar el nombre de su escuela.
 */
function leer<T>(clave: string, porDefecto: T): T {
  try {
    const crudo = localStorage.getItem(clave);
    return crudo ? { ...porDefecto, ...JSON.parse(crudo) } : porDefecto;
  } catch {
    return porDefecto;
  }
}

function escribir(clave: string, valor: unknown): void {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* Sin sitio donde guardar se sigue trabajando; solo no se recuerda. */
  }
}

export function leerEscuela(): AjustesEscuela {
  return leer(CLAVE_ESCUELA, ESCUELA_VACIA);
}

export function guardarEscuela(a: AjustesEscuela): void {
  escribir(CLAVE_ESCUELA, a);
}

export function leerRuta(id: string, destinatarioPorDefecto: string): AjustesRuta {
  return leer(claveRuta(id), {
    lugar: "",
    fechaSalida: "",
    destinatario: destinatarioPorDefecto,
  });
}

export function guardarRuta(id: string, a: AjustesRuta): void {
  escribir(claveRuta(id), a);
}

/**
 * La fecha, escrita como se lee y no como la guarda el navegador.
 *
 * `2026-09-14` en una carta a las familias es una fecha de base de datos.
 */
export function fechaLegible(iso: string, idioma: string): string {
  if (!iso) return "";
  const [a, m, d] = iso.split("-").map(Number);
  if (!a || !m || !d) return iso;
  try {
    return new Date(a, m - 1, d).toLocaleDateString(idioma, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
