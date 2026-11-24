---
name: certificacion-calidad-iso25010
description: >-
  Diseña, estructura y documenta matrices formales de casos de prueba y certificación de software
  bajo el estándar ISO/IEC 25010 para entregables de Capstone (PTY4614 - 002D). Cubre adecuación
  funcional, fiabilidad, seguridad (OWASP) y usabilidad para asegurar el 100% en Criterio 3 de la rúbrica.
---

# Skill: Certificación de Calidad de Software bajo Estándar ISO/IEC 25010

Esta habilidad se activa cuando el estudiante o el proyecto requiera diseñar, documentar o auditar el plan de pruebas y aseguramiento de calidad (QA) para la Fase 3 y la entrega final de titulación.

---

## 1. Dimensiones Evaluadas según ISO/IEC 25010

Para el Proyecto Capstone se estructuran pruebas en 4 dimensiones críticas:

1. **Adecuación Funcional (Functional Suitability):**
   * *Completitud funcional:* El sistema cubre los 25 Requerimientos Funcionales (RF-01 a RF-25).
   * *Corrección funcional:* El motor anti-solapamiento rechaza reservas superpuestas y el cómputo de horas TI (Delta-T) es exacto.
2. **Seguridad (Security):**
   * *Confidencialidad:* Cero inyecciones SQL mediante Prepared Statements de Prisma ORM.
   * *Integridad:* Bitácora forense `RegistroAuditoria` inmutable (*Append-Only*).
   * *Autenticidad:* Hashing bcrypt (salt 10) y sesiones con cookies `HttpOnly`/`Secure`.
3. **Fiabilidad y Tolerancia a Fallos (Reliability):**
   * *Disponibilidad:* Despliegue en Vercel Edge con 99.9% de uptime y base serverless Neon Postgres.
   * *Recuperabilidad:* Plan de Respuesta a Incidentes (IRP) y contingencia local en SQLite.
4. **Usabilidad y Accesibilidad (Usability):**
   * *Accesibilidad:* Cumplimiento de pautas WCAG 2.1 AA (contraste mínimo 4.5:1, etiquetas semánticas).
   * *Operabilidad:* Lector QR por cámara con decodificación en <15 segundos y auto-apagado.

---

## 2. Estructura Obligatoria de Casos de Prueba (Matriz Duoc UC)

Cada caso de prueba debe documentarse con la siguiente ficha técnica estandarizada:

| Campo | Descripción |
| :--- | :--- |
| **ID del Caso de Prueba** | Código formal correlativo: `CP-01`, `CP-02`, etc. |
| **Requerimiento Asociado** | Vínculo estricto al catálogo: `RF-01`, `RS-03`, etc. |
| **Dimensión ISO 25010** | Adecuación Funcional / Seguridad / Fiabilidad / Usabilidad. |
| **Objetivo de la Prueba** | Qué se busca validar técnicamente. |
| **Precondiciones** | Estado previo de la base de datos o sesión de usuario requerida. |
| **Datos de Entrada** | Valores exactos ingresados (fechas, correos, IDs, tokens). |
| **Pasos de Ejecución** | Secuencia numerada de acciones ejecutadas. |
| **Resultado Esperado** | Comportamiento que define el éxito del software. |
| **Resultado Obtenido** | Evidencia empírica de lo que ocurrió realmente. |
| **Estado Final** | **APROBADO (PASS)** / **RECHAZADO (FAIL)**. |

---

## 3. Protocolo de Pruebas Críticas del Sistema de Auditorios

1. **Prueba de Concurrencia y Anti-Solapamiento (CP-CONC-01):**
   * Simular dos peticiones concurrentes para el mismo auditorio en un intervalo coincidente (`startTime < newEnd` y `endTime > newStart`).
   * Validar que la transacción atómica de Prisma procesa una y aborta la segunda con mensaje de conflicto.
2. **Prueba de Seguridad ante Inyección SQL (CP-SEC-01):**
   * Ingresar payloads maliciosos (`' OR '1'='1`, `'; DROP TABLE User; --`) en campos de búsqueda y login.
   * Validar que Prisma escapa los caracteres como texto literal y la base de datos permanece intacta.
3. **Prueba de Resiliencia del Lector QR (CP-QR-01):**
   * Probar el escaneo en pantalla de smartphone con 50% de brillo y reflejo de luz fluorescente.
   * Validar que el recorte central 800x800 y `attemptBoth` decodifican el token en menos de 15 segundos.

