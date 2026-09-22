# Las ediciones: Chile y Brasil

AprendeLocal tiene una edición por país. El método es el mismo en las dos —las
seis etapas, las técnicas de terreno, los formatos del producto— y lo que cambia
es el contenido que le cuelga: el currículum, las problemáticas, las especies,
los papeles de la salida y el idioma.

Este documento dice dónde está cada cosa, para que cambiar una edición no
obligue a buscar por todo el repositorio.

## Cómo se decide qué edición ve cada persona

Está en `src/frontend/src/shared/sede.ts`.

- **Con cuenta, manda la cuenta.** La sede está en `profiles.sede` y copiada en
  los metadatos de auth. Una cuenta brasileña ve la edición brasileña en
  cualquier computador, y el selector de la cabecera solo la muestra.
- **Sin cuenta**, en este orden:
  1. La dirección: `aprendelocal.cl/br` y `aprendelocal.cl/cl` fijan la edición
     y vuelven a la portada. Es el enlace para compartir.
  2. Lo que la persona eligió antes en ese navegador.
  3. El idioma del navegador: si está en portugués, edición brasileña.
  4. Chile.
- **El idioma sigue a la edición.** Chile en español, Brasil en portugués. En
  las dos se ofrece además inglés, que solo traduce la interfaz general.

Una cuenta nueva nace con la sede de la edición en que se registró. En Brasil
el registro no pide código de escuela, porque todavía no hay escuelas cariocas
cargadas.

## Dónde está cada diferencia

| Qué | Chile | Brasil | Dónde se elige |
|---|---|---|---|
| Idioma, región, centro del mapa | `SEDES.cl` | `SEDES.br` | `shared/sede.ts` |
| Currículum | `crear/oa.ts` (Bases Curriculares, 5º a 8º básico) | `crear/bncc.ts` (BNCC, 6º a 9º ano) | `sequences/contenido/index.ts` |
| Asignaturas y problemáticas | `metodo/problemas.ts` | `metodo/problemas.br.ts` | ídem |
| Indicadores por objetivo | `crear/indicadores.ts` | `crear/indicadores.br.ts` | se busca en los dos |
| Búsqueda en el mapa | `GEO_CL` | `GEO_BR` | `metodo/lugar.ts` |
| Papeles de la salida | Superintendencia y apoderados | Plan para la dirección y responsables (modelo) | `metodo/Permisos.tsx` |
| Especies de la portada | `biodiversidad/nativas.ts` | `biodiversidad/nativas.br.ts` | `home/components/TerritorioSection.tsx` |
| Rutas escritas | `rutas/catalogo.ts` | no hay | el escritorio las oculta en Brasil |

Las pantallas del cuaderno no preguntan en qué país están: leen
`useContenido()`. Si hace falta un `if (sede === "br")` en un componente del
cuaderno, lo que falta es un campo en `CONTENIDOS`.

## Los textos

Hay tres maneras, cada una para lo suyo:

- **La interfaz general** (cabecera, portada, cuenta) está en
  `shared/i18n/locales/{es,pt,en}/common.json`, con una llave por frase. Los
  tres archivos tienen que tener las mismas llaves.
- **Las pantallas del cuaderno y del seguimiento** usan
  `tx("español", "português")`, de `shared/tx.ts`. Las dos versiones van juntas
  en el mismo sitio del código, así que quien corrige una ve la otra.
- **Los textos largos del método** (las seis etapas, las técnicas, los
  formatos, los destinatarios) tienen un archivo por idioma con los mismos
  `id`: `etapas.ts` y `etapas.pt.ts`, `tecnicas.ts` y `tecnicas.pt.ts`, etc.
  Si se agrega o se quita una etapa en uno y no en el otro, el sitio lo avisa
  en la consola al abrirlo en desarrollo.

El portugués no es una traducción palabra por palabra: está escrito para un
docente de Río. Donde el chileno dice «estero» dice «córrego» o «valão»;
«apoderados» es «responsáveis»; la micro es la van; el año escolar empieza en
febrero.

## Lo guardado

El cuaderno guarda en el navegador por edición: Chile usa las llaves de
siempre (`aprendelocal:expedicion`…) y Brasil las mismas con `br:` delante
(`aprendelocal:br:expedicion`…). Un mismo computador puede tener un proyecto de
cada país sin que se pisen.

## Lo que el build comprueba

`scripts/revisar-lenguaje.mjs` corre antes de cada build y falla si:

- un código de objetivo chileno o de habilidad BNCC citado en las problemáticas
  o en los indicadores no existe en el currículum cargado;
- aparece jerga pedagógica en los textos que lee el docente (en español o en
  portugués).

## Para agregar una problemática carioca

1. Buscar y leer las fuentes, y registrarlas en `docs/fuentes-rio.md` con quién
   las firma. Ninguna se cita de memoria.
2. Agregarla a `PROBLEMAS_BR` en `metodo/problemas.br.ts`, con un `id` que
   empiece por `br_`, su familia y un ángulo por componente.
3. Escribir en `crear/indicadores.br.ts` los indicadores de las habilidades
   nuevas que abra.
4. `npm run build`: el guardia dice si algún código no existe.
