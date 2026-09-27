-- Las rutas que se arman en el demo del stand, y el número del sorteo
--
-- QUÉ PROBLEMA RESUELVE
--
-- En un congreso, quien pasa por el stand arma una ruta en la tablet en dos
-- minutos y se va. Si la ruta se queda en la tablet, se perdió: nadie vuelve
-- a buscarla. Así que al final del demo la persona deja su correo y le llega
-- su ruta con un número, con copia al equipo. Con ese número participa en el
-- sorteo que se hace al cierre del congreso.
--
-- UN NÚMERO POR PERSONA
--
-- Es un sorteo: armar diez rutas no puede dar diez números. Por eso hay una
-- fila por correo y por evento (índice único de abajo). Si la misma persona
-- arma otra ruta, la función actualiza su fila, le manda la ruta nueva y
-- conserva su número.
--
-- El número es `numero`: correlativo y global. Una feria nueva sigue la
-- numeración donde quedó la anterior; lo que separa un sorteo de otro es
-- `evento`. Puede haber huecos si una inserción falla, y no importa.
--
-- CÓMO SE SORTEA
--
--   select numero, correo from public.rutas_demo
--   where evento = 'congreso'
--   order by random() limit 1;
--
-- QUIÉN LEE Y ESCRIBE
--
-- Nadie desde el navegador. La tabla tiene RLS activado y ninguna política,
-- así que la clave anónima no la ve ni la toca. Escribe solo la función
-- `enviar-ruta`, con la clave de servicio que Supabase le da en su entorno y
-- que nunca sale de ahí. El equipo la lee desde el panel de Supabase.
--
-- QUÉ SE GUARDA DE CADA PERSONA
--
-- El correo y que aceptó que el equipo le escriba, que es la condición para
-- enviar la ruta con copia y participar. De la conexión solo un resumen
-- irreversible (`origen_hash`), que sirve para frenar a quien use el
-- formulario para mandar correos en masa y no permite saber de dónde vino.

create table if not exists public.rutas_demo (
  numero bigint generated always as identity primary key,
  creada timestamptz not null default now(),
  correo text not null check (char_length(correo) between 3 and 254 and correo = lower(correo)),
  acepta_contacto boolean not null check (acepta_contacto),
  sede text not null check (sede in ('cl', 'br')),
  idioma text not null check (idioma in ('es', 'pt')),
  problema text not null check (char_length(problema) <= 60),
  asignaturas text[] not null default '{}',
  lugar text check (char_length(lugar) <= 60),
  -- Dónde se armó: 'congreso' en el stand. Para distinguir ferias futuras.
  evento text not null default 'congreso' check (char_length(evento) <= 40),
  origen_hash text,
  -- Cuántas veces se le mandó una ruta. Tope en la función.
  envios int not null default 0,
  enviado boolean not null default false,
  enviado_en timestamptz,
  error_envio text,
  actualizada timestamptz not null default now()
);

alter table public.rutas_demo enable row level security;

-- Un número por persona y evento. El correo se guarda ya en minúsculas.
create unique index if not exists rutas_demo_participante_idx on public.rutas_demo (evento, correo);

-- Para los límites de la función: cuántas personas nuevas desde una conexión
-- en la última hora, y cuántos correos salieron en el día.
create index if not exists rutas_demo_origen_idx on public.rutas_demo (origen_hash, creada);
create index if not exists rutas_demo_enviado_idx on public.rutas_demo (enviado_en);

comment on table public.rutas_demo is
  'Rutas armadas en el demo del stand (/congreso) y número del sorteo, uno por correo y evento. Solo escribe la función enviar-ruta.';
