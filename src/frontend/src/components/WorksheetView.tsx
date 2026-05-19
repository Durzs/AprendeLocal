/**
 * WorksheetView.tsx — Fichas de trabajo para estudiantes
 *
 * Muestra una ficha por sesión con instrucciones claras,
 * actividades y preguntas de reflexión.
 * Pensado para estudiantes rurales de 10-14 años.
 */
import { useState } from "react";
import type { StudentWorksheet } from "../types";

const TYPE_ICONS: Record<string, string> = {
  observacion: "👁️",
  registro: "📝",
  analisis: "🔬",
  creacion: "🎨",
};

const TYPE_LABELS: Record<string, string> = {
  observacion: "Observación",
  registro: "Registro",
  analisis: "Análisis",
  creacion: "Creación",
};

interface Props {
  worksheets: StudentWorksheet[];
}

export default function WorksheetView({ worksheets }: Props) {
  // Mostrar una ficha a la vez con navegación
  const [current, setCurrent] = useState(0);

  if (worksheets.length === 0) {
    return <p className="empty-text">No hay fichas disponibles.</p>;
  }

  const sheet = worksheets[current];

  return (
    <div className="worksheet-view">
      <h3 className="worksheet-main-title">Fichas de Trabajo del Estudiante</h3>

      {/* Navegación entre fichas */}
      <div className="worksheet-nav">
        {worksheets.map((ws, i) => (
          <button
            key={i}
            className={`worksheet-nav-btn ${i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)}
          >
            Sesión {ws.session_number}
          </button>
        ))}
      </div>

      {/* Ficha actual */}
      <div className="worksheet-card">
        <div className="worksheet-header">
          <span className="worksheet-session">
            Sesión {sheet.session_number}
          </span>
          <h4 className="worksheet-title">{sheet.title}</h4>
        </div>

        <div className="worksheet-instructions">
          <h5>📖 Instrucciones</h5>
          <p>{sheet.instructions}</p>
        </div>

        <div className="worksheet-activities">
          <h5>✏️ Actividades</h5>
          {sheet.activities.map((act, i) => (
            <div key={i} className="worksheet-activity">
              <span className="activity-badge">
                {TYPE_ICONS[act.type] || "📌"} {TYPE_LABELS[act.type] || act.type}
              </span>
              <p>{act.description}</p>
            </div>
          ))}
        </div>

        {sheet.reflection_questions.length > 0 && (
          <div className="worksheet-reflection">
            <h5>💭 Preguntas de reflexión</h5>
            <ol>
              {sheet.reflection_questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
