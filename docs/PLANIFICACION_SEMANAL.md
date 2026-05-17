# Planificación Semanal - AprendeLocal MVP (2 Founders)

## Equipo

| Founder | Perfil | Responsabilidades |
|---------|--------|-------------------|
| **F1** (Tech) | ML + Backend + Infra | Pipeline ML, API FastAPI, Claude API, PostGIS, deploy |
| **F2** (Product) | Frontend + UX + Campo | React/Leaflet, diseño, datos patrimonio, contacto escuelas, terreno |

Ambos son técnicos. F2 también lleva la relación con usuarios y contenido.

---

## Rutina Semanal

```
┌────────────────────────────────────────────────────────┐
│  LUNES     → Sync #1 (45min, videollamada)             │
│              - Review de lo hecho la semana anterior    │
│              - Bloqueos y decisiones                   │
│              - Prioridades de la semana                │
│                                                        │
│  MAR-JUE   → Trabajo individual (12-18 hrs/semana)    │
│              - Cada uno en su track                    │
│              - Mensajes async por WhatsApp/Slack       │
│                                                        │
│  JUEVES    → Sync #2 (30min, videollamada)             │
│              - Mini-demo de lo avanzado                │
│              - Ajustes de rumbo si algo se traba       │
│              - Merge a main + deploy                   │
│                                                        │
│  VIE-DOM   → Trabajo flexible + descanso              │
└────────────────────────────────────────────────────────┘
```

**Dedicación**: ~15-20 hrs/semana por founder (compatible con trabajo/estudios)
**Total equipo**: ~30-40 hrs/semana combinadas

---

## Fase 0: Setup (Semana 1-2)

### Semana 1 — Cimientos

| Founder | Tareas | Entregable |
|---------|--------|-----------|
| F1 | Crear repo GitHub, setup Python + FastAPI + Supabase PostGIS, descargar datos CONAF | Repo listo, DB corriendo, datos raw en /data |
| F2 | Init React + Vite + Leaflet, mapa base Araucanía, identificar 10 POIs reales | Mapa renderizando con marcadores placeholder |

**Sync Lunes**: Definir las 3 comunas piloto exactas.
**Sync Jueves**: Ambos ven el mapa + el backend conectados.

### Semana 2 — Datos y contenido

| Founder | Tareas | Entregable |
|---------|--------|-----------|
| F1 | Script Sentinel-2 (NDVI), esquema DB ecosistemas, endpoint GET /points | Pipeline: coordenadas → features básicas |
| F2 | 10 fichas POI en JSON (nombre, coords, descripción, tipo), panel lateral en mapa | Click en marcador → muestra ficha del lugar |

---

## Fase 1: ML + Generación (Semana 3-7)

### Semana 3 — Clasificador ecosistemas

| Founder | Tareas | Entregable |
|---------|--------|-----------|
| F1 | Cruzar CONAF + Sentinel-2, dataset entrenamiento, Random Forest para 5 tipos ecosistema | Modelo accuracy >80%, endpoint GET /ecosystem/:coords |
| F2 | Polígonos ecosistemas en mapa (coloreados), leyenda, 10 POIs más (20 total) | Mapa con capas de vegetación |

### Semana 4 — Generador STEM v0

| Founder | Tareas | Entregable |
|---------|--------|-----------|
| F1 | Integrar Claude API, system prompt + few-shot, POST /generate-project | 10 proyectos STEM generados automáticamente |
| F2 | Componente ficha proyecto (título, materiales, pasos), contactar 2 docentes | Ficha renderizada + feedback de 1 docente |

### Semana 5 — Integración end-to-end

| Founder | Tareas | Entregable |
|---------|--------|-----------|
| F1 | API completa (GET /points, /projects, POST /generate), caché Redis | Backend funcional |
| F2 | Conectar frontend a API, flujo: mapa → punto → proyectos → ficha | Demo completa funcionando |

### Semana 6 — Batch + Offline

| Founder | Tareas | Entregable |
|---------|--------|-----------|
| F1 | Pre-generar 50 proyectos en batch, guardar en DB, optimizar queries | Proyectos listos sin depender de API real-time |
| F2 | Service worker: cache tiles + proyectos, funcionar sin internet | App usable offline |

### Semana 7 — Buffer y polish

| Founder | Tareas | Entregable |
|---------|--------|-----------|
| F1 | Fix bugs, tests básicos, documentar API | Sistema estable |
| F2 | Completar 30 POIs, testing mobile, responsive fixes | Base de contenido sólida |

> **Semana 7 es colchón.** Si van bien, adelantan Fase 2. Si hubo bloqueos, recuperan aquí.

---

## Fase 2: Producción (Semana 8-11)

### Semana 8 — Auth + Panel docente

| Founder | Tareas | Entregable |
|---------|--------|-----------|
| F1 | Auth Supabase (login docente), modelo datos docente → escuela | Login funcional |
| F2 | Panel docente: filtrar proyectos por área/nivel, "asignar a mi curso" | Interfaz docente |

### Semana 9 — Filtros + Búsqueda

| Founder | Tareas | Entregable |
|---------|--------|-----------|
| F1 | Filtros API (área STEM, nivel, comuna), rate limiting, logs | API robusta |
| F2 | UI filtros + buscador, Lighthouse >80, onboarding flow | UX pulida |

### Semana 10 — Deploy producción

| Founder | Tareas | Entregable |
|---------|--------|-----------|
| F1 | Deploy Railway + Supabase Pro, dominio, HTTPS, monitoreo | aprendelocal.cl live |
| F2 | Testing final 3 dispositivos, tutorial in-app, guía docente 1 página | Listo para usuarios reales |

### Semana 11 — Buffer pre-piloto

| Founder | Tareas | Entregable |
|---------|--------|-----------|
| F1 | Fixes post-deploy, analytics básicos | Prod estable |
| F2 | Preparar taller: agenda, materiales, formularios, reclutar 5 docentes | Piloto agendado |

---

## Fase 3: Piloto (Semana 12-16)

### Semana 12 — Taller docentes

| Founder | Tareas | Entregable |
|---------|--------|-----------|
| F1 | Soporte técnico remoto, monitorear errores, hotfixes | Sistema estable bajo carga |
| F2 | **Viaje 1**: Taller presencial con 4-5 docentes (3hrs), enseñar plataforma | Docentes activos en la app |

### Semana 13 — Uso real + iteración

| Founder | Tareas | Entregable |
|---------|--------|-----------|
| F1 | Implementar top 3 fixes del feedback, optimizar para 3G rural | Mejoras desplegadas |
| F2 | Seguimiento remoto docentes (WhatsApp), documentar uso, ajustar UX | Evidencia de uso |

### Semana 14 — Testing estudiantes

| Founder | Tareas | Entregable |
|---------|--------|-----------|
| F1 | Reducir payloads, comprimir, versión student-friendly del contenido | App rápida en celulares baratos |
| F2 | **Viaje 2**: Observar sesión con estudiantes, fotos/video, medir engagement | Testimonios + métricas cualitativas |

### Semana 15 — Cierre piloto

| Founder | Tareas | Entregable |
|---------|--------|-----------|
| F1 | Extraer métricas (usuarios, proyectos vistos, retención), dashboard | KPIs del piloto |
| F2 | Encuesta cierre docentes, compilar resultados, caso de éxito escrito | Reporte final piloto |

### Semana 16 — Buffer iteración

| Founder | Tareas | Entregable |
|---------|--------|-----------|
| Ambos | Implementar top 5 mejoras del piloto, fix bugs críticos | Release v0.1.0 estable |

---

## Fase 4: Pitch (Semana 17-20)

### Semana 17-18 — Preparar postulación

| Founder | Tareas |
|---------|--------|
| F1 | Video demo técnico (2 min), documentar arquitectura para evaluadores |
| F2 | Pitch deck con métricas reales, redactar postulación Start-Up Chile / CORFO |

### Semana 19-20 — Enviar + networking

| Founder | Tareas |
|---------|--------|
| Ambos | Enviar postulación, contactar mentores, preparar pitch oral |
| F2 | Agregar 1-2 comunas más si hay demanda orgánica |

---

## Calendario Visual (20 semanas)

```
S1  S2  S3  S4  S5  S6  S7  S8  S9  S10 S11 S12 S13 S14 S15 S16 S17 S18 S19 S20
├───┤───┤───┤───┤───┤───┤───┤───┤───┤───┤───┤───┤───┤───┤───┤───┤───┤───┤───┤───┤
│SETUP │    ML + GENERACIÓN    │BUF│  PRODUCCIÓN   │BUF│     PILOTO      │BUF│ PITCH │
└───────┴───────────────────────┴───┴───────────────┴───┴─────────────────┴───┴───────┘
         ▲                           ▲                   ▲           ▲
         │                           │                   │           │
    Demo interna               Prod live            Viaje 1      Viaje 2
    (semana 5)                (semana 10)          (semana 12)  (semana 14)
```

---

## Hitos Go/No-Go

| Semana | Hito | Si NO se cumple... |
|--------|------|---------------------|
| 2 | Mapa con 10 POIs reales | Revisar si el stack es correcto |
| 5 | Demo end-to-end (mapa → proyecto STEM) | Simplificar alcance |
| 7 | 1 docente valida "esto lo usaría" | Pivotar contenido o zona |
| 10 | URL pública funcionando | Retrasar piloto 2 semanas |
| 15 | 4+ docentes usaron la app | Evaluar si el producto tiene fit |

---

## Reglas del Equipo

1. **No heroísmos**: si algo toma más de 4hrs y no avanza, pedir ayuda en el próximo sync
2. **Main siempre deployable**: no mergear cosas rotas
3. **Jueves = demo**: aunque sea pequeña, mostrar algo funcionando
4. **Campo valida todo**: ninguna feature se da por terminada sin feedback de un docente
5. **Scope flexible**: si algo no cabe en la semana, se mueve — no se trabaja de más

---

## Para Empezar HOY

```
F1:
  1. git init en C:\Users\Diego\source\AprendeLocal
  2. pip install fastapi uvicorn anthropic geopandas rasterio
  3. Crear endpoint /health en src/api/
  4. Configurar Supabase free tier

F2:
  1. cd src/frontend && npx create-vite@latest . --template react-ts
  2. npm install leaflet react-leaflet
  3. Renderizar mapa centrado en (-38.7, -71.5) zoom 9
  4. Buscar en ide.cl los shapefiles de Araucanía

Ambos:
  - Agendar Sync #1 (lunes) y Sync #2 (jueves)
  - Crear canal WhatsApp/Slack del proyecto
  - Primer commit conjunto el jueves
```
