/**
 * TeacherGuideView.tsx — Guía para el docente
 *
 * Muestra las secciones de la guía: qué preparar, preguntas clave,
 * adaptaciones para distintos ritmos, notas de seguridad y
 * consejos de evaluación.
 */
import type { TeacherGuide } from "../types";

interface Props {
  guide: TeacherGuide;
}

export default function TeacherGuideView({ guide }: Props) {
  const sections = [
    {
      title: "📦 Preparación previa",
      items: guide.preparation,
      description: "Lo que necesitas tener listo antes de empezar",
    },
    {
      title: "❓ Preguntas clave",
      items: guide.key_questions,
      description: "Preguntas para guiar la reflexión de los estudiantes",
    },
    {
      title: "🔀 Diferenciación",
      items: guide.differentiation,
      description: "Adaptaciones para distintos ritmos de aprendizaje",
    },
    {
      title: "⚠️ Seguridad en terreno",
      items: guide.safety_notes,
      description: "Precauciones para las actividades al aire libre",
    },
    {
      title: "📊 Consejos de evaluación",
      items: guide.assessment_tips,
      description: "Cómo evaluar el progreso durante el proyecto",
    },
  ];

  return (
    <div className="teacher-guide">
      <h3 className="guide-title">Guía para el Docente</h3>
      <p className="guide-intro">
        Esta guía te ayuda a preparar y ejecutar el proyecto paso a paso.
        No necesitas ser especialista en ciencias — las instrucciones son
        claras y concretas.
      </p>

      <div className="guide-sections">
        {sections.map((section) => (
          <div key={section.title} className="guide-section">
            <h4>{section.title}</h4>
            <p className="guide-section-desc">{section.description}</p>
            <ul>
              {section.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
