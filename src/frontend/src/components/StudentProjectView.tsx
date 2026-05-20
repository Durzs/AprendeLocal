/**
 * StudentProjectView.tsx — Vista de un proyecto desde la perspectiva del estudiante
 *
 * Tabs: Actividades | Notas de Campo | Quiz
 * - Actividades: checklist interactivo por sesión
 * - Notas de campo: texto libre por sesión
 * - Quiz: evaluación generada por IA
 */
import { useState, useEffect } from "react";
import type {
  StudentEnrollment,
  ProjectDetail,
  ActivityProgress,
  FieldNote,
  QuizQuestion,
  QuizResult,
} from "../types";
import {
  expandProject,
  fetchProgress,
  updateProgress,
  fetchFieldNotes,
  saveFieldNote,
  generateQuiz,
  submitQuiz,
} from "../api";

type StudentTab = "actividades" | "notas" | "quiz";

interface Props {
  enrollment: StudentEnrollment;
  onBack: () => void;
}

export default function StudentProjectView({ enrollment, onBack }: Props) {
  const [detail, setDetail] = useState<ProjectDetail | null>(null);
  const [progress, setProgress] = useState<ActivityProgress[]>([]);
  const [notes, setNotes] = useState<FieldNote[]>([]);
  const [activeTab, setActiveTab] = useState<StudentTab>("actividades");
  const [activeSession, setActiveSession] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Notas de campo
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Quiz
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(
    null
  );
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  useEffect(() => {
    loadProjectData();
  }, [enrollment.project_id]);

  async function loadProjectData() {
    setLoading(true);
    try {
      const [det, prog, fieldNotes] = await Promise.all([
        expandProject(enrollment.project_id),
        fetchProgress(enrollment.id),
        fetchFieldNotes(enrollment.id),
      ]);
      setDetail(det);
      setProgress(prog);
      setNotes(fieldNotes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error cargando proyecto");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActivity(
    sessionNum: number,
    activityIdx: number,
    currentlyDone: boolean
  ) {
    try {
      const updated = await updateProgress(
        enrollment.id,
        sessionNum,
        activityIdx,
        !currentlyDone
      );
      setProgress((prev) => {
        const filtered = prev.filter(
          (p) =>
            !(
              p.session_number === sessionNum &&
              p.activity_index === activityIdx
            )
        );
        return [...filtered, updated];
      });
    } catch {
      // silent fail
    }
  }

  function isActivityDone(sessionNum: number, activityIdx: number): boolean {
    return progress.some(
      (p) =>
        p.session_number === sessionNum &&
        p.activity_index === activityIdx &&
        p.completed
    );
  }

  async function handleSaveNote() {
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      const note = await saveFieldNote(
        enrollment.id,
        activeSession,
        noteText.trim()
      );
      setNotes((prev) => [...prev, note]);
      setNoteText("");
    } catch {
      // silent
    } finally {
      setSavingNote(false);
    }
  }

  async function handleGenerateQuiz() {
    setLoadingQuiz(true);
    setQuizResult(null);
    setQuizAnswers([]);
    try {
      const data = await generateQuiz(enrollment.project_id, activeSession);
      setQuizQuestions(data.questions);
      setQuizAnswers(new Array(data.questions.length).fill(-1));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error generando quiz");
    } finally {
      setLoadingQuiz(false);
    }
  }

  async function handleSubmitQuiz() {
    if (!quizQuestions) return;
    try {
      const result = await submitQuiz(
        enrollment.id,
        activeSession,
        quizQuestions,
        quizAnswers
      );
      setQuizResult(result);
    } catch {
      // silent
    }
  }

  if (loading) {
    return (
      <div className="student-project-loading">
        <div className="spinner" />
        <p>Cargando proyecto...</p>
      </div>
    );
  }

  if (error && !detail) {
    return (
      <div className="student-project-loading">
        <p className="student-error">{error}</p>
        <button className="btn-secondary" onClick={onBack}>
          ← Volver
        </button>
      </div>
    );
  }

  const sessions = detail?.sessions || [];
  const currentSession = sessions.find(
    (s) => s.session_number === activeSession
  );
  const sessionNotes = notes.filter(
    (n) => n.session_number === activeSession
  );

  // Calcular progreso total
  const totalActivities = sessions.reduce(
    (sum, s) => sum + s.activities.length,
    0
  );
  const completedActivities = progress.filter((p) => p.completed).length;
  const pct =
    totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;

  return (
    <div className="student-project-view">
      {/* Header */}
      <div className="spv-header">
        <button className="btn-back" onClick={onBack}>
          ← Mis Proyectos
        </button>
        <h2 className="spv-title">
          {enrollment.project_title || "Proyecto"}
        </h2>
        <div className="spv-progress-bar">
          <div className="spv-progress-fill" style={{ width: `${pct}%` }} />
          <span className="spv-progress-text">
            {completedActivities}/{totalActivities} actividades ({pct}%)
          </span>
        </div>
      </div>

      {/* Session selector */}
      <div className="spv-session-nav">
        {sessions.map((s) => (
          <button
            key={s.session_number}
            className={`spv-session-btn ${
              activeSession === s.session_number ? "active" : ""
            }`}
            onClick={() => setActiveSession(s.session_number)}
          >
            Sesión {s.session_number}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="spv-tabs">
        <button
          className={`spv-tab ${activeTab === "actividades" ? "active" : ""}`}
          onClick={() => setActiveTab("actividades")}
        >
          ✅ Actividades
        </button>
        <button
          className={`spv-tab ${activeTab === "notas" ? "active" : ""}`}
          onClick={() => setActiveTab("notas")}
        >
          📝 Notas de Campo
        </button>
        <button
          className={`spv-tab ${activeTab === "quiz" ? "active" : ""}`}
          onClick={() => setActiveTab("quiz")}
        >
          🧠 Quiz
        </button>
      </div>

      {/* Content */}
      <div className="spv-content">
        {activeTab === "actividades" && currentSession && (
          <div className="spv-activities">
            <h3>{currentSession.title}</h3>
            <p className="spv-objective">{currentSession.objective}</p>
            <div className="spv-checklist">
              {currentSession.activities.map((act, idx) => {
                const done = isActivityDone(activeSession, idx);
                return (
                  <label key={idx} className={`spv-check-item ${done ? "done" : ""}`}>
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() =>
                        handleToggleActivity(activeSession, idx, done)
                      }
                    />
                    <span>{act}</span>
                  </label>
                );
              })}
            </div>
            {currentSession.materials.length > 0 && (
              <div className="spv-materials">
                <h4>Materiales necesarios:</h4>
                <div className="spv-material-tags">
                  {currentSession.materials.map((m, i) => (
                    <span key={i} className="tag tag-material">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "notas" && (
          <div className="spv-notes">
            <h3>Notas de Campo — Sesión {activeSession}</h3>
            <p className="spv-notes-hint">
              Registra tus observaciones de terreno: qué viste, qué mediste, qué
              te llamó la atención.
            </p>

            <div className="spv-note-form">
              <textarea
                placeholder="Escribe tu observación aquí..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="spv-note-textarea"
                rows={4}
              />
              <button
                className="btn-primary"
                onClick={handleSaveNote}
                disabled={!noteText.trim() || savingNote}
              >
                {savingNote ? "Guardando..." : "Guardar nota"}
              </button>
            </div>

            {sessionNotes.length > 0 && (
              <div className="spv-notes-list">
                <h4>Notas guardadas:</h4>
                {sessionNotes.map((note) => (
                  <div key={note.id} className="spv-note-card">
                    <p>{note.note_text}</p>
                    <span className="spv-note-date">
                      {new Date(note.created_at).toLocaleString("es-CL")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "quiz" && (
          <div className="spv-quiz">
            <h3>Quiz — Sesión {activeSession}</h3>

            {!quizQuestions && !quizResult && (
              <div className="spv-quiz-start">
                <p>
                  Pon a prueba lo que aprendiste en esta sesión con un quiz
                  generado por IA.
                </p>
                <button
                  className="btn-primary"
                  onClick={handleGenerateQuiz}
                  disabled={loadingQuiz}
                >
                  {loadingQuiz ? "Generando preguntas..." : "Comenzar Quiz"}
                </button>
              </div>
            )}

            {quizQuestions && !quizResult && (
              <div className="spv-quiz-questions">
                {quizQuestions.map((q, qi) => (
                  <div key={qi} className="spv-quiz-question">
                    <p className="spv-qq-text">
                      {qi + 1}. {q.question}
                    </p>
                    <div className="spv-qq-options">
                      {q.options.map((opt, oi) => (
                        <label
                          key={oi}
                          className={`spv-qq-option ${
                            quizAnswers[qi] === oi ? "selected" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q${qi}`}
                            checked={quizAnswers[qi] === oi}
                            onChange={() =>
                              setQuizAnswers((prev) => {
                                const next = [...prev];
                                next[qi] = oi;
                                return next;
                              })
                            }
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  className="btn-primary spv-quiz-submit"
                  onClick={handleSubmitQuiz}
                  disabled={quizAnswers.some((a) => a === -1)}
                >
                  Enviar respuestas
                </button>
              </div>
            )}

            {quizResult && (
              <div className="spv-quiz-result">
                <div className="spv-quiz-score">
                  <span className="spv-score-number">
                    {Math.round(quizResult.score * 100)}%
                  </span>
                  <span className="spv-score-label">
                    {quizResult.score >= 0.7
                      ? "¡Muy bien!"
                      : quizResult.score >= 0.4
                      ? "Buen intento"
                      : "Sigue practicando"}
                  </span>
                </div>

                {quizResult.questions.map((q, qi) => {
                  const isCorrect =
                    quizResult.answers[qi] === q.correct_index;
                  return (
                    <div
                      key={qi}
                      className={`spv-quiz-review ${
                        isCorrect ? "correct" : "wrong"
                      }`}
                    >
                      <p className="spv-qq-text">
                        {qi + 1}. {q.question}
                      </p>
                      <p className="spv-review-answer">
                        Tu respuesta: {q.options[quizResult.answers[qi]]}
                        {isCorrect ? " ✅" : " ❌"}
                      </p>
                      {!isCorrect && (
                        <p className="spv-review-correct">
                          Respuesta correcta: {q.options[q.correct_index]}
                        </p>
                      )}
                    </div>
                  );
                })}

                <button
                  className="btn-secondary"
                  onClick={() => {
                    setQuizQuestions(null);
                    setQuizResult(null);
                    setQuizAnswers([]);
                  }}
                >
                  Intentar de nuevo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
