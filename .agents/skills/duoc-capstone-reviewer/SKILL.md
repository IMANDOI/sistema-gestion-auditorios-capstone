---
name: duoc-capstone-reviewer
description: >-
  Usa esta skill para auditar, redactar y validar entregables e informes de la asignatura
  Capstone (PTY4614 - 002D) de la Escuela de Informática y Telecomunicaciones de Duoc UC.
  Garantiza el cumplimiento del 100% de la rúbrica oficial (Criterios 1 al 8) y previene pérdidas de puntos.
---

# Guía de Auditoría y Redacción de Entregables Capstone (Duoc UC)

Esta skill define el estándar obligatorio para cualquier informe, guía o presentación de la asignatura Proyecto Capstone (PTY4614 - 002D).

## Rúbrica Oficial de Evaluación (Matriz de 8 Criterios)

| Criterio | Ponderación | Clave de Éxito para Nota 7.0 | Error Típico a Evitar |
| :--- | :---: | :--- | :--- |
| **1. Ajustes al proyecto** | 10% | Cada ajuste DEBE incluir la **Fórmula de 4 Partes**: (1) Dificultad encontrada, (2) Facilitador aprovechado, (3) Retroalimentación docente recibida y (4) Justificación técnica y de negocio de la solución adoptada. | Mencionar los cambios sin justificar el porqué técnico y operacional. |
| **2. Metodología** | 10% | Explicar la metodología ágil híbrida (Scrum adaptado con sprints bisemanales y Kanban) y cómo aseguró el cumplimiento de los objetivos. | No vincular la metodología con los resultados alcanzados. |
| **3. Evidencias de avance** | 25% | Toda evidencia de documentación, código y almacenamiento de datos DEBE mapear **1 a 1 con las tareas planificadas en la Carta Gantt original (T01 a T12)**. Adjuntar capturas de BD, consultas SQL/Prisma y código en Git. | Entregar evidencias desalineadas de la planificación original. |
| **4. Lenguaje técnico** | 5% | Emplear vocabulario formal y riguroso de ingeniería de software (transacciones ACID, Prepared Statements, CUID, RBAC, ISO/IEC 25010, MTTR, Append-Only). | Usar explicaciones coloquiales o funcionales vagas. |
| **5. Ortografía y citas** | 5% | Redacción impecable, acentuación rigurosa y referencias formales bajo norma IEEE / APA. | Errores de puntuación o citas informales. |
| **6. Entrega en Git** | 20% | Estructura de carpetas limpia, archivos nombrados según formato institucional y repositorio versionado. | Entregas fuera del repositorio o archivos comprimidos sueltos. |
| **7. Equidad y aportes en Git** | 15% | Commits individuales, ramas temáticas (`feature/...`) y participación visible de cada integrante. | Un solo integrante subiendo todo en un commit gigante. |
| **8. Trabajo en equipo / Exposición** | 10% | Expresión fluida, dominio unificado del modelo de datos y arquitectura, participación equilibrada de todos los expositores. | Titubeos al responder preguntas de bases de datos o seguridad. |

## Fórmula Obligatoria para Justificar Ajustes (Criterio 1)
Cada ajuste en la tabla de monitoreo DEBE redactarse con esta estructura:
1. **Dificultad Encontrada:** Contexto de la falla o limitación observada en pruebas o diseño preliminar.
2. **Facilitador:** Herramienta, librería o patrón arquitectónico que permitió resolverlo.
3. **Retroalimentación Docente / Usuario:** Observación que impulsó la necesidad del cambio.
4. **Justificación Técnica:** Razones de arquitectura, ciberseguridad, rendimiento o latencia que validan la decisión.
5. **Impacto Medible:** Métrica concreta de mejora (tiempo, tasa de éxito, reducción de superficie de ataque).

## Matriz de Tareas del Proyecto (T01 a T12)
* `T01`: Formalización de Requerimientos (SRS / IEEE 830).
* `T02`: Modelado de Base de Datos y Restricciones (Prisma 3FN, PostgreSQL Neon).
* `T03`: Arquitectura Base y CI/CD en GitHub.
* `T04`: Autenticación, Seguridad y RBAC (bcrypt, cookies HttpOnly).
* `T05`: Formulario Modular de Reservas.
* `T06`: Panel de Dictamen y Gestión Logística.
* `T07`: Subsistema de Validación QR Móvil (Canvas nativo, auto-apagado).
* `T08`: Control de Inventario y Equipos (Mantenimiento, MTTR).
* `T09`: Motor de Correos y Difusión por Área (Cuadrillas Aseo/Guardia/TI).
* `T10`: Dashboard de Analítica y Horas de TI (Delta-T soporte).
* `T11`: Pruebas de Calidad ISO/IEC 25010 y Seguridad.
* `T12`: Despliegue en Producción y Cierre (Vercel Edge, Neon Cloud).

