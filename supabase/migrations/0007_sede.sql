-- Dividir las cuentas por sede
--
-- QUÉ PROBLEMA RESUELVE
--
-- Hasta aquí la plataforma daba por hecho una sola realidad: un colegio con
-- RBD, una comuna, los Objetivos de Aprendizaje de las Bases Curriculares
-- chilenas, un río de La Araucanía y los dos papeles que pide la
-- Superintendencia de Educación. Eso funciona mientras todas las cuentas sean
-- del mismo país. Con Thais entrando desde Río de Janeiro deja de funcionar:
-- ni el currículum, ni las problemáticas, ni el papeleo de una salida a
-- terreno son los mismos, y traducir la interfaz no arregla nada de eso.
--
-- `sede` es el campo del que va a colgar esa diferencia. No es la nacionalidad
-- de la persona: es qué edición de la plataforma le toca ver. Un docente
-- chileno de intercambio en Río trabaja con la edición brasileña, porque es la
-- que corresponde a la escuela donde va a sacar a su curso.
--
-- POR QUÉ UN CAMPO Y NO DOS DESPLIEGUES
--
-- Dos instalaciones separadas se ven más limpias el primer día y se vuelven el
-- problema al mes siguiente: cada arreglo hay que hacerlo dos veces, y el que
-- se olvida es el que se queda roto. El método es el mismo en los dos países
-- —las seis etapas no dependen de dónde quede la escuela— y lo único que
-- cambia es el contenido que se le cuelga. Eso es un campo, no un servidor.
--
-- QUÉ NO HACE ESTA MIGRACIÓN
--
-- No crea el contenido brasileño. Hoy `sede = 'br'` solo decide el idioma de
-- la interfaz, que ya está traducida. El cuaderno sigue mostrando el corpus
-- chileno hasta que exista el otro, y eso se dice en pantalla en vez de
-- disimularlo.

-- 1. La sede de cada cuenta.
--
--    `not null default 'cl'` y no nulable a propósito: una cuenta sin sede es
--    una cuenta que no se sabe qué contenido tiene que ver, y ese «no se sabe»
--    acaba resolviéndose en el frontend con un `?? "cl"` distinto en cada
--    pantalla. Las seis cuentas que ya existen son chilenas, así que el valor
--    por defecto las deja bien sin tocarlas una por una.
alter table public.profiles
  add column if not exists sede text not null default 'cl';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_sede_valida'
  ) then
    alter table public.profiles
      add constraint profiles_sede_valida check (sede in ('cl', 'br'));
  end if;
end $$;

comment on column public.profiles.sede is
  'Qué edición de la plataforma ve esta cuenta: cl (Chile) o br (Brasil). '
  'Decide el idioma y, cuando exista, el corpus de currículum y problemáticas.';

create index if not exists profiles_sede_idx on public.profiles (sede);

-- 2. La sede de cada escuela.
--
--    Una escuela pertenece a una edición igual que una cuenta, y por razones
--    más duras: `schools.rbd` es el rol base de datos del Mineduc chileno y en
--    Brasil el identificador es el código INEP, que no es lo mismo ni cabe en
--    la misma columna. Marcar la sede ahora evita que el día que entre la
--    primera escuela carioca haya que adivinar cuál es cuál.
alter table public.schools
  add column if not exists sede text not null default 'cl';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'schools_sede_valida'
  ) then
    alter table public.schools
      add constraint schools_sede_valida check (sede in ('cl', 'br'));
  end if;
end $$;

create index if not exists schools_sede_idx on public.schools (sede);

-- 3. El registro pasa a decidir la sede.
--
--    Se lee de los metadatos del alta, que es donde el formulario de registro
--    puede ponerla. Si no viene, cae en 'cl', que es lo que había hasta ahora:
--    una cuenta nueva sin sede declarada es chilena, no es un error.
--
--    El resto de la función queda igual que en 0001; se reescribe entera
--    porque `create or replace` no admite parches.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nome, cep, idade, sede)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'nome', ''),
    nullif(new.raw_user_meta_data ->> 'cep', ''),
    nullif(regexp_replace(coalesce(new.raw_user_meta_data ->> 'idade', ''), '\D', '', 'g'), '')::int,
    -- Solo se acepta una sede conocida. Un valor raro en los metadatos, que
    -- vienen del cliente, no debe poder saltarse la restricción y abortar el
    -- alta entera: se ignora y la cuenta queda en la sede por defecto.
    case when new.raw_user_meta_data ->> 'sede' in ('cl', 'br')
         then new.raw_user_meta_data ->> 'sede'
         else 'cl' end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- 4. Thais trabaja desde Río de Janeiro.
update public.profiles p
set sede = 'br'
from auth.users u
where u.id = p.id and u.email = 'thaism@poli.ufrj.br';

-- 5. Que la sede viaje también en los metadatos de auth.
--
--    El frontend necesita saberla antes de poder consultar `profiles`: el
--    idioma de la interfaz se decide al cargar la página, y esperar a una
--    consulta a la base para eso significa pintar la pantalla en español y
--    cambiarla a portugués medio segundo después, delante de la persona.
update auth.users u
set raw_user_meta_data = coalesce(u.raw_user_meta_data, '{}'::jsonb)
                       || jsonb_build_object('sede', p.sede)
from public.profiles p
where p.id = u.id;
