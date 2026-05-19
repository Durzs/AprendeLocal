import type { STEMProject } from "../types";

interface Props {
  projects: STEMProject[];
  pointName: string;
  onSelect: (project: STEMProject) => void;
  onBack: () => void;
  loading: boolean;
  error: string | null;
}

const AREA_EMOJI: Record<string, string> = {
  biologia: "🧬",
  quimica: "🧪",
  fisica: "⚡",
  matematica: "📐",
  tecnologia: "💻",
  ecologia: "🌿",
  geologia: "🪨",
  historia: "📜",
};

export default function ProjectOptions({
  projects,
  pointName,
  onSelect,
  onBack,
  loading,
  error,
}: Props) {
  if (loading) {
    return (
      <div className="project-options">
        <div className="options-loading">
          <div className="loading-spinner" />
          <h3>Generando propuestas...</h3>
          <p>Claude está creando 3 proyectos STEM contextualizados para <strong>{pointName}</strong></p>
          <p className="loading-hint">Esto puede tomar 15-30 segundos</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-options">
        <div className="options-error">
          <p>❌ {error}</p>
          <button className="btn-cancel" onClick={onBack}>Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-options">
      <div className="options-header">
        <h3>Elige tu proyecto</h3>
        <p>3 propuestas para <strong>{pointName}</strong>. Selecciona la que mejor se adapte a tu curso.</p>
      </div>

      <div className="options-grid">
        {projects.map((project, idx) => (
          <div key={idx} className="option-card">
            <div className="option-card-top">
              <span className="option-number">Opción {idx + 1}</span>
              <div className="option-areas">
                {project.stem_areas?.map((area) => (
                  <span key={area} className="option-area-tag">
                    {AREA_EMOJI[area] || "📚"} {area}
                  </span>
                ))}
              </div>
            </div>

            <h4 className="option-title">{project.title}</h4>

            <p className="option-connection">{project.local_connection}</p>

            <div className="option-meta">
              <span>⏱ {project.duration}</span>
              {project.materials && (
                <span>🧰 {project.materials.length} materiales</span>
              )}
              {project.steps && (
                <span>📋 {project.steps.length} etapas</span>
              )}
            </div>

            <div className="option-objectives">
              <h5>Objetivos:</h5>
              <ul>
                {project.objectives?.slice(0, 3).map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            <div className="option-outcomes">
              <h5>Resultados esperados:</h5>
              <ul>
                {project.expected_outcomes?.slice(0, 2).map((out, i) => (
                  <li key={i}>{out}</li>
                ))}
              </ul>
            </div>

            <button
              className="btn-select-project"
              onClick={() => onSelect(project)}
            >
              ✅ Elegir este proyecto
            </button>
          </div>
        ))}
      </div>

      <div className="options-footer">
        <button className="btn-cancel" onClick={onBack}>
          ← Cambiar configuración
        </button>
      </div>
    </div>
  );
}
