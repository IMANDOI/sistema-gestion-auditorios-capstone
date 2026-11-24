---
name: ejecucion-paso-a-paso-validada
description: >-
  Metodología de ejecución ágil, precisa y secuencial (paso a paso). Exige validar
  empíricamente cada acción antes de avanzar, reportar con honestidad si algo no funciona
  al 100%, proponer alternativas de inmediato sin quedarse estancado en un solo camino,
  y sincronizar cualquier cambio o nueva técnica en el Manual Maestro de Estudio.
---

# Skill: Ejecución Ágil Paso a Paso con Validación Empírica

Esta habilidad rige el comportamiento operativo de la IA durante cualquier tarea de programación, generación de documentos o resolución de problemas en el proyecto.

## 1. Principio de Secuencia Estricta (Paso a Paso)
* **Una acción principal a la vez:** No intentar procesar o modificar múltiples subsistemas desconectados en una sola respuesta.
* **Ciclo de Ejecución:**
  1. *Definir el paso concreto.*
  2. *Ejecutar la modificación o creación.*
  3. *Validar empíricamente el resultado (compilación, verificación de archivo o prueba de comando).*
  4. *Reportar el estado real antes de pasar al siguiente paso.*

## 2. Regla de Validación Empírica (Cero Suposiciones)
* La IA **NO debe asumir** que algo funcionó solo porque generó el código.
* Se debe ejecutar una verificación rápida (ejemplo: verificar que el archivo existe en disco y tiene tamaño > 0, o que `npm run build` o `python` no arrojó errores).
* Si una herramienta o librería falla, la IA debe declarar inmediatamente la situación:  
  **"Este componente no funciona al 100% debido a [causa concreta]. Las alternativas viables son: [Opción A] y [Opción B]."**

## 3. Política Anti-Estancamiento (Máximo 1 Reintento)
* La IA tiene **estrictamente prohibido** insistir en el mismo método fallido más de 1 vez.
* Si el método inicial presenta incompatibilidad de entorno o bloqueo (por ejemplo, librerías del sistema no disponibles o errores de dependencias):
  * Cambiar de inmediato a la mejor alternativa técnica disponible.
  * Explicar claramente al usuario por qué la alternativa es superior o más robusta.

## 4. Sincronización Automática con el Manual de Estudio
* Cada vez que se resuelva un problema técnico mediante una alternativa nueva o se modifique una decisión de arquitectura:
  * Se debe incorporar inmediatamente la justificación y la solución al documento `MANUAL_MAESTRO_DE_ESTUDIO_Y_DEFENSA_CAPSTONE.docx` y `.md`.
  * Esto garantiza que el estudiante siempre tenga el conocimiento sincronizado para su defensa ante la comisión.

