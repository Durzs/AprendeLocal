/**
 * MisProyectos.tsx — Hub "Mis Proyectos"
 *
 * Muestra todos los proyectos que el docente ha elegido.
 * Los IDs vienen de localStorage (sin auth por ahora).
 * Desde aquí el docente puede abrir un proyecto para ver su
 * planificación detallada, o quitarlo de su lista.
 */
import { useState, useEffect } from "react";
import type { STEMProject } from "../types";
import { fetchProjectsByIds } from "../api";
import { getSavedProjectIds, removeProjectId } from "../utils/teacherStorage";

interface Props {
  onOpenProject: (projectId: string) => void;
  onGoExplore: () => void;
}

export default function MisProyectos({ onOpenProject, onGoExplore }: Props) {
  const [projects, setProjects] = useState<STEMProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getSavedProjectIds();
    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    fetchProjectsByIds(ids)
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = (projectId: string) => {
    removeProjectId(projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  // Estado vacío: no hay proyectos guardados
  if (!loading && projects.length === 0) {
    return (
      <div className="mis-proyectos-empty">
        <div className="empty-icon">📋</div>
        <h3>Aún no tienes proyectos</h3>
        <p>
          Explora los puntos de interés cercanos a tu escuela y genera
          proyectos STEM adaptados a tu territorio.
        </p>
        <button className="btn-primary" onClick={onGoExplore}>
          🗺️ Ir a explorar
        </button>
      </div>
    );
  }

  return (
    <div className="mis-proyectos">
      <div className="mis-proyectos-header">
        <h3>Mis Proyectos ({projects.length})</h3>
        <p className="mis-proyectos-subtitle">
          Haz click en un proyecto para ver su planificación completa
        </p>
      </div>

      {loading ? (
        <div className="loading">Cargando tus proyectos...</div>
      ) : (
        <div className="mis-proyectos-grid">
          {projects.map((project) => (
            <div key={project.id} className="hub-card">
              <div
                className="hub-card-body"
                onClick={() => project.id && onOpenProject(project.id)}
              >
                <h4 className="hub-card-title">{project.title}</h4>

                <div className="hub-card-meta">
                  {project.duration && (
                    <span className="tag tag-type">{project.duration}</span>
                  )}
                  <span className="tag tag-stem">
                    {project.level?.replace(/_/g, " ")}
                  </span>
                </div>

                {project.stem_areas && project.stem_areas.length > 0 && (
                  <div className="hub-card-areas">
                    {project.stem_areas.map((area) => (
                      <span key={area} className="tag tag-stem">
                        {area.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                )}

                {project.local_connection && (
                  <p className="hub-card-connection">
                    {project.local_connection.slice(0, 120)}
                    {project.local_connection.length > 120 ? "..." : ""}
                  </p>
                )}

                <div className="hub-card-stats">
                  <span>📋 {project.steps?.length || 0} pasos</span>
                  <span>🧰 {project.materials?.length || 0} materiales</span>
                  <span>🎯 {project.objectives?.length || 0} objetivos</span>
                </div>
              </div>

              <div className="hub-card-actions">
                <button
                  className="btn-primary btn-small"
                  onClick={() => project.id && onOpenProject(project.id)}
                >
                  Ver planificación
                </button>
                <button
                  className="btn-remove"
                  onClick={() => project.id && handleRemove(project.id)}
                  title="Quitar de mis proyectos"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
