-- =============================================
-- Cuántas rutas arma cada persona con el modelo, por día
-- Ejecutar en el editor SQL de Supabase
-- =============================================
--
-- Cada llamada a `generar-ruta` le cuesta plata a AprendeLocal. Sin un tope,
-- una cuenta cualquiera puede armar rutas en un bucle hasta agotar el
-- presupuesto de la cuenta de Anthropic.
--
-- El contador lo lleva la Edge Function con la clave de servicio. Aquí no hay
-- ninguna política que permita escribir desde el navegador, a propósito: si un
-- docente pudiera editar su propio contador, el tope no sería un tope.

CREATE TABLE IF NOT EXISTS usos_ia (
    usuario     uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    dia         date        NOT NULL,
    veces       integer     NOT NULL DEFAULT 0 CHECK (veces >= 0),
    creado_en   timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (usuario, dia)
);

ALTER TABLE usos_ia ENABLE ROW LEVEL SECURITY;

-- Sin políticas. Con RLS activo y ninguna política, la clave pública no puede
-- leer ni escribir esta tabla; la clave de servicio, que usa la función, pasa
-- por encima de RLS y es la única que la toca.
--
-- Que un docente no pueda leer su propio contador es a propósito: la pantalla
-- ya le dice cuando llegó al tope, y darle la cuenta exacta invita a jugar con
-- ella sin aportarle nada para preparar su clase.

-- Limpieza. Los contadores de hace más de un mes no le sirven a nadie, y
-- guardar para siempre qué día trabajó cada docente es guardar de más.
CREATE INDEX IF NOT EXISTS usos_ia_dia_idx ON usos_ia (dia);

-- Ejecutar de vez en cuando, o dejarlo programado con pg_cron:
--   DELETE FROM usos_ia WHERE dia < current_date - INTERVAL '30 days';

-- Verificar que quedó cerrada: la lista de políticas tiene que salir vacía.
SELECT tablename, policyname
FROM pg_policies
WHERE tablename = 'usos_ia';
