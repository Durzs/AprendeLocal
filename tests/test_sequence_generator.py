"""
Pruebas del generador de secuencias.

Cubren el parseo y la validación, que es donde vive la lógica: se ejecutan sin
clave de Anthropic y sin red, así que sirven en CI y en cualquier máquina.

La validación es lo que impide que llegue al aula una secuencia que parece
completa y no lo es —un ejemplo resuelto sin razonamiento, un protocolo sin
unidades—, que es justo el tipo de fallo que un docente descubriría delante
del curso.
"""

import json

import pytest

from src.ml.sequence_generator import (
    ETAPAS,
    parsear_secuencia,
    resumen_para_docente,
    validar_secuencia,
)


def secuencia_valida() -> dict:
    """Una secuencia mínima pero correcta, para partir de ella en cada prueba."""
    return {
        "titulo": "Caudal del estero Trancura y consumo de la escuela",
        "objetivo_codigo": "CN08-OA05",
        "sesiones": 4,
        "instruccion_explicita": {
            "duracion_min": 20,
            "notas_para_el_docente": ["Explicar qué es el caudal"],
            "conceptos_clave": ["caudal", "sección", "velocidad"],
            "errores_frecuentes": ["confundir caudal con profundidad"],
        },
        "ejemplo_resuelto": {
            "situacion": "El estero Trancura a la altura del puente",
            "pasos": [
                {
                    "paso": 1,
                    "accion": "Medir el ancho en tres puntos",
                    "razonamiento": "El cauce no es parejo; el promedio evita sesgar",
                    "resultado": "2,4 m de ancho medio",
                },
                {
                    "paso": 2,
                    "accion": "Multiplicar sección por velocidad",
                    "razonamiento": "El caudal es volumen por unidad de tiempo",
                    "resultado": "0,29 m³/s",
                },
            ],
            "respuesta": "El caudal aproximado es de 0,29 m³/s",
        },
        "practica_guiada": {
            "instrucciones_docente": "Resolver el primero en la pizarra",
            "ejercicios": [
                {
                    "enunciado": "Calcula el caudal con ancho 3 m",
                    "apoyo": "Se entrega la fórmula",
                    "respuesta_esperada": "0,45 m³/s",
                }
            ],
        },
        "practica_autonoma": {
            "ejercicios": [{"enunciado": "Otro cauce", "respuesta_esperada": "0,6 m³/s"}]
        },
        "salida_terreno": {
            "duracion_min": 90,
            "preparacion": ["huincha", "cronómetro"],
            "protocolo": [
                {
                    "campo": "ancho_cauce_m",
                    "instruccion": "Mide el ancho en 3 puntos separados 10 m",
                    "unidad": "m",
                    "tipo": "numero",
                },
                {
                    "campo": "observaciones",
                    "instruccion": "Anota si hay basura visible",
                    "tipo": "texto",
                },
            ],
            "seguridad": ["No entrar al agua sobre la rodilla"],
        },
        "recuperacion_espaciada": [
            {
                "semanas_despues": 1,
                "pregunta": "Tu grupo midió {dato_del_estudiante} m de ancho. ¿Qué caudal da?",
                "respuesta_esperada": "Depende de la medición",
            },
            {
                "semanas_despues": 6,
                "pregunta": "¿Por qué se mide en tres puntos?",
                "respuesta_esperada": "Porque el cauce es irregular",
            },
        ],
        "materiales": ["huincha", "cronómetro"],
        "requiere_consulta": False,
    }


# ── Parseo ───────────────────────────────────────────────────────────


def test_parsea_json_limpio():
    assert parsear_secuencia('{"titulo": "x"}') == {"titulo": "x"}


def test_parsea_json_envuelto_en_bloque_de_codigo():
    """El desvío más habitual del modelo es responder dentro de ```json."""
    crudo = '```json\n{"titulo": "x"}\n```'
    assert parsear_secuencia(crudo) == {"titulo": "x"}


def test_parsea_bloque_sin_etiqueta_de_lenguaje():
    assert parsear_secuencia('```\n{"titulo": "x"}\n```') == {"titulo": "x"}


def test_texto_no_json_lanza_error_en_vez_de_devolver_algo_a_medias():
    with pytest.raises(ValueError, match="JSON válido"):
        parsear_secuencia("Claro, aquí tienes la secuencia que pediste:")


def test_json_que_no_es_objeto_se_rechaza():
    with pytest.raises(ValueError, match="no es un objeto"):
        parsear_secuencia("[1, 2, 3]")


# ── Validación ───────────────────────────────────────────────────────


def test_secuencia_correcta_no_reporta_problemas():
    assert validar_secuencia(secuencia_valida()) == []


@pytest.mark.parametrize("etapa", ETAPAS)
def test_detecta_cualquier_etapa_ausente(etapa):
    s = secuencia_valida()
    del s[etapa]
    from src.ml.sequence_generator import NOMBRE_VISIBLE
    assert any(NOMBRE_VISIBLE[etapa] in p for p in validar_secuencia(s))


def test_ejemplo_resuelto_sin_razonamiento_no_es_ejemplo_resuelto():
    """Sin el porqué de cada paso es un enunciado con respuesta, no un modelo."""
    s = secuencia_valida()
    s["ejemplo_resuelto"]["pasos"][1]["razonamiento"] = ""
    problemas = validar_secuencia(s)
    assert any("no explican por qué" in p for p in problemas)
    assert any("2" in p for p in problemas)


def test_ejemplo_resuelto_sin_respuesta_final():
    s = secuencia_valida()
    s["ejemplo_resuelto"]["respuesta"] = "   "
    assert any("no termina en un resultado" in p for p in validar_secuencia(s))


def test_campo_numerico_sin_unidad_no_se_puede_medir():
    s = secuencia_valida()
    del s["salida_terreno"]["protocolo"][0]["unidad"]
    assert any("en qué unidad" in p for p in validar_secuencia(s))


def test_campo_de_texto_no_necesita_unidad():
    """El campo 'observaciones' es de texto: exigirle unidad sería un falso positivo."""
    s = secuencia_valida()
    problemas = validar_secuencia(s)
    assert not any("observaciones" in p for p in problemas)


def test_protocolo_vacio_deja_la_salida_sin_captura():
    s = secuencia_valida()
    s["salida_terreno"]["protocolo"] = []
    assert any("qué hay que medir" in p for p in validar_secuencia(s))


def test_un_solo_momento_de_recuperacion_no_es_espaciamiento():
    s = secuencia_valida()
    s["recuperacion_espaciada"] = s["recuperacion_espaciada"][:1]
    assert any("al menos en dos momentos" in p for p in validar_secuencia(s))


def test_momentos_de_recuperacion_repetidos():
    s = secuencia_valida()
    s["recuperacion_espaciada"][1]["semanas_despues"] = 1
    assert any("misma semana" in p for p in validar_secuencia(s))


# ── Resumen ──────────────────────────────────────────────────────────


def test_resumen_cuenta_las_piezas_que_la_interfaz_muestra():
    r = resumen_para_docente(secuencia_valida())
    assert r["pasos_del_ejemplo"] == 2
    assert r["campos_de_terreno"] == 2
    assert r["momentos_de_recuperacion"] == 2
    assert r["requiere_consulta"] is False


def test_resumen_tolera_una_secuencia_incompleta():
    """La interfaz llama a esto antes de validar; no debe reventar."""
    r = resumen_para_docente({"titulo": "a medias"})
    assert r["pasos_del_ejemplo"] == 0
    assert r["campos_de_terreno"] == 0


def test_el_ciclo_completo_parsea_y_valida():
    crudo = "```json\n" + json.dumps(secuencia_valida(), ensure_ascii=False) + "\n```"
    assert validar_secuencia(parsear_secuencia(crudo)) == []
