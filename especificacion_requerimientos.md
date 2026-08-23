# ESPECIFICACIÓN DE REQUERIMIENTOS DE SOFTWARE (SRS) - MVP
## Estándar IEEE 830 / ISO/IEC/IEEE 29148 / OWASP Top 10
### Proyecto: Sistema Autónomo de Gestión Operativa, Trazabilidad y Analítica para Auditorios y Espacios Multiuso

---

## 1. Introducción y Propósito del Sistema

### 1.1 Naturaleza del Producto: Producto Mínimo Viable (MVP)
El presente software constituye un **Producto Mínimo Viable (MVP)** funcional, modular y desacoplado (*White-Label*), concebida para digitalizar, gobernar y auditar la totalidad de los flujos operacionales críticos en auditorios, aulas magnas y salas de conferencias de alta demanda bajo **estándares internacionales de ciberseguridad (OWASP Top 10 / ISO 27001)**.

### 1.2 Justificación Operativa y Problemática Raíz
El diseño de los requerimientos de este MVP responde a la mitigación directa de cuatro dolores operacionales y de seguridad críticos:
1. **Ineficiencia Crítica del Soporte Técnico TI:** En sistemas convencionales, los técnicos perdían hasta 1 hora en sitio esperando a expositores retrasados para entregar equipos. La solución implementa **Check-in/out por QR móvil** que valida el acceso y entrega de equipamiento en menos de 30 segundos.
2. **Falta de Coordinación con Servicios de Apoyo:** Personal de aseo y guardia no recibía la información a tiempo para planificar limpieza y aperturas. La solución integra **difusión automática por áreas (`EmailSubscription`)**.
3. **Cancelaciones Imprevistas y No-Shows:** Profesores solicitaban el auditorio a última hora o no se presentaban. La solución introduce **confirmación anticipada por token sin login** y el **algoritmo de penalización de prioridad (*PriorityScore*)**.
4. **Carencia de Métricas Cuantitativas:** Históricamente solo existían quejas subjetivas. La solución incorpora un **Dashboard de Analítica en tiempo real** y una **Encuesta de Calidad por Estrellas (1-5)** con cálculo de Net Promoter Score (NPS) y horas de ocupación efectiva.
5. **Protección de Datos Sensibles e Identidades:** Mitigación de fugas de datos y accesos no autorizados mediante autenticación robusta, control RBAC y sanitización estricta.

---

## 2. Matriz de Roles y Actores del MVP (RBAC)

| Rol | Identificador | Nivel | Responsabilidades y Alcance Operativo |
| :--- | :---: | :---: | :--- |
| **Super Administrador** | `OWNER` | 6 | Control total del sistema, auditoría de logs, bypass de contingencia (`MASTER-CODE`) y configuración de plataforma. |
| **Administrador TI** | `IT_ADMIN` | 5 | Gestión técnica, catálogo de inventario audiovisual, asignación de técnicos y analítica de métricas. |
| **Soporte Técnico en Terreno** | `IT_SERVICE` | 4 | Validación física de llegada de expositores mediante escaneo QR móvil en < 30s, entrega y recepción de equipamiento. |
| **Encargado de Auditorio** | `ASSISTANT` | 3 | Revisión de solicitudes, aprobación/aplazamiento/rechazo y coordinación logística de aperturas. |
| **Docente / Expositor** | `PROFESSOR` | 2 | Solicitud de espacios con requerimientos técnicos, confirmación/liberación rápida por correo y evaluación de satisfacción. |
| **Visor General / Estudiante** | `STUDENT` | 1 | Consulta de solo lectura de la cartelera pública de eventos confirmados. |

---

## 3. Catálogo de Requerimientos Funcionales del MVP (RF)

### 3.1 Módulo de Autenticación, Sesiones y Ciberseguridad
* **RF-01: Autenticación Multi-Rol y Sesiones Seguras**
  * *Actor:* Todos los roles.
  * *Descripción:* Inicio de sesión con usuario/correo y contraseña cifrada mediante `bcrypt` (cost factor >= 10). Emisión de tokens de sesión JWT cifrados (JWE) almacenados en cookies `HttpOnly`, `Secure` y `SameSite=Lax`.
  * *Regla de Negocio:* Si un usuario posee rol `OWNER` o utiliza el Código Maestro de contingencia, se otorga acceso de superusuario con registro en bitácora de auditoría.

* **RF-02: Control de Acceso Basado en Roles (RBAC)**
  * *Actor:* Middleware del Sistema.
  * *Descripción:* Verificación en servidor de los privilegios del usuario autenticado antes de ejecutar cualquier Server Action o renderizar rutas protegidas. Retorna HTTP 403 Forbidden en caso de privilegios insuficientes.

### 3.2 Módulo de Gestión de Solicitudes y Prevención de Conflictos
* **RF-03: Solicitud de Auditorio con Requerimientos Técnicos**
  * *Actor:* `PROFESSOR`, `ASSISTANT`, `IT_ADMIN`, `OWNER`.
  * *Descripción:* Formulario interactivo en etapas para solicitar reservas especificando: fecha/hora de inicio y fin, facultad/área, número de asistentes y selección modular de equipamiento:
    * *Audio:* Micrófonos inalámbricos (cantidad), solapa/lavalier, micrófonos fijos con pedestal.
    * *Video:* Proyector, transmisión streaming en vivo, grabación de video, registro fotográfico, laptop de apoyo.
    * *Mobiliario y Protocolo:* Podio, mantelería, banderas protocolares, dispensador de agua, mesas adicionales.
    * *Servicios Generales:* Coffee break, solicitud de aseo previo y aseo posterior.

* **RF-04: Algoritmo Anti-Colisiones de Horario en Base de Datos**
  * *Actor:* Sistema (PostgreSQL / Prisma).
  * *Descripción:* Verificación transaccional atómica para impedir que se apruebe o solicite un evento en un intervalo $[T_{inicio}, T_{fin}]$ que intersecte con otra reserva en estado `APPROVED` o `CHECKED_IN`.
  * *Condición de Conflicto:* $\max(T_{inicio1}, T_{inicio2}) < \min(T_{fin1}, T_{fin2})$.

* **RF-05: Algoritmo de Prioridad Dinámica (*PriorityScore*)**
  * *Actor:* Sistema.
  * *Descripción:* Cada solicitante inicia con un puntaje de 100 puntos. En caso de solicitudes concurrentes sobre un mismo bloque, el sistema prioriza al solicitante con mejor puntuación.
  * *Regla de Penalización:* Cada evento clasificado como `NO_SHOW` (no presentación sin aviso) descuenta 20 puntos del puntaje del usuario de forma irreversible.

### 3.3 Módulo de Dictamen y Gestión Logística
* **RF-06: Panel de Revisión y Dictamen Administrativo**
  * *Actor:* `ASSISTANT`, `IT_ADMIN`, `OWNER`.
  * *Descripción:* Visualización de solicitudes pendientes (`PENDING`) con opciones de:
    * **Aprobar (`APPROVED`):** Confirma la reserva, genera código QR criptográfico único y token de confirmación.
    * **Aplazar (`POSTPONED`):** Propone una fecha u hora alternativa enviando una notificación explicativa al usuario.
    * **Rechazar (`REJECTED`):** Descarta la solicitud especificando el motivo formal.

* **RF-07: Confirmación y Cancelación Rápida por Token (Anti No-Show)**
  * *Actor:* `PROFESSOR`.
  * *Descripción:* Despacho automático de correo de confirmación 48 horas y 24 horas antes del evento con botones de acción directa firmados criptográficamente:
    1. *Confirmar Asistencia:* Marca `confirmedByUser = true`.
    2. *Liberar Espacio:* Cambia estado a `REJECTED` / `CANCELLED`, liberando el auditorio inmediatamente para otros usuarios.

### 3.4 Módulo de Validación en Sitio (QR Dinámico Check-in / Check-out)
* **RF-08: Emisión de Códigos QR Criptográficos Únicos**
  * *Actor:* Sistema.
  * *Descripción:* Generación de un token UUID v4 codificado en formato QR dinámico de alta densidad, adjunto a la vista web del solicitante y a su comprobante por correo.

* **RF-09: Validación Presencial de Check-in en Menos de 30 Segundos**
  * *Actor:* `IT_SERVICE`, `IT_ADMIN`, `OWNER`.
  * *Descripción:* Al llegar el expositor al auditorio, el técnico de TI escanea el código QR utilizando la cámara de su smartphone. El sistema valida el token en tiempo real, transiciona el estado a `CHECKED_IN` y registra la marca temporal exacta (`checkInTime`) y el ID del técnico validador (`checkedInBy`), eliminando las esperas pasivas de TI.

* **RF-10: Validación de Check-out y Control de Devolución de Activos**
  * *Actor:* `IT_SERVICE`, `IT_ADMIN`, `OWNER`.
  * *Descripción:* Al finalizar el evento, el técnico vuelve a escanear el QR o pulsa el botón de cierre, confirmando la devolución íntegra de equipos. Se transiciona a `CHECKED_OUT` y se registran `checkoutTime` y `checkedOutBy`.

### 3.5 Módulo de Encuestas Cuantitativas y Dashboard de Métricas
* **RF-11: Encuesta Cuantitativa de Satisfacción Post-Evento**
  * *Actor:* `PROFESSOR`.
  * *Descripción:* Tras el Check-out, el sistema despliega una encuesta de 3 parámetros evaluados de 1 a 5 estrellas:
    1. Satisfacción General del Evento (`ratingOverall`).
    2. Rendimiento y Estado del Equipamiento Técnico (`ratingEquipment`).
    3. Trato y Rapidez del Soporte TI (`ratingSupport`).
    4. Observaciones cualitativas opcionales (`feedbackComment`).

* **RF-12: Panel de Analítica Operativa y KPIs en Tiempo Real**
  * *Actor:* `IT_ADMIN`, `OWNER`.
  * *Descripción:* Visualización gráfica de métricas consolidadas: porcentaje de ocupación semanal, índice de No-Shows, cálculo automático de Net Promoter Score (NPS), horas hombre ahorradas en soporte técnico y equipos con mayor tasa de fallas.

### 3.6 Módulo de Inventario y Difusión a Servicios de Apoyo
* **RF-13: Catálogo y Control de Disponibilidad de Equipos**
  * *Actor:* `IT_ADMIN`, `OWNER`, `IT_SERVICE`.
  * *Descripción:* Administración del stock de equipamiento técnico (`AUDIO`, `PROJECTION`, `FURNITURE`, `CONNECTIVITY`, `OTHER`) con bloqueo automático de asignación para ítems en mantenimiento.

* **RF-14: Difusión Automática a Unidades de Apoyo (Aseo, Guardia, TI)**
  * *Actor:* Sistema / `OWNER`.
  * *Descripción:* Gestión de listas de suscripción (`EmailSubscription`) por departamentos (`ASEO`, `GUARDIA`, `TI`, `SECRETARIA`) que reciben cronogramas automatizados con requerimientos especiales (ej. necesidad de limpieza previa o coffee break) para coordinar oportunamente su trabajo.

---

## 4. Requerimientos Específicos de Ciberseguridad (RS) y RNF (ISO 25010 / OWASP)

```mermaid
graph TD
    SEC[Ciberseguridad y Calidad ISO 25010 / OWASP]
    SEC --> RS01[RS-01: Hashing de Claves bcrypt Salt 10]
    SEC --> RS02[RS-02: JWT Cifrado en Cookies HttpOnly/Secure]
    SEC --> RS03[RS-03: Sanitización y Tipado Estricto Zod]
    SEC --> RS04[RS-04: Consultas Parametrizadas Anti-SQLi Prisma]
    SEC --> RS05[RS-05: Tokens UUID v4 de Alta Entropía]
    SEC --> RS06[RS-06: Cabeceras HTTP Defensivas HSTS/CSP]
    SEC --> RS07[RS-07: Bitácora Inmutable de Auditoría]
    SEC --> RS08[RS-08: Rate Limiting contra Fuerza Bruta]
```

### 4.1 Ciberseguridad y Protección de Datos Sensibles (Security)
* **RS-01 (Hashing de Contraseñas):** Las contraseñas de los usuarios nunca se almacenarán en texto plano. Se procesarán mediante el algoritmo `bcrypt` con un factor de costo computacional mínimo de 10 iteraciones.
* **RS-02 (Gestión de Sesión y Cookies Seguras):** Los tokens JWT se firmarán y cifrarán del lado del servidor. Las cookies de sesión deben incluir los flags obligatorios `HttpOnly` (previene acceso desde JavaScript), `Secure` (exclusivo HTTPS) y `SameSite=Lax` (mitiga CSRF).
* **RS-03 (Sanitización y Validación Server-Side):** Todo payload enviado al servidor mediante API o Server Actions debe ser validado con esquemas estrictos de **Zod**, descartando campos no permitidos para mitigar ataques de inyección y Parameter Tampering.
* **RS-04 (Protección contra Inyección SQL):** Se prohíbe la concatenación directa de comandos SQL; el 100% de las mutaciones y consultas a la base de datos se ejecutarán a través del cliente parametrizado de **Prisma ORM**.
* **RS-05 (Entropía en Códigos QR y Tokens de Email):** Los códigos QR dinámicos y los enlaces de confirmación utilizarán tokens UUID v4 criptográficamente seguros generados con el generador de números pseudoaleatorios del sistema operativo (CSPRNG).
* **RS-06 (Cabeceras de Seguridad HTTP):** El servidor debe emitir cabeceras de respuesta HTTP defensivas:
  * `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  * `X-Frame-Options: DENY` (mitigación de Clickjacking)
  * `X-Content-Type-Options: nosniff` (previene ataques MIME-sniffing)
  * `Referrer-Policy: strict-origin-when-cross-origin`
* **RS-07 (Trazabilidad y Bitácora de Auditoría):** Todas las acciones críticas (aprobación, cancelación, Check-in presencial, Check-out y actualización de roles) registrarán el ID del operador, la marca temporal exacta y el estado previo/posterior.
* **RS-08 (Mitigación de Ataques de Fuerza Bruta):** Los endpoints de inicio de sesión y validación de tokens deben implementar mecanismos de limitación de tasa de solicitudes (*Rate Limiting*).

---

## 5. Matriz de Trazabilidad (Requerimientos vs Dolores Operacionales vs Seguridad)

| Código | Requerimiento / Capacidad | Dolor Operacional / Riesgo de Seguridad Resuelto | Criticidad |
| :---: | :--- | :--- | :---: |
| **RF-01** | Autenticación Segura Multi-Rol | Suplantación de identidad / Acceso no autorizado | **Alta** |
| **RF-02** | Control RBAC de 6 Roles | Fuga de privilegios administrativos | **Alta** |
| **RF-03** | Solicitud Modular con Validación Zod | Inyección de datos maliciosos en formularios | **Alta** |
| **RF-04** | Algoritmo Anti-Colisiones Atómico | Solapamiento de reservas en base de datos | **Crítica** |
| **RF-05** | Penalización PriorityScore | Mala praxis docente y reservas fantasmas | **Media** |
| **RF-06** | Dictamen Administrativo Auditado | Falta de control y trazabilidad en decisiones | **Alta** |
| **RF-07** | Confirmación por Token Criptográfico | Cancelaciones tardías sin autenticación pesada | **Alta** |
| **RF-08** | Emisión QR Dinámico UUID v4 | Falsificación de pases de acceso | **Alta** |
| **RF-09** | **Validación Check-in QR < 30 seg** | **Cuello de botella de 1 hora de espera de TI** | **Crítica** |
| **RF-10** | Validación Check-out con Trazabilidad | Extravío o daño no registrado de equipos | **Crítica** |
| **RF-11** | Encuesta de Satisfacción Parametrizada | Opiniones subjetivas sin métricas cuantificables | **Media** |
| **RF-12** | Dashboard Operativo y NPS | Falta de visibilidad directiva sobre uso y tiempos | **Alta** |
| **RF-13** | Control de Estado de Equipos | Asignación accidental de hardware dañado | **Alta** |
| **RF-14** | **Difusión a Aseo, Guardia y TI** | **Desinformación en cuadrillas de servicios generales** | **Media** |
| **RS-01** | Cifrado bcrypt (Cost Factor 10) | Robo o filtración de base de datos de credenciales | **Crítica** |
| **RS-02** | Cookies HttpOnly + Secure + SameSite | Ataques XSS y robo de sesiones de usuario | **Crítica** |
| **RS-06** | Cabeceras HSTS + CSP + X-Frame-Options | Ataques de Clickjacking y degradación SSL | **Alta** |
