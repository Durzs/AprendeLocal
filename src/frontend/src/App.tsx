/**
 * Las rutas de AprendeLocal.
 *
 *   /              Portada, o el escritorio si hay sesión
 *   /crear         El cuaderno: armar la ruta
 *   /proyecto      El seguimiento: por dónde va el proyecto
 *   /congreso      El demo del stand: una ruta en cuatro pasos (también /demo)
 *   /preparar      Preparar una unidad
 *   /perfil        La cuenta y la escuela (con sesión)
 *   /comunidades   Otras escuelas (con sesión)
 *   /br, /cl       La portada de cada edición (fija el país y vuelve a /)
 *   /entrar        Iniciar sesión
 *   /cadastrar     Crear cuenta (también /registro)
 *   /recuperar     Pedir el enlace para cambiar la contraseña
 *   /auth/callback Vuelta del correo de confirmación
 *   /auth/reset    Fijar la contraseña nueva
 *
 * TODAS BAJO LA MISMA CABECERA
 *
 * El cuaderno y el seguimiento colgaban aparte, sin la cabecera del sitio: sin
 * logo, sin menú, sin la cuenta y sin el idioma. Se leían como otra aplicación,
 * y para volver al inicio había que encontrar un «Guardar y salir» en la
 * esquina. Lo mismo el inicio de sesión y el registro, que la escondían a
 * propósito y dejaban a la persona sin forma de volver salvo el botón de atrás
 * del navegador.
 *
 * Ahora todas cuelgan del mismo `Layout`. Lo que cambia entre ellas es si
 * llevan pie: las dos pantallas de trabajo no, porque debajo de un cuaderno el
 * correo de contacto y el enlace a LinkedIn son ruido, y el cuaderno ya tiene
 * su propia barra abajo para avanzar.
 *
 * CADA PANTALLA EN SU BLOQUE
 *
 * Todo el sitio viajaba en un solo archivo de 452 KB comprimidos, y la portada
 * lo descargaba entero —el cuaderno, los 353 objetivos, las once
 * problemáticas— antes de mostrar el titular. En una escuela rural con datos
 * móviles eso es la diferencia entre ver la página y cerrar la pestaña. Ahora
 * cada pantalla pesada llega cuando alguien entra en ella.
 *
 * CADA PANTALLA CON SU TÍTULO
 *
 * Todas las pestañas decían lo mismo, así que con el cuaderno, el seguimiento y
 * el perfil abiertos a la vez no había cómo saber cuál era cuál. Y un lector de
 * pantalla anunciaba el mismo título al cambiar de página, que es anunciar que
 * no cambió nada. Va en `handle.titulo` y lo pone el `Layout`.
 */
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Layout from "./shared/components/layout/Layout";
import ProtectedRoute from "./shared/components/auth/ProtectedRoute";
import HomePage from "./modules/home/pages/HomePage";
import LoginPage from "./modules/auth/pages/LoginPage";
import NoExistePage from "./modules/errors/NoExistePage";
import EstadoConexion from "./shared/components/ui/EstadoConexion";
import Cargando from "./shared/components/ui/Cargando";
import "./shared/i18n";
import EntrarEdicion from "./shared/components/EntrarEdicion";
import { sedeActual } from "./shared/sede";

/**
 * Carga una pantalla en su propio bloque.
 *
 * Lo que llega del import es el componente por defecto; el enrutador lo quiere
 * como `Component`.
 */
function perezosa(cargar: () => Promise<{ default: React.ComponentType }>) {
  return async () => ({ Component: (await cargar()).default });
}

/**
 * Pide el currículum de la edición a la vez que la pantalla, en paralelo.
 *
 * Sin esto llegaba primero el cuaderno, se pintaba, pedía el currículum y
 * mostraba la barra de carga una segunda vez.
 */
async function conCurriculo<T>(pantalla: Promise<T>): Promise<T> {
  const [m] = await Promise.all([
    pantalla,
    import("./modules/sequences/contenido").then((c) => c.cargarObjetivos(sedeActual())),
  ]);
  return m;
}

/** Lo mismo, envuelto en la puerta de las rutas que piden sesión. */
function protegida(cargar: () => Promise<{ default: React.ComponentType }>) {
  return async () => {
    const Pantalla = (await cargar()).default;
    return {
      Component: () => (
        <ProtectedRoute>
          <Pantalla />
        </ProtectedRoute>
      ),
    };
  };
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // Lo que se ve mientras llega el bloque de una pantalla la primera vez.
    hydrateFallbackElement: <Cargando />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "entrar", element: <LoginPage />, handle: { titulo: { es: "Iniciar sesión", pt: "Entrar" } } },
      { path: "admin", element: <Navigate to="/entrar" replace /> },

      /* La puerta de cada edición: `/br` deja la portada brasileña puesta y
         vuelve al inicio. Es el enlace para compartir. Ver §sede.ts. */
      { path: "br", element: <EntrarEdicion sede="br" /> },
      { path: "cl", element: <EntrarEdicion sede="cl" /> },
      {
        path: "cadastrar",
        lazy: perezosa(() => import("./modules/auth/pages/RegisterPage")),
        handle: { titulo: { es: "Crear cuenta", pt: "Criar conta" } },
      },
      {
        path: "registro",
        lazy: perezosa(() => import("./modules/auth/pages/RegisterPage")),
        handle: { titulo: { es: "Crear cuenta", pt: "Criar conta" } },
      },
      {
        path: "recuperar",
        lazy: perezosa(() => import("./modules/auth/pages/ForgotPasswordPage")),
        handle: { titulo: { es: "Recuperar la contraseña", pt: "Recuperar a senha" } },
      },
      {
        path: "preparar",
        lazy: perezosa(() => import("./modules/sequences/pages/PrepararPage")),
        handle: { titulo: { es: "Preparar una unidad", pt: "Preparar uma unidade" } },
      },
      {
        path: "perfil",
        lazy: protegida(() => import("./modules/profile/pages/ProfilePage")),
        handle: { titulo: { es: "Tu perfil", pt: "Seu perfil" } },
      },
      {
        path: "comunidades",
        lazy: protegida(() => import("./modules/communities/pages/CommunitiesPage")),
        handle: { titulo: { es: "Comunidades", pt: "Comunidades" } },
      },

      /* Rutas retiradas. Se redirigen en vez de devolver un 404: un enlace que
         alguien haya guardado sigue llegando a alguna parte. */
      { path: "plataforma", element: <Navigate to="/" replace /> },
      { path: "plataforma-legacy", element: <Navigate to="/" replace /> },
      { path: "cursos", element: <Navigate to="/" replace /> },
      { path: "cursos/*", element: <Navigate to="/" replace /> },
      { path: "rutas", element: <Navigate to="/" replace /> },
      { path: "metodologia", element: <Navigate to="/" replace /> },

      /* Las dos pantallas de trabajo: misma cabecera, sin pie. */
      {
        path: "crear",
        lazy: perezosa(() => conCurriculo(import("./modules/sequences/pages/CrearPage"))),
        handle: { titulo: { es: "Cuaderno", pt: "Caderno" }, sinPie: true },
      },
      {
        path: "proyecto",
        lazy: perezosa(() => conCurriculo(import("./modules/sequences/pages/ProyectoPage"))),
        handle: { titulo: { es: "Seguimiento del proyecto", pt: "Acompanhamento do projeto" }, sinPie: true },
      },

      /* El demo del stand. Lee el catálogo del cuaderno, así que también
         necesita el currículum. Ver §modules/congreso/CongresoPage.tsx. */
      {
        path: "congreso",
        lazy: perezosa(() => conCurriculo(import("./modules/congreso/CongresoPage"))),
        handle: { titulo: { es: "Arma tu ruta", pt: "Monte sua rota" }, sinPie: true },
      },
      { path: "demo", element: <Navigate to="/congreso" replace /> },

      /* Lo que no existe se dice. Mandarlo al inicio en silencio deja a la
         persona en la portada sin entender qué pasó. */
      { path: "*", element: <NoExistePage />, handle: { titulo: { es: "Página no encontrada", pt: "Página não encontrada" } } },
    ],
  },
  {
    // Vuelta del enlace de confirmación de Supabase.
    path: "/auth/callback",
    lazy: perezosa(() => import("./modules/auth/pages/AuthCallbackPage")),
    hydrateFallbackElement: <Cargando />,
  },
  {
    // Vuelta del enlace de recuperación: aquí se fija la contraseña nueva.
    path: "/auth/reset",
    lazy: perezosa(() => import("./modules/auth/pages/ResetPasswordPage")),
    hydrateFallbackElement: <Cargando />,
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      {/* Fuera del router a propósito: el aviso de «sin señal» tiene que
          poder aparecer en cualquier pantalla, incluidas las de vuelta del
          correo, que no llevan cabecera. */}
      <EstadoConexion />
    </>
  );
}
