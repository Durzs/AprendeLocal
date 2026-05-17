# Diseño Geolocalizado - AprendeLocal

## Concepto de Interfaz

Inspirado en la exploración territorial de Pokemon Go pero orientado al descubrimiento educativo:

### Elementos del Mapa

| Elemento | Analogía Pokemon Go | En AprendeLocal |
|----------|-------------------|-----------------|
| Pokestops | → | **Puntos de Descubrimiento**: lugares con proyectos STEM vinculados |
| Gimnasios | → | **Estaciones STEM**: escuelas o centros comunitarios |
| Pokemon salvaje | → | **Desafíos Locales**: problemas reales que resolver |
| Pokédex | → | **Catálogo Territorial**: especies, ecosistemas, patrimonio descubierto |
| Medallas | → | **Insignias**: logros por proyectos completados (post-MVP) |

### MVP: Mapa Funcional (sin gamificación)

Para el MVP, el mapa es **utilitario pero atractivo**:

```
┌─────────────────────────────────────────┐
│  🗺️  AprendeLocal - Araucanía          │
│  [Filtros: Área STEM ▼] [Nivel ▼]      │
├─────────────────────────────────────────┤
│                                         │
│    ┌──┐  Volcán Llaima                  │
│    │🌋│  ● Proyecto: Monitoreo sísmico  │
│    └──┘  ● Proyecto: Suelos volcánicos  │
│                                         │
│         🌲🌲🌲                          │
│    ┌──┐  Bosque Araucarias              │
│    │🌿│  ● Proyecto: Conteo especies    │
│    └──┘  ● Proyecto: Piñón y nutrición  │
│                                         │
│    ┌──┐  Estero Trancura                │
│    │💧│  ● Proyecto: Calidad de agua    │
│    └──┘                                 │
│                                         │
│    [📍 Mi ubicación]  [📚 Mis proyectos]│
└─────────────────────────────────────────┘
```

### Capas del Mapa

1. **Base**: OpenStreetMap (topografía, caminos, ríos)
2. **Ecosistemas**: Polígonos coloreados por tipo de ecosistema
3. **POIs Educativos**: Marcadores con proyectos STEM disponibles
4. **Patrimonio**: Sitios históricos/culturales
5. **Desafíos**: Íconos de problemas locales identificados

### Interacción MVP

1. Docente abre la app → ve mapa centrado en su comuna
2. Explora el mapa → ve puntos de interés categorizados
3. Toca un punto → ve proyectos STEM disponibles para ese lugar
4. Selecciona proyecto → ve ficha completa con pasos, materiales, currículum
5. Asigna a estudiantes → proyecto queda en "Mis proyectos"

### Offline-First (crítico para zonas rurales)

```
Estrategia de caché:
├── Tiles del mapa: pre-descarga de la comuna (50-100MB)
├── Proyectos STEM: SQLite local con proyectos generados
├── Fichas patrimonio: texto + imágenes comprimidas
└── Sync: cuando hay WiFi, actualiza y sube progreso
```

Tecnología: Service Worker + IndexedDB + Cache API

### Geofencing (post-MVP, hacia Pokemon Go)

En versiones futuras:
- Notificaciones cuando el estudiante está cerca de un POI
- "Descubrimiento" de nuevos datos al visitar un lugar
- Misiones que requieren estar físicamente en el sitio
- Registro fotográfico geotaggeado de observaciones

## Datos Geoespaciales - Araucanía

### Fuentes gratuitas

| Fuente | Dato | Formato |
|--------|------|---------|
| IDE Chile | Cartografía base, límites comunales | SHP/GeoJSON |
| CONAF | Catastro vegetacional, áreas protegidas | SHP |
| Sentinel-2 (ESA) | Imágenes satelitales 10m resolución | GeoTIFF |
| SRTM/ASTER | Modelo digital elevación | GeoTIFF |
| OpenStreetMap | Caminos, ríos, edificios | PBF/GeoJSON |
| CMN | Monumentos nacionales | CSV con coords |
| SERNATUR | Atractivos turísticos | KML/SHP |
| CR2 (U. Chile) | Datos climáticos | NetCDF/CSV |

### Zona Piloto Específica

**Comunas seleccionadas**:
- **Curarrehue**: Parque Nacional Villarrica, termas, cultura mapuche
- **Melipeuco**: Conguillío, araucarias, volcán Llaima
- **Lonquimay**: Reserva Nalcas, pehuén, paso fronterizo

**Bounding box aproximado**: 
- Lat: -38.4 a -39.2
- Lon: -71.2 a -72.0
