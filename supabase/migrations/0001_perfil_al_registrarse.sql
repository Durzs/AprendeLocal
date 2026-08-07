-- Crear el perfil en el servidor al registrarse
--
-- Problema que resuelve
-- ---------------------
-- RegisterPage insertaba la fila de `profiles` desde el navegador, justo
-- después de `signUp`. Con la confirmación por correo activada —que es el
-- comportamiento por defecto de Supabase— `signUp` no devuelve sesión, así que
-- esa inserción viajaba sin JWT, RLS la rechazaba, y el error se descartaba sin
-- mirarlo. Resultado: usuarios en `auth.users` sin fila en `profiles`.
--
-- Moviendo la creación a un disparador deja de depender de que el cliente tenga
-- sesión, de que la petición llegue, y de que alguien revise el error.
--
-- Cómo aplicarlo
-- --------------
-- Supabase → SQL Editor → pegar y ejecutar. Es idempotente: se puede volver a
-- correr sin romper nada.
--
-- Antes de ejecutar, confirma que `public.profiles` tiene las columnas `id`,
-- `nome`, `cep` e `idade`. Si alguna se llama distinto, ajústala abajo.

-- 1. Función que traduce los metadatos del registro a una fila de perfil.
--    SECURITY DEFINER para que corra con permisos del propietario y no quede
--    sujeta a las políticas RLS que se definen más abajo.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nome, cep, idade)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'nome', ''),
    nullif(new.raw_user_meta_data ->> 'cep', ''),
    -- El formulario manda la edad como texto; si viniera vacía o no numérica
    -- se guarda nula en vez de abortar el registro entero.
    nullif(regexp_replace(coalesce(new.raw_user_meta_data ->> 'idade', ''), '\D', '', 'g'), '')::int
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- 2. Disparador sobre el alta de usuario.
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- 3. Políticas RLS de `profiles`.
--    Sin ellas, el frontend no puede leer ni completar su propio perfil.
alter table public.profiles enable row level security;

drop policy if exists "perfil propio: leer" on public.profiles;
create policy "perfil propio: leer"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "perfil propio: crear" on public.profiles;
create policy "perfil propio: crear"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "perfil propio: actualizar" on public.profiles;
create policy "perfil propio: actualizar"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 4. Reparar las cuentas que quedaron sin perfil mientras el fallo estuvo vivo.
insert into public.profiles (id, nome, cep, idade)
select
  u.id,
  nullif(u.raw_user_meta_data ->> 'nome', ''),
  nullif(u.raw_user_meta_data ->> 'cep', ''),
  nullif(regexp_replace(coalesce(u.raw_user_meta_data ->> 'idade', ''), '\D', '', 'g'), '')::int
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;
