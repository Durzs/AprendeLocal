-- =============================================
-- Las expediciones de cada docente, y por dónde van
-- Ejecutar en el editor SQL de Supabase
-- =============================================
--
-- Hasta ahora la expedición vivía solo en `localStorage`. Eso significaba que
-- un docente armaba la ruta el viernes en el computador de la sala de
-- profesores y el lunes, desde su casa, no estaba. La interfaz lo decía
-- —«queda guardada en este computador, no en tu cuenta»— y decirlo estaba
-- bien, pero seguía siendo la falla de fondo del producto: lo que el docente
-- escribe es lo único que la plataforma no puede volver a generar, y era
-- justo lo que no se guardaba en ninguna parte.
--
-- Esta tabla no reemplaza a `localStorage`: lo respalda. Armar una ruta sin
-- cuenta sigue funcionando igual, porque una escuela rural no siempre tiene
-- con qué registrarse el primer día. Quien sí tiene sesión iniciada recupera
-- su trabajo desde cualquier computador.
--
-- `datos` guarda la expedición completa como JSON en vez de una columna por
-- campo, a propósito: el modelo todavía se mueve —en el último mes se le
-- quitó `codigoCurso` y se le agregó `rutaIA`— y una migración por cada
-- cambio de forma sería más frágil que el JSON. Lo que sí sale a columnas es
-- lo que se consulta o se ordena: el título y las fechas.

CREATE TABLE IF NOT EXISTS expediciones (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    docente        uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,

    -- Para listarlas sin abrir el JSON de cada una.
    titulo         text NOT NULL DEFAULT '' CHECK (length(titulo) <= 300),

    -- La expedición entera, tal como la maneja el cuaderno.
    datos          jsonb NOT NULL DEFAULT '{}'::jsonb,

    -- Por dónde va: qué semanas se dieron y cuándo. Va aparte de `datos`
    -- porque cambia por otro motivo y en otro momento. `datos` lo escribe
    -- quien planifica, en su casa un domingo; `avance` lo escribe quien
    -- vuelve de la sala un martes. Mezclarlos obligaría a reescribir la
    -- planificación entera para marcar que una sesión ya ocurrió.
    avance         jsonb NOT NULL DEFAULT '{}'::jsonb,

    creada_en      timestamptz NOT NULL DEFAULT now(),
    actualizada_en timestamptz NOT NULL DEFAULT now()
);

-- Un docente abre su escritorio y quiere ver primero lo último que tocó.
CREATE INDEX IF NOT EXISTS expediciones_docente_idx
    ON expediciones (docente, actualizada_en DESC);

-- `actualizada_en` se pone sola. Confiar en que el cliente la mande bien es
-- confiar en el reloj de un computador de escuela, que suele estar corrido.
CREATE OR REPLACE FUNCTION expediciones_tocar()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.actualizada_en := now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS expediciones_tocar_trg ON expediciones;
CREATE TRIGGER expediciones_tocar_trg
    BEFORE UPDATE ON expediciones
    FOR EACH ROW EXECUTE FUNCTION expediciones_tocar();

-- ─────────────────────────────────────────────────────────────────────────
-- Cada docente ve lo suyo y nada más.
--
-- No hay política para `anon`: sin sesión no se lee ni se escribe aquí, y el
-- cuaderno sigue guardando en el navegador, que es como tiene que ser.
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE expediciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "El docente ve sus expediciones"      ON expediciones;
DROP POLICY IF EXISTS "El docente crea sus expediciones"    ON expediciones;
DROP POLICY IF EXISTS "El docente edita sus expediciones"   ON expediciones;
DROP POLICY IF EXISTS "El docente borra sus expediciones"   ON expediciones;

CREATE POLICY "El docente ve sus expediciones" ON expediciones
    FOR SELECT TO authenticated
    USING (docente = auth.uid());

CREATE POLICY "El docente crea sus expediciones" ON expediciones
    FOR INSERT TO authenticated
    WITH CHECK (docente = auth.uid());

CREATE POLICY "El docente edita sus expediciones" ON expediciones
    FOR UPDATE TO authenticated
    USING (docente = auth.uid())
    WITH CHECK (docente = auth.uid());

CREATE POLICY "El docente borra sus expediciones" ON expediciones
    FOR DELETE TO authenticated
    USING (docente = auth.uid());

-- Verificar que quedó como se espera: cuatro políticas, todas con auth.uid().
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'expediciones'
ORDER BY cmd;
