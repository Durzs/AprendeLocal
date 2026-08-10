# Despliegue y conexión del dominio

Arquitectura de producción:

```
aprendelocal.com  ──────►  Vercel      (frontend Vite/React, estático)
api.aprendelocal.com ───►  Railway     (FastAPI, contenedor Docker)
                            └────────►  Supabase (Postgres + Storage + Auth)
```

El frontend habla con **dos** backends distintos:

- **Supabase** directamente (auth, cursos, perfiles, comunidades), vía
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
- **La API FastAPI** (mapa STEM, generación de proyectos con Claude,
  currículo, escuelas, progreso), vía `VITE_API_URL`.

Si `VITE_API_URL` no se define, `src/frontend/src/api.ts` usa rutas
relativas — eso funciona en local gracias al proxy de `vite.config.ts`,
pero **en producción deja el mapa y la generación de proyectos rotos**.
Es la variable que más fácil se olvida.

---

## 1. Backend: FastAPI en Railway

El `Dockerfile` de la raíz ya está listo y Railway lo detecta solo.

1. Railway → **New Project** → *Deploy from GitHub repo* → `Durzs/AprendeLocal`.
2. En **Variables**, define:

   | Variable | Valor |
   |---|---|
   | `SUPABASE_URL` | URL del proyecto Supabase |
   | `SUPABASE_KEY` | clave del proyecto (service_role si la API escribe) |
   | `ANTHROPIC_API_KEY` | clave de Anthropic, para generar proyectos STEM |
   | `CORS_ORIGINS` | `https://aprendelocal.com,https://www.aprendelocal.com` |

   `PORT` la inyecta Railway automáticamente: no la definas a mano.

3. Deploy y comprueba `https://<algo>.up.railway.app/health`. Debe responder
   `{"status":"ok", ..., "generator":"enabled"}`. Si dice `"no_key"`, falta
   `ANTHROPIC_API_KEY`.

> **Por qué existe `requirements-api.txt`:** `requirements.txt` incluye
> geopandas, rasterio y scikit-learn para análisis offline, pero ningún
> módulo de `src/api` ni `src/ml` los importa. Instalarlos en el servidor
> obliga a compilar GDAL y puede tumbar el build sin aportar nada.

---

## 2. Frontend: Vite en Vercel

1. Vercel → **Add New Project** → importa `Durzs/AprendeLocal`.
2. **Root Directory: `src/frontend`** ← imprescindible, el proyecto no
   está en la raíz del repo.
3. Framework *Vite*; el `vercel.json` ya fija build, output y el rewrite
   SPA que necesita `react-router-dom` (sin él, recargar `/cursos` da 404).
4. **Environment Variables**:

   | Variable | Valor |
   |---|---|
   | `VITE_SUPABASE_URL` | URL del proyecto Supabase |
   | `VITE_SUPABASE_ANON_KEY` | clave **anon** (nunca la service_role) |
   | `VITE_API_URL` | `https://api.aprendelocal.com` |

   Las `VITE_*` se incrustan en el bundle público y son visibles para
   cualquiera. Solo la clave *anon*, protegida con RLS.

5. Cambiar variables **no** basta: hay que redesplegar para que el bundle
   se reconstruya con los nuevos valores.

---

## 2.b Autenticación: lo que rompe el registro

Dos ajustes de Supabase deciden si un usuario nuevo puede entrar. Por defecto
están en el estado que **impide** completar el registro.

1. **Confirmación por correo** (Authentication → Providers → Email). Si está
   activada, `signUp` no devuelve sesión: la cuenta existe pero no sirve hasta
   que el usuario pulse el enlace del correo.
2. **SMTP propio** (Authentication → Emails → SMTP Settings). El remitente
   integrado de Supabase está limitado a unos pocos envíos por hora y es solo
   para pruebas: en producción, la mayoría de los correos de confirmación
   nunca llegan.

Hay dos configuraciones válidas, y hay que elegir una:

| Opción | Qué hacer | Cuándo conviene |
|---|---|---|
| Sin confirmación | Desactivar *Confirm email* | Piloto con docentes, donde cada minuto de fricción cuesta |
| Con confirmación | Configurar SMTP propio (Resend, SendGrid) y fijar **Site URL** y **Redirect URLs** a `https://www.aprendelocal.com` | Producción abierta |

> Si se deja la confirmación activada **sin** SMTP propio, el registro parece
> funcionar y nadie consigue iniciar sesión. Es el estado por defecto, así que
> conviene verificarlo explícitamente.

### URLs de retorno

Si dejas la confirmación activada, el enlace del correo devuelve al usuario a
`/auth/callback`. Esa ruta **tiene que estar permitida** en Supabase →
Authentication → URL Configuration, o Supabase rechaza el retorno:

| Campo | Valor |
|---|---|
| Site URL | `https://www.aprendelocal.com` |
| Redirect URLs | `https://www.aprendelocal.com/auth/callback`<br>`http://localhost:5173/auth/callback` |

El registro pasa `emailRedirectTo` explícitamente, así que no depende solo del
Site URL —que es el ajuste que suele quedarse apuntando a `localhost`—, pero la
URL debe figurar igualmente en la lista blanca.

> El cliente usa el flujo **implícito** a propósito, no PKCE. PKCE exige que el
> verificador guardado al registrarse siga en el mismo navegador, y aquí es
> corriente registrarse en el computador de la escuela y abrir el correo en el
> teléfono. Con PKCE ese caso falla siempre.

Además, el perfil del usuario lo crea un disparador de base de datos, no el
navegador. Aplica `supabase/migrations/0001_perfil_al_registrarse.sql` desde el
SQL Editor: crea la función y el disparador, define las políticas RLS de
`profiles` y rellena los perfiles de las cuentas que quedaron sin él.

---

## 3. Conectar el dominio

En el registrador donde está `aprendelocal.com`:

1. **Vercel** → Project → Settings → Domains → añade `aprendelocal.com` y
   `www.aprendelocal.com`. Vercel mostrará los registros DNS exactos a
   crear (típicamente un `A` en la raíz y un `CNAME` en `www`).
2. **Railway** → Service → Settings → Networking → *Custom Domain* →
   `api.aprendelocal.com`. Railway devolverá un destino `CNAME`.
3. Crea en el registrador exactamente los registros que muestren **esos
   dos paneles**. No copies valores de guías antiguas: Vercel y Railway
   cambian sus destinos y el panel es siempre la fuente de verdad.
4. La propagación DNS suele tardar minutos, pero puede llegar a 48 h.
   Los certificados HTTPS se emiten solos una vez propagado.

### Migrar el dominio desde la cuenta de Vercel actual

`aprendelocal.com` lo sirve hoy un proyecto alojado en **una cuenta de
Vercel ajena**, con una versión desactualizada del sitio.

El detalle que confunde: como el destino también es Vercel, **los
registros DNS son los mismos** en ambas cuentas (la misma IP para la
raíz, el mismo `cname.vercel-dns.com` para `www`). Borrarlos y volver a
crearlos idénticos no cambia nada.

**El bloqueo no está en el DNS, está en Vercel:** un dominio solo puede
pertenecer a un proyecto a la vez, y esa asignación vive en la cuenta,
no en los registros. Mientras el proyecto antiguo lo tenga asignado, el
nuestro lo rechazará por mucho que el DNS ya apunte bien.

Primero hay que averiguar quién gestiona el DNS:

```bash
dig +short NS aprendelocal.com
```

- **Devuelve `ns1.vercel-dns.com` / `ns2.vercel-dns.com`** → el DNS lo
  gestiona Vercel desde la cuenta ajena y no podemos crear ningún
  registro. Hay que cambiar los nameservers en el registrador a los del
  propio registrador antes de cualquier otra cosa.
- **Devuelve los nameservers del registrador** → tenemos el control y se
  puede continuar.

Con el control del DNS confirmado, hay dos formas de liberar el dominio:

1. **Que lo quiten** desde el proyecto antiguo (Settings → Domains →
   Remove). Es instantáneo, pero depende de un tercero.
2. **Verificación por TXT**, que *no* depende de nadie: al añadir el
   dominio, Vercel detecta que está en uso y ofrece verificar la
   propiedad mediante un registro `TXT` llamado `_vercel` con el valor
   que muestre el panel. Creado ese registro en el registrador, Vercel
   traslada el dominio a nuestro proyecto.

Para comprobar a quién resuelve el dominio en cada momento:

```bash
dig +short aprendelocal.com
curl -sI https://aprendelocal.com | grep -i server
```

Verificación final:

```bash
curl -I https://aprendelocal.com          # 200, servido por Vercel
curl  https://api.aprendelocal.com/health # {"status":"ok",...}
```

Y en el navegador, con la consola abierta: si el mapa no carga y ves
errores de CORS, revisa que `CORS_ORIGINS` en Railway incluya el dominio
exacto (con `https://`, sin barra final).

---

## 4. Restaurar el backup de la base de datos

El volcado (`backup.sql` + `data.sql`, generado con `supabase db dump`)
restaura el **contenido de la plataforma**: usuarios, cursos, módulos,
materiales y progreso. No tiene ninguna relación con el dominio.

El orden importa — `data.sql` falla si las tablas no existen todavía:

```bash
psql "$SUPABASE_CONNECTION_STRING" -f backup.sql   # estructura primero
psql "$SUPABASE_CONNECTION_STRING" -f data.sql     # datos después
```

> ⚠️ `data.sql` contiene `password_hash` de usuarios reales y refresh
> tokens de sesión. Guárdalo fuera del repositorio (`.gitignore` ya
> bloquea `backup.sql`, `data.sql` y `backupDB/`) y rota las claves si
> el archivo ha circulado por canales no seguros.

Tras restaurar en un proyecto Supabase **nuevo**, las imágenes de los
cursos seguirán apuntando al Storage del proyecto antiguo
(`https://<ref>.supabase.co/storage/v1/object/public/curso1/...`).
Hay que copiar el bucket `curso1` al nuevo proyecto y actualizar esas
URLs en `module_materials`, o las imágenes se verán rotas.
