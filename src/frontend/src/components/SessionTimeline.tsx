/**
 * SessionTimeline.tsx — Timeline visual de sesiones de clase
 *
 * Muestra cada sesión como una tarjeta en una línea de tiempo vertical.
 * El docente puede ver de un vistazo: qué hacer en cada clase,
 * si es en aula o terreno, qué materiales necesita.
 */
import type { SessionPlan } from "../types";

const LOCATION_LABELS: Record<string, { label: string; icon: string }> = {
  aula: { label: "En el aula", icon: "🏫" },
  terreno: { label: "En terreno", icon: "🌿" },
  mixto: { label: "Aula + Terreno", icon: "🔄" },
};

interface Props {
  sessions: SessionPlan[];
}

export default function SessionTimeline({ sessions }: Props) {
  return (
    <div className="session-timeline">
      <h3 className="timeline-title">
        Planificación: {sessions.length} sesiones de clase
      </h3>

      <div className="timeline">
        {sessions.map((session) => {
          const loc = LOCATION_LABELS[session.location] || LOCATION_LABELS.aula;

          return (
            <div key={session.session_number} className="timeline-item">
              <div className="timeline-marker">
                <span className="marker-number">{session.session_number}</span>
              </div>

              <div className="timeline-card">
                <div className="timeline-card-header">
                  <h4>{session.title}</h4>
                  <div className="timeline-card-badges">
                    <span className="badge badge-location">
                      {loc.icon} {loc.label}
                    </span>
                    <span className="badge badge-time">
                      ⏱️ {session.duration_minutes} min
                    </span>
                  </div>
                </div>

                <p className="timeline-objective">
                  <strong>Objetivo:</strong> {session.objective}
                </p>

                <div className="timeline-section">
                  <h5>Actividades</h5>
                  <ol className="timeline-activities">
                    {session.activities.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ol>
                </div>

                {session.materials.length > 0 && (
                  <div className="timeline-section">
                    <h5>🧰 Materiales</h5>
                    <div className="timeline-materials">
                      {session.materials.map((mat, i) => (
                        <span key={i} className="tag tag-material">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
