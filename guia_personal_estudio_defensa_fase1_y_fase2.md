# GUÍA PERSONAL DE ESTUDIO Y DOMINIO DEL SISTEMA (FASE 1 Y FASE 2)
## Proyecto Capstone (APT122 / PTY4614) — Escuela de Informática y Telecomunicaciones — Duoc UC
### Preparación Integral para la Defensa Técnica ante la Comisión Evaluadora (Meta: Calificación 7.0)

**Estudiante:** Benjamín Navarrete  
**Rol en el Proyecto:** Super Administrador / Desarrollador Principal  
**Correo Personal / Super Admin:** `benjamin54144752123@gmail.com`  
**Profesor Guía:** Diego Garcés M.  
**Fecha:** Octubre 2026  
**Repositorio GitHub:** `https://github.com/IMANDOI/sistema-gestion-auditorios-capstone`  
**Despliegue en Producción Vercel:** `https://sistema-gestion-auditorios-capstone.vercel.app`  

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
Un sistema web autónomo, reactivo, accesible (**WCAG 2.1 AA**) y concebido bajo el paradigma **Mobile-First**. Cada reserva aprobada genera un **Pase QR criptográfico 2D real scannable**. El técnico de soporte TI valida al docente en la puerta del recinto mediante cámara en **menos de 30 segundos**, el servidor computa matemáticamente las **horas de soporte dedicadas (Delta T)**, se alerta automáticamente a las cuadrillas suscritas (Aseo, Guardia, TI), 4 bots de automatización (**RPA**) velan por la auto-reparación y salud del sistema, y un **Dashboard de Salud Operacional con gráficos interactivos y Plan de Respuesta a Incidentes (IRP)** supervisa la disponibilidad y el tiempo medio de reparación (**MTTR**) de los implementos técnicos.

---

## 2. DIFERENCIA CLARA: ¿QUÉ SE HIZO EN FASE 1 VS. QUÉ SE HIZO EN FASE 2?

| Dimensión de Ingeniería | FASE 1: Definición y Arquitectura (Semanas 1 a 4) | FASE 2: Construcción y Prototipo Funcional (Semanas 5 a 12) |
| :--- | :--- | :--- |
| **Enfoque Principal** | Diseño conceptual, levantamiento de requerimientos y análisis de factibilidad. | Programación completa del código fuente, persistencia de datos y prototipo funcional operativo en local y en la nube. |
| **Requerimientos y Calidad** | Catálogo formal de 25 Requerimientos Funcionales (RF-01 a RF-25), 10 de Seguridad (RS-01 a RS-10) y Plan de Pruebas ISO/IEC 25010. | Implementación 100% operativa de los requerimientos en TypeScript, Next.js Server Actions y Prisma ORM. |
| **Arquitectura y Modelo** | Diagramas conceptuales de arquitectura y bosquejo de tablas relacionales. | Esquema Prisma de 10 modelos relacionales en SQLite (`dev.db`), compatible con Neon Cloud PostgreSQL. |
| **Interfaces de Usuario** | Mockups en Figma/Canva y definición de perfiles. | 5 Portales web operativos en Tailwind CSS: `/login`, `/docente`, `/tecnico`, `/encargado` y `/admin`. |
| **Ciberseguridad y Auditoría** | Definición teórica de políticas de acceso y hasheo. | Seguridad embebida en el backend (bcrypt salt 10, cookies HttpOnly, Zod) y Bitácora Forense inmutable con registro por usuario. |
| **Módulos Avanzados** | Idea preliminar de lectura QR y soporte TI. | QR 2D real + escáner por cámara con auto-cierre, cómputo horas TI, reprogramación segura, cuadrillas, Gestor de Cuentas RBAC con doble verificación, 4 Bots RPA, Dashboard de Salud con gráficos y Plan de Respuesta a Incidentes (IRP). |
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
* **Botón `Ver Mi Pase QR` (Matriz 2D Real):** Despliega una tarjeta interactiva con un código QR 2D real generado dinámicamente con librería estándar `qrcode` (nivel de corrección de error M), botón de descarga en formato PNG y botón para copiar el token criptográfico alfanumérico.
* **Encuesta Post-Evento:** Tras finalizar el evento, el docente califica de 1 a 5 estrellas la calidad del auditorio, el equipamiento y la atención técnica, calculando automáticamente el NPS institucional.

### C. Portal Móvil del Técnico de Soporte en Terreno (`/tecnico`)
* **Diseño Smartphone-First:** Botones de acción táctiles de más de 52px de altura, pensados para ser operados con una sola mano en movimiento.
* **Pestaña `Check-in` con Escáner de Cámara Inteligente:**
  * Al pulsar `Activar Escáner Cámara`, se abre la videocámara web/móvil con hardware acelerado (`BarcodeDetector` nativo o `jsQR` optimizado).
  * Incluye recuadro verde de seguimiento en tiempo real sobre el código detectado.
  * **Cierre automático de la cámara:** Apenas detecta el código QR del pase docente, la cámara se apaga de inmediato a nivel de hardware (`track.stop()`) para no agotar la batería ni mantener la webcam encendida.
  * Checklist interactivo de entrega de equipamiento: permite marcar cada micrófono, notebook o proyector como entregado en sala antes de validar el ingreso.
* **Pestaña `Check-out` con Cómputo Automático de Horas TI:**
  * Checklist interactivo de retorno: verifica que los implementos vuelvan en perfecto estado.
  * Al pulsar `Completar Check-out y Retorno Equipos`, el servidor estampa la hora y calcula automáticamente la fórmula matemática:
    $$\Delta T = T_{	ext{checkout}} - T_{	ext{checkin}}$$
    computando las horas decimales de soporte dedicadas (ej. 1.5 horas TI) y liberando el inventario.
* **Pestaña `Equipamiento` con Reporte de Incidentes Técnicos en Sala:**
  * Muestra el inventario audiovisual en tiempo real con alternancia rápida de operatividad.
  * Botón `Reportar Incidencia`: despliega un modal técnico para notificar fallas directas (ej: corte de HDMI, sobrecalentamiento de lámpara), cambiando el estado a taller y notificando a la administración.

### D. Portal del Encargado de Recintos (`/encargado`)
* **Bandeja de Entrada de Solicitudes:** Muestra las reservas en estado `PENDING`, ordenadas por el score de prioridad académica.
* **Botón `Aprobar Reserva`:** Autoriza el uso del recinto con un click, emite el token criptográfico QR y notifica la confirmación.
* **Botón `Rechazar Reserva`:** Despliega un modal que exige redactar de forma obligatoria el motivo formal de rechazo técnico para transparencia del proceso.

### E. Portal de Administración General (`/admin`)
Cuenta con 6 módulos completos de alta ingeniería:
1. **Pestaña `Agenda y Reservas` (con Reprogramación Segura):**
   * Listado de eventos con buscador en tiempo real y filtros de estado.
   * Botón `Modificar Horario / Datos` con **Casilla de Seguridad Obligatoria**: advertencia ámbar y confirmación obligatoria para evitar desajustes en cuadrillas.
2. **Pestaña `Gestión de Cuentas` (RBAC con Doble Verificación):**
   * Creación de nuevas cuentas de usuario (Docentes, Técnicos, Encargadas, Administradores).
   * Asignación y revocación de permisos de "Gestor de Cuentas" mediante modal de confirmación crítica de doble verificación.
   * Eliminación segura de cuentas con modal de confirmación destructiva.
   * **Bitácora Forense Individual por Usuario:** botón para ver el historial exacto de cambios, fechas, horas, operador responsable e IP de cada cuenta.
3. **Pestaña `Salud y Mantenimiento` (Novedades y Gráficos):**
   * Control del estado del Auditorio Magna Principal (Operativo, Mantenimiento, Evento Privado).
   * 4 KPIs de Mantenimiento: Operatividad de Equipos (%), Casos en Taller, Downtime Total Acumulado (horas) y MTTR Promedio.
   * Gráficos interactivos de barras por categoría de implemento y gráficos radiales por tipo de intervención técnica.
   * Registro y resolución de novedades con constancia técnica obligatoria.
4. **Pestaña `Inventario Técnico`:*** Catálogo de hardware con stock total y disponible, y alternancia rápida de estado.
5. **Pestaña `Funcionarios y Cuadrillas`:*** Módulo CRUD para agregar, editar y eliminar contactos de Aseo, Guardia, TI y Coordinación.
6. **Módulo RPA y Bots Autónomos de Contingencia:**
   * Centro de mando con 4 bots: **Watchdog Sentry Bot**, **Auto-Cleaner Bot**, **Audit Compliance Bot** y **Data Sync Reconciler Bot**.
   * Panel de telemetría con estado en vivo, último ciclo de ejecución, tasa de éxito (100%) y botón para ejecución manual inmediata.
7. **Plan de Respuesta a Incidentes (IRP NIST SP 800-61 / ISO 27035):**
   * Banner de respuesta a incidentes con botón `Declarar Incidente Operacional (IRP)`.
   * Modal interactivo de triaje con selección de severidad (SEV-1 Crítico a SEV-4 Bajo), clasificación de vector de ataque o falla, protocolo de contención sugerido y registro forense con sellado criptográfico.

---

## 4. LA ARQUITECTURA TÉCNICA EXPLICADA EN PALABRAS SENCILLAS

* **Next.js 15 y App Router:** Toda la lógica pesada y las consultas a la base de datos se ejecutan en el servidor de forma segura mediante Server Actions, sin exponer endpoints REST vulnerables a intercepción.
* **Prisma ORM:** Actúa como intermediario tipado en TypeScript. Transforma nuestras consultas en sentencias SQL parametrizadas, lo que hace matemáticamente imposible una inyección SQL.
* **Modelo de Datos de 10 Tablas Relacionales:** Relaciona usuarios, auditorios, reservas, implementos prestados, horas de soporte TI, encuestas NPS, cuadrillas de correo, registros de auditoría y novedades de mantenimiento.
* **Dualidad de Base de Datos:** Opera sobre SQLite local (`dev.db`) para máxima autonomía sin conexión, y sobre PostgreSQL en Neon Cloud para producción multi-usuario.
* **Ciberseguridad Defensiva Embebida:** Contraseñas hasheadas con bcryptjs (factor 10), protección CSRF nativa, validación Zod y auditoría forense inmutable (`RegistroAuditoria`).

---

## 5. SIMULADOR DE DEFENSA: 15 PREGUNTAS CLAVE DE LA COMISIÓN Y CÓMO RESPONDERLAS

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

### Pregunta 11: ¿Qué es el módulo RPA y qué hacen exactamente los 4 bots autónomos?
> *"Profesor, el módulo RPA (Robotic Process Automation) es un motor de automatización de contingencia que ejecuta tareas críticas de fondo sin intervención humana:
> 1. El **Watchdog Sentry Bot** monitorea la salud del sistema y detecta latencias anómalas.
> 2. El **Auto-Cleaner Bot** purga tokens temporales vencidos y libera reservas bloqueadas por más de 24 horas.
> 3. El **Audit Compliance Bot** verifica la integridad criptográfica de la bitácora forense para asegurar que ningún registro haya sido alterado.
> 4. El **Data Sync Reconciler Bot** sincroniza los estados de inventario y asegura la consistencia entre los datos locales y la nube."*

### Pregunta 12: ¿Cómo responde el sistema ante un ciberataque o falla crítica según el Plan de Respuesta a Incidentes (IRP)?
> *"Implementamos un IRP formal alineado con la norma NIST SP 800-61 Rev. 2 y la ISO/IEC 27035. Desde el panel del Administrador, contamos con un botón para 'Declarar Incidente Operacional (IRP)' que despliega un modal interactivo de triaje. Clasifica el evento por severidad (SEV-1 Crítico a SEV-4 Bajo), define el vector de afección, sugiere acciones inmediatas de contención (aislamiento de red, revocación masiva de sesiones, activación de respaldo offline) y firma el reporte con sellado criptográfico en la bitácora inmutable."*

### Pregunta 13: ¿Cómo funciona el Gestor de Cuentas, la Doble Verificación y la Bitácora Forense individual?
> *"El Gestor de Cuentas unifica la administración de identidades en el portal del Super Administrador. Aplica el principio de Cuatro Ojos y Doble Verificación Crítica: acciones de alto impacto como crear una cuenta, otorgar privilegios de Gestor de Cuentas o eliminar un usuario exigen una confirmación secundaria obligatoria en modal con advertencia de impacto. Además, cada usuario cuenta con su propia Bitácora Forense individual, donde el administrador puede auditar exactamente qué cambios se le hicieron a esa cuenta, con fecha, hora, operador responsable e IP de origen."*

### Pregunta 14: ¿Cómo garantiza el sistema que los equipos técnicos no se pierdan y cómo funciona la validación QR con la cámara?
> *"El técnico de soporte en su portal móvil cuenta con un flujo de doble verificación física: en el Check-in tiene un checklist para tildar cada implemento entregado en mano al docente, y en el Check-out un checklist de retorno para confirmar su recepción conforme. Además, el escáner de cámara utiliza aceleración por hardware (`BarcodeDetector` nativo y fallback `jsQR`), proyecta un recuadro verde de seguimiento en tiempo real sobre el código QR y, lo más importante para la operatividad en terreno, **apaga inmediatamente la cámara a nivel de hardware (`track.stop()`)** apenas detecta el código para ahorrar batería del teléfono y garantizar privacidad."*

### Pregunta 15: ¿Cómo está desplegado el sistema en la nube y cómo se accede desde cualquier lugar?
> *"El sistema está desplegado en **Vercel** (`https://sistema-gestion-auditorios-capstone.vercel.app`) y conectado al repositorio de GitHub para despliegue continuo (CI/CD). La persistencia global se conecta a un cluster Serverless de PostgreSQL en **Neon Cloud** mediante la variable de entorno protegida `DATABASE_URL` con connection pooling y cifrado TLS 1.3. Esto permite que cualquier docente o evaluador acceda desde su propio smartphone o computador desde cualquier red."*

---

## 6. MATRIZ DE CUMPLIMIENTO DE LA RÚBRICA DUOC UC (FASE 2)

| Criterio de la Rúbrica Duoc UC | Evidencia Concreta en el Proyecto | Estado |
| :--- | :--- | :---: |
| **1. Arquitectura y Código Limpio** | Next.js 15 App Router, TypeScript estricto, Server Actions seguras, Prisma ORM tipado. Build de producción sin errores (`0 errors`). | **100% CUMPLIDO (7.0)** |
| **2. Persistencia y Modelo Relacional** | 10 modelos relacionales con claves foráneas e integridad referencial en SQLite y Neon Cloud PostgreSQL. | **100% CUMPLIDO (7.0)** |
| **3. Requerimientos Funcionales y Roles** | 5 portales diferenciados por rol (Docente, Técnico TI, Encargada, Administrador) con flujos de aprobación y validación QR. | **100% CUMPLIDO (7.0)** |
| **4. Usabilidad y Accesibilidad** | Cumplimiento WCAG 2.1 nivel AA, contraste > 4.5:1, diseño Mobile-First con botones táctiles > 52px. | **100% CUMPLIDO (7.0)** |
| **5. Ciberseguridad y Auditoría** | Bcrypt factor 10, cookies HttpOnly, validación Zod, CSRF nativo, bitácora forense inmutable con registro por usuario. | **100% CUMPLIDO (7.0)** |
| **6. Innovación y Valor Agregado** | Escáner QR de cámara con auto-cierre, cómputo automático de horas TI ($\Delta T$), 4 Bots RPA, Dashboard de Salud con gráficos y Plan de Respuesta a Incidentes (IRP NIST SP 800-61). | **100% CUMPLIDO (7.0)** |

---

## 7. UBICACIÓN EXACTA DE LOS ARCHIVOS EN TU COMPUTADOR Y EN GITHUB

### En tu Computador (Rutas Absolutas):
1. **Tu Guía Personal de Estudio (Word .docx):**  
   `C:\Users\MAANDO\Desktop\PROYECTO DE TITULO\Fase 2\Evidencias Grupales\Guia_Personal_Estudio_Defensa_Fase1_y_Fase2_Benjamin_Navarrete.docx`  
   *(Copia de respaldo también en `contenido estudio` y `objetos proyecto de titulo`)*
2. **Tu Guía Personal de Estudio (Markdown .md):**  
   `C:\Users\MAANDO\Desktop\PROYECTO DE TITULO\Fase 2\Evidencias Grupales\guia_personal_estudio_defensa_fase1_y_fase2.md`
3. **Credenciales y Gestión de Cuentas (.docx y .md):**  
   `C:\Users\MAANDO\Desktop\PROYECTO DE TITULO\Fase 2\Evidencias Grupales\CREDENCIALES_Y_ACCESOS_SISTEMA.docx`
4. **Plan de Respuesta a Incidentes IRP (.docx y .md):**  
   `C:\Users\MAANDO\Desktop\PROYECTO DE TITULO\Fase 2\Evidencias Grupales\PLAN_DE_RESPUESTA_A_INCIDENTES_IRP.docx`
5. **Manual RPA y Contingencias (.docx y .md):**  
   `C:\Users\MAANDO\Desktop\PROYECTO DE TITULO\Fase 2\Evidencias Grupales\MANUAL_RPA_Y_PLAN_DE_CONTINGENCIAS.docx`
6. **Guía de Despliegue en Vercel y Neon Cloud:**  
   `C:\Users\MAANDO\Desktop\PROYECTO DE TITULO\Fase 2\Evidencias Grupales\GUIA_DESPLIEGUE_VERCEL_Y_NEON.md`

### En GitHub:
* **Repositorio:** `https://github.com/IMANDOI/sistema-gestion-auditorios-capstone`
* **Rama Principal:** `main` (todos los archivos, código fuente y documentos sincronizados al 100%).
