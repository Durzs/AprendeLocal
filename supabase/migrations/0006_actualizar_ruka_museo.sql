-- ============================================================
-- Migración 0006: Actualizar a Ruka Museo Rukahue
-- ============================================================

UPDATE public.points_of_interest
SET 
  name = 'Rukahue (Ruka Museo)',
  description = 'Espacio cultural comunitario mapuche del Geoparque Kütralkura. Cuenta con ruka tradicional, telares de witral, instrumentos ancestrales y transmisión oral de saberes de la vida comunitaria.',
  heritage_type = 'cultural_mapuche'
WHERE id = '4a78f571-4e1a-49f9-a2f5-1fcd6c324f28'
   OR name ILIKE '%Museo Mapuche de Curacautín%';
