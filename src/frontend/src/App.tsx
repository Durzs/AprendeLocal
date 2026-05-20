/**
 * App.tsx — Punto de entrada unificado de AprendeLocal
 *
 * Rutas:
 * /              → Landing page (web-aprende)
 * /plataforma    → Herramienta STEM (mapa, proyectos, roles)
 * /cursos        → Catálogo de cursos
 * /cursos/:id    → Curso individual
 * /makerspaces   → Makerspaces
 * /comunidades   → Comunidades
 * /perfil        → Perfil del usuario
 * /entrar        → Login
 * /cadastrar     → Registro
 */
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./shared/components/layout/Layout";
import HomePage from "./modules/home/pages/HomePage";
import PlataformaApp from "./PlataformaApp";
import MakerspacesPage from "./modules/makerspaces/pages/MakerspacesPage";
import LoginPage from "./modules/auth/pages/LoginPage";
import RegisterPage from "./modules/auth/pages/RegisterPage";
import ProfilePage from "./modules/profile/pages/ProfilePage";
import CoursesCatalogPage from "./modules/courses/pages/CoursesCatalogPage";
import CourseLearningPage from "./modules/courses/pages/CourseLearningPage";
import CommunitiesPage from "./modules/communities/pages/CommunitiesPage";
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
      { path: "perfil", element: <ProfilePage /> },
      { path: "cursos", element: <CoursesCatalogPage /> },
      { path: "cursos/:cursoId", element: <CourseLearningPage /> },
      { path: "comunidades", element: <CommunitiesPage /> },
    ],
  },
  {
    // La herramienta STEM vive fuera del layout de web-aprende
    // para mantener su propio CSS y estilo dark
    path: "/plataforma",
    element: <PlataformaApp />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
