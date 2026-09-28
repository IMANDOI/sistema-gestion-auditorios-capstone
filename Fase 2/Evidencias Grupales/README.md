# FASE 2: DESARROLLO DE SOFTWARE, PROTOTIPO FUNCIONAL Y EVIDENCIAS DE CONSTRUCCIÓN
## Sistema Autónomo de Gestión Operativa de Auditorios y Optimización de Soporte TI
### Proyecto Capstone (APT122 / PTY4614) — Duoc UC 2026

En este directorio se compilan las evidencias formales y documentos técnicos de la **Fase 2 (Semanas 5 a 12)** del proyecto, correspondientes a la construcción integral del software, la implementación de la arquitectura técnica, las pruebas de caja negra/blanca bajo la norma ISO/IEC 25010 y el prototipo operativo funcional ejecutado en local.

---

### DOCUMENTACIÓN PRINCIPAL DISPONIBLE EN ESTA CARPETA

1. **[informe_fase_2_desarrollo_software.md](file:///c:/Users/MAANDO/Desktop/PROYECTO%20DE%20TITULO/Fase%202/Evidencias%20Grupales/informe_fase_2_desarrollo_software.md):**
   * **Capítulo 1:** Resumen Ejecutivo y Estado de Cumplimiento de la Fase 2.
   * **Capítulo 2:** Matriz de Trazabilidad de Requerimientos (RF-01 a RF-25 y RS-01 a RS-10).
   * **Capítulo 3:** Arquitectura de Software Implementada (Next.js 15, React 19, Prisma ORM, Diagramas C4 y Modelo ER de 10 entidades).
   * **Capítulo 4:** Especificación de Portales Operacionales y Experiencia de Usuario (`/login`, `/tecnico`, `/docente`, `/encargado`, `/admin`).
   * **Capítulo 5:** Módulo de Salud Operacional, Bitácora de Novedades y Dashboard con Gráficos de Hardware (MTTR, Downtime, Operatividad %).
   * **Capítulo 6:** Mecanismo de Seguridad y Doble Confirmación para Modificación de Horarios (`HORARIO_MODIFICADO_ADMIN`).
   * **Capítulo 7:** Protocolo y Matriz de Pruebas ISO 25010 en Entorno Local (TC-01 a TC-15).
   * **Capítulo 8:** Hoja de Ruta para Despliegue en la Nube (Vercel + Neon PostgreSQL) en Fase 3.
   * **Capítulo 9:** Declaración Formal de Cumplimiento y Aprobación de Fase.

---

### CÓDIGO FUENTE RELACIONADO
El código fuente ejecutable del software se encuentra disponible en la raíz del repositorio, incluyendo:
* `src/app/`: Rutas y páginas de portales para cada rol.
* `src/components/`: Componentes modulares accesibles (`MaintenanceDashboard.tsx`, `CuadrillaManager.tsx`, etc.).
* `src/lib/`: Lógica transaccional (`actions.ts`, `prisma.ts`, `types.ts`).
* `prisma/`: Esquema de base de datos (`schema.prisma`) y semillero de datos inicial (`seed.js`).

---
*Benjamín Navarrete — Super Administrador / Desarrollador Principal*
