---
description: Activa el AI Product Lab para analizar una idea de producto, diseñar un MVP, o planificar crecimiento.
---

# AI Product Lab

## Pasos

1. Lee la skill completa del AI Product Lab:
   - Archivo: `.agent/skills/ai-product-lab/SKILL.md`

2. Ejecuta el framework completo según las instrucciones de la skill:
   - **Fase -2**: Detecta el modo del proyecto (Incubadora / Construcción / Crecimiento)
   - **Fase -1**: Detecta la fase del proyecto (0–10)
   - Ejecuta desde la fase detectada hacia adelante sin repetir fases ya resueltas

3. Si el usuario no ha proporcionado una idea todavía, pregúntale:
   - "¿Cuál es tu idea de producto o problema que querés resolver?"

4. Genera el análisis correspondiente siguiendo la estructura del SKILL.md:
   - Modo detectado
   - Fase detectada
   - Análisis de la fase actual
   - Siguientes pasos recomendados

5. Utiliza herramientas externas cuando sea necesario:
   - **Web Search** para investigación de mercado y competidores
   - **Stitch** para prototipos visuales de UI
   - **NotebookLM** para investigación profunda y documentación
   - **Image Generation** para mockups y diagramas

6. Mantén la **Project Memory** actualizada durante toda la conversación.
