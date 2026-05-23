/**
 * App.tsx — Punto de entrada unificado de AprendeLocal
 *
 * Rutas:
 * /              → Landing page (pública)
 * /plataforma    → Plataforma unificada (cursos + mapa + makerspaces)
 * /plataforma-legacy → Herramienta STEM legacy (mapa, proyectos, roles)
 * /cursos        → Redirige a /plataforma?tab=courses
 * /makerspaces   → Redirige a /plataforma?tab=makerspaces
 * /cursos/:id    → Curso individual (requiere auth)
 * /comunidades   → Comunidades (requiere auth)
 * /perfil        → Perfil del usuario (requiere auth)
 * /entrar        → Login
 * /cadastrar     → Registro
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
import ProfilePage from "./modules/profile/pages/ProfilePage";
import CourseLearningPage from "./modules/courses/pages/CourseLearningPage";
import CommunitiesPage from "./modules/communities/pages/CommunitiesPage";
import NotFoundPage from "./modules/errors/pages/NotFoundPage";
import "./shared/i18n";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "entrar", element: <LoginPage /> },
      { path: "cadastrar", element: <RegisterPage /> },
      { path: "registro", element: <RegisterPage /> },

      /* ── Plataforma unificada ── */
      { path: "plataforma", element: <PlatformPage /> },

      /* ── Redirects de rutas antiguas ── */
      { path: "cursos", element: <Navigate to="/plataforma?tab=courses" replace /> },
      { path: "makerspaces", element: <Navigate to="/plataforma?tab=makerspaces" replace /> },

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
    path: "/plataforma-legacy",
    element: <PlataformaApp />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
