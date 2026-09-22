import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTranslation } from "react-i18next";

import {
  SEDES,
  elegirSede,
  idiomasDe,
  recordarIdiomaElegido,
  useSede,
  useSedeFijada,
  type Sede,
} from "../../sede";

/** Cada idioma, escrito en sí mismo: quien no lee el actual tiene que reconocer el suyo. */
const NOMBRE_IDIOMA: Record<string, string> = {
  es: "Español",
  pt: "Português",
  en: "English",
};

/**
 * País e idioma, en un solo menú.
 *
 * Era un `<select>` con ES, PT y EN, y eso mezclaba dos cosas. El idioma
 * cambia las palabras; el país cambia lo que hay debajo: el currículum, las
 * problemáticas, las especies, los papeles de la salida. Un docente carioca
 * que elegía «PT» recibía la interfaz en portugués y el cuaderno chileno.
 *
 * Ahora se elige la edición, que trae su idioma, y aparte se puede pasar al
 * inglés. Con sesión iniciada la edición es la de la cuenta y el menú solo la
 * muestra: cambiarla cambiaría qué currículum se guarda en esa cuenta, y eso
 * no se decide desde un menú. Ver §sede.ts.
 */
export default function LanguageSwitcher({ variante = "boton" }: { variante?: "boton" | "fila" }) {
  const { t, i18n } = useTranslation();
  const sede = useSede();
  const fijada = useSedeFijada();
  const idioma = (i18n.resolvedLanguage || "es").split("-")[0];

  function elegirIdioma(l: string) {
    // Elegir el idioma de la edición es volver a lo normal; elegir inglés es
    // una decisión que tiene que sobrevivir a la próxima sesión.
    recordarIdiomaElegido(l !== SEDES[sede].idioma);
    i18n.changeLanguage(l);
  }

  function cambiarSede(s: Sede) {
    recordarIdiomaElegido(false);
    elegirSede(s);
  }

  const corto = `${sede.toUpperCase()} · ${idioma.toUpperCase()}`;
  const titulo = t("edicion.titulo", "País e idioma");

  const item =
    "flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none data-[highlighted]:bg-slate-100 data-[disabled]:cursor-default data-[disabled]:opacity-50";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {variante === "fila" ? (
          <button
            type="button"
            className="flex min-h-11 w-full items-center justify-between rounded-xl bg-white/10 px-4 text-left text-sm font-medium text-white"
          >
            <span>{titulo}</span>
            <span className="font-semibold">{corto}</span>
          </button>
        ) : (
          <button
            type="button"
            aria-label={`${titulo}: ${SEDES[sede].nombre}, ${NOMBRE_IDIOMA[idioma] ?? idioma}`}
            className="inline-flex h-10 items-center rounded-full border border-white/20 bg-white/10 px-3.5 text-xs font-semibold tracking-wide text-white transition hover:bg-white/20"
          >
            {corto}
          </button>
        )}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-[60] w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
        >
          <DropdownMenu.Label className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t("edicion.pais", "Edición")}
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={sede} onValueChange={(v) => cambiarSede(v as Sede)}>
            {(Object.keys(SEDES) as Sede[]).map((s) => (
              <DropdownMenu.RadioItem
                key={s}
                value={s}
                disabled={fijada && s !== sede}
                className={item}
              >
                <Marca activa={s === sede} />
                <span className="min-w-0">
                  <span className="block font-medium text-slate-900">{SEDES[s].nombre}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {NOMBRE_IDIOMA[SEDES[s].idioma]} · {SEDES[s].donde}
                  </span>
                </span>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
          <p className="px-3 pb-2 pt-1 text-xs leading-snug text-slate-500">
            {fijada
              ? t("edicion.deCuenta", "Es la edición de tu cuenta.")
              : t("edicion.ayuda", "Cambia el currículum, las problemáticas y los papeles de la salida.")}
          </p>

          <DropdownMenu.Separator className="mx-2 my-1 h-px bg-slate-100" />

          <DropdownMenu.Label className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t("edicion.idioma", "Idioma")}
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={idioma} onValueChange={elegirIdioma}>
            {idiomasDe(sede).map((l) => (
              <DropdownMenu.RadioItem key={l} value={l} className={item}>
                <Marca activa={l === idioma} />
                <span className="font-medium text-slate-900">{NOMBRE_IDIOMA[l]}</span>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function Marca({ activa }: { activa: boolean }) {
  return (
    <span
      aria-hidden
      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition ${
        activa ? "border-[var(--tinta-950)] bg-[var(--tinta-950)]" : "border-slate-300"
      }`}
    >
      {activa && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
    </span>
  );
}
