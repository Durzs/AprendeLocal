-- ============================================================
-- Migración 0002: Perfiles de Profesor y Asociación de Escuelas
-- ============================================================

-- 1. Añadir columnas a public.profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'profesor',
  ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS school_ids UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS subject TEXT;

-- 2. Índice para acelerar búsquedas por escuela
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON public.profiles (school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);

-- 3. Actualizar función trigger para capturar rol y escuela desde el registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_school_id UUID := NULL;
  v_school_id_text TEXT;
BEGIN
  v_school_id_text := NULLIF(NEW.raw_user_meta_data ->> 'school_id', '');
  IF v_school_id_text IS NOT NULL THEN
    BEGIN
      v_school_id := v_school_id_text::UUID;
    EXCEPTION WHEN OTHERS THEN
      v_school_id := NULL;
    END;
  END IF;

  INSERT INTO public.profiles (
    id,
    nome,
    cep,
    idade,
    role,
    school_id,
    subject
  )
  VALUES (
    NEW.id,
    NULLIF(NEW.raw_user_meta_data ->> 'nome', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'cep', ''),
    NULLIF(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'idade', ''), '\D', '', 'g'), '')::INT,
    COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'role', ''), 'profesor'),
    v_school_id,
    NULLIF(NEW.raw_user_meta_data ->> 'subject', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    cep = EXCLUDED.cep,
    idade = EXCLUDED.idade,
    role = COALESCE(EXCLUDED.role, public.profiles.role),
    school_id = COALESCE(EXCLUDED.school_id, public.profiles.school_id),
    subject = COALESCE(EXCLUDED.subject, public.profiles.subject);

  RETURN NEW;
END;
$$;

-- 4. Re-crear el trigger en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
