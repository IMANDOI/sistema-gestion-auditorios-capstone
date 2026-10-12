# GUÍA PERSONAL DE ESTUDIO Y DOMINIO DEL SISTEMA (FASE 1 Y FASE 2)
## Proyecto Capstone (APT122 / PTY4614) — Escuela de Informática y Telecomunicaciones — Duoc UC
### Preparación Integral para la Defensa Técnica ante la Comisión Evaluadora (Meta: Calificación 7.0)

**Estudiante:** Benjamín Navarrete  
**Rol en el Proyecto:** Super Administrador / Desarrollador Principal  
**Correo Personal / Super Admin:** `benjamin54144752123@gmail.com`  
**Profesor Guía:** Diego Garcés M.  
**Fecha:** Octubre 2026  

---

## 1. LA HISTORIA Y EL PROBLEMA REAL DETRÁS DEL PROYECTO

Para defender este proyecto con seguridad y convicción frente a tu profesor, no debes empezar hablando de líneas de código o librerías, sino del **dolor y la ineficiencia real que resuelve en la institución**:

1. **Caos logístico y solapamientos de agenda:**  
   Históricamente, los auditorios y aulas magnas se gestionaban con planillas Excel compartidas en la red institucional, cadenas infinitas de correos y llamados telefónicos de última hora. Esto provocaba duplicidad de reservas, docentes que llegaban con sus alumnos y encontraban la sala ocupada, y suspensiones sin aviso previo.
2. **Pérdida masiva de horas de soporte TI (Espera Pasiva):**  
   El técnico de soporte audiovisual debía concurrir 45 a 60 minutos antes a abrir el recinto, encender equipos y esperar al docente, sin saber si la clase realmente se realizaría. Si el docente no se presentaba (*No-Show*), ese tiempo técnico se perdía de forma irrecuperable.
3. **Desconexión con cuadrillas de apoyo (Aseo y Guardia):**  
   Los guardias de seguridad no sabían a qué hora exacta abrir o cerrar los accesos perimetrales, y el personal de aseo no sabía si la sala requería limpieza profunda inmediata tras un evento masivo.
4. **Cero trazabilidad del estado del hardware e implementos:**  
   Cuando un micrófono inalámbrico fallaba o el proyector láser sufría sobrecalentamiento, no existía un registro de cuánto tiempo estuvo fuera de servicio (*downtime*), quién realizó el diagnóstico técnico ni cuál fue la constancia técnica de solución aplicada antes de volver a prestarlo.

### La Solución de Ingeniería Desarrollada:
Un sistema web autónomo, reactivo, accesible (**WCAG 2.1 AA**) y concebido bajo el paradigma **Mobile-First**. Cada reserva aprobada genera un **Pase QR criptográfico único**. El técnico de soporte TI valida al docente en la puerta del recinto en **menos de 30 segundos**, el servidor computa matemáticamente las **horas de soporte dedicadas ($\Delta T$)**, se alerta automáticamente a las cuadrillas suscritas (Aseo, Guardia, TI) y un **Dashboard de Salud Operacional con gráficos interactivos** supervisa la disponibilidad y el tiempo medio de reparación (**MTTR**) de los implementos técnicos.

---

## 2. DIFERENCIA CLARA: ¿QUÉ SE HIZO EN FASE 1 VS. QUÉ SE HIZO EN FASE 2?

| Dimensión de Ingeniería | FASE 1: Definición y Arquitectura (Semanas 1 a 4) | FASE 2: Construcción y Prototipo Funcional (Semanas 5 a 12) |
| :--- | :--- | :--- |
| **Enfoque Principal** | Diseño conceptual, levantamiento de requerimientos y análisis de factibilidad. | Programación completa del código fuente, persistencia de datos y prototipo funcional operativo en local. |
| **Requerimientos y Calidad** | Catálogo formal de 25 Requerimientos Funcionales (RF-01 a RF-25), 10 de Seguridad (RS-01 a RS-10) y Plan de Pruebas ISO/IEC 25010. | Implementación 100% operativa de los requerimientos en TypeScript, Next.js Server Actions y Prisma ORM. |
| **Arquitectura y Modelo** | Diagramas conceptuales de arquitectura y bosquejo de tablas relacionales. | Esquema Prisma de 10 modelos relacionales en SQLite (`dev.db`), compatible con Neon Cloud PostgreSQL. |
| **Interfaces de Usuario** | Mockups en Figma/Canva y definición de perfiles. | 5 Portales web operativos en Tailwind CSS: `/login`, `/docente`, `/tecnico`, `/encargado` y `/admin`. |
| **Ciberseguridad y Auditoría** | Definición teórica de políticas de acceso y hasheo. | Seguridad embebida en el backend (bcrypt salt 10, cookies HttpOnly, Zod) y Bitácora Forense inmutable (`RegistroAuditoria`). |
| **Módulos Avanzados** | Idea preliminar de lectura QR y soporte TI. | Validación QR < 30s, cómputo de horas TI ($\Delta T$), reprogramación con confirmación de seguridad obligatoria, cuadrillas y Dashboard de Salud con gráficos. |
| **Estado de Compilación** | N/A (documentación). | **Build de Producción (`next build`) exitoso al 100% con 0 errores y rutas prerenderizadas estáticamente.** |

---

## 3. RECORRIDO PANTALLA POR PANTALLA Y BOTÓN POR BOTÓN

### A. Portal de Acceso Unificado (`/login` y `/`)
* **Selector Rápido de Perfiles Demo:** En la parte superior existen 4 botones con 1-click para alternar instantáneamente entre los roles (Docente, Técnico TI, Encargado de Recintos y Super Administrador). Esto fue diseñado estratégicamente para que la comisión evaluadora no pierda tiempo escribiendo credenciales.
* **Credenciales Visibles:** Si se desea ingresar manualmente, los datos están impresos en pantalla:
  * Super Administrador: `benjamin54144752123@gmail.com` / `Capstone2026!`
  * Encargada Recintos: `coordinacion@institucion.cl` / `Capstone2026!`
  * Soporte TI Terreno: `soporte.ti@institucion.cl` / `Capstone2026!`
  * Docente Solicitante: `patricia.gonzalez@institucion.cl` / `Capstone2026!`
* **Accesibilidad Universal (WCAG 2.1 AA):** Paleta luminosa de alto contraste en fondos blancos y slate, con textos en azul oscuro y negro (relación de contraste $> 4.5:1$).

### B. Portal del Docente (`/docente`)
* **Asistente de Nueva Reserva:** Permite ingresar el título de la actividad, seleccionar fecha/hora y número de asistentes. El sistema valida automáticamente que el aforo no supere la capacidad del recinto (150 personas).
* **Catálogo de Equipamiento:** Permite seleccionar micrófonos inalámbricos Shure, proyector láser 4K, notebooks o consolas. Si un implemento está en taller o mantenimiento, el sistema impide su selección para evitar reclamos en sala.
* **Botón `Ver Mi Pase QR`:** Despliega una tarjeta interactiva con el código QR y el token único alfanumérico (ej: `qr-sem-ciberseguridad-uuid-001`). Es el pase que el profesor muestra en su teléfono al llegar al auditorio.
* **Encuesta Post-Evento:** Tras finalizar el evento, el docente califica de 1 a 5 estrellas la calidad del auditorio, el equipamiento y la atención técnica, calculando automáticamente el NPS institucional.

### C. Portal Móvil del Técnico de Soporte en Terreno (`/tecnico`)
* **Diseño Smartphone-First:** Botones de acción táctiles de más de 52px de altura, pensados para ser operados con una sola mano en movimiento.
* **Botón `Validar Check-in QR (< 30s)`:** El técnico valida el pase del docente en la puerta en menos de 30 segundos. El sistema estampa la hora exacta de llegada e inicia el evento en estado `CHECKED_IN`.
* **Botón `Completar Check-out y Retorno Equipos`:** Al concluir la actividad, el técnico verifica el retorno del hardware y pulsa este botón. El servidor calcula automáticamente la diferencia temporal:
  $$\Delta T = T_{\text{checkout}} - T_{\text{checkin}}$$
  computando las horas decimales de soporte dedicadas (ej. 1.5 horas TI) y liberando el inventario.

### D. Portal del Encargado de Recintos (`/encargado`)
* **Bandeja de Entrada de Solicitudes:** Muestra las reservas en estado `PENDING`, ordenadas por el score de prioridad académica.
* **Botón `Aprobar Reserva`:** Autoriza el uso del recinto con un click, emite el token criptográfico QR y notifica la confirmación.
* **Botón `Rechazar Reserva`:** Despliega un modal que exige redactar de forma obligatoria el motivo formal de rechazo técnico para transparencia del proceso.

### E. Portal de Administración General (`/admin`)
Cuenta con 5 pestañas completas y de alta ingeniería:
1. **Pestaña `Agenda y Reservas` (con Reprogramación Segura):**
   * Listado de eventos con buscador en tiempo real y filtros de estado.
   * **Botón `Modificar Horario / Datos`:** Permite cambiar título, horarios y aforo.
   * **Casilla de Seguridad Obligatoria:** Advertencia en tono ámbar sobre el impacto en cuadrillas y checkbox interactivo: *"Sí, confirmo bajo mi rol de Administrador que estoy seguro de realizar este cambio de horario."* El botón de guardado permanece inhabilitado hasta marcar la casilla, y la acción queda firmada en la auditoría como `HORARIO_MODIFICADO_ADMIN`.
2. **Pestaña `Salud y Mantenimiento` (Novedades y Gráficos):**
   * Card superior del Auditorio Magna Principal con badge de estado y botón `Cambiar Estado Auditorio` para pausar la agenda por remodelación o sanitización.
   * 4 KPIs de Mantenimiento: Operatividad de Equipos (%), Casos en Taller, Downtime Total Acumulado (horas) y MTTR Promedio (Mean Time to Repair).
   * Gráficos Analíticos: Gráfico de barras multi-segmento por categoría de implemento (Audio, Proyección, Cómputo, HVAC) y gráfico radial por tipo de intervención técnica.
   * Botón `Registrar Novedad / Mantención`: Permite enviar a taller implementos con diagnóstico técnico y severidad.
   * Botón `Resolver y Restaurar a Disponible`: Exige redactar una constancia técnica de la reparación antes de reactivar el hardware.
3. **Pestaña `Inventario Técnico`:** Catálogo de hardware con stock total y disponible, y botón rápido para alternar disponibilidad.
4. **Pestaña `Funcionarios y Cuadrillas`:** Módulo CRUD para agregar, editar y eliminar correos de personal de Aseo, Guardia, TI y Coordinación.
5. **Pestaña `Bitácora de Auditoría`:** Registro cronológico inmutable de todas las acciones del sistema con fecha, operador responsable, IP y detalle.

---

## 4. LA ARQUITECTURA TÉCNICA EXPLICADA EN PALABRAS SENCILLAS

* **Next.js 15 y App Router:** Toda la lógica pesada y las consultas a la base de datos se ejecutan en el servidor de forma segura mediante Server Actions, sin exponer endpoints REST que un atacante pueda interceptar.
* **Prisma ORM:** Actúa como intermediario tipado en TypeScript. Transforma nuestras consultas en sentencias SQL parametrizadas, lo que hace matemáticamente imposible una inyección SQL.
* **Modelo de Datos de 10 Tablas:** Relaciona usuarios, auditorios, reservas, implementos prestados, horas de soporte TI, encuestas NPS, cuadrillas de correo, registros de auditoría y novedades de mantenimiento.
* **Compatibilidad Dual de Base de Datos:** Opera sobre SQLite local (`dev.db`) para pruebas autónomas sin internet, y está 100% preparado para conectarse a PostgreSQL en Neon Cloud simplemente cambiando el string `DATABASE_URL`.
* **Ciberseguridad Defensiva Embebida:** Contraseñas hasheadas con bcryptjs (factor 10), protección CSRF nativa, validación Zod y auditoría forense inmutable (`RegistroAuditoria`).

---

## 5. SIMULADOR DE DEFENSA: 10 PREGUNTAS CLAVE DE LA COMISIÓN Y CÓMO RESPONDERLAS

### Pregunta 1: ¿Por qué decidieron separar el sistema en portales por rol en lugar de tenerlo todo en una sola pantalla?
> *"Profesor, separamos las interfaces por el principio de Menor Privilegio (PoLP) y por Usabilidad de Contexto (WCAG 2.1 AA). Un docente solo necesita agendar y ver su código QR; un técnico en terreno opera desde un smartphone con una sola mano y requiere botones táctiles grandes de más de 52 píxeles para validar en menos de 30 segundos; mientras que el administrador requiere un centro de comando con analítica de KPIs y control de auditoría. Si juntábamos todo en una sola vista, generábamos sobrecarga cognitiva y abríamos brechas de seguridad."*

### Pregunta 2: ¿Cómo calculan exactamente las horas de soporte dedicadas por el personal de TI?
> *"Mediante la fórmula matemática Delta T = T_checkout - T_checkin. Cuando el técnico valida el pase QR en la puerta, se estampa la marca de tiempo exacta de inicio. Cuando el evento termina y se revisa el retorno del equipamiento, se estampa el check-out. El servidor calcula la duración en minutos y la convierte a horas decimales en la tabla RegistroHorasTI. Esto permite a la dirección saber exactamente cuántas horas de trabajo en terreno se dedicaron y cuántas horas pasivas se ahorraron."*

### Pregunta 3: ¿Qué pasa si un administrador quiere cambiar el horario de un evento que ya estaba confirmado?
> *"Ese fue un punto crítico que abordamos tras la retroalimentación. Cambiar un horario altera la agenda de los docentes y descoordina a las cuadrillas de aseo y guardias. Por eso implementamos un mecanismo de doble confirmación obligatoria: el modal despliega una advertencia en tono ámbar y un checkbox interactivo de seguridad. El botón de guardado permanece completamente inhabilitado hasta que el administrador marca la confirmación, y el cambio se valida contra colisiones y queda firmado en la bitácora inmutable como HORARIO_MODIFICADO_ADMIN."*

### Pregunta 4: ¿Cómo gestionan las notificaciones para las áreas de Aseo, Guardia y Coordinación?
> *"Creamos la tabla SuscripcionArea y el componente CuadrillaManager en el panel de administración. El administrador puede agregar, editar o desactivar correos electrónicos clasificados por departamento (Aseo, Guardia, TI, Coordinación). Cuando una reserva se aprueba, se reprograma o se cierra, el sistema despacha las alertas automáticamente a la lista suscrita para coordinar la limpieza o la apertura de puertas."*

### Pregunta 5: ¿Qué métricas aporta el Dashboard de Salud y Mantenimiento?
> *"Aporta cuatro indicadores esenciales: la Tasa de Operatividad de Equipos en porcentaje, los Casos Activos en Taller, las Horas de Downtime Acumuladas y el MTTR o Mean Time to Repair, que mide el tiempo medio que tarda el equipo técnico en devolver un hardware inoperativo a servicio activo. Además, incluye gráficos interactivos de barras por categoría de implemento y gráficos radiales por tipo de intervención técnica."*

### Pregunta 6: ¿Por qué eliminaron la pantalla de ciberseguridad o SOC que se había mencionado al principio?
> *"Por un principio fundamental de ingeniería de software: la ciberseguridad no debe ser una pantalla cosmética con gráficos falsos, sino un blindaje defensivo transversal en el core de la aplicación. Por eso, implementamos contraseñas hasheadas con bcrypt factor 10, Server Actions con protección CSRF nativa, sanitización estricta de entradas con TypeScript y Zod, y una Bitácora Forense inmutable en la base de datos (RegistroAuditoria) que registra cada transacción con IP y operador."*

### Pregunta 7: ¿Qué base de datos están usando y cómo garantizan que no colapse con múltiples reservas?
> *"Actualmente el desarrollo y las pruebas operan sobre SQLite relacional para garantizar autonomía local sin depender de conexión a internet. Sin embargo, todo el esquema está modelado en Prisma ORM con 10 entidades completamente compatibles con PostgreSQL en Neon Cloud. Para evitar colisiones, la acción createReservationAction ejecuta una validación de traslape matemático [inicio, fin] dentro de una transacción ACID, rechazando automáticamente cualquier solicitud que choque con un evento aprobado."*

### Pregunta 8: ¿Cómo se asegura que las personas mayores o con baja visión puedan usar el sistema?
> *"Aplicamos los estándares de accesibilidad WCAG 2.1 nivel AA. Eliminamos fondos oscuros fatigantes y adoptamos una paleta luminosa de alto contraste en fondos blancos y slate, con textos en azul oscuro y negro (relación de contraste superior a 4.5:1). Además, todas las etiquetas de formulario tienen labels explícitos, los botones cuentan con estados de foco visibles y la tipografía está optimizada para legibilidad a gran distancia."*

### Pregunta 9: ¿Qué ocurre si un docente solicita el auditorio y no asiste (No-Show)?
> *"Si la hora de inicio de la reserva expira y han pasado más de 30 minutos sin que el técnico haya registrado el Check-in QR, el sistema marca el evento en estado NO_SHOW. Esto aplica una penalización automática sobre el priorityScore del docente en la base de datos, lo que hace que sus solicitudes futuras pierdan prioridad frente a docentes que sí cumplen con su asistencia."*

### Pregunta 10: ¿Cuál es el plan de trabajo para la Fase 3?
> *"En la Fase 3 ejecutaremos la migración productiva conectando el repositorio de GitHub con Vercel para CI/CD automático, apuntando la variable DATABASE_URL al cluster de PostgreSQL en Neon Cloud. Realizaremos pruebas de carga con k6, auditoría de vulnerabilidades con OWASP ZAP y prepararemos la demostración final en vivo con dos dispositivos sincronizados para la defensa de título."*
