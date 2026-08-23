# GUÍA DE ESTUDIO Y GLOSARIO TÉCNICO PARA LA DEFENSA DE TÍTULO
## Preparación Integral de Conceptos, Estándares y Respuestas para la Comisión
### Proyecto: Sistema Autónomo de Gestión Operativa, Horas de TI, Ciberseguridad y Centro de Operaciones (SOC)

Esta guía explica en lenguaje claro, con ejemplos y analogías prácticas, **todos los tecnicismos, normas y conceptos** de tu informe y presentación para que los domines al 100% y respondas con total seguridad a cualquier pregunta de la comisión evaluadora.

---

## ÍNDICE RÁPIDO DE CONSULTA

1. [Estándares y Normas Internacionales (IEEE, ISO, OWASP)](#1-estándares-y-normas-internacionales)
2. [Ciberseguridad y Protección de Datos Sensibles](#2-ciberseguridad-y-protección-de-datos-sensibles)
3. [Arquitectura de Software y Tecnologías del Stack](#3-arquitectura-de-software-y-tecnologías-del-stack)
4. [Bases de Datos, Modelado Relacional y Anti-Colisiones](#4-bases-de-datos-modelado-relacional-y-anti-colisiones)
5. [Gestión, Metodología Scrum y Conceptos Operacionales](#5-gestión-metodología-scrum-y-conceptos-operacionales)
6. [Preguntas Frecuentes de la Comisión Evaluadora y Cómo Responderlas](#6-preguntas-frecuentes-de-la-comisión-y-cómo-responderlas)

---

# 1. Estándares y Normas Internacionales

### ¿Qué es IEEE 830 / ISO/IEC/IEEE 29148? (Especificación de Requerimientos)
* **¿Qué significa?** Es el estándar internacional creado por el *Institute of Electrical and Electronics Engineers* (IEEE) que define cómo se debe escribir un documento de **Especificación de Requerimientos de Software (SRS)**.
* **¿Para qué sirve?** Sirve para que los requerimientos no sean ambiguos ni se presten a malas interpretaciones. Clasifica todo en **Requerimientos Funcionales (RF)** (lo que el sistema debe hacer, ej. *validar el QR en menos de 30 segundos*) y **Requerimientos No Funcionales (RNF)** (cómo debe comportarse, ej. *tiempo de respuesta < 800ms*).
* **Cómo explicarlo en la defensa:** *"Utilizamos el estándar IEEE 830 para formalizar 16 requerimientos funcionales y 10 no funcionales, garantizando que el alcance técnico del MVP esté completamente delimitado sin ambigüedades."*

---

### ¿Qué es ISO/IEC 27001? (Seguridad de la Información)
* **¿Qué significa?** Es la norma internacional por excelencia para la **Gestión de Seguridad de la Información (SGSI)**.
* **¿Para qué sirve?** Establece el principio fundamental de la seguridad conocido como la **Tríada CID**:
  1. **Confidencialidad:** Solo las personas autorizadas pueden ver los datos (docentes ven sus reservas; administradores ven auditorías).
  2. **Integridad:** La información no puede ser alterada por terceros (los registros de horas y estados de reservas son inmutables).
  3. **Disponibilidad:** El sistema debe estar accesible cuando se necesite (99.9% de uptime gracias a servidores serverless).
* **Cómo explicarlo:** *"Nos basamos en ISO 27001 para resguardar la información sensible de usuarios y horarios, asegurando confidencialidad con RBAC, integridad con hashes y disponibilidad mediante nube serverless."*

---

### ¿Qué es ISO/IEC 25010? (Calidad de Software)
* **¿Qué significa?** Es el estándar internacional que mide la **Calidad del Producto de Software** (*SQuaRE*).
* **¿Qué evalúa?** Define 8 características esenciales: **Eficiencia de Rendimiento** (velocidad), **Compatibilidad**, **Usabilidad** (fácil de usar en celulares), **Fiabilidad** (no se cae), **Seguridad**, **Mantenibilidad** (código limpio y tipado en TypeScript) y **Portabilidad**.
* **Cómo explicarlo:** *"La calidad del sistema no es una opinión; se mide bajo ISO 25010 mediante métricas concretas como tiempos de carga Core Web Vitals inferiores a 1.2 segundos y tipado estricto."*

---

### ¿Qué es OWASP Top 10? (Seguridad Web)
* **¿Qué significa?** *Open Web Application Security Project*. Es la lista de las **10 vulnerabilidades y ataques más peligrosos y comunes en aplicaciones web del mundo**.
* **¿Cuáles abordamos en nuestro sistema?**
  * **A01: Broken Access Control (Falla en Control de Acceso):** Lo evitamos con nuestro sistema **RBAC de 6 roles** que valida en el servidor que un profesor no pueda entrar a funciones de superadmin.
  * **A03: Injection (Inyecciones SQL / XSS):** Lo evitamos usando **Prisma ORM** (que parametriza todas las consultas a la base de datos) y **Zod** para validar datos.
  * **A07: Identification and Authentication Failures:** Lo evitamos con **bcrypt** para no guardar claves en texto plano y **cookies HttpOnly** para proteger las sesiones.

---

# 2. Ciberseguridad y Protección de Datos Sensibles

### ¿Qué es bcrypt y el Cost Factor (Factor de Costo >= 10)?
* **Concepto:** Las contraseñas **NUNCA** se guardan en texto plano en la base de datos (si un hacker roba la base de datos, vería solo cadenas ininteligibles). `bcrypt` es un algoritmo de hashing criptográfico unidireccional con "sal" (*salt*).
* **¿Qué es la sal (Salt)?** Es una cadena aleatoria que se le añade a cada contraseña antes de hashearla para que, si dos usuarios tienen la misma clave, sus hashes sean totalmente diferentes. Previene ataques con *Rainbow Tables*.
* **¿Qué es el Cost Factor 10?** Significa que el algoritmo aplica $2^{10} = 1.024$ rondas de hashing. Esto hace que comprobar millones de contraseñas por fuerza bruta sea computacionalmente inviable para un atacante.

---

### ¿Qué son JWT (JSON Web Tokens) y JWE (Cifrado)?
* **Concepto:** Cuando un usuario inicia sesión, el servidor no guarda la sesión en memoria; le entrega al navegador un "pase digital firmado" (JWT) que contiene su ID, rol y vencimiento.
* **¿Qué es JWE (JSON Web Encryption)?** En lugar de un JWT en texto plano que cualquiera pueda leer, el token viaja **cifrado**, protegiendo la identidad del usuario.

---

### ¿Por qué usamos cookies HttpOnly, Secure y SameSite=Lax?
Son los 3 candados de seguridad de las cookies en el navegador:
1. **`HttpOnly`:** Hace que el token sea **invisible para JavaScript**. Si un hacker intenta inyectar código malicioso (ataque XSS) con `document.cookie`, no podrá robar el token de sesión.
2. **`Secure`:** La cookie **solo viaja por conexiones cifradas HTTPS**. Nunca viajará en HTTP inseguro.
3. **`SameSite=Lax`:** Impide que sitios web externos envíen peticiones maliciosas en nombre del usuario (previene ataques CSRF - *Cross-Site Request Forgery*).

---

### ¿Qué es CSP, HSTS y las Cabeceras de Seguridad HTTP?
Son instrucciones defensivas que nuestro servidor le envía al navegador:
* **HSTS (*Strict-Transport-Security*):** Obliga al navegador a conectarse siempre y exclusivamente por HTTPS, bloqueando cualquier intento de conexión sin cifrar.
* **X-Frame-Options: DENY:** Impide que nuestra web sea embebida dentro de un `<iframe>` en otra página (evita ataques de *Clickjacking* donde engañan al usuario para hacer clics fantasmas).
* **X-Content-Type-Options: nosniff:** Obliga al navegador a respetar el tipo de archivo y no ejecutar código disfrazado de imagen.

---

### ¿Qué es CSPRNG y UUID v4 en los Códigos QR?
* **¿Qué es UUID v4?** Es un *Universally Unique Identifier* de 128 bits (ejemplo: `f47ac10b-58cc-4372-a567-0e02b2c3d479`). Hay billones de combinaciones posibles.
* **¿Qué es CSPRNG?** *Cryptographically Secure Pseudo-Random Number Generator*. Significa que el código QR no se genera con números secuenciales (como 1, 2, 3 que cualquiera adivinaría), sino con aleatoriedad criptográfica, impidiendo la falsificación de tickets.

---

### ¿Qué es un SOC (Security Operations Center / Centro de Control)?
* **Concepto:** Es el panel central de observabilidad y monitoreo donde el equipo de TI y los administradores ven en tiempo real:
  1. Cuántos intentos de inicio de sesión fallidos ocurrieron (ataques de fuerza bruta mitigados).
  2. Cuántos accesos fueron bloqueados por falta de permisos (errores 403 Forbidden).
  3. Códigos QR caducados o reutilizados.
  4. Estado de salud y latencia del sistema.
  5. Registro inmutable de auditoría (*SecurityAuditLog*) para saber **quién hizo qué, a qué hora y desde qué IP**.

---

# 3. Arquitectura de Software y Tecnologías del Stack

### ¿Qué es Next.js 15 y React 19 Server Components?
* **Concepto:** Next.js es el framework líder de React para aplicaciones web modernas.
* **¿Qué son los Server Components?** En lugar de que el navegador del usuario descargue gigabytes de JavaScript para procesar las páginas, el servidor procesa el HTML y envía solo el contenido necesario. Esto hace que la página cargue en milisegundos, ideal para celulares en terreno con mala conexión móvil.
* **¿Qué son las Server Actions?** Funciones seguras de backend que se ejecutan directamente en el servidor sin necesidad de crear endpoints REST tradicionales de forma manual.

---

### ¿Qué es Prisma ORM y por qué evita la Inyección SQL (SQLi)?
* **Concepto:** Un ORM (*Object-Relational Mapping*) es un puente que nos permite interactuar con la base de datos usando objetos y funciones de TypeScript (`prisma.reservation.findMany(...)`) en vez de escribir comandos SQL manuales en texto (`"SELECT * FROM..."`).
* **¿Por qué es seguro?** Porque Prisma **parametriza automáticamente el 100% de las consultas**. Si un usuario ingresa `' OR 1=1 --` en un campo de texto, Prisma lo trata como un simple texto inofensivo y no como una instrucción ejecutable, neutralizando totalmente las inyecciones SQL.

---

### ¿Qué es PostgreSQL Serverless en Neon Cloud?
* **Concepto:** PostgreSQL es el motor de base de datos relacional de código abierto más robusto y confiable del mundo.
* **¿Por qué Serverless en Neon?** Porque no requiere mantener un servidor encendido 24/7 gastando dinero. La base de datos se activa en milisegundos cuando hay una petición y escala automáticamente según la demanda, operando con una capa gratuita que permite un costo inicial de **$0 USD**.

---

### ¿Qué es RBAC (Role-Based Access Control) de 6 Roles?
Es nuestro modelo de **Control de Acceso Basado en Roles**:
1. `OWNER`: Superusuario con control total y acceso a configuraciones críticas.
2. `IT_ADMIN`: Administrador de TI, gestión de inventario y analítica SOC.
3. `IT_SERVICE`: Personal técnico en terreno; valida QR en < 30 seg y entrega equipos.
4. `ASSISTANT`: Encargado de auditorio/biblioteca; aprueba, aplaza o rechaza solicitudes.
5. `PROFESSOR`: Docentes/solicitantes; piden salas, confirman asistencia por email y evalúan satisfacción.
6. `STUDENT`: Visor público; solo consulta la cartelera de eventos.

---

# 4. Bases de Datos, Modelado Relacional y Anti-Colisiones

### ¿Qué es la Tercera Forma Normal (3FN)?
* **Concepto:** Es una regla de diseño de bases de datos que evita tener datos duplicados o redundantes. Cada tabla tiene una clave primaria única (`PK`) y los campos dependen exclusivamente de esa clave (ej. los datos del usuario están en la tabla `User` y la tabla `Reservation` solo guarda el `userId` como clave foránea `FK`).

---

### ¿Qué son los Índices B-Tree?
* **Concepto:** Es una estructura de árbol binario optimizada que el motor de base de datos utiliza para encontrar registros de forma instantánea sin tener que recorrer toda la tabla fila por fila.
* **¿Dónde los usamos?** En los campos `startTime`, `endTime`, `status` y `userId`, lo que permite calcular la disponibilidad del auditorio en menos de 50 milisegundos.

---

### ¿Cómo funciona el Algoritmo Anti-Colisiones de Horarios?
* **Fórmula Matemática:** $\max(T_{inicio1}, T_{inicio2}) < \min(T_{fin1}, T_{fin2})$
* **Explicación sencilla:** Dos reservas colisionan si el inicio de la última que comienza ocurre antes del fin de la primera que termina. Nuestro sistema ejecuta esta validación de forma atómica en una transacción de PostgreSQL para que sea matemáticamente imposible que dos eventos aprobados se crucen en el mismo horario.

---

# 5. Gestión, Metodología Scrum y Conceptos Operacionales

### ¿Qué es un MVP (Minimum Viable Product / Producto Mínimo Viable)?
* **Concepto:** En ingeniería de software moderna (metodología *Lean Startup* de Eric Ries), un MVP es la versión funcional que contiene el conjunto esencial de características para **resolver el problema raíz y validar su uso en un entorno real**, sin gastar meses en funciones secundarias que no aportan al problema principal.
* **¿Por qué este proyecto es un MVP?** Porque resuelve los cuellos de botella reales (QR de <30s, horas de TI, difusión a aseo/guardia, No-Shows y ciberseguridad), dejando para el **Roadmap Futuro** integraciones más complejas como torniquetes NFC o domótica IoT.

---

### ¿Por qué medimos "Horas Hombre Utilizadas de TI"?
* **Concepto:** Tradicionalmente, cuando un docente reservaba de 09:00 a 12:00, no se sabía si el técnico de TI estuvo 5 minutos o 3 horas.
* **Medición Exacta:** Con nuestro escaneo QR, el técnico registra `checkInTime` (cuando inicia el evento y entrega equipos) y `checkoutTime` (cuando finaliza y recibe los equipos).
* **Fórmula:** $\Delta T = checkoutTime - checkInTime$
* **Utilidad:** Permite a la jefatura de TI y a la dirección conocer el balance real de horas dedicadas a soporte técnico presencial por facultad, planificar turnos y justificar la dotación del equipo con datos matemáticos.

---

### ¿Qué es el PriorityScore y la Penalización de No-Shows?
* **Concepto:** Cada usuario parte con 100 puntos de reputación.
* **Regla:** Si un usuario reserva el auditorio y no asiste sin cancelar con antelación (estado `NO_SHOW`), el sistema le descuenta automáticamente **20 puntos**.
* **Efecto:** Si dos profesores solicitan la misma sala para un evento futuro, el sistema prioriza al docente con mayor puntaje, desincentivando las reservas fantasmas.

---

### ¿Qué es Net Promoter Score (NPS)?
* **Concepto:** Es el estándar mundial para medir la satisfacción y lealtad de los usuarios.
* **En el Sistema:** Tras el Check-out, el docente responde 3 preguntas con estrellas (1 a 5). El sistema calcula el NPS promedio ponderando la calidad del evento, el estado de los equipos y la rapidez del soporte de TI.

---

### ¿Cómo aplicamos Scrum con 8 Roles Simulados?
* **Concepto:** Aunque el proyecto es ejecutado de forma individual para titulación, se planificó y estructuró bajo el marco ágil **Scrum** simulando una célula de ingeniería de software compuesta por 8 especialidades:
  1. *Product Owner* (Priorización del Backlog y dolores de los usuarios).
  2. *Scrum Master* (Ceremonias ágiles y control de tiempos).
  3. *Software Architect* (Arquitectura C4, nube y seguridad).
  4. *Lead Fullstack Developer* (Lógica de negocio y Server Actions).
  5. *Frontend UI/UX Developer* (Diseño Glassmorphism y lector QR móvil).
  6. *Backend & DB Engineer* (Modelado Prisma y optimización de índices).
  7. *QA Test Engineer* (Pruebas unitarias e ISO 25010).
  8. *DevOps & Security Engineer* (Pipeline CI/CD en GitHub Actions y auditoría OWASP).

---

# 6. Preguntas Frecuentes de la Comisión y Cómo Responderlas

### Pregunta 1: *"¿Por qué decidiste plantear esto como un MVP y no como un sistema final terminado?"*
* **Respuesta Ganadora:**
  > *"Siguiendo las mejores prácticas de ingeniería de software y la metodología Lean Startup, un MVP de alta fidelidad nos permite concentrarnos en resolver y validar empíricamente los cuatro cuellos de botella operacionales críticos: eliminar la hora de espera del personal de TI mediante QR de 30 segundos, medir las horas hombre utilizadas de soporte, coordinar a aseo/guardias y blindar la ciberseguridad. En el informe documentamos un Roadmap Evolutivo Post-MVP para integraciones futuras como cerraduras IoT y sincronización con calendarios corporativos."*

---

### Pregunta 2: *"¿Cómo aseguras que dos profesores no reserven el auditorio en el mismo horario?"*
* **Respuesta Ganadora:**
  > *"No lo dejamos a una validación visual de interfaz. Implementamos una restricción matemática y transaccional atómica a nivel de base de datos relacional en PostgreSQL. El sistema valida la condición $\max(T_{inicio1}, T_{inicio2}) < \min(T_{fin1}, T_{fin2})$ sobre todas las reservas aprobadas e indexadas con árboles B-Tree, garantizando cero solapamientos incluso bajo alta concurrencia."*

---

### Pregunta 3: *"¿Qué medidas de seguridad aplicaste para proteger la información de los usuarios?"*
* **Respuesta Ganadora:**
  > *"Implementamos un enfoque de seguridad en profundidad basado en OWASP Top 10 e ISO 27001: las contraseñas se cifran con bcrypt (factor de costo 10 con sal), las sesiones viajan en tokens JWT cifrados en cookies HttpOnly y Secure para mitigar XSS y CSRF, todas las consultas a base de datos están parametrizadas contra SQL Injection con Prisma ORM, y creamos un Centro de Control SOC con la tabla SecurityAuditLog para registrar intentos de acceso no autorizados."*

---

### Pregunta 4: *"¿Cuánto cuesta mantener esta infraestructura en la nube?"*
* **Respuesta Ganadora:**
  > *"La arquitectura fue diseñada como Cloud-Native Serverless utilizando Vercel para el frontend y Server Actions, y Neon Cloud para PostgreSQL. Ambas plataformas cuentan con capas gratuitas de alta capacidad que absorben la demanda completa del auditorio, lo que resulta en un costo inicial de infraestructura de $0 USD."*

---

### Pregunta 5: *"¿Qué diferencia hay entre este sistema y un calendario compartido de Google Calendar o Excel?"*
* **Respuesta Ganadora:**
  > *"Un calendario de Google o una planilla de Excel es solo una agenda pasiva: no valida presencia física, no mide las horas reales que TI dedica a soporte, no penaliza No-Shows, no controla el inventario de microfonía o streaming, no despacha tareas automáticas a aseo y guardia, y no posee un Centro de Operaciones de Ciberseguridad para auditar accesos indebidos. Nuestro sistema es una plataforma de gobernanza operativa integral."*
