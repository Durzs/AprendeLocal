import { Link, useLocation } from "react-router-dom";
import { LogIn, Mail, NotebookPen, Sparkles } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import { useTx } from "../../tx";
import Cargando from "../ui/Cargando";

const CORREO = "aprendelocal@gmail.com";

/**
 * La puerta del cuaderno y del seguimiento.
 *
 * El cuaderno se abría sin cuenta: cualquiera que tocara «Crear ruta» entraba
 * y trabajaba guardando en su navegador. Desde octubre de 2026 el cuaderno es
 * para las escuelas que trabajan con el equipo, así que sin sesión se ve esto:
 * qué hay adentro, cómo pedir acceso y, para quien ya tiene cuenta, la entrada.
 *
 * No redirige a «Entrar» como las rutas protegidas. Quien llega aquí desde la
 * portada casi nunca tiene cuenta, y mandarlo a un formulario de contraseña
 * sin explicarle nada se lee como un error. Tampoco se pierde lo que traía:
 * el demo del stand deja su ruta guardada en el navegador antes de venir, y
 * aparece en el cuaderno apenas la persona entra.
 *
 * El demo (/congreso) sigue libre. Es la muestra, y desde aquí se ofrece.
 */
export default function SoloConCuenta({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const tx = useTx();

  if (loading) return <Cargando />;
  if (user) return <>{children}</>;

  const desdeDemo = Boolean((location.state as { desdeDemo?: boolean } | null)?.desdeDemo);
  const asunto = tx("Quiero usar el cuaderno de AprendeLocal", "Quero usar o caderno da AprendeLocal");

  const adentro = [
    tx("Los objetivos del currículum, marcados y ordenados", "As habilidades da BNCC, marcadas e ordenadas"),
    tx("La salida a terreno con sus permisos y técnicas", "A saída de campo com autorizações e técnicas"),
    tx("El calendario de clases de cada etapa", "O calendário de aulas de cada etapa"),
    tx("El seguimiento del proyecto, guardado en tu cuenta", "O acompanhamento do projeto, salvo na sua conta"),
  ];

  return (
    <main className="bg-crema px-4 py-16 text-texto sm:py-24">
      <div className="mx-auto w-full max-w-2xl">
        <p className="rotulo flex items-center gap-2 text-tierra-700">
          <NotebookPen className="h-4 w-4" aria-hidden />
          {tx("El cuaderno", "O caderno")}
        </p>

        <h1 className="display mt-4 text-3xl sm:text-4xl [text-wrap:balance]">
          {tx("El cuaderno se abre con una cuenta", "O caderno abre com uma conta")}
        </h1>

        <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-700">
          {tx(
            "Lo estamos abriendo de a poco, escuela por escuela, para acompañar bien cada ruta. Escríbenos y te contamos cómo sumarte.",
            "Estamos abrindo aos poucos, escola por escola, para acompanhar bem cada rota. Escreva para nós e contamos como participar."
          )}
        </p>

        {desdeDemo && (
          <p className="mt-6 rounded-2xl border border-bosque-950/10 bg-bosque-papel px-5 py-4 text-[15px] leading-relaxed text-slate-800">
            {tx(
              "La ruta que armaste en el stand quedó guardada en este equipo. Aparece en el cuaderno apenas entres con tu cuenta.",
              "A rota que você montou no estande ficou salva neste aparelho. Ela aparece no caderno assim que você entrar com sua conta."
            )}
          </p>
        )}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-crema-clara p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-tinta-950">{tx("Pide acceso", "Peça acesso")}</h2>
          <p className="mt-1 text-[15px] text-slate-600">
            {tx(
              "Cuéntanos de tu escuela y te respondemos con tu cuenta.",
              "Conte sobre a sua escola e respondemos com a sua conta."
            )}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/#contacto"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-acento px-6 font-bold text-white shadow-md shadow-tierra-600/20 transition hover:bg-acento-hover"
            >
              {tx("Escribir al equipo", "Escrever para a equipe")}
            </Link>
            <a
              href={`mailto:${CORREO}?subject=${encodeURIComponent(asunto)}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 font-medium text-slate-700 transition hover:border-slate-400"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {CORREO}
            </a>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <p className="text-sm font-semibold text-slate-800">{tx("Ya tengo cuenta", "Já tenho conta")}</p>
            <Link
              to="/entrar"
              state={{ from: location }}
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-tinta-950 px-5 text-sm font-bold text-white transition hover:bg-tinta-800"
            >
              <LogIn className="h-4 w-4" aria-hidden />
              {tx("Entrar al cuaderno", "Entrar no caderno")}
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="rotulo text-slate-600">{tx("Lo que hay adentro", "O que tem dentro")}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {adentro.map((linea) => (
              <li key={linea} className="flex items-start gap-2.5 text-[15px] leading-snug text-slate-700">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-acento" aria-hidden />
                {linea}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-[15px] leading-relaxed text-slate-600">
          <Sparkles className="mr-1.5 inline h-4 w-4 align-[-2px] text-tierra-700" aria-hidden />
          {tx("Mientras, puedes probar cómo se arma una ruta en el", "Enquanto isso, você pode testar como se monta uma rota na")}{" "}
          <Link to="/congreso" className="font-semibold text-tinta-800 underline underline-offset-4 hover:text-tierra-700">
            {tx("demo de cuatro pasos", "demonstração de quatro passos")}
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
