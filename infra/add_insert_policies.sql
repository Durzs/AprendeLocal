-- =============================================
-- Política para permitir insertar proyectos STEM
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- Permitir que la API inserte proyectos generados por Claude
CREATE POLICY "API puede insertar proyectos" ON stem_projects
    FOR INSERT WITH CHECK (true);

-- Verificar que funcionó
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'stem_projects';
