/**
 * Genera el catálogo que usa el correo de la ruta del demo.
 *
 * La función `enviar-ruta` corre en Deno, en Supabase, y no puede importar los
 * archivos del sitio. Este script los empaqueta, los ejecuta y deja el
 * resultado en `supabase/functions/enviar-ruta/catalogo.json`.
 *
 *   node scripts/catalogo-correo.mjs              escribe el JSON
 *   node scripts/catalogo-correo.mjs --comprobar  falla si el JSON está viejo
 *
 * El build del frontend corre la segunda forma: si alguien agrega una
 * problemática y no regenera, el build lo dice en vez de que el correo salga
 * sin nombre el día del congreso. Ver §modules/congreso/catalogoCorreo.ts.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FRONTEND = resolve(RAIZ, "src", "frontend");
const ENTRADA = resolve(FRONTEND, "src", "modules", "congreso", "catalogoCorreo.ts");
const SALIDA = resolve(RAIZ, "supabase", "functions", "enviar-ruta", "catalogo.json");

// rolldown viene con Vite y vive en node_modules del frontend.
const requerir = createRequire(resolve(FRONTEND, "package.json"));
const { rolldown } = await import(requerir.resolve("rolldown"));

const paquete = await rolldown({
  input: ENTRADA,
  // Los archivos del catálogo avisan en la consola solo en desarrollo.
  transform: { define: { "import.meta.env.DEV": "false" } },
  logLevel: "silent",
});
const { output } = await paquete.generate({ format: "esm" });
const modulo = await import(`data:text/javascript;base64,${Buffer.from(output[0].code).toString("base64")}`);
const json = JSON.stringify(modulo.catalogoCorreo(), null, 1) + "\n";

if (process.argv.includes("--comprobar")) {
  let actual = "";
  try {
    actual = readFileSync(SALIDA, "utf8");
  } catch {
    /* No existe: cuenta como viejo. */
  }
  if (actual !== json) {
    console.error(
      "✗ El catálogo del correo del demo está desactualizado.\n" +
        "  Corre `node scripts/catalogo-correo.mjs` desde la raíz y agrega el JSON al commit."
    );
    process.exit(1);
  }
  console.log("✓ Catálogo del correo del demo al día.");
} else {
  writeFileSync(SALIDA, json);
  console.log(`Escrito ${SALIDA}`);
}
