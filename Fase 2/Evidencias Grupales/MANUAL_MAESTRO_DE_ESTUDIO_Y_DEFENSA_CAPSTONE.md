# MANUAL MAESTRO DE ESTUDIO Y DEFENSA TÉCNICA
## Sistema Autónomo de Gestión Operativa, Trazabilidad, Analítica y Ciberseguridad para Auditorios
### Portafolio de Título (PTY4614 / APT122) — Escuela de Informática y Telecomunicaciones — Duoc UC

**Estudiante:** Benjamín Navarrete  
**Rol en el Proyecto:** Super Administrador / Líder Técnico de Desarrollo  
**Asignatura / Código:** Proyecto Capstone (PTY4614 / APT122)  
**Profesor Guía:** Diego Garcés M.  
**Repositorio GitHub:** [https://github.com/IMANDOI/sistema-gestion-auditorios-capstone](https://github.com/IMANDOI/sistema-gestion-auditorios-capstone)  
**Despliegue en Producción Vercel:** [https://sistema-gestion-auditorios-capstone.vercel.app](https://sistema-gestion-auditorios-capstone.vercel.app)  
**Archivo Word Oficial:** `Fase 2/Evidencias Grupales/MANUAL_MAESTRO_DE_ESTUDIO_Y_DEFENSA_CAPSTONE.docx`  

---

## ÍNDICE DE CONTENIDOS (MAPA DE NAVEGACIÓN RÁPIDA)

1. [MÓDULO 1: El "Elevator Pitch" (Cómo explicar el proyecto en 60 segundos)](#módulo-1-el-elevator-pitch-cómo-explicar-el-proyecto-en-60-segundos)
2. [MÓDULO 2: Especialización en Bases de Datos (Tu área débil explicada con peras y manzanas)](#módulo-2-especialización-en-bases-de-datos-tu-área-débil-hecha-fortaleza)
   - ¿Qué es una Base de Datos Relacional (RDBMS)?
   - ¿Por qué usamos dos bases de datos: SQLite y PostgreSQL?
   - ¿Qué es Prisma ORM y por qué no usamos SQL puro?
   - Conceptos esenciales: PK, FK, CUID, `@unique`, Índices.
3. [MÓDULO 3: Diccionario de los 10 Modelos del Sistema](#módulo-3-diccionario-de-los-10-modelos-del-sistema)
   - Tabla comparativa de los 10 modelos de Prisma.
   - Las 4 formas de relacionarse entre tablas (1:1, 1:N, N:M, Polimórfica).
4. [MÓDULO 4: Arquitectura Técnica y Componentes Clave](#módulo-4-arquitectura-técnica-y-componentes-clave)
   - Next.js 15, Server Actions, Lector QR 2D, 4 Bots RPA, Plan de Incidentes (IRP).
5. [MÓDULO 5: Simulador de Defensa — 25 Preguntas Trampa de la Comisión y Cómo Responder](#módulo-5-simulador-de-defensa--20-preguntas-trampa-de-la-comisión)
6. [MÓDULO 6: Análisis de la Nota 5.6 (Fase 2) y Plan Maestro para el Siguiente Avance](#módulo-6-análisis-de-la-nota-56-fase-2-y-plan-maestro-para-el-siguiente-avance)

---

## MÓDULO 1: EL 'ELEVATOR PITCH' (CÓMO EXPLICAR EL PROYECTO EN 60 SEGUNDOS)

> [!TIP]
> **Respuesta textual recomendada (Memorizar este guión de 3 párrafos):**
>
> "Nuestro proyecto resuelve un problema operacional crítico en las instituciones de educación superior: el caos en la gestión de auditorios y la pérdida masiva de horas del soporte técnico.
>
> Históricamente, los recintos se administraban con planillas Excel desarticuladas, cadenas de correos y llamadas de última hora, generando solapamientos de clases y hasta una hora de espera pasiva de los técnicos de soporte audiovisual en la puerta del recinto sin saber si la clase se realizaría.
>
> Para solucionarlo, desarrollamos una plataforma web autónoma y reactiva desplegada en la nube con Next.js y PostgreSQL serverless. Cada reserva aprobada genera un **Pase QR criptográfico** que el técnico valida presencialmente con la cámara en menos de 30 segundos. El sistema computa de forma automática las horas de soporte dedicadas, alerta a las cuadrillas de Aseo, Guardia y TI, ejecuta **4 bots de automatización RPA** para liberar salas si hay inasistencias (*No-Show*) y ofrece un **Dashboard de Salud Operacional con Plan de Respuesta a Incidentes (IRP)** para supervisar la disponibilidad y el tiempo medio de reparación (*MTTR*) de los implementos."

---

## MÓDULO 2: ESPECIALIZACIÓN EN BASES DE DATOS (TU ÁREA DÉBIL HECHA FORTALEZA)

### 1. ¿Qué es una Base de Datos Relacional (RDBMS)?
Es un almacén digital de información estructurado en **tablas** (filas y columnas). Es *relacional* porque una tabla se vincula con otra mediante identificadores compartidos (por ejemplo, saber que la reserva `#clj89...` le pertenece al usuario con ID `#usr_45...`).

### 2. ¿Por qué usamos dos motores: SQLite y PostgreSQL?
* **SQLite (`dev.db`):** Lo usamos en desarrollo local. Es un archivo único liviano que vive dentro de la carpeta del proyecto. No necesita instalar servicios pesados ni levantar servidores en tu computador.
* **PostgreSQL en Neon Tech (Nube):** Lo usamos en producción en Vercel. Neon es una base de datos PostgreSQL Serverless en la nube, escalable, con soporte de transacciones concurrentes ACID, copias de seguridad continuas y alta disponibilidad.

> [!NOTE]
> **Pregunta clásica:** *"¿Tuvieron que cambiar el código de las consultas al pasar de SQLite a PostgreSQL?"*  
> **Tu respuesta:** *"No, profesor. Gracias a Prisma ORM, la lógica de negocio y las consultas son exactamente idénticas. Solo modificamos la variable `DATABASE_URL` y la directiva `provider` en `schema.prisma`."*

### 3. ¿Qué es un ORM y por qué usamos Prisma?
**ORM** significa *Object-Relational Mapping* (Mapeo Objeto-Relacional). Es un traductor inteligente entre el código de programación (TypeScript) y el motor de base de datos (SQL).

* **Sin ORM (Vulnerable y propenso a errores):**  
  `db.query("SELECT * FROM User WHERE email = '" + email + "'");` *(Peligroso: si el usuario ingresa caracteres especiales, puede hackear la base de datos con SQL Injection).*
* **Con Prisma ORM (Seguro y tipado):**  
  `const user = await prisma.user.findUnique({ where: { email } });`  
  *(Prisma genera consultas parametrizadas automáticas, blindando el sistema contra ataques SQLi y autocompletando los campos en el editor).*

### 4. Glosario de Conceptos que Debes Dominar con Seguridad
1. **Clave Primaria (Primary Key / PK):** El identificador único e irrepetible de una fila. Usamos **CUID** (ej. `clj3x8p9q0001abc...`).
2. **¿Por qué CUID y no números correlativos (1, 2, 3)?:** Si usas números simples, un atacante puede alterar la URL (`/reserva/1`, `/reserva/2`) y acceder a registros ajenos (vulnerabilidad IDOR / enumeración). El CUID es impredecible.
3. **Clave Foránea (Foreign Key / FK):** Es un campo que apunta a la clave primaria de otra tabla. Ejemplo: en `Reserva`, el campo `userId` apunta al `id` de `User`.
4. **Restricción `@unique`:** Obliga a que un dato no se repita en toda la tabla (usado en el correo electrónico y en el token QR).
5. **Índice (`@index`):** Una estructura interna similar al índice temático de un libro, que acelera exponencialmente las búsquedas de registros en tablas grandes.

---

## MÓDULO 3: DICCIONARIO DE LOS 10 MODELOS DEL SISTEMA

| Modelo Prisma | Nombre en Español | Propósito en el Negocio y Campos Clave |
| :--- | :--- | :--- |
| `model User` | Usuario | Guarda cuentas de acceso (Docente, Técnico TI, Encargado, Admin). Clave hasheada con bcrypt y puntaje de cumplimiento cívico (`priorityScore`). |
| `model Auditorio` | Recinto / Auditorio | Espacios físicos administrados (nombre, capacidad, ubicación, estado: OPERATIONAL, MAINTENANCE). |
| `model Reserva` | Reserva de Auditorio | Corazón transaccional: horarios (`startTime`, `endTime`), estado (PENDING, APPROVED, CHECKED_IN, NO_SHOW), token QR criptográfico y marcas de tiempo de soporte. |
| `model Equipamiento` | Inventario de Hardware | Proyectores, micrófonos, parlantes, atriles. Controla stock total y disponible en pañol. |
| `model ReservaEquipamiento` | Intermedia Préstamo Equipos | Resuelve la relación Muchos a Muchos (N:M). Guarda cuántos implementos se solicitaron, si fueron entregados y si fueron devueltos. |
| `model RegistroHorasTI` | Cómputo de Horas Soporte | Registra matemáticamente el tiempo exacto que el técnico asistió al docente en el recinto (Delta-T en minutos y horas decimales). |
| `model EncuestaSatisfaccion` | Feedback y Calidad | Calificación de 1 a 5 estrellas (general, equipos, soporte), comentarios libres y cálculo de categoría NPS (Promotor, Pasivo, Detractor). |
| `model SuscripcionArea` | Cuadrillas de Apoyo | Listas de distribución de Aseo, Guardia y TI suscritas a notificaciones automáticas de eventos. |
| `model RegistroAuditoria` | Bitácora Forense | Tabla inmutable (Append-Only) que graba quién hizo qué, sobre qué entidad, a qué hora exacta y desde qué dirección IP. |
| `model RegistroMantenimiento` | Mantenimiento y Taller | Trazabilidad de fallas en recintos o hardware. Calcula el tiempo medio de reparación (MTTR) y exige constancia técnica de solución. |

### Las 4 Formas de Relacionarse entre Tablas
1. **Relación 1 a 1 (Uno a Uno):** `Reserva` <-> `EncuestaSatisfaccion`. Cada reserva tiene un único cuestionario de calidad asociado.
2. **Relación 1 a N (Uno a Muchos):** `User` -> `Reserva` (un docente tiene muchas reservas) y `Auditorio` -> `Reserva` (un auditorio alberga muchas reservas a lo largo del año).
3. **Relación N a M (Muchos a Muchos con Atributos):** `Reserva` <-> `Equipamiento` a través de `ReservaEquipamiento`. Una reserva pide varios implementos; un implemento puede estar en muchas reservas en distintos días.
4. **Relación Polimórfica / Opcional:** `RegistroMantenimiento` puede vincularse opcionalmente a un `auditorioId?` o a un `equipamientoId?`.

---

## MÓDULO 4: ARQUITECTURA TÉCNICA Y COMPONENTES CLAVE

* **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS. Enfoque **Mobile-First** accesible (**WCAG 2.1 AA**).
* **Backend:** Next.js **Server Actions**. No usamos endpoints REST expuestos (`/api/...`); las Server Actions son funciones seguras que corren exclusivamente en el servidor, validan datos con **Zod** y se conectan a Prisma.
* **Ciberseguridad:** Contraseñas hasheadas con `bcrypt` (salt rounds 10), cookies de sesión con flags `HttpOnly`, `Secure` y `SameSite=Lax` (anti-XSS), y control de acceso basado en roles (**RBAC**).
* **Lector QR Inteligente:** El componente `CameraQRScanner.tsx` ejecuta un recorte central a resolución nativa (800x800) y filtro de inversión de contraste (`attemptBoth`) para leer códigos en pantallas de celular con brillo o reflejos, apagando automáticamente la cámara tras la lectura.
* **Bots RPA (Automatización):**
  1. *Bot No-Show:* Cancela y libera la sala si el docente no llega tras 15 minutos.
  2. *Bot Cuadrillas:* Notifica a Aseo y Guardia los requerimientos de apertura y limpieza.
  3. *Bot Horas TI:* Calcula el Delta-T de horas de soporte ahorradas.
  4. *Bot Forense:* Registra cambios sensibles de agenda en la bitácora inmutable.
* **Plan de Respuesta a Incidentes (IRP):** Módulo para declarar incidentes de severidad SEV-1 a SEV-4 con protocolos de contingencia técnica.

---

## MÓDULO 5: SIMULADOR DE DEFENSA — 20 PREGUNTAS TRAMPA DE LA COMISIÓN

### 1. ¿Cómo evitan la doble reserva simultánea (Race Condition)?
> [!NOTE]
> **Respuesta:** "Profesor, mediante una validación temporal en la base de datos dentro de una transacción atómica. Antes de confirmar, consultamos si existe una reserva activa en ese auditorio donde `startTime < newEnd` y `endTime > newStart`. Si existe coincidencia, la transacción se aborta de inmediato."

### 2. ¿Cómo se protegen de la Inyección SQL?
> [!NOTE]
> **Respuesta:** "Gracias a Prisma ORM. Prisma genera automáticamente consultas preparadas y parametrizadas (*Prepared Statements*). Los datos ingresados por el usuario viajan separados del código SQL, imposibilitando la ejecución de sentencias arbitrarias."

### 3. ¿Cómo y dónde se guardan las contraseñas?
> [!NOTE]
> **Respuesta:** "Nunca en texto plano. Usamos la librería `bcrypt` con 10 rondas de salteo (*salt rounds*). Se genera un hash unidireccional irreversible y al iniciar sesión se valida con `bcrypt.compare()`."

### 4. ¿Qué protege al sistema contra el robo de sesiones (XSS)?
> [!NOTE]
> **Respuesta:** "Nuestras cookies de sesión llevan el flag `HttpOnly`. Este flag impide que cualquier código JavaScript malicioso en el navegador del cliente pueda leer o exportar la cookie de autenticación."

### 5. ¿Por qué eligieron una arquitectura Serverless en Neon y Vercel?
> [!NOTE]
> **Respuesta:** "Por costo, mantenimiento y escalabilidad. No pagamos por un servidor encendido 24/7 en periodos sin clases, no tenemos que administrar parches de sistema operativo manualmente y contamos con despliegue continuo desde GitHub con alta disponibilidad."

### 6. ¿Qué es una migración en Prisma y para qué sirve?
> [!NOTE]
> **Respuesta:** "Es un archivo SQL versionado que refleja un cambio estructural en el esquema de la base de datos. Asegura que todos los miembros del equipo y el servidor de producción tengan exactamente las mismas tablas y campos sin perder los datos ya guardados."

### 7. ¿Qué función cumple la tabla intermedia ReservaEquipamiento?
> [!NOTE]
> **Respuesta:** "Resuelve la relación Muchos a Muchos entre Reserva y Equipamiento. Además de vincularlos, guarda datos propios del préstamo: cantidad entregada, estado de entrega y si fue retornado a pañol."

### 8. ¿Qué problema resuelve el PriorityScore en el modelo User?
> [!NOTE]
> **Respuesta:** "Es un algoritmo de equidad operativa. Si un docente incurre en inasistencias injustificadas (*No-Show*) o cancelaciones tardías, su puntaje disminuye, permitiendo priorizar a usuarios con mejor comportamiento cívico en horarios punta."

### 9. ¿Cómo garantizan que la Bitácora Forense no sea manipulada?
> [!NOTE]
> **Respuesta:** "Tiene diseño *Append-Only* (solo inserción). En el código no existe ninguna acción que ejecute `UPDATE` o `DELETE` sobre `RegistroAuditoria`. Cada registro queda sellado con fecha, usuario e IP."

### 10. ¿Qué estándar de accesibilidad cumple la interfaz?
> [!NOTE]
> **Respuesta:** "Cumple con las pautas WCAG 2.1 nivel AA: contraste tipográfico mínimo de 4.5:1, compatibilidad con lectores de pantalla mediante etiquetas semánticas y navegación completa por teclado."

### 11. ¿Cómo aseguraron la lectura de códigos QR con reflejos o poca luz?
> [!NOTE]
> **Respuesta:** "El escáner utiliza recorte central a resolución nativa y el parámetro `attemptBoth`, que analiza la imagen tanto en contraste normal como invertido para leer pantallas de celulares con alto brillo."

### 12. ¿Por qué usaron Server Actions en vez de una API REST tradicional?
> [!NOTE]
> **Respuesta:** "Porque reducen la superficie de ataque al no exponer rutas HTTP públicas innecesarias, ejecutan la lógica directamente en el servidor y ofrecen tipado estricto de extremo a extremo con TypeScript y Zod."

### 13. ¿Qué métricas operativas monitorea el Dashboard de Salud?
> [!NOTE]
> **Respuesta:** "Ocupación de recintos, horas acumuladas de soporte técnico dedicadas (Delta-T), satisfacción del usuario mediante NPS e índice de estrellas, y el Tiempo Medio de Reparación (MTTR) de equipos en taller."

### 14. ¿Qué es el MTTR y cómo se calcula?
> [!NOTE]
> **Respuesta:** "Es el *Mean Time to Repair*. Se calcula promediando la diferencia entre `resolvedDate` y `startDate` en la tabla `RegistroMantenimiento` para evaluar la eficiencia del servicio técnico."

### 15. ¿Qué pasa si se cae el servicio en la nube durante un evento?
> [!NOTE]
> **Respuesta:** "Se activa el Plan de Respuesta a Incidentes (IRP). Contamos con respaldo local en SQLite, credenciales maestras fuera de banda documentadas en el Manual de Contingencias y procedimiento de registro manual temporal."

### 16. ¿Cómo verificaron la calidad del software antes de entregarlo?
> [!NOTE]
> **Respuesta:** "Bajo el estándar ISO/IEC 25010 en adecuación funcional, confiabilidad y seguridad. Ejecutamos pruebas unitarias de traslape horario, pruebas de escaneo y verificamos que el build de producción (`next build`) finalice con 0 errores."

### 17. ¿Qué diferencia hay entre rol IT_ADMIN e IT_SERVICE?
> [!NOTE]
> **Respuesta:** "`IT_ADMIN` tiene facultades globales de configuración, reprogramación de agenda y gestión de cuentas. `IT_SERVICE` es el rol operativo de terreno: valida pases QR presenciales, registra check-in/checkout y genera órdenes de mantenimiento en taller."

### 18. ¿Cómo se calculan matemáticamente las horas de soporte TI?
> [!NOTE]
> **Respuesta:** "Al registrar el checkout, el servidor computa el Delta-T entre `checkInTime` y `checkoutTime` en minutos y lo almacena como fracción decimal de hora (ej: 45 min = 0.75 hrs)."

### 19. ¿Por qué el proyecto es un MVP 'White-Label'?
> [!NOTE]
> **Respuesta:** "Porque no está acoplado a una sola sede o marca; sus parámetros (recintos, cuadrillas, equipos) son configurables para implementarse en cualquier institución de educación superior o centro de eventos."

### 20. ¿Cuál fue la principal dificultad técnica y cómo la superaron?
> [!NOTE]
> **Respuesta:** "La decodificación del código QR en cámaras web con compresión agresiva. Se resolvió alternando un recorte central de alta resolución nativa con el cuadro completo y cerrando físicamente el stream tras el escaneo para no saturar memoria."

---


### 21. ¿Cómo certificaron formalmente la calidad del software bajo la norma ISO/IEC 25010?
> [!NOTE]
> **Respuesta:** "Profesor, diseñamos una matriz de casos de prueba estructurada en cuatro características del modelo de calidad ISO/IEC 25010: (1) Adecuación funcional, comprobando que las 25 funciones operativas respondan según lo especificado; (2) Seguridad, validando que las consultas parametrizadas de Prisma impidan inyecciones SQL y que las contraseñas estén blindadas con bcrypt; (3) Fiabilidad, verificando la recuperación del sistema mediante el Plan de Incidentes (IRP) y respaldo en SQLite; y (4) Usabilidad, comprobando accesibilidad WCAG 2.1 AA y lectura QR en menos de 15 segundos. Todas las pruebas del sprint arrojaron resultado 100% APROBADO (PASS)."

### 22. ¿Qué es una transacción ACID en Prisma y por qué es vital al reservar un auditorio?
> [!NOTE]
> **Respuesta:** "ACID garantiza Atomicidad, Consistencia, Aislamiento y Durabilidad. En nuestro sistema usamos `prisma.$transaction`. Por ejemplo, cuando se aprueba una reserva, se debe cambiar el estado a APPROVED, asignar los implementos técnicos en `ReservaEquipamiento` y grabar el evento en `RegistroAuditoria`. La atomicidad asegura que se ejecutan las tres operaciones con éxito o no se ejecuta ninguna; si el servidor falla en el paso 3, todo vuelve atrás (Rollback), evitando que queden datos corruptos o 'huérfanos' en la base de datos."

### 23. ¿Cómo maneja la aplicación las conexiones a PostgreSQL en Neon sin saturar la memoria (Connection Pooling)?
> [!NOTE]
> **Respuesta:** "Las arquitecturas serverless en Vercel levantan funciones efímeras (lambdas) que abren conexiones bajo demanda. Si tuviéramos un PostgreSQL clásico, 100 peticiones simultáneas intentarían abrir 100 procesos pesados en la base de datos, agotando la memoria RAM. Neon soluciona esto integrando un Connection Pooler basado en PgBouncer a través del puerto 5432 con SSL. El pooler mantiene un número controlado de conexiones persistentes y enruta de forma ultrarrápida las consultas de las funciones serverless sin saturar el motor."

### 24. ¿Por qué no configuraron eliminación en cascada (onDelete: Cascade) al borrar un Usuario?
> [!NOTE]
> **Respuesta:** "Por integridad referencial y cumplimiento de auditoría forense. Si permitiéramos borrar un usuario en cascada, se eliminarían automáticamente todas las reservas históricas, las horas de soporte dedicadas y los registros de la bitácora que ese usuario realizó, borrando la trazabilidad institucional. En Prisma aplicamos restricciones de integridad: los usuarios no se eliminan físicamente de la base de datos; se desactivan a nivel lógico cambiando su estado o rol, preservando la inmutabilidad histórica."

### 25. Si la comisión pide una demostración de ataque de Inyección SQL en vivo, ¿qué mostrarían?
> [!NOTE]
> **Respuesta:** "Ingresaríamos en el campo de búsqueda o en el formulario de inicio de sesión cadenas típicas de ataque como `' OR '1'='1` o `'; DROP TABLE "User"; --`. Demostraríamos cómo el sistema trata la cadena como texto literal plano sin interpretarla como código SQL ejecutable. El motor Prisma utiliza consultas preparadas (Prepared Statements) con tipado estricto, por lo que el ataque resulta completamente inocuo y no produce ningún error ni filtración de información."

---

## MÓDULO 6: ANÁLISIS DE LA NOTA 5.6 (FASE 2) Y PLAN MAESTRO PARA EL SIGUIENTE AVANCE

### ¿Por qué obtuvieron un 5.6 en la entrega anterior?
De acuerdo con la pauta de evaluación sumativa oficial de Duoc UC (`2.5_APT122_Sumativa Avance Fase2.pdf`), los descuentos típicos de puntaje se concentran en:

1. **Evidencias en Git y equidad de aportes (Indicadores 6 y 7 — 35% del total):**
   Si la mayoría de los commits fueron realizados por un solo integrante o se subieron entregas masivas sin ramas individuales de trabajo (`feature/...`), la pauta descuenta de 1.0 a 1.5 puntos en este apartado.
2. **Evidencias formales de bases de datos y pruebas (Indicador 3 — 25% del total):**
   A veces se adjuntan vistas del software pero faltan capturas directas de las tablas en la base de datos (PostgreSQL/Prisma Studio) y resultados de pruebas de certificación. Esto ya lo corregimos con las 13 capturas del Anexo A en el documento 2.4.
3. **Formalización de ajustes y dificultades (Indicador 1 — 10% del total):**
   Se debe documentar explícitamente cómo se superaron las trabas técnicas (ejemplo: migración a Neon y arreglo del QR).
4. **Dominio en la defensa oral (Indicador 8 — 10% del total):**
   Cualquier titubeo al explicar la base de datos o la arquitectura disminuye la calificación de 'destacado' a 'parcial'.

### Plan Maestro para Obtener 6.5 a 7.0 en el Siguiente Avance (Fase 3):
1. **Blindaje de Git:** Que cada integrante del equipo suba commits desde su propio usuario de GitHub usando ramas separadas.
2. **Dominio del Glosario y Preguntas:** Repasar las 20 preguntas del Módulo 5 y las definiciones de Bases de Datos del Módulo 2 para responder sin dudar.
3. **Demostración en Vivo de la Base de Datos:** Durante la presentación, proyectar la consola de Neon Tech o Prisma Studio y mostrar cómo una reserva cambia de estado en tiempo real.
4. **Matriz de Pruebas ISO/IEC 25010:** Incluir en el informe la tabla de pruebas funcionales con resultado 100% aprobado.

