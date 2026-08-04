/**
 * Pantalla que sustituye a la aplicación cuando falta configuración
 * imprescindible en el build.
 *
 * Usa estilos en línea a propósito: si algo falla tan temprano, conviene
 * no depender de que las hojas de estilo hayan cargado.
 */

type Props = {
  missing: string[];
};

export default function ConfigErrorScreen({ missing }: Props) {
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
      <main style={{ maxWidth: "560px", lineHeight: 1.6 }}>
        <h1 style={{ fontSize: "1.5rem", margin: "0 0 12px" }}>
          AprendeLocal no está configurado
        </h1>

        <p style={{ margin: "0 0 20px", color: "#94a3b8" }}>
          El sitio se compiló sin las variables de entorno que necesita para
          conectarse a Supabase, así que no puede arrancar.
        </p>

        <p style={{ margin: "0 0 8px" }}>
          {missing.length === 1
            ? "Falta esta variable:"
            : "Faltan estas variables:"}
        </p>

        <ul
          style={{
            margin: "0 0 20px",
            padding: "12px 16px 12px 32px",
            backgroundColor: "#1e293b",
            borderRadius: "8px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "0.9rem",
          }}
        >
          {missing.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>

        <p style={{ margin: 0, fontSize: "0.9rem", color: "#94a3b8" }}>
          Defínelas en el proveedor de alojamiento y vuelve a desplegar. Vite
          incrusta estos valores durante la compilación, por lo que guardarlas
          no basta: hace falta un nuevo build.
        </p>
      </main>
    </div>
  );
}
