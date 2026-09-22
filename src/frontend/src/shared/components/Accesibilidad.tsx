import { useSyncExternalStore } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTranslation } from "react-i18next";

import {
  cambiarAjustes,
  obtenerAjustes,
  suscribirAjustes,
  type Ajustes,
} from "../lectura";

/**
 * Los ajustes de lectura, en la cabecera.
 *
 * Salió de una entrevista de validación: la profesora dijo, mirando el
 * cuaderno, que el texto gris pequeño sobre fondo oscuro le costaba leerlo. Se
 * resuelve con tres interruptores y no con un rediseño, porque el diseño base
 * también tiene que existir.
 *
 * DÓNDE ESTÁ Y POR QUÉ
 *
 * Era un botón flotante en la esquina de abajo a la derecha, y en el cuaderno,
 * en un teléfono, tapaba «Seguir». Ahora es un botón más de la cabecera, al
 * lado del idioma, y se abre como el menú de la cuenta: tarjeta blanca, mismo
 * radio, misma sombra. Es un ajuste del sitio y se ve como los demás ajustes
 * del sitio, no como un panel del cuaderno pegado encima.
 *
 * La lógica de guardar y aplicar está en §lectura.ts, porque también tiene que
 * funcionar en las pantallas que no tienen cabecera.
 */
export default function Accesibilidad({ variante = "boton" }: { variante?: "boton" | "fila" }) {
  const { t } = useTranslation();
  // Un solo estado para los dos controles de la cabecera. Ver §lectura.ts.
  const ajustes = useSyncExternalStore(suscribirAjustes, obtenerAjustes);

  const opciones: { clave: keyof Ajustes; etiqueta: string; ayuda: string }[] = [
    {
      clave: "grande",
      etiqueta: t("lectura.grande", "Letra más grande"),
      ayuda: t("lectura.grandeAyuda", "Todo el texto un paso más grande."),
    },
    {
      clave: "contraste",
      etiqueta: t("lectura.contraste", "Más contraste"),
      ayuda: t("lectura.contrasteAyuda", "Los grises pasan a negro, para leer con sol de frente."),
    },
    {
      clave: "oscuro",
      etiqueta: t("lectura.oscuro", "Cuaderno en oscuro"),
      ayuda: t("lectura.oscuroAyuda", "El cuaderno y el seguimiento en fondo verde oscuro."),
    },
  ];

  const lista = (
    <>
      {opciones.map((o) => (
        <DropdownMenu.CheckboxItem
          key={o.clave}
          checked={ajustes[o.clave]}
          onCheckedChange={(v) => cambiarAjustes({ [o.clave]: v === true })}
          // Que marcar no cierre el menú: quien ajusta la lectura suele
          // probar dos cosas seguidas y mirar cómo quedan.
          onSelect={(ev) => ev.preventDefault()}
          className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none data-[highlighted]:bg-slate-100"
        >
          <span
            aria-hidden
            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border text-[11px] font-bold transition ${
              ajustes[o.clave]
                ? "border-[var(--tinta-950)] bg-[var(--tinta-950)] text-white"
                : "border-slate-300 text-transparent"
            }`}
          >
            ✓
          </span>
          <span className="min-w-0">
            <span className="block font-medium text-slate-900">{o.etiqueta}</span>
            <span className="mt-0.5 block text-xs leading-snug text-slate-500">{o.ayuda}</span>
          </span>
        </DropdownMenu.CheckboxItem>
      ))}
      <p className="px-3 pb-1 pt-2 text-xs text-slate-400">
        {t("lectura.guardado", "Queda guardado en este navegador.")}
      </p>
    </>
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {variante === "fila" ? (
          <button
            type="button"
            className="flex min-h-11 w-full items-center justify-between rounded-xl bg-white/10 px-4 text-left text-sm font-medium text-white"
          >
            <span>{t("lectura.titulo", "Ajustes de lectura")}</span>
            <span aria-hidden className="font-semibold">Aa</span>
          </button>
        ) : (
          <button
            type="button"
            aria-label={t("lectura.titulo", "Ajustes de lectura")}
            title={t("lectura.titulo", "Ajustes de lectura")}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <span aria-hidden>Aa</span>
          </button>
        )}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-[60] w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
        >
          <DropdownMenu.Label className="px-3 py-2 text-sm font-semibold text-slate-900">
            {t("lectura.titulo", "Ajustes de lectura")}
          </DropdownMenu.Label>
          {lista}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
