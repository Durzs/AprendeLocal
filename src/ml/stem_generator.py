"""
Generador de proyectos STEM contextualizados usando Claude API.
Recibe datos de un punto de interés y genera proyectos adaptados al contexto local.

¿Cómo funciona? (explicación simple)
─────────────────────────────────────
1. Toma la info de un lugar (ecosistema, amenazas, patrimonio)
2. Le pide a Claude (IA de Anthropic) que genere un proyecto STEM
   específico para ese lugar
3. Claude devuelve un JSON con título, materiales, pasos, etc.
4. Guardamos ese proyecto en la base de datos

Es como pedirle a un profesor experto que diseñe una actividad
mirando el mapa y la ficha del lugar.
"""

import json
import anthropic
from dataclasses import dataclass, asdict


@dataclass
class TerritorialContext:
    """Datos del lugar que Claude usará para generar el proyecto."""
    name: str
    ecosystem_type: str
    commune: str
    description: str
    stem_areas: list[str]
    heritage_type: str
    threats: list[str]
    student_level: str = "basica_segundo_ciclo"  # 5to-8vo básico por defecto
    oa_descriptions: list[str] | None = None  # OA seleccionados por el docente
    duration: str = ""  # Duración deseada


# Este es el "prompt de sistema": le dice a Claude quién es y cómo debe responder.
# Se envía UNA vez y se reutiliza (prompt caching = más barato).
SYSTEM_PROMPT = """Eres un experto en educación STEM contextualizada para zonas rurales del sur de Chile (La Araucanía).

Tu tarea es generar proyectos STEM que cumplan TODOS estos criterios:
1. Se conecten directamente con el ecosistema y patrimonio del lugar específico
2. Aborden un desafío real de la comunidad local
3. Usen SOLO materiales accesibles en zonas rurales (nada costoso ni especializado)
4. Se alineen con el currículum nacional chileno (Bases Curriculares MINEDUC)
5. Sean ejecutables en 2-6 semanas por un docente rural
6. Promuevan observación directa del entorno y recolección de datos de campo
7. Incluyan conexión con la cultura mapuche cuando sea pertinente

IMPORTANTE:
- Sé MUY específico con el lugar (no genérico)
- Los materiales deben ser cosas como: cuadernos, lupa, termómetro, botellas recicladas, tierra, agua del río
- Los pasos deben ser claros para un docente que NO es especialista en ciencias
- Incluye siempre una actividad de campo (salir al terreno)

Responde SOLO con un JSON válido (sin markdown, sin ```), con exactamente estos campos:
{
  "title": "Título atractivo del proyecto",
  "stem_areas": ["área1", "área2"],
  "level": "5to_basico | 6to_basico | 7mo_basico | 8vo_basico | 1ro_medio | 2do_medio",
  "duration": "X semanas",
  "local_connection": "Explicación de cómo el proyecto se conecta con el lugar específico",
  "objectives": ["Objetivo de aprendizaje 1", "Objetivo 2", "Objetivo 3"],
  "materials": ["Material 1", "Material 2"],
  "steps": ["Semana 1: descripción", "Semana 2: descripción"],
  "expected_outcomes": ["Resultado esperado 1", "Resultado 2"],
  "curriculum_alignment": ["OA de Ciencias Naturales X", "OA de Matemáticas Y"]
}"""


# Prompt para expandir un proyecto: generar sesiones, guía docente, fichas y rúbrica.
# Se usa cuando el docente abre un proyecto en "Mis Proyectos" por primera vez.
EXPAND_SYSTEM_PROMPT = """Eres un experto en planificación educativa STEM para escuelas rurales del sur de Chile.

Tu tarea es tomar un proyecto STEM ya definido y generar su PLANIFICACIÓN COMPLETA:
1. Desglose sesión a sesión (cada sesión = 1 clase de 90 min aprox)
2. Guía para el docente (preparación, preguntas clave, adaptaciones)
3. Fichas de trabajo para estudiantes (una por sesión)
4. Rúbrica de evaluación con criterios claros

IMPORTANTE:
- Las sesiones deben alternar entre aula y terreno
- Las fichas deben ser simples (estudiantes rurales de 10-14 años)
- La rúbrica debe tener 3-4 criterios con 4 niveles cada uno (Excelente, Bueno, Suficiente, Por lograr)
- Todo debe ser CONCRETO y EJECUTABLE por un docente no especialista

Responde SOLO con un JSON válido (sin markdown, sin ```) con exactamente esta estructura:
{
  "sessions": [
    {
      "session_number": 1,
      "title": "Título de la sesión",
      "duration_minutes": 90,
      "objective": "Lo que lograrán en esta sesión",
      "activities": ["Actividad 1 (20 min)", "Actividad 2 (30 min)"],
      "materials": ["Material 1", "Material 2"],
      "location": "aula | terreno | mixto"
    }
  ],
  "teacher_guide": {
    "preparation": ["Qué preparar antes de empezar"],
    "key_questions": ["Pregunta guía 1", "Pregunta guía 2"],
    "differentiation": ["Adaptación para estudiantes avanzados", "Adaptación para quienes necesitan apoyo"],
    "safety_notes": ["Precaución en terreno"],
    "assessment_tips": ["Cómo evaluar durante el proceso"]
  },
  "worksheets": [
    {
      "session_number": 1,
      "title": "Ficha: Título",
      "instructions": "Instrucciones claras para el estudiante",
      "activities": [
        {"description": "Qué hacer", "type": "observacion | registro | analisis | creacion"}
      ],
      "reflection_questions": ["Pregunta de reflexión"]
    }
  ],
  "rubric": {
    "criteria": [
      {
        "name": "Nombre del criterio",
        "levels": [
          {"label": "Excelente", "description": "Qué se espera", "points": 4},
          {"label": "Bueno", "description": "...", "points": 3},
          {"label": "Suficiente", "description": "...", "points": 2},
          {"label": "Por lograr", "description": "...", "points": 1}
        ]
      }
    ],
    "total_points": 16
  }
}"""


class STEMGenerator:
    """Genera proyectos STEM contextualizados usando Claude API.

    Piensa en esto como un "profesor virtual" que diseña actividades
    mirando la ficha de cada lugar en el mapa.
    """

    def __init__(self, api_key: str):
        # Creamos el cliente de Anthropic (la "conexión" con Claude)
        self.client = anthropic.Anthropic(api_key=api_key)

    async def generate_project(self, context: TerritorialContext) -> dict:
        """Genera UN proyecto STEM basado en el contexto del lugar.

        Args:
            context: Datos del punto de interés (ecosistema, amenazas, etc.)

        Returns:
            dict con todos los campos del proyecto STEM
        """
        prompt = self._build_prompt(context)
        response = self._call_claude(prompt)
        project = self._parse_response(response)

        # Agregar metadata del lugar
        project["point_name"] = context.name
        project["commune"] = context.commune

        return project

    async def generate_batch(
        self, context: TerritorialContext, count: int = 3
    ) -> list[dict]:
        """Genera varios proyectos distintos para un mismo lugar.

        Útil para darle opciones al docente: "Elige el que más te guste".
        """
        projects = []
        # Le pedimos a Claude que varíe: cada vez enfocamos un área STEM diferente
        areas_to_focus = context.stem_areas[:count] if len(context.stem_areas) >= count else context.stem_areas

        for i in range(count):
            focus = areas_to_focus[i % len(areas_to_focus)]
            focused_context = TerritorialContext(
                name=context.name,
                ecosystem_type=context.ecosystem_type,
                commune=context.commune,
                description=context.description,
                stem_areas=context.stem_areas,
                heritage_type=context.heritage_type,
                threats=context.threats,
                student_level=context.student_level,
            )
            prompt = self._build_prompt(focused_context, focus_area=focus)
            response = self._call_claude(prompt)
            project = self._parse_response(response)
            project["point_name"] = context.name
            project["commune"] = context.commune
            projects.append(project)

        return projects

    async def expand_project(self, project: dict) -> dict:
        """Expande un proyecto STEM: genera sesiones, guía docente, fichas y rúbrica.

        Es como pedirle a un coordinador pedagógico que tome el proyecto
        y arme toda la planificación detallada para que el docente solo
        tenga que seguirla.

        Args:
            project: El proyecto STEM existente (título, pasos, materiales, etc.)

        Returns:
            dict con sessions, teacher_guide, worksheets, rubric
        """
        prompt = f"""Expande este proyecto STEM en una planificación completa:

📌 Título: {project.get('title', 'Sin título')}
🔬 Áreas STEM: {', '.join(project.get('stem_areas', []))}
🎓 Nivel: {project.get('level', 'desconocido')}
⏱️ Duración: {project.get('duration', '4 semanas')}
🔗 Conexión local: {project.get('local_connection', '')}

🎯 Objetivos:
{chr(10).join(f'  - {o}' for o in project.get('objectives', []))}

🧰 Materiales:
{chr(10).join(f'  - {m}' for m in project.get('materials', []))}

📋 Pasos generales:
{chr(10).join(f'  {i+1}. {s}' for i, s in enumerate(project.get('steps', [])))}

📚 Alineación curricular:
{chr(10).join(f'  - {a}' for a in project.get('curriculum_alignment', []))}

Genera la planificación completa en formato JSON."""

        # Usamos más tokens porque la respuesta es más larga
        message = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=5000,
            system=[
                {
                    "type": "text",
                    "text": EXPAND_SYSTEM_PROMPT,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=[
                {"role": "user", "content": prompt}
            ],
        )

        response = message.content[0].text
        return self._parse_response(response)

    def _build_prompt(self, context: TerritorialContext, focus_area: str | None = None) -> str:
        """Arma el mensaje que le enviamos a Claude con los datos del lugar."""
        focus_text = f"\nENFÓCATE especialmente en el área: {focus_area}" if focus_area else ""

        # Si el docente seleccionó OA específicos, incluirlos
        oa_text = ""
        if context.oa_descriptions:
            oa_list = "\n".join(f"  - {oa}" for oa in context.oa_descriptions)
            oa_text = f"""

📚 OBJETIVOS DE APRENDIZAJE seleccionados por el docente:
{oa_list}
IMPORTANTE: El proyecto DEBE cubrir estos OA específicos. Alinea las actividades
y evaluaciones directamente con estos objetivos del currículo chileno."""

        # Duración específica
        duration_text = ""
        if context.duration:
            dur_map = {
                "1_semana": "1 semana (2-3 sesiones de clase)",
                "2_semanas": "2 semanas (4-5 sesiones de clase)",
                "4_semanas": "4 semanas (8 sesiones de clase)",
                "8_semanas": "8 semanas (proyecto semestral, 16 sesiones)",
            }
            dur_label = dur_map.get(context.duration, context.duration)
            duration_text = f"\n⏱️ Duración solicitada: {dur_label}"

        return f"""Genera un proyecto STEM para este lugar específico:

📍 Lugar: {context.name}
🏔️ Ecosistema: {context.ecosystem_type}
🗺️ Comuna: {context.commune}
📝 Descripción: {context.description}
🔬 Áreas STEM relevantes: {', '.join(context.stem_areas)}
🏛️ Tipo de patrimonio: {context.heritage_type}
⚠️ Amenazas: {', '.join(context.threats)}
🎓 Nivel estudiantes: {context.student_level}{duration_text}{oa_text}
{focus_text}

Genera el proyecto en formato JSON. Cada proyecto debe ser DISTINTO en enfoque y metodología."""

    def _call_claude(self, prompt: str) -> str:
        """Llama a Claude API y obtiene la respuesta.

        Usa prompt caching: el system prompt (instrucciones) se cachea
        para no enviarlo completo cada vez → más rápido y más barato.
        """
        message = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            system=[
                {
                    "type": "text",
                    "text": SYSTEM_PROMPT,
                    "cache_control": {"type": "ephemeral"},  # Cache por 5 min
                }
            ],
            messages=[
                {"role": "user", "content": prompt}
            ],
        )

        # Claude devuelve una lista de bloques de contenido
        # Tomamos el texto del primer bloque
        return message.content[0].text

    def _parse_response(self, response: str) -> dict:
        """Convierte la respuesta de Claude (texto JSON) en un diccionario Python.

        Si Claude devuelve algo que no es JSON válido, retorna un error limpio.
        """
        try:
            # Limpiar posibles artefactos (a veces Claude agrega ```json ... ```)
            clean = response.strip()
            if clean.startswith("```"):
                clean = clean.split("\n", 1)[1]
                clean = clean.rsplit("```", 1)[0]

            project = json.loads(clean)

            # Validar que tenga los campos mínimos
            required = ["title", "stem_areas", "level", "objectives", "materials", "steps"]
            for field in required:
                if field not in project:
                    project[field] = [] if field != "title" else "Proyecto sin título"

            return project

        except json.JSONDecodeError:
            return {
                "title": "Error al generar proyecto",
                "error": "Claude no devolvió JSON válido",
                "raw_response": response[:500],
                "stem_areas": [],
                "level": "",
                "duration": "",
                "local_connection": "",
                "objectives": [],
                "materials": [],
                "steps": [],
                "expected_outcomes": [],
                "curriculum_alignment": [],
            }
