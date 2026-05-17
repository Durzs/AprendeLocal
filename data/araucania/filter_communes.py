import geopandas as gpd

gdf = gpd.read_file(r"C:\Users\Diego\OneDrive\OneNote\GitHub\AprendeLocal\data\araucania\communes\shp\comunas.shp")

comunas_piloto = ["Curarrehue", "Melipeuco", "Lonquimay"]
piloto = gdf[gdf["Comuna"].isin(comunas_piloto)]

print(f"Comunas encontradas: {len(piloto)}")
for _, row in piloto.iterrows():
    comuna = row["Comuna"]
    provincia = row["Provincia"]
    region = row["Region"]
    print(f"  {comuna} - {provincia} - {region}")

piloto_wgs84 = piloto.to_crs(epsg=4326)
output = r"C:\Users\Diego\OneDrive\OneNote\GitHub\AprendeLocal\data\araucania\communes\comunas_piloto.geojson"
piloto_wgs84.to_file(output, driver="GeoJSON")
print(f"\nGuardado: comunas_piloto.geojson")
