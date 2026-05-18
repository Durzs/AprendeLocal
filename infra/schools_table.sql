-- ============================================================
-- Tabla: schools (Escuelas rurales de La Araucanía)
-- Fuente: Directorio oficial MINEDUC + geolocalización
-- ============================================================

-- 1. Crear tabla
CREATE TABLE IF NOT EXISTS schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rbd INTEGER UNIQUE NOT NULL,            -- Rol Base de Datos (identificador MINEDUC)
  name TEXT NOT NULL,
  commune TEXT NOT NULL,
  address TEXT,
  location GEOGRAPHY(POINT, 4326),        -- Coordenadas de la escuela
  dependency TEXT,                          -- Municipal, Particular Subvencionado, SLE
  rural BOOLEAN DEFAULT TRUE,
  levels TEXT[] DEFAULT '{}',              -- Niveles que imparte: {basica, media}
  student_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Índice espacial para búsquedas por cercanía
CREATE INDEX IF NOT EXISTS idx_schools_location ON schools USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_schools_commune ON schools (commune);

-- 3. RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "schools_read_all" ON schools
  FOR SELECT USING (true);

CREATE POLICY "schools_insert_auth" ON schools
  FOR INSERT WITH CHECK (true);

-- 4. Seed: Escuelas rurales reales de La Araucanía (muestra piloto)
-- Comunas zona piloto: Lonquimay, Curacautín, Melipeuco, Vilcún, Cunco, Temuco
INSERT INTO schools (rbd, name, commune, address, location, dependency, rural, levels, student_count) VALUES

-- === LONQUIMAY ===
(4205, 'Escuela Básica Lonquimay', 'Lonquimay', 'Calle O''Higgins 450, Lonquimay',
 ST_MakePoint(-71.2424, -38.4347)::geography, 'Municipal', true, '{basica}', 145),

(4206, 'Escuela Rural Pehuenco', 'Lonquimay', 'Sector Pehuenco s/n, Lonquimay',
 ST_MakePoint(-71.3100, -38.4800)::geography, 'Municipal', true, '{basica}', 32),

(4208, 'Escuela Rural Troyo', 'Lonquimay', 'Sector Troyo s/n, Lonquimay',
 ST_MakePoint(-71.1900, -38.3900)::geography, 'Municipal', true, '{basica}', 28),

(4210, 'Escuela Rural Icalma', 'Lonquimay', 'Lago Icalma s/n, Lonquimay',
 ST_MakePoint(-71.2800, -38.7800)::geography, 'Municipal', true, '{basica}', 41),

(4212, 'Escuela Rural Cruzaco', 'Lonquimay', 'Sector Cruzaco s/n, Lonquimay',
 ST_MakePoint(-71.1500, -38.5200)::geography, 'Municipal', true, '{basica}', 18),

-- === CURACAUTÍN ===
(4180, 'Escuela Básica Curacautín', 'Curacautín', 'Manuel Rodríguez 380, Curacautín',
 ST_MakePoint(-71.8889, -38.4333)::geography, 'Municipal', true, '{basica}', 210),

(4182, 'Escuela Rural Manzanar', 'Curacautín', 'Sector Manzanar s/n, Curacautín',
 ST_MakePoint(-71.8000, -38.4900)::geography, 'Municipal', true, '{basica}', 35),

(4184, 'Escuela Rural Captren', 'Curacautín', 'Sector Captren s/n, Curacautín',
 ST_MakePoint(-71.7200, -38.5500)::geography, 'Municipal', true, '{basica}', 22),

(4186, 'Escuela Rural Llanquén', 'Curacautín', 'Sector Llanquén s/n, Curacautín',
 ST_MakePoint(-71.6500, -38.5000)::geography, 'Municipal', true, '{basica}', 15),

-- === MELIPEUCO ===
(4250, 'Escuela Básica Melipeuco', 'Melipeuco', 'Calle Principal 200, Melipeuco',
 ST_MakePoint(-71.8094, -38.8414)::geography, 'Municipal', true, '{basica}', 160),

(4252, 'Escuela Rural Alpehue', 'Melipeuco', 'Sector Alpehue s/n, Melipeuco',
 ST_MakePoint(-71.7500, -38.8000)::geography, 'Municipal', true, '{basica}', 24),

(4254, 'Escuela Rural Santa Ema', 'Melipeuco', 'Sector Santa Ema s/n, Melipeuco',
 ST_MakePoint(-71.8500, -38.8800)::geography, 'Municipal', true, '{basica}', 19),

-- === VILCÚN ===
(4300, 'Escuela Básica Vilcún', 'Vilcún', 'Av. Bernardo O''Higgins 500, Vilcún',
 ST_MakePoint(-72.2280, -38.6690)::geography, 'Municipal', true, '{basica}', 185),

(4302, 'Escuela Rural Cherquenco', 'Vilcún', 'Calle Principal s/n, Cherquenco',
 ST_MakePoint(-71.9600, -38.7000)::geography, 'Municipal', true, '{basica}', 65),

(4304, 'Escuela Rural Llaima', 'Vilcún', 'Sector Llaima s/n, Vilcún',
 ST_MakePoint(-71.9800, -38.7500)::geography, 'Municipal', true, '{basica}', 30),

(4306, 'Escuela Rural Quechurehue', 'Vilcún', 'Sector Quechurehue s/n, Vilcún',
 ST_MakePoint(-71.9200, -38.7200)::geography, 'Municipal', true, '{basica}', 25),

-- === CUNCO ===
(4320, 'Escuela Básica Cunco', 'Cunco', 'Av. Manuel Montt 300, Cunco',
 ST_MakePoint(-72.0264, -38.9297)::geography, 'Municipal', true, '{basica}', 175),

(4322, 'Escuela Rural Los Laureles', 'Cunco', 'Sector Los Laureles s/n, Cunco',
 ST_MakePoint(-71.9800, -38.8800)::geography, 'Municipal', true, '{basica}', 28),

(4324, 'Escuela Rural Mahuidanche', 'Cunco', 'Sector Mahuidanche s/n, Cunco',
 ST_MakePoint(-72.1000, -38.9700)::geography, 'Municipal', true, '{basica}', 20),

-- === TEMUCO (escuelas rurales periurbanas) ===
(4100, 'Escuela Rural Boyeco', 'Temuco', 'Sector Boyeco s/n, Temuco',
 ST_MakePoint(-72.7200, -38.6800)::geography, 'Municipal', true, '{basica}', 45),

(4102, 'Escuela Rural Metrenco', 'Temuco', 'Sector Metrenco s/n, Temuco',
 ST_MakePoint(-72.6500, -38.7800)::geography, 'Municipal', true, '{basica}', 52),

(4104, 'Escuela Rural Labranza', 'Temuco', 'Sector Labranza s/n, Temuco',
 ST_MakePoint(-72.8200, -38.7300)::geography, 'Municipal', true, '{basica}', 68)

ON CONFLICT (rbd) DO NOTHING;


-- 5. Función PostGIS: buscar POIs cercanos a una escuela
CREATE OR REPLACE FUNCTION nearby_pois(
  school_id UUID,
  radius_km FLOAT DEFAULT 20
)
RETURNS TABLE (
  poi_id UUID,
  poi_name TEXT,
  poi_type TEXT,
  ecosystem_type TEXT,
  commune TEXT,
  description TEXT,
  stem_areas TEXT[],
  heritage_type TEXT,
  threats TEXT[],
  distance_km FLOAT,
  latitude FLOAT,
  longitude FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS poi_id,
    p.name AS poi_name,
    p.type AS poi_type,
    p.ecosystem_type,
    p.commune,
    p.description,
    p.stem_areas,
    p.heritage_type,
    p.threats,
    ROUND((ST_Distance(s.location, p.location) / 1000)::numeric, 1)::float AS distance_km,
    ST_Y(p.location::geometry) AS latitude,
    ST_X(p.location::geometry) AS longitude
  FROM schools s
  CROSS JOIN points_of_interest p
  WHERE s.id = school_id
    AND ST_DWithin(s.location, p.location, radius_km * 1000)
  ORDER BY ST_Distance(s.location, p.location);
END;
$$ LANGUAGE plpgsql;
