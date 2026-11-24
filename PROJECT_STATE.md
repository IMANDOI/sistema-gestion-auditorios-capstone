# ESTADO MAESTRO DEL PROYECTO (PROJECT_STATE)
> **Propósito:** Registro central de memoria para consultas de IA y desarrolladores. Leer este archivo antes de explorar el código para ahorrar tokens y acelerar la respuesta.
> **Última actualización:** 13 de Noviembre de 2026 (Arquitectura v2.0 + Plantilla Oficial 2.6)

---

## 1. Identificación y Enlaces Oficiales
* **Asignatura:** ASIGNATURA CAPSTONE (PTY4614 - 002D).
* **Proyecto:** Sistema de Gestión y Control Operativo de Auditorios (SIGOA).
* **Institución:** Duoc UC — Escuela de Informática y Telecomunicaciones.
* **Estudiante / Desarrollador Principal:** Benjamin Navarrete.
* **Profesor Guía:** Diego Garcés M.
* **Fechas Oficiales:** Presentación Evaluación Final Fase 2 (ante Profesor Guía Diego Garcés M.): **Martes 1 de Diciembre de 2026** | Defensa Final ante Comisión Evaluadora: **Jueves 10 de Diciembre de 2026**.
* **Repositorio GitHub:** [https://github.com/IMANDOI/sistema-gestion-auditorios-capstone](https://github.com/IMANDOI/sistema-gestion-auditorios-capstone)
* **Despliegue Producción en Vercel:** [https://sistema-gestion-auditorios-capstone.vercel.app](https://sistema-gestion-auditorios-capstone.vercel.app)
* **Base de Datos Cloud:** PostgreSQL Serverless en Neon Tech (`ep-royal-firefly...neon.tech`).

---

## 2. Stack Tecnológico y Arquitectura (v2.0)
* **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons. Mobile-First y WCAG 2.1 AA. Exportación institucional de calendario `.ics` (RFC 5545 para Outlook 365 / Teams) desde `/docente`.
* **Backend:** Next.js Server Actions (funciones RPC seguras en servidor; sin endpoints REST expuestos). Transacciones atómicas `prisma.$transaction` anti-condiciones de carrera y agregaciones SQL nativas $O(1)$ (`aggregate` + `take: 250`) en `getDashboardData()`.
* **Validación & Seguridad:** Zod para esquemas de entrada, `bcrypt` (salt rounds 10) para contraseñas, cookies de sesión `HttpOnly`/`Secure`/`SameSite=Lax`, y firma criptográfica de tokens QR dinámicos `QR2.<id>.<exp>.<hmacHex16>` mediante **HMAC-SHA256** (`timingSafeEqual`) en `src/lib/qr-security.ts`.
* **Persistencia:** Prisma 6 ORM con índices compuestos en `Reserva` (`[auditorioId, status, startTime, endTime]`, `[userId, createdAt]`), `RegistroAuditoria` (`[entity, createdAt]`) y `RegistroMantenimiento` (`[status, severity]`). PostgreSQL en Neon Cloud.
* **Escaneo QR & Offline-First:** `CameraQRScanner.tsx` con Canvas off-DOM en memoria, sub-muestreo a 420px (~12ms), visor reticular, feedback háptico/sonoro, linterna, captura nativa y cola **Offline-First** (`auditorio_offline_checkin_queue_v2` en `localStorage`) con sincronización diferida al recuperar señal en recintos subterráneos. Matriz QR bajo ISO/IEC 18004 (Quiet Zone 4, corrección H 30%).
* **Integraciones & Automatización:** `src/lib/integrations.ts` (RFC 5545 `.ics` con `VALARM -PT15M` y constructores de Webhooks Microsoft Teams Adaptive Cards / Telegram Bot API) + 4 Bots RPA.
* **Continuidad Operativa:** Módulo IRP (Incident Response Plan) con severidades SEV-1 a SEV-4.

---

## 3. Diccionario de los 10 Modelos Relacionales (Prisma)
1. `User`: Cuentas y roles RBAC (OWNER, IT_ADMIN, IT_SERVICE, ASSISTANT, PROFESSOR, STUDENT) con `priorityScore` cívico (100 base).
2. `Auditorio`: Recintos físicos con capacidad, ubicación y estado (`OPERATIONAL`, `MAINTENANCE`, `PARTIAL_RESTRICTION`).
3. `Reserva`: Tabla central con horarios (`startTime`, `endTime`), estado (`PENDING`, `APPROVED`, `CHECKED_IN`, etc.), `qrToken` único y marcas de tiempo de soporte.
4. `Equipamiento`: Hardware audiovisual en pañol (stock total y disponible, categorías AUDIO, PROJECTION, COMPUTING, etc.).
5. `ReservaEquipamiento`: Tabla intermedia N:M con atributos (cantidad prestada, `delivered`, `returned`, notas).
6. `RegistroHorasTI`: Registro matemático del tiempo de asistencia del técnico presencial (Delta-T en minutos y fracción decimal de hora).
7. `EncuestaSatisfaccion`: Calificación 1-5 estrellas (general, equipos, soporte), comentario y categoría NPS (Promotor, Pasivo, Detractor).
8. `SuscripcionArea`: Listas de distribución de cuadrillas (Aseo, Guardia, TI, Coordinación) para despacho de notificaciones automáticas.
9. `RegistroAuditoria`: Bitácora forense inmutable (*Append-Only*). Graba quién, qué, sobre qué entidad, fecha e IP. Sin permisos de UPDATE/DELETE en código.
10. `RegistroMantenimiento`: Trazabilidad de recintos o hardware en taller, severidad, técnico asignado, cálculo de MTTR y constancia técnica obligatoria.

---

## 4. Estado de las 12 Tareas de la Carta Gantt (Fase 1 a Fase 3)
* `T01`: Formalización de Requerimientos (SRS / IEEE 830) — **[COMPLETADO]**
* `T02`: Modelado de Base de Datos y Restricciones (Prisma 3FN, Neon Cloud) — **[COMPLETADO]**
* `T03`: Arquitectura Base y CI/CD en GitHub — **[COMPLETADO]**
* `T04`: Autenticación, Seguridad y RBAC (bcrypt, HttpOnly, Gestor de Cuentas) — **[COMPLETADO]**
* `T05`: Formulario Modular de Reservas (Selector, validación anti-traslape) — **[COMPLETADO]**
* `T06`: Panel de Dictamen y Gestión Logística (Reprogramación segura protegida) — **[COMPLETADO]**
* `T07`: Subsistema de Validación QR Móvil (Pase 2D ISO 18004 + escáner multi-tier off-DOM canvas, visor reticular y doble contingencia nativa) — **[COMPLETADO 100% OPERATIVO]**
* `T08`: Control de Inventario y Equipos (Mantenimiento, MTTR, constancias) — **[COMPLETADO CON AJUSTE]**
* `T09`: Motor de Correos y Difusión por Área (Gestor de cuadrillas y plantillas) — **[COMPLETADO CON AJUSTE]**
* `T10`: Dashboard de Analítica y Horas de TI (Métricas operativas y Delta-T) — **[COMPLETADO]**
* `T11`: Pruebas de Calidad ISO/IEC 25010 y Seguridad — **[COMPLETADO 100% / SUITE AUTOMATIZADA 12/12 PASS]**
* `T12`: Despliegue en Producción y Cierre (Vercel + Neon Cloud) — **[OPERATIVO 100% EN PRODUCCIÓN]**

---

## 5. Historial de Calificaciones y Foco de Mejora
* **Fase 1 (Semana 4):** Aprobada con alta calificación.
* **Fase 2 - Entrega de Avance (Semana 9):** Calificación **5.6 / 7.0** (81 / 100 pts).
  * *Puntos Fuertes (100%):* Git (Criterios 6 y 7 = 35% nota), Metodología (10%), Redacción/Ortografía (5%), Trabajo en equipo (10%).
  * *Puntos Perdidos (-19 pts):*
    1. Criterio 1 (-7 pts): Faltó justificar los ajustes técnicos con dificultad, facilitador y retroalimentación docente.
    2. Criterio 3 (-10 pts): Evidencias no mapeaban 1 a 1 con la nomenclatura T01-T12 de la Fase 1.
    3. Criterio 4 (-2 pts): Vocabulario técnico requería mayor precisión formal de ingeniería.
* **Fase 2 - Informe Final (30% Ponderación - Presentación ante Profesor Guía 1 Dic / Defensa Comisión 10 Dic):** Meta de calificación **7.0**. Plantilla oficial 2.6 fusionada, arquitectura v2.0, fórmula de 4 partes, mapeo T01-T12, certificación ISO 25010 (12/12 tests) y benchmark 3,500 ops.

---

## 6. Reglas y Skills del Espacio (`AGENTS.md` y `.agents/skills/`)
* `AGENTS.md`: Reglas invariantes de identidad, privacidad (`0` correos), idioma (`100%` español), plantillas intocables y ahorro de tokens.
* `duoc-capstone-reviewer`: Auditoría de rúbricas oficiales (Criterios 1 al 10) de Duoc UC.
* `redaccion-profesional-documentos`: Normas de estilo técnico y justificación de 4 partes.
* `registro-estado-proyecto`: Protocolo de lectura/escritura de PROJECT_STATE.md para ahorro de tokens.
* `ejecucion-paso-a-paso-validada`: Ejecución secuencial, empíricamente validada y anti-estancamiento.
* `certificacion-calidad-iso25010`: Estándar formal de matrices de casos de prueba y aseguramiento de calidad (QA).
* `programacion-limpia-y-eficiente`: Edición quirúrgica de alta velocidad, tipado Zod/TypeScript estricto y desacoplamiento modular.
* `optimizacion-agentes-y-tokens`: Orquestación económica de subagentes, lectura selectiva, batching paralelo y ahorro de tokens.
* `ingenieria-documentos-word-pptx`: Generación y auditoría del Informe 2.6 y PPTX pastel mate para telón blanco.
* `arquitectura-auditorios-v2`: Mapa quirúrgico de módulos v2.0 y comandos exactos de verificación en Windows.
* `defensa-comision-capstone`: Protocolo de exposición de 20 minutos, demo en vivo de 4 minutos y banco de preguntas de comisión.
* `auditoria-visual-office-pdf`: Renderizado y auditoría visual real de `.pdf`, `.docx` y `.pptx` con PyMuPDF + LibreOffice.

## 7. Estructura Limpia del Espacio de Trabajo
* objetos proyecto de titulo/: Código fuente REAL y activo (Next.js 15, Prisma 6, TypeScript).
* Fase 1/: Entregables oficiales de la Fase 1 (Definición y Arquitectura).
* Fase 2/: Entregables oficiales de la Fase 2 (Desarrollo, Pruebas, Informe Final 30% y Presentación).
* _archivo_historico/: Respaldo seguro de carpetas obsoletas (código viejo de mayo y duplicados).
* scratch/: Utilidades y scripts de soporte limpios.

## 8. Archivos Clave del Proyecto (Estructura Limpia y Ordenada — Solo Word/PPTX/Evidencias)
* **Entregables Principales en `Fase 2/` (Raíz limpia):**
  * **Informe Final Oficial Plantilla 2.6 (Entregable Definitivo):** `Fase 2/2.6_GuiaEstudiante_Fase_2_Informe_Final_Proyecto_APT_Benjamin_Navarrete.docx`
  * **Presentación Ejecutiva 20 min (Pastel Mate Telón Blanco):** `Fase 2/Presentacion_Final_Proyecto_APT_20min_Benjamin_Navarrete.pptx`
* **Carpeta `Fase 2/Evidencias Grupales/` (Word, PPTX y PNGs, sin `.md` redundantes):**
  * Copias sincronizadas de `2.6_GuiaEstudiante...docx` y `Presentacion_Final...pptx`
  * `2.4_GuiaEstudiante_Fase 2_DesarrolloProyecto APT_Benjamin_Navarrete.docx`
  * `GUION_PRESENTACION_EJECUTIVA_20MIN_DEFENSA_FINAL.docx`, `MANUAL_MAESTRO_DE_ESTUDIO_Y_DEFENSA_CAPSTONE.docx`, `PLAN_DE_PRUEBAS_Y_CERTIFICACION_CALIDAD_ISO25010.docx`, `PLAN_DE_RESPUESTA_A_INCIDENTES_IRP.docx`, `MANUAL_RPA_Y_PLAN_DE_CONTINGENCIAS.docx`, `GUIA_DESPLIEGUE_VERCEL_Y_NEON.docx`, `CREDENCIALES_Y_ACCESOS_SISTEMA.docx`, `Informe_Tecnico_Avance_Fase2_Benjamin_Navarrete.docx`
  * `capturas_evidencia/` (`Figura_01` a `Figura_18` a color)
* **Carpeta `Fase 2/Evidencias Proyecto/04_Pruebas_Calidad_ISO25010/`:**
  * `REPORTE_CERTIFICACION_ISO25010_v2.html`, `junit_iso25010_v2.xml`, `benchmark_iso25010_v2.json`, `evidencia_ejecucion_iso25010_v2.txt`
* **Respaldo Histórico Preservado (informes antiguos y `.md` archivados):**
  * `_archivo_historico/fase2_orden_respaldo/`
* **Código Fuente Principal (SIGOA v2.0):**  
  `objetos proyecto de titulo/src/lib/qr-security.ts` (Tokens QR dinámicos HMAC-SHA256)  
  `objetos proyecto de titulo/src/lib/integrations.ts` (Calendario `.ics` RFC 5545 + Webhooks Teams/Telegram)  
  `objetos proyecto de titulo/src/components/CameraQRScanner.tsx` (Lector QR Multi-tier + Offline-First)  
  `objetos proyecto de titulo/prisma/schema.prisma` (Base de Datos Relacional 3FN + Índices Compuestos)

