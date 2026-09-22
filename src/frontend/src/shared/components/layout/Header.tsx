import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogIn, Menu, User, X } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../contexts/AuthContext";
import Accesibilidad from "../Accesibilidad";
import AprendeLocalLogo from "../ui/AprendeLocalLogo";
import LanguageSwitcher from "../ui/LanguageSwitcher";

/**
 * La cabecera del sitio, igual en todas las pantallas.
 *
 * QUÉ CAMBIÓ
 *
 * Con la sesión iniciada, el menú ofrecía un solo destino, «Mi escuela», que
 * llevaba al perfil, y el menú de la cuenta ofrecía «Mi perfil», que llevaba al
 * mismo sitio. En el teléfono salían los dos seguidos. Mientras tanto, las dos
 * pantallas donde un docente trabaja de verdad —el cuaderno y el seguimiento—
 * no estaban en el menú: la primera tenía un botón suelto, «Crear ruta», y la
 * segunda no tenía ninguno. Ahora el menú es Inicio, Cuaderno y Seguimiento,
 * que es el recorrido real de una semana, y el perfil queda en la cuenta.
 *
 * La pantalla en la que se está queda marcada. Sin eso, en el cuaderno no había
 * cómo saber desde la cabecera que se estaba en el cuaderno.
 *
 * Y todas las etiquetas pasan por la traducción. Estaban escritas a mano en
 * español, así que una cuenta brasileña veía la cabecera en español aunque
 * todo lo demás estuviera en portugués.
 */
export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user, loading } = useAuth();
  const { t } = useTranslation();

  /*
   * El menú del teléfono se cierra al cambiar de pantalla, o tocar un enlace lo
   * dejaba desplegado tapando la página a la que se llegaba.
   *
   * No se cierra con un efecto que mire la ruta: se guarda en qué ruta se abrió
   * y está abierto solo mientras se siga en ella. Así se cierra también al usar
   * el botón de atrás del navegador, sin un segundo render para apagarlo.
   */
  const [abiertoEn, ponerAbiertoEn] = useState<string | null>(null);
  const abierto = abiertoEn === location.pathname;
  const ponerAbierto = (v: boolean | ((v: boolean) => boolean)) => {
    const siguiente = typeof v === "function" ? v(abierto) : v;
    ponerAbiertoEn(siguiente ? location.pathname : null);
  };

  async function salir() {
    await signOut();
    navigate("/entrar");
  }

  const nombre =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.nome ||
    user?.email?.split("@")?.[0] ||
    t("header.user.myAccount", "Mi cuenta");

  /**
   * Las secciones de la portada. Solo existen para quien no entró: con la
   * sesión iniciada el inicio es el escritorio y esas secciones no están ahí.
   */
  const irA = (id: string) => {
    ponerAbierto(false);
    if (location.pathname !== "/") {
      navigate("/#" + id);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const conSesion = [
    { a: "/", texto: t("header.nav.home", "Inicio"), fin: true },
    { a: "/crear", texto: t("header.nav.notebook", "Cuaderno") },
    { a: "/proyecto", texto: t("header.nav.tracking", "Seguimiento") },
  ];
  const sinSesion = [
    { id: "metodologia", texto: t("header.nav.about", "¿Qué es?") },
    { id: "como-funciona", texto: t("header.nav.howItWorks", "Cómo funciona") },
    { id: "contacto", texto: t("header.nav.contact", "Contacto") },
  ];

  const enlace =
    "rounded-full px-3.5 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white";
  const enlaceActivo = "bg-white/15 text-white";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-950/80 bg-[#0a0047] text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="group flex shrink-0 items-center" aria-label="AprendeLocal, inicio">
            <AprendeLocalLogo className="h-8 w-auto transition-transform group-hover:scale-[1.03] sm:h-10" />
          </Link>

          <nav aria-label={t("header.nav.main", "Navegación principal")} className="hidden items-center gap-1 md:flex">
            {user
              ? conSesion.map((e) => (
                  <NavLink
                    key={e.a}
                    to={e.a}
                    end={e.fin}
                    className={({ isActive }) => `${enlace} ${isActive ? enlaceActivo : ""}`}
                  >
                    {e.texto}
                  </NavLink>
                ))
              : sinSesion.map((e) => (
                  <button key={e.id} type="button" onClick={() => irA(e.id)} className={`${enlace} cursor-pointer`}>
                    {e.texto}
                  </button>
                ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* La puerta de quien no entró. Con sesión, el cuaderno ya está en
                el menú y repetirlo en un botón al lado era decirlo dos veces. */}
            {!user && (
              <Link
                to="/crear"
                className="hidden rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-400/20 sm:inline-block"
              >
                {t("header.nav.create", "Crear ruta")}
              </Link>
            )}

            <div className="hidden items-center gap-2 md:flex">
              <LanguageSwitcher />
              <Accesibilidad />
            </div>

            <button
              type="button"
              onClick={() => ponerAbierto((v) => !v)}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 text-white md:hidden"
              aria-label={abierto ? t("header.mobile.closeMenu", "Cerrar menú") : t("header.mobile.openMenu", "Abrir menú")}
              aria-expanded={abierto}
              aria-controls="menu-movil"
            >
              {abierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {loading ? (
              <span className="px-2 text-sm text-slate-300">{t("header.actions.loading", "Cargando…")}</span>
            ) : user ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    aria-label={t("header.user.account", "Cuenta")}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2 text-white transition hover:bg-white/20 sm:px-3"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-amber-400 font-bold text-slate-950">
                      <User className="h-4 w-4" />
                    </span>
                    <span className="hidden max-w-[10rem] truncate text-sm font-semibold sm:inline">{nombre}</span>
                    <ChevronDown className="hidden h-4 w-4 text-slate-300 sm:block" />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={10}
                    className="z-[60] min-w-[220px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
                  >
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold text-slate-900">{nombre}</p>
                      <p className="truncate text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <div className="my-2 h-px bg-slate-200" />
                    <DropdownMenu.Item
                      className="cursor-pointer rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none data-[highlighted]:bg-slate-100"
                      onSelect={() => navigate("/perfil")}
                    >
                      {t("header.user.myProfile", "Mi perfil")}
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="cursor-pointer rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none data-[highlighted]:bg-slate-100"
                      onSelect={() => navigate("/comunidades")}
                    >
                      {t("header.user.communities", "Comunidades")}
                    </DropdownMenu.Item>
                    <div className="my-2 h-px bg-slate-200" />
                    <DropdownMenu.Item
                      className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 outline-none data-[highlighted]:bg-red-50"
                      onSelect={salir}
                    >
                      {t("header.user.signOut", "Salir")}
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : location.pathname === "/entrar" ? null : (
              // En la página de entrar el botón llevaba a la misma página.
              <button
                type="button"
                onClick={() => navigate("/entrar")}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f97316] px-5 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600"
              >
                <LogIn className="h-4 w-4" />
                {t("header.actions.signIn", "Entrar")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── El menú del teléfono ─────────────────────────────────────────── */}
      {abierto && (
        <div id="menu-movil" className="border-t border-blue-900/60 bg-[#0a0047] p-4 shadow-xl md:hidden">
          <nav aria-label={t("header.nav.main", "Navegación principal")} className="flex flex-col gap-1.5">
            {user
              ? conSesion.map((e) => (
                  <NavLink
                    key={e.a}
                    to={e.a}
                    end={e.fin}
                    className={({ isActive }) =>
                      `flex min-h-11 items-center rounded-xl px-4 text-sm font-medium ${
                        isActive ? "bg-white/15 text-white" : "text-slate-200 hover:bg-white/10"
                      }`
                    }
                  >
                    {e.texto}
                  </NavLink>
                ))
              : (
                <>
                  <Link
                    to="/crear"
                    className="flex min-h-11 items-center rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 text-sm font-semibold text-amber-300"
                  >
                    {t("header.nav.create", "Crear ruta")}
                  </Link>
                  {sinSesion.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => irA(e.id)}
                      className="flex min-h-11 items-center rounded-xl px-4 text-left text-sm font-medium text-slate-200 hover:bg-white/10"
                    >
                      {e.texto}
                    </button>
                  ))}
                </>
              )}
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
            <div className="flex min-h-11 items-center justify-between rounded-xl bg-white/10 px-4">
              <span className="text-sm font-medium text-white">{t("header.user.language", "Idioma")}</span>
              <LanguageSwitcher />
            </div>
            <Accesibilidad variante="fila" />
          </div>
        </div>
      )}
    </header>
  );
}
