# REGISTRO DE CREDENCIALES, ROLES Y GESTIÓN DE CUENTAS
## Sistema Autónomo de Gestión Operativa de Auditorios — Duoc UC
### Proyecto Capstone APT122 / PTY4614 — Benjamín Navarrete

---

## 1. CUENTAS DE USUARIO DEL SISTEMA (ROLES Y ACCESOS)

Todas las cuentas se encuentran creadas y activas tanto en la base de datos local (SQLite) como en el cluster de producción en la nube (**Neon Cloud PostgreSQL**).

| Perfil / Rol | Nombre Completo | Correo Electrónico (Login) | Contraseña | Rol Técnico (RBAC) | Portal de Acceso | Privilegios y Responsabilidades |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Super Administrador (Personal)** | **Benjamín Navarrete** | `benjamin54144752123@gmail.com` | `Capstone2026!` | `OWNER` / `IT_ADMIN` | `/admin` | Acceso irrestricto: Gestión de cuentas, reprogramación de horarios con seguridad, dashboard de mantenimiento con gráficos, control de cuadrillas y bitácora forense. |
| **Encargada de Recintos** | Carla Morales | `coordinacion@institucion.cl` | `Capstone2026!` | `ASSISTANT` | `/encargado` | Mesa de aprobación y rechazo fundamentado de espacios académicos, cálculo de prioridad y emisión de tokens QR. |
| **Soporte TI Terreno** | Rodrigo Tapia | `soporte.ti@institucion.cl` | `Capstone2026!` | `IT_SERVICE` | `/tecnico` | Interfaz móvil-first para validación in situ: Check-in QR en < 30s, check-out con cómputo automático de horas dedicadas de soporte TI ($\Delta T$) y entrega de implementos. |
| **Docente Solicitante** | Dra. Patricia González | `patricia.gonzalez@institucion.cl` | `Capstone2026!` | `PROFESSOR` | `/docente` | Wizard de reserva de auditorio, selección de hardware audiovisual con control de stock, visualización de Pase QR Oficial y encuesta NPS post-evento. |

---

## 2. LISTAS DE DIFUSIÓN Y CUADRILLAS DE SERVICIO (NOTIFICACIONES)

Las cuadrillas de apoyo no inician sesión para operar reservas, sino que están suscritas al subsistema de despacho automático de alertas para coordinar apertura perimetral y limpieza:

| Área / Cuadrilla | Nombre del Contacto | Correo de Notificación | Estado | Tipo de Notificaciones Recibidas |
| :--- | :--- | :--- | :---: | :--- |
| **Aseo y Sanitización** | Cuadrilla de Aseo Central | `aseo.central@institucion.cl` | **Activo** | Alertas de eventos finalizados para limpieza y desinfección inmediata de sala. |
| **Guardia y Seguridad** | Guardia Perimetral y Accesos | `seguridad.campus@institucion.cl` | **Activo** | Notificación de aperturas de auditorio y control de accesos perimetrales. |
| **Soporte Audiovisual** | Equipo Técnico Audiovisual | `soporte.audiovisual@institucion.cl` | **Activo** | Alertas de preparación de salas con alta demanda de hardware. |
| **Coordinación Académica** | Coordinación de Eventos Sede | `eventos.sede@institucion.cl` | **Activo** | Calendario de eventos institucionales y ceremonias de titulación. |

---

## 3. GESTOR DE CUENTAS DE USUARIO EN EL PANEL DE ADMINISTRACIÓN

Desde el portal del Super Administrador (`/admin`), en la nueva pestaña **`Gestión de Cuentas`**, puedes:

1. **Crear Nuevas Cuentas:**  
   Registrar nuevos docentes, técnicos de soporte, encargadas o administradores, asignándoles nombre, correo, departamento, teléfono, contraseña inicial y puntaje de prioridad.
2. **Modificar Roles y Datos:**  
   Cambiar el departamento, teléfono, rol o puntaje de prioridad de cualquier usuario existente.
3. **Restablecer Contraseñas:**  
   Generar una nueva contraseña encriptada con `bcrypt` (factor 10) con 1 solo clic si un docente o técnico la olvida.
4. **Eliminar Cuentas con Seguridad:**  
   Eliminar cuentas que ya no pertenezcan a la institución, con **bloqueo estricto de seguridad** que impide eliminar la cuenta del Super Administrador (`benjamin54144752123@gmail.com`).
5. **Trazabilidad Total:**  
   Cada creación, modificación o eliminación de cuentas queda registrada de forma inmutable en la pestaña **Bitácora de Auditoría** con estampa de tiempo, dirección IP y operador responsable.

---

## 4. BOTONES DE ACCESO RÁPIDO DE 1-CLIC (DEMOSTRACIÓN EVALUADORA)

En la pantalla de inicio de sesión (`http://localhost:3000/login` o en la versión desplegada en la nube):
* No es necesario escribir las credenciales a mano durante la presentación.
* En la parte superior existen **4 botones de acceso rápido** (Super Admin, Encargada, Técnico TI y Docente) que rellenan automáticamente los campos y permiten ingresar en menos de 1 segundo.

---
*Documento institucional — Proyecto Capstone 2026 — Duoc UC*
