/**
 * Graba el recorrido que hace un docente en AprendeLocal, de la portada a los
 * documentos impresos.
 *
 * Sigue la skill `playwright-recording`: contexto con recordVideo a 1920x1080,
 * slowMo para que los clics se vean, y el video se guarda al cerrar el
 * contexto. Encima se le pone un rotulo con la fase y un puntero visible,
 * porque Playwright no graba el cursor del sistema y sin el no se entiende
 * donde esta mirando la demostracion.
 */
import { chromium } from 'playwright-core';

const BASE = process.env.BASE || 'http://localhost:4333';
const SALIDA = process.env.SALIDA || './grabacion';

/** El rotulo de fase y el puntero, inyectados en la pagina. */
const ADORNOS = `
  #fase-rotulo {
    position: fixed; left: 0; right: 0; bottom: 0; z-index: 2147483647;
    display: flex; align-items: baseline; gap: 18px;
    padding: 22px 46px 26px;
    background: linear-gradient(to top, rgba(30,42,36,.97) 55%, rgba(30,42,36,0));
    color: #e4ded2; font: 500 30px/1.2 system-ui, -apple-system, sans-serif;
    letter-spacing: -.02em; pointer-events: none;
    opacity: 0; transition: opacity .45s ease;
  }
  #fase-rotulo.ver { opacity: 1; }
  #fase-rotulo b {
    font: 700 17px/1 ui-monospace, monospace; letter-spacing: .18em;
    color: #c9612a; text-transform: uppercase; white-space: nowrap;
  }
  #puntero {
    position: fixed; z-index: 2147483646; width: 26px; height: 26px;
    margin: -13px 0 0 -13px; border-radius: 50%;
    background: rgba(201,97,42,.32); border: 2.5px solid #c9612a;
    pointer-events: none; opacity: 0;
    transition: left .42s cubic-bezier(.4,0,.2,1), top .42s cubic-bezier(.4,0,.2,1), opacity .3s, transform .18s;
  }
  #puntero.ver { opacity: 1; }
  #puntero.clic { transform: scale(.55); background: rgba(201,97,42,.75); }
`;

const GUION = `
  if (!document.getElementById('fase-rotulo')) {
    const r = document.createElement('div');
    r.id = 'fase-rotulo';
    r.innerHTML = '<b></b><span></span>';
    document.body.appendChild(r);
    const p = document.createElement('div');
    p.id = 'puntero';
    document.body.appendChild(p);
  }
  window.__fase = (n, texto) => {
    const r = document.getElementById('fase-rotulo');
    r.classList.remove('ver');
    setTimeout(() => {
      r.querySelector('b').textContent = n;
      r.querySelector('span').textContent = texto;
      r.classList.add('ver');
    }, 260);
  };
  window.__puntero = (x, y) => {
    const p = document.getElementById('puntero');
    p.style.left = x + 'px'; p.style.top = y + 'px';
    p.classList.add('ver');
  };
  window.__clic = () => {
    const p = document.getElementById('puntero');
    p.classList.add('clic');
    setTimeout(() => p.classList.remove('clic'), 220);
  };
`;

async function main() {
  const navegador = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--force-prefers-reduced-motion=0'],
  });

  const ctx = await navegador.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: SALIDA, size: { width: 1920, height: 1080 } },
    locale: 'es-CL',
    deviceScaleFactor: 1,
  });

  const pagina = await ctx.newPage();
  // El idioma lo guarda i18next en localStorage; sin esto la demostracion
  // puede salir en ingles segun lo que quedara de una sesion anterior.
  await pagina.addInitScript(() => {
    try { localStorage.setItem('app:lang', 'es'); } catch { /* ventana privada */ }
  });

  /** Deja el rotulo y el puntero disponibles tras cada navegacion. */
  async function preparar() {
    await pagina.addStyleTag({ content: ADORNOS });
    await pagina.evaluate(GUION);
  }

  async function fase(n, texto, espera = 2600) {
    await pagina.evaluate(([a, b]) => window.__fase(a, b), [n, texto]);
    await pagina.waitForTimeout(espera);
  }

  /** Mueve el puntero al elemento y lo pulsa, para que se vea a donde va. */
  async function pulsar(loc, pausa = 1400) {
    await loc.scrollIntoViewIfNeeded();
    await pagina.waitForTimeout(500);
    const caja = await loc.boundingBox();
    if (caja) {
      const x = Math.round(caja.x + caja.width / 2);
      const y = Math.round(caja.y + caja.height / 2);
      await pagina.evaluate(([a, b]) => window.__puntero(a, b), [x, y]);
      await pagina.waitForTimeout(560);
      await pagina.evaluate(() => window.__clic());
    }
    await loc.click();
    await pagina.waitForTimeout(pausa);
  }

  /** Escribe en un campo a velocidad humana, si el campo existe. */
  async function escribir(loc, texto) {
    if (!(await loc.count())) return;
    await loc.scrollIntoViewIfNeeded();
    await loc.click();
    await loc.fill('');
    await loc.pressSequentially(texto, { delay: 55 });
    await pagina.waitForTimeout(1300);
  }

  /** Baja despacio hasta el elemento, para que se lea lo que pasa por delante. */
  async function bajarA(loc, pausa = 1500) {
    await loc.scrollIntoViewIfNeeded();
    await pagina.waitForTimeout(pausa);
  }

  // ── 1. La portada ────────────────────────────────────────────────────────
  await pagina.goto(BASE + '/', { waitUntil: 'networkidle' });
  await preparar();
  await pagina.waitForTimeout(2200);
  await fase('Punto de partida', 'Una profesora rural abre AprendeLocal', 3000);

  // ── 2. Las rutas desde la portada ────────────────────────────────────────
  const banco = pagina.locator('#proyectos');
  await bajarA(banco, 900);
  await fase('Fase 1', 'La portada muestra las cuatro rutas que existen de verdad', 3400);

  const primera = pagina.locator('#proyectos a[href="/rutas"]').first();
  await pulsar(primera, 2000);
  await preparar();
  await pagina.waitForTimeout(600);

  // ── 3. Elegir ruta ───────────────────────────────────────────────────────
  await fase('Fase 2', 'Elige una ruta. No genera nada: ya estan escritas', 3200);
  const tarjeta = pagina.locator('ul li button').first();
  await pulsar(tarjeta, 2200);

  // ── 4. La pregunta que sostiene el proyecto ──────────────────────────────
  await fase('Fase 3', 'La pregunta que guia el proyecto y a quien se lo entregan', 3800);
  await pagina.waitForTimeout(800);

  // ── 5. El recorrido por semanas ──────────────────────────────────────────
  await fase('Fase 4', 'El recorrido, semana por semana', 2200);
  const semanas = pagina.locator('ol li button');
  const cuantas = await semanas.count();
  for (let i = 1; i < Math.min(cuantas, 4); i++) {
    await pulsar(semanas.nth(i), 1900);
  }

  // ── 6. Multigrado ────────────────────────────────────────────────────────
  const porCurso = pagina.getByText('Qué hace cada curso').first();
  await bajarA(porCurso, 700);
  await fase('Fase 5', 'Que hace cada curso: una sola clase, tareas distintas', 4000);

  // ── 7. Mapuzugun ─────────────────────────────────────────────────────────
  const mapu = pagina.getByText('El lugar en mapuzugun').first();
  if (await mapu.count()) await bajarA(mapu, 700);
  await fase('Fase 6', 'El territorio nombrado en mapuzugun y en castellano', 3800);

  // ── 8. Personalizar ──────────────────────────────────────────────────────
  // Los campos se buscan por su etiqueta, no por su posicion: el formulario de
  // contacto de la portada tambien tiene inputs y por indice se cazaba ese.
  const lugar = pagina.getByLabel('Cómo se llama tu lugar');
  await bajarA(lugar, 900);
  await fase('Fase 7', 'Ajusta la ruta a su escuela: lugar, fecha y nombres', 2400);
  await escribir(lugar, 'Estero Trailelfu');

  await escribir(pagina.getByLabel('Nombre de la escuela'), 'Escuela Rural Trailelfu');
  await escribir(pagina.getByLabel('Tu nombre'), 'Rayen Millán');

  const fecha = pagina.getByLabel('Fecha de la salida');
  if (await fecha.count()) {
    await fecha.scrollIntoViewIfNeeded();
    await fecha.fill('2026-10-14');
    await pagina.waitForTimeout(1500);
  }
  await fase('Fase 7', 'Lo que escribe queda en los documentos que va a imprimir', 3400);

  // ── 9. Que vive aqui ─────────────────────────────────────────────────────
  const natu = pagina.getByText('Documentos para imprimir').first();
  if (await natu.count()) {
    await bajarA(natu, 800);
    await fase('Fase 8', 'Que vive alrededor, con datos de iNaturalist y GBIF', 3600);
  }

  // ── 10. Documentos ───────────────────────────────────────────────────────
  const imprimir = pagina.getByRole('button', { name: 'Imprimir lo marcado' }).first();
  if (await imprimir.count()) {
    await bajarA(imprimir, 900);
    await fase('Fase 9', 'Cinco documentos listos para imprimir y llevar a terreno', 4200);
    const caja = await imprimir.boundingBox();
    if (caja) {
      await pagina.evaluate(
        ([a, b]) => window.__puntero(a, b),
        [Math.round(caja.x + caja.width / 2), Math.round(caja.y + caja.height / 2)]
      );
      await pagina.waitForTimeout(700);
      await pagina.evaluate(() => window.__clic());
      await pagina.waitForTimeout(1400);
    }
  }

  // ── 11. La secuencia completa ────────────────────────────────────────────
  await pagina.evaluate(() => window.scrollBy({ top: 900, behavior: 'smooth' }));
  await pagina.waitForTimeout(1400);
  await fase('Fase 10', 'Y abajo, la secuencia completa clase por clase', 4200);
  await pagina.evaluate(() => window.scrollBy({ top: 700, behavior: 'smooth' }));
  await pagina.waitForTimeout(2600);

  await fase('Sin generar nada', 'De la portada a la clase impresa, en un rato', 4200);
  await pagina.waitForTimeout(1200);

  // El video se escribe al cerrar el contexto.
  await ctx.close();
  await navegador.close();
  console.log('grabado en', SALIDA);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
