/**
 * App.tsx — Punto de entrada unificado de AprendeLocal
 *
 * Rutas:
 * /              → Landing page (pública)
 * /plataforma    → Plataforma unificada (cursos + mapa)
 * /plataforma-legacy → Herramienta STEM legacy (mapa, proyectos, roles)
 * /cursos        → Redirige a /plataforma?tab=courses
 * /cursos/:id    → Curso individual (requiere auth)
 * /comunidades   → Comunidades (requiere auth)
 * /perfil        → Perfil del usuario (requiere auth)
 * /entrar        → Login
 * /cadastrar     → Registro
 * /recuperar     → Solicitud del enlace para recuperar la contraseña
 * *              → 404
 */
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Layout from "./shared/components/layout/Layout";
import ProtectedRoute from "./shared/components/auth/ProtectedRoute";
import HomePage from "./modules/home/pages/HomePage";
import PlatformPage from "./modules/platform/pages/PlatformPage";
import PlataformaApp from "./PlataformaApp";
import LoginPage from "./modules/auth/pages/LoginPage";
import RegisterPage from "./modules/auth/pages/RegisterPage";
import AuthCallbackPage from "./modules/auth/pages/AuthCallbackPage";
import ForgotPasswordPage from "./modules/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./modules/auth/pages/ResetPasswordPage";
import PrepararPage from "./modules/sequences/pages/PrepararPage";
import RutasPage from "./modules/sequences/pages/RutasPage";
import ProfilePage from "./modules/profile/pages/ProfilePage";
import CourseLearningPage from "./modules/courses/pages/CourseLearningPage";
import CommunitiesPage from "./modules/communities/pages/CommunitiesPage";
import NotFoundPage from "./modules/errors/pages/NotFoundPage";
import EstadoConexion from "./shared/components/ui/EstadoConexion";
import "./shared/i18n";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "entrar", element: <LoginPage /> },
      { path: "admin", element: <Navigate to="/entrar?admin=1" replace /> },
      { path: "cadastrar", element: <RegisterPage /> },
      { path: "registro", element: <RegisterPage /> },
      { path: "recuperar", element: <ForgotPasswordPage /> },

      /* ── Plataforma unificada ── */
      { path: "plataforma", element: <PlatformPage /> },
      // Entrada del docente: empieza por el objetivo de aprendizaje, no por el mapa.
      { path: "preparar", element: <PrepararPage /> },
      // Clases ya escritas. Es la puerta que no obliga a generar nada.
      { path: "rutas", element: <RutasPage /> },

      /* ── Redirects de rutas antiguas ── */
      { path: "cursos", element: <Navigate to="/plataforma?tab=courses" replace /> },

      /* ── Rutas protegidas ── */
      {
        path: "perfil",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "cursos/:cursoId",
        element: (
          <ProtectedRoute>
            <CourseLearningPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "comunidades",
        element: (
          <ProtectedRoute>
            <CommunitiesPage />
          </ProtectedRoute>
        ),
      },

      /* ── 404 ── */
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    // Retorno del enlace de confirmación de Supabase.
    path: "/auth/callback",
    element: <AuthCallbackPage />,
  },
  {
    // Retorno del enlace de recuperación: aquí se fija la contraseña nueva.
    path: "/auth/reset",
    element: <ResetPasswordPage />,
  },
  {
    path: "/plataforma-legacy",
    element: <PlataformaApp />,
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      {/* Fuera del router a propósito: el aviso de «sin señal» tiene que
          poder aparecer en cualquier pantalla, incluidas las de
          autenticación, que no cuelgan del Layout. */}
      <EstadoConexion />
    </>
  );
}
