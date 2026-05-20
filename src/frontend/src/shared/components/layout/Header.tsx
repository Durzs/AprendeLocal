import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, ChevronDown, LogIn, Menu, X, Globe } from "lucide-react";
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
    <header className="sticky top-4 z-50 px-4">
      <div className="mx-auto max-w-6xl rounded-full border border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between gap-2 px-3 sm:h-16 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMobile}>
            <img
              src={logo}
              alt="Logo AprendeLocal"
              className="h-8 w-8 rounded-full border border-slate-200 object-cover sm:h-9 sm:w-9"
            />
            <span className="max-w-[86px] truncate text-sm font-semibold tracking-tight text-slate-950 sm:max-w-none sm:text-base">
              AprendeLocal
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to="/makerspaces"
              className={[
                "rounded-full px-4 py-2 text-sm font-medium transition",
                isActive("/makerspaces")
                  ? "bg-slate-100 text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              ].join(" ")}
            >
              Makerspaces
            </Link>

            {user && (
              <Link
                to="/plataforma"
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive("/plataforma")
                    ? "bg-slate-100 text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")}
              >
                Plataforma STEM
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language switcher - desktop */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 md:hidden"
              aria-label={mobileOpen ? t("header.mobile.closeMenu") : t("header.mobile.openMenu")}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            {/* Auth buttons */}
            {loading ? (
              <div className="px-3 py-2 text-sm text-slate-500">
                {t("header.actions.loading")}
              </div>
            ) : user ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-800 transition hover:bg-slate-50">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-950 text-white">
                      <User className="h-4 w-4" />
                    </span>
                    <div className="hidden flex-col items-start leading-tight sm:flex">
                      <span className="text-sm font-semibold text-slate-900">{displayName}</span>
                      <span className="-mt-0.5 text-[11px] text-slate-500">
                        {user?.email?.split("@")?.[0]}
                      </span>
                    </div>
                    <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={10}
                    className="z-50 min-w-[220px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
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
                className="inline-flex items-center gap-2 rounded-full bg-[#111217] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
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
        <div className="mt-2 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-sm font-medium text-slate-700">{t("header.user.language")}</span>
              <LanguageSwitcher />
            </div>

            <Link
              to="/makerspaces"
              onClick={closeMobile}
              className={[
                "rounded-xl px-4 py-3 text-sm font-medium transition",
                isActive("/makerspaces") ? "bg-slate-100 text-slate-950" : "text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >
              Makerspaces
            </Link>

            {user && (
              <>
                <Link
                  to="/plataforma"
                  onClick={closeMobile}
                  className={[
                    "rounded-xl px-4 py-3 text-sm font-medium transition",
                    isActive("/plataforma") ? "bg-slate-100 text-slate-950" : "text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  Plataforma STEM
                </Link>
                <Link
                  to="/cursos"
                  onClick={closeMobile}
                  className={[
                    "rounded-xl px-4 py-3 text-sm font-medium transition",
                    isActive("/cursos") ? "bg-slate-100 text-slate-950" : "text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {t("header.nav.courses")}
                </Link>
                <Link
                  to="/perfil"
                  onClick={closeMobile}
                  className={[
                    "rounded-xl px-4 py-3 text-sm font-medium transition",
                    isActive("/perfil") ? "bg-slate-100 text-slate-950" : "text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {t("header.nav.profile")}
                </Link>
              </>
            )}

            {!user && (
              <button
                onClick={() => { closeMobile(); navigate("/entrar"); }}
                className="mt-2 rounded-xl bg-[#111217] px-4 py-3 text-sm font-semibold text-white shadow"
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
