import { useState, useEffect } from "react";
import type { POIFeature, STEMProject } from "../types";
import { fetchProjectsForPoint, generateProject } from "../api";
import ProjectCard from "./ProjectCard";

const TYPE_LABELS: Record<string, string> = {
  natural: "Natural",
  geological: "Geológico",
  hydrological: "Hidrológico",
  cultural: "Cultural",
};

const TYPE_EMOJI: Record<string, string> = {
  natural: "🌿",
  geological: "🌋",
  hydrological: "💧",
  cultural: "🏛️",
};

interface Props {
  point: POIFeature | null;
  onClose: () => void;
}

export default function PointPanel({ point, onClose }: Props) {
  const [projects, setProjects] = useState<STEMProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pointId = point?.properties.id;

  // Cargar proyectos existentes cuando se selecciona un punto
  useEffect(() => {
    if (!pointId) return;
    setProjects([]);
    setError(null);
    setLoading(true);

    fetchProjectsForPoint(pointId)
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [pointId]);

  if (!point) return null;

  const { properties: p } = point;

  const handleGenerate = async () => {
    if (!pointId) return;
    setGenerating(true);
    setError(null);

    try {
      const result = await generateProject(pointId, "basica_segundo_ciclo", 1);
      // Agregar los nuevos proyectos a la lista existente
      setProjects((prev) => [...prev, ...result.projects]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar proyecto");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="point-panel">
      <button className="panel-close" onClick={onClose}>
        ✕
      </button>

      <div className="panel-header">
        <span className="panel-emoji">
          {TYPE_EMOJI[p.type] || "📍"}
        </span>
        <h2>{p.name}</h2>
      </div>

      <div className="panel-meta">
        <span className="tag tag-type">
          {TYPE_LABELS[p.type] || p.type}
        </span>
        <span className="tag tag-commune">{p.commune}</span>
        {p.ecosystem && (
          <span className="tag tag-ecosystem">
            {p.ecosystem.replace(/_/g, " ")}
          </span>
        )}
      </div>

      {p.description && (
        <p className="panel-description">{p.description}</p>
      )}

      {p.stem_areas && p.stem_areas.length > 0 && (
        <div className="panel-section">
          <h3>Áreas STEM</h3>
          <div className="tags">
            {p.stem_areas.map((area) => (
              <span key={area} className="tag tag-stem">
                {area.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {p.threats && p.threats.length > 0 && (
        <div className="panel-section">
          <h3>Amenazas</h3>
          <div className="tags">
            {p.threats.map((threat) => (
              <span key={threat} className="tag tag-threat">
                {threat.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Sección Proyectos STEM ── */}
      <div className="panel-section projects-section">
        <div className="projects-header">
          <h3>Proyectos STEM</h3>
          <button
            className="btn-generate"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? "⏳ Generando..." : "✨ Generar proyecto"}
          </button>
        </div>

        {error && <p className="project-error">⚠️ {error}</p>}

        {loading && <p className="project-loading">Cargando proyectos...</p>}

        {!loading && projects.length === 0 && !generating && (
          <p className="project-empty">
            No hay proyectos aún. Haz click en "Generar proyecto" para crear uno con IA.
          </p>
        )}

        {projects.map((project, idx) => (
          <ProjectCard key={project.id || idx} project={project} />
        ))}
      </div>
    </div>
  );
}
