/**
 * Lo que se ve mientras llega una pantalla.
 *
 * Una barra fina y no un círculo girando en el centro: el círculo dice «espera»
 * y nada más, y en una conexión lenta se queda ahí el tiempo suficiente para
 * que parezca que algo se rompió. La barra es la misma que usa la portada al
 * comprobar la sesión, así que quien la vio una vez ya sabe qué significa.
 */
export default function Cargando() {
  return (
    <main className="grid min-h-[60vh] place-items-center bg-white" aria-busy="true">
      <div className="h-0.5 w-32 overflow-hidden rounded-full bg-slate-200">
        <div className="animar-esperando h-full w-1/4 rounded-full bg-[var(--tinta-600)]" />
      </div>
      <span className="sr-only">Cargando la página</span>
    </main>
  );
}
