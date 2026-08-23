-- ============================================================
-- Migración / Script: Otorgar Rol de Administrador
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- 1. Función para convertir cualquier cuenta en Administrador por correo
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
    RETURN 'Usuario con correo ' || p_email || ' no encontrado en auth.users.';
  END IF;

  INSERT INTO public.profiles (id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin';

  -- Actualizar también los metadatos de auth para consistencia
  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
  WHERE id = v_user_id;

  RETURN 'Cuenta ' || p_email || ' (ID: ' || v_user_id || ') promovida a Administrador exitosamente.';
END;
$$;

-- 2. Asignar rol de Administrador a tu cuenta durzs@uc.cl
SELECT public.make_user_admin('durzs@uc.cl');
