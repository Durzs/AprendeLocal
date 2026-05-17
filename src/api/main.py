from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from .database import get_supabase

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
async def get_points(
    commune: str | None = Query(None, description="Filtrar por comuna"),
    ecosystem: str | None = Query(None, description="Filtrar por tipo de ecosistema"),
):
    """Retorna puntos de interés educativos en formato GeoJSON."""
    sb = get_supabase()
    query = sb.table("points_of_interest").select("*")

    if commune:
        query = query.eq("commune", commune)
    if ecosystem:
        query = query.eq("ecosystem_type", ecosystem)

    result = query.execute()

    features = []
    for row in result.data:
        loc = row.get("location")
        coords = _parse_point(loc) if loc else [0, 0]
        features.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": coords},
            "properties": {
                "id": row["id"],
                "name": row["name"],
                "type": row["type"],
                "ecosystem": row.get("ecosystem_type"),
                "commune": row["commune"],
                "description": row.get("description"),
                "stem_areas": row.get("stem_areas", []),
                "heritage_type": row.get("heritage_type"),
                "threats": row.get("threats", []),
            },
        })

    return {"type": "FeatureCollection", "features": features}


@app.get("/points/{point_id}")
async def get_point(point_id: str):
    """Retorna un punto de interés específico."""
    sb = get_supabase()
    result = sb.table("points_of_interest").select("*").eq("id", point_id).execute()

    if not result.data:
        return {"error": "Punto no encontrado"}

    row = result.data[0]
    loc = row.get("location")
    coords = _parse_point(loc) if loc else [0, 0]

    return {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": coords},
        "properties": {
            "id": row["id"],
            "name": row["name"],
            "type": row["type"],
            "ecosystem": row.get("ecosystem_type"),
            "commune": row["commune"],
            "description": row.get("description"),
            "stem_areas": row.get("stem_areas", []),
            "heritage_type": row.get("heritage_type"),
            "threats": row.get("threats", []),
        },
    }


@app.get("/points/{point_id}/projects")
async def get_projects_for_point(point_id: str):
    """Retorna proyectos STEM asociados a un punto de interés."""
    sb = get_supabase()
    result = (
        sb.table("stem_projects")
        .select("*")
        .eq("point_of_interest_id", point_id)
        .execute()
    )
    return {"projects": result.data}


@app.get("/projects")
async def get_projects(
    stem_area: str | None = Query(None, description="Filtrar por área STEM"),
    level: str | None = Query(None, description="Filtrar por nivel educativo"),
    commune: str | None = Query(None, description="Filtrar por comuna"),
):
    """Retorna proyectos STEM con filtros opcionales."""
    sb = get_supabase()
    query = sb.table("stem_projects").select("*")

    if level:
        query = query.eq("level", level)
    if stem_area:
        query = query.contains("stem_areas", [stem_area])

    result = query.execute()
    return {"projects": result.data}


@app.get("/communes")
async def get_communes():
    """Retorna las comunas disponibles en la zona piloto."""
    sb = get_supabase()
    result = (
        sb.table("points_of_interest")
        .select("commune")
        .execute()
    )
    communes = sorted(set(row["commune"] for row in result.data))
    return {"communes": communes}


def _parse_point(location_str: str) -> list[float]:
    """Parsea coordenadas de PostGIS POINT a [lon, lat]."""
    if not location_str:
        return [0, 0]
    try:
        clean = location_str.replace("POINT(", "").replace(")", "").strip()
        parts = clean.split()
        return [float(parts[0]), float(parts[1])]
    except (ValueError, IndexError):
        return [0, 0]
