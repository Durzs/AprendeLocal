/**
 * RoleSelector.tsx — Pantalla inicial para elegir rol
 *
 * El usuario elige "Soy Profesor" o "Soy Estudiante".
 * El estudiante también puede ingresar un código de proyecto directamente.
 */
import { useState } from "react";
import type { UserRole } from "../types";
import { saveRole } from "../utils/studentStorage";

interface Props {
  onSelectRole: (role: UserRole, shareCode?: string) => void;
}

export default function RoleSelector({ onSelectRole }: Props) {
  const [codeInput, setCodeInput] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleSelectRole = (role: UserRole) => {
    saveRole(role);
    onSelectRole(role);
  };

  const handleCodeSubmit = () => {
    const code = codeInput.trim().toUpperCase();
    if (code.length >= 4) {
      saveRole("estudiante");
      onSelectRole("estudiante", code);
    }
  };

  return (
    <div className="role-selector">
      {/* Logo y título */}
      <div className="role-header">
        <div className="role-logo">🏫</div>
        <h1 className="role-title">AprendeLocal</h1>
        <p className="role-subtitle">
          Proyectos STEM contextualizados para tu escuela en La Araucanía
        </p>
      </div>

      {/* Tarjetas de rol */}
      <div className="role-cards">
        {/* Profesor */}
        <button
          className="role-card role-card-profesor"
          onClick={() => handleSelectRole("profesor")}
        >
          <div className="role-card-icon">👩‍🏫</div>
          <h2>Soy Profesor/a</h2>
          <p>
            Explora puntos de interés cercanos a tu escuela, genera proyectos
            STEM con IA, y comparte actividades con tus estudiantes.
          </p>
          <ul className="role-features">
            <li>Explorar mapa y generar proyectos</li>
            <li>Planificación por sesiones</li>
            <li>Guía docente y rúbrica</li>
            <li>Seguimiento de progreso</li>
          </ul>
        </button>

        {/* Estudiante */}
        <button
          className="role-card role-card-estudiante"
          onClick={() => handleSelectRole("estudiante")}
        >
          <div className="role-card-icon">🧑‍🔬</div>
          <h2>Soy Estudiante</h2>
          <p>
            Accede a los proyectos que tu profesor/a ha preparado, completa
            actividades y registra tus observaciones de terreno.
          </p>
          <ul className="role-features">
            <li>Ver fichas de trabajo</li>
            <li>Registrar observaciones</li>
            <li>Completar actividades</li>
            <li>Responder evaluaciones</li>
          </ul>
        </button>
      </div>

      {/* Sección de código */}
      <div className="role-code-section">
        {!showCodeInput ? (
          <button
            className="role-code-toggle"
            onClick={() => setShowCodeInput(true)}
          >
            🔑 Tengo un código de proyecto
          </button>
        ) : (
          <div className="role-code-form">
            <p className="role-code-label">
              Ingresa el código que te dio tu profesor/a:
            </p>
            <div className="role-code-input-row">
              <input
                type="text"
                className="role-code-input"
                placeholder="Ej: ABC123"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleCodeSubmit()}
                maxLength={6}
                autoFocus
              />
              <button
                className="role-code-submit"
                onClick={handleCodeSubmit}
                disabled={codeInput.trim().length < 4}
              >
                Entrar →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
