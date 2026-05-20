/**
 * StudentDashboard.tsx — Panel principal del estudiante
 *
 * Flujo:
 * 1. Si no tiene nombre → pedir nombre
 * 2. Si tiene pendingCode → inscribirse automáticamente
 * 3. Mostrar proyectos inscritos + campo para ingresar código
 * 4. Al seleccionar un proyecto → StudentProjectView
 */
import { useState, useEffect } from "react";
import type { StudentEnrollment } from "../types";
import {
  getStudentId,
  getStudentName,
  setStudentName as saveStudentName,
} from "../utils/studentStorage";
import {
  registerStudent,
  enrollStudent,
  fetchStudentProjects,
  lookupShareCode,
} from "../api";
import StudentProjectView from "./StudentProjectView";

interface Props {
  pendingCode: string | null;
  onCodeUsed: () => void;
  onBack: () => void;
}

export default function StudentDashboard({
  pendingCode,
  onCodeUsed,
  onBack,
}: Props) {
  const [name, setName] = useState(getStudentName() || "");
  const [registered, setRegistered] = useState(!!getStudentName());
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [codeInput, setCodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeEnrollment, setActiveEnrollment] =
    useState<StudentEnrollment | null>(null);

  const studentId = getStudentId();

  // Al registrarse, cargar proyectos
  useEffect(() => {
    if (registered) {
      loadProjects();
    }
  }, [registered]);

  // Si hay pendingCode, intentar inscribirse tras registro
  useEffect(() => {
    if (registered && pendingCode) {
      handleEnrollWithCode(pendingCode);
      onCodeUsed();
    }
  }, [registered, pendingCode]);

  async function loadProjects() {
    try {
      const list = await fetchStudentProjects(studentId);
      setEnrollments(list);
    } catch {
      // Sin proyectos aún
    }
  }

  async function handleRegister() {
    if (name.trim().length < 2) return;
    setLoading(true);
    setError(null);
    try {
      saveStudentName(name.trim());
      await registerStudent(studentId, name.trim());
      setRegistered(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  }

  async function handleEnrollWithCode(code: string) {
    setLoading(true);
    setError(null);
    try {
      // Verificar que el código existe
      await lookupShareCode(code);
      // Inscribirse
      await enrollStudent(studentId, code);
      // Recargar proyectos
      await loadProjects();
      setCodeInput("");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Código no válido"
      );
    } finally {
      setLoading(false);
    }
  }

  // Si está viendo un proyecto, mostrar esa vista
  if (activeEnrollment) {
    return (
      <StudentProjectView
        enrollment={activeEnrollment}
        onBack={() => {
          setActiveEnrollment(null);
          loadProjects();
        }}
      />
    );
  }

  // Paso 1: Pedir nombre si no está registrado
  if (!registered) {
    return (
      <div className="student-dashboard">
        <div className="student-register">
          <div className="student-register-icon">🧑‍🔬</div>
          <h1>Hola, Estudiante</h1>
          <p>Ingresa tu nombre para comenzar</p>
          <div className="student-register-form">
            <input
              type="text"
              placeholder="Tu nombre..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              className="student-name-input"
              autoFocus
            />
            <button
              className="btn-primary"
              onClick={handleRegister}
              disabled={name.trim().length < 2 || loading}
            >
              {loading ? "Registrando..." : "Comenzar"}
            </button>
          </div>
          {error && <p className="student-error">{error}</p>}
          <button className="back-to-role" onClick={onBack}>
            ← Cambiar rol
          </button>
        </div>
      </div>
    );
  }

  // Paso 2: Dashboard principal
  return (
    <div className="student-dashboard">
      <div className="student-topbar">
        <div className="student-identity">
          <span className="student-avatar">🧑‍🔬</span>
          <div>
            <h2>Hola, {getStudentName()}</h2>
            <span className="student-role-label">Estudiante</span>
          </div>
        </div>
        <button className="btn-change-school" onClick={onBack}>
          Cambiar rol
        </button>
      </div>

      <div className="student-content">
        {/* Ingresar código */}
        <div className="student-code-section">
          <h3>Unirse a un proyecto</h3>
          <p>Ingresa el código que te dio tu profesor/a</p>
          <div className="student-code-row">
            <input
              type="text"
              placeholder="Ej: ABC123"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
              onKeyDown={(e) =>
                e.key === "Enter" && handleEnrollWithCode(codeInput)
              }
              className="student-code-input"
              maxLength={6}
            />
            <button
              className="btn-primary"
              onClick={() => handleEnrollWithCode(codeInput)}
              disabled={codeInput.trim().length < 4 || loading}
            >
              {loading ? "..." : "Unirse"}
            </button>
          </div>
          {error && <p className="student-error">{error}</p>}
        </div>

        {/* Lista de proyectos inscritos */}
        <div className="student-projects-section">
          <h3>Mis Proyectos</h3>
          {enrollments.length === 0 ? (
            <div className="student-empty">
              <div className="student-empty-icon">📚</div>
              <p>
                Aún no estás inscrito en ningún proyecto. Pide un código a tu
                profesor/a para comenzar.
              </p>
            </div>
          ) : (
            <div className="student-project-list">
              {enrollments.map((en) => (
                <button
                  key={en.id}
                  className="student-project-card"
                  onClick={() => setActiveEnrollment(en)}
                >
                  <div className="spc-icon">📋</div>
                  <div className="spc-info">
                    <h4>{en.project_title || "Proyecto"}</h4>
                    {en.school_name && (
                      <span className="spc-school">{en.school_name}</span>
                    )}
                  </div>
                  <div className="spc-arrow">→</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
