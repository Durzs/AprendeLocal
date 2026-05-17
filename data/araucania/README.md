# Datos Araucanía

## Fuentes a descargar

### 1. CONAF - Catastro Vegetacional
- URL: https://www.conaf.cl/nuestros-bosques/bosques-en-chile/catastro-vegetacional/
- Formato: Shapefile (.shp)
- Descargar: Región de La Araucanía (IX)

### 2. IDE Chile - Límites comunales
- URL: https://www.ide.cl/index.php/informacion-territorial/descargar-capas
- Formato: GeoJSON / Shapefile
- Descargar: División comunal, filtrar Curarrehue, Melipeuco, Lonquimay

### 3. Sentinel-2 - Imágenes satelitales
- URL: https://dataspace.copernicus.eu/
- Bandas: B02 (Blue), B03 (Green), B04 (Red), B08 (NIR), B11 (SWIR)
- Zona: Tiles T18GYS y T18GYT (cubren Araucanía cordillerana)
- Fecha: verano reciente (enero-marzo) para máximo NDVI

### 4. DEM - Modelo de elevación
- URL: https://earthexplorer.usgs.gov/ (SRTM 30m)
- Zona: S39W072, S39W071

### 5. CMN - Monumentos Nacionales
- URL: https://www.monumentos.gob.cl/
- Buscar: Región de La Araucanía

## Estructura esperada

```
araucania/
├── conaf/          # Shapefiles catastro vegetacional
├── communes/       # Límites comunales GeoJSON
├── sentinel/       # Imágenes Sentinel-2 (GeoTIFF)
├── dem/            # Modelo elevación
├── heritage/       # POIs patrimonio (JSON curado)
└── pois.json       # Puntos de interés educativos
```
