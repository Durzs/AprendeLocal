/**
 * Los ajustes de lectura: fondo, contraste y tamaño de letra.
 *
 * QUÉ CAMBIÓ Y POR QUÉ
 *
 * Vivían dentro de un botón flotante, «Aa Lectura», clavado en la esquina de
 * abajo a la derecha de todas las pantallas. En el cuaderno, en un teléfono,
 * ese botón tapaba exactamente «Seguir», que es la acción que hace avanzar el
 * cuaderno. Quien planificaba en el celular no podía pasar de lámina sin
 * encontrar primero que había un botón debajo de otro.
 *
 * Ahora el control está en la cabecera, al lado del idioma, que es donde se
 * buscan los ajustes de una página. Y esta lógica vive aparte de la pantalla
 * porque tiene que aplicarse también donde no hay cabecera: quien necesita
 * letra grande la necesita en la pantalla de fijar contraseña igual que en el
 * cuaderno.
 *
 * EL FONDO CLARO PASA A SER EL DE SIEMPRE
 *
 * Antes el cuaderno seguía al sistema del docente: verde oscuro si el teléfono
 * estaba en modo oscuro. El resto del sitio es blanco siempre, así que el paso
 * del escritorio al cuaderno era de una pantalla blanca a otra casi negra, sin
 * cabecera y sin logo, y se leía como otra aplicación. Dos entrevistas de
 * validación ya habían criticado el fondo oscuro, una por accesibilidad y otra
 * de frente.
 *
 * El oscuro no desaparece: sigue a un interruptor de distancia para quien lo
 * prefiera, y esa elección se guarda.
 *
 * Se cambió la llave de guardado para que el nuevo valor por defecto llegue
 * también a quien ya había visitado el sitio: con la llave vieja, el valor que
 * el sistema había puesto solo en la primera visita quedaba guardado como si
 * la persona lo hubiera elegido. Del ajuste viejo se conservan el contraste y
 * el tamaño de letra, que sí eran elecciones.
 */

const LLAVE = "aprendelocal:lectura";
const LLAVE_VIEJA = "aprendelocal:accesible";

export type Ajustes = {
  contraste: boolean;
  grande: boolean;
  /** Fondo oscuro en el cuaderno. Apagado por defecto. */
  oscuro: boolean;
};

const POR_DEFECTO: Ajustes = { contraste: false, grande: false, oscuro: false };

export function leerAjustes(): Ajustes {
  try {
    const crudo = localStorage.getItem(LLAVE);
    if (crudo) return { ...POR_DEFECTO, ...JSON.parse(crudo) };

    const viejo = localStorage.getItem(LLAVE_VIEJA);
    if (viejo) {
      const v = JSON.parse(viejo) as Partial<{ contraste: boolean; grande: boolean }>;
      return { ...POR_DEFECTO, contraste: !!v.contraste, grande: !!v.grande };
    }
  } catch {
    /* Ventana privada o dato corrupto: se arranca con lo de siempre. */
  }
  return { ...POR_DEFECTO };
}

/**
 * Pone las marcas en el elemento raíz. El CSS hace el resto.
 *
 * `fondo-claro` sigue siendo la marca que usa el CSS: el diseño base del
 * cuaderno se escribió en oscuro y el claro se definió encima. Lo que cambió
 * es qué se pone por defecto, no cómo se pinta cada uno.
 */
export function aplicarAjustes(a: Ajustes): void {
  if (typeof document === "undefined") return;
  const raiz = document.documentElement;
  raiz.classList.toggle("mas-contraste", a.contraste);
  raiz.classList.toggle("letra-grande", a.grande);
  raiz.classList.toggle("fondo-claro", !a.oscuro);
}

export function guardarAjustes(a: Ajustes): void {
  try {
    localStorage.setItem(LLAVE, JSON.stringify(a));
  } catch {
    /* Ventana privada. Sigue aplicado en esta sesión. */
  }
}

/* ── Un solo estado para todos los controles ───────────────────────────── */

/*
 * El control aparece dos veces en la cabecera: en la barra del computador y en
 * el menú del teléfono. Con un estado cada uno, marcar «letra grande» en uno
 * dejaba al otro mostrando la casilla vacía, y al volver a tocarlo se deshacía
 * lo que la persona acababa de hacer. Aquí hay un solo valor y los dos lo leen.
 */
let actual: Ajustes = leerAjustes();
const oyentes = new Set<() => void>();

export function obtenerAjustes(): Ajustes {
  return actual;
}

export function suscribirAjustes(oyente: () => void): () => void {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

/** Cambia un ajuste, lo aplica, lo guarda y avisa a todos los controles. */
export function cambiarAjustes(cambio: Partial<Ajustes>): void {
  actual = { ...actual, ...cambio };
  aplicarAjustes(actual);
  guardarAjustes(actual);
  for (const o of oyentes) o();
}
