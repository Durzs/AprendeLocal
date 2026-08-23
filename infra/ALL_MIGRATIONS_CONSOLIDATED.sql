-- ==============================================================================
-- APRENDELOCAL: SCRIPT CONSOLIDADO DE MIGRACIONES Y SEGURIDAD
-- Ejecutar TODO este script en: Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. EXTENDER TABLA PROFILES CON ROLES Y ESCUELA
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'profesor',
  ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS school_ids UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS subject TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON public.profiles(school_id);

-- 2. ACTUALIZAR TRIGGER DE REGISTRO AUTOMÁTICO DE USUARIOS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
  v_school_id UUID;
  v_subject TEXT;
BEGIN
  v_role := COALESCE(new.raw_user_meta_data->>'role', 'profesor');
  
  IF (new.raw_user_meta_data->>'school_id') IS NOT NULL AND (new.raw_user_meta_data->>'school_id') != '' THEN
    BEGIN
      v_school_id := (new.raw_user_meta_data->>'school_id')::UUID;
    EXCEPTION WHEN OTHERS THEN
      v_school_id := NULL;
    END;
  ELSE
    v_school_id := NULL;
  END IF;

  v_subject := new.raw_user_meta_data->>'subject';

  INSERT INTO public.profiles (id, nome, idade, role, school_id, subject)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nome', new.email),
    (new.raw_user_meta_data->>'idade')::integer,
    v_role,
    v_school_id,
    v_subject
  )
  ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    idade = EXCLUDED.idade,
    role = EXCLUDED.role,
    school_id = EXCLUDED.school_id,
    subject = EXCLUDED.subject;

  RETURN new;
END;
$$;

-- 3. CÓDIGOS Y PINS DE ACCESO EN TABLA SCHOOLS
ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS teacher_access_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS student_access_code TEXT,
  ADD COLUMN IF NOT EXISTS access_code TEXT;

-- Función generadora de PINs seguros para docentes y alumnos
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
    v_commune_prefix := UPPER(SUBSTRING(REGEXP_REPLACE(r.commune, '[^a-zA-Z]', '', 'g'), 1, 3));
    IF LENGTH(v_commune_prefix) < 3 THEN
      v_commune_prefix := 'ESC';
    END IF;

    -- Hash aleatorio determinista
    v_random_hash := UPPER(SUBSTRING(MD5(r.id::text || r.rbd::text || 'secret_teacher_salt_2026'), 1, 4));
    
    -- PIN Secreto de Docente: Ej. DOC-LON-A94F
    v_teacher_pin := 'DOC-' || v_commune_prefix || '-' || v_random_hash;
    
    -- Código de Alumno: Ej. ALU-4205
    v_student_pin := 'ALU-' || r.rbd;

    UPDATE public.schools
    SET 
      teacher_access_code = COALESCE(teacher_access_code, v_teacher_pin),
      student_access_code = COALESCE(student_access_code, v_student_pin),
      access_code = COALESCE(access_code, 'ESC-' || r.rbd)
    WHERE id = r.id;
  END LOOP;
END;
$$;

SELECT public.generate_school_pins();

CREATE INDEX IF NOT EXISTS idx_schools_teacher_pin ON public.schools(teacher_access_code);
CREATE INDEX IF NOT EXISTS idx_schools_student_code ON public.schools(student_access_code);

-- 4. FUNCIÓN RPC SEGURA PARA VERIFICACIÓN DE CÓDIGOS EN EL BACKEND
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

  -- Para Profesores: Exigir PIN Secreto Institucional
  IF p_role = 'profesor' THEN
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

  -- Para Estudiantes: Código de alumno o código de proyecto del profesor
  ELSE
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

    -- Verificar código de proyecto
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

-- 5. FUNCIÓN Y ASIGNACIÓN DE ROL ADMINISTRADOR A DURZS@UC.CL
CREATE OR REPLACE FUNCTION public.make_user_admin(p_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;
  IF v_user_id IS NULL THEN
    RETURN 'Usuario con correo ' || p_email || ' no encontrado en auth.users (revisa si ya se registró).';
  END IF;

  INSERT INTO public.profiles (id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin';

  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
  WHERE id = v_user_id;

  RETURN 'Cuenta ' || p_email || ' promovida a Administrador exitosamente.';
END;
$$;

-- Intentar promover durzs@uc.cl si ya está en auth.users
SELECT public.make_user_admin('durzs@uc.cl');
