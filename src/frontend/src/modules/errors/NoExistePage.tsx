import { Link } from "react-router-dom";
import { useTx } from "../../shared/tx";

/**
 * La página de una dirección que no existe.
 *
 * Antes el comodín del router era `<Navigate to="/" replace />`: cualquier
 * dirección desconocida mandaba al inicio en silencio. Eso hace dos daños. A
 * una persona que siguió un enlace roto la deja en la portada sin entender
 * qué pasó, buscando algo que ya no va a encontrar ahí. Y a los buscadores
 * les entrega lo que llaman un «soft 404»: una página que responde que todo
 * está bien cuando en realidad el contenido no existe, que es de las cosas
 * que penalizan.
 *
 * Las redirecciones deliberadas —`/rutas`, `/metodologia`, `/cursos`,
 * `/plataforma`— se quedan como estaban: son direcciones que existieron de
 * verdad y cuyo contenido se mudó, así que mandar al inicio es lo correcto.
 * Lo que cambia es solo el comodín del final.
 */
export default function NoExistePage() {
  const tx = useTx();
  return (
    <main className="grid min-h-[70vh] place-items-center bg-white px-4 py-20 text-texto">
      <div className="w-full max-w-lg text-center">
        <span className="rotulo block text-tierra-700">Error 404</span>

        <h1 className="display mt-4 text-3xl sm:text-4xl">
          {tx("Esta dirección no existe", "Este endereço não existe")}
        </h1>

        <p className="mt-4 text-base leading-relaxed text-slate-600">
          {tx(
            "Puede que el enlace esté mal copiado, o que la página se haya movido. Desde el inicio se llega a todo lo que hay.",
            "Pode ser que o link tenha sido copiado errado, ou que a página tenha mudado de lugar. Pelo início se chega a tudo o que existe."
          )}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-tinta-950 px-7 py-3 text-sm font-bold text-white transition hover:bg-tinta-800 sm:w-auto"
          >
            {tx("Ir al inicio", "Ir para o início")}
          </Link>
          <Link
            to="/crear"
            className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-7 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 sm:w-auto"
          >
            {tx("Armar una ruta", "Montar uma rota")}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          {tx("Si llegaste aquí desde un enlace nuestro, cuéntanos a", "Se você chegou aqui por um link nosso, conte para")}{" "}
          <a
            href="mailto:aprendelocal@gmail.com"
            className="underline underline-offset-4 hover:text-tierra-700"
          >
            aprendelocal@gmail.com
          </a>{" "}
          {tx("y lo arreglamos.", "e a gente conserta.")}
        </p>
      </div>
    </main>
  );
}
