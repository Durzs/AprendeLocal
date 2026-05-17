# Datos Araucanía - Links Actualizados (Mayo 2026)

## 1. CONAF - Catastro Vegetacional (bosques, vegetación)
- **SIT CONAF**: https://sit.conaf.cl/
- **Info catastro**: https://www.conaf.cl/regulacion/informacion-geografica-o-territorial/catastro-vegetacional/
- Formato: Shapefile (.shp)
- Buscar: Región de La Araucanía (IX)

## 2. Límites comunales (polígonos de comunas)
- **IDE SUBDERE**: https://ide.subdere.gov.cl/
- **Geoportal Chile**: https://geoportal.cl/
- **Datos Abiertos Chile**: https://datos.gob.cl/organization/infraestructura-de-datos-geoespaciales-de-chile
- **INE Geodatos**: https://www.ine.gob.cl/herramientas/portal-de-mapas/geodatos-abiertos
- Formato: Shapefile / GeoJSON

## 3. Imágenes Satelitales Sentinel-2
- **Copernicus Browser**: https://browser.dataspace.copernicus.eu/
- Gratis, sin registro para browsear
- Filtrar por fecha (verano: enero-marzo) y nubosidad (<20%)
- Zona: centrar en (-38.7, -71.5), cubrir Araucanía cordillerana

## 4. Modelo de Elevación (DEM)
- **USGS Earth Explorer**: https://earthexplorer.usgs.gov/
  - Data Sets → Digital Elevation → SRTM 1-ArcSecond Global
- **OpenTopography**: https://portal.opentopography.org/dataCatalog?loc=Chile
- Resolución: 30m

## 5. Portal central (buscar todo)
- **Geoportal Chile**: https://geoportal.cl/ (1,000+ capas disponibles)
- **IDE Minagri**: https://ide.minagri.gob.cl/geoweb/

## Estructura esperada

```
araucania/
├── conaf/          # Shapefiles catastro vegetacional
├── communes/       # Límites comunales GeoJSON
├── sentinel/       # Imágenes Sentinel-2 (GeoTIFF)
├── dem/            # Modelo elevación
├── heritage/       # POIs patrimonio (JSON curado)
└── pois.json       # Puntos de interés educativos (ya creado)
```

## Por dónde empezar

1. **Geoportal Chile** (https://geoportal.cl/) → buscar "límites comunales" → descargar Araucanía
2. **SIT CONAF** (https://sit.conaf.cl/) → buscar catastro Región IX
3. **Copernicus Browser** → navegar a La Araucanía, descargar imagen de verano reciente
