import { useState, useEffect } from "react";
import type { CurriculumObjective, CurriculumLevel } from "../types";
import { fetchCurriculumLevels, fetchCurriculum } from "../api";

const LEVEL_LABELS: Record<string, string> = {
  "5to_basico": "5to Básico",
  "6to_basico": "6to Básico",
  "7mo_basico": "7mo Básico",
  "8vo_basico": "8vo Básico",
  "1ro_medio": "1ro Medio",
  "2do_medio": "2do Medio",
};

const AXIS_LABELS: Record<string, string> = {
  ciencias_vida: "Ciencias de la Vida",
  ciencias_fisicas: "Ciencias Físicas y Químicas",
  ciencias_tierra: "Ciencias de la Tierra y el Universo",
  biologia: "Biología",
  fisica: "Física",
  quimica: "Química",
};

const AXIS_EMOJI: Record<string, string> = {
  ciencias_vida: "🧬",
  ciencias_fisicas: "⚡",
  ciencias_tierra: "🌍",
  biologia: "🧬",
  fisica: "⚡",
  quimica: "🧪",
};

interface Props {
  onSelectObjective: (code: string) => void;
}

export default function CurriculumView({ onSelectObjective }: Props) {
  const [levels, setLevels] = useState<CurriculumLevel[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [objectives, setObjectives] = useState<CurriculumObjective[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar niveles al inicio
  useEffect(() => {
    fetchCurriculumLevels().then(setLevels).catch(console.error);
  }, []);

  // Cargar OA cuando se selecciona un nivel
  useEffect(() => {
    if (!selectedLevel) {
      setObjectives([]);
      return;
    }
    setLoading(true);
    fetchCurriculum({ level: selectedLevel, subject: "ciencias_naturales" })
      .then(setObjectives)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedLevel]);

  // Agrupar OA por eje
  const groupedByAxis = objectives.reduce<Record<string, CurriculumObjective[]>>(
    (acc, oa) => {
      const axis = oa.axis;
      if (!acc[axis]) acc[axis] = [];
      acc[axis].push(oa);
      return acc;
    },
    {}
  );

  return (
    <div className="curriculum-view">
      <div className="curriculum-header">
        <h2>📚 Buscar por Currículo</h2>
        <p className="curriculum-subtitle">
          Selecciona tu nivel y encuentra proyectos STEM alineados con los
          Objetivos de Aprendizaje del MINEDUC.
        </p>
      </div>

      {/* Selector de nivel */}
      <div className="level-grid">
        {levels.map((l) => (
          <button
            key={l.level}
            className={`level-card ${selectedLevel === l.level ? "active" : ""}`}
            onClick={() =>
              setSelectedLevel(selectedLevel === l.level ? null : l.level)
            }
          >
            <span className="level-name">
              {LEVEL_LABELS[l.level] || l.level}
            </span>
            <span className="level-count">{l.total_oa} OA</span>
          </button>
        ))}
      </div>

      {/* Lista de OA agrupados por eje */}
      {loading && <p className="curriculum-loading">Cargando objetivos...</p>}

      {!loading && selectedLevel && objectives.length === 0 && (
        <p className="curriculum-empty">No se encontraron objetivos para este nivel.</p>
      )}

      {Object.entries(groupedByAxis).map(([axis, oas]) => (
        <div key={axis} className="axis-group">
          <h3 className="axis-title">
            {AXIS_EMOJI[axis] || "📖"} {AXIS_LABELS[axis] || axis}
          </h3>
          <div className="oa-list">
            {oas.map((oa) => (
              <button
                key={oa.code}
                className="oa-card"
                onClick={() => onSelectObjective(oa.code)}
              >
                <div className="oa-card-top">
                  <span className="oa-code">OA {oa.oa_number}</span>
                  {oa.project_count > 0 && (
                    <span className="oa-badge">{oa.project_count} proyecto{oa.project_count > 1 ? "s" : ""}</span>
                  )}
                </div>
                <p className="oa-description">{oa.description}</p>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
