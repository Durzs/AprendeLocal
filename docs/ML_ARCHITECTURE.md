# Arquitectura ML - AprendeLocal

## Modelos del Sistema

### Modelo 1: Clasificador de Ecosistemas

**Propósito**: Identificar tipo de ecosistema, vegetación dominante y biodiversidad de una zona geográfica.

**Inputs**:
- Coordenadas geográficas (lat, lon, radio)
- Imágenes Sentinel-2 (bandas RGB + NIR + SWIR)
- Datos catastro CONAF
- Elevación (DEM SRTM)
- Precipitación/temperatura (datos CR2)

**Output**:
```json
{
  "ecosystem_type": "bosque_templado_valdiviano",
  "vegetation": ["araucaria_araucana", "nothofagus_dombeyi", "fitzroya_cupressoides"],
  "biodiversity_index": 0.82,
  "conservation_status": "vulnerable",
  "key_species": ["pudu", "monito_del_monte", "carpintero_negro"],
  "threats": ["incendios_forestales", "tala_ilegal", "cambio_climatico"]
}
```

**Approach MVP**: Random Forest sobre features extraídas de Sentinel-2 (NDVI, EVI) + lookup tables CONAF. No requiere deep learning para el MVP.

---

### Modelo 2: Extractor de Patrimonio (NLP)

**Propósito**: Extraer y estructurar información patrimonial de fuentes textuales.

**Inputs**:
- Textos de Biblioteca Nacional Digital
- Fichas CMN (Consejo de Monumentos Nacionales)
- Registros SERNATUR
- Wikipedia / Wikidata
- Relatos orales transcritos (si disponibles)

**Output**:
```json
{
  "heritage_sites": [
    {
      "name": "Parque Nacional Conguillío",
      "type": "natural",
      "significance": "Bosque de araucarias milenarias, declarado Reserva de la Biosfera",
      "location": [-38.65, -71.63],
      "stem_connections": ["geología_volcánica", "ecología_bosques", "cambio_climático"]
    }
  ],
  "cultural_elements": [
    {
      "name": "Nguillatún",
      "type": "intangible_cultural",
      "description": "Ceremonia mapuche de agradecimiento a la tierra",
      "stem_connections": ["astronomía_mapuche", "ciclos_agrícolas", "etnobotánica"]
    }
  ]
}
```

**Approach MVP**: Claude API con prompts especializados + RAG sobre corpus curado. Sin entrenamiento custom.

---

### Modelo 3: Generador de Proyectos STEM

**Propósito**: Generar proyectos STEM contextualizados a partir del perfil territorial.

**Inputs**:
- Perfil ecosistema (output Modelo 1)
- Patrimonio local (output Modelo 2)
- Desafíos identificados de la zona
- Nivel educativo objetivo
- Área STEM preferida
- Recursos disponibles en la escuela

**Output**:
```json
{
  "project": {
    "title": "Monitoreo de calidad de agua en el estero Trancura",
    "stem_areas": ["biología", "química", "tecnología"],
    "level": "7°-8° básico",
    "duration": "4 semanas",
    "local_connection": "El estero Trancura alimenta el lago Villarrica...",
    "objectives": ["..."],
    "materials": ["sensor pH (bajo costo)", "termómetro", "frascos"],
    "steps": ["..."],
    "expected_outcomes": ["..."],
    "curriculum_alignment": ["OA5 CN 7°", "OA8 CN 8°"]
  }
}
```

**Approach MVP**: Claude API con system prompt detallado + few-shot examples curados por pedagogos. Validación humana post-generación.

---

## Pipeline de Datos

```
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
│  Sentinel-2 │───▶│ Preproceso   │───▶│ Feature Store   │
│  CONAF      │    │ (GDAL/rasterio)   │ (PostGIS)       │
│  DEM        │    └──────────────┘    └────────┬────────┘
└─────────────┘                                  │
                                                 ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
│  Textos CMN │───▶│ NLP Extract  │───▶│ Knowledge Base  │
│  Wikipedia  │    │ (Claude API) │    │ (PostgreSQL)    │
│  SERNATUR   │    └──────────────┘    └────────┬────────┘
└─────────────┘                                  │
                                                 ▼
                                       ┌─────────────────┐
                                       │ STEM Generator   │
                                       │ (Claude API +    │
                                       │  context window) │
                                       └─────────────────┘
```

## Tecnologías ML

| Componente | Librería | Justificación |
|-----------|----------|---------------|
| Geo-procesamiento | rasterio, GDAL, geopandas | Standard GIS en Python |
| Clasificación ecosistemas | scikit-learn (RF/XGBoost) | Suficiente para MVP con features tabulares |
| NLP / Generación | Claude API (claude-sonnet-4-6) | Calidad generación, zero-shot learning |
| Embeddings búsqueda | voyage-3 o text-embedding-3-small | RAG sobre corpus patrimonial |
| Vector store | pgvector (en PostGIS) | Un solo DB para geo + vectores |
| Orquestación | Prefect o scripts cron | MVP no necesita Airflow |
