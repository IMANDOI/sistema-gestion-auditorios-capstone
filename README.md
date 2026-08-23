# Espacio de Desarrollo: Proyecto de Título (Portafolio de Título PTY4614)
## Producto Mínimo Viable (MVP): Sistema Autónomo de Gestión Operativa, Trazabilidad, Analítica y Centro de Operaciones de Ciberseguridad (SOC) para Auditorios

Este directorio contiene todos los artefactos de ingeniería, especificaciones técnicas, modelos de persistencia, arquitectura de ciberseguridad, centro de operaciones SOC y entregables oficiales para el desarrollo del Proyecto de Título.

---

### Resumen del MVP, Problemática Operativa, Ciberseguridad y SOC
El proyecto es un **Producto Mínimo Viable (MVP) funcional de arquitectura autónoma y genérica (*White-Label*)**, aplicable a cualquier centro universitario, de formación técnica o complejo corporativo. Su objetivo es validar empíricamente la resolución de problemas operacionales y proveer observabilidad total mediante un **Centro de Control de Ciberseguridad y Operaciones (SOC Dashboard)**:
1. **Eliminación del Cuello de Botella de TI:** Reduce el tiempo de espera del personal de soporte técnico de hasta **1 hora a menos de 30 segundos** mediante validación presencial por **códigos QR dinámicos**.
2. **Difusión Automática a Unidades de Apoyo:** Distribuye cronogramas sincronizados a las cuadrillas de **Aseo, Guardias y TI** para que la información llegue a tiempo y sin omisiones.
3. **Control de No-Shows y Cancelaciones Tardías:** Integra confirmación anticipada por token sin login y un algoritmo de penalización de prioridad (*PriorityScore*).
4. **Dashboard de Analítica Cuantitativa:** Sustituye opiniones y quejas subjetivas por **métricas duras (estrellas 1-5, NPS, tasa de ocupación real, horas de soporte ahorradas)**.
5. **Centro de Control de Ciberseguridad y Telemetría (SOC Dashboard):** Panel interactivo avanzado que contabiliza ataques mitigados, accesos no deseados (403 Forbidden), intentos de fuerza bruta, tokens QR fraudulentos y latencia de base de datos para análisis inmediato y a largo plazo.
6. **Ciberseguridad y Protección de Datos Sensibles:** Hashing de contraseñas con `bcrypt` (factor >= 10), tokens JWT cifrados (JWE) en cookies `HttpOnly`/`Secure`/`SameSite=Lax`, consultas parametrizadas con Prisma ORM (anti SQLi), validación en servidor con Zod y cabeceras HTTP defensivas (HSTS, CSP, X-Frame-Options).

---

### Repositorio Público Oficial (GitHub)
* 🔗 **Enlace Oficial:** [https://github.com/IMANDOI/sistema-gestion-auditorios-capstone](https://github.com/IMANDOI/sistema-gestion-auditorios-capstone)

---

### Estructura de Documentación de Ingeniería (Fase 1 - MVP)

1. 📄 **[informe_fase_1_definicion_proyecto.md](file:///c:/Users/MAANDO/Desktop/PROYECTO%20DE%20TITULO/objetos%20proyecto%20de%20titulo/informe_fase_1_definicion_proyecto.md)**:
   * **Propósito:** Informe técnico maestro completo estructurado según la **Guía 1.5** y la **Rúbrica Sumativa Fase 1** de la asignatura Capstone.
   * **Contenido:**
     * Portada formal con datos del estudiante, independencia institucional, definición explícita como MVP y marco de ciberseguridad.
     * Resumen ejecutivo en español.
     * **Parte I:** Antecedentes, Definición y alcance del MVP, Fundamentación de la problemática operacional, Pertinencia con las 4 competencias del perfil de egreso, Relación con intereses profesionales y Estudio de factibilidad multidimensional.
     * **Parte II:** Objetivos (General y 6 Específicos del MVP), Metodología ágil Scrum con roles de un equipo de 8 ingenieros especializados, Matriz de Evidencias de avance/final, Plan de trabajo y Carta Gantt detallada para 18 semanas.
     * **Parte III:** Arquitectura de software, marco de ciberseguridad (OWASP / ISO 27001), Centro de Control SOC y Telemetría, Diagrama de Casos de Uso, Diagrama C4 de Contenedores y Modelo Entidad-Relación relacional con tabla `SecurityAuditLog`.
     * **Parte IV:** Límites del MVP vs Roadmap evolutivo post-proyecto, Conclusiones generales, Conclusiones individuales y Reflexión profesional.
     * **Parte V:** Referencias bibliográficas formales (OWASP / ISO 27001 / IEEE / ISO 25010 / Lean Startup).

2. 📄 **[especificacion_requerimientos.md](file:///c:/Users/MAANDO/Desktop/PROYECTO%20DE%20TITULO/objetos%20proyecto%20de%20titulo/especificacion_requerimientos.md)**:
   * **Propósito:** Especificación formal de requerimientos de software (SRS) del MVP bajo estándar internacional IEEE 830 / ISO/IEC/IEEE 29148 y OWASP.
   * **Contenido:**
     * Matriz de 6 Roles con jerarquía de privilegios (RBAC).
     * 16 Requerimientos Funcionales del MVP (RF-01 a RF-16, incluyendo Centro de Control SOC y Explorador de Logs).
     * 8 Requerimientos Específicos de Ciberseguridad (RS-01 a RS-08).
     * 10 Requerimientos No Funcionales (RNF-01 a RNF-10) clasificados bajo ISO/IEC 25010.
     * Matriz de Trazabilidad Requerimientos vs Dolores Operacionales vs Ciberseguridad.
