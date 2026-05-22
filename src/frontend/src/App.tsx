/**
 * App.tsx — Punto de entrada unificado de AprendeLocal
 *
 * Rutas:
 * /              → Landing page (pública)
 * /plataforma    → Herramienta STEM (mapa, proyectos, roles)
 * /cursos        → Catálogo de cursos (público)
 * /cursos/:id    → Curso individual (requiere auth)
 * /makerspaces   → Makerspaces (público)
 * /comunidades   → Comunidades (requiere auth)
 * /perfil        → Perfil del usuario (requiere auth)
 * /entrar        → Login
 * /cadastrar     → Registro
 * *              → 404
 */
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./shared/components/layout/Layout";
import ProtectedRoute from "./shared/components/auth/ProtectedRoute";
import HomePage from "./modules/home/pages/HomePage";
import PlataformaApp from "./PlataformaApp";
import MakerspacesPage from "./modules/makerspaces/pages/MakerspacesPage";
import LoginPage from "./modules/auth/pages/LoginPage";
import RegisterPage from "./modules/auth/pages/RegisterPage";
import ProfilePage from "./modules/profile/pages/ProfilePage";
import CoursesCatalogPage from "./modules/courses/pages/CoursesCatalogPage";
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
      { path: "makerspaces", element: <MakerspacesPage /> },
      { path: "entrar", element: <LoginPage /> },
      { path: "cadastrar", element: <RegisterPage /> },
      { path: "cursos", element: <CoursesCatalogPage /> },

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
    path: "/plataforma",
    element: <PlataformaApp />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
