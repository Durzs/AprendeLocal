import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, ChevronDown, LogIn, Menu, X } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTranslation } from "react-i18next";

import logo from "../../../assets/images/logo.png";
import { useAuth } from "../../contexts/AuthContext";
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

  const isActive = (path: string) => location.pathname === path;
  const closeMobile = () => setMobileOpen(false);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.nome ||
    user?.email?.split("@")?.[0] ||
    t("header.user.myAccount");

  return (
    <header className="relative z-50 w-full bg-[#0a0047] border-b border-blue-950/80 text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={closeMobile}>
            <img
              src={logo}
              alt="Logo AprendeLocal"
              className="h-8 w-8 rounded-full border border-white/20 object-cover sm:h-9 sm:w-9 transition group-hover:scale-105"
            />
            <span className="text-base sm:text-lg font-bold tracking-tight text-white">
              AprendeLocal
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1.5 md:flex">
            {/* Entrada del docente */}
            <Link
              to="/rutas"
              className={[
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition",
                location.pathname === "/rutas"
                  ? "border-amber-400 bg-amber-400 text-slate-950 font-bold"
                  : "border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20",
              ].join(" ")}
            >
              {t("header.nav.routes")}
            </Link>
            
            <span className="mx-1 h-5 w-px bg-white/15" aria-hidden="true" />
            
            <Link
              to="/plataforma?tab=courses"
              className={[
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                location.pathname === "/plataforma" && location.search.includes("courses")
                  ? "bg-white/20 text-white font-semibold"
                  : "text-slate-200 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              {t("header.nav.courses")}
            </Link>

            <Link
              to="/plataforma?tab=map"
              className={[
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                location.pathname === "/plataforma" && location.search.includes("map")
                  ? "bg-white/20 text-white font-semibold"
                  : "text-slate-200 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              {t("platform.tabs.map")}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
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
                      {t("header.user.myProfile")}
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                      className="cursor-pointer rounded-xl px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100"
                      onClick={() => navigate("/comunidades")}
                    >
                      {t("header.user.communities")}
                    </DropdownMenu.Item>

                    <div className="my-2 h-px bg-slate-200" />

                    <DropdownMenu.Item
                      className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-red-600 outline-none hover:bg-red-50"
                      onClick={handleSignOut}
                    >
                      {t("header.user.signOut")}
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <button
                onClick={() => navigate("/entrar")}
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition hover:-translate-y-0.5 cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                {t("header.actions.signIn")}
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
              <span className="text-sm font-medium text-white">{t("header.user.language")}</span>
              <LanguageSwitcher />
            </div>

            <Link
              to="/rutas"
              onClick={closeMobile}
              className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-2.5 text-sm font-semibold text-amber-300"
            >
              {t("header.nav.routes")}
            </Link>
            
            <Link
              to="/plataforma?tab=courses"
              onClick={closeMobile}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              {t("header.nav.courses")}
            </Link>
            
            <Link
              to="/plataforma?tab=map"
              onClick={closeMobile}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              {t("platform.tabs.map")}
            </Link>

            {user && (
              <Link
                to="/perfil"
                onClick={closeMobile}
                className={[
                  "rounded-xl px-4 py-2.5 text-sm font-medium transition",
                  isActive("/perfil") ? "bg-white/20 text-white" : "text-slate-200 hover:bg-white/10",
                ].join(" ")}
              >
                {t("header.nav.profile")}
              </Link>
            )}

            {!user && (
              <button
                onClick={() => { closeMobile(); navigate("/entrar"); }}
                className="mt-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-3 text-sm font-bold text-white shadow cursor-pointer"
              >
                {t("header.actions.signIn")}
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
