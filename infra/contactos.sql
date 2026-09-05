-- =============================================
-- Los mensajes del formulario de contacto de la portada
-- Ejecutar en el editor SQL de Supabase
-- =============================================
--
-- Mientras esta tabla no exista, el formulario abre el correo del computador
-- con el mensaje ya escrito y no se pierde nada; una vez creada, los mensajes
-- quedan guardados aqui y el formulario lo dice asi.

CREATE TABLE IF NOT EXISTS contactos (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre      text        NOT NULL CHECK (length(trim(nombre)) BETWEEN 1 AND 200),
    correo      text        NOT NULL CHECK (length(correo) BETWEEN 3 AND 320),
    rol         text                 CHECK (rol IS NULL OR length(rol) <= 200),
    mensaje     text        NOT NULL CHECK (length(trim(mensaje)) BETWEEN 1 AND 5000),
    creado_en   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contactos_creado_en_idx ON contactos (creado_en DESC);

ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;

-- Cualquiera que abra la portada puede escribir un mensaje: eso es lo que hace
-- un formulario de contacto. Los limites de largo de arriba son la defensa
-- contra el relleno automatico, y no hay politica de SELECT a proposito, asi
-- que nadie puede leer con la clave publica lo que escribieron otros. Los
-- mensajes se leen desde el panel de Supabase o con la clave de servicio.
DROP POLICY IF EXISTS "Cualquiera puede escribir un mensaje" ON contactos;
CREATE POLICY "Cualquiera puede escribir un mensaje" ON contactos
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Verificar que quedo como se espera: una sola politica, y de INSERT.
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'contactos';
