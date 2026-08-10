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
    allow_origins=settings.cors_origins,
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


class SequenceRequest(BaseModel):
    """Petición de una secuencia de enseñanza anclada a un lugar.

    A diferencia de GenerateRequest, la entrada es el objetivo de aprendizaje:
    el docente parte de lo que le toca enseñar, y el lugar se elige para
    servirlo. Es la inversión que pide el diseño instruccional.
    """
    objective_code: str
    point_id: str
    sesiones: int = 4
    notas_docente: str = ""


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


@app.post("/sequences")
async def generar_secuencia(req: SequenceRequest):
    """Genera una secuencia de enseñanza para un objetivo de aprendizaje.

    Se diferencia de /generate-project en el orden pedagógico: aquella entrega
    un proyecto para que el estudiante investigue por su cuenta; esta entrega
    instrucción explícita, ejemplo resuelto ambientado en el lugar, práctica
    con guía decreciente, salida a terreno DESPUÉS de la práctica, y
    recuperación espaciada.

    /generate-project se mantiene para no romper lo que ya está desplegado.
    """
    if not settings.anthropic_api_key:
        raise HTTPException(
            status_code=503,
            detail="Generador no configurado: falta ANTHROPIC_API_KEY",
        )

    sb = get_supabase()

    objetivo_res = (
        sb.table("curriculum_objectives")
        .select("*")
        .eq("code", req.objective_code)
        .execute()
    )
    if not objetivo_res.data:
        raise HTTPException(
            status_code=404,
            detail=f"Objetivo de aprendizaje {req.objective_code} no encontrado",
        )
    oa = objetivo_res.data[0]

    poi_res = (
        sb.table("points_of_interest").select("*").eq("id", req.point_id).execute()
    )
    if not poi_res.data:
        raise HTTPException(status_code=404, detail="Punto de interés no encontrado")
    poi = poi_res.data[0]

    from ..ml.sequence_generator import (
        GeneradorSecuencias,
        ObjetivoAprendizaje,
        SolicitudSecuencia,
        resumen_para_docente,
        validar_secuencia,
    )
    from ..ml.stem_generator import TerritorialContext

    solicitud = SolicitudSecuencia(
        objetivo=ObjetivoAprendizaje(
            codigo=oa["code"],
            descripcion=oa.get("description", ""),
            asignatura=oa.get("subject", ""),
            nivel=oa.get("level", ""),
        ),
        contexto=TerritorialContext(
            name=poi["name"],
            ecosystem_type=poi.get("ecosystem_type", "desconocido"),
            commune=poi["commune"],
            description=poi.get("description", ""),
            stem_areas=poi.get("stem_areas", []),
            heritage_type=poi.get("heritage_type", ""),
            threats=poi.get("threats", []),
        ),
        sesiones=req.sesiones,
        notas_docente=req.notas_docente,
    )

    generador = GeneradorSecuencias(api_key=settings.anthropic_api_key)

    try:
        secuencia = await generador.generar(solicitud)
    except ValueError as exc:
        # El modelo devolvió algo inservible. Se responde 502 en vez de guardar
        # una secuencia rota que el docente descubriría delante del curso.
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    problemas = validar_secuencia(secuencia)

    return {
        "secuencia": secuencia,
        "resumen": resumen_para_docente(secuencia),
        # Se devuelven en lugar de ocultarse: el docente edita antes de usar, y
        # necesita saber qué le falta a lo que recibió.
        "problemas": problemas,
        "utilizable": not problemas,
    }


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


# ── Fase 3: Flujo profesor/estudiante ──────────────────────────────

import random
import string

class ShareCodeRequest(BaseModel):
    teacher_id: str
    school_id: str

class StudentRegisterRequest(BaseModel):
    local_id: str
    display_name: str
    school_id: str | None = None

class EnrollRequest(BaseModel):
    share_code: str

class ProgressUpdate(BaseModel):
    session_number: int
    activity_index: int
    completed: bool

class FieldNoteRequest(BaseModel):
    session_number: int
    note_text: str

class QuizSubmission(BaseModel):
    session_number: int
    questions: list  # [{question, options[], correct_index}]
    answers: list    # [índices seleccionados]
    score: int


def _generate_code(length: int = 6) -> str:
    """Genera un código alfanumérico sin caracteres ambiguos (0/O, 1/I/L)."""
    chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
    return "".join(random.choices(chars, k=length))


@app.post("/projects/{project_id}/share-code")
async def create_share_code(project_id: str, req: ShareCodeRequest):
    """El profesor genera un código para que estudiantes se unan al proyecto."""
    sb = get_supabase()

    # Verificar que el proyecto existe
    proj = sb.table("stem_projects").select("id,title").eq("id", project_id).execute()
    if not proj.data:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    # Si ya existe un código activo para este proyecto+profe, retornarlo
    existing = (
        sb.table("project_share_codes")
        .select("*")
        .eq("project_id", project_id)
        .eq("teacher_id", req.teacher_id)
        .eq("active", True)
        .execute()
    )
    if existing.data:
        return existing.data[0]

    # Generar código único (reintentar si hay colisión)
    for _ in range(10):
        code = _generate_code()
        try:
            result = sb.table("project_share_codes").insert({
                "project_id": project_id,
                "code": code,
                "teacher_id": req.teacher_id,
                "school_id": req.school_id,
            }).execute()
            if result.data:
                return result.data[0]
        except Exception:
            continue

    raise HTTPException(status_code=500, detail="No se pudo generar código único")


@app.get("/share-code/{code}")
async def lookup_share_code(code: str):
    """Busca un código compartido y retorna info del proyecto."""
    sb = get_supabase()
    result = (
        sb.table("project_share_codes")
        .select("*")
        .eq("code", code.upper())
        .eq("active", True)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Código no encontrado o inactivo")

    share = result.data[0]

    # Traer info del proyecto
    proj = sb.table("stem_projects").select("id,title,stem_areas,level,duration").eq("id", share["project_id"]).execute()

    # Traer info de la escuela
    school_info = None
    if share.get("school_id"):
        sch = sb.table("schools").select("id,name,commune").eq("id", share["school_id"]).execute()
        if sch.data:
            school_info = sch.data[0]

    return {
        "share_code": share,
        "project": proj.data[0] if proj.data else None,
        "school": school_info,
    }


@app.post("/students/register")
async def register_student(req: StudentRegisterRequest):
    """Registra o actualiza una sesión de estudiante."""
    sb = get_supabase()

    # Buscar si ya existe
    existing = (
        sb.table("student_sessions")
        .select("*")
        .eq("local_id", req.local_id)
        .execute()
    )

    if existing.data:
        # Actualizar nombre si cambió
        student = existing.data[0]
        if student["display_name"] != req.display_name:
            sb.table("student_sessions").update(
                {"display_name": req.display_name}
            ).eq("id", student["id"]).execute()
            student["display_name"] = req.display_name
        return student

    # Crear nuevo
    row = {
        "local_id": req.local_id,
        "display_name": req.display_name,
    }
    if req.school_id:
        row["school_id"] = req.school_id

    result = sb.table("student_sessions").insert(row).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Error al registrar estudiante")
    return result.data[0]


@app.post("/students/{student_id}/enroll")
async def enroll_student(student_id: str, req: EnrollRequest):
    """Inscribe a un estudiante en un proyecto usando un código compartido."""
    sb = get_supabase()

    # Buscar el código
    code_result = (
        sb.table("project_share_codes")
        .select("*")
        .eq("code", req.share_code.upper())
        .eq("active", True)
        .execute()
    )
    if not code_result.data:
        raise HTTPException(status_code=404, detail="Código no válido")

    share = code_result.data[0]

    # Verificar si ya está inscrito
    existing = (
        sb.table("student_enrollments")
        .select("*")
        .eq("student_id", student_id)
        .eq("project_id", share["project_id"])
        .execute()
    )
    if existing.data:
        return existing.data[0]

    # Crear inscripción
    result = sb.table("student_enrollments").insert({
        "student_id": student_id,
        "project_id": share["project_id"],
        "share_code_id": share["id"],
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Error al inscribir")
    return result.data[0]


@app.get("/students/{student_id}/projects")
async def get_student_projects(student_id: str):
    """Lista los proyectos en los que un estudiante está inscrito."""
    sb = get_supabase()
    enrollments = (
        sb.table("student_enrollments")
        .select("*")
        .eq("student_id", student_id)
        .execute()
    )

    projects = []
    for enr in enrollments.data:
        proj = sb.table("stem_projects").select("*").eq("id", enr["project_id"]).execute()
        if proj.data:
            projects.append({
                "enrollment_id": enr["id"],
                "enrolled_at": enr["enrolled_at"],
                **proj.data[0],
            })

    return {"projects": projects}


@app.post("/enrollments/{enrollment_id}/progress")
async def update_progress(enrollment_id: str, req: ProgressUpdate):
    """Marca una actividad como completada/incompleta."""
    sb = get_supabase()
    from datetime import datetime

    # Intentar actualizar existente
    existing = (
        sb.table("student_progress")
        .select("*")
        .eq("enrollment_id", enrollment_id)
        .eq("session_number", req.session_number)
        .eq("activity_index", req.activity_index)
        .execute()
    )

    if existing.data:
        sb.table("student_progress").update({
            "completed": req.completed,
            "completed_at": datetime.utcnow().isoformat() if req.completed else None,
        }).eq("id", existing.data[0]["id"]).execute()
        return {"status": "updated"}

    # Crear nuevo
    sb.table("student_progress").insert({
        "enrollment_id": enrollment_id,
        "session_number": req.session_number,
        "activity_index": req.activity_index,
        "completed": req.completed,
        "completed_at": datetime.utcnow().isoformat() if req.completed else None,
    }).execute()
    return {"status": "created"}


@app.get("/enrollments/{enrollment_id}/progress")
async def get_progress(enrollment_id: str):
    """Obtiene todo el progreso de una inscripción."""
    sb = get_supabase()
    result = (
        sb.table("student_progress")
        .select("*")
        .eq("enrollment_id", enrollment_id)
        .execute()
    )
    return {"progress": result.data}


@app.post("/enrollments/{enrollment_id}/field-notes")
async def save_field_note(enrollment_id: str, req: FieldNoteRequest):
    """Guarda una nota de campo del estudiante."""
    sb = get_supabase()
    result = sb.table("student_field_notes").insert({
        "enrollment_id": enrollment_id,
        "session_number": req.session_number,
        "note_text": req.note_text,
    }).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Error al guardar nota")
    return result.data[0]


@app.get("/enrollments/{enrollment_id}/field-notes")
async def get_field_notes(enrollment_id: str):
    """Obtiene las notas de campo de una inscripción."""
    sb = get_supabase()
    result = (
        sb.table("student_field_notes")
        .select("*")
        .eq("enrollment_id", enrollment_id)
        .order("created_at")
        .execute()
    )
    return {"notes": result.data}


@app.post("/enrollments/{enrollment_id}/quiz")
async def submit_quiz(enrollment_id: str, req: QuizSubmission):
    """Guarda el resultado de un quiz."""
    sb = get_supabase()
    result = sb.table("student_quiz_results").insert({
        "enrollment_id": enrollment_id,
        "session_number": req.session_number,
        "questions": req.questions,
        "answers": req.answers,
        "score": req.score,
    }).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Error al guardar quiz")
    return result.data[0]


@app.post("/projects/{project_id}/generate-quiz")
async def generate_quiz(project_id: str, session_number: int = Query(1)):
    """Genera preguntas de quiz para una sesión usando Claude."""
    if not settings.anthropic_api_key:
        raise HTTPException(status_code=503, detail="Falta ANTHROPIC_API_KEY")

    sb = get_supabase()
    proj = sb.table("stem_projects").select("*").eq("id", project_id).execute()
    if not proj.data:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    project = proj.data[0]
    detail = project.get("detail")
    if not detail:
        raise HTTPException(status_code=400, detail="El proyecto no tiene detalle expandido aún")

    # Encontrar la sesión
    sessions = detail.get("sessions", [])
    session = next((s for s in sessions if s["session_number"] == session_number), None)
    if not session:
        raise HTTPException(status_code=404, detail=f"Sesión {session_number} no encontrada")

    from ..ml.stem_generator import STEMGenerator
    generator = STEMGenerator(api_key=settings.anthropic_api_key)
    quiz = await generator.generate_quiz(project, session)
    return quiz


@app.get("/projects/{project_id}/student-progress")
async def get_project_student_progress(project_id: str):
    """Dashboard del profesor: progreso de todos los estudiantes inscritos."""
    sb = get_supabase()

    # Obtener inscripciones
    enrollments = (
        sb.table("student_enrollments")
        .select("*")
        .eq("project_id", project_id)
        .execute()
    )

    # Obtener detalle del proyecto para saber total de actividades
    proj = sb.table("stem_projects").select("detail").eq("id", project_id).execute()
    total_activities = 0
    if proj.data and proj.data[0].get("detail"):
        detail = proj.data[0]["detail"]
        for ws in detail.get("worksheets", []):
            total_activities += len(ws.get("activities", []))

    students = []
    for enr in enrollments.data:
        # Info del estudiante
        student = sb.table("student_sessions").select("*").eq("id", enr["student_id"]).execute()
        if not student.data:
            continue

        # Progreso
        progress = (
            sb.table("student_progress")
            .select("*")
            .eq("enrollment_id", enr["id"])
            .eq("completed", True)
            .execute()
        )
        completed = len(progress.data)

        # Notas
        notes = (
            sb.table("student_field_notes")
            .select("id")
            .eq("enrollment_id", enr["id"])
            .execute()
        )

        # Quizzes
        quizzes = (
            sb.table("student_quiz_results")
            .select("score")
            .eq("enrollment_id", enr["id"])
            .execute()
        )

        students.append({
            "student_name": student.data[0]["display_name"],
            "student_id": enr["student_id"],
            "enrollment_id": enr["id"],
            "total_activities": total_activities,
            "completed_activities": completed,
            "completion_pct": round(completed / total_activities * 100) if total_activities > 0 else 0,
            "field_notes_count": len(notes.data),
            "quiz_scores": [q["score"] for q in quizzes.data],
        })

    return {"students": students, "total_activities": total_activities}


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
