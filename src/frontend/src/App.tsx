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
import Accesibilidad from "./shared/components/Accesibilidad";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Layout from "./shared/components/layout/Layout";
import ProtectedRoute from "./shared/components/auth/ProtectedRoute";
import HomePage from "./modules/home/pages/HomePage";
import LoginPage from "./modules/auth/pages/LoginPage";
import RegisterPage from "./modules/auth/pages/RegisterPage";
import AuthCallbackPage from "./modules/auth/pages/AuthCallbackPage";
import ForgotPasswordPage from "./modules/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "./modules/auth/pages/ResetPasswordPage";
import PrepararPage from "./modules/sequences/pages/PrepararPage";
import CrearPage from "./modules/sequences/pages/CrearPage";
import ProfilePage from "./modules/profile/pages/ProfilePage";
import CommunitiesPage from "./modules/communities/pages/CommunitiesPage";
import NoExistePage from "./modules/errors/NoExistePage";
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

      /* ── Módulo Pedagógico & Rutas Docentes ── */
      // Lo que salio de la portada para que dejara de ser un folleto de ocho
      // pantallas. No se borro: se mudo.
      { path: "preparar", element: <PrepararPage /> },

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
        path: "comunidades",
        element: (
          <ProtectedRoute>
            <CommunitiesPage />
          </ProtectedRoute>
        ),
      },

      /* ── Redirección de rutas antiguas / eliminadas al inicio ── */
      { path: "plataforma", element: <Navigate to="/" replace /> },
      { path: "plataforma-legacy", element: <Navigate to="/" replace /> },
      { path: "cursos", element: <Navigate to="/" replace /> },
      { path: "cursos/*", element: <Navigate to="/" replace /> },
      /* Las dos subpaginas que Diego pidio sacar. Se redirigen en vez de
         devolver un 404: su contenido volvio a la portada, y un enlace que
         alguien haya guardado sigue llegando a alguna parte. */
      { path: "rutas", element: <Navigate to="/" replace /> },
      { path: "metodologia", element: <Navigate to="/" replace /> },

      /* Lo que no es ninguna de las anteriores no existe, y hay que decirlo.
         Mandarlo al inicio en silencio deja a la persona en la portada sin
         entender que paso, y le entrega a los buscadores un «soft 404». */
      { path: "*", element: <NoExistePage /> },
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
    // Crear una ruta propia, por diapositivas.
    path: "/crear",
    element: <CrearPage />,
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
      {/* También fuera del router: quien necesita más contraste lo necesita en
          todas las pantallas, no solo en las que cuelgan del Layout. */}
      <Accesibilidad />
    </>
  );
}
