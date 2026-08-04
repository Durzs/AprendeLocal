import { useState, useEffect } from "react";
import type { POIFeature, STEMProject } from "../types";
import { fetchProjectsForPoint, generateProject } from "../api";
import { saveProjectId } from "../utils/teacherStorage";
import ProjectCard from "./ProjectCard";
import ProjectConfigurator from "./ProjectConfigurator";
import type { ProjectSpecs } from "./ProjectConfigurator";
import ProjectOptions from "./ProjectOptions";

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

type PanelView = "info" | "configure" | "options";

interface Props {
  point: POIFeature | null;
  onClose: () => void;
}

export default function PointPanel({ point, onClose }: Props) {
  const [projects, setProjects] = useState<STEMProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<PanelView>("info");

  // Generación
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [generatedOptions, setGeneratedOptions] = useState<STEMProject[]>([]);
  const [, setCurrentSpecs] = useState<ProjectSpecs | null>(null);

  const pointId = point?.properties.id;

  // Cargar proyectos existentes cuando se selecciona un punto
  useEffect(() => {
    if (!pointId) return;
    setProjects([]);
    setGenError(null);
    setLoading(true);
    setView("info");
    setGeneratedOptions([]);

    fetchProjectsForPoint(pointId)
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [pointId]);

  if (!point) return null;

  const { properties: p } = point;

  const handleStartConfigure = () => {
    setView("configure");
    setGenError(null);
  };

  const handleGenerate = async (specs: ProjectSpecs) => {
    setCurrentSpecs(specs);
    setView("options");
    setGenerating(true);
    setGenError(null);
    setGeneratedOptions([]);

    try {
      const result = await generateProject(
        specs.pointId,
        specs.level,
        3,
        specs.oaDescriptions,
        specs.duration
      );
      setGeneratedOptions(result.projects);
    } catch (err) {
      setGenError(
        err instanceof Error ? err.message : "Error al generar proyectos"
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectProject = (project: STEMProject) => {
    // Agregar a la lista de proyectos del punto
    setProjects((prev) => [project, ...prev]);
    // Guardar en localStorage para que aparezca en "Mis Proyectos"
    if (project.id) {
      saveProjectId(project.id);
    }
    // Volver a la vista de info
    setView("info");
    setGeneratedOptions([]);
  };

  // Vista: Configurador
  if (view === "configure") {
    return (
      <div className="point-panel panel-wide">
        <button className="panel-close" onClick={onClose}>✕</button>
        <ProjectConfigurator
          pointId={p.id}
          pointName={p.name}
          onGenerate={handleGenerate}
          onCancel={() => setView("info")}
        />
      </div>
    );
  }

  // Vista: Opciones generadas
  if (view === "options") {
    return (
      <div className="point-panel panel-wide">
        <button className="panel-close" onClick={onClose}>✕</button>
        <ProjectOptions
          projects={generatedOptions}
          pointName={p.name}
          onSelect={handleSelectProject}
          onBack={() => setView("configure")}
          loading={generating}
          error={genError}
        />
      </div>
    );
  }

  // Vista: Info del punto (default)
  return (
    <div className="point-panel">
      <button className="panel-close" onClick={onClose}>✕</button>

      <div className="panel-header">
        <span className="panel-emoji">{TYPE_EMOJI[p.type] || "📍"}</span>
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
          <button className="btn-generate" onClick={handleStartConfigure}>
            ✨ Generar proyecto
          </button>
        </div>

        {loading && <p className="project-loading">Cargando proyectos...</p>}

        {!loading && projects.length === 0 && (
          <p className="project-empty">
            No hay proyectos aún. Haz click en "Generar proyecto" para
            configurar curso, OA y crear propuestas con IA.
          </p>
        )}

        {projects.map((project, idx) => (
          <ProjectCard key={project.id || idx} project={project} />
        ))}
      </div>
    </div>
  );
}
