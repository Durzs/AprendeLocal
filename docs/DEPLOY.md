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

### Migrar el dominio desde el GitHub Pages antiguo

`aprendelocal.com` lo sirve hoy un repositorio de GitHub Pages ajeno y
desactualizado, al que no tenemos acceso. **No hace falta su
cooperación:** la exclusividad del dominio solo aplica *dentro* de
GitHub Pages. Al apuntar el DNS a Vercel, ese repositorio deja de
recibir tráfico aunque conserve el dominio en su configuración.

Lo que sí hay que hacer con cuidado en el registrador:

1. **Elimina los registros `A` que apuntan a GitHub Pages.** Son estas
   cuatro IPs:

   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

   Si se dejan conviviendo con el registro de Vercel, el DNS reparte
   las visitas entre ambos y el sitio carga a veces el nuevo y a veces
   el viejo, de forma intermitente y muy difícil de diagnosticar.

2. Borra también el `CNAME` de `www` si apunta a `<usuario>.github.io`.

3. Recién entonces crea los registros que indique el panel de Vercel.

Para comprobar a quién resuelve el dominio en cada momento:

```bash
dig +short aprendelocal.com          # no debe devolver ninguna 185.199.x.x
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
