/**
 * Pantalla que sustituye a la aplicación cuando algo falla durante el
 * arranque o el render y, sin ella, el sitio quedaría en blanco.
 *
 * Complementa a ConfigErrorScreen: aquella cubre el caso concreto de las
 * variables de entorno ausentes, esta cubre cualquier otro error. Usa
 * estilos en línea por la misma razón, no depender de que las hojas de
 * estilo hayan cargado.
 */

type Props = {
  error: unknown;
};

function describir(error: unknown): { mensaje: string; traza: string | null } {
  if (error instanceof Error) {
    return { mensaje: error.message || error.name, traza: error.stack ?? null };
  }

  return { mensaje: String(error), traza: null };
}

export default function StartupErrorScreen({ error }: Props) {
  const { mensaje, traza } = describir(error);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backgroundColor: "#0f172a",
        color: "#e2e8f0",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <main style={{ maxWidth: "720px", lineHeight: 1.6, width: "100%" }}>
        <h1 style={{ fontSize: "1.5rem", margin: "0 0 12px" }}>
          AprendeLocal no pudo arrancar
        </h1>

        <p style={{ margin: "0 0 20px", color: "#94a3b8" }}>
          La aplicación falló antes de poder mostrarse. El detalle técnico está
          abajo; es lo que hace falta para diagnosticarlo.
        </p>

        <pre
          style={{
            margin: "0 0 20px",
            padding: "16px",
            backgroundColor: "#1e293b",
            borderRadius: "8px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "0.85rem",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowX: "auto",
          }}
        >
          {mensaje}
          {traza ? `\n\n${traza}` : ""}
        </pre>

        <p style={{ margin: 0, fontSize: "0.9rem", color: "#94a3b8" }}>
          Si acabas de redesplegar, recarga forzando el vaciado de caché
          (Ctrl+Shift+R). Si el mensaje menciona Supabase o una variable
          <code style={{ margin: "0 4px" }}>VITE_*</code>, revisa las variables
          de entorno del proveedor y vuelve a desplegar.
        </p>
      </main>
    </div>
  );
}
