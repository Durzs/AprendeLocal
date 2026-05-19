/**
 * RubricView.tsx — Rúbrica de evaluación
 *
 * Muestra los criterios de evaluación como una tabla/grid.
 * Cada criterio tiene 4 niveles: Excelente, Bueno, Suficiente, Por lograr.
 * El docente puede usar esto para evaluar el trabajo de sus estudiantes.
 */
import type { EvaluationRubric } from "../types";

interface Props {
  rubric: EvaluationRubric;
}

export default function RubricView({ rubric }: Props) {
  if (!rubric.criteria || rubric.criteria.length === 0) {
    return <p className="empty-text">No hay rúbrica disponible.</p>;
  }

  return (
    <div className="rubric-view">
      <h3 className="rubric-title">Rúbrica de Evaluación</h3>
      <p className="rubric-intro">
        Usa esta rúbrica para evaluar el trabajo de tus estudiantes.
        Puntaje máximo: <strong>{rubric.total_points} puntos</strong>.
      </p>

      <div className="rubric-table-wrapper">
        <table className="rubric-table">
          <thead>
            <tr>
              <th className="rubric-criteria-col">Criterio</th>
              {rubric.criteria[0]?.levels.map((level) => (
                <th key={level.label} className="rubric-level-col">
                  <span className="level-label">{level.label}</span>
                  <span className="level-points">{level.points} pts</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rubric.criteria.map((criterion, i) => (
              <tr key={i}>
                <td className="rubric-criteria-name">
                  <strong>{criterion.name}</strong>
                </td>
                {criterion.levels.map((level, j) => (
                  <td key={j} className="rubric-level-cell">
                    {level.description}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
