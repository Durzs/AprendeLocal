# Estado de la base de datos

Levantado el 10 de agosto de 2026 sobre el proyecto `fbpspmecvrcfnubqxslf`,
consultando directamente la base.

## Hay contenido, y bastante

| Tabla | Filas |
|---|---|
| `points_of_interest` | 148 |
| `curriculum_objectives` | 62 |
| `schools` | 22 |
| `module_materials` | 14 |
| `course_modules` | 11 |
| `stem_projects` | 11 |
| `courses` | 3 |
| `profiles` | 3 |
| `student_sessions` | 3 |

> El panel y las herramientas que leen `pg_class.reltuples` informan de 0 filas
> en todas ellas. Es una estadística del planificador que no se ha actualizado,
> no un recuento: `count(*)` devuelve lo de arriba. Conviene no fiarse de ese
> número para concluir que algo está vacío.

Sí están vacías: `ecosystems`, `teachers`, `enrollments`, `course_progress`,
`material_progress`, `badges` y `user_badges`.

## Tablas que el frontend usa y no existen

| Objeto | Dónde se usa |
|---|---|
| ~~`profiles`~~ | **creada** el 10/08/2026 |
| `avatars` | selector de avatar del perfil |
| `community_members` | página de comunidades |
| `communities_with_counts` | página de comunidades (es una vista) |

Las tres restantes hacen fallar la página de comunidades y el selector de
avatar. Sus definiciones deberían venir del volcado que describe la sección 4
de `DEPLOY.md`; no conviene inventarlas.

## Aviso de seguridad pendiente

`public.spatial_ref_sys` tiene RLS desactivado y queda expuesta a los roles
`anon` y `authenticated`. Es una tabla de sistema de PostGIS con definiciones
de sistemas de coordenadas —no datos de usuario—, pero el aviso es legítimo:

```sql
ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;
```

No se aplicó: activar RLS sin políticas bloquea toda lectura, y PostGIS la
consulta para las transformaciones de coordenadas. Decidir antes si algo del
sistema necesita leerla.
