# MANUAL DE AUTOMATIZACIÓN ROBÓTICA DE PROCESOS (RPA) Y PLAN DE CONTINGENCIAS OPERATIVAS
## Sistema Autónomo de Gestión Operativa de Auditorios — Duoc UC
### Proyecto Capstone APT122 / PTY4614 — Benjamín Navarrete (Super Administrador)

---

## 1. ¿QUÉ ES EL RPA Y POR QUÉ ES FUNDAMENTAL EN ESTE PROYECTO?

En entornos de alta demanda académica, los sistemas tradicionales dependen de la intervención humana reactiva: si un docente no asiste, el auditorio queda reservado inútilmente; si un técnico olvida cerrar un evento, el stock de implementos no se libera; y si un equipo falla repetidamente, nadie actúa hasta que colapsa en una ceremonia oficial.

Para erradicar estos cuellos de botella, se implementó un **Motor RPA (Robotic Process Automation / Automatización Robótica de Procesos)** que ejecuta tareas programadas y de supervisión autónoma en el servidor sin requerir la intervención de un operador humano.

---

## 2. LOS 4 AGENTES ROBÓTICOS (SUB-PROCESOS RPA IMPLEMENTADOS)

### Agente 1: Bot Anti No-Show y Desbloqueo Automático de Salas
* **Misión:** Evitar que un auditorio permanezca bloqueado cuando un docente no se presenta.
* **Lógica Robótica:**
  1. Escanea las reservas en estado `APPROVED`.
  2. Si han transcurrido más de **30 minutos desde la hora pactada de inicio** y no se ha registrado el Check-in QR del docente, el bot actúa de inmediato.
  3. Cambia el estado a `NO_SHOW`.
  4. Aplica una **penalización automática de 15 puntos** sobre el `priorityScore` del docente en la base de datos (lo que reduce su prioridad en reservas futuras).
  5. Libera automáticamente el auditorio en la agenda y retorna los implementos solicitados al inventario disponible.
  6. Despacha una alerta a la cuadrilla de guardia/aseo informando la liberación del recinto.
  7. Estampa el evento en la bitácora forense (`RPA_AUTO_CANCEL_NOSHOW`).

### Agente 2: Bot de Retorno Preventivo y Cierre Operativo (Auto Check-Out)
* **Misión:** Garantizar que los micrófonos, proyectores y salas no queden retenidos indefinidamente si el técnico o docente olvida marcar el Check-out.
* **Lógica Robótica:**
  1. Supervisa eventos en estado `CHECKED_IN` cuya hora de término haya vencido por más de 60 minutos.
  2. Ejecuta el cierre preventivo, computa la duración aproximada y marca la reserva como `CHECKED_OUT`.
  3. Marca todos los implementos asignados como devueltos (`returned = true`), restaurando el stock a disponible.
  4. Firma la transacción en la auditoría (`RPA_AUTO_CHECKOUT`).

### Agente 3: Bot de Telemetría Predictiva de Hardware (MTTR & Fallas Recurrentes)
* **Misión:** Detectar fallas incipientes antes de eventos masivos.
* **Lógica Robótica:**
  1. Analiza el historial de intervenciones técnicas en `RegistroMantenimiento`.
  2. Si un micrófono, proyector o climatizador acumula 2 o más ingresos a taller en el mes, emite una **Alerta Preventiva de Salud**.
  3. Notifica al Super Administrador en el Dashboard de Salud recomendando revisión de fábrica o sustitución antes de que falle en una titulación.

### Agente 4: Bot de Sincronización y Despacho a Cuadrillas
* **Misión:** Coordinación logística con Aseo, Guardia y Soporte Audiovisual.
* **Lógica Robótica:**
  1. Verifica que las listas de difusión de `SuscripcionArea` tengan personal activo en cada turno.
  2. Enlaza los cierres de eventos con las órdenes de sanitización preventiva.

---

## 3. CÓMO SIMULAR Y DEMOSTRAR EL RPA ANTE LA COMISIÓN DOCENTE

En el portal de administración (`/admin`), dentro de la pestaña **`Automatización RPA & Bots`**:
1. Verás el indicador verde de estado: **`Daemon Autónomo Operativo`**.
2. Pulsa el botón: **`Ejecutar Ciclo de RPA Ahora (Simular Bot)`**.
3. El servidor ejecutará en tiempo real la inspección de todas las reservas y recintos de Neon PostgreSQL.
4. Desplegará una tarjeta de resultados con:
   * Cantidad de No-Shows prevenidos y salas liberadas.
   * Cierres preventivos realizados.
   * Alertas predictivas de hardware emitidas.
   * Lista detallada de acciones que el bot estampó en la bitácora inmutable.

---

## 4. PROTOCOLO DE CONTINGENCIAS OPERATIVAS (PLAN DE ACCIÓN "QUÉ HACER SI...")

| Incidente / Contingencia | Causa Raíz | Acción Inmediata del Administrador | Rol del RPA / Sistema |
| :--- | :--- | :--- | :--- |
| **1. Inasistencia Docente (No-Show)** | Retraso o imprevisto personal sin aviso. | No se requiere acción manual. | El RPA cancela tras 30 min, libera la sala y penaliza el score docente automáticamente. |
| **2. Falla Crítica de Proyector Láser en Vivo** | Sobrecalentamiento de lámpara o corte eléctrico. | Ir a `/admin` $ightarrow$ *Salud y Mantenimiento* $ightarrow$ *Registrar Novedad*. Enviar a taller. Reasignar proyector de respaldo del inventario. | El sistema bloquea el equipo dañado para futuras reservas y recalcula el MTTR institucional. |
| **3. Caída de Conexión a Internet en el Campus** | Corte de fibra óptica del proveedor ISP. | El técnico de soporte TI utiliza el código alfanumérico del pase QR (`qr-res-001`) y opera en la versión local autónoma (`http://localhost:3000`). | La arquitectura desacoplada de SQLite/Neon permite operación offline autónoma. |
| **4. Solapamiento / Necesidad de Reprogramar Horario** | Visita urgente de Rectoría o ceremonia oficial no programada. | Ir a `/admin` $ightarrow$ *Agenda* $ightarrow$ *Modificar Horario*. Marcar la casilla obligatoria de seguridad y guardar. | El motor anti-colisiones valida matemáticamente y estampa `HORARIO_MODIFICADO_ADMIN` en bitácora. |
| **5. Bloqueo u Olvido de Contraseña** | Docente o técnico olvida su clave. | Ir a `/admin` $ightarrow$ *Gestión de Cuentas* $ightarrow$ botón *Clave*. Ingresar nueva clave con doble verificación. | Cifrado unidireccional bcrypt (factor 10) y firma en auditoría forense con operador e IP. |

---
*Manual elaborado por Benjamín Navarrete — Proyecto Capstone 2026 — Duoc UC*
