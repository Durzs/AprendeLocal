#!/usr/bin/env python3
"""
Genera el corpus curricular brasileño desde datos verificados.

POR QUÉ UN GENERADOR Y NO ESCRIBIRLAS

Son 570 habilidades. Copiarlas a mano es garantizar erratas, y una errata aquí
no se ve: un código mal escrito no rompe nada, simplemente ese objetivo deja de
aparecer, y el mismo código puede acabar impreso en el papel que firma una
dirección. Lo que hay aquí sale de `bncc-dev/bncc-dados`, que publica la BNCC
como datos abiertos y verifica cada texto carácter a carácter contra el PDF
homologado de 2018. Cada habilidad se guarda con la página donde se comprobó.

QUÉ SE CARGA Y QUÉ NO

Los anos finais, de 6º a 9º, que es lo que se decidió que cubre la edición
carioca. Seis componentes: Língua Portuguesa, Matemática, Ciências, História,
Geografia y Arte.

Quedan fuera Língua Inglesa, Educação Física y Ensino Religioso, que no tienen
equivalente en las seis asignaturas del piloto chileno. Y queda fuera
Computação: la BNCC de 2018 no tiene componente de Tecnología en los anos
finais —la cultura digital es transversal— y se decidió que esa columna
desaparece en la edición brasileña en vez de inventarle un mapeo.

CÓMO SE USA

    git clone --depth 1 https://github.com/bncc-dev/bncc-dados /tmp/bncc
    python3 scripts/generar-bncc.py /tmp/bncc

Escribe en src/frontend/src/modules/sequences/crear/bncc/ y no toca nada más.
"""

import collections
import json
import pathlib
import re
import sys
import unicodedata

# Los seis componentes que se cargan, con el nombre del archivo y el legible.
COMPONENTES = {
    "ef-comp-lp": ("lingua_portuguesa", "Língua Portuguesa"),
    "ef-comp-ma": ("matematica", "Matemática"),
    "ef-comp-ci": ("ciencias", "Ciências"),
    "ef-comp-hi": ("historia", "História"),
    "ef-comp-ge": ("geografia", "Geografia"),
    "ef-comp-ar": ("arte", "Arte"),
}

ANOS = {6, 7, 8, 9}

# Palabras que no sirven para buscar. Se sacan de las claves derivadas del
# texto: `claves` existe para encontrar una habilidad escribiendo una palabra
# suelta, y «para» o «sobre» no ayudan a encontrar nada.
VACIAS = set(
    """a o e de da do das dos em no na nos nas um uma uns umas por para com sem sobre
    entre como que se ao aos à às pelo pela pelos pelas seu sua seus suas este esta
    estes estas esse essa esses essas aquele aquela isso isto ou nem mais menos muito
    pouco já não sim ser estar ter haver fazer poder dever outros outras qual quais
    tais tal etc bem também onde quando quanto cada todo toda todos todas outro outra
    mesmo mesma""".split()
)


def claves(texto: str) -> list[str]:
    """Palabras con las que buscar la habilidad sin acordarse del código.

    Se derivan del texto y no están curadas a mano, al revés que las del
    catálogo chileno. Se dice aquí para que nadie las lea como si alguien las
    hubiera elegido una por una.
    """
    plano = unicodedata.normalize("NFD", texto.lower())
    plano = "".join(c for c in plano if unicodedata.category(c) != "Mn")
    vistas, salida = set(), []
    for palabra in re.findall(r"[a-z]{4,}", plano):
        if palabra in VACIAS or palabra in vistas:
            continue
        vistas.add(palabra)
        salida.append(palabra)
        if len(salida) == 8:
            break
    return salida


def unidade(habilidad: dict, ctx: dict) -> str:
    """Cómo se agrupa la habilidad en la lista.

    La BNCC organiza dos componentes de manera distinta al resto: Língua
    Portuguesa va por campo de actuación y práctica de lenguaje, y los demás
    por unidad temática. Se resuelven las dos formas a una sola cadena porque
    la pantalla solo necesita un encabezado con el que agrupar.
    """
    org = habilidad["organizacao"]
    if org["tipo"] == "unidade_tematica":
        return ctx.get(org["unidade_tematica"], {}).get("nome", "")
    if org["tipo"] == "campo_pratica":
        campos = [ctx.get(c, {}).get("nome", "") for c in org.get("campos_atuacao", [])]
        practica = ctx.get(org.get("pratica_linguagem", ""), {}).get("nome", "")
        campo = campos[0] if campos else ""
        if campo and practica:
            return f"{campo} · {practica}"
        return campo or practica
    return ""


CABECERA = '''/**
 * {nombre}: las habilidades de los anos finais.
 *
 * GENERADO, NO ESCRITO A MANO
 *
 * Sale de `bncc-dev/bncc-dados`, que publica la BNCC como datos abiertos y
 * verifica cada texto carácter a carácter contra el PDF homologado de 2018.
 * `pagina` es dónde se comprobó cada una, para que cualquiera pueda abrir el
 * documento y mirarlo.
 *
 * No se edita a mano: se corrige el generador, `scripts/generar-bncc.py`, y se
 * vuelve a correr.
 */

import type {{ Habilidade }} from "../bncc";

export const {constante}: Habilidade[] = [
'''


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2

    origen = pathlib.Path(sys.argv[1])
    datos = json.loads(
        (origen / "dados/bncc-2018/ensino-fundamental.json").read_text(encoding="utf-8")
    )
    verificacion = json.loads(
        (origen / "dados/bncc-2018/verificacao.json").read_text(encoding="utf-8")
    )
    ctx = {c["id"]: c for c in datos["contextos_organizacao"]}

    elegidas = sorted(
        (
            h
            for h in datos["habilidades"]
            if set(h["anos"]) & ANOS and h["componente"] in COMPONENTES
        ),
        key=lambda h: h["codigo"],
    )

    # Una habilidad que el propio dataset no pudo verificar contra el PDF no
    # entra. Es la misma regla que el guardián de objetivos chilenos: un código
    # que no se puede comprobar acaba citado en un papel que alguien firma.
    sin_verificar = [
        h["codigo"]
        for h in elegidas
        if verificacion.get(h["codigo"], {}).get("status") != "ok"
    ]
    if sin_verificar:
        print(f"✗ {len(sin_verificar)} habilidades sin verificar: {sin_verificar[:8]}")
        return 1

    destino = pathlib.Path(__file__).resolve().parents[1] / (
        "src/frontend/src/modules/sequences/crear/bncc"
    )
    destino.mkdir(parents=True, exist_ok=True)

    por_componente: dict[str, list[dict]] = collections.defaultdict(list)
    for h in elegidas:
        por_componente[h["componente"]].append(h)

    for componente, lista in por_componente.items():
        slug, nombre = COMPONENTES[componente]
        partes = [CABECERA.format(nombre=nombre, constante=slug.upper())]
        for h in lista:
            partes.append("  {\n")
            partes.append(f'    codigo: {json.dumps(h["codigo"], ensure_ascii=False)},\n')
            partes.append(f'    anos: {json.dumps(sorted(h["anos"]))},\n')
            partes.append(f'    componente: {json.dumps(slug)},\n')
            partes.append(f'    unidade: {json.dumps(unidade(h, ctx), ensure_ascii=False)},\n')
            partes.append(f'    texto:\n      {json.dumps(h["texto"], ensure_ascii=False)},\n')
            partes.append(f'    claves: {json.dumps(claves(h["texto"]), ensure_ascii=False)},\n')
            partes.append(f'    pagina: {verificacion[h["codigo"]]["pagina_pdf"]},\n')
            partes.append("  },\n")
        partes.append("];\n")
        (destino / f"{slug}.ts").write_text("".join(partes), encoding="utf-8")

        banda = sum(1 for h in lista if len(h["anos"]) > 1)
        print(f"  {len(lista):>4}  {slug}.ts  ({banda} por banda, {len(lista) - banda} por año)")

    print(f"\n  {len(elegidas):>4}  habilidades, todas verificadas contra el PDF homologado")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
