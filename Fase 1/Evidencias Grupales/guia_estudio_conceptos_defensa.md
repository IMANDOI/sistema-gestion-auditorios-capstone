# GUÍA DE ESTUDIO Y GLOSARIO TÉCNICO PARA LA DEFENSA DE CAPSTONE
## Preparación Conceptual, Estándares de Ingeniería y Respuestas para la Comisión
### Proyecto Capstone (APT122 / PTY4614): Sistema Autónomo de Gestión Operativa, Trazabilidad, Medición de Horas de TI y Analítica para Auditorios

Esta guía explica en lenguaje claro, técnico y con ejemplos prácticos cada uno de los conceptos, estándares y tecnologías presentes en el informe y la presentación del Proyecto Capstone.

---

## ÍNDICE RÁPIDO DE CONSULTA

1. [Estándares y Normas Internacionales (IEEE, ISO, OWASP)](#1-estándares-y-normas-internacionales)
2. [Ciberseguridad Defensiva y Protección de Datos](#2-ciberseguridad-defensiva-y-protección-de-datos)
3. [Arquitectura de Software y Tecnologías del Stack](#3-arquitectura-de-software-y-tecnologías-del-stack)
4. [Bases de Datos, Modelado Relacional y Restricciones](#4-bases-de-datos-modelado-relacional-y-restricciones)
5. [Gestión, Metodología Scrum y Conceptos Operacionales](#5-gestión-metodología-scrum-y-conceptos-operacionales)
6. [Preguntas Frecuentes de la Comisión Evaluadora y Respuestas Sugeridas](#6-preguntas-frecuentes-de-la-comisión-y-respuestas-sugeridas)

---

# 1. Estándares y Normas Internacionales

### ¿Qué es IEEE 830 / ISO/IEC/IEEE 29148? (Especificación de Requerimientos)
* **Definición:** Estándar internacional del *Institute of Electrical and Electronics Engineers* que establece la estructura y buenas prácticas para la redacción de la **Especificación de Requerimientos de Software (SRS)**.
* **Propósito:** Elimina la ambigüedad en el alcance del proyecto, clasificando las necesidades en:
  * **Requerimientos Funcionales (RF):** Funciones que el sistema debe ejecutar (ejemplo: emisión de códigos QR, despacho de notificaciones, registro de Check-in).
  * **Requerimientos No Funcionales (RNF):** Propiedades y restricciones de calidad del sistema (ejemplo: tiempos de respuesta inferiores a 800ms, cifrado de contraseñas, compatibilidad móvil).
* **Cómo explicarlo:** *"Aplicamos el estándar IEEE 830 para formalizar 14 requerimientos funcionales y 8 especificaciones de seguridad, delimitando con precisión técnica el alcance del MVP."*

---

### ¿Qué es ISO/IEC 27001? (Seguridad de la Información)
* **Definición:** Norma internacional que especifica los requisitos para establecer, implementar y mantener un **Sistema de Gestión de Seguridad de la Información (SGSI)**.
* **Tríada CID de Seguridad:**
  1. **Confidencialidad:** Garantizar que solo los usuarios autorizados accedan a la información correspondiente según su rol (RBAC).
  2. **Integridad:** Asegurar que los datos de reservas, inventario y horas registradas no sean alterados indebidamente.
  3. **Disponibilidad:** Asegurar el acceso ininterrumpido al servicio mediante infraestructura cloud serverless de alta disponibilidad.
* **Cómo explicarlo:** *"Adoptamos las directrices de ISO 27001 para resguardar la confidencialidad mediante control RBAC de 6 roles, la integridad mediante registros inmutables de auditoría y la disponibilidad mediante infraestructura en la nube."*

---

### ¿Qué es ISO/IEC 25010? (Calidad de Software)
* **Definición:** Estándar internacional para la evaluación de la **Calidad del Producto de Software (SQuaRE)**.
* **Características evaluadas:** Eficiencia de rendimiento (velocidad de carga), usabilidad (diseño Mobile-First), fiabilidad (tolerancia a fallos), seguridad (protección de datos) y mantenibilidad (código modular tipado en TypeScript).
* **Cómo explicarlo:** *"La calidad del sistema se mide cuantitativamente bajo ISO 25010 a través de métricas de rendimiento Core Web Vitals y pruebas unitarias automatizadas."*

---

### ¿Qué es OWASP Top 10? (Seguridad en Aplicaciones Web)
* **Definición:** Documento de consenso mundial publicado por el *Open Web Application Security Project* que identifica los **10 riesgos de seguridad más críticos en aplicaciones web**.
* **Mitigaciones aplicadas en el proyecto:**
  * **A01: Pérdida de Control de Acceso (Broken Access Control):** Mitigado mediante validación de permisos RBAC en el servidor antes de cada mutación.
  * **A03: Inyección (SQL Injection):** Mitigado mediante el uso de Prisma ORM, que parametriza el 100% de las consultas a PostgreSQL.
  * **A07: Fallas de Identificación y Autenticación:** Mitigado mediante hashing con `bcrypt` (factor $\ge 10$) y almacenamiento de sesiones en cookies `HttpOnly`/`Secure`.

---

# 2. Ciberseguridad Defensiva y Protección de Datos

### ¿Qué es bcrypt y el Factor de Costo ($\ge 10$)?
* **Concepto:** Algoritmo de derivación de claves basado en la función de cifrado Blowfish. Aplica hashing unidireccional con sal (*salt*) aleatoria para impedir el descifrado de contraseñas incluso ante filtraciones de base de datos.
* **Factor de costo 10:** Aplica $2^{10} = 1.024$ iteraciones de cálculo, haciendo inviables los ataques por fuerza bruta o tablas arcoíris (*Rainbow Tables*).

---

### ¿Qué son los JWT (JSON Web Tokens) y por qué se usan cookies HttpOnly / Secure / SameSite?
* **JWT:** Estructura compacta y autónoma que contiene los datos de sesión del usuario (ID, rol, expiración) firmados digitalmente.
* **Directivas de seguridad en cookies:**
  1. **`HttpOnly`:** Bloquea el acceso a la cookie desde JavaScript en el navegador, neutralizando ataques de robo de sesión por Cross-Site Scripting (XSS).
  2. **`Secure`:** Fuerza la transmisión de la cookie exclusivamente a través de canales cifrados HTTPS (TLS 1.3).
  3. **`SameSite=Lax`:** Restringe el envío de la cookie en peticiones originadas desde sitios externos, mitigando ataques de Cross-Site Request Forgery (CSRF).

---

### ¿Qué son las Cabeceras HTTP Defensivas (Security Headers)?
* **HSTS (*Strict-Transport-Security*):** Instruye al navegador para comunicarse únicamente mediante HTTPS.
* **X-Frame-Options: DENY:** Previene ataques de *Clickjacking*, impidiendo que la aplicación sea embebida dentro de elementos `<iframe>` de terceros.
* **X-Content-Type-Options: nosniff:** Evita que el navegador interprete archivos con tipos MIME incorrectos o alterados.

---

### ¿Por qué se utiliza UUID v4 y CSPRNG en los Códigos QR?
* **UUID v4:** Identificador único universal de 128 bits con entropía pseudoaleatoria.
* **CSPRNG (*Cryptographically Secure Pseudo-Random Number Generator*):** Generador de números aleatorios criptográficamente seguro que impide predecir tokens correlativos o falsificar pases de acceso al recinto.

---

# 3. Arquitectura de Software y Tecnologías del Stack

### ¿Qué es Next.js 15 y React Server Components?
* **Next.js 15:** Framework fullstack para React con arquitectura basada en App Router.
* **Server Components:** Componentes que se ejecutan y renderizan en el servidor, reduciendo el bundle de JavaScript descargado por el cliente y mejorando drásticamente el rendimiento en dispositivos móviles en terreno.
* **Server Actions:** Funciones asíncronas de servidor que permiten ejecutar mutaciones de datos directamente desde componentes sin necesidad de crear endpoints REST tradicionales de forma manual.

---

### ¿Qué es Prisma ORM y por qué previene SQL Injection?
* **Prisma ORM:** Mapeador objeto-relacional de tipado estricto para TypeScript.
* **Prevención de inyecciones:** Prisma construye consultas SQL mediante parámetros de sustitución tipados, asegurando que las entradas del usuario nunca se concatenen como código ejecutable en la base de datos.

---

### ¿Qué es PostgreSQL Serverless en Neon Cloud?
* **PostgreSQL:** Sistema de gestión de bases de datos relacional y transaccional compatible con ACID.
* **Neon Serverless:** Plataforma cloud que desacopla el almacenamiento del cómputo, activando recursos bajo demanda con alta disponibilidad y costo de infraestructura inicial de **$0 USD**.

---

### ¿Qué es el Control RBAC (Role-Based Access Control) de 6 Roles?
Modelo de autorización que restringe las operaciones del sistema según el rol del usuario:
1. `OWNER`: Administración global del sistema y configuraciones generales.
2. `IT_ADMIN`: Gestión de inventario técnico y analítica operacional.
3. `IT_SERVICE`: Validación física en terreno por QR (< 30s) y control de equipamiento.
4. `ASSISTANT`: Revisión de solicitudes y coordinación de aperturas.
5. `PROFESSOR`: Solicitud de espacios, confirmación rápida y encuestas de satisfacción.
6. `STUDENT`: Consulta de cartelera pública de eventos.

---

# 4. Bases de Datos, Modelado Relacional y Restricciones

### ¿Qué es la Tercera Forma Normal (3FN)?
* Regla de diseño relacional que garantiza que cada tabla almacene exclusivamente atributos dependientes de su clave primaria, eliminando la redundancia y evitando anomalías de inserción, actualización y borrado.

---

### ¿Cómo funciona el Algoritmo Anti-Colisiones de Horarios?
* **Condición de intersección temporal:** $\max(T_{inicio1}, T_{inicio2}) < \min(T_{fin1}, T_{fin2})$
* **Implementación:** Se ejecuta dentro de una transacción atómica en PostgreSQL sobre reservas con estado `APPROVED` o `CHECKED_IN`, impidiendo solapamientos de horario en el auditorio.

---

# 5. Gestión, Metodología Scrum y Conceptos Operacionales

### ¿Por qué el proyecto se define como un Producto Mínimo Viable (MVP)?
* Bajo los principios de la ingeniería de software y la metodología *Lean Startup*, un MVP contiene el conjunto nuclear de funcionalidades operacionales para resolver los problemas de mayor impacto (validación QR en < 30s, medición de horas de TI, difusión por áreas y ciberseguridad defensiva), estableciendo un **Roadmap Post-MVP** para integraciones complementarias (torniquetes NFC, domótica IoT).

---

### ¿Qué representa la Métrica de "Horas Hombre Utilizadas de TI"?
* **Cálculo:** Diferencial entre el cierre y el inicio del soporte presencial ($\Delta T = checkoutTime - checkInTime$).
* **Aporte:** Proporciona datos cuantitativos a las jefaturas técnicas sobre el tiempo real dedicado a soporte presencial por carrera y evento, optimizando la planificación de turnos y eliminando la espera pasiva.

---

### ¿Qué es el PriorityScore y la Penalización de No-Shows?
* Sistema de reputación donde cada usuario inicia con 100 puntos y se descuentan 20 puntos por cada reserva no utilizada sin aviso previo (`NO_SHOW`), priorizando a los solicitantes responsables en caso de solicitudes concurrentes.

---

# 6. Preguntas Frecuentes de la Comisión y Respuestas Sugeridas

### Pregunta 1: *"¿Por qué la solución se plantea como un MVP?"*
* **Respuesta Sugerida:**
  > *"Porque permite validar empíricamente la resolución de las ineficiencias operacionales más críticas —como eliminar la espera pasiva del personal técnico mediante QR y registrar las horas reales de soporte— asegurando un alcance factible de desarrollar y testear dentro del ciclo de la asignatura Capstone, dejando documentado un Roadmap para integraciones futuras."*

---

### Pregunta 2: *"¿Cómo se garantiza que no existan reservas duplicadas en el mismo horario?"*
* **Respuesta Sugerida:**
  > *"A través de una validación atómica en la base de datos PostgreSQL que evalúa la intersección matemática de intervalos sobre reservas aprobadas, respaldada por índices B-Tree en campos temporales para respuestas inmediatas."*

---

### Pregunta 3: *"¿Qué medidas de seguridad protegen el sistema?"*
* **Respuesta Sugerida:**
  > *"Aplicamos los estándares OWASP Top 10 e ISO 27001: contraseñas procesadas con bcrypt y factor de costo 10 con sal, sesiones gestionadas con cookies HttpOnly y Secure, consultas parametrizadas contra SQL Injection con Prisma ORM y control de acceso RBAC de 6 roles verificado en el servidor."*
