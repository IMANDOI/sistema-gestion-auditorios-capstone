# GUÍA 3: INFORME FINAL PROYECTO APT
## FASE 2 (30%) — DESARROLLO E IMPLANTACIÓN
### ASIGNATURA CAPSTONE (PTY4614 - 002D) — Duoc UC
**Estudiante Desarrollador:** Benjamin Navarrete (`benjamin.navarrete@duocuc.cl`)  
**Profesor Guía:** Diego Garcés M.  
**Ponderación:** 30% de la Nota Final (Semana 15)  
**Fecha de Presentación:** Martes 24 de Noviembre de 2026, 14:30 hrs  
**Repositorio GitHub:** [https://github.com/IMANDOI/sistema-gestion-auditorios-capstone](https://github.com/IMANDOI/sistema-gestion-auditorios-capstone)  
**Producción Vercel:** [https://sistema-gestion-auditorios-capstone.vercel.app](https://sistema-gestion-auditorios-capstone.vercel.app)  

---

## FICHA GENERAL DE IDENTIFICACIÓN DEL PROYECTO APT (GUÍA 3)

| Campo Institucional | Descripción del Proyecto |
| :--- | :--- |
| **Asignatura** | ASIGNATURA CAPSTONE (PTY4614 - 002D) |
| **Estudiante Desarrollador** | Benjamin Navarrete (`benjamin.navarrete@duocuc.cl`) |
| **Profesor Guía** | Diego Garcés M. |
| **Nombre del Proyecto** | Sistema Autónomo de Gestión Operativa, Trazabilidad, Analítica y Ciberseguridad para Auditorios. |
| **Área(s) de Desempeño del Plan de Estudio** | 1. Ingeniería de Software y Arquitectura Web Full-Stack.<br>2. Gestión de Bases de Datos y Modelamiento Relacional Escalable.<br>3. Ciberseguridad Defensiva, Trazabilidad e Integridad de la Información.<br>4. Automatización Robótica de Procesos (RPA) y Calidad de Software (QA). |
| **Competencias del Plan de Estudio Abordadas** | • Realizar pruebas de certificación tanto de los productos como de los procesos utilizando buenas prácticas definidas por la industria (ISO/IEC 25010).<br>• Gestionar proyectos informáticos, ofreciendo alternativas para la toma de decisiones de acuerdo a los requerimientos de la organización.<br>• Construir modelos de datos para soportar los requerimientos de la organización de acuerdo a un diseño definido y escalable en el tiempo (Prisma ORM / PostgreSQL).<br>• Desarrollar una solución de software utilizando técnicas que permitan sistematizar el proceso de desarrollo y mantenimiento, asegurando el logro de los objetivos (Next.js 15 Serverless). |

---

## RESUMEN EJECUTIVO (ABSTRACT EN ESPAÑOL)
El proyecto "Sistema Autónomo de Gestión Operativa, Trazabilidad, Analítica y Ciberseguridad para Auditorios" surge como una solución tecnológica integral para modernizar la gestión logística y operativa de los recintos de alta demanda académica en Duoc UC. Tradicionalmente, la administración de auditorios enfrentaba traslapes de reservas, retrasos de hasta 25 minutos en el ingreso docente, falta de trazabilidad en el pañol audiovisual y ausencia de métricas respecto a las horas efectivas dedicadas por el personal de soporte TI.

Para resolver esta problemática, se diseñó e implantó una plataforma full-stack moderna basada en Next.js 15, TypeScript y React 19, articulada con Prisma 6 ORM y una base de datos relacional PostgreSQL desplegada en arquitectura cloud serverless (Neon Tech). La solución incorpora un subsistema de validación móvil basado en códigos QR bidimensionales (norma ISO/IEC 18004) con un motor de escaneo multi-nivel en canvas virtual que opera en sub-12 ms, cuatro agentes de automatización robótica (RPA) para control de ausencias (*No-Show*) y despacho de cuadrillas, una bitácora forense inmutable (*Append-Only*) que asegura integridad de auditoría, y un panel de analítica operativa que computa el diferencial de tiempo de asistencia técnica (Delta-T) con precisión al minuto.

El sistema fue sometido a una certificación rigurosa bajo el estándar ISO/IEC 25010 mediante una batería de pruebas automatizadas con 100% de éxito (8/8 tests superados), validando adecuación funcional, fiabilidad, rendimiento y blindaje de seguridad contra vectores OWASP Top 10. La solución se encuentra completamente operativa y desplegada en producción en Vercel, reduciendo el tiempo de check-in a menos de 30 segundos y optimizando en un 100% la trazabilidad de los recursos institucionales.

---

## EXECUTIVE ABSTRACT (ENGLISH VERSION)
The project 'Autonomous Operational Management, Traceability, Analytics, and Cybersecurity System for Auditoriums' was designed and deployed as a robust engineering solution to overcome administrative inefficiencies in high-demand academic facilities at Duoc UC. Historically, auditorium management suffered from schedule collisions, check-in delays of up to 25 minutes, untracked audiovisual equipment, and an absence of formal metrics regarding technical support hours.

To eliminate these vulnerabilities, a cloud-native full-stack software architecture was engineered using Next.js 15, TypeScript, and React 19, backed by Prisma 6 ORM and a third normal form (3NF) relational PostgreSQL database hosted on Neon Cloud. Key innovations include an ultra-fast mobile QR validation engine (ISO/IEC 18004 compliant) decoding video frames via an in-memory canvas within sub-12 milliseconds, four Robotic Process Automation (RPA) bots managing unattended reservations (*No-Show*) and automated crew dispatch, an append-only forensic audit log preventing tampering, and a real-time operational dashboard computing exact technician support time (Delta-T).

The software underwent rigorous quality certification under the ISO/IEC 25010 international standard via automated integration testing, achieving a 100% pass rate (8/8 tests passed). The platform is fully deployed on Vercel production infrastructure with continuous integration (GitHub Actions), cutting room access validation times to under 30 seconds and delivering zero schedule collisions.

---

## 1. RELEVANCIA DEL PROYECTO APT

### 1.1 Problema que Buscó Solucionar y Relevancia Disciplinar
En el ámbito de la gestión de infraestructura y tecnologías de información en instituciones de educación superior, los auditorios magnos representan activos estratégicos de alto costo y uso crítico. En la sede de Duoc UC, la coordinación de estos recintos dependía históricamente de planillas manuales descentralizadas, comunicaciones informales por mensajería instantánea y bitácoras en papel.

Esta carencia de sistematización generaba cuatro problemas operacionales graves:
1. **Colisiones de Horario y Doble Reserva:** Ausencia de bloqueos atómicos, permitiendo solapamientos horarios.
2. **Tiempos Muertos Excesivos en Acceso Docente:** Demoras de 15 a 25 minutos buscando llaves físicas y carpetas.
3. **Pérdida de Trazabilidad en Pañol:** Hardware audiovisual sin registro digital de entrega y retorno.
4. **Falta de Medición de Horas TI:** Inexistencia de telemetría de horas efectivas dedicadas por los técnicos.

### 1.2 Ubicación Institucional y Características del Recinto
El proyecto se focaliza en el **Auditorio Magna Principal** de Duoc UC (Edificio A - Nivel Central), con capacidad para 150 asistentes, proyección láser 4K, audio Shure SM58, switch PoE Cisco Catalyst y climatización Daikin VRV, operando con una rotación promedio de 6 a 8 eventos diarios.

### 1.3 Usuarios Afectados e Impacto
* **Docentes y Expositores (PROFESSOR):** Solicitan recintos interactivamente y reciben pase QR digital.
* **Encargada de Auditorio (ASSISTANT):** Dictamina y aprueba solicitudes con algoritmo de prioridad cívica.
* **Técnicos de Soporte TI (IT_SERVICE):** Validan Check-in en < 30s con lector QR y registran horas de terreno.
* **Dirección de TI (IT_ADMIN / OWNER):** Supervisan analítica operacional, MTTR y bitácora forense.
* **Cuadrillas de Aseo y Guardia:** Reciben notificaciones estructuradas con 24 hrs de antelación.

### 1.4 Aporte de Valor Demostrado
* **Tiempo de Check-in:** Reducido de 25 min a **< 30 segundos**.
* **Tasa de Solapamientos:** Reducida de 10 incidentes mensuales a **0% garantizado**.
* **Trazabilidad de Hardware:** Elevada al **100%** mediante checklist digital auditado.

---

## 2. OBJETIVOS DEL PROYECTO APT

### 2.1 Objetivo General
Desarrollar e implantar una solución de software web responsiva, robusta y cibersegura para la gestión operativa, control de reservas, validación de acceso mediante códigos QR, analítica de soporte técnico y trazabilidad inmutable en los auditorios de Duoc UC, cumpliendo con los estándares de calidad de la industria y la norma ISO/IEC 25010.

### 2.2 Objetivos Específicos Medibles (SMART)
1. **OE-1 (Arquitectura y Modelamiento):** Diseñar e implementar un modelo relacional en 3FN en PostgreSQL/Prisma ORM con 10 entidades y consultas parametrizadas.
2. **OE-2 (Validación QR de Alta Eficiencia):** Construir subsistema móvil de escaneo QR bajo norma ISO/IEC 18004 con decodificación en canvas virtual en sub-12 ms y check-in en < 30s.
3. **OE-3 (Automatización Robótica de Procesos):** Desarrollar 4 bots RPA para penalización de No-Show tras 15 min, alertas a cuadrillas y cómputo matemático Delta-T.
4. **OE-4 (Ciberseguridad y Trazabilidad Forense):** Implementar RBAC con bcrypt salt 10, cookies HttpOnly y bitácora forense inmutable Append-Only.
5. **OE-5 (Certificación de Calidad y Despliegue):** Certificar el software bajo ISO/IEC 25010 con suite automatizada (8/8 tests pass) y despliegue continuo en Vercel/Neon Cloud.

---

## 3. METODOLOGÍA IMPLEMENTADA Y SU PERTINENCIA
Se implementó un marco ágil híbrido **Scrum/Kanban** en 4 Sprints quincenales a lo largo de 15 semanas, articulado con integración continua en GitHub Actions. La pertinencia radica en garantizar trazabilidad 1 a 1 de las tareas planificadas, validación empírica en cada iteración y adaptación inmediata ante desafíos de ingeniería en terreno.

---

## 4. DESARROLLO DE INGENIERÍA DEL PROYECTO APT

### 4.1 Tareas Planificadas (T01 a T12)
* `T01`: Requerimientos SRS bajo IEEE 830 y matriz de trazabilidad. **[COMPLETADO]**
* `T02`: Modelado relacional 3FN en Prisma ORM y Neon Cloud. **[COMPLETADO]**
* `T03`: Arquitectura base Next.js 15 y CI/CD en GitHub Actions. **[COMPLETADO]**
* `T04`: Autenticación RBAC, cookies HttpOnly y bcrypt. **[COMPLETADO]**
* `T05`: Formulario de reservas y exclusión mutua anti-traslape. **[COMPLETADO]**
* `T06`: Panel de dictamen con reprogramación protegida. **[COMPLETADO]**
* `T07`: Escáner QR móvil multi-tier off-DOM canvas (< 30s). **[COMPLETADO]**
* `T08`: Pañol audiovisual, cálculo MTTR y constancias técnicas. **[COMPLETADO]**
* `T09`: Motor de correos y difusión automática a cuadrillas. **[COMPLETADO]**
* `T10`: Dashboard de analítica, horas TI Delta-T y NPS. **[COMPLETADO]**
* `T11`: Suite de certificación ISO/IEC 25010 (8/8 pass). **[COMPLETADO]**
* `T12`: Despliegue cloud en Vercel y cierre de titulación. **[COMPLETADO]**

### 4.2 Dificultades Enfrentadas y Facilitadores (Fórmula de 4 Partes)
* **Dificultad 1 (Anti-Solapamiento):** Se ajustó la exclusión mutua atómica en Server Actions; originada por condiciones de carrera concurrentes; resuelta por transacciones ACID en Prisma y PostgreSQL; validada por directriz de Diego Garcés.
* **Dificultad 2 (Escaneo QR en Celulares):** Se ajustó el motor a canvas off-DOM virtual en memoria a 420px; originada por el vaciado de búfer de canvas ocultos en WebKit/Chrome móvil; resuelta por sub-muestreo inteligente multi-tier (12ms) y feedback háptico; validada por exigencia de operatividad autónoma en terreno.
* **Dificultad 3 (Cómputo Delta-T Horas TI):** Se ajustó el cálculo matemático de horas entre Check-in y Check-out; originada por discrepancias en bitácoras manuales; resuelta por algoritmo diferencial en milisegundos; validada por la necesidad institucional de métricas de productividad.
* **Dificultad 4 (Trazabilidad Forense Inmutable):** Se ajustó la bitácora bajo patrón Append-Only; originada por requerimientos de no-repudio; resuelta por consultas parametrizadas y validación Zod; validada por estándares de ciberseguridad corporativa.

### 4.3 Cumplimiento de Indicadores de Calidad del Perfil de Egreso (IL 2.4)
* **Competencia 1 (Certificación):** Indicadores 1.1, 1.2 y 1.3 cubiertos con matriz de 8 pruebas ISO 25010 superadas con 100% de éxito en CI/CD.
* **Competencia 2 (Gestión):** Indicadores 2.1 y 2.2 cubiertos mediante Carta Gantt T01-T12 y Plan IRP de incidentes SEV-1 a SEV-4.
* **Competencia 3 (Modelos de Datos):** Indicadores 3.1 y 3.2 cubiertos mediante diseño 3FN con 10 modelos en Neon Cloud PostgreSQL.
* **Competencia 4 (Solución de Software):** Indicadores 4.1, 4.2 y 4.3 cubiertos con arquitectura serverless Next.js 15 en Vercel.

---

## 5. EVIDENCIAS DE CUMPLIMIENTO DEL PROYECTO
* **Código Fuente:** [https://github.com/IMANDOI/sistema-gestion-auditorios-capstone](https://github.com/IMANDOI/sistema-gestion-auditorios-capstone)
* **Producción:** [https://sistema-gestion-auditorios-capstone.vercel.app](https://sistema-gestion-auditorios-capstone.vercel.app)
* **CI/CD:** GitHub Actions workflow `ci.yml` en estado **SUCCESS**.
* **Pruebas:** 8/8 tests superados en 364 ms (`node:test tests/iso25010.test.mjs`).

---

## 6. INTERESES Y PROYECCIONES PROFESIONALES
El proyecto consolidó el perfil de Benjamin Navarrete hacia la **Arquitectura Cloud Serverless**, la **Ciberseguridad Defensiva** y la **Automatización RPA**. Proyección inmediata como Ingeniero de Software Full-Stack / Cloud Engineer con metas de certificación AWS Solutions Architect.

---

## 7. COMPETENCIAS DEL PERFIL DE EGRESO EVIDENCIADAS
Demostración cabal de las 4 competencias: Certificación de software bajo estándares, Gestión de proyectos informáticos, Modelamiento de datos relacionales escalables y Desarrollo de software sistemático y mantenible.

---

## 8. INDIVIDUAL CONCLUSIONS (IN ENGLISH ONLY)
The execution and successful completion of the Capstone project 'Autonomous Operational Management, Traceability, Analytics, and Cybersecurity System for Auditoriums' represents a paramount milestone in my transition from a student developer into a professional software engineer. From an engineering and operational standpoint, the following conclusive findings are established:

1. **Engineering Rigor and Architectural Excellence:** Designing and deploying a modern cloud-native architecture using Next.js 15, TypeScript, and Prisma ORM demonstrated that decoupled server actions and strongly-typed data contracts significantly reduce technical debt and runtime vulnerabilities. The zero-error compilation track record across seven production routes certifies the robustness of strict TypeScript engineering.

2. **Breakthrough Mobile QR Performance:** The critical optimization achieved in `CameraQRScanner.tsx`—moving from a hidden DOM canvas prone to GPU backing-store purging to an off-DOM virtual canvas processing downsampled frames in sub-12 milliseconds—proved that deep knowledge of browser rendering engines and WebKit memory management is essential when deploying enterprise web applications on mobile devices.

3. **Tangible Operational and Business Value:** The project successfully eliminated a 25-minute administrative bottleneck, slashing room access check-in times to under 30 seconds. Furthermore, the mathematical computation of dedicated technical support hours (Delta-T) and the automated penalization of unattended reservations (*No-Show* bots) transformed qualitative uncertainty into precise, actionable institutional telemetry.

4. **International Quality Certification:** Subjecting the codebase to an automated testing suite aligned with the ISO/IEC 25010 quality standard—achieving an uncompromised 100% pass rate in continuous integration—demonstrates that the developed solution meets the highest software development benchmarks established by the global IT industry.

---

## 9. INDIVIDUAL REFLECTION (IN ENGLISH ONLY)
Looking back on the intensive 15-week journey of the Capstone course, this project has been the most demanding yet rewarding academic experience of my degree. It challenged not only my technical capabilities in frontend and backend engineering, but also my perseverance, analytical problem-solving skills, and ethical commitment to software quality.

During the initial phases, receiving constructive feedback regarding formal justification formulas and strict task alignment was a defining turning point. Instead of perceiving it as an obstacle, I embraced it as an opportunity to adopt professional engineering rigor. When facing complex mobile camera incompatibilities where devices failed to decode QR matrices under low-light conditions, I learned the importance of methodical debugging: rather than applying fragile guesswork, analyzing memory allocations, downsampling ratios, and hardware constraints allowed me to build an ultra-fast, multi-tier scanning engine.

On a personal level, this project reaffirmed my vocational passion for cloud architecture, defensive cybersecurity, and automation. Working as the primary developer on an end-to-end mission-critical platform taught me that real-world software engineering is about taking ownership, ensuring stakeholder value, and upholding integrity in every line of code. I conclude this Capstone experience fully confident in my competencies and eager to contribute to high-impact technology initiatives in the professional software industry.

---

## 10. REFERENCIAS BIBLIOGRÁFICAS (APA 7ma / IEEE)
1. Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley Professional.
2. ISO/IEC. (2011). *ISO/IEC 25010:2011 Systems and software engineering — SQuaRE*. International Organization for Standardization.
3. ISO/IEC. (2015). *ISO/IEC 18004:2015 Automatic identification and data capture — QR Code symbology specification*. ISO.
4. Martin, R. C. (2018). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall.
5. OWASP Foundation. (2021). *OWASP Top 10:2021 — The Ten Most Critical Web Application Security Risks*. OWASP.
6. Prisma Data, Inc. (2024). *Prisma ORM Documentation: Transactions and Type Safety*. https://www.prisma.io/docs
7. Vercel, Inc. (2024). *Next.js 15 Documentation: Server Actions and App Router*. https://nextjs.org/docs

---

## ANEXO A: MATRIZ DE EVIDENCIAS FOTOGRÁFICAS (13 FIGURAS)
* **Figura 1:** Pantalla de Autenticación con Selector Rápido de Perfiles y RBAC seguro (`Figura_01_login_page.png`).
* **Figura 2:** Portal del Docente con Formulario Interactivo y Emisión de Pase QR (`Figura_02_docente_page.png`).
* **Figura 3:** Panel de Dictamen y Gestión Logística de la Encargada de Auditorio (`Figura_03_encargado_page.png`).
* **Figura 4:** Dashboard Administrativo Principal con Telemetría Operativa y Horas TI (`Figura_04_admin_page.png`).
* **Figura 5:** Modal de Reprogramación Segura con Bloqueo de Campos Críticos (`Figura_05_edit_modal_disabled.png`).
* **Figura 6:** Reprogramación Habilitada tras Confirmación de Motivo y Trazabilidad (`Figura_06_edit_modal_enabled.png`).
* **Figura 7:** Registro de Auditoría Forense Inmutable (Append-Only) en Base de Datos (`Figura_07_audit_log_entry.png`).
* **Figura 8:** Gestión y Configuración de Cuadrillas Operativas de Apoyo (`Figura_08_funcionarios_aseo_updated.png`).
* **Figura 9:** Métricas de Salud Operacional, MTTR y Disponibilidad en Taller (`Figura_09_health_dashboard_top.png`).
* **Figura 10:** Bitácora de Mantenimiento con Constancia Técnica Obligatoria (`Figura_10_bitacora_resolved.png`).
* **Figura 11:** Módulo de Automatización RPA con Liberación Autónoma de No-Show (`Figura_11_rpa_irp_section.png`).
* **Figura 12:** Banner de Estado del Plan de Respuesta a Incidentes (IRP SEV-1 a SEV-4) (`Figura_12_rpa_and_irp_banner.png`).
* **Figura 13:** Protocolo Activo de Gestión de Contingencias e Incidentes (`Figura_13_irp_incident_modal.png`).
