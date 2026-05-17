"""
Generador de proyectos STEM contextualizados usando Claude API.
Recibe perfil territorial y genera proyectos adaptados al contexto local.
"""

from dataclasses import dataclass


@dataclass
class STEMProject:
    title: str
    stem_areas: list[str]
    level: str
    duration: str
    local_connection: str
    objectives: list[str]
    materials: list[str]
    steps: list[str]
    expected_outcomes: list[str]
    curriculum_alignment: list[str]
    location_name: str
    lat: float
    lon: float


@dataclass
class TerritorialContext:
    ecosystem_type: str
    vegetation: list[str]
    key_species: list[str]
    threats: list[str]
    heritage_sites: list[dict]
    local_challenges: list[str]
    available_resources: list[str]
    student_level: str


SYSTEM_PROMPT = """Eres un experto en educación STEM contextualizada para zonas rurales de Chile.
Tu tarea es generar proyectos STEM que:
1. Se conecten directamente con el ecosistema y patrimonio local
2. Aborden desafíos reales de la comunidad
3. Usen materiales accesibles en zonas rurales
4. Se alineen con el currículum nacional chileno
5. Sean ejecutables en 2-6 semanas
6. Promuevan el pensamiento científico y la conexión con el territorio

Genera proyectos específicos, prácticos y que un docente rural pueda implementar
sin necesidad de equipamiento costoso. Prioriza la observación directa del entorno,
la recolección de datos de campo, y la resolución de problemas locales reales."""


class STEMGenerator:
    """Genera proyectos STEM contextualizados usando Claude API."""

    def __init__(self, api_key: str):
        self.api_key = api_key

    async def generate_project(self, context: TerritorialContext) -> STEMProject:
        """Genera un proyecto STEM basado en el contexto territorial."""
        prompt = self._build_prompt(context)
        response = await self._call_claude(prompt)
        return self._parse_response(response)

    async def generate_batch(self, context: TerritorialContext, count: int = 5) -> list[STEMProject]:
        """Genera múltiples proyectos para una zona."""
        projects = []
        for i in range(count):
            project = await self.generate_project(context)
            projects.append(project)
        return projects

    def _build_prompt(self, context: TerritorialContext) -> str:
        return f"""Contexto territorial:
- Ecosistema: {context.ecosystem_type}
- Vegetación dominante: {', '.join(context.vegetation)}
- Especies clave: {', '.join(context.key_species)}
- Amenazas: {', '.join(context.threats)}
- Patrimonio: {context.heritage_sites}
- Desafíos locales: {', '.join(context.local_challenges)}
- Recursos disponibles: {', '.join(context.available_resources)}
- Nivel estudiantes: {context.student_level}

Genera UN proyecto STEM detallado que conecte con este territorio.
Responde en formato JSON con los campos: title, stem_areas, level, duration,
local_connection, objectives, materials, steps, expected_outcomes, curriculum_alignment."""

    async def _call_claude(self, prompt: str) -> str:
        # TODO: implementar llamada a Claude API con anthropic SDK
        # Usar prompt caching para el system prompt (se repite)
        return ""

    def _parse_response(self, response: str) -> STEMProject:
        # TODO: parsear JSON de respuesta Claude
        return STEMProject(
            title="",
            stem_areas=[],
            level="",
            duration="",
            local_connection="",
            objectives=[],
            materials=[],
            steps=[],
            expected_outcomes=[],
            curriculum_alignment=[],
            location_name="",
            lat=0.0,
            lon=0.0,
        )
