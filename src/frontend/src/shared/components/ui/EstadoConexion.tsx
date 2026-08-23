/**
 * Lo que la aplicación instalada tiene que decir sobre sí misma.
 *
 * Tres avisos, y ninguno es decorativo:
 *
 * 1. SIN SEÑAL. En terreno la conexión se cae y la aplicación sigue
 *    funcionando con lo guardado. Si no se dice, el docente no distingue
 *    «está funcionando sin internet» de «se colgó», y ante la duda cierra.
 * 2. HAY VERSIÓN NUEVA. Se avisa y se espera: recargar sola mientras alguien
 *    escribe en su bitácora le borraría el trabajo.
 * 3. SE PUEDE INSTALAR. Instalada abre desde el escritorio y arranca sin red,
 *    que es la diferencia entre usarla en el estero o no usarla.
 */

import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { CloudOff, Download, RefreshCw } from "lucide-react";

/** El evento de instalación no está en la librería de tipos del navegador. */
type EventoInstalacion = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function EstadoConexion() {
  const [sinRed, setSinRed] = useState(
    typeof navigator === "undefined" ? false : !navigator.onLine
  );
  const [instalador, setInstalador] = useState<EventoInstalacion | null>(null);

  const {
    needRefresh: [hayVersionNueva, setHayVersionNueva],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error: any) {
      // Sin service worker la aplicación sigue funcionando en línea; se avisa
      // por consola y no se interrumpe al docente con algo que no puede
      // resolver desde la sala.
      console.warn("No se pudo registrar el modo sin conexión:", error);
    },
  });

  useEffect(() => {
    const conectado = () => setSinRed(false);
    const desconectado = () => setSinRed(true);
    window.addEventListener("online", conectado);
    window.addEventListener("offline", desconectado);

    const alPoderInstalar = (e: Event) => {
      // Sin esto Chrome muestra su propia barra, que aparece y desaparece sin
      // que el docente alcance a leerla.
      e.preventDefault();
      setInstalador(e as EventoInstalacion);
    };
    const alInstalar = () => setInstalador(null);

    window.addEventListener("beforeinstallprompt", alPoderInstalar);
    window.addEventListener("appinstalled", alInstalar);

    return () => {
      window.removeEventListener("online", conectado);
      window.removeEventListener("offline", desconectado);
      window.removeEventListener("beforeinstallprompt", alPoderInstalar);
      window.removeEventListener("appinstalled", alInstalar);
    };
  }, []);

  async function instalar() {
    if (!instalador) return;
    await instalador.prompt();
    await instalador.userChoice;
    setInstalador(null);
  }

  if (!sinRed && !hayVersionNueva && !instalador) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-3 print:hidden">
      {sinRed && (
        <div
          role="status"
          className="flex w-full max-w-md items-center gap-2.5 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 shadow-lg"
        >
          <CloudOff className="h-4 w-4 shrink-0" aria-hidden />
          <span>
            <strong>Sin señal.</strong> Puedes seguir trabajando: lo que anotes se
            guarda y se envía cuando vuelva la conexión.
          </span>
        </div>
      )}

      {hayVersionNueva && (
        <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-lg">
          <RefreshCw className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
          <span className="flex-1 text-slate-800">Hay una versión nueva.</span>
          <button
            type="button"
            onClick={() => updateServiceWorker(true)}
            className="shrink-0 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
          >
            Actualizar
          </button>
          <button
            type="button"
            onClick={() => setHayVersionNueva(false)}
            className="shrink-0 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Ahora no
          </button>
        </div>
      )}

      {instalador && !sinRed && (
        <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-lg">
          <Download className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
          <span className="flex-1 text-slate-800">
            Instálala para usarla sin internet en terreno.
          </span>
          <button
            type="button"
            onClick={instalar}
            className="shrink-0 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
          >
            Instalar
          </button>
          <button
            type="button"
            onClick={() => setInstalador(null)}
            className="shrink-0 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Ahora no
          </button>
        </div>
      )}
    </div>
  );
}
