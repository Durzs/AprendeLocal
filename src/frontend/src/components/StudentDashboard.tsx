/**
 * StudentDashboard.tsx — Panel principal del estudiante
 *
 * REFINAMIENTO: Soporte multi-perfil para tablets compartidas.
 * Flujo:
 * 1. Si hay perfiles en el dispositivo → "¿Quién eres?" (selector)
 * 2. Si no hay perfil activo → crear nuevo
 * 3. Si tiene pendingCode → inscribirse automáticamente
 * 4. Mostrar proyectos inscritos + campo para ingresar código
 * 5. Al seleccionar un proyecto → StudentProjectView
 */
import { useState, useEffect } from "react";
import type { StudentEnrollment } from "../types";
import {
  getStudentId,
  getStudentName,
  getAllProfiles,
  getActiveProfile,
  setActiveProfile,
  createProfile,
  logoutActiveProfile,
  removeProfile,
  type StudentProfile,
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
  // Multi-perfil
  const [profiles, setProfiles] = useState<StudentProfile[]>(getAllProfiles());
  const [activeProfile, setActiveProfileState] = useState<StudentProfile | null>(getActiveProfile());
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [showNewProfile, setShowNewProfile] = useState(false);

  const [name, setName] = useState("");
  const [registered, setRegistered] = useState(false);
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [codeInput, setCodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeEnrollment, setActiveEnrollment] =
    useState<StudentEnrollment | null>(null);

  // Al montar, decidir qué pantalla mostrar
  useEffect(() => {
    const active = getActiveProfile();
    const allProfiles = getAllProfiles();

    if (active) {
      // Tiene perfil activo → directo al dashboard
      setActiveProfileState(active);
      setRegistered(true);
    } else if (allProfiles.length > 0) {
      // Hay perfiles pero ninguno activo → "¿Quién eres?"
      setShowProfileSelector(true);
    } else {
      // Sin perfiles → crear nuevo
      setShowNewProfile(true);
    }
  }, []);

  // Al registrarse, cargar proyectos
  useEffect(() => {
    if (registered && activeProfile) {
      loadProjects();
    }
  }, [registered, activeProfile]);

  // Si hay pendingCode, intentar inscribirse tras registro
  useEffect(() => {
    if (registered && pendingCode && activeProfile) {
      handleEnrollWithCode(pendingCode);
      onCodeUsed();
    }
  }, [registered, pendingCode, activeProfile]);

  async function loadProjects() {
    try {
      const list = await fetchStudentProjects(getStudentId());
      setEnrollments(list);
    } catch {
      // Sin proyectos aún — cargar desde cache offline
      const cached = localStorage.getItem(`offline_enrollments_${getStudentId()}`);
      if (cached) {
        try { setEnrollments(JSON.parse(cached)); } catch { /* noop */ }
      }
    }
  }

  // Guardar enrollments en cache local para offline
  useEffect(() => {
    if (enrollments.length > 0) {
      localStorage.setItem(
        `offline_enrollments_${getStudentId()}`,
        JSON.stringify(enrollments)
      );
    }
  }, [enrollments]);

  function handleSelectProfile(profile: StudentProfile) {
    setActiveProfile(profile.id);
    setActiveProfileState(profile);
    setShowProfileSelector(false);
    setRegistered(true);
  }

  function handleStartNewProfile() {
    setShowProfileSelector(false);
    setShowNewProfile(true);
  }

  async function handleRegister() {
    if (name.trim().length < 2) return;
    setLoading(true);
    setError(null);
    try {
      const profile = createProfile(name.trim());
      setActiveProfileState(profile);
      setProfiles(getAllProfiles());
      await registerStudent(profile.id, name.trim());
      setShowNewProfile(false);
      setRegistered(true);
    } catch (err: unknown) {
      // Registrar localmente aunque falle la API (modo offline)
      const profile = getActiveProfile();
      if (profile) {
        setActiveProfileState(profile);
        setProfiles(getAllProfiles());
        setShowNewProfile(false);
        setRegistered(true);
      } else {
        setError(err instanceof Error ? err.message : "Error al registrarse");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSwitchProfile() {
    logoutActiveProfile();
    setActiveProfileState(null);
    setRegistered(false);
    setEnrollments([]);
    setActiveEnrollment(null);
    setProfiles(getAllProfiles());
    setShowProfileSelector(true);
  }

  function handleRemoveProfile(profileId: string) {
    removeProfile(profileId);
    setProfiles(getAllProfiles());
  }

  async function handleEnrollWithCode(code: string) {
    setLoading(true);
    setError(null);
    try {
      await lookupShareCode(code);
      await enrollStudent(getStudentId(), code);
      await loadProjects();
      setCodeInput("");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Codigo no valido"
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

  // ── Pantalla 1: "¿Quién eres?" (selector de perfiles) ──
  if (showProfileSelector) {
    return (
      <div className="student-dashboard">
        <div className="student-register">
          <div className="student-register-icon">📱</div>
          <h1>¿Quien eres?</h1>
          <p>Selecciona tu nombre para continuar</p>

          <div className="profile-selector">
            {profiles.map((profile) => (
              <div key={profile.id} className="profile-option">
                <button
                  className="profile-btn"
                  onClick={() => handleSelectProfile(profile)}
                >
                  <span className="profile-avatar">🧑‍🔬</span>
                  <span className="profile-name">{profile.name}</span>
                </button>
                <button
                  className="profile-remove"
                  onClick={() => handleRemoveProfile(profile.id)}
                  title="Eliminar perfil"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button className="btn-new-profile" onClick={handleStartNewProfile}>
            + Soy alguien nuevo
          </button>

          <button className="back-to-role" onClick={onBack}>
            ← Cambiar rol
          </button>
        </div>
      </div>
    );
  }

  // ── Pantalla 2: Crear nuevo perfil ──
  if (showNewProfile || !registered) {
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
          {profiles.length > 0 && (
            <button
              className="btn-secondary back-to-profiles"
              onClick={() => {
                setShowNewProfile(false);
                setShowProfileSelector(true);
              }}
            >
              ← Volver a perfiles
            </button>
          )}
          <button className="back-to-role" onClick={onBack}>
            ← Cambiar rol
          </button>
        </div>
      </div>
    );
  }

  // ── Pantalla 3: Dashboard principal ──
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
        <div className="student-topbar-actions">
          <button className="btn-switch-profile" onClick={handleSwitchProfile}>
            👤 Cambiar perfil
          </button>
          <button className="btn-change-school" onClick={onBack}>
            Cambiar rol
          </button>
        </div>
      </div>

      <div className="student-content">
        {/* Ingresar código */}
        <div className="student-code-section">
          <h3>Unirse a un proyecto</h3>
          <p>Ingresa el codigo que te dio tu profesor/a</p>
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
                Aun no estas inscrito en ningun proyecto. Pide un codigo a tu
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
