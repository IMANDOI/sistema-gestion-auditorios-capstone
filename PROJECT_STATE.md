# ESTADO MAESTRO DEL PROYECTO (PROJECT_STATE)
> **Propósito:** Registro central de memoria para consultas de IA y desarrolladores. Leer este archivo antes de explorar el código para ahorrar tokens y acelerar la respuesta.
> **Última actualización:** 09 de Noviembre de 2026

---

## 1. Identificación y Enlaces Oficiales
* **Proyecto:** Sistema Autónomo de Gestión Operativa, Trazabilidad, Analítica y Ciberseguridad para Auditorios (Capstone PTY4614 / APT122).
* **Institución:** Duoc UC — Escuela de Informática y Telecomunicaciones.
* **Estudiante / Desarrollador Principal:** Benjamín Navarrete (`benjamin54144752123@gmail.com`).
* **Profesor Guía:** Diego Garcés M.
* **Repositorio GitHub:** [https://github.com/IMANDOI/sistema-gestion-auditorios-capstone](https://github.com/IMANDOI/sistema-gestion-auditorios-capstone)
* **Despliegue Producción en Vercel:** [https://sistema-gestion-auditorios-capstone.vercel.app](https://sistema-gestion-auditorios-capstone.vercel.app)
* **Base de Datos Cloud:** PostgreSQL Serverless en Neon Tech (`ep-royal-firefly...neon.tech`).

---

## 2. Stack Tecnológico y Arquitectura
* **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons. Mobile-First y WCAG 2.1 AA.
* **Backend:** Next.js Server Actions (funciones RPC seguras en servidor; no hay endpoints REST expuestos públicamente).
* **Validación & Seguridad:** Zod para esquemas de entrada, `bcrypt` (salt rounds 10) para contraseñas, cookies de sesión `HttpOnly`/`Secure`/`SameSite=Lax`.
* **Persistencia:** Prisma 6 ORM. Consultas parametrizadas (anti SQL Injection). SQLite (`dev.db`) en local; PostgreSQL en Neon en producción.
* **Escaneo QR:** `CameraQRScanner.tsx` con Canvas off-DOM en memoria (anti clearing en Safari/Chrome móvil), sub-muestreo inteligente a 420px (tiempo de decodificación ~12ms), visor reticular esmeralda animado, feedback háptico (vibración) y sonoro, control de linterna (torch) y doble contingencia de captura fotográfica nativa (`capture="environment"`). Matriz QR generada bajo norma ISO/IEC 18004 con Quiet Zone de 4 módulos y nivel de corrección H (30%).
* **Automatización:** 4 Bots RPA (detección No-Show tras 15 min, alertas a cuadrillas, cómputo Delta-T horas soporte, bitácora forense).
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
* `T11`: Pruebas de Calidad ISO/IEC 25010 y Seguridad — **[EN EJECUCIÓN / HITO FASE 3]**
* `T12`: Despliegue en Producción y Cierre (Vercel + Neon Cloud) — **[ADELANTADO / OPERATIVO 100%]**

---

## 5. Historial de Calificaciones y Foco de Mejora
* **Fase 1 (Semana 4):** Aprobada con alta calificación.
* **Fase 2 (Semana 9):** Calificación **5.6 / 7.0** (81 / 100 pts).
  * *Puntos Fuertes (100%):* Git (Criterios 6 y 7 = 35% nota), Metodología (10%), Redacción/Ortografía (5%), Trabajo en equipo (10%).
  * *Puntos Perdidos (-19 pts):*
    1. Criterio 1 (-7 pts): Faltó justificar los ajustes técnicos con dificultad, facilitador y retroalimentación docente.
    2. Criterio 3 (-10 pts): Evidencias no mapeaban 1 a 1 con la nomenclatura T01-T12 de la Fase 1.
    3. Criterio 4 (-2 pts): Vocabulario técnico requería mayor precisión formal de ingeniería.
* **Fase 3 (Hito Final):** Meta de calificación **7.0**. Enfoque en certificación de pruebas de calidad ISO/IEC 25010, alineación estricta y defensa oral solvente.

---

## 6. Habilidades y Skills del Espacio (.agents/skills/)
* duoc-capstone-reviewer: Auditoría de rúbricas oficiales (Criterios 1 al 8) de Duoc UC.
* 
edaccion-profesional-documentos: Normas de estilo técnico y justificación de 4 partes.
* 
egistro-estado-proyecto: Protocolo de lectura/escritura de PROJECT_STATE.md para ahorro de tokens.
* ejecucion-paso-a-paso-validada: Ejecución secuencial, empíricamente validada y anti-estancamiento.
* certificacion-calidad-iso25010: Estándar formal de matrices de casos de prueba y aseguramiento de calidad (QA).
* programacion-limpia-y-eficiente: Edición quirúrgica de alta velocidad, tipado Zod/TypeScript estricto y desacoplamiento modular.

## 7. Estructura Limpia del Espacio de Trabajo
* objetos proyecto de titulo/: Código fuente REAL y activo (Next.js 15, Prisma 6, TypeScript).
* Fase 1/: Entregables oficiales de la Fase 1 (Definición y Arquitectura).
* Fase 2/: Entregables oficiales de la Fase 2 (Desarrollo y Avance con evidencias).
* _archivo_historico/: Respaldo seguro de carpetas obsoletas (código viejo de mayo y duplicados).
* scratch/: Utilidades y scripts de soporte limpios.

## 8. Archivos Clave del Proyecto (Dónde mirar)
* **Informe Final Proyecto APT - Fase 2 (30% Ponderación) [NUEVO MASTER]:**  
  `Fase 2/Evidencias Grupales/Guia3_Informe_Final_Proyecto_APT_Benjamin_Navarrete.docx` (1.89 MB, Portada, Abstract ESP/ENG, Matriz T01-T12, ISO 25010, Conclusiones/Reflexión en Inglés y 13 Figuras)  
  `Fase 2/Evidencias Grupales/Guia3_Informe_Final_Proyecto_APT_Benjamin_Navarrete.md`
* **Guion de Presentación Ejecutiva (20 Minutos - Martes 24 Nov):**  
  `Fase 2/Evidencias Grupales/GUION_PRESENTACION_EJECUTIVA_20MIN_DEFENSA_FINAL.docx`  
  `Fase 2/Evidencias Grupales/GUION_PRESENTACION_EJECUTIVA_20MIN_DEFENSA_FINAL.md`
* **Instrucciones Oficiales y Rúbrica 10 Indicadores Fase 2:**  
  `Fase 2/Instrucciones_y_Rubrica_Informe_Final_Fase2_30pct.md`
* **Guía Oficial de la Fase 2 (Corregida con Anexo A):**  
  `Fase 2/Evidencias Grupales/2.4_GuiaEstudiante_Fase 2_DesarrolloProyecto APT_Benjamín_Navarrete.docx`
* **Manual Maestro de Estudio y Defensa (Word con Índice y 25 preguntas de defensa técnica):**  
  `Fase 2/Evidencias Grupales/MANUAL_MAESTRO_DE_ESTUDIO_Y_DEFENSA_CAPSTONE.docx`  
  `Fase 2/Evidencias Grupales/MANUAL_MAESTRO_DE_ESTUDIO_Y_DEFENSA_CAPSTONE.md`
* **Código Fuente Principal:**  
  `objetos proyecto de titulo/src/components/CameraQRScanner.tsx` (Lector QR Multi-tier sub-12ms)  
  `objetos proyecto de titulo/prisma/schema.prisma` (Base de Datos Relacional 3FN)

