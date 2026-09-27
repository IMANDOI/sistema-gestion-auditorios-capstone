# GUÍA MAESTRA DE PRESENTACIÓN EJECUTIVA (15 MINUTOS)
## Fase 1: Definición del Proyecto Capstone - Asignatura Capstone (APT122 / PTY4614)
### Proyecto: Sistema Autónomo de Gestión Operativa, Trazabilidad, Medición de Horas de TI y Analítica para Auditorios

---

**Parámetros de la Presentación:**
* **Tiempo Total Asignado:** 15 Minutos cronometrados.
* **Audiencia / Evaluador:** Docente Guía y Comisión Evaluadora de Proyectos Capstone.
* **Enfoque:** Lenguaje técnico disciplinar, sobrio, formal, sustentado en la problemática operacional real y en estándares de ciberseguridad.
* **Fecha de Presentación:** Fase 1 (Semana 4).
* **Repositorio Público Oficial:** `https://github.com/IMANDOI/sistema-gestion-auditorios-capstone`

---

## Estructura Visual de Diapositivas y Guion Oral (15 Minutos)

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
    Slide 9 Mockups y Dashboard (1 min)    :        s9, 13.5, 14.5
    Slide 10 Conclusiones (0.5 min)        :        s10, 14.5, 15
```

---

### Diapositiva 1: Portada y Presentación del Postulante (Minuto 0:00 - 1:00)
* **Diseño Visual en Diapositiva:**
  * Logo / Isotipo tecnológico sobrio de auditorio y código QR.
  * Título: *Sistema Autónomo de Gestión Operativa, Trazabilidad, Medición de Horas de TI y Analítica para Auditorios*.
  * Subtítulo: *Definición de Proyecto Capstone (APT122 / PTY4614) - Producto Mínimo Viable (MVP)*.
  * Datos: Benjamín Abraham Navarrete Hernández | Carrera: Ingeniería en Informática / Análisis Programador | Sede La Florida.
  * Repositorio: `github.com/IMANDOI/sistema-gestion-auditorios-capstone`.
* **Lo que debes decir (Guion Oral):**
  > *"Estimada comisión evaluadora, muy buenos días. Mi nombre es Benjamín Navarrete Hernández y a continuación presento la definición de mi Proyecto Capstone: una plataforma web autónoma y modular para la gestión operativa, validación presencial mediante códigos QR dinámicos, cómputo exacto de horas de soporte técnico y analítica para auditorios y espacios de alta demanda. La propuesta se concibe formalmente como un Producto Mínimo Viable de arquitectura desacoplada, aplicable a cualquier institución."*

---

### Diapositiva 2: Presentación del Caso y Problemática Raíz (Minuto 1:00 - 3:30)
* **Diseño Visual en Diapositiva:**
  * Esquema comparativo visual en 2 columnas:
    * **Columna 1: Modelo Convencional (Ineficiencias):**
      - ⏱️ *Espera Pasiva TI:* Técnicos inmovilizados hasta 1 hora en sitio esperando expositores.
      - ❓ *Cero Registro de Horas:* Falta de medición sobre las horas reales utilizadas de soporte.
      - ✉️ *Descoordinación:* Cuadrillas de aseo y guardia sin información oportuna.
      - 🚫 *No-Shows:* Reservas tomadas sin uso real y cancelaciones a último minuto.
    * **Columna 2: Solución Propuesta (MVP Automatizado):**
      - 📱 *QR Check-in < 30s:* Validación inmediata y entrega expedita de equipos.
      - 📊 *Trazabilidad de Horas TI:* Cómputo matemático exacto ($\Delta T = checkout - checkin$).
      - 📬 *Difusión Automática:* Despacho de cronogramas a Aseo, Guardia y TI.
      - 🛡️ *PriorityScore:* Confirmación por token y penalización (-20 pts) por inasistencias.
* **Lo que debes decir (Guion Oral):**
  > *"Este proyecto surge a partir de una problemática operacional empírica. En el modelo manual tradicional, los técnicos de TI acuden a abrir la sala y deben esperar pasivamente hasta una hora a que llegue el expositor para entregar micrófonos y proyector. Esto inmoviliza a un recurso humano técnico crítico, retrasa la atención de requerimientos en el campus y no deja ningún registro de cuántas horas de TI se utilizaron realmente. A esto se suma que aseo y guardias no reciben los calendarios a tiempo y ocurren constantes cancelaciones imprevistas. Nuestra solución aborda estos cuatro dolores mediante validación QR móvil en menos de 30 segundos, registro automatizado de horas de soporte, listas de difusión por áreas y penalización de inasistencias."*

---

### Diapositiva 3: Objetivos del Proyecto Capstone (Minuto 3:30 - 5:00)
* **Diseño Visual en Diapositiva:**
  * Tarjeta Central: **Objetivo General:** *Diseñar, desarrollar e implementar un MVP web seguro, integral, autónomo y escalable para la gestión operativa, validación QR presencial, cómputo de horas de TI y analítica de auditorios.*
  * 4 Tarjetas Bento (Objetivos Específicos):
    * 📐 *OE1 Requerimientos:* Formalizar especificación SRS bajo IEEE 830 y marco de seguridad OWASP.
    * 🗄️ *OE2 Modelado Relacional:* Diseñar esquema 3FN en PostgreSQL con Prisma ORM.
    * ⚙️ *OE3 Lógica & RBAC:* Desarrollar Server Actions en Next.js 15 con control de 6 roles.
    * 🧪 *OE4 QA & Despliegue:* Ejecutar pruebas ISO 25010 y despliegue cloud serverless.
* **Lo que debes decir (Guion Oral):**
  > *"El objetivo general se enfoca en entregar un MVP funcional y seguro que automatice el ciclo de vida del auditorio y entregue métricas operacionales cuantitativas. Los objetivos específicos estructuran el desarrollo de manera metódica: formalizar requerimientos bajo el estándar IEEE 830, implementar una base de datos relacional normalizada, construir la lógica transaccional con control de acceso basado en roles y validar la calidad del producto bajo la norma ISO 25010."*

---

### Diapositiva 4: Metodología de Trabajo y Roles de Ingeniería (Minuto 5:00 - 6:30)
* **Diseño Visual en Diapositiva:**
  * Diagrama de ciclo ágil **Scrum** (Sprints de 2 semanas, Backlog, Incrementos).
  * Matriz visual de **Roles Simulados de Ingeniería de Software:**
    * Product Owner | Scrum Master | Software Architect | Lead Fullstack Dev
    * Frontend UI/UX | Backend & DB Dev | QA Test Engineer | DevOps Cloud Engineer
* **Lo que debes decir (Guion Oral):**
  > *"Para asegurar la rigurosidad técnica y calidad industrial del software, aplico el marco de trabajo ágil Scrum, simulando las responsabilidades de una célula de ingeniería multidisciplinaria. Esto permite abordar con orden la arquitectura de software, la optimización de consultas, las pruebas de certificación y la ciberseguridad en cada iteración del desarrollo."*

---

### Diapositiva 5: Plan de Trabajo y Cronograma Gantt (18 Semanas) (Minuto 6:30 - 8:30)
* **Diseño Visual en Diapositiva:**
  * Diagrama Gantt sintetizado en 3 Fases Académicas:
    * 🟩 **Fase 1: Definición y Arquitectura (Semanas 1-4) [HITO ACTUAL]:** SRS IEEE 830, modelos de datos, arquitectura cloud y repositorio de respaldo.
    * 🟦 **Fase 2: Desarrollo Core e Integración (Semanas 5-12):** Autenticación RBAC, motor anti-colisiones, subsistema QR móvil y mailing automático.
    * 🟪 **Fase 3: QA, Certificación y Cierre (Semanas 13-18):** Dashboard analítico, pruebas unitarias/E2E ISO 25010, despliegue productivo y defensa final.
  * Indicadores: 18 Semanas | 12 Horas/Semana | 3 Entregas Sumativas.
* **Lo que debes decir (Guion Oral):**
  > *"El plan de trabajo abarca las 18 semanas del ciclo académico. La Fase 1 que hoy defendemos concluye con el levantamiento formal de requerimientos y la arquitectura validada. La Fase 2 contempla la construcción de la lógica de reservas y el módulo de validación QR móvil. La Fase 3 culminará con las pruebas de certificación de calidad y el despliegue productivo continuo."*

---

### Diapositiva 6: Stack Tecnológico de Grado Industrial (Minuto 8:30 - 10:00)
* **Diseño Visual en Diapositiva:**
  * 4 Bloques con Logotipos / Iconos Limpios:
    * ⚡ **Frontend:** Next.js 15 (App Router, React 19 Server Components), Tailwind CSS.
    * 🔒 **Backend:** Next.js Server Actions, NextAuth.js v5 (Tokens JWT, RBAC 6 Roles), Zod.
    * 🐘 **Persistencia:** PostgreSQL en Neon Cloud Serverless, Prisma ORM (Tipado TypeScript).
    * ☁️ **Infraestructura:** Vercel Edge Serverless, GitHub Actions CI/CD. **Inversión Inicial: $0 USD**.
* **Lo que debes decir (Guion Oral):**
  > *"El stack seleccionado responde a criterios de rendimiento, mantenibilidad y costo. Utilizamos Next.js 15 con Server Components para garantizar tiempos de respuesta inferiores a un segundo, Prisma ORM con PostgreSQL en Neon Cloud para transacciones ACID íntegras, y NextAuth para autenticación robusta. Esta arquitectura serverless permite operar con escalabilidad elástica y costo inicial de infraestructura de cero dólares."*

---

### Diapositiva 7: Arquitectura de Software y Ciberseguridad Defensiva (Minuto 10:00 - 12:00)
* **Diseño Visual en Diapositiva:**
  * Diagrama de Capas de Seguridad Defensiva (OWASP Top 10 / ISO 27001):
    1. 🛡️ *Cifrado de Credenciales:* Hashing `bcrypt` (factor de costo $\ge 10$).
    2. 🍪 *Sesiones Seguras:* Cookies `HttpOnly`, `Secure` y `SameSite=Lax` (anti XSS/CSRF).
    3. 💉 *Anti SQL Injection:* 100% de consultas parametrizadas mediante Prisma ORM.
    4. 🧹 *Sanitización:* Validación estricta con esquemas Zod en el servidor.
    5. 🔏 *Entropía en QR:* Tokens de acceso generados con UUID v4 (CSPRNG).
    6. 🌐 *Cabeceras Defensivas:* HSTS forzado, CSP, X-Frame-Options: DENY.
* **Lo que debes decir (Guion Oral):**
  > *"En ciberseguridad aplicamos un enfoque defensivo basado en OWASP Top 10 e ISO 27001. Las contraseñas se almacenan procesadas con bcrypt y factor de costo 10 con sal; las sesiones se gestionan mediante cookies HttpOnly que previenen el robo de credenciales mediante scripts maliciosos; y el cien por ciento de las consultas a la base de datos se ejecutan de forma parametrizada a través de Prisma ORM, eliminando el riesgo de inyección SQL."*

---

### Diapositiva 8: Modelo Entidad-Relación y Restricciones (Minuto 12:00 - 13:30)
* **Diseño Visual en Diapositiva:**
  * Diagrama Entidad-Relación (MER): `User`, `Reservation`, `Equipment`, `ReservationEquipment`, `EmailSubscription`, `Notification`.
  * Regla Matemática Anti-Colisión destacada en tarjeta: $\max(T_1, T_2) < \min(T'_1, T'_2)$.
  * Registro de Trazabilidad: Campos `checkInTime`, `checkedInBy`, `checkoutTime`, `checkedOutBy`.
* **Lo que debes decir (Guion Oral):**
  > *"El modelo de datos relacional está diseñado en tercera forma normal. Incorpora restricciones transaccionales a nivel de base de datos que impiden matemáticamente el solapamiento de horarios entre reservas aprobadas. Asimismo, la entidad de reservas registra marcas de tiempo inmutables y el identificador del técnico validador, permitiendo auditar la entrega de equipamiento y calcular con precisión el tiempo real de soporte utilizado."*

---

### Diapositiva 9: Mockups y Dashboard de Analítica Operativa (Minuto 13:30 - 14:30)
* **Diseño Visual en Diapositiva:**
  * 3 Pantallas / Mockups de la Interfaz:
    1. 📝 *Formulario Modular:* Solicitud en etapas con requerimientos técnicos (microfonía, streaming, mobiliario).
    2. 📱 *Validador QR Móvil:* Escaneo en tiempo real desde la cámara del celular (< 30s).
    3. 📊 *Dashboard de Analítica:* Gráficos de horas hombre de TI utilizadas, ocupación semanal y satisfacción NPS (1-5 estrellas).
* **Lo que debes decir (Guion Oral):**
  > *"En el diseño de la interfaz destacan tres vistas clave: el formulario guiado para solicitantes, el escáner QR optimizado para el uso ágil en smartphones por parte del personal de TI en terreno, y el panel de analítica para la administración, donde se visualiza el balance de horas de soporte consumidas por carrera, las tasas de ocupación y los resultados de satisfacción de los usuarios."*

---

### Diapositiva 10: Delimitación del MVP, Roadmap y Conclusiones (Minuto 14:30 - 15:00)
* **Diseño Visual en Diapositiva:**
  * Tabla Síntesis:
    * **MVP Actual (Fase Capstone):** QR Web Móvil < 30s | Mailing por Áreas | Cómputo de Horas TI | Dashboard NPS.
    * **Roadmap Futuro (Post-MVP):** Torniquetes NFC/RFID | Sincronización Google/Outlook | Domótica IoT de Proyectores.
  * Conclusiones Clave en Bullet Points mínimos.
* **Lo que debes decir (Guion Oral):**
  > *"En conclusión, la Fase 1 establece los cimientos formales, arquitectónicos y de ciberseguridad para un software que resuelve ineficiencias logísticas reales y proporciona métricas operacionales concretas. Con la especificación de requerimientos cerrada y el repositorio respaldado, el proyecto se encuentra en condiciones óptimas para iniciar la Fase 2 de desarrollo. Muchas gracias y quedo a disposición de sus preguntas."*

---

## Recomendaciones para la Presentación Oral
1. **Postura y Tono:** Mantén un lenguaje técnico, formal y pausado.
2. **Defensa del Alcance MVP:** Si te consultan por integraciones físicas como torniquetes electrónicos o apps móviles nativas, responde que forman parte del **Roadmap Post-MVP** documentado en el informe para priorizar la validación del flujo operacional central dentro del semestre.
3. **Métrica de Horas TI:** Enfatiza que el sistema calcula el tiempo real de soporte dedicado ($\Delta T = checkout - checkin$), entregando datos objetivos a las jefaturas.
