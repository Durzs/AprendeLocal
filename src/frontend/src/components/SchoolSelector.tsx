import { useState, useEffect, useMemo } from "react";
import type { School } from "../types";
import { fetchSchools } from "../api";

interface Props {
  onSelectSchool: (school: School) => void;
  onBack?: () => void; // Volver al selector de rol
}

export default function SchoolSelector({ onSelectSchool, onBack }: Props) {
  const [schools, setSchools] = useState<School[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCommune, setSelectedCommune] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchools()
      .then(setSchools)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Comunas únicas
  const communes = useMemo(
    () => [...new Set(schools.map((s) => s.commune))].sort(),
    [schools]
  );

  // Filtrar escuelas
  const filtered = useMemo(() => {
    let result = schools;
    if (selectedCommune) {
      result = result.filter((s) => s.commune === selectedCommune);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.commune.toLowerCase().includes(q)
      );
    }
    return result;
  }, [schools, selectedCommune, search]);

  if (loading) {
    return (
      <div className="school-selector">
        <p className="school-loading">Cargando escuelas...</p>
      </div>
    );
  }

  return (
    <div className="school-selector">
      {onBack && (
        <button className="back-to-role" onClick={onBack}>
          ← Cambiar rol
        </button>
      )}

      <div className="school-welcome">
        <div className="welcome-icon">🏫</div>
        <h1>Bienvenido a AprendeLocal</h1>
        <p className="welcome-subtitle">
          Proyectos STEM contextualizados para tu escuela en La Araucanía
        </p>
        <p className="welcome-instruction">
          Selecciona tu escuela para descubrir los recursos educativos de tu entorno
        </p>
      </div>

      {/* Buscador */}
      <div className="school-search-bar">
        <input
          type="text"
          placeholder="Buscar escuela por nombre o comuna..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="school-search-input"
        />
      </div>

      {/* Filtro por comuna */}
      <div className="commune-chips">
        <button
          className={`commune-chip ${!selectedCommune ? "active" : ""}`}
          onClick={() => setSelectedCommune(null)}
        >
          Todas ({schools.length})
        </button>
        {communes.map((c) => (
          <button
            key={c}
            className={`commune-chip ${selectedCommune === c ? "active" : ""}`}
            onClick={() =>
              setSelectedCommune(selectedCommune === c ? null : c)
            }
          >
            {c} ({schools.filter((s) => s.commune === c).length})
          </button>
        ))}
      </div>

      {/* Lista de escuelas */}
      <div className="school-list">
        {filtered.map((school) => (
          <button
            key={school.id}
            className="school-card"
            onClick={() => onSelectSchool(school)}
          >
            <div className="school-card-icon">🏫</div>
            <div className="school-card-info">
              <h3>{school.name}</h3>
              <div className="school-card-meta">
                <span className="school-commune-tag">{school.commune}</span>
                {school.student_count && (
                  <span className="school-students">
                    {school.student_count} estudiantes
                  </span>
                )}
              </div>
            </div>
            <div className="school-card-arrow">→</div>
          </button>
        ))}

        {filtered.length === 0 && (
          <p className="school-empty">
            No se encontraron escuelas. Intenta con otro término de búsqueda.
          </p>
        )}
      </div>
    </div>
  );
}
