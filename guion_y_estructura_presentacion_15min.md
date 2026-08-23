# GUÍA MAESTRA DE PRESENTACIÓN EJECUTIVA (15 MINUTOS)
## Fase 1: Definición del Proyecto APT - Asignatura Capstone (PTY4614)
### Proyecto: Sistema Autónomo de Gestión Operativa, Trazabilidad, Medición de Horas Utilizadas de TI y Centro de Operaciones (SOC)

---

**Parámetros de la Presentación:**
* **Tiempo Total Asignado:** 15 Minutos cronometrados.
* **Audiencia / Evaluador:** Docente Guía y Comisión Evaluadora de Título.
* **Enfoque:** Lenguaje técnico disciplinar, enfoque gerencial/ingenieril, fundamentación empírica y seguridad informática.
* **Fecha de Defensa:** 01 de Septiembre.
* **Repositorio Público Oficial:** `https://github.com/IMANDOI/sistema-gestion-auditorios-capstone`

---

## Estructura de Diapositivas y Guion Cronometrado (15 Minutos)

```mermaid
gantt
    title Distribución de Tiempo de Presentación (15 Minutos)
    dateFormat  m
    axisFormat %M min
    
    Slide 1 Portada y Equipo (1 min)       :active, s1, 0, 1
    Slide 2 Caso y Problematica (2.5 min)  :        s2, 1, 3.5
    Slide 3 Objetivos del MVP (1.5 min)    :        s3, 3.5, 5
    Slide 4 Metodología y Equipo (1.5 min) :        s4, 5, 6.5
    Slide 5 Plan de Trabajo y Gantt (2 min):        s5, 6.5, 8.5
    Slide 6 Stack Tecnológico (1.5 min)    :        s6, 8.5, 10
    Slide 7 Arquitectura y Seguridad (2 min):       s7, 10, 12
    Slide 8 Modelo Relacional (1.5 min)    :        s8, 12, 13.5
    Slide 9 Mockups y SOC (1 min)          :        s9, 13.5, 14.5
    Slide 10 Conclusiones (0.5 min)        :        s10, 14.5, 15
```

---

### Diapositiva 1: Portada y Presentación del Postulante (Minuto 0:00 - 1:00)
* **Contenido Visual:**
  * Título del Proyecto: *Sistema Autónomo de Gestión Operativa, Trazabilidad, Medición de Horas Utilizadas de TI y Centro de Operaciones (SOC) para Auditorios y Espacios Multiuso*.
  * Postulante: Benjamín Mandujano.
  * Carrera: Ingeniería en Informática / Análisis Programador - Sede La Florida.
  * Naturaleza: Producto Mínimo Viable (MVP) de Arquitectura *White-Label*.
* **Guion del Estudiante:**
  > *"Estimada comisión evaluadora, muy buenos días/tardes. Mi nombre es Benjamín Mandujano y hoy presento la definición de mi proyecto de título Capstone: una plataforma web integral, autónoma y desacoplada para la gobernanza operativa, trazabilidad en terreno mediante códigos QR, control de horas hombre utilizadas de TI y un Centro de Operaciones de Ciberseguridad (SOC). El proyecto está concebido como un Producto Mínimo Viable de alta fidelidad, de marca blanca, adaptable a cualquier recinto universitario o corporativo."*

---

### Diapositiva 2: Presentación del Caso y Problemática Raíz (Minuto 1:00 - 3:30)
* **Contenido Visual:**
  * Diagrama comparativo: *Proceso Manual Tradicional vs Solución MVP*.
  * Los 4 dolores operacionales reales:
    1. **Inmovilización del Técnico de TI:** Esperas de hasta 1 hora en sitio para entregar equipos.
    2. **Descontrol de Horas Utilizadas de TI:** Sin métricas para dimensionar la carga técnica.
    3. **Desinformación en Cuadrillas:** Aseo y seguridad sin calendarios oportunos.
    4. **Cancelaciones Tardías y No-Shows:** Bloqueo de espacios sin uso real.
    5. **Ceguera de Ciberseguridad:** Sin registros de accesos no deseados o intentos de fraude.
* **Guion del Estudiante:**
  > *"Este proyecto nace de una problemática operacional vivida en primera persona. En la gestión tradicional con planillas y correos, un técnico de soporte TI podía perder hasta una hora completa en sitio esperando a un expositor retrasado, inmovilizando un recurso humano crítico y paralizando el soporte en el resto del campus, sin registro de cuántas horas de TI se utilizaron realmente. A esto se sumaba la desinformación en aseo y guardias, cancelaciones de último minuto y la total ausencia de métricas cuantitativas y de seguridad. Nuestra propuesta erradica estos cuellos de botella con validación QR presencial en menos de 30 segundos, despacho automático por áreas, confirmaciones por token y un centro de telemetría SOC."*

---

### Diapositiva 3: Objetivos del Proyecto (General y Específicos) (Minuto 3:30 - 5:00)
* **Contenido Visual:**
  * **Objetivo General:** Diseñar, desarrollar e implementar un MVP web seguro, integral, autónomo y escalable para la gestión de reservas, control de inventario, validación QR presencial, balance de horas TI y centro SOC.
  * **6 Objetivos Específicos:** Requerimientos y Seguridad, Modelo Relacional Prisma/Neon, Backend RBAC con NextAuth, Frontend Mobile-First, Integraciones QR/Mailing, y Pruebas QA ISO 25010 con despliegue Cloud.
* **Guion del Estudiante:**
  > *"El objetivo general se enfoca en entregar un MVP operativo y seguro que automatice el ciclo de vida de los eventos y entregue métricas duras a la administración. Los objetivos específicos guían metódicamente cada capa: desde el análisis formal de requerimientos y el modelado en PostgreSQL, hasta la seguridad RBAC de 6 roles, la interfaz mobile para escaneo en terreno y las pruebas de aseguramiento de calidad bajo la norma ISO 25010."*

---

### Diapositiva 4: Metodología de Desarrollo y Equipo Simulado (Minuto 5:00 - 6:30)
* **Contenido Visual:**
  * Marco Ágil: **Scrum** adaptado.
  * Célula de Ingeniería de **8 Roles Simulados:**
    * Product Owner & Scrum Master.
    * Software Architect & Lead Fullstack Developer.
    * Frontend UI/UX & Backend/DB Engineer.
    * QA & Test Automation Engineer & DevOps/Cloud Security Engineer.
  * Matriz de responsabilidades RACI.
* **Guion del Estudiante:**
  > *"Para garantizar un estándar de ingeniería equivalente a la industria tecnológica, apliqué el marco Scrum simulando las responsabilidades de una célula multidisciplinaria de 8 roles. Esto asegura que la toma de decisiones arquitectónicas, la optimización de base de datos, el aseguramiento de calidad (QA) y la ciberseguridad sean abordados con estricta rigurosidad en cada Sprint."*

---

### Diapositiva 5: Plan de Trabajo y Cronograma Gantt (18 Semanas) (Minuto 6:30 - 8:30)
* **Contenido Visual:**
  * Carta Gantt estructurada en las 3 Fases Académicas:
    * **Fase 1 (Semanas 1-4):** Definición, SRS IEEE 830, Arquitectura y Ciberseguridad. [Completada]
    * **Fase 2 (Semanas 5-12):** Desarrollo Core: Auth RBAC, Reservas, QR Check-in/out, Mailing.
    * **Fase 3 (Semanas 13-18):** Centro SOC, Pruebas QA ISO 25010, Deploy en Producción y Defensa.
  * Hitos evaluativos y mitigación de factores obstaculizadores.
* **Guion del Estudiante:**
  > *"El plan de trabajo abarca las 18 semanas del ciclo académico. La Fase 1 que hoy defendemos concluye con la especificación de requerimientos y la arquitectura validada. La Fase 2 abordará la construcción modular de la lógica transaccional y el lector QR, mientras que la Fase 3 culminará con las pruebas de certificación, el centro SOC y el despliegue serverless continuo."*

---

### Diapositiva 6: Stack Tecnológico de Grado Industrial (Minuto 8:30 - 10:00)
* **Contenido Visual:**
  * **Frontend:** Next.js 15 (App Router, React 19 Server Components), Tailwind CSS, Lucide Icons.
  * **Backend & Lógica:** Next.js Server Actions, NextAuth.js v5 (JWT cifrado JWE, RBAC 6 niveles).
  * **Base de Datos & ORM:** PostgreSQL 18 en Neon Cloud Serverless + Prisma ORM.
  * **Validación & Criptografía:** Zod, bcryptjs, Web Crypto API (UUID v4), HTML5 QR Scanner.
  * **Infraestructura:** Vercel Edge Serverless, GitHub Actions CI/CD. Costo: **$0 USD**.
* **Guion del Estudiante:**
  > *"El stack seleccionado es moderno, modular y serverless. Utilizamos Next.js 15 con Server Components para garantizar tiempos de carga inferiores a un segundo; Prisma ORM con PostgreSQL en Neon Cloud para transacciones ACID seguras; y NextAuth con tokens cifrados. Esta arquitectura nos permite operar con costo cero de infraestructura inicial y escalabilidad elástica inmediata."*

---

### Diapositiva 7: Arquitectura de Software y Ciberseguridad (Minuto 10:00 - 12:00)
* **Contenido Visual:**
  * Diagrama C4 de Contenedores.
  * Medidas OWASP Top 10 e ISO 27001:
    * Hashing bcrypt (cost factor >= 10).
    * Cookies seguras `HttpOnly`, `Secure`, `SameSite=Lax`.
    * Consultas 100% parametrizadas (anti SQLi).
    * Esquemas Zod en servidor y cabeceras HSTS / CSP / X-Frame-Options.
* **Guion del Estudiante:**
  > *"La seguridad es un pilar fundamental. Siguiendo las directrices de OWASP Top 10 e ISO 27001, implementamos hashing robusto con bcrypt, cookies HttpOnly que previenen ataques XSS, validación Zod en servidor contra inyecciones y consultas parametrizadas con Prisma. Esto garantiza que la información sensible de usuarios y horarios esté completamente blindada."*

---

### Diapositiva 8: Modelo Entidad-Relación y Restricciones (Minuto 12:00 - 13:30)
* **Contenido Visual:**
  * Diagrama Entidad-Relación (MER): `User`, `Reservation`, `Equipment`, `ReservationEquipment`, `SecurityAuditLog`, `EmailSubscription`, `Notification`.
  * Índices B-Tree en `startTime`, `endTime`, `status`.
  * Algoritmo atómico anti-colisiones: $\max(T_1, T_2) < \min(T'_1, T'_2)$.
* **Guion del Estudiante:**
  > *"El modelo de datos relacional está normalizado en tercera forma normal. Diseñamos índices B-Tree en campos de alta concurrencia temporal y restricciones atómicas que impiden matemáticamente solapamientos de reservas. Además, integramos la tabla SecurityAuditLog para registrar cada intento de acceso, garantizando trazabilidad y no-repudiación."*

---

### Diapositiva 9: Mockups, Centro de Control SOC y Horas de TI (Minuto 13:30 - 14:30)
* **Contenido Visual:**
  * Pantallas propuestas:
    1. **Formulario de Solicitud Modular:** Selección visual de audio, video y mobiliario.
    2. **Validador QR de Terreno:** Escaneo instantáneo desde smartphone (< 30 seg).
    3. **Centro de Control SOC:** Contador de ataques mitigados, accesos 403, semáforo de amenazas y **balance de horas hombre de TI utilizadas**.
* **Guion del Estudiante:**
  > *"En la interfaz visual destacamos el formulario en etapas para solicitantes, el escáner QR optimizado para celulares de los técnicos en terreno y nuestro Centro de Control SOC. En este panel, los administradores visualizan no solo la ocupación y el NPS, sino también las horas reales de TI utilizadas por evento y las amenazas bloqueadas en tiempo real."*

---

### Diapositiva 10: Próximos Pasos y Conclusiones (Minuto 14:30 - 15:00)
* **Contenido Visual:**
  * Hito cumplido: Fase 1 aprobada y respaldada en GitHub con tag `v0.1.0-fase1-mvp`.
  * Próximos pasos: Desarrollo del Módulo de Autenticación, Roles y Reservas (Fase 2).
  * Síntesis: MVP de alto impacto operacional, seguro, escalable y transferible.
* **Guion del Estudiante:**
  > *"En conclusión, la Fase 1 sienta las bases conceptuales, de ciberseguridad y de arquitectura para un producto de software real y de alto impacto operacional. Con el repositorio respaldado y la especificación cerrada, estamos listos para iniciar la Fase 2 de desarrollo. Muchas gracias y quedo atento a sus preguntas."*

---

## Consejos Clave para la Defensa Oral ante la Comisión

1. **Seguridad y Confianza:** Habla pausado, mirando a la comisión. Tienes el dominio total del caso porque responde a una problemática real vivida en el campo laboral.
2. **Defiende el Concepto de MVP:** Si preguntan por qué no incluye funciones como torniquetes automáticos o apps nativas en esta entrega, explica con solvencia: *"Este es un MVP de alta fidelidad enfocado en validar el núcleo operacional; las integraciones con hardware IoT forman parte de nuestro Roadmap Post-MVP detallado en el informe"*.
3. **Destaca la Métrica de Horas TI:** Resalta que el sistema no hace estimaciones vagas, sino que mide matemáticamente las horas hombre reales consumidas de soporte técnico entre Check-in y Check-out.
4. **Menciona el Repositorio Público y Respaldo:** Indica que todo el historial de desarrollo, el release `v0.1.0-fase1-mvp` y el pipeline de CI están abiertos y verificables en GitHub.
