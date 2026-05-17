from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AprendeLocal API",
    version="0.1.0",
    description="API para proyectos STEM geolocalizados en zonas rurales",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "version": "0.1.0",
        "zone": "araucania",
    }


@app.get("/points")
async def get_points():
    """Retorna puntos de interés educativos de la zona piloto."""
    # TODO: conectar a PostGIS
    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [-71.58, -38.65]},
                "properties": {
                    "id": "conguillio",
                    "name": "Parque Nacional Conguillío",
                    "type": "natural",
                    "ecosystem": "bosque_araucaria",
                    "commune": "Melipeuco",
                },
            },
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [-71.63, -39.42]},
                "properties": {
                    "id": "villarrica_volcano",
                    "name": "Volcán Villarrica",
                    "type": "geological",
                    "ecosystem": "zona_volcanica",
                    "commune": "Curarrehue",
                },
            },
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [-71.47, -38.43]},
                "properties": {
                    "id": "reserva_nalcas",
                    "name": "Reserva Nacional Nalcas",
                    "type": "natural",
                    "ecosystem": "bosque_araucaria",
                    "commune": "Lonquimay",
                },
            },
        ],
    }
