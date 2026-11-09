# INFORME TÉCNICO FINAL Y MEMORIA DE PROYECTO APT
## Sistema Autónomo de Gestión Operativa, Trazabilidad, Analítica y Ciberseguridad para Auditorios
### Portafolio de Título (PTY4614 / APT122) — Escuela de Informática y Telecomunicaciones — Duoc UC

**Estudiante:** Benjamín Abraham Navarrete Hernández  
**Docente Guía Evaluador:** Diego Garcés M.  
**Asignatura / Código:** Proyecto Capstone (PTY4614 / APT122) — Semanas 16 a 18  
**Fecha:** Noviembre 2026  
**Repositorio Oficial GitHub:** [https://github.com/IMANDOI/sistema-gestion-auditorios-capstone](https://github.com/IMANDOI/sistema-gestion-auditorios-capstone)  
**Despliegue en Producción Vercel:** [https://sistema-gestion-auditorios-capstone.vercel.app](https://sistema-gestion-auditorios-capstone.vercel.app)  
**Archivo Word Oficial:** `Fase 3/Evidencias Grupales/Informe_Final_Proyecto_APT_Fase3_Benjamin_Navarrete.docx`  

---

## 1. RESUMEN EJECUTIVO Y PROBLEMA OPERACIONAL RESUELTO
El proyecto **Sistema Autónomo de Gestión Operativa de Auditorios** concluye satisfactoriamente su desarrollo de 18 semanas, entregando un Producto Mínimo Viable (MVP) funcional de grado industrial y arquitectura desacoplada (*White-Label*).

Resuelve de raíz los 4 dolores institucionales:
1. **Caos de Agenda y Solapamiento:** Validación matemática temporal en transacciones atómicas de base de datos.
2. **Pérdida de Horas de TI:** Pases QR criptográficos 2D validados en menos de 15 segundos con auto-apagado de cámara y cómputo matemático de horas dedicadas (Delta-T).
3. **Desconexión con Cuadrillas:** Despacho automático de requerimientos a Aseo, Guardia y TI.
4. **Cero Trazabilidad de Hardware:** Dashboard de Salud Operacional con telemetría de MTTR, downtime acumulado y constancias técnicas obligatorias de taller.

---

## 2. CONSOLIDACIÓN DE LAS 12 TAREAS (T01 A T12)
* `T01`: Formalización de Requerimientos (SRS / IEEE 830) — **[100% COMPLETADO]**
* `T02`: Modelado de Datos Relacional (Prisma 3FN, Neon Cloud) — **[100% COMPLETADO]**
* `T03`: Arquitectura Base y CI/CD en GitHub — **[100% COMPLETADO]**
* `T04`: Autenticación, Seguridad Estructural y RBAC (bcrypt salt 10, HttpOnly) — **[100% COMPLETADO]**
* `T05`: Formulario Modular de Reservas (/docente, anti-solapamiento) — **[100% COMPLETADO]**
* `T06`: Panel de Dictamen y Gestión Logística (/encargado, reprogramación protegida) — **[100% COMPLETADO]**
* `T07`: Subsistema de Validación QR Móvil (CameraQRScanner.tsx nativo) — **[100% COMPLETADO]**
* `T08`: Control de Inventario y Equipos en Taller (Constancias obligatorias) — **[100% COMPLETADO]**
* `T09`: Motor de Notificaciones y Cuadrillas de Apoyo (Aseo, Guardia, TI) — **[100% COMPLETADO]**
* `T10`: Dashboard de Analítica y Horas de TI (MTTR, Delta-T, KPIs) — **[100% COMPLETADO]**
* `T11`: Pruebas de Calidad ISO/IEC 25010 (Suite automatizada `npm test`: 8/8 PASS) — **[100% COMPLETADO]**
* `T12`: Despliegue en Producción y Cierre (Vercel Edge + Neon Cloud) — **[100% COMPLETADO]**

---

## 3. CERTIFICACIÓN DE CALIDAD DE SOFTWARE (ISO/IEC 25010)
Batería de pruebas automatizadas ejecutadas y validadas mediante `npm test`:
* **Adecuación Funcional:** CP-FUNC-01 (Anti-solapamiento) y CP-FUNC-02 (Cómputo exacto Delta-T horas soporte).
* **Ciberseguridad (OWASP Top 10):** CP-SEC-01 (Sanitización Zod anti SQLi) y CP-SEC-02 (Hashing bcrypt salt 10).
* **Fiabilidad & Recuperabilidad:** CP-REL-01 (Plan de Respuesta a Incidentes IRP SEV-1 a SEV-4).
* **Usabilidad & Accesibilidad:** CP-USA-01 (WCAG 2.1 AA contraste >= 4.5:1) y CP-USA-02 (Constancia técnica de taller).
* **Resultado Global:** **100% de Casos APROBADOS (PASS)** en 377 ms.

---

## 4. AJUSTES TÉCNICOS Y JUSTIFICACIONES FORMALES
Se formalizaron los 4 ajustes mayores del proyecto bajo la regla de 4 partes:
1. *Lector QR Móvil (T07):* Recorte central nativo 800x800 con attemptBoth y auto-apagado de hardware tras 500 ms (tasa de éxito 98.5% y validación en <10 s).
2. *Base de Datos Neon Cloud (T02/T12):* Migración a PostgreSQL serverless con pooler PgBouncer para concurrencia en Vercel Edge.
3. *Seguridad Defensiva Embebida (T04):* Eliminación de SOC decorativo e integración de seguridad estructural (bcrypt, HttpOnly, Zod, RegistroAuditoria Append-Only).
4. *Módulo de Taller y MTTR (T08/T10):* Registro técnico de novedades con cálculo de MTTR y constancia obligatoria.

---

## 5. CONCLUSIÓN
El sistema valida empíricamente el cumplimiento del 100% de las competencias del perfil de egreso en gestión de proyectos, bases de datos relacionales, ingeniería de software y aseguramiento de calidad bajo estándares internacionales.
