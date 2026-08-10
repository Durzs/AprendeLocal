"""
Generador de secuencias de enseñanza con anclaje territorial.

¿En qué se diferencia de stem_generator?
────────────────────────────────────────
`stem_generator` produce un *proyecto* para que el estudiante investigue. Eso
es instrucción con guía mínima, y la evidencia es concluyente en que fracasa
con quien todavía no domina la materia (Kirschner, Sweller y Clark, 2006): el
novato necesita que se le muestre explícitamente qué hacer, y la resolución
autónoma de problemas solo rinde cuando ya hay pericia.

Este módulo produce en cambio una *secuencia* de seis etapas en la que la guía
empieza alta y se retira poco a poco. El lugar deja de ser el punto de partida
para convertirse en el material del que están hechos el ejemplo resuelto y la
práctica: se estudia el estero que pasa detrás de la escuela, pero se estudia
en el orden en que se aprende.

La salida a terreno va en la etapa 5, no en la 1. Ir antes es pasear.

El destinatario de todo esto es el docente, nunca la clase. La plataforma
prepara material que el docente edita y enseña; no explica conceptos a los
estudiantes.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field

import anthropic

from .stem_generator import TerritorialContext


MODELO = "claude-sonnet-5"

# Etapas en orden. El orden es el contenido: mover el terreno hacia adelante
# rompería el diseño.
ETAPAS = [
    "instruccion_explicita",
    "ejemplo_resuelto",
    "practica_guiada",
    "practica_autonoma",
    "salida_terreno",
    "recuperacion_espaciada",
]


@dataclass
class ObjetivoAprendizaje:
    """Objetivo del currículo nacional que la secuencia debe cubrir."""

    codigo: str
    descripcion: str
    asignatura: str = ""
    nivel: str = ""


@dataclass
class SolicitudSecuencia:
    """Todo lo que hace falta para generar una secuencia."""

    objetivo: ObjetivoAprendizaje
    contexto: TerritorialContext
    sesiones: int = 4
    notas_docente: str = ""
    #: Campos que provienen de datos reales y no del modelo. Se arrastran a la
    #: salida para poder señalar en la interfaz qué es dato y qué es generado.
    procedencia_datos: dict = field(default_factory=dict)


SYSTEM_PROMPT = """Eres un diseñador instruccional que prepara material para docentes rurales del sur de Chile (La Araucanía), muchos de ellos a cargo de aulas multigrado donde un solo profesor atiende varios cursos a la vez.

Tu trabajo NO es diseñar un proyecto para que el estudiante descubra por su cuenta. Es preparar una secuencia de enseñanza en la que la guía empieza alta y se retira progresivamente, siguiendo la evidencia sobre carga cognitiva y ejemplos resueltos.

Reglas que no puedes romper:

1. EL LUGAR ES EL CONTEXTO, NO EL MÉTODO. El territorio es el material del que están hechos el ejemplo y la práctica, no el punto de partida de una exploración libre.
2. EL EJEMPLO RESUELTO ES EL CENTRO. Debe estar completamente desarrollado, paso a paso, con los números o las observaciones ya hechas y explicadas. No es un enunciado: es la solución mostrada.
3. LA SALIDA A TERRENO VA DESPUÉS de la práctica guiada, nunca antes. Cuando la clase sale, ya debe saber qué mirar y por qué.
4. HABLAS AL DOCENTE. La instrucción explícita se redacta como notas para que el profesor las explique él, no como texto para que el estudiante lea.
5. MATERIALES DE ZONA RURAL: cuaderno, huincha, lupa, termómetro, botellas recicladas, agua del estero. Nada costoso ni especializado.
6. EL PROTOCOLO DE TERRENO LLEVA CAMPOS CONCRETOS Y MEDIBLES, con unidad. Nunca "observa el entorno": siempre "mide el ancho del cauce en metros, en tres puntos separados 10 m".
7. LA RECUPERACIÓN ESPACIADA USA LOS DATOS QUE LOS PROPIOS ESTUDIANTES TOMARON. Escribe las preguntas con marcadores del tipo {dato_del_estudiante} donde deba insertarse su medición.
8. CULTURA MAPUCHE: solo si es pertinente al objetivo, tratada como fuente de conocimiento y nunca como adorno. Si la incluyes, márcalo en requiere_consulta.

Responde SOLO con un JSON válido, sin markdown ni ```, con exactamente esta forma:
{
  "titulo": "Título de la secuencia",
  "objetivo_codigo": "el código del OA recibido",
  "sesiones": 4,
  "sintesis_docente": "Dos frases: qué van a aprender y por qué este lugar sirve para enseñarlo",
  "instruccion_explicita": {
    "duracion_min": 20,
    "notas_para_el_docente": ["punto que el profesor explica", "..."],
    "conceptos_clave": ["concepto", "..."],
    "errores_frecuentes": ["confusión típica que conviene anticipar", "..."]
  },
  "ejemplo_resuelto": {
    "situacion": "Situación concreta ambientada en el lugar",
    "pasos": [
      {"paso": 1, "accion": "qué se hace", "razonamiento": "por qué se hace", "resultado": "a qué se llega"}
    ],
    "respuesta": "El resultado final, explicado"
  },
  "practica_guiada": {
    "instrucciones_docente": "Cómo conducirla",
    "ejercicios": [
      {"enunciado": "...", "apoyo": "la ayuda que se da al inicio", "respuesta_esperada": "..."}
    ]
  },
  "practica_autonoma": {
    "ejercicios": [{"enunciado": "...", "respuesta_esperada": "..."}]
  },
  "salida_terreno": {
    "duracion_min": 90,
    "preparacion": ["qué llevar", "..."],
    "protocolo": [
      {"campo": "ancho_cauce_m", "instruccion": "Mide el ancho en metros en 3 puntos separados 10 m", "unidad": "m", "tipo": "numero"}
    ],
    "seguridad": ["advertencia relevante", "..."]
  },
  "recuperacion_espaciada": [
    {"semanas_despues": 1, "pregunta": "...{dato_del_estudiante}...", "respuesta_esperada": "..."},
    {"semanas_despues": 3, "pregunta": "...", "respuesta_esperada": "..."},
    {"semanas_despues": 6, "pregunta": "...", "respuesta_esperada": "..."}
  ],
  "materiales": ["..."],
  "requiere_consulta": false
}"""


class GeneradorSecuencias:
    """Pide a Claude una secuencia completa a partir de un OA y un lugar."""

    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)

    async def generar(self, solicitud: SolicitudSecuencia) -> dict:
        prompt = self._construir_prompt(solicitud)
        respuesta = self._llamar_claude(prompt)
        secuencia = parsear_secuencia(respuesta)

        # La procedencia se adjunta desde el lado servidor: son datos de la base,
        # no algo que el modelo pueda inventar ni alterar.
        secuencia["procedencia"] = {
            "de_datos": {
                "punto": solicitud.contexto.name,
                "comuna": solicitud.contexto.commune,
                "ecosistema": solicitud.contexto.ecosystem_type,
                "objetivo": solicitud.objetivo.codigo,
                **solicitud.procedencia_datos,
            },
            "generado_por_modelo": [e for e in ETAPAS],
            "modelo": MODELO,
        }
        secuencia["objetivo_descripcion"] = solicitud.objetivo.descripcion

        return secuencia

    def _construir_prompt(self, s: SolicitudSecuencia) -> str:
        c = s.contexto
        partes = [
            f"OBJETIVO DE APRENDIZAJE ({s.objetivo.codigo}): {s.objetivo.descripcion}",
        ]
        if s.objetivo.asignatura:
            partes.append(f"Asignatura: {s.objetivo.asignatura}")
        if s.objetivo.nivel:
            partes.append(f"Nivel: {s.objetivo.nivel}")

        partes += [
            "",
            "LUGAR DONDE SE ANCLA LA ENSEÑANZA",
            f"Nombre: {c.name}",
            f"Comuna: {c.commune}",
            f"Ecosistema: {c.ecosystem_type}",
            f"Descripción: {c.description}",
        ]
        if c.threats:
            partes.append(f"Amenazas locales: {', '.join(c.threats)}")
        if c.heritage_type:
            partes.append(f"Patrimonio: {c.heritage_type}")

        partes += ["", f"Sesiones disponibles: {s.sesiones}"]
        if s.notas_docente:
            partes.append(f"Notas del docente: {s.notas_docente}")

        partes += [
            "",
            "Genera la secuencia completa. Recuerda: el ejemplo resuelto debe estar "
            "totalmente desarrollado y ambientado en este lugar, y la salida a terreno "
            "va después de la práctica, no antes.",
        ]
        return "\n".join(partes)

    def _llamar_claude(self, prompt: str) -> str:
        mensaje = self.client.messages.create(
            model=MODELO,
            max_tokens=4000,
            system=[
                {
                    "type": "text",
                    "text": SYSTEM_PROMPT,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=[{"role": "user", "content": prompt}],
        )
        return mensaje.content[0].text


def parsear_secuencia(respuesta: str) -> dict:
    """Convierte la respuesta del modelo en un diccionario.

    Tolera que venga envuelta en un bloque de código, que es el desvío más
    habitual. Si no hay JSON, lanza ValueError en lugar de devolver un objeto
    a medias que reventaría más adelante.
    """
    limpio = respuesta.strip()
    if limpio.startswith("```"):
        limpio = limpio.split("\n", 1)[1] if "\n" in limpio else limpio
        limpio = limpio.rsplit("```", 1)[0]
        limpio = limpio.strip()
        if limpio.startswith("json"):
            limpio = limpio[4:].strip()

    try:
        datos = json.loads(limpio)
    except json.JSONDecodeError as exc:
        raise ValueError(f"El modelo no devolvió JSON válido: {exc}") from exc

    if not isinstance(datos, dict):
        raise ValueError("El modelo devolvió JSON que no es un objeto")

    return datos


def validar_secuencia(secuencia: dict) -> list[str]:
    """Comprueba que la secuencia sirva de verdad para dar clase.

    Devuelve la lista de problemas encontrados; vacía significa correcta. Se
    valida lo que sostiene el diseño, no la mera presencia de claves: un
    ejemplo resuelto sin razonamiento en sus pasos deja de ser un ejemplo
    resuelto, y un protocolo sin unidades no se puede medir.
    """
    problemas: list[str] = []

    for etapa in ETAPAS:
        if etapa not in secuencia:
            problemas.append(f"falta la etapa '{etapa}'")

    ejemplo = secuencia.get("ejemplo_resuelto") or {}
    pasos = ejemplo.get("pasos") or []
    if not pasos:
        problemas.append("el ejemplo resuelto no tiene pasos")
    else:
        sin_razonamiento = [
            p.get("paso", i + 1)
            for i, p in enumerate(pasos)
            if not str(p.get("razonamiento", "")).strip()
        ]
        if sin_razonamiento:
            problemas.append(
                "el ejemplo resuelto tiene pasos sin razonamiento: "
                + ", ".join(str(p) for p in sin_razonamiento)
            )
    if not str(ejemplo.get("respuesta", "")).strip():
        problemas.append("el ejemplo resuelto no llega a una respuesta")

    protocolo = (secuencia.get("salida_terreno") or {}).get("protocolo") or []
    if not protocolo:
        problemas.append("la salida a terreno no tiene protocolo de captura")
    for campo in protocolo:
        if not str(campo.get("campo", "")).strip():
            problemas.append("hay un campo del protocolo sin nombre")
        if campo.get("tipo") == "numero" and not str(campo.get("unidad", "")).strip():
            problemas.append(
                f"el campo numérico '{campo.get('campo', '?')}' no declara unidad"
            )

    recuperacion = secuencia.get("recuperacion_espaciada") or []
    if len(recuperacion) < 2:
        problemas.append("la recuperación espaciada necesita al menos dos momentos")
    semanas = [r.get("semanas_despues") for r in recuperacion]
    if semanas and len(set(semanas)) != len(semanas):
        problemas.append("hay momentos de recuperación repetidos en la misma semana")

    return problemas


def resumen_para_docente(secuencia: dict) -> dict:
    """Cifras que la interfaz muestra antes de abrir la secuencia entera."""
    protocolo = (secuencia.get("salida_terreno") or {}).get("protocolo") or []
    return {
        "titulo": secuencia.get("titulo", ""),
        "sesiones": secuencia.get("sesiones"),
        "pasos_del_ejemplo": len((secuencia.get("ejemplo_resuelto") or {}).get("pasos") or []),
        "ejercicios_guiados": len(
            (secuencia.get("practica_guiada") or {}).get("ejercicios") or []
        ),
        "campos_de_terreno": len(protocolo),
        "momentos_de_recuperacion": len(secuencia.get("recuperacion_espaciada") or []),
        "requiere_consulta": bool(secuencia.get("requiere_consulta")),
    }
