# GUION DE PRESENTACIÓN EJECUTIVA Y DEFENSA ORAL (20 MINUTOS)
## Simulación de Presentación a Gerencia de Proyecto / Comisión Evaluadora
### Asignatura Capstone (PTY4614 / APT122) — Evaluación Final Fase 2 (30%)
**Proyecto:** Sistema Autónomo de Gestión Operativa, Trazabilidad, Analítica y Ciberseguridad para Auditorios  
**Expositor / Estudiante Desarrollador:** Benjamín Navarrete (`benjamin54144752123@gmail.com`)  
**Profesor Guía:** Diego Garcés M.  
**Fecha de Presentación:** Martes 24 de Noviembre de 2026, 14:30 hrs  
**Duración Total:** 20 minutos (15 minutos de exposición + 5 minutos de defensa y preguntas de la comisión)

---

## 1. Cronograma y Distribución Estratégica del Tiempo (20 Minutos)

| Bloque Temporal | Diapositiva / Sección | Objetivo de la Exposición | Tono y Postura |
| :---: | :---: | :--- | :--- |
| **00:00 - 03:00**<br>(3 min) | **1. Apertura, Contexto y Diagnóstico del Problema** | Presentar el problema del Auditorio Magna de Duoc UC, la pérdida de 25 minutos en accesos y la ausencia de telemetría de horas TI. | Formal, analítico, enfocado en impacto de negocio y académico. |
| **03:00 - 06:30**<br>(3.5 min) | **2. Arquitectura de Solución y Modelo de Datos (3FN)** | Explicar la arquitectura Cloud Serverless (Next.js 15, Prisma 6, PostgreSQL en Neon) y el blindaje anti-solapamiento. | Técnico disciplinar riguroso; justificación de decisiones. |
| **06:30 - 11:30**<br>(5 min) | **3. Demostración en Vivo (Live Demo) de Capacidades Clave** | • Emisión de pase QR al docente.<br>• Escaneo óptico en terreno en < 30s con feedback háptico/sonoro.<br>• Bot RPA de No-Show y cómputo matemático Delta-T. | Seguro, dinámico, respaldado por la plataforma en producción. |
| **11:30 - 14:30**<br>(3 min) | **4. Certificación de Calidad ISO/IEC 25010 y Ciberseguridad** | Mostrar la suite automatizada (8/8 tests pass en 364ms), GitHub Actions CI verde, blindaje OWASP y bitácora forense Append-Only. | Riguroso, apoyado en métricas cuantitativas y normas internacionales. |
| **14:30 - 16:30**<br>(2 min) | **5. Intereses Profesionales, Competencias y Conclusiones** | Conectar el proyecto con el perfil de egreso (4 competencias), desarrollo vocacional e individual conclusions en inglés. | Reflexivo, profesional, demostrando madurez de egresado de ingeniería. |
| **16:30 - 20:00**<br>(3.5 min) | **6. Ronda de Preguntas y Respuestas de la Comisión** | Responder consultas técnicas con solvencia, citando los 10 modelos relacionales y el plan de contingencias IRP. | Sereno, preciso, técnico y receptivo. |

---

## 2. Guion Verbal Paso a Paso (Libreto Literal para la Exposición)

### Bloque 1: Apertura, Contexto y Diagnóstico (00:00 - 03:00)
> *"Muy buenas tardes, distinguidos miembros de la comisión evaluadora y profesor guía Diego Garcés. Mi nombre es Benjamín Navarrete y hoy tengo el agrado de presentar ante ustedes el cierre de ingeniería de nuestro Proyecto Capstone:*
>
> ***'Sistema Autónomo de Gestión Operativa, Trazabilidad, Analítica y Ciberseguridad para Auditorios'.***
>
> *Para entender el valor de esta solución, debemos situarnos en el Auditorio Magna Principal de nuestra institución: un recinto de alto costo y uso estratégico con capacidad para 150 personas y equipamiento audiovisual de última generación. Históricamente, la administración de este espacio dependía de planillas manuales y llaves físicas, generando tres dolores críticos:*
> 1. *Colisiones de horario y dobles reservas que obligaban a suspender clases magistrales sobre la marcha.*
> 2. *Tiempos muertos de 15 a 25 minutos para validar el acceso del docente e inventariar micrófonos y proyectores.*
> 3. *Cero telemetría sobre el tiempo real que el personal de soporte TI dedica presencialmente a cada evento.*
>
> *Nuestra misión de ingeniería fue transformar este proceso artesanal en un ecosistema digital gobernado por reglas determinísticas, eliminando el 100% de los traslapes y reduciendo el ingreso a menos de 30 segundos."*

---

### Bloque 2: Arquitectura y Modelo de Datos Relacional (03:00 - 06:30)
> *"Para garantizar que la solución fuera escalable y cibersegura, optamos por una arquitectura moderna Cloud-Native basada en cuatro pilares:*
>
> *Primero, en el frontend y capa de servicios, utilizamos **Next.js 15 con React 19 y Server Actions**. Esto significa que no exponemos endpoints REST abiertos al internet; la comunicación se realiza mediante procedimientos remotos fuertemente tipados con TypeScript y validados estrictamente con esquemas Zod.*
>
> *Segundo, la persistencia se apoya en **Prisma 6 ORM y una base de datos relacional PostgreSQL desplegada en Neon Cloud**. Diseñamos un esquema en **Tercera Forma Normal (3NF) con 10 entidades**. En el corazón de esta base de datos reside un algoritmo determinístico de exclusión mutua temporal dentro de una transacción ACID: si un usuario intenta reservar en un bloque que intersecte una reserva aprobada existente bajo la regla `(inicioA < finB) AND (finA > inicioB)`, el motor rechaza atómicamente la solicitud, garantizando matemáticamente cero colisiones.*
>
> *Tercero, en ciberseguridad, implementamos control de acceso basado en roles (RBAC) para 5 perfiles, contraseñas hasheadas con `bcrypt` a 10 rondas de salteo y una bitácora forense de auditoría inmutable bajo el patrón Append-Only, impidiendo cualquier borrado o modificación de registros históricos."*

---

### Bloque 3: Demostración en Vivo y Validación QR Móvil (06:30 - 11:30)
> *(Demostración proyectando la plataforma en producción: `https://sistema-gestion-auditorios-capstone.vercel.app`)*
>
> *"A continuación, observamos el flujo en tiempo real:*
> 1. *Como **Docente**, solicito el auditorio para una clase magistral y elijo hardware en el pañol. La encargada dictamina la reserva y el sistema genera automáticamente un **Pase QR criptográfico bajo norma ISO/IEC 18004** con nivel de corrección H del 30% y zona de silencio de 4 módulos.*
> 2. *Ahora, asumamos el rol de **Técnico de Terreno** desde el dispositivo móvil. Al abrir la pestaña de Check-in, activamos el escáner óptico. Aquí implementamos una innovación de ingeniería crítica: en lugar de un canvas DOM que los motores móviles WebKit vacían en memoria, diseñamos un motor de escaneo multi-nivel en canvas virtual fuera del DOM.*
> 3. *El motor aplica un sub-muestreo inteligente a 420 píxeles, logrando decodificar el fotograma en tan solo **12 milisegundos**. Observen cómo, al apuntar la cámara, se activa un visor reticular con líneas de enfoque esmeralda, suena un pitido armónico vía Web Audio API y el teléfono vibra físicamente, confirmando el Check-in en menos de 2 segundos.*
> 4. *Inmediatamente, el sistema marca el hardware como entregado, inicia el cronómetro de soporte en marcha y activa los **agentes de automatización RPA**: si un docente no se presenta tras 15 minutos, el bot penaliza el puntaje cívico y libera el auditorio para la comunidad.*
> 5. *Al concluir el evento, el técnico presiona 'Cerrar Check-out' y el sistema calcula de forma exacta el **Delta-T en minutos y horas decimales**, enviando automáticamente la encuesta de satisfacción NPS al docente."*

---

### Bloque 4: Certificación de Calidad ISO 25010 y CI/CD (11:30 - 14:30)
> *"Un software de grado industrial no solo debe funcionar; debe estar formalmente certificado. Siguiendo las directrices de la asignatura y la rúbrica oficial, construimos una batería de pruebas automatizadas bajo el estándar internacional **ISO/IEC 25010**:*
>
> *Nuestra suite evalúa 4 características esenciales:*
> * *Adecuación Funcional: comprobando el rechazo de solapamientos y la precisión matemática del cómputo Delta-T.*
> * *Fiabilidad: verificando que implementos en mantención no se reactiven sin constancia técnica de taller.*
> * *Seguridad y Protección: certificando la irreversibilidad del hash bcrypt y el bloqueo de inyecciones maliciosas mediante Zod.*
> * *Rendimiento: logrando ejecutar las 8 pruebas en 364 milisegundos.*
>
> *Estas pruebas no son manuales: están integradas a un flujo de **Integración Continua en GitHub Actions**. En cada `push` a la rama `main`, el servidor de integración levanta un contenedor Ubuntu, compila TypeScript con 0 errores y corre los tests. Como pueden constatar en nuestro repositorio oficial, el flujo reporta estado 100% verde (SUCCESS)."*

---

### Bloque 5: Intereses Profesionales, Competencias y Conclusiones (14:30 - 16:30)
> *"Para cerrar nuestra exposición, quiero reflexionar sobre el impacto vocacional de este trabajo:*
>
> *Este proyecto consolidó de forma decisiva mis intereses profesionales hacia la **Arquitectura Cloud Serverless**, la **Ciberseguridad Defensiva** y la **Automatización RPA**. Me demostró que la ingeniería consiste en diseñar soluciones tolerantes a fallos con valor humano y operativo real.*
>
> *Asimismo, evidenciamos las **cuatro competencias del perfil de egreso de Duoc UC**: certificación de calidad bajo normas de la industria, gestión de proyectos y riesgos mediante el plan IRP, construcción de modelos de datos escalables en 3FN y desarrollo sistemático de software con integración continua.*
>
> *En cumplimiento con las directrices académicas, compartiré una conclusión ejecutiva en idioma inglés:*
>
> *'To conclude: This Capstone project proves that enterprise cloud technologies, paired with rigorous quality standards such as ISO/IEC 25010 and strict architectural contracts, can solve critical operational challenges in higher education. Slashing room validation time from 25 minutes to under 30 seconds and eliminating schedule collisions is not just a software feat—it is a tangible enhancement to institutional productivity.'*
>
> *Muchas gracias por su atención. Quedo a su entera disposición para responder las preguntas de la comisión."*

---

## 3. Matriz de Preguntas de Defensa Técnica y Respuestas Estratégicas (16:30 - 20:00)

### Pregunta 1: *"¿Por qué decidieron utilizar Server Actions de Next.js en lugar de una API REST tradicional?"*
* **Respuesta del Estudiante:**
  > *"Excelente pregunta. Optamos por Server Actions por tres razones de ingeniería:*
  > 1. ***Superficie de Ataque Reducida:*** *Al no exponer endpoints HTTP públicos como `/api/v1/reservas`, eliminamos vectores de ataque por fuerza bruta, scraping o explotación de rutas desprotegidas.*
  > 2. ***Tipado de Datos de Extremo a Extremo (End-to-End Type Safety):*** *El cliente y el servidor comparten los mismos tipos TypeScript y validadores Zod, detectando cualquier error en tiempo de compilación y no en ejecución.*
  > 3. ***Rendimiento Serverless:*** *Server Actions ejecutan de manera nativa en el Edge/Serverless de Vercel con empaquetado optimizado, reduciendo la latencia de red y el consumo de ancho de banda en dispositivos móviles."*

### Pregunta 2: *"¿Cómo garantizan que dos usuarios no reserven el auditorio en el mismo milisegundo?"*
* **Respuesta del Estudiante:**
  > *"Garantizamos la exclusión mutua mediante dos capas:*
  > * *En la capa de aplicación, la función `createReservationAction` ejecuta una verificación booleana atómica sobre la tabla `Reserva` evaluando si existe alguna reserva `APPROVED` o `CHECKED_IN` donde `(startTime < nuevoFin) AND (endTime > nuevoInicio)`.*
  > * *En la base de datos PostgreSQL, la consulta corre dentro del nivel de aislamiento transaccional provisto por Prisma ORM. Si se detecta solapamiento, la transacción aborta inmediatamente con un Rollback y retorna un mensaje de conflicto detallando qué evento ya ocupa el bloque."*

### Pregunta 3: *"¿Qué problema específico enfrentaron con el escáner QR en los celulares y cómo lo resolvieron?"*
* **Respuesta del Estudiante:**
  > *"En pruebas iniciales en terreno, detectamos que en navegadores móviles (iOS Safari y Android Chrome), el elemento `<canvas>` con clase `hidden` sufría vaciado de memoria por parte del compositor gráfico de la GPU para ahorrar RAM, entregando píxeles en cero (imagen negra) a la librería de escaneo. Además, procesar imágenes en alta definición (1080p) congelaba el hilo de ejecución por más de 500 ms.*
  >
  > *Lo resolvimos eliminando el canvas del DOM y creando un canvas virtual en memoria (`document.createElement`). Aplicamos un sub-muestreo inteligente a 420 píxeles, reduciendo el tiempo de análisis de 400 ms a solo 12 milisegundos, e incorporamos un visor reticular con feedback háptico (vibración) y sonoro (Web Audio API), logrando un escaneo ultra-rápido en menos de 2 segundos."*

### Pregunta 4: *"¿Cómo se protegen los registros de auditoría de un administrador malintencionado?"*
* **Respuesta del Estudiante:**
  > *"Implementamos el modelo `RegistroAuditoria` bajo el patrón arquitectónico Append-Only. En el código del backend no existe ningún método `update` ni `delete` para esta entidad; la base de datos solo permite operaciones `create`. Además, cada registro almacena el identificador criptográfico del usuario, su rol, la dirección IP de origen, la acción realizada y la marca de tiempo inmutable. En producción sobre PostgreSQL, el usuario de base de datos posee permisos restringidos que impiden la alteración de la tabla forense."*

