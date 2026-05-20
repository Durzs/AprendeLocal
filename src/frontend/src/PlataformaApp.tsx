/**
 * PlataformaApp.tsx — La herramienta STEM de AprendeLocal
 *
 * Antes era App.tsx. Ahora se accede desde la ruta /plataforma.
 * Máquina de estados:
 * ┌─────────────────┐
 * │  Sin rol         │ → RoleSelector
 * ├─────────────────┤
 * │  Profesor        │ → SchoolSelector → SchoolDashboard
 * ├─────────────────┤
 * │  Estudiante      │ → StudentCodeEntry / SchoolSelector → StudentDashboard
 * └─────────────────┘
 */
import { useState, useEffect } from "react";
import RoleSelector from "./components/RoleSelector";
import SchoolSelector from "./components/SchoolSelector";
import SchoolDashboard from "./components/SchoolDashboard";
import StudentDashboard from "./components/StudentDashboard";
import type { School, UserRole } from "./types";
import { getSavedRole, clearRole } from "./utils/studentStorage";
import "./App.css";

export default function PlataformaApp() {
  // ── Estado principal ──
  const [role, setRole] = useState<UserRole | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  // Código compartido ingresado por estudiante (opcional)
  const [pendingCode, setPendingCode] = useState<string | null>(null);

  // Al montar, restaurar rol guardado y leer ?code= de la URL
  useEffect(() => {
    const saved = getSavedRole();
    if (saved) setRole(saved);

    // Si la URL tiene ?code=ABC123, entrar directo como estudiante
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      setRole("estudiante");
      setPendingCode(code.toUpperCase());
      // Limpiar la URL para que no quede visible el código
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Callback cuando se elige rol en el selector
  const handleSelectRole = (selectedRole: UserRole, shareCode?: string) => {
    setRole(selectedRole);
    if (shareCode) setPendingCode(shareCode);
  };

  // Cambiar rol (volver al inicio)
  const handleChangeRole = () => {
    clearRole();
    setRole(null);
    setSchool(null);
    setPendingCode(null);
  };

  // ── Renderizado según estado ──

  // 1. Sin rol → mostrar selector de rol
  if (!role) {
    return <RoleSelector onSelectRole={handleSelectRole} />;
  }

  // 2. Profesor sin escuela → selector de escuela
  if (role === "profesor" && !school) {
    return (
      <SchoolSelector
        onSelectSchool={setSchool}
        onBack={handleChangeRole}
      />
    );
  }

  // 3. Profesor con escuela → dashboard del profesor
  if (role === "profesor" && school) {
    return (
      <SchoolDashboard
        school={school}
        onChangeSchool={() => setSchool(null)}
      />
    );
  }

  // 4. Estudiante → dashboard del estudiante
  if (role === "estudiante") {
    return (
      <StudentDashboard
        pendingCode={pendingCode}
        onCodeUsed={() => setPendingCode(null)}
        onBack={handleChangeRole}
      />
    );
  }

  return null;
}
