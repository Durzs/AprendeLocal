-- ═══════════════════════════════════════════════════════════════
-- Fase 3: Tablas para flujo profesor/estudiante
-- Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ── Códigos compartidos: el profe genera un código para que alumnos se unan ──
CREATE TABLE IF NOT EXISTS project_share_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES stem_projects(id),
  code TEXT UNIQUE NOT NULL,         -- 6 caracteres, ej: "ABC123"
  teacher_id TEXT NOT NULL,           -- UUID del localStorage del profe
  school_id UUID REFERENCES schools(id),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Sesiones de estudiantes (identidad sin auth, como teacherStorage) ──
CREATE TABLE IF NOT EXISTS student_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id TEXT UNIQUE NOT NULL,      -- crypto.randomUUID() del navegador
  display_name TEXT NOT NULL,         -- nombre que el alumno ingresa
  school_id UUID REFERENCES schools(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Inscripciones: vincula un alumno con un proyecto via código ──
CREATE TABLE IF NOT EXISTS student_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES student_sessions(id),
  project_id UUID NOT NULL REFERENCES stem_projects(id),
  share_code_id UUID REFERENCES project_share_codes(id),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, project_id)
);

-- ── Progreso: tracking a nivel de actividad individual ──
CREATE TABLE IF NOT EXISTS student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES student_enrollments(id),
  session_number INTEGER NOT NULL,
  activity_index INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(enrollment_id, session_number, activity_index)
);

-- ── Notas de terreno: observaciones escritas por estudiantes ──
CREATE TABLE IF NOT EXISTS student_field_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES student_enrollments(id),
  session_number INTEGER NOT NULL,
  note_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Resultados de quiz: preguntas y respuestas de evaluación ──
CREATE TABLE IF NOT EXISTS student_quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES student_enrollments(id),
  session_number INTEGER NOT NULL,
  questions JSONB NOT NULL,           -- [{question, options[], correct_index}]
  answers JSONB NOT NULL,             -- [índices seleccionados]
  score INTEGER,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ Políticas RLS (acceso público para MVP sin auth) ═══

ALTER TABLE project_share_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_field_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_quiz_results ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura
CREATE POLICY "Lectura pública share_codes" ON project_share_codes FOR SELECT USING (true);
CREATE POLICY "Lectura pública student_sessions" ON student_sessions FOR SELECT USING (true);
CREATE POLICY "Lectura pública student_enrollments" ON student_enrollments FOR SELECT USING (true);
CREATE POLICY "Lectura pública student_progress" ON student_progress FOR SELECT USING (true);
CREATE POLICY "Lectura pública student_field_notes" ON student_field_notes FOR SELECT USING (true);
CREATE POLICY "Lectura pública student_quiz_results" ON student_quiz_results FOR SELECT USING (true);

-- Políticas de inserción
CREATE POLICY "Inserción pública share_codes" ON project_share_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Inserción pública student_sessions" ON student_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Inserción pública student_enrollments" ON student_enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Inserción pública student_progress" ON student_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Inserción pública student_field_notes" ON student_field_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Inserción pública student_quiz_results" ON student_quiz_results FOR INSERT WITH CHECK (true);

-- Políticas de actualización (para marcar progreso, etc.)
CREATE POLICY "Actualización pública student_sessions" ON student_sessions FOR UPDATE USING (true);
CREATE POLICY "Actualización pública student_progress" ON student_progress FOR UPDATE USING (true);
CREATE POLICY "Actualización pública share_codes" ON project_share_codes FOR UPDATE USING (true);
