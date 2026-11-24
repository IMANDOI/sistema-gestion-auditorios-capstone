---
name: registro-estado-proyecto
description: >-
  Gestiona y consulta el archivo maestro de estado del proyecto (PROJECT_STATE.md).
  Permite conocer instantáneamente la arquitectura, los 10 modelos de base de datos,
  las credenciales, el estado de las tareas T01 a T12 y los archivos clave sin tener que
  leer el código fuente completo, ahorrando tiempo, latencia y consumo de tokens.
---

# Skill: Registro Central de Estado del Proyecto (Memory Ledger)

Esta habilidad permite a cualquier agente o IA obtener el contexto completo del sistema en una sola lectura ultrarrápida del archivo maestro `PROJECT_STATE.md` ubicado en la raíz del proyecto.

## Protocolo de Lectura (Ahorro de Tokens)
1. **Antes de inspeccionar carpetas o archivos de código:** Consultar siempre `PROJECT_STATE.md`.
2. Si la información solicitada por el usuario (URLs, modelos de base de datos, credenciales demo, estado de tareas) ya está en `PROJECT_STATE.md`, responder directamente sin ejecutar exploraciones de archivos redundantes.

## Protocolo de Actualización Obligatoria
Cada vez que se complete una de las siguientes acciones:
* Creación o modificación de un modelo en `prisma/schema.prisma`.
* Despliegue de una nueva versión o cambio en variables de entorno.
* Corrección o actualización de un documento entregable (`.docx` o `.md`).
* Cambio en el estado de una tarea (de 'En Ejecución' a 'Completado').

**Se debe actualizar de inmediato el archivo `PROJECT_STATE.md`** para mantener la memoria sincronizada para la siguiente consulta.

