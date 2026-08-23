-- ============================================================
-- Script: Códigos de Acceso para Escuelas Rurales
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Añadir columna access_code a schools si no existe
ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS access_code TEXT;

-- 2. Poblar códigos por defecto con formato ESC-[RBD] si están vacíos
UPDATE public.schools
SET access_code = 'ESC-' || rbd
WHERE access_code IS NULL;

-- 3. Crear índice para búsquedas por código o RBD
CREATE INDEX IF NOT EXISTS idx_schools_access_code ON public.schools (access_code);
CREATE INDEX IF NOT EXISTS idx_schools_rbd ON public.schools (rbd);
