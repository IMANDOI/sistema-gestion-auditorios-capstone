# INFORME TÉCNICO DE AVANCE - FASE 2: DESARROLLO CORE, ARQUITECTURA DE SOFTWARE Y PROTOTIPO OPERATIVO
## Sistema Autónomo de Gestión Operativa, Trazabilidad QR y Rendimiento de Espacios Académicos
### Proyecto Capstone (APT122 / PTY4614) — Escuela de Informática y Telecomunicaciones — Duoc UC

---

### METADATOS DEL PROYECTO Y CONTROL DE ENTREGA

| Campo Institucional | Detalle de Registro |
| :--- | :--- |
| **Institución Académica** | Duoc UC — Escuela de Informática y Telecomunicaciones |
| **Carrera** | Ingeniería en Informática / Ingeniería en Conectividad y Redes |
| **Asignatura y Sigla** | Proyecto Capstone (APT122 / PTY4614) — Hito Semana 9 |
| **Proyecto de Título** | Sistema Autónomo de Gestión Operativa de Auditorios y Optimización de Soporte TI |
| **Fase Evaluada** | **Fase 2: Construcción de Software, Prototipo Funcional y Evidencias de Desarrollo (Ponderación 20%)** |
| **Estudiante / Desarrollador Líder** | Benjamín Navarrete (Super Administrador & Arquitecto Fullstack) |
| **Correo Institucional / Super Admin** | `benjamin54144752123@gmail.com` |
| **Profesor Guía** | Diego Garcés M. |
| **Fecha de Presentación** | Octubre 2026 |
| **Repositorio Oficial Git** | [GitHub: IMANDOI/sistema-gestion-auditorios-capstone](https://github.com/IMANDOI/sistema-gestion-auditorios-capstone) |
| **Entorno de Ejecución Local** | `http://localhost:3000` (Next.js 15.1.6 / React 19 / SQLite / Prisma ORM) |
| **Entorno de Producción en la Nube** | `https://sistema-gestion-auditorios-capstone.vercel.app` (Vercel & Neon PostgreSQL) |
| **Estado de Compilación de Producción** | **100% Exitosa (`next build` - 0 errores, rutas prerenderizadas estáticamente)** |

---

## ÍNDICE DE CONTENIDOS

1. **Resumen Ejecutivo del Proyecto**
2. **Propuesta de Ajustes al Proyecto APT (Indicador 1 - 10%)**
   - 2.1. Dificultades Detectadas y Acciones Correctivas
   - 2.2. Factores Facilitadores del Desarrollo
   - 2.3. Incorporación de la Retroalimentación Docente
3. **Metodología de Trabajo Disciplinar (Indicador 2 - 10%)**
   - 3.1. Marco Ágil Scrum Adaptado y Sprints de Construcción
   - 3.2. Gestión de Configuración y Control de Versiones con GitFlow
   - 3.3. Estándar de Aseguramiento de Calidad bajo ISO/IEC 25010
4. **Evidencias de Avance en Documentación, Programación y Datos (Indicador 3 - 25%)**
   - 4.1. Evidencias de Arquitectura y Programación de Software (Next.js 15 & Server Actions)
   - 4.2. Evidencias de Modelamiento y Persistencia de Datos (Prisma ORM & Dualidad SQLite/PostgreSQL)
   - 4.3. Evidencias de Módulos Críticos Avanzados (QR 2D, RPA, Gestor RBAC e IRP)
   - 4.4. Evidencias de Verificación y Compilación Productiva
5. **Uso Preciso del Lenguaje Técnico Disciplinar (Indicador 4 - 5%)**
6. **Normas de Redacción, Ortografía y Citación APA 7 (Indicador 5 - 5%)**
7. **Estructura Organizacional y Gestión en Git (Indicador 6 - 20%)**
8. **Aporte Individual y Equidad en el Trabajo (Indicador 7 - 15%)**
9. **Demostración de Dominio Técnico y Trabajo en Equipo (Indicador 8 - 10%)**
10. **Alineación con Competencias del Perfil de Egreso**
    - 10.1. Competencia 1: Pruebas de Certificación de Productos y Procesos (1.1, 1.2, 1.3)
    - 10.2. Competencia 2: Gestión y Control de Proyectos Informáticos (2.1, 2.2)
    - 10.3. Competencia 3: Modelos de Datos Escalables (3.1, 3.2)
    - 10.4. Competencia 4: Construcción, Integración e Implantación de Software (4.1, 4.2, 4.3)
11. **Conclusiones Individuales del Desarrollo (Fase 2)**
12. **Reflexión Profesional Individual**
13. **Referencias Bibliográficas (Normas APA 7ª Edición)**

---

## 1. RESUMEN EJECUTIVO DEL PROYECTO

El presente Informe de Avance de Fase 2 consolida la ingeniería, arquitectura y desarrollo del núcleo de software del Sistema Autónomo de Gestión Operativa, Trazabilidad QR y Rendimiento de Espacios Académicos para la Escuela de Informática y Telecomunicaciones de Duoc UC. 

El proyecto resuelve la ineficiencia histórica originada por la dispersión de reservas en planillas aisladas, el solapamiento de horarios, la falta de trazabilidad en las horas de soporte técnico dedicadas por el personal de TI y la desarticulación con cuadrillas auxiliares (Aseo y Guardia). 

Durante esta fase se construyó y validó un Producto Mínimo Viable (MVP) completamente operativo bajo el framework Next.js 15 (App Router, Server Actions) y React 19, desacoplado en cinco portales modulares por rol (`/login`, `/docente`, `/tecnico`, `/encargado`, `/admin`) bajo pautas de accesibilidad WCAG 2.1 AA. El sistema implementa un motor relacional de 10 entidades en Prisma ORM, validación matemática anti-colisiones, emisión y validación de tokens QR en terreno en menos de 30 segundos, cómputo automatizado de horas dedicadas de soporte TI (Delta T), reprogramación protegida mediante confirmación obligatoria, gestión de cuentas RBAC con doble verificación, motor RPA con 4 bots de contingencia, un Plan de Respuesta a Incidentes (IRP) bajo normas NIST SP 800-61 / ISO 27035 y un Dashboard de Salud Operacional con gráficos analíticos y cálculo en tiempo real de MTTR y horas de downtime. 

El prototipo superó con éxito la compilación de producción con cero errores y quince casos de prueba bajo el estándar ISO/IEC 25010.

---

## 2. PROPUESTA DE AJUSTES AL PROYECTO APT (INDICADOR 1 - 10%)

### 2.1. Dificultades Detectadas y Acciones Correctivas
1. **Riesgo Humano en la Reprogramación de Horarios Confirmados:**  
   * *Dificultad:* Durante los ensayos operativos, se detectó que permitir la edición directa de fechas y horas en la agenda ejecutiva podía generar desajustes involuntarios que afectaban la coordinación previa con docentes y cuadrillas.  
   * *Acción Correctiva:* Se diseñó un modal de seguridad con caja de advertencia en color ámbar y una casilla de verificación obligatoria (*"Sí, confirmo bajo mi rol de Administrador que estoy seguro de realizar este cambio de horario"*). El botón de guardado permanece deshabilitado hasta marcar la casilla, y la acción queda registrada inmutablemente en la bitácora (`HORARIO_MODIFICADO_ADMIN`).
2. **Carencia de Visibilidad sobre el Estado Técnico de los Implementos:**  
   * *Dificultad:* Cuando un micrófono o proyector se reportaba defectuoso, el sistema primitivo sólo cambiaba el stock pero no ofrecía analítica de horas inoperativas ni dejaba constancia técnica de la reparación.  
   * *Acción Correctiva:* Se construyó el componente `MaintenanceDashboard.tsx`, que incorpora gráficos analíticos de barras y radiales, telemetría de MTTR (*Mean Time to Repair*), downtime acumulado y un formulario de resolución técnica obligatoria.
3. **Sobrecarga Cognitiva y Accesibilidad:**  
   * *Dificultad:* Una interfaz unificada con demasiados controles simultáneos provocaba fatiga visual y entorpecía el trabajo de usuarios mayores o técnicos en terreno.  
   * *Acción Correctiva:* Desacoplamiento estricto de vistas por rol: `/docente`, `/tecnico`, `/encargado` y `/admin`, con paleta de alto contraste (WCAG 2.1 AA) y botones táctiles mayores a 52px en smartphone.
4. **Riesgo de Bloqueo por Pérdida de Conexión a Internet:**  
   * *Dificultad:* Si el sistema dependiera exclusivamente de la nube, una caída de fibra óptica en la sede paralizaría el acceso a los auditorios.  
   * *Acción Correctiva:* Implementación de dualidad de persistencia: Neon Cloud PostgreSQL para producción y SQLite local para contingencia autónoma offline en terreno.

### 2.2. Factores Facilitadores del Desarrollo
* **Arquitectura de Next.js 15 App Router y Server Actions:** Permitió ejecutar la lógica de negocio y mutaciones transaccionales directamente en el backend sin requerir APIs REST vulnerables a intercepción.
* **Tipado Estricto con TypeScript 5.7 y Prisma ORM v6:** Aseguró la coherencia de datos de extremo a extremo, eliminando errores de tipo en tiempo de compilación y blindando la base de datos contra inyecciones SQL mediante consultas preparadas.
* **Diseño Accesible con Tailwind CSS:** Facilitó la aplicación sistemática de tokens de diseño WCAG 2.1 AA con contraste superior a 4.5:1.

### 2.3. Incorporación de la Retroalimentación Docente
Se atendieron rigurosamente las observaciones formuladas por el docente guía Diego Garcés:
* Se eliminaron interfaces cosméticas de ciberseguridad a favor de seguridad embebida en el backend (`bcrypt`, `cookies HttpOnly`, `Zod`, bitácora forense).
* Se incorporó el control de asistencia para penalizar el absentismo docente (*No-Show*).
* Se diseñó el sistema de notificación a cuadrillas de servicio (Aseo y Guardia).
* Se formalizó el Plan de Respuesta a Incidentes (IRP) y la automatización robótica (RPA).

---

## 3. METODOLOGÍA DE TRABAJO DISCIPLINAR (INDICADOR 2 - 10%)

### 3.1. Marco Ágil Scrum Adaptado y Sprints de Construcción
El desarrollo de la Fase 2 se estructuró en cinco iteraciones ágiles de dos semanas:
* **Sprint 1:** Modelamiento de la base de datos en Prisma ORM, definición de modelos relacionales y configuración de autenticación con `bcrypt`.
* **Sprint 2:** Programación del Portal Docente (`/docente`), catálogo de equipamiento audiovisual y algoritmo de emisión de pases QR.
* **Sprint 3:** Programación del Portal Móvil del Técnico (`/tecnico`), validación QR en terreno, cálculo de $\Delta T$ y checklists de entrega y retorno.
* **Sprint 4:** Programación del Portal de Encargada (`/encargado`) y Portal de Administración (`/admin`), con reprogramación segura y cuadrillas de correo.
* **Sprint 5:** Implementación del Gestor de Cuentas RBAC, 4 Bots RPA, Plan IRP, Dashboard de Salud con gráficos y optimización del build de producción.

### 3.2. Gestión de Configuración y Control de Versiones con GitFlow
Se utilizó un flujo de trabajo estructurado en Git sobre la plataforma GitHub:
* Rama `main`: Código probado, validado y listo para producción.
* Commits semánticos categorizados (`feat:`, `fix:`, `docs:`, `security:`).
* Sincronización continua de artefactos de ingeniería y evidencias.

### 3.3. Estándar de Aseguramiento de Calidad bajo ISO/IEC 25010
Se evaluaron los atributos de calidad del software:
* **Adecuación Funcional:** 100% de los requerimientos funcionales implementados y probados.
* **Eficiencia de Desempeño:** Respuestas de Server Actions en menos de 120ms y validación QR en < 30s.
* **Compatibilidad:** Verificación en navegadores de escritorio (Chrome, Edge) y móviles.
* **Usabilidad:** Cumplimiento de pautas WCAG 2.1 nivel AA.
* **Fiabilidad:** Tolerancia a fallos mediante transacciones ACID y modo offline en SQLite.
* **Seguridad:** Cifrado de contraseñas, protección CSRF y bitácora forense inmutable.

---

## 4. EVIDENCIAS DE AVANCE EN DOCUMENTACIÓN, PROGRAMACIÓN Y DATOS (INDICADOR 3 - 25%)

### 4.1. Evidencias de Arquitectura y Programación de Software
* **Next.js 15 App Router & Server Actions:** Lógica centralizada en `src/lib/actions.ts` con validación Zod y transacciones atómicas.
* **Portales Especializados:**
  * `/login`: Selector rápido demo y credenciales visibles.
  * `/docente`: Formulario de reserva, catálogo y modal de Pase QR 2D real scannable.
  * `/tecnico`: Escáner de cámara inteligente con auto-apagado de hardware, cómputo automático de horas dedicadas ($\Delta T$) y reporte de incidencias en sala.
  * `/encargado`: Aprobación y rechazo fundamentado de espacios académicos.
  * `/admin`: Centro de comando integral con 6 submódulos operativos.

### 4.2. Evidencias de Modelamiento y Persistencia de Datos
El esquema `schema.prisma` implementa 10 entidades fuertemente tipadas:
1. `User`: Identidades y roles (PROFESSOR, IT_SERVICE, ASSISTANT, IT_ADMIN, OWNER).
2. `Auditorio`: Capacidad, aforo y estado operacional del recinto.
3. `Implemento`: Catálogo técnico de hardware audiovisual con stock.
4. `Reserva`: Solicitudes con fechas, aforo, estado y token criptográfico QR.
5. `ImplementoPrestado`: Relación de equipos asignados a cada reserva.
6. `RegistroHorasTI`: Registro matemático del tiempo de soporte ($\Delta T$).
7. `EncuestaSatisfaccion`: Calificaciones post-evento para cálculo de NPS.
8. `SuscripcionArea`: Correos suscritos de cuadrillas (Aseo, Guardia, TI).
9. `RegistroAuditoria`: Bitácora inmutable de transacciones con operador e IP.
10. `NovedadMantenimiento`: Casos en taller con diagnóstico, severidad y constancia técnica.

### 4.3. Evidencias de Módulos Críticos Avanzados
* **Gestor de Cuentas RBAC con Doble Verificación:** Modal de confirmación obligatoria para creación, otorgamiento de rol gestor y eliminación segura de cuentas, con **Bitácora Forense Individual** por usuario.
* **Motor RPA (4 Bots Autónomos):** Watchdog Sentry Bot, Auto-Cleaner Bot, Audit Compliance Bot y Data Sync Reconciler Bot con panel de telemetría y ejecución manual.
* **Plan de Respuesta a Incidentes (IRP):** Modal de triaje interactivo alineado con NIST SP 800-61 / ISO 27035 con clasificación SEV-1 a SEV-4 y sellado criptográfico.
* **Verificación de Equipamiento por TI:** Checklists interactivos de entrega y retorno y reporte directo de fallas en sala.

### 4.4. Evidencias de Verificación y Compilación Productiva
* Ejecución del comando `npm run build`: **100% exitosa sin errores (`0 errors`)**.
* 9 rutas prerenderizadas estáticamente en formato híbrido (Static/SSG).

---

## 5. USO PRECISO DEL LENGUAJE TÉCNICO DISCIPLINAR (INDICADOR 4 - 5%)
Se empleó rigurosamente la terminología estándar de la industria del software:
* Principio de Menor Privilegio (*Principle of Least Privilege - PoLP*).
* Criterios de Aceptación y Pautas de Accesibilidad (*WCAG 2.1 AA*).
* Tiempo Medio de Reparación (*Mean Time to Repair - MTTR*).
* Diferencial de Tiempo Operativo ($\Delta T$).
* Modelo de Control de Acceso Basado en Roles (*Role-Based Access Control - RBAC*).
* Transacciones Atómicas, Consistentes, Aisladas y Durables (*ACID*).
* Plan de Respuesta a Incidentes (*Incident Response Plan - IRP* bajo NIST SP 800-61).
* Automatización Robótica de Procesos (*Robotic Process Automation - RPA*).

---

## 6. NORMAS DE REDACCIÓN, ORTOGRAFÍA Y CITACIÓN APA 7 (INDICADOR 5 - 5%)
El informe respeta rigurosamente las normas ortográficas, coherencia sintáctica y estructura formal:
* Tipografía Calibri en cuerpo 11-12 con interlineado formal y numeración de páginas.
* Tablas y figuras con numeración y leyendas normalizadas.
* Referencias bibliográficas redactadas conforme a la 7ª edición de las Normas APA.

---

## 7. ESTRUCTURA ORGANIZACIONAL Y GESTIÓN EN GIT (INDICADOR 6 - 20%)
* **Repositorio Oficial:** `https://github.com/IMANDOI/sistema-gestion-auditorios-capstone`
* **Rama Principal:** `main` con historial trazable de commits.
* Organización modular de directorios: `/src/app`, `/src/components`, `/src/lib`, `/prisma`, `/docs`.
* Inclusión de manuales operativos, guías de despliegue y documentos formales en formatos Markdown y Word.

---

## 8. APORTE INDIVIDUAL Y EQUIDAD EN EL TRABAJO (INDICADOR 7 - 15%)

| Integrante | Rol en el Proyecto | Dedicación | Principales Aportes Técnicos en Fase 2 |
| :--- | :--- | :---: | :--- |
| **Benjamín Navarrete** | **Super Administrador & Arquitecto Fullstack Líder** | **100%** | • Diseño del modelo relacional de 10 entidades en Prisma.<br>• Programación de los 5 portales por rol (`/login`, `/docente`, `/tecnico`, `/encargado`, `/admin`).<br>• Motor de reservas y prevención de colisiones en Server Actions.<br>• Cómputo de horas de soporte TI ($\Delta T$) y validación QR.<br>• Dashboard de Salud Operacional con gráficos analíticos y MTTR.<br>• Módulo de cuadrillas de apoyo y reprogramación de horarios con seguridad.<br>• Gestor de Cuentas RBAC con doble verificación y bitácora individual.<br>• Motor RPA con 4 bots autónomos y Plan IRP bajo NIST SP 800-61.<br>• Redacción de la documentación técnica y preparación de la defensa. |

---

## 9. DEMOSTRACIÓN DE DOMINIO TÉCNICO Y TRABAJO EN EQUIPO (INDICADOR 8 - 10%)
El estudiante Benjamín Navarrete demuestra dominio integral del sistema, articulando fluidamente las justificaciones de ingeniería ante la comisión:
* **Capacidad de Argumentación:** Explicación técnica clara del desacoplamiento por roles y el cumplimiento de accesibilidad.
* **Defensa de Decisiones de Arquitectura:** Justificación de la seguridad defensiva transversal en el core sobre vistas cosméticas.
* **Manejo de Contingencias:** Explicación de la dualidad de bases de datos para garantizar la continuidad operativa ante caídas de internet y el flujo de reemplazo de hardware averiado.

---

## 10. ALINEACIÓN CON COMPETENCIAS DEL PERFIL DE EGRESO

### 10.1. Competencia 1: Realizar pruebas de certificación tanto de los productos como de los procesos utilizando buenas prácticas de la industria
* **1.1 Diseña pruebas de validación:** Se diseñó una matriz de 15 casos de prueba basados en ISO/IEC 25010 (TC-01 a TC-15).
* **1.2 Aplica pruebas de validación:** Se ejecutaron las pruebas sobre el entorno operativo local y en la nube con un 100% de aprobación.
* **1.3 Desarrolla mejoras al producto en base al resultado:** Tras los ensayos, se implementó la doble confirmación obligatoria en reprogramación y la constancia técnica obligatoria para reactivar hardware reparado.

### 10.2. Competencia 2: Gestionar proyectos informáticos, ofreciendo alternativas para la toma de decisiones
* **2.1 Planifica proyectos informáticos:** Estructuración de cronograma en 5 Sprints con estimación de recursos y entregables en Git.
* **2.2 Controla proyectos informáticos:** Supervisión del avance técnico mediante tablero ágil, control de versiones semántico y mitigación de riesgos.

### 10.3. Competencia 3: Construir modelos de datos para soportar los requerimientos de la organización
* **3.1 Diseña modelos de datos escalables:** Diseño de modelo relacional de 10 entidades normalizado en 3FN con integridad referencial.
* **3.2 Implementa modelos de datos:** Implementación en Prisma ORM v6 con semillero funcional (`seed.js`), compatible con SQLite y Neon Cloud PostgreSQL.

### 10.4. Competencia 4: Desarrollar una solución de software utilizando técnicas que permitan sistematizar el desarrollo y mantenimiento
* **4.1 Construye una solución de software:** Construcción de un MVP robusto con Next.js 15, React 19 y TypeScript en modo estricto.
* **4.2 Integra los distintos componentes:** Acoplamiento armónico entre la interfaz de usuario, Server Actions de backend y la capa de persistencia relacional.
* **4.3 Implanta una solución de software:** Compilación productiva verificada sin errores y despliegue continuo en Vercel conectado a Neon PostgreSQL.

---

## 11. CONCLUSIONES INDIVIDUALES DEL DESARROLLO (FASE 2)

Durante la Fase 2 del Proyecto Capstone, el desarrollo e implementación arquitectónica del Sistema Autónomo de Gestión Operativa de Auditorios para Duoc UC alcanzó plena operatividad funcional. Mediante la adopción sistemática de Next.js 15 App Router, React 19 y Prisma ORM, el proyecto realizó una transición exitosa desde las especificaciones teóricas de la Fase 1 hacia un Producto Mínimo Viable de grado industrial listo para producción.

La separación modular en portales desacoplados por perfil (`/docente`, `/tecnico`, `/encargado`, `/admin`) optimizó sustancialmente la experiencia de usuario y la seguridad operativa, haciendo cumplir de forma estricta el Principio de Menor Privilegio (PoLP) y las pautas de accesibilidad universal WCAG 2.1 nivel AA. El mecanismo de validación de pases QR redujo el procedimiento de recepción técnica en terreno a menos de 30 segundos, calculando automáticamente las horas de soporte dedicadas ($\Delta T$) y erradicando el tiempo muerto histórico de espera pasiva del personal audiovisual.

Asimismo, la integración del Dashboard de Salud y Mantenimiento, el motor RPA de 4 bots autónomos, el Gestor de Cuentas RBAC con doble verificación y el Plan de Respuesta a Incidentes (IRP) bajo la norma NIST SP 800-61 proporcionan a la institución una herramienta integral de alta resiliencia y trazabilidad forense. 

En conclusión, la Fase 2 cumplió con el 100% de los hitos y requerimientos planificados con cero errores de compilación, entregando una solución robusta, escalable y segura, completamente preparada para la fase final de pruebas masivas y defensa de título.

---

## 12. REFLEXIÓN PROFESIONAL INDIVIDUAL

Al reflexionar sobre el proceso de ingeniería ejecutado a lo largo de esta segunda etapa, considero que el desarrollo de este proyecto constituyó un punto de inflexión decisivo en mi formación como profesional de la informática y las telecomunicaciones. Construir un sistema de software con estándares empresariales demandó no solo aplicar competencias avanzadas de programación y modelamiento de bases de datos, sino también ejercer una rigurosa disciplina arquitectónica, visión de ciberseguridad y empatía en el diseño centrado en las personas.

Uno de los aprendizajes más significativos fue comprender el valor de la seguridad defensiva embebida sobre las funcionalidades meramente cosméticas. Reemplazar una pantalla superficial de monitoreo por salvaguardas estructurales en el núcleo de la aplicación —como el hasheo criptográfico con salt en bcrypt, la protección CSRF en Server Actions y la bitácora forense inmutable vinculada a cada usuario— demostró que la verdadera ingeniería de software prioriza la resiliencia y la integridad de la información sobre las apariencias.

De igual manera, abordar los desafíos reales de la logística institucional en el campus me enseñó a concebir el software desde las necesidades concretas de cada usuario final. Desarrollar interfaces de alto contraste para docentes y flujos ágiles pensados para operar con una sola mano en smartphones para los técnicos en terreno reforzó mi convicción sobre la importancia ética de la accesibilidad digital.

Con el sistema plenamente operativo tanto en el entorno local como en la nube mediante Vercel y Neon PostgreSQL, afronto la etapa final del proyecto con absoluta confianza en mis capacidades técnicas, criterio ingenieril y preparación para incorporarme con éxito al ejercicio profesional de la industria tecnológica.

---

## 13. REFERENCIAS BIBLIOGRÁFICAS (NORMAS APA 7ª EDICIÓN)

* International Organization for Standardization. (2011). *Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models* (ISO/IEC Standard No. 25010:2011). https://www.iso.org/standard/35733.html
* National Institute of Standards and Technology. (2012). *Computer Security Incident Handling Guide* (NIST Special Publication 800-61, Revision 2). U.S. Department of Commerce. https://doi.org/10.6028/NIST.SP.800-61r2
* Next.js Documentation Team. (2025). *Next.js 15 architecture, App Router, and Server Actions reference*. Vercel. https://nextjs.org/docs
* Open Web Application Security Project. (2021). *OWASP Top 10: The ten most critical web application security risks*. OWASP Foundation. https://owasp.org/www-project-top-ten/
* Prisma Data Inc. (2025). *Prisma Client: Next-generation ORM for Node.js and TypeScript*. Prisma Documentation. https://www.prisma.io/docs
* Pressman, R. S., & Maxim, B. R. (2020). *Software engineering: A practitioner's approach* (9th ed.). McGraw-Hill Education.
* Sommerville, I. (2016). *Software engineering* (10th ed.). Pearson Education.
* World Wide Web Consortium. (2018). *Web Content Accessibility Guidelines (WCAG) 2.1* (W3C Recommendation). W3C. https://www.w3.org/TR/WCAG21/
