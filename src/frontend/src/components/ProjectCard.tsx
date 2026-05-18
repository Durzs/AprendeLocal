import { useState } from "react";
import type { STEMProject } from "../types";

interface Props {
  project: STEMProject;
}

export default function ProjectCard({ project }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="project-card">
      <div
        className="project-card-header"
        onClick={() => setExpanded(!expanded)}
      >
        <h4>{project.title}</h4>
        <span className="project-toggle">{expanded ? "▲" : "▼"}</span>
      </div>

      <div className="project-card-meta">
        <span className="tag tag-stem">{project.level?.replace(/_/g, " ")}</span>
        {project.duration && (
          <span className="tag tag-type">{project.duration}</span>
        )}
      </div>

      {project.stem_areas && project.stem_areas.length > 0 && (
        <div className="project-card-areas">
          {project.stem_areas.map((area) => (
            <span key={area} className="tag tag-stem">
              {area.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      )}

      {expanded && (
        <div className="project-card-details">
          {project.local_connection && (
            <div className="project-section">
              <h5>🔗 Conexión local</h5>
              <p>{project.local_connection}</p>
            </div>
          )}

          {project.objectives && project.objectives.length > 0 && (
            <div className="project-section">
              <h5>🎯 Objetivos</h5>
              <ul>
                {project.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
          )}

          {project.materials && project.materials.length > 0 && (
            <div className="project-section">
              <h5>🧰 Materiales</h5>
              <ul>
                {project.materials.map((mat, i) => (
                  <li key={i}>{mat}</li>
                ))}
              </ul>
            </div>
          )}

          {project.steps && project.steps.length > 0 && (
            <div className="project-section">
              <h5>📋 Pasos</h5>
              <ol>
                {project.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {project.expected_outcomes && project.expected_outcomes.length > 0 && (
            <div className="project-section">
              <h5>✅ Resultados esperados</h5>
              <ul>
                {project.expected_outcomes.map((out, i) => (
                  <li key={i}>{out}</li>
                ))}
              </ul>
            </div>
          )}

          {project.curriculum_alignment && project.curriculum_alignment.length > 0 && (
            <div className="project-section">
              <h5>📚 Alineación curricular</h5>
              <ul>
                {project.curriculum_alignment.map((oa, i) => (
                  <li key={i}>{oa}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
