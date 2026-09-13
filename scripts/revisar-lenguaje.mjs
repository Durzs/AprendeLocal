/**
 * Guardia contra la jerga.
 *
 * El profesor lee esto de pie, cinco minutos antes de entrar a la sala. Cada
 * vez que se cuela «instrucción explícita» o «recuperación espaciada» le
 * estamos pidiendo que traduzca, y ese es el momento en que cierra la pestaña.
 *
 * Esto no es una manía de estilo: la primera versión de la plataforma tenía el
 * prompt entero escrito en vocabulario de diseño instruccional, y el modelo lo
 * imitaba dócilmente. Se limpió una vez. Sin una comprobación que lo sostenga
 * vuelve sola, porque escribir así es lo cómodo para quien conoce la teoría.
 *
 * Revisa dos cosas:
 *
 *   1. Que no haya jerga en el texto que ve el docente.
 *   2. Que cada curso de cada ruta diga qué hace mientras el profesor está con
 *      otro. En una sala multigrado eso no es un detalle: es lo que decide si
 *      la clase se sostiene o se cae a los diez minutos.
 *
 * Se ejecuta con `npm run revisar-lenguaje` desde src/frontend.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

/** Las rutas de abajo cuelgan del frontend, no de la raíz del repositorio. */
const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..", "src", "frontend");

/** Palabras que el docente no tiene por qué conocer para dar su clase. */
const JERGA = [
  "instrucción explícita",
  "práctica guiada",
  "práctica autónoma",
  "recuperación espaciada",
  "carga cognitiva",
  "andamiaje",
  "metacognici",
  "aprendizaje significativo",
  "constructivis",
  "objetivo transversal",
  "dispositivo pedagógico",
  "se sugiere que",
  "el estudiante logre",
];

/**
 * Archivos con texto que llega al docente. Se listan uno a uno a propósito:
 * un glob acabaría revisando comentarios de código, donde estas palabras son
 * legítimas porque las lee quien programa, no quien enseña.
 */
const ARCHIVOS = [
  "src/modules/sequences/rutas/catalogo.ts",
  "src/shared/lib/demo.ts",
  "src/shared/i18n/locales/es/common.json",
];

/**
 * Las cadenas de texto del archivo, y solo esas.
 *
 * Se recorre carácter a carácter en vez de con una expresión regular. La
 * primera versión emparejaba comillas con un patrón, y bastaba una comilla
 * suelta dentro de un comentario para desplazar el emparejamiento de todo lo
 * que venía después: a partir de ahí leía como «texto» los trozos de código
 * que quedan ENTRE dos cadenas, y dejaba de leer las cadenas de verdad. El
 * guardia daba luz verde a un archivo lleno de jerga.
 *
 * Los comentarios se saltan a propósito: ahí estas palabras son legítimas,
 * porque las lee quien programa y no quien enseña.
 */
function soloTextoVisible(fuente) {
  const cadenas = [];
  let i = 0;

  while (i < fuente.length) {
    const c = fuente[i];
    const siguiente = fuente[i + 1];

    if (c === "/" && siguiente === "/") {
      while (i < fuente.length && fuente[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && siguiente === "*") {
      i += 2;
      while (i < fuente.length && !(fuente[i] === "*" && fuente[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const comilla = c;
      let texto = "";
      i++;
      while (i < fuente.length && fuente[i] !== comilla) {
        if (fuente[i] === "\\") {
          texto += fuente[i + 1] ?? "";
          i += 2;
          continue;
        }
        texto += fuente[i];
        i++;
      }
      i++;
      // Las claves y las rutas de importación son contrato, no texto leído.
      if (texto.length >= 12 && !/^[a-z_]+$/.test(texto) && !texto.startsWith("."))
        cadenas.push(texto);
      continue;
    }
    i++;
  }

  return cadenas;
}

let fallos = 0;

for (const relativo of ARCHIVOS) {
  const fuente = readFileSync(resolve(RAIZ, relativo), "utf8");
  for (const texto of soloTextoVisible(fuente)) {
    for (const palabra of JERGA) {
      if (texto.toLowerCase().includes(palabra)) {
        console.error(`✗ ${relativo}\n  «${palabra}» en: ${texto.slice(0, 90)}`);
        fallos++;
      }
    }
  }
}

// Cada curso de cada ruta necesita saber qué hacer sin el profesor delante.
const catalogo = readFileSync(
  resolve(RAIZ, "src/modules/sequences/rutas/catalogo.ts"),
  "utf8",
);
const cursos = catalogo.match(/nivel:\s*"\w+",\s*objetivo_codigo/g)?.length ?? 0;
const esperas = catalogo.match(/mientras_esperan:/g)?.length ?? 0;
if (cursos !== esperas) {
  console.error(
    `✗ ${cursos} cursos en las rutas y solo ${esperas} dicen qué hacen mientras esperan.\n` +
      "  En multigrado el profesor solo puede estar en un puesto: sin eso, la clase se cae.",
  );
  fallos++;
}

/*
 * Afuera se hacen más cosas que medir.
 *
 * Esto vuelve solo, y volvió: el protocolo solo sabía de `numero` y `texto`, la
 * tabla de terreno tenía una columna titulada «cómo se mide», y las cuatro
 * rutas salieron con diez de dieciséis tareas convertidas en un número con
 * unidad. Nadie decidió que fuera así; la estructura no sabía nombrar otra
 * cosa, y lo que no se puede nombrar no se escribe.
 *
 * Medir no sobra. Un número zanja discusiones que las palabras no zanjan, y
 * hay objetivos del programa que lo piden. Lo que se revisa es que no sea lo
 * único: que en cada salida haya al menos cuatro maneras distintas de
 * trabajar, y que el lugar quede distinto de como estaba.
 */
const MANERAS_MINIMAS = 4;
const salidas = catalogo.split("salida_terreno:").slice(1);

for (const salida of salidas) {
  const protocolo = salida.slice(0, salida.indexOf("recuperacion_espaciada:"));
  const maneras = new Set(
    [...protocolo.matchAll(/registro:\s*"(\w+)"/g)].map((m) => m[1]),
  );
  if (maneras.size === 0) continue; // secuencia antigua, sin el campo todavía

  if (maneras.size < MANERAS_MINIMAS) {
    console.error(
      `✗ Una salida trae solo ${maneras.size} manera(s) de trabajar: ${[...maneras].join(", ")}.\n` +
        `  Afuera se puede mirar, dibujar, mapear, seguir algo, preguntarle a alguien\n` +
        `  o dejar algo hecho. Si todo es medir, la salida es una planilla al aire libre.`,
    );
    fallos++;
  }
  if (!maneras.has("dejar_hecho")) {
    console.error(
      "✗ Una salida no deja nada hecho: el lugar queda igual que antes de llegar.\n" +
        "  Un sitio que no cambió en nada no da para volver, y la diferencia entre\n" +
        "  visitar un lugar y tener uno es justamente esa.",
    );
    fallos++;
  }
}

if (fallos > 0) {
  console.error(`\n${fallos} problema(s) de lenguaje.`);
  process.exit(1);
}
console.log(
  `Lenguaje revisado: ${ARCHIVOS.length} archivos, ${cursos} cursos con su espera, ` +
    `${salidas.length} salidas que hacen algo más que medir.`,
);
