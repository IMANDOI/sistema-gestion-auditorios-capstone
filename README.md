# Espacio de Desarrollo: Proyecto Capstone (APT122 / PTY4614)
## Producto Mínimo Viable (MVP): Sistema Autónomo de Gestión Operativa, Trazabilidad, Medición de Horas de TI y Analítica para Auditorios

Este repositorio contiene la especificación de requerimientos de software (SRS), el informe formal de ingeniería (Fase 1), los modelos de persistencia y la arquitectura técnica del Proyecto Capstone.

---

### Resumen del MVP y Problemática Operacional
El proyecto consiste en un **Producto Mínimo Viable (MVP) funcional de arquitectura desacoplada (*White-Label*)**, aplicable a cualquier centro universitario, de formación técnica o complejo corporativo. Su objetivo es resolver ineficiencias operacionales mediante automatización y ciberseguridad defensiva:
1. **Control y Registro Exacto de Horas de TI:** Reduce el tiempo de espera del personal de soporte técnico de hasta **1 hora a menos de 30 segundos** mediante validación presencial por **códigos QR dinámicos**, computando el tiempo real de soporte dedicado por evento (`checkoutTime - checkInTime`).
2. **Difusión Automática a Unidades de Apoyo:** Distribuye cronogramas sincronizados a las cuadrillas de **Aseo, Guardias y TI** para asegurar la oportuna preparación de los espacios.
3. **Control de No-Shows y Cancelaciones Tardías:** Integra confirmación anticipada por token sin login y un algoritmo de penalización de prioridad (*PriorityScore*).
4. **Dashboard de Analítica Operativa:** Centraliza métricas cuantitativas de servicio (**balance de horas de TI, calificaciones 1-5, NPS y tasas de ocupación efectiva**).
5. **Ciberseguridad Defensiva:** Hashing de contraseñas con `bcrypt` (factor de costo $\ge 10$), tokens JWT en cookies `HttpOnly`/`Secure`/`SameSite=Lax`, consultas parametrizadas con Prisma ORM (anti SQLi), validación en servidor con Zod y cabeceras HTTP defensivas (HSTS, CSP, X-Frame-Options).

---

### Repositorio Público Oficial (GitHub)
* 🔗 **Enlace Oficial:** [https://github.com/IMANDOI/sistema-gestion-auditorios-capstone](https://github.com/IMANDOI/sistema-gestion-auditorios-capstone)

---

### Estructura de Documentación de Ingeniería (Fase 1 - MVP)

1. 📄 **[informe_fase_1_definicion_proyecto.md](file:///c:/Users/MAANDO/Desktop/PROYECTO%20DE%20TITULO/objetos%20proyecto%20de%20titulo/informe_fase_1_definicion_proyecto.md)**:
   * **Propósito:** Informe técnico maestro estructurado según la **Guía 1.5** y la **Rúbrica Sumativa Fase 1** de la asignatura Capstone.
   * **Contenido:**
     * Portada formal con datos del estudiante, independencia institucional y definición explícita como MVP.
     * Resumen ejecutivo en español.
     * **Parte I:** Antecedentes, Definición y alcance del MVP, Fundamentación de la problemática operacional, Pertinencia con las 4 competencias del perfil de egreso, Relación con intereses profesionales y Estudio de factibilidad multidimensional.
     * **Parte II:** Objetivos (General y 6 Específicos del MVP), Metodología ágil Scrum con roles de ingeniería de software, Matriz de Evidencias de avance/final, Plan de trabajo y Carta Gantt detallada para 18 semanas.
     * **Parte III:** Arquitectura de software, marco de ciberseguridad defensiva (OWASP / ISO 27001), Dashboard de analítica y horas de TI, Diagrama de Casos de Uso, Diagrama C4 de Contenedores y Modelo Entidad-Relación relacional.
     * **Parte IV:** Límites del MVP vs Roadmap evolutivo post-proyecto, Conclusiones generales, Conclusiones individuales y Reflexión profesional.
     * **Parte V:** Referencias bibliográficas formales (OWASP / ISO 27001 / IEEE / ISO 25010 / Lean Startup).

2. 📄 **[especificacion_requerimientos.md](file:///c:/Users/MAANDO/Desktop/PROYECTO%20DE%20TITULO/objetos%20proyecto%20de%20titulo/especificacion_requerimientos.md)**:
   * **Propósito:** Especificación formal de requerimientos de software (SRS) del MVP bajo estándar internacional IEEE 830 / ISO/IEC/IEEE 29148 y OWASP.
   * **Contenido:**
     * Matriz de 6 Roles con jerarquía de privilegios (RBAC).
     * 14 Requerimientos Funcionales del MVP (RF-01 a RF-14).
     * 8 Requerimientos Específicos de Ciberseguridad (RS-01 a RS-08).
     * 10 Requerimientos No Funcionales clasificados bajo ISO/IEC 25010.
     * Matriz de Trazabilidad Requerimientos vs Dolores Operacionales.

3. 🎤 **[guion_y_estructura_presentacion_15min.md](file:///c:/Users/MAANDO/Desktop/PROYECTO%20DE%20TITULO/objetos%20proyecto%20de%20titulo/guion_y_estructura_presentacion_15min.md)**:
   * **Propósito:** Guía de estructura visual y guion oral cronometrado de 10 diapositivas para la defensa presencial de 15 minutos ante la comisión evaluadora.

4. 🧠 **[guia_estudio_conceptos_defensa.md](file:///c:/Users/MAANDO/Desktop/PROYECTO%20DE%20TITULO/objetos%20proyecto%20de%20titulo/guia_estudio_conceptos_defensa.md)**:
   * **Propósito:** Glosario técnico y guía de preparación conceptual (IEEE 830, ISO 27001, OWASP Top 10, JWT, Prisma, PostgreSQL y respuestas preparadas para la comisión).
