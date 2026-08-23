-- ============================================================
-- Script: Claves Secretas Institucionales para Docentes
-- Ejecutar en Supabase -> SQL Editor
-- ============================================================

-- 1. Añadir columnas de códigos diferenciados por rol a la tabla schools
ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS teacher_access_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS student_access_code TEXT;

-- 2. Función generadora de PINs seguros para docentes y alumnos
CREATE OR REPLACE FUNCTION public.generate_school_pins()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  r RECORD;
  v_commune_prefix TEXT;
  v_random_hash TEXT;
  v_teacher_pin TEXT;
  v_student_pin TEXT;
BEGIN
  FOR r IN SELECT id, rbd, commune FROM public.schools LOOP
    -- Prefijo de comuna (3 letras)
    v_commune_prefix := UPPER(SUBSTRING(REGEXP_REPLACE(r.commune, '[^a-zA-Z]', '', 'g'), 1, 3));
    IF LENGTH(v_commune_prefix) < 3 THEN
      v_commune_prefix := 'ESC';
    END IF;

    -- Hash aleatorio determinista de 4 caracteres
    v_random_hash := UPPER(SUBSTRING(MD5(r.id::text || r.rbd::text || 'secret_teacher_salt_2026'), 1, 4));
    
    -- PIN Secreto de Docente: Ej. DOC-LON-A94F
    v_teacher_pin := 'DOC-' || v_commune_prefix || '-' || v_random_hash;
    
    -- Código de Alumno: Ej. ALU-4205
    v_student_pin := 'ALU-' || r.rbd;

    UPDATE public.schools
    SET 
      teacher_access_code = COALESCE(teacher_access_code, v_teacher_pin),
      student_access_code = COALESCE(student_access_code, v_student_pin)
    WHERE id = r.id;
  END LOOP;
END;
$$;

-- Ejecutar la generación inicial de PINs
SELECT public.generate_school_pins();

-- 3. Función RPC segura para validar códigos sin exponer la lista completa de PINs
CREATE OR REPLACE FUNCTION public.verify_school_code(p_code TEXT, p_role TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code TEXT := UPPER(TRIM(p_code));
  v_school RECORD;
  v_share RECORD;
BEGIN
  IF v_code IS NULL OR v_code = '' THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Código vacío');
  END IF;

  -- ── CASO A: Validación para rol 'profesor' ──
  -- Solo se acepta el PIN Secreto de Docente (teacher_access_code)
  IF p_role = 'profesor' THEN
    -- Si el usuario intentó ingresar solo el RBD numérico, dar aviso pedagógico
    IF EXISTS (SELECT 1 FROM public.schools WHERE rbd::text = v_code) THEN
      RETURN jsonb_build_object(
        'valid', false,
        'error', 'El RBD es público. Ingresa el PIN secreto de docente (formato DOC-XXX-XXXX) entregado a tu establecimiento.'
      );
    END IF;

    SELECT id, rbd, name, commune INTO v_school
    FROM public.schools
    WHERE UPPER(teacher_access_code) = v_code;

    IF FOUND THEN
      RETURN jsonb_build_object(
        'valid', true,
        'type', 'school_teacher',
        'school', jsonb_build_object(
          'id', v_school.id,
          'rbd', v_school.rbd,
          'name', v_school.name,
          'commune', v_school.commune
        )
      );
    ELSE
      RETURN jsonb_build_object(
        'valid', false,
        'error', 'PIN de docente no válido o no registrado para ninguna escuela.'
      );
    END IF;

  -- ── CASO B: Validación para rol 'estudiante' ──
  ELSE
    -- 1. Verificar si es código de alumno institucional (student_access_code o ALU-[RBD] o RBD)
    SELECT id, rbd, name, commune INTO v_school
    FROM public.schools
    WHERE UPPER(student_access_code) = v_code
       OR UPPER(access_code) = v_code
       OR rbd::text = v_code;

    IF FOUND THEN
      RETURN jsonb_build_object(
        'valid', true,
        'type', 'school_student',
        'school', jsonb_build_object(
          'id', v_school.id,
          'rbd', v_school.rbd,
          'name', v_school.name,
          'commune', v_school.commune
        )
      );
    END IF;

    -- 2. Verificar si es un código de proyecto de clase (project_share_codes)
    SELECT psc.id, psc.code, psc.school_id, sp.title INTO v_share
    FROM public.project_share_codes psc
    LEFT JOIN public.stem_projects sp ON sp.id = psc.project_id
    WHERE UPPER(psc.code) = v_code AND psc.active = true;

    IF FOUND THEN
      SELECT id, rbd, name, commune INTO v_school
      FROM public.schools
      WHERE id = v_share.school_id;

      RETURN jsonb_build_object(
        'valid', true,
        'type', 'project_share',
        'project', jsonb_build_object(
          'id', v_share.id,
          'code', v_share.code,
          'title', COALESCE(v_share.title, 'Proyecto STEM')
        ),
        'school', CASE WHEN v_school.id IS NOT NULL THEN jsonb_build_object(
          'id', v_school.id,
          'rbd', v_school.rbd,
          'name', v_school.name,
          'commune', v_school.commune
        ) ELSE NULL END
      );
    END IF;

    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Código no válido. Ingresa el código de tu escuela o el código de proyecto de tu profesor.'
    );
  END IF;
END;
$$;
