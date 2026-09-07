import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, LogIn, Menu, X, ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../contexts/AuthContext";
import AprendeLocalLogo from "../ui/AprendeLocalLogo";
import LanguageSwitcher from "../ui/LanguageSwitcher";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user, loading } = useAuth();
  const { t } = useTranslation();

  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    setMobileOpen(false);
    navigate("/entrar");
  }

  const closeMobile = () => setMobileOpen(false);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.nome ||
    user?.email?.split("@")?.[0] ||
    t("header.user.myAccount", "Mi Cuenta");

  const scrollTo = (id: string) => {
    closeMobile();
    if (location.pathname !== "/") {
      navigate("/#" + id);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0047] border-b border-blue-950/80 text-white shadow-lg backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="group flex items-center" onClick={closeMobile}>
            <AprendeLocalLogo className="h-8 w-auto transition-transform group-hover:scale-[1.03] sm:h-10" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <button
              onClick={() => scrollTo("metodologia")}
              className="px-3.5 py-1.5 rounded-full text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              ¿Qué es?
            </button>
            
            <button
              onClick={() => scrollTo("como-funciona")}
              className="px-3.5 py-1.5 rounded-full text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              Cómo funciona
            </button>
            
            <Link
              to="/metodologia"
              className="px-3.5 py-1.5 rounded-full text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition"
              onClick={closeMobile}
            >
              Metodología
            </Link>

            <Link
              to="/rutas"
              className="px-3.5 py-1.5 rounded-full text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition"
              onClick={closeMobile}
            >
              Rutas
            </Link>

            <button
              onClick={() => scrollTo("contacto")}
              className="px-3.5 py-1.5 rounded-full text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              Contacto
            </button>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* La puerta del docente es armar su ruta. La lista de cuatro
                sigue en /rutas como material, pero dejo de ser la entrada: la
                ruta sale de los objetivos que marca y del lugar que describe,
                no de escoger de una vitrina. */}
            <Link
              to="/crear"
              className="text-xs px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 font-semibold hidden sm:inline-block hover:bg-amber-400/20 transition"
            >
              {t("header.nav.create", "Crear ruta")}
            </Link>

            {/* Language switcher - desktop */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white md:hidden"
              aria-label={mobileOpen ? t("header.mobile.closeMenu") : t("header.mobile.openMenu")}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            {/* Auth buttons */}
            {loading ? (
              <div className="px-3 py-2 text-sm text-slate-300">
                {t("header.actions.loading")}
              </div>
            ) : user ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-white transition hover:bg-white/20 cursor-pointer">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-amber-400 text-slate-950 font-bold">
                      <User className="h-4 w-4" />
                    </span>
                    <div className="hidden flex-col items-start leading-tight sm:flex">
                      <span className="text-sm font-semibold text-white">{displayName}</span>
                      <span className="-mt-0.5 text-[11px] text-slate-300">
                        {user?.email?.split("@")?.[0]}
                      </span>
                    </div>
                    <ChevronDown className="hidden h-4 w-4 text-slate-300 sm:block" />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={10}
                    className="z-50 min-w-[220px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
                  >
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                      <p className="truncate text-xs text-slate-500">{user?.email}</p>
                    </div>

                    <div className="my-2 h-px bg-slate-200" />

                    <DropdownMenu.Item
                      className="cursor-pointer rounded-xl px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100"
                      onClick={() => navigate("/perfil")}
                    >
                      {t("header.user.myProfile", "Mi Perfil")}
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                      className="cursor-pointer rounded-xl px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100"
                      onClick={() => navigate("/comunidades")}
                    >
                      {t("header.user.communities", "Comunidades")}
                    </DropdownMenu.Item>

                    <div className="my-2 h-px bg-slate-200" />

                    <DropdownMenu.Item
                      className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-red-600 outline-none hover:bg-red-50"
                      onClick={handleSignOut}
                    >
                      {t("header.user.signOut", "Cerrar sesión")}
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <button
                onClick={() => navigate("/entrar")}
                className="inline-flex items-center gap-2 rounded-full bg-[#f97316] hover:bg-orange-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition hover:-translate-y-0.5 cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                {t("header.actions.signIn", "Entrar")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-blue-900/60 bg-[#0a0047] p-4 shadow-xl md:hidden">
          <nav className="flex flex-col gap-2">
            <div className="mb-2 flex items-center justify-between rounded-xl bg-white/10 px-4 py-2.5">
              <span className="text-sm font-medium text-white">{t("header.user.language", "Idioma")}</span>
              <LanguageSwitcher />
            </div>

            <Link
              to="/crear"
              onClick={closeMobile}
              className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-2.5 text-sm font-semibold text-amber-300"
            >
              {t("header.nav.create", "Crear ruta")}
            </Link>
            
            <button
              onClick={() => scrollTo("metodologia")}
              className="text-left rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              ¿Qué es?
            </button>
            
            <button
              onClick={() => scrollTo("como-funciona")}
              className="text-left rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Cómo funciona
            </button>
            
            <Link
              to="/metodologia"
              onClick={closeMobile}
              className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Metodología
            </Link>

            <Link
              to="/rutas"
              onClick={closeMobile}
              className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Rutas escritas
            </Link>

            <button
              onClick={() => scrollTo("contacto")}
              className="text-left rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Contacto & Alianzas
            </button>

            {user && (
              <Link
                to="/perfil"
                onClick={closeMobile}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10"
              >
                {t("header.nav.profile", "Mi Perfil")}
              </Link>
            )}

            {!user && (
              <button
                onClick={() => { closeMobile(); navigate("/entrar"); }}
                className="mt-2 rounded-xl bg-[#f97316] hover:bg-orange-600 px-4 py-3 text-sm font-bold text-white shadow cursor-pointer"
              >
                {t("header.actions.signIn", "Entrar")}
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
