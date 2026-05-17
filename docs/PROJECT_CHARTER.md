# Project Charter: AprendeLocal

## 1. Problema

Las zonas rurales de Chile carecen de contenido STEM contextualizado a su realidad territorial. Los currículos nacionales no reflejan los ecosistemas, patrimonio ni desafíos locales, generando desconexión entre el aprendizaje y el entorno inmediato de los estudiantes.

## 2. Solución Propuesta

Un sistema que:
1. **Identifica** automáticamente características de una zona (ecosistema, patrimonio, desafíos) usando ML sobre datos geoespaciales y textuales
2. **Genera** proyectos STEM adaptados al contexto local usando LLMs con grounding en datos territoriales
3. **Presenta** los proyectos en una interfaz geolocalizada tipo mapa interactivo donde los estudiantes "descubren" proyectos vinculados a puntos de interés reales

## 3. Usuarios Objetivo

| Segmento | Necesidad |
|----------|-----------|
| Docentes rurales | Proyectos STEM listos para usar, adaptados a su contexto |
| Estudiantes (12-18 años) | Experiencias de aprendizaje conectadas a su territorio |
| Comunidades locales | Visibilización de patrimonio y desafíos |
| Municipios / DAEM | Datos sobre potencial educativo territorial |

## 4. MVP - La Araucanía

### Alcance geográfico
- 3-5 comunas rurales de La Araucanía (ej: Curarrehue, Lonquimay, Melipeuco)
- Zona de bosque templado / araucaria / volcanes

### Funcionalidades MVP
1. **Mapa interactivo** con POIs educativos (offline-capable)
2. **Clasificador de ecosistemas** basado en datos satelitales + CONAF
3. **Generador de proyectos STEM** usando Claude API con contexto local
4. **Fichas de patrimonio** natural y cultural por zona
5. **Panel docente** para filtrar y asignar proyectos

### Fuera del MVP
- Gamificación tipo Pokemon Go (logros, coleccionables)
- Realidad aumentada
- Cobertura nacional
- Sistema de evaluación integrado
- Comunidad entre escuelas

## 5. Métricas de Éxito (MVP)

| Métrica | Objetivo |
|---------|----------|
| Proyectos STEM generados | >50 únicos para la zona |
| Precisión clasificador ecosistemas | >85% |
| Docentes activos en piloto | 10-15 |
| Estudiantes alcanzados | 150-300 |
| Proyectos ejecutados en aula | >20 |

## 6. Riesgos

| Riesgo | Mitigación |
|--------|-----------|
| Conectividad rural limitada | PWA offline-first, sync cuando hay red |
| Datos territoriales incompletos | Validación con comunidad local + CONAF |
| Adopción docente baja | Co-diseño con profesores, capacitación |
| Sensibilidad cultural mapuche | Consulta a comunidades, revisión contenido |
| Calidad generación LLM | Revisión humana + rubrics de calidad |

## 7. Timeline MVP

| Fase | Duración | Entregable |
|------|----------|-----------|
| Investigación y datos | 6 semanas | Dataset curado Araucanía |
| ML Pipeline v1 | 4 semanas | Clasificador + generador funcional |
| Backend + API | 4 semanas | API desplegada |
| Frontend mapa | 5 semanas | PWA con mapa y proyectos |
| Piloto campo | 4 semanas | Feedback de 3 escuelas |
| Iteración | 3 semanas | MVP ajustado |
| **Total** | **~26 semanas** | **MVP validado** |
