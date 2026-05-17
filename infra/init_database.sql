-- =============================================
-- AprendeLocal - Inicialización Base de Datos
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- 1. Habilitar PostGIS (para coordenadas geográficas)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Tabla de ecosistemas
CREATE TABLE ecosystems (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    polygon GEOMETRY(Polygon, 4326),
    biodiversity_index FLOAT,
    conservation_status TEXT,
    threats TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabla de puntos de interés educativos
CREATE TABLE points_of_interest (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    ecosystem_type TEXT,
    commune TEXT NOT NULL,
    description TEXT,
    location GEOMETRY(Point, 4326) NOT NULL,
    stem_areas TEXT[],
    heritage_type TEXT,
    threats TEXT[],
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabla de proyectos STEM
CREATE TABLE stem_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    stem_areas TEXT[] NOT NULL,
    level TEXT NOT NULL,
    duration TEXT,
    local_connection TEXT,
    objectives TEXT[],
    materials TEXT[],
    steps TEXT[],
    expected_outcomes TEXT[],
    curriculum_alignment TEXT[],
    point_of_interest_id UUID REFERENCES points_of_interest(id),
    generated_by TEXT DEFAULT 'claude',
    validated BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabla de docentes (auth via Supabase Auth)
CREATE TABLE teachers (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    school_name TEXT,
    commune TEXT,
    level TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Tabla de proyectos asignados
CREATE TABLE assigned_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID REFERENCES teachers(id),
    project_id UUID REFERENCES stem_projects(id),
    status TEXT DEFAULT 'assigned',
    notes TEXT,
    assigned_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- 7. Índices espaciales (hacen las búsquedas por ubicación rápidas)
CREATE INDEX idx_pois_location ON points_of_interest USING GIST (location);
CREATE INDEX idx_ecosystems_polygon ON ecosystems USING GIST (polygon);

-- 8. Habilitar Row Level Security (seguridad)
ALTER TABLE points_of_interest ENABLE ROW LEVEL SECURITY;
ALTER TABLE stem_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE assigned_projects ENABLE ROW LEVEL SECURITY;

-- 9. Políticas: lectura pública para POIs y proyectos
CREATE POLICY "POIs son públicos" ON points_of_interest
    FOR SELECT USING (true);

CREATE POLICY "Proyectos STEM son públicos" ON stem_projects
    FOR SELECT USING (true);

-- 10. Insertar los 3 primeros POIs de prueba
INSERT INTO points_of_interest (name, type, ecosystem_type, commune, description, location, stem_areas, heritage_type, threats)
VALUES
    ('Parque Nacional Conguillío', 'natural', 'bosque_araucaria', 'Melipeuco',
     'Bosque milenario de araucarias con lagos de origen volcánico. Reserva de la Biosfera UNESCO.',
     ST_SetSRID(ST_MakePoint(-71.58, -38.65), 4326),
     ARRAY['ecología', 'geología', 'cambio_climático'], 'natural',
     ARRAY['incendios', 'cambio_climático']),

    ('Volcán Villarrica (Rukapillán)', 'geological', 'zona_volcanica', 'Curarrehue',
     'Uno de los volcanes más activos de Sudamérica. Nombre mapuche: Rukapillán (casa del espíritu).',
     ST_SetSRID(ST_MakePoint(-71.93, -39.42), 4326),
     ARRAY['geología', 'vulcanología', 'física', 'cultura_mapuche'], 'natural_cultural',
     ARRAY['erupciones', 'deshielo_glaciar']),

    ('Reserva Nacional Nalcas-Malalcahuello', 'natural', 'bosque_araucaria', 'Lonquimay',
     'Bosque de araucarias y coigües en la precordillera. Hábitat del carpintero negro.',
     ST_SetSRID(ST_MakePoint(-71.47, -38.43), 4326),
     ARRAY['biología', 'ecología', 'conservación'], 'natural',
     ARRAY['tala_ilegal', 'especies_invasoras']);
