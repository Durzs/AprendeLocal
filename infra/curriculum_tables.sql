-- =============================================
-- AprendeLocal - Tabla de Objetivos de Aprendizaje
-- Currículo Nacional Chile (Bases Curriculares MINEDUC)
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- 1. Tabla de Objetivos de Aprendizaje
CREATE TABLE IF NOT EXISTS curriculum_objectives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,       -- "OA01_CN_5", "OA03_CN_6", etc.
    subject TEXT NOT NULL,           -- "ciencias_naturales", "matematicas"
    level TEXT NOT NULL,             -- "5to_basico", "6to_basico", etc.
    axis TEXT NOT NULL,              -- "ciencias_vida", "ciencias_fisicas", "ciencias_tierra", "biologia", "fisica", "quimica"
    oa_number INTEGER NOT NULL,      -- 1, 2, 3...
    description TEXT NOT NULL,       -- Texto completo del OA
    keywords TEXT[],                 -- Palabras clave para matching con proyectos
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla de relación proyecto ↔ OA
CREATE TABLE IF NOT EXISTS project_curriculum (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES stem_projects(id) ON DELETE CASCADE,
    objective_id UUID REFERENCES curriculum_objectives(id) ON DELETE CASCADE,
    coverage TEXT DEFAULT 'principal', -- "principal" o "secundario"
    UNIQUE(project_id, objective_id)
);

-- 3. Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_curriculum_level ON curriculum_objectives(level);
CREATE INDEX IF NOT EXISTS idx_curriculum_subject ON curriculum_objectives(subject);
CREATE INDEX IF NOT EXISTS idx_curriculum_axis ON curriculum_objectives(axis);
CREATE INDEX IF NOT EXISTS idx_project_curriculum_obj ON project_curriculum(objective_id);
CREATE INDEX IF NOT EXISTS idx_project_curriculum_proj ON project_curriculum(project_id);

-- 4. Seguridad: lectura pública
ALTER TABLE curriculum_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_curriculum ENABLE ROW LEVEL SECURITY;

CREATE POLICY "OA son públicos" ON curriculum_objectives FOR SELECT USING (true);
CREATE POLICY "Relaciones proyecto-OA son públicas" ON project_curriculum FOR SELECT USING (true);
CREATE POLICY "API puede insertar relaciones" ON project_curriculum FOR INSERT WITH CHECK (true);

-- =============================================
-- 5. SEED: Objetivos de Aprendizaje reales
-- Fuente: curriculumnacional.cl (MINEDUC)
-- =============================================

-- ── 5TO BÁSICO - CIENCIAS NATURALES ──

INSERT INTO curriculum_objectives (code, subject, level, axis, oa_number, description, keywords) VALUES
('OA01_CN_5', 'ciencias_naturales', '5to_basico', 'ciencias_vida', 1,
 'Reconocer y explicar que los seres vivos están formados por una o más células y que estas se organizan en tejidos, órganos y sistemas.',
 ARRAY['células', 'tejidos', 'órganos', 'sistemas', 'seres vivos', 'biología']),

('OA02_CN_5', 'ciencias_naturales', '5to_basico', 'ciencias_vida', 2,
 'Identificar y describir por medio de modelos las estructuras básicas del sistema digestivo y sus funciones en la digestión, la absorción de alimentos y la eliminación de desechos.',
 ARRAY['sistema digestivo', 'digestión', 'absorción', 'alimentos', 'nutrición']),

('OA03_CN_5', 'ciencias_naturales', '5to_basico', 'ciencias_vida', 3,
 'Explicar por medio de modelos la respiración (inspiración-espiración-intercambio de oxígeno y dióxido de carbono), identificando las estructuras básicas del sistema respiratorio.',
 ARRAY['respiración', 'oxígeno', 'pulmones', 'sistema respiratorio']),

('OA04_CN_5', 'ciencias_naturales', '5to_basico', 'ciencias_vida', 4,
 'Explicar la función de transporte del sistema circulatorio (sustancias alimenticias, oxígeno y dióxido de carbono), identificando sus estructuras básicas (corazón, vasos sanguíneos y sangre).',
 ARRAY['sistema circulatorio', 'corazón', 'sangre', 'transporte']),

('OA05_CN_5', 'ciencias_naturales', '5to_basico', 'ciencias_vida', 5,
 'Analizar el consumo de alimento diario (variedad, tamaño y frecuencia de porciones) reconociendo los alimentos para el crecimiento, la reparación, el desarrollo y el movimiento del cuerpo.',
 ARRAY['alimentación', 'nutrición', 'salud', 'dieta']),

('OA06_CN_5', 'ciencias_naturales', '5to_basico', 'ciencias_vida', 6,
 'Investigar en diversas fuentes y comunicar los efectos nocivos que produce el cigarrillo (humo del tabaco) en los sistemas respiratorio y circulatorio.',
 ARRAY['tabaco', 'cigarrillo', 'salud', 'prevención']),

('OA07_CN_5', 'ciencias_naturales', '5to_basico', 'ciencias_vida', 7,
 'Investigar e identificar algunos microorganismos beneficiosos y dañinos para la salud (bacterias, virus y hongos), y proponer medidas de cuidado e higiene del cuerpo.',
 ARRAY['microorganismos', 'bacterias', 'virus', 'hongos', 'higiene', 'salud']),

('OA08_CN_5', 'ciencias_naturales', '5to_basico', 'ciencias_fisicas', 8,
 'Reconocer los cambios que experimenta la energía eléctrica al pasar de una forma a otra e investigar los principales aportes de científicos en su estudio a lo largo del tiempo.',
 ARRAY['energía eléctrica', 'transformación', 'electricidad']),

('OA09_CN_5', 'ciencias_naturales', '5to_basico', 'ciencias_fisicas', 9,
 'Construir un circuito eléctrico simple (cable, ampolleta, interruptor y pila), usarlo para resolver problemas cotidianos y explicar su funcionamiento.',
 ARRAY['circuito eléctrico', 'electricidad', 'tecnología']),

('OA10_CN_5', 'ciencias_naturales', '5to_basico', 'ciencias_fisicas', 10,
 'Observar y distinguir, por medio de la investigación experimental, los materiales conductores y aisladores de electricidad, relacionándolos con la manipulación segura de artefactos tecnológicos.',
 ARRAY['conductores', 'aisladores', 'electricidad', 'seguridad', 'materiales']),

('OA11_CN_5', 'ciencias_naturales', '5to_basico', 'ciencias_fisicas', 11,
 'Explicar la importancia de la energía eléctrica en la vida cotidiana y proponer medidas para promover su ahorro y uso responsable.',
 ARRAY['energía', 'ahorro', 'sustentabilidad', 'electricidad']),

('OA12_CN_5', 'ciencias_naturales', '5to_basico', 'ciencias_tierra', 12,
 'Describir la distribución del agua dulce y salada en la Tierra, considerando océanos, glaciares, ríos y lagos, aguas subterráneas, nubes, vapor de agua, etc. y comparar sus volúmenes.',
 ARRAY['agua', 'océanos', 'glaciares', 'ríos', 'lagos', 'hidrología']),

('OA13_CN_5', 'ciencias_naturales', '5to_basico', 'ciencias_tierra', 13,
 'Analizar y describir las características de los océanos y lagos: variación de temperatura, luminosidad y presión en relación con la profundidad; diversidad de flora y fauna; movimiento de las aguas.',
 ARRAY['océanos', 'lagos', 'temperatura', 'biodiversidad', 'corrientes', 'ecosistemas acuáticos']),

('OA14_CN_5', 'ciencias_naturales', '5to_basico', 'ciencias_tierra', 14,
 'Investigar y explicar efectos positivos y negativos de la actividad humana en los océanos, lagos, ríos, glaciares, entre otros, proponiendo acciones de protección de las reservas hídricas en Chile.',
 ARRAY['contaminación', 'agua', 'conservación', 'actividad humana', 'protección', 'Chile']),

-- ── 6TO BÁSICO - CIENCIAS NATURALES ──

('OA01_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_vida', 1,
 'Explicar, a partir de una investigación experimental, los requerimientos de agua, dióxido de carbono y energía lumínica para la producción de azúcar y liberación de oxígeno en la fotosíntesis.',
 ARRAY['fotosíntesis', 'plantas', 'energía', 'oxígeno', 'CO2', 'ecología']),

('OA02_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_vida', 2,
 'Representar, por medio de modelos, la transferencia de energía y materia desde los organismos fotosintéticos a otros seres vivos por medio de cadenas y redes alimentarias.',
 ARRAY['cadenas alimentarias', 'redes alimentarias', 'energía', 'ecosistema', 'ecología']),

('OA03_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_vida', 3,
 'Analizar los efectos de la actividad humana sobre las redes alimentarias.',
 ARRAY['actividad humana', 'redes alimentarias', 'impacto ambiental', 'ecología', 'conservación']),

('OA04_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_vida', 4,
 'Identificar y describir las funciones de las principales estructuras del sistema reproductor humano femenino y masculino.',
 ARRAY['sistema reproductor', 'pubertad', 'sexualidad']),

('OA05_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_vida', 5,
 'Describir y comparar los cambios que se producen en la pubertad en mujeres y hombres.',
 ARRAY['pubertad', 'cambios físicos', 'desarrollo']),

('OA06_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_vida', 6,
 'Reconocer los beneficios de realizar actividad física en forma regular y de cuidar la higiene corporal en el período de la pubertad.',
 ARRAY['actividad física', 'higiene', 'salud', 'pubertad']),

('OA07_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_vida', 7,
 'Investigar y comunicar los efectos nocivos de algunas drogas para la salud, proponiendo conductas de protección.',
 ARRAY['drogas', 'prevención', 'salud']),

('OA08_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_fisicas', 8,
 'Explicar que la energía es necesaria para que los objetos cambien y los seres vivos realicen sus procesos vitales.',
 ARRAY['energía', 'cambio', 'procesos vitales']),

('OA09_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_fisicas', 9,
 'Investigar en forma experimental la transformación de la energía de una forma a otra.',
 ARRAY['transformación energía', 'experimentación', 'física']),

('OA10_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_fisicas', 10,
 'Demostrar, por medio de la investigación experimental, que el calor fluye de un objeto caliente a uno frío hasta que ambos alcanzan la misma temperatura.',
 ARRAY['calor', 'temperatura', 'transferencia', 'equilibrio térmico']),

('OA11_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_fisicas', 11,
 'Clasificar los recursos naturales energéticos en no renovables y renovables y proponer medidas para el uso responsable.',
 ARRAY['recursos naturales', 'energía renovable', 'sustentabilidad', 'medio ambiente']),

('OA12_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_fisicas', 12,
 'Explicar, a partir de modelos, que la materia está formada por partículas en movimiento en sus estados sólido, líquido y gaseoso.',
 ARRAY['materia', 'partículas', 'estados', 'sólido', 'líquido', 'gaseoso']),

('OA13_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_fisicas', 13,
 'Demostrar, mediante la investigación experimental, los cambios de estado de la materia.',
 ARRAY['cambios estado', 'materia', 'experimentación']),

('OA14_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_fisicas', 14,
 'Diferenciar entre calor y temperatura, considerando que el calor es una forma de energía.',
 ARRAY['calor', 'temperatura', 'energía']),

('OA15_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_fisicas', 15,
 'Medir e interpretar la información obtenida al calentar y enfriar el agua.',
 ARRAY['medición', 'agua', 'temperatura', 'datos']),

('OA16_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_tierra', 16,
 'Describir las características de las capas de la Tierra (atmósfera, litósfera e hidrósfera) que posibilitan el desarrollo de la vida.',
 ARRAY['capas Tierra', 'atmósfera', 'litósfera', 'hidrósfera', 'geología']),

('OA17_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_tierra', 17,
 'Investigar experimentalmente la formación del suelo, sus propiedades y la importancia de protegerlo de la contaminación.',
 ARRAY['suelo', 'formación', 'contaminación', 'protección', 'geología']),

('OA18_CN_6', 'ciencias_naturales', '6to_basico', 'ciencias_tierra', 18,
 'Explicar las consecuencias de la erosión sobre la superficie de la Tierra, identificando los agentes que la provocan.',
 ARRAY['erosión', 'superficie', 'agentes', 'geología', 'cambio climático']),

-- ── 7MO BÁSICO - CIENCIAS NATURALES ──

('OA01_CN_7', 'ciencias_naturales', '7mo_basico', 'biologia', 1,
 'Explicar los aspectos biológicos, afectivos y sociales que se integran en la sexualidad, considerando los cambios físicos durante la pubertad, la relación afectiva y el respeto mutuo.',
 ARRAY['sexualidad', 'pubertad', 'afectividad']),

('OA02_CN_7', 'ciencias_naturales', '7mo_basico', 'biologia', 2,
 'Explicar la formación de un nuevo individuo, considerando el ciclo menstrual, la participación de espermatozoides y ovocitos, métodos de control de natalidad, y la paternidad responsable.',
 ARRAY['reproducción', 'ciclo menstrual', 'natalidad']),

('OA03_CN_7', 'ciencias_naturales', '7mo_basico', 'biologia', 3,
 'Describir, por medio de la investigación, las características de infecciones de transmisión sexual (ITS), considerando mecanismos de transmisión, prevención, síntomas y consecuencias.',
 ARRAY['ITS', 'prevención', 'salud sexual']),

('OA04_CN_7', 'ciencias_naturales', '7mo_basico', 'biologia', 4,
 'Desarrollar modelos que expliquen las barreras defensivas del cuerpo humano, considerando agentes patógenos, vacunas, alergias y enfermedades autoinmunes.',
 ARRAY['sistema inmune', 'vacunas', 'patógenos', 'defensas', 'salud']),

('OA05_CN_7', 'ciencias_naturales', '7mo_basico', 'biologia', 5,
 'Comparar, usando modelos, microorganismos como virus, bacterias y hongos, en relación con características estructurales, características de seres vivos y efectos sobre la salud.',
 ARRAY['microorganismos', 'virus', 'bacterias', 'hongos', 'salud']),

('OA06_CN_7', 'ciencias_naturales', '7mo_basico', 'biologia', 6,
 'Investigar y explicar el rol de microorganismos (bacterias y hongos) en la biotecnología: descontaminación ambiental, producción de alimentos y fármacos, obtención de cobre, generación de metano.',
 ARRAY['biotecnología', 'microorganismos', 'descontaminación', 'cobre', 'fermentación']),

('OA07_CN_7', 'ciencias_naturales', '7mo_basico', 'fisica', 7,
 'Planificar y conducir una investigación experimental para proveer evidencias que expliquen los efectos de las fuerzas gravitacional, de roce y elástica en situaciones cotidianas.',
 ARRAY['fuerzas', 'gravedad', 'roce', 'elasticidad', 'experimentación']),

('OA08_CN_7', 'ciencias_naturales', '7mo_basico', 'fisica', 8,
 'Explorar y describir cualitativamente la presión, considerando sus efectos en sólidos, líquidos y gases.',
 ARRAY['presión', 'sólidos', 'líquidos', 'gases', 'hidráulica']),

('OA09_CN_7', 'ciencias_naturales', '7mo_basico', 'fisica', 9,
 'Explicar, con el modelo de la tectónica de placas, los patrones de distribución de la actividad geológica (volcanes y sismos), los tipos de interacción entre placas y la deriva continental.',
 ARRAY['tectónica', 'placas', 'volcanes', 'sismos', 'geología', 'vulcanología']),

('OA10_CN_7', 'ciencias_naturales', '7mo_basico', 'fisica', 10,
 'Explicar, sobre la base de evidencias y por medio de modelos, la actividad volcánica y sus consecuencias en la naturaleza y la sociedad.',
 ARRAY['volcanes', 'vulcanología', 'erupciones', 'riesgos naturales', 'geología']),

('OA11_CN_7', 'ciencias_naturales', '7mo_basico', 'fisica', 11,
 'Crear modelos que expliquen el ciclo de las rocas, la formación y modificación de las rocas ígneas, metamórficas y sedimentarias, en función de la temperatura, la presión y la erosión.',
 ARRAY['rocas', 'ciclo rocas', 'ígneas', 'metamórficas', 'sedimentarias', 'geología']),

('OA12_CN_7', 'ciencias_naturales', '7mo_basico', 'fisica', 12,
 'Demostrar, por medio de modelos, que el clima en la Tierra es dinámico y se produce por la interacción de múltiples variables: presión, temperatura, humedad, circulación atmosférica y del agua.',
 ARRAY['clima', 'atmósfera', 'temperatura', 'humedad', 'cambio climático', 'meteorología']),

('OA13_CN_7', 'ciencias_naturales', '7mo_basico', 'quimica', 13,
 'Investigar experimentalmente y explicar el comportamiento de gases ideales en situaciones cotidianas, considerando factores como presión, volumen y temperatura, las leyes que los modelan y la teoría cinético-molecular.',
 ARRAY['gases', 'presión', 'volumen', 'temperatura', 'cinético-molecular']),

('OA14_CN_7', 'ciencias_naturales', '7mo_basico', 'quimica', 14,
 'Investigar experimentalmente y explicar la clasificación de la materia en sustancias puras y mezclas (homogéneas y heterogéneas), los procedimientos de separación de mezclas, considerando su aplicación industrial.',
 ARRAY['materia', 'mezclas', 'sustancias puras', 'separación', 'industria', 'minería']),

('OA15_CN_7', 'ciencias_naturales', '7mo_basico', 'quimica', 15,
 'Investigar experimentalmente los cambios de la materia y argumentar con evidencia empírica que estos pueden ser físicos o químicos.',
 ARRAY['cambios materia', 'físicos', 'químicos', 'experimentación']),

-- ── 8VO BÁSICO - CIENCIAS NATURALES ──

('OA01_CN_8', 'ciencias_naturales', '8vo_basico', 'biologia', 1,
 'Explicar que los modelos de la célula han evolucionado sobre la base de evidencias, y crear modelos para explicar la relación entre la función y las estructuras celulares.',
 ARRAY['célula', 'modelos', 'estructuras celulares', 'evolución conocimiento']),

('OA02_CN_8', 'ciencias_naturales', '8vo_basico', 'biologia', 2,
 'Desarrollar modelos que expliquen la relación entre la función de una célula y sus partes (núcleo, citoplasma, membrana, organelos), distinguiendo células eucariotas y procariotas.',
 ARRAY['célula', 'núcleo', 'membrana', 'organelos', 'eucariota', 'procariota']),

('OA03_CN_8', 'ciencias_naturales', '8vo_basico', 'biologia', 3,
 'Explicar, por medio de la experimentación, los mecanismos de intercambio de partículas entre la célula y su ambiente por difusión y osmosis.',
 ARRAY['difusión', 'osmosis', 'célula', 'membrana', 'experimentación']),

('OA04_CN_8', 'ciencias_naturales', '8vo_basico', 'biologia', 4,
 'Crear modelos que expliquen que las plantas tienen estructuras especializadas para responder a estímulos del medioambiente.',
 ARRAY['plantas', 'estímulos', 'tropismos', 'adaptación', 'medio ambiente']),

('OA05_CN_8', 'ciencias_naturales', '8vo_basico', 'biologia', 5,
 'Explicar, basándose en evidencias, la interacción de sistemas del cuerpo humano, organizados por estructuras especializadas que contribuyen a las funciones de nutrición.',
 ARRAY['sistemas', 'cuerpo humano', 'nutrición', 'digestión', 'circulación']),

('OA06_CN_8', 'ciencias_naturales', '8vo_basico', 'biologia', 6,
 'Investigar experimentalmente y explicar las características de los nutrientes (carbohidratos, proteínas, grasas) en los alimentos y sus efectos para la salud humana.',
 ARRAY['nutrientes', 'carbohidratos', 'proteínas', 'grasas', 'alimentación', 'salud']),

('OA07_CN_8', 'ciencias_naturales', '8vo_basico', 'biologia', 7,
 'Analizar y evaluar los factores que contribuyen a mantener un cuerpo saludable, proponiendo un plan que integre alimentación balanceada, ejercicio y evitar sustancias nocivas.',
 ARRAY['salud', 'alimentación', 'ejercicio', 'bienestar', 'prevención']),

('OA08_CN_8', 'ciencias_naturales', '8vo_basico', 'fisica', 8,
 'Analizar las fuerzas eléctricas, considerando los tipos de electricidad, los métodos de electrización y la planificación de investigaciones experimentales.',
 ARRAY['electricidad', 'fuerzas eléctricas', 'electrización', 'cargas']),

('OA09_CN_8', 'ciencias_naturales', '8vo_basico', 'fisica', 9,
 'Investigar las formas de producir electricidad, comparando las ventajas y desventajas de distintas fuentes: pilas, paneles fotovoltaicos y generadores.',
 ARRAY['generación eléctrica', 'pilas', 'paneles solares', 'energía renovable']),

('OA10_CN_8', 'ciencias_naturales', '8vo_basico', 'fisica', 10,
 'Analizar un circuito eléctrico domiciliario y comparar los circuitos en serie y en paralelo en relación con la intensidad de corriente y el voltaje.',
 ARRAY['circuitos', 'serie', 'paralelo', 'corriente', 'voltaje']),

('OA11_CN_8', 'ciencias_naturales', '8vo_basico', 'fisica', 11,
 'Desarrollar modelos que expliquen que el calor es una forma de transferencia de energía térmica entre dos cuerpos que están a diferentes temperaturas.',
 ARRAY['calor', 'energía térmica', 'transferencia', 'temperatura']),

('OA12_CN_8', 'ciencias_naturales', '8vo_basico', 'quimica', 12,
 'Investigar y analizar cómo ha evolucionado el conocimiento de la constitución de la materia, considerando los modelos atómicos de Dalton, Thomson, Rutherford y Bohr.',
 ARRAY['átomo', 'modelos atómicos', 'Dalton', 'Thomson', 'Rutherford', 'Bohr']),

('OA13_CN_8', 'ciencias_naturales', '8vo_basico', 'quimica', 13,
 'Desarrollar modelos que expliquen la constitución atómica de la materia, incluyendo protones, neutrones y electrones.',
 ARRAY['átomo', 'protones', 'neutrones', 'electrones', 'materia']),

('OA14_CN_8', 'ciencias_naturales', '8vo_basico', 'quimica', 14,
 'Usar la tabla periódica como un modelo para predecir las propiedades relativas de los elementos químicos.',
 ARRAY['tabla periódica', 'elementos', 'propiedades químicas']),

('OA15_CN_8', 'ciencias_naturales', '8vo_basico', 'quimica', 15,
 'Investigar y explicar que existen algunos elementos químicos frecuentes en la Tierra que son esenciales para la vida (C, H, O, N).',
 ARRAY['elementos', 'carbono', 'hidrógeno', 'oxígeno', 'nitrógeno', 'vida']);

-- Verificar
SELECT level, count(*) as total_oa FROM curriculum_objectives GROUP BY level ORDER BY level;
