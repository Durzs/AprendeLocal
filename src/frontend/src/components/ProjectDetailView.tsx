/**
 * ProjectDetailView.tsx — Vista detallada de un proyecto STEM
 *
 * Cuando el docente abre un proyecto desde "Mis Proyectos", esta vista:
 * 1. Carga el proyecto desde la API
 * 2. Llama a /expand para generar sesiones, guía, fichas y rúbrica (con Claude)
 * 3. Muestra todo en tabs navegables
 *
 * La expansión se cachea en la base de datos, así que solo se genera una vez.
 */
import { useState, useEffect } from "react";
import type { STEMProject, ProjectDetail } from "../types";
import { fetchProjectsByIds, expandProject } from "../api";
import SessionTimeline from "./SessionTimeline";
import TeacherGuideView from "./TeacherGuideView";
import WorksheetView from "./WorksheetView";
import RubricView from "./RubricView";

type DetailTab = "sesiones" | "guia" | "fichas" | "evaluacion";

interface Props {
  projectId: string;
  onBack: () => void;
}

export default function ProjectDetailView({ projectId, onBack }: Props) {
  const [project, setProject] = useState<STEMProject | null>(null);
  const [detail, setDetail] = useState<ProjectDetail | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("sesiones");
  const [loading, setLoading] = useState(true);
  const [expanding, setExpanding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar el proyecto
  useEffect(() => {
    setLoading(true);
    fetchProjectsByIds([projectId])
      .then((projects) => {
        if (projects.length > 0) {
          setProject(projects[0]);
        } else {
          setError("Proyecto no encontrado");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  // Cuando el proyecto carga, expandirlo (generar planificación)
  useEffect(() => {
    if (!project) return;

    setExpanding(true);
    expandProject(projectId)
      .then(setDetail)
      .catch((err) => setError(err.message))
      .finally(() => setExpanding(false));
  }, [project, projectId]);

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner" />
        <p>Cargando proyecto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-error">
        <p>❌ {error}</p>
        <button className="btn-secondary" onClick={onBack}>
          ← Volver
        </button>
      </div>
    );
  }

  if (!project) return null;

  const tabs: { id: DetailTab; label: string; icon: string }[] = [
    { id: "sesiones", label: "Sesiones", icon: "📅" },
    { id: "guia", label: "Guía Docente", icon: "👩‍🏫" },
    { id: "fichas", label: "Fichas Alumno", icon: "📝" },
    { id: "evaluacion", label: "Evaluación", icon: "✅" },
  ];

  return (
    <div className="project-detail">
      {/* Cabecera del proyecto */}
      <div className="detail-header">
        <button className="btn-back" onClick={onBack}>
          ← Mis Proyectos
        </button>
        <h2 className="detail-title">{project.title}</h2>
        <div className="detail-meta">
          {project.duration && (
            <span className="tag tag-type">{project.duration}</span>
          )}
          <span className="tag tag-stem">
            {project.level?.replace(/_/g, " ")}
          </span>
          {project.stem_areas?.map((area) => (
            <span key={area} className="tag tag-stem">
              {area.replace(/_/g, " ")}
            </span>
          ))}
        </div>
        {project.local_connection && (
          <p className="detail-connection">{project.local_connection}</p>
        )}
      </div>

      {/* Estado de carga de la expansión */}
      {expanding && (
        <div className="detail-expanding">
          <div className="spinner" />
          <div>
            <p className="expanding-title">Generando planificación completa...</p>
            <p className="expanding-hint">
              Claude está creando sesiones, guía docente, fichas de trabajo y
              rúbrica de evaluación. Esto toma 20-40 segundos.
            </p>
          </div>
        </div>
      )}

      {/* Tabs de navegación */}
      {detail && (
        <>
          <div className="detail-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`detail-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenido de cada tab */}
          <div className="detail-content">
            {activeTab === "sesiones" && detail.sessions && (
              <SessionTimeline sessions={detail.sessions} />
            )}
            {activeTab === "guia" && detail.teacher_guide && (
              <TeacherGuideView guide={detail.teacher_guide} />
            )}
            {activeTab === "fichas" && detail.worksheets && (
              <WorksheetView worksheets={detail.worksheets} />
            )}
            {activeTab === "evaluacion" && detail.rubric && (
              <RubricView rubric={detail.rubric} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
