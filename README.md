# AprendeLocal 🌿

**Sistema de Machine Learning para la creación de proyectos STEM geolocalizados en zonas rurales**

## Visión

AprendeLocal identifica el ecosistema, patrimonio histórico-natural y desafíos de zonas rurales específicas para generar proyectos STEM contextualizados. Utiliza una interfaz geolocalizada que permite a estudiantes y comunidades descubrir oportunidades de aprendizaje vinculadas a su territorio.

## MVP: La Araucanía

El producto mínimo viable se centra en comunas rurales de La Araucanía (Chile), aprovechando:
- Biodiversidad del bosque templado valdiviano y araucarias
- Patrimonio cultural mapuche
- Desafíos locales: gestión hídrica, conservación forestal, agricultura sostenible
- Red de escuelas rurales existente

## Arquitectura

```
┌─────────────────────────────────────────────────┐
│                  Frontend (Mapa)                 │
│         React + Mapbox/Leaflet + PWA            │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│                  API Gateway                     │
│              FastAPI + PostGIS                   │
└──────────┬───────────────────────┬──────────────┘
           │                       │
┌──────────▼──────────┐  ┌────────▼──────────────┐
│   ML Pipeline       │  │   Geo Service          │
│  - Clasificador     │  │  - Tiles/POIs          │
│    ecosistemas      │  │  - Geofencing          │
│  - Generador STEM   │  │  - Rutas              │
│  - NLP patrimonio   │  └───────────────────────┘
└─────────────────────┘
```

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| ML/AI | Python, scikit-learn, Claude API (generación STEM), GDAL |
| Backend | FastAPI, PostgreSQL + PostGIS, Redis |
| Frontend | React, Leaflet/Mapbox GL, PWA (offline-first) |
| Datos geo | OpenStreetMap, CONAF, IDE Chile, Sentinel-2 |
| Infra | AWS (Lambda + RDS) o Railway para MVP |

## Estructura del Proyecto

```
AprendeLocal/
├── src/
│   ├── ml/          # Modelos y pipelines de ML
│   ├── api/         # API REST (FastAPI)
│   ├── geo/         # Servicios geoespaciales
│   └── frontend/    # App web PWA con mapa
├── data/
│   └── araucania/   # Datasets zona piloto
├── docs/            # Documentación del proyecto
├── tests/           # Tests unitarios e integración
└── infra/           # IaC y configuración deploy
```

## Cómo empezar

```bash
# Clonar y configurar entorno
git clone <repo>
cd AprendeLocal
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Licencia

MIT
