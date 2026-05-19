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
    oa_descriptions: list[str] = []  # Objetivos de Aprendizaje seleccionados
    duration: str = ""  # Duración deseada (1_semana, 2_semanas, etc.)


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
        oa_descriptions=req.oa_descriptions if req.oa_descriptions else None,
        duration=req.duration,
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


# ── Fase 2: Mis Proyectos ───────────────────────────────────────────

class BatchRequest(BaseModel):
    """IDs de proyectos a recuperar (para el hub 'Mis Proyectos')."""
    project_ids: list[str]


@app.post("/projects/batch")
async def get_projects_batch(req: BatchRequest):
    """Retorna varios proyectos por sus IDs.

    El frontend guarda los IDs de proyectos elegidos en localStorage.
    Con este endpoint puede traerlos todos de una vez.
    """
    if not req.project_ids:
        return {"projects": []}

    sb = get_supabase()
    # Supabase soporta filtro "in" para traer varios IDs a la vez
    result = (
        sb.table("stem_projects")
        .select("*")
        .in_("id", req.project_ids)
        .execute()
    )
    return {"projects": result.data}


@app.post("/projects/{project_id}/expand")
async def expand_project(project_id: str):
    """Expande un proyecto: genera sesiones, guía docente, fichas y rúbrica.

    Flujo:
    1. Busca el proyecto en Supabase
    2. Si ya tiene 'detail', lo retorna (cache)
    3. Si no, llama a Claude para generar la planificación completa
    4. Guarda el resultado en la columna 'detail' del proyecto
    5. Retorna la planificación
    """
    if not settings.anthropic_api_key:
        raise HTTPException(
            status_code=503,
            detail="Generador no configurado: falta ANTHROPIC_API_KEY"
        )

    sb = get_supabase()

    # 1. Buscar el proyecto
    result = sb.table("stem_projects").select("*").eq("id", project_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    project = result.data[0]

    # 2. ¿Ya tiene detalle generado? → retornar cache
    if project.get("detail"):
        return project["detail"]

    # 3. Generar con Claude
    from ..ml.stem_generator import STEMGenerator

    generator = STEMGenerator(api_key=settings.anthropic_api_key)
    detail = await generator.expand_project(project)

    # 4. Guardar en Supabase para no regenerar
    if "error" not in detail:
        sb.table("stem_projects").update(
            {"detail": detail}
        ).eq("id", project_id).execute()

    return detail


# ── Camino B: Búsqueda por currículo ─────────────────────────────────

@app.get("/curriculum")
async def get_curriculum(
    level: str | None = Query(None, description="Filtrar por nivel: 5to_basico, 6to_basico, etc."),
    subject: str | None = Query(None, description="Filtrar por asignatura: ciencias_naturales"),
    axis: str | None = Query(None, description="Filtrar por eje: ciencias_vida, fisica, quimica, etc."),
):
    """Retorna objetivos de aprendizaje del currículo chileno con conteo de proyectos disponibles."""
    sb = get_supabase()
    query = sb.table("curriculum_objectives").select("*")

    if level:
        query = query.eq("level", level)
    if subject:
        query = query.eq("subject", subject)
    if axis:
        query = query.eq("axis", axis)

    result = query.order("level").order("oa_number").execute()

    # Para cada OA, contar cuántos proyectos lo cubren
    objectives = []
    for oa in result.data:
        # Buscar proyectos cuyo curriculum_alignment mencione este OA
        # (búsqueda por texto en el array de curriculum_alignment del proyecto)
        project_count = (
            sb.table("project_curriculum")
            .select("id", count="exact")
            .eq("objective_id", oa["id"])
            .execute()
        )
        objectives.append({
            **oa,
            "project_count": project_count.count or 0,
        })

    return {"objectives": objectives}


@app.get("/curriculum/levels")
async def get_curriculum_levels():
    """Retorna los niveles educativos disponibles con conteo de OA."""
    sb = get_supabase()
    result = sb.table("curriculum_objectives").select("level").execute()

    # Contar OA por nivel
    level_counts: dict[str, int] = {}
    for row in result.data:
        lvl = row["level"]
        level_counts[lvl] = level_counts.get(lvl, 0) + 1

    # Ordenar por nivel
    order = ["5to_basico", "6to_basico", "7mo_basico", "8vo_basico", "1ro_medio", "2do_medio"]
    levels = []
    for lvl in order:
        if lvl in level_counts:
            levels.append({"level": lvl, "total_oa": level_counts[lvl]})

    return {"levels": levels}


@app.get("/curriculum/{objective_code}/projects")
async def get_projects_for_objective(objective_code: str):
    """Retorna proyectos STEM que cubren un objetivo de aprendizaje específico."""
    sb = get_supabase()

    # Buscar el OA
    oa_result = (
        sb.table("curriculum_objectives")
        .select("*")
        .eq("code", objective_code)
        .execute()
    )

    if not oa_result.data:
        raise HTTPException(status_code=404, detail="Objetivo no encontrado")

    oa = oa_result.data[0]

    # Buscar proyectos vinculados via project_curriculum
    linked = (
        sb.table("project_curriculum")
        .select("project_id")
        .eq("objective_id", oa["id"])
        .execute()
    )

    projects = []
    if linked.data:
        project_ids = [r["project_id"] for r in linked.data]
        for pid in project_ids:
            p = sb.table("stem_projects").select("*").eq("id", pid).execute()
            if p.data:
                projects.append(p.data[0])

    # También buscar proyectos cuyo curriculum_alignment TEXT[] mencione este OA
    # (para proyectos generados antes de la tabla de relación)
    keyword = f"OA {oa['oa_number']}"
    text_match = (
        sb.table("stem_projects")
        .select("*")
        .execute()
    )

    existing_ids = {p["id"] for p in projects}
    for p in text_match.data:
        if p["id"] not in existing_ids:
            alignment = p.get("curriculum_alignment", [])
            if any(keyword in str(a) for a in alignment):
                projects.append(p)

    return {
        "objective": oa,
        "projects": projects,
    }


# ── Escuelas: punto de entrada del docente ──────────────────────────

@app.get("/schools")
async def get_schools(
    commune: str | None = Query(None, description="Filtrar por comuna"),
):
    """Retorna escuelas rurales de la zona piloto."""
    sb = get_supabase()

    # Usar RPC para obtener coordenadas calculadas por PostGIS
    rpc_result = sb.rpc("get_schools_with_coords", {}).execute()

    schools = []
    for row in rpc_result.data:
        if commune and row.get("commune") != commune:
            continue
        schools.append({
            "id": row["id"],
            "rbd": row["rbd"],
            "name": row["name"],
            "commune": row["commune"],
            "address": row.get("address"),
            "coordinates": [row.get("lon", 0), row.get("lat", 0)],
            "dependency": row.get("dependency"),
            "rural": row.get("rural", True),
            "levels": row.get("levels", []),
            "student_count": row.get("student_count"),
        })

    # Ordenar
    schools.sort(key=lambda s: (s["commune"], s["name"]))
    return {"schools": schools}


@app.get("/schools/{school_id}/nearby")
async def get_nearby_pois(
    school_id: str,
    radius_km: float = Query(20, description="Radio de búsqueda en km"),
):
    """Retorna puntos de interés cercanos a una escuela, ordenados por distancia."""
    sb = get_supabase()

    # Verificar que la escuela existe
    school_result = sb.table("schools").select("*").eq("id", school_id).execute()
    if not school_result.data:
        raise HTTPException(status_code=404, detail="Escuela no encontrada")

    school = school_result.data[0]
    school_loc = school.get("location")

    if not school_loc:
        raise HTTPException(status_code=400, detail="Escuela sin coordenadas")

    # Llamar a la función PostGIS nearby_pois
    result = sb.rpc("nearby_pois", {
        "school_id": school_id,
        "radius_km": radius_km,
    }).execute()

    pois = []
    for row in result.data:
        pois.append({
            "id": row["poi_id"],
            "name": row["poi_name"],
            "type": row["poi_type"],
            "ecosystem": row.get("ecosystem_type"),
            "commune": row.get("commune"),
            "description": row.get("description"),
            "stem_areas": row.get("stem_areas", []),
            "heritage_type": row.get("heritage_type"),
            "threats": row.get("threats", []),
            "distance_km": row["distance_km"],
            "coordinates": [row["longitude"], row["latitude"]],
        })

    # Obtener coordenadas de la escuela via RPC
    school_coords_result = sb.rpc("get_schools_with_coords", {}).execute()
    school_entry = next(
        (s for s in school_coords_result.data if s["id"] == school_id),
        None
    )
    school_coords = [
        school_entry.get("lon", 0) if school_entry else 0,
        school_entry.get("lat", 0) if school_entry else 0,
    ]

    return {
        "school": {
            "id": school["id"],
            "name": school["name"],
            "commune": school["commune"],
            "coordinates": school_coords,
        },
        "radius_km": radius_km,
        "pois": pois,
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
