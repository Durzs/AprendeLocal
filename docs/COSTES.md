# Estimación de Costes - AprendeLocal MVP

## Modelo: 3 Founders Bootstrap (sin sueldo, equity)

Equipo de 3 fundadores técnicos que cubren desarrollo, diseño y campo.
Sin contrataciones externas salvo puntuales. Dedicación parcial compatible con trabajo/estudios.

---

## Resumen Ejecutivo

| Categoría | Coste (USD) | Coste (CLP aprox.) |
|-----------|-------------|---------------------|
| Infraestructura cloud | $360 | $324,000 |
| APIs (Claude + maps) | $720 | $648,000 |
| Herramientas y licencias | $150 | $135,000 |
| Trabajo de campo | $1,800 | $1,620,000 |
| Hardware mínimo (si necesario) | $400 | $360,000 |
| Contingencia (15%) | $515 | $463,000 |
| **TOTAL MVP (6 meses)** | **~$3,945** | **~$3,550,000 CLP** |

---

## 1. Equipo (3 Founders)

Sin coste monetario. Distribución de roles:

| Founder | Rol principal | Responsabilidades |
|---------|--------------|-------------------|
| Founder 1 | ML + Backend | Pipeline ML, API FastAPI, Claude API, datos geo |
| Founder 2 | Frontend + UX | React, mapa Leaflet, PWA, diseño interfaz |
| Founder 3 | Producto + Campo | Validación terreno, contacto escuelas, contenido, datos patrimonio |

**Dedicación esperada**: 15-25 hrs/semana por founder (compatible con trabajo)
**Valorización en especie**: ~$45,000-60,000 USD (para postulaciones a fondos)

> Los 3 founders cubren TODO el desarrollo. No se contrata freelance.
> Si falta expertise GIS puntual, se resuelve con tutoriales + comunidad open source.

---

## 2. Infraestructura Cloud (6 meses)

Estrategia: **100% tiers gratuitos los primeros 3 meses**, luego escalar solo lo necesario.

| Servicio | Plan | Coste/mes | Total 6m |
|----------|------|-----------|----------|
| Supabase (PostgreSQL + PostGIS + Auth) | Free → Pro | $0 → $25 | $75 |
| Vercel (frontend PWA) | Free | $0 | $0 |
| Railway (API FastAPI) | Starter ($5 crédito) | $0-5 | $0-30 |
| Cloudflare R2 (storage tiles) | Free 10GB | $0 | $0 |
| Cloudflare Pages (CDN) | Free | $0 | $0 |
| Upstash Redis (cache) | Free tier | $0 | $0 |
| Google Colab (training ML) | Free GPU | $0 | $0 |
| **Subtotal** | | | **$75-105** |

**Mes 4-6 (con usuarios piloto):**

| Servicio | Upgrade | Coste/mes | Total 3m |
|----------|---------|-----------|----------|
| Supabase Pro | 8GB, más conexiones | $25 | $75 |
| Railway Pro | API estable | $20 | $60 |
| Upstash Pro | Más requests | $10 | $30 |
| **Subtotal** | | | **$165** |

**Total infra 6 meses: ~$270-360**

---

## 3. APIs y Servicios

| Servicio | Estrategia | Coste/mes | Total 6m |
|----------|-----------|-----------|----------|
| Claude API (Haiku para clasificación, Sonnet para generación) | Caché agresivo, batch | $50-80 | $300-480 |
| Leaflet + OSM tiles | 100% gratuito | $0 | $0 |
| Sentinel-2 (Copernicus) | Open Access | $0 | $0 |
| Google Earth Engine | Free (research) | $0 | $0 |
| Nominatim (geocoding) | Free API | $0 | $0 |
| GitHub (repos, CI/CD) | Free | $0 | $0 |
| **Subtotal** | | | **$300-480** |

**Optimizaciones para reducir Claude API:**
- Prompt caching (system prompt reutilizado): -40% tokens
- Usar Haiku para tareas simples (clasificación): -70% coste vs Sonnet
- Pre-generar proyectos en batch (no en tiempo real): control de gasto
- Cache de respuestas en Redis: misma consulta = $0

**Budget mensual Claude realista: ~$50-80/mes** (no $150-300 como en escenario anterior)

---

## 4. Herramientas y Licencias

| Herramienta | Coste |
|-------------|-------|
| Dominio (.cl) | $15/año → $15 |
| Figma (diseño) | Free tier | $0 |
| Iconos (Heroicons/Lucide) | Open source | $0 |
| Tipografía (Google Fonts) | Free | $0 |
| Ilustraciones (undraw.co) | Free | $0 |
| Certificado SSL | Cloudflare (free) | $0 |
| Email (Resend) | Free tier | $0 |
| Analytics (Plausible self-hosted o Umami) | Free | $0 |
| Notion (gestión proyecto) | Free | $0 |
| **Subtotal** | **$15** |

> Todo el stack de herramientas es gratuito o open source.

---

## 5. Trabajo de Campo (Araucanía)

Asumiendo que Founder 3 (o uno de los founders) tiene conexión con la zona o puede viajar económico:

| Concepto | Detalle | Coste |
|----------|---------|-------|
| Viaje 1: Exploración | Bus Santiago-Temuco ida/vuelta + local | $120 |
| Viaje 2: Taller docentes | Bus + materiales taller | $150 |
| Viaje 3: Piloto estudiantes | Bus + impresiones + materiales | $150 |
| Alojamiento (9 noches total) | Hostal/cabaña compartida | $450 |
| Alimentación en terreno | 9 días × 3 founders | $400 |
| Materiales talleres | Papelería, impresiones, snacks | $150 |
| Chip datos 4G (pruebas conectividad) | Prepago | $30 |
| Traslados locales (colectivos/bus rural) | 3 viajes | $100 |
| **Subtotal** | | **~$1,550** |

**Si un founder es de La Araucanía o vive cerca**: se reduce a ~$600-800 (solo materiales + viajes de los otros).

**Alternativa remota (meses 1-3)**: validar con docentes por videollamada primero, campo solo para piloto final. Reduce a ~$700.

---

## 6. Hardware (solo si es necesario)

| Item | Necesidad | Coste |
|------|-----------|-------|
| Tablets usadas para testing (2-3) | Piloto con estudiantes | $200-300 |
| Router 4G portátil | Testing offline/sync | $50-80 |
| Disco externo (datos satelitales) | 1TB para tiles | $50 |
| **Subtotal** | | **$300-430** |

> Si las escuelas tienen computadores o los founders ya tienen tablets, este coste es $0.

---

## 7. Timeline y Gasto Mensual

| Mes | Fase | Gasto estimado |
|-----|------|----------------|
| 1 | Setup + recolección datos | $50 (solo API) |
| 2 | ML pipeline + backend base | $80 (API + infra) |
| 3 | Frontend mapa + integración | $80 |
| 4 | Viaje campo 1 + testing | $600 (campo + infra upgrade) |
| 5 | Piloto escuelas | $700 (campo + API más uso) |
| 6 | Iteración + estabilización | $200 |
| **Total** | | **~$1,710 operativo** |

+ Hardware ($400) + Contingencia ($515) = **~$3,945 total**

---

## 8. Comparación: Lo que NO están pagando (y sí usan)

| Recurso gratuito | Valor de mercado |
|-----------------|-----------------|
| Supabase free (PostgreSQL + PostGIS + Auth + Storage) | $300/año |
| Vercel free (hosting + CDN global) | $240/año |
| OpenStreetMap (cartografía mundial) | Incalculable |
| Sentinel-2 (imágenes satelitales 10m) | $10,000+/año si fueran comerciales |
| Google Earth Engine | $5,000+/año |
| CONAF catastro vegetacional | Dato público único |
| Google Colab GPU | $500/año en cloud |
| Cloudflare (CDN + DNS + SSL + R2) | $600/año |
| **Valor en especie tecnológico** | **~$17,000+/año** |

---

## 9. Riesgos Financieros y Mitigación

| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| Claude API sube de precio | +$200-400 | Modelos open source como fallback (Llama) |
| Supabase elimina free tier | +$25/mes | Migrar a self-hosted PostgreSQL en Railway |
| Necesitan más GPU | +$100-200 | Kaggle notebooks, Colab Pro ($10/mes) |
| Piloto requiere más viajes | +$500-1000 | Buscar alianza con universidad local (UFRO) |
| Un founder sale del proyecto | Retraso | Documentar todo, código limpio desde día 1 |

---

## 10. Escalamiento Post-MVP (cuando buscar financiamiento)

**Señales para buscar fondo:**
- 10+ docentes usando la plataforma activamente
- 3+ escuelas en piloto confirmado
- Métricas de uso que demuestren impacto

**Fondos objetivo (Chile):**

| Fuente | Monto | Timing |
|--------|-------|--------|
| Start-Up Chile (Seed) | $25M CLP (~$28K USD) | Mes 6-8, con MVP validado |
| CORFO Semilla Inicia | $20-40M CLP | Mes 8-10 |
| Fundación Chile / BHP Foundation | Variable | Con impacto demostrado |
| Google.org AI for Social Good | $50-200K USD | Mes 10-12 |

**Con MVP validado y métricas, el pitch es infinitamente más fuerte que solo una idea.**

---

## Resumen Final

```
┌─────────────────────────────────────────┐
│  COSTE REAL PARA 3 FOUNDERS: ~$3,945    │
│                                         │
│  Desglose:                              │
│  ├── Infra cloud:     $360  (9%)        │
│  ├── Claude API:      $720  (18%)       │
│  ├── Herramientas:    $150  (4%)        │
│  ├── Campo:          $1,800 (46%)       │
│  ├── Hardware:        $400  (10%)       │
│  └── Contingencia:    $515  (13%)       │
│                                         │
│  💡 El 46% del coste es ir a terreno.   │
│     Si un founder es local, baja a      │
│     ~$2,500 total.                      │
└─────────────────────────────────────────┘
```

---

## Notas

- Tipo de cambio: 1 USD ≈ 900 CLP
- Todos los founders trabajan sin sueldo a cambio de equity
- La estrategia es llegar a MVP validado con mínimo gasto, luego buscar fondo
- Priorizar siempre: free tiers → open source → lo más barato
- El mayor "coste" real es el tiempo de los founders (~1,500 hrs totales entre los 3)
