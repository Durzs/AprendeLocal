from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .config import settings
from .database import get_supabase

app = FastAPI(
    title="AprendeLocal API",
    version="0.2.0",
    description="API para proyectos STEM geolocalizados en zonas rurales",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Modelos de request ──────────────────────────────────────────────

class GenerateRequest(BaseModel):
    """Lo que el frontend envía para pedir un proyecto STEM."""
    point_id: str
    level: str = "basica_segundo_ciclo"
    count: int = 1  # Cuántos proyectos generar (1-3)


# ── Endpoints existentes ─────────────────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "version": "0.2.0",
        "zone": "araucania",
        "generator": "enabled" if settings.anthropic_api_key else "no_key",
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
        raise HTTPException(status_code=404, detail="Punto no encontrado")

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


# ── NUEVO: Generación de proyectos STEM ──────────────────────────────

@app.post("/generate-project")
async def generate_project(req: GenerateRequest):
    """Genera proyectos STEM para un punto de interés usando Claude API.

    Flujo:
    1. Busca el punto de interés en Supabase
    2. Arma el contexto territorial (ecosistema, amenazas, etc.)
    3. Le pide a Claude que genere el proyecto
    4. Guarda el proyecto en la tabla stem_projects
    5. Retorna el proyecto al frontend
    """
    # Verificar que tenemos API key
    if not settings.anthropic_api_key:
        raise HTTPException(
            status_code=503,
            detail="Generador no configurado: falta ANTHROPIC_API_KEY en .env"
        )

    sb = get_supabase()

    # 1. Buscar el punto de interés
    poi_result = (
        sb.table("points_of_interest")
        .select("*")
        .eq("id", req.point_id)
        .execute()
    )

    if not poi_result.data:
        raise HTTPException(status_code=404, detail="Punto de interés no encontrado")

    poi = poi_result.data[0]

    # 2. Revisar si ya hay proyectos generados para este punto
    existing = (
        sb.table("stem_projects")
        .select("*")
        .eq("point_of_interest_id", req.point_id)
        .execute()
    )

    if existing.data and len(existing.data) >= 3:
        # Ya hay suficientes proyectos, retornar los existentes
        return {
            "projects": existing.data,
            "source": "cache",
            "message": f"Ya existen {len(existing.data)} proyectos para este punto"
        }

    # 3. Armar contexto territorial
    from ..ml.stem_generator import STEMGenerator, TerritorialContext

    context = TerritorialContext(
        name=poi["name"],
        ecosystem_type=poi.get("ecosystem_type", "desconocido"),
        commune=poi["commune"],
        description=poi.get("description", ""),
        stem_areas=poi.get("stem_areas", []),
        heritage_type=poi.get("heritage_type", ""),
        threats=poi.get("threats", []),
        student_level=req.level,
    )

    # 4. Generar con Claude
    generator = STEMGenerator(api_key=settings.anthropic_api_key)

    count = min(req.count, 3)  # Máximo 3 por request
    if count == 1:
        projects = [await generator.generate_project(context)]
    else:
        projects = await generator.generate_batch(context, count=count)

    # 5. Guardar en Supabase
    saved_projects = []
    for project in projects:
        if "error" in project:
            saved_projects.append(project)
            continue

        row = {
            "title": project.get("title", "Sin título"),
            "stem_areas": project.get("stem_areas", []),
            "level": project.get("level", req.level),
            "duration": project.get("duration", ""),
            "local_connection": project.get("local_connection", ""),
            "objectives": project.get("objectives", []),
            "materials": project.get("materials", []),
            "steps": project.get("steps", []),
            "expected_outcomes": project.get("expected_outcomes", []),
            "curriculum_alignment": project.get("curriculum_alignment", []),
            "point_of_interest_id": req.point_id,
            "generated_by": "claude",
            "validated": False,
        }

        insert_result = sb.table("stem_projects").insert(row).execute()

        if insert_result.data:
            saved_projects.append(insert_result.data[0])
        else:
            # Si falla el insert, retornar el proyecto sin guardar
            saved_projects.append(project)

    return {
        "projects": saved_projects,
        "source": "generated",
        "message": f"Se generaron {len(saved_projects)} proyectos para {poi['name']}"
    }


# ── Utilidades ───────────────────────────────────────────────────────

def _parse_point(location) -> list[float]:
    """Parsea coordenadas de PostGIS a [lon, lat]. Soporta dict GeoJSON y string WKT."""
    if not location:
        return [0, 0]
    try:
        if isinstance(location, dict):
            return location["coordinates"]
        clean = str(location).replace("POINT(", "").replace(")", "").strip()
        parts = clean.split()
        return [float(parts[0]), float(parts[1])]
    except (ValueError, IndexError, KeyError):
        return [0, 0]
