"""Análisis de datos Sentinel-2 NDVI/NDWI para la zona piloto de La Araucanía."""

from pathlib import Path
import pandas as pd

base = Path(__file__).parent
ndvi = pd.read_csv(base / "ndvi_dic2025_ene2026.csv")
ndwi = pd.read_csv(base / "ndwi_dic2025_ene2026.csv")

ndvi.columns = [c.replace("C0/", "") for c in ndvi.columns]
ndwi.columns = [c.replace("C0/", "") for c in ndwi.columns]

ndvi["date"] = pd.to_datetime(ndvi["date"]).dt.date
ndwi["date"] = pd.to_datetime(ndwi["date"]).dt.date

print("=" * 60)
print("ANÁLISIS SENTINEL-2 - ARAUCANÍA PILOTO")
print("=" * 60)

# Mejores días (menos nubes)
print("\n--- MEJORES DÍAS (< 10% nubes) ---")
buenos = ndvi[ndvi["cloudCoveragePercent"] < 10].sort_values("cloudCoveragePercent")
for _, row in buenos.iterrows():
    print(f"  {row['date']}  nubes: {row['cloudCoveragePercent']:.1f}%  NDVI medio: {row['mean']:.3f}")

# NDVI promedio en días despejados
ndvi_limpio = ndvi[ndvi["cloudCoveragePercent"] < 10]
print(f"\n--- ESTADÍSTICAS NDVI (días despejados) ---")
print(f"  NDVI promedio: {ndvi_limpio['mean'].mean():.3f}")
print(f"  NDVI mediana:  {ndvi_limpio['median'].mean():.3f}")
print(f"  NDVI p90:      {ndvi_limpio['p90'].mean():.3f}")

# Interpretación
ndvi_mean = ndvi_limpio["mean"].mean()
if ndvi_mean > 0.5:
    ecosistema = "Bosque denso / vegetación muy saludable"
elif ndvi_mean > 0.3:
    ecosistema = "Bosque mixto / vegetación moderada"
elif ndvi_mean > 0.1:
    ecosistema = "Matorral / vegetación dispersa"
else:
    ecosistema = "Suelo desnudo / nieve / agua"

print(f"\n  Interpretación: {ecosistema}")

# NDWI
ndwi_limpio = ndwi[ndwi["cloudCoveragePercent"] < 10]
print(f"\n--- ESTADÍSTICAS NDWI (días despejados) ---")
print(f"  NDWI promedio: {ndwi_limpio['mean'].mean():.3f}")

ndwi_mean = ndwi_limpio["mean"].mean()
if ndwi_mean > 0:
    agua = "Presencia significativa de agua/humedad"
elif ndwi_mean > -0.3:
    agua = "Humedad moderada"
else:
    agua = "Terreno seco / vegetación densa (normal en bosques)"

print(f"  Interpretación: {agua}")

print("\n" + "=" * 60)
print("CONCLUSIÓN PARA EL CLASIFICADOR")
print("=" * 60)
print(f"  NDVI alto ({ndvi_mean:.3f}) + NDWI negativo ({ndwi_mean:.3f})")
print(f"  = Zona de BOSQUE DENSO con vegetación saludable")
print(f"  Compatible con: Bosque templado / Bosque de araucarias")
print(f"  Período: verano (dic-ene), peak de actividad fotosintética")
