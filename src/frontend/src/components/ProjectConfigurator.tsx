import { useState, useEffect } from "react";
import type { CurriculumObjective, CurriculumLevel } from "../types";
import { fetchCurriculumLevels, fetchCurriculum } from "../api";

export interface ProjectSpecs {
  pointId: string;
  pointName: string;
  level: string;
  subject: string;
  oaCodes: string[];
  oaDescriptions: string[];
  duration: string;
}

interface Props {
  pointId: string;
  pointName: string;
  onGenerate: (specs: ProjectSpecs) => void;
  onCancel: () => void;
}

const DURATION_OPTIONS = [
  { value: "1_semana", label: "1 semana (2-3 sesiones)" },
  { value: "2_semanas", label: "2 semanas (4-5 sesiones)" },
  { value: "4_semanas", label: "4 semanas (8 sesiones)" },
  { value: "8_semanas", label: "8 semanas (proyecto semestral)" },
];

const LEVEL_LABELS: Record<string, string> = {
  "5to_basico": "5to Básico",
  "6to_basico": "6to Básico",
  "7mo_basico": "7mo Básico",
  "8vo_basico": "8vo Básico",
};

const AXIS_LABELS: Record<string, string> = {
  ciencias_vida: "Ciencias de la Vida",
  ciencias_fisicas: "Ciencias Físicas y Químicas",
  ciencias_tierra: "Ciencias de la Tierra y el Universo",
};

export default function ProjectConfigurator({
  pointId,
  pointName,
  onGenerate,
  onCancel,
}: Props) {
  const [levels, setLevels] = useState<CurriculumLevel[]>([]);
  const [objectives, setObjectives] = useState<CurriculumObjective[]>([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedOAs, setSelectedOAs] = useState<string[]>([]);
  const [duration, setDuration] = useState("2_semanas");
  const [loadingOA, setLoadingOA] = useState(false);

  // Cargar niveles
  useEffect(() => {
    fetchCurriculumLevels().then(setLevels).catch(console.error);
  }, []);

  // Cargar OA cuando cambia el nivel
  useEffect(() => {
    if (!selectedLevel) {
      setObjectives([]);
      setSelectedOAs([]);
      return;
    }
    setLoadingOA(true);
    setSelectedOAs([]);
    fetchCurriculum({ level: selectedLevel, subject: "ciencias_naturales" })
      .then(setObjectives)
      .catch(console.error)
      .finally(() => setLoadingOA(false));
  }, [selectedLevel]);

  const toggleOA = (code: string) => {
    setSelectedOAs((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : prev.length < 3
        ? [...prev, code]
        : prev
    );
  };

  const canGenerate = selectedLevel && selectedOAs.length > 0 && duration;

  const handleGenerate = () => {
    if (!canGenerate) return;
    const selectedDescriptions = selectedOAs.map((code) => {
      const oa = objectives.find((o) => o.code === code);
      return oa ? `OA ${oa.oa_number}: ${oa.description}` : code;
    });

    onGenerate({
      pointId,
      pointName,
      level: selectedLevel,
      subject: "ciencias_naturales",
      oaCodes: selectedOAs,
      oaDescriptions: selectedDescriptions,
      duration,
    });
  };

  // Agrupar OA por eje
  const grouped = objectives.reduce<Record<string, CurriculumObjective[]>>(
    (acc, oa) => {
      if (!acc[oa.axis]) acc[oa.axis] = [];
      acc[oa.axis].push(oa);
      return acc;
    },
    {}
  );

  return (
    <div className="configurator">
      <div className="configurator-header">
        <h3>Configurar proyecto STEM</h3>
        <p className="configurator-context">
          Recurso: <strong>{pointName}</strong>
        </p>
      </div>

      {/* Paso 1: Nivel/Curso */}
      <div className="config-step">
        <label className="config-label">
          <span className="step-number">1</span> ¿Qué curso?
        </label>
        <div className="config-chips">
          {levels.map((l) => (
            <button
              key={l.level}
              className={`config-chip ${
                selectedLevel === l.level ? "active" : ""
              }`}
              onClick={() => setSelectedLevel(l.level)}
            >
              {LEVEL_LABELS[l.level] || l.level}
            </button>
          ))}
        </div>
      </div>

      {/* Paso 2: OA */}
      {selectedLevel && (
        <div className="config-step">
          <label className="config-label">
            <span className="step-number">2</span> ¿Qué objetivo(s) de
            aprendizaje? <span className="config-hint">(máx. 3)</span>
          </label>

          {loadingOA && (
            <p className="config-loading">Cargando objetivos...</p>
          )}

          <div className="oa-selector">
            {Object.entries(grouped).map(([axis, oas]) => (
              <div key={axis} className="oa-axis-group">
                <h4 className="oa-axis-title">
                  {AXIS_LABELS[axis] || axis}
                </h4>
                {oas.map((oa) => {
                  const isSelected = selectedOAs.includes(oa.code);
                  const isDisabled =
                    !isSelected && selectedOAs.length >= 3;
                  return (
                    <button
                      key={oa.code}
                      className={`oa-option ${isSelected ? "selected" : ""} ${
                        isDisabled ? "disabled" : ""
                      }`}
                      onClick={() => !isDisabled && toggleOA(oa.code)}
                      disabled={isDisabled}
                    >
                      <span className="oa-option-check">
                        {isSelected ? "✓" : "○"}
                      </span>
                      <span className="oa-option-code">
                        OA {oa.oa_number}
                      </span>
                      <span className="oa-option-desc">{oa.description}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paso 3: Duración */}
      {selectedOAs.length > 0 && (
        <div className="config-step">
          <label className="config-label">
            <span className="step-number">3</span> ¿Cuánto tiempo?
          </label>
          <div className="config-chips">
            {DURATION_OPTIONS.map((d) => (
              <button
                key={d.value}
                className={`config-chip ${
                  duration === d.value ? "active" : ""
                }`}
                onClick={() => setDuration(d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="config-actions">
        <button className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
        <button
          className="btn-generate-final"
          disabled={!canGenerate}
          onClick={handleGenerate}
        >
          ✨ Generar 3 propuestas
        </button>
      </div>
    </div>
  );
}
