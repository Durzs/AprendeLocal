/**
 * ProgressDashboard.tsx — Dashboard de progreso de estudiantes (vista profesor)
 *
 * Muestra una tabla con el progreso de cada estudiante inscrito en el proyecto:
 * - Nombre del estudiante
 * - Barra de progreso de actividades
 * - Cantidad de notas de campo
 * - Puntajes de quiz
 */
import { useState, useEffect } from "react";
import type { StudentProgressSummary } from "../types";
import { fetchStudentProgress } from "../api";

interface Props {
  projectId: string;
}

export default function ProgressDashboard({ projectId }: Props) {
  const [students, setStudents] = useState<StudentProgressSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentProgress(projectId)
      .then(setStudents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="progress-dashboard">
        <p className="pd-loading">Cargando progreso de estudiantes...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="progress-dashboard">
        <div className="pd-empty">
          <div className="pd-empty-icon">👥</div>
          <h3>Sin estudiantes inscritos</h3>
          <p>
            Comparte el código del proyecto con tus estudiantes para que se
            inscriban y puedas ver su progreso aquí.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-dashboard">
      <h3 className="pd-title">
        Progreso de Estudiantes ({students.length})
      </h3>

      <div className="pd-table-wrapper">
        <table className="pd-table">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Progreso</th>
              <th>Notas</th>
              <th>Quiz</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.enrollment_id}>
                <td className="pd-student-name">{s.student_name}</td>
                <td>
                  <div className="pd-progress-cell">
                    <div className="pd-mini-bar">
                      <div
                        className="pd-mini-fill"
                        style={{ width: `${s.completion_pct}%` }}
                      />
                    </div>
                    <span className="pd-pct">
                      {s.completed_activities}/{s.total_activities} (
                      {s.completion_pct}%)
                    </span>
                  </div>
                </td>
                <td className="pd-center">{s.field_notes_count}</td>
                <td className="pd-center">
                  {s.quiz_scores.length > 0
                    ? s.quiz_scores
                        .map((sc) => `${Math.round(sc * 100)}%`)
                        .join(", ")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
