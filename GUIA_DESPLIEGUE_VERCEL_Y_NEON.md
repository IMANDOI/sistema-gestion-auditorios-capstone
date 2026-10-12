# GUÍA DE DESPLIEGUE Y DEMOSTRACIÓN OPERATIVA (FASE 2)
## Sistema Autónomo de Gestión Operativa de Auditorios — Duoc UC
### Proyecto Capstone APT122 / PTY4614 — Benjamín Navarrete

---

## 1. INTRODUCCIÓN Y ESTRATEGIA DE DEMOSTRACIÓN

Para la evaluación del hito de **Fase 2 (Desarrollo y Prototipo Funcional)**, la comisión docente evaluará que el sistema esté **construido, operativo y listo para mostrarse**.

Para asegurar el **7.0 (nota máxima)** sin correr riesgos técnicos durante la presentación (como caídas del Wi-Fi institucional o cortes de conexión externa), dispones de **dos modalidades de demostración**:

1. **Modalidad 1: Demostración Local de Alta Confiabilidad (Recomendada para la Presentación Oral)**
   - Ejecución autónoma en tu laptop a través de `http://localhost:3000`.
   - Utiliza la base de datos relacional SQLite (`dev.db`), la cual ya cuenta con todos los datos semillados (usuarios, auditorios, reservas históricas, implementos y cuadrillas).
   - Inicia con **1 solo clic** ejecutando el archivo: [`INICIAR_PROTOTIPO_FASE2.bat`](file:///c:/Users/MAANDO/Desktop/PROYECTO%20DE%20TITULO/INICIAR_PROTOTIPO_FASE2.bat).

2. **Modalidad 2: Despliegue en la Nube (Vercel + Neon Cloud PostgreSQL)**
   - Despliegue productivo serverless conectado directamente al repositorio oficial en GitHub.
   - Ideal para compartir un enlace público en el informe o mostrar el acceso móvil real desde cualquier red.

---

## 2. CÓMO MOSTRAR EL SISTEMA EN LA EVALUACIÓN LOCAL (PASO A PASO)

### Paso 1: Iniciar el Sistema
Haz doble clic sobre [`INICIAR_PROTOTIPO_FASE2.bat`](file:///c:/Users/MAANDO/Desktop/PROYECTO%20DE%20TITULO/INICIAR_PROTOTIPO_FASE2.bat) en la carpeta principal del proyecto.
El script abrirá automáticamente tu navegador en `http://localhost:3000`.

### Paso 2: Flujo de Demostración Recomendado ante la Comisión (7 a 10 minutos)

1. **Portada y Acceso Unificado (`http://localhost:3000/login` o `/`):**
   - Muestra la estética limpia, luminosa y accesible (**WCAG 2.1 AA**).
   - Destaca los **botones de acceso rápido de 1-clic** diseñados para agilizar la prueba del comité evaluador.
   - Resalta que tu correo personal `benjamin54144752123@gmail.com` está configurado como el **Super Administrador** (`OWNER`).

2. **Portal del Docente (`http://localhost:3000/docente`):**
   - Haz clic en *"Docente"* y crea una reserva de prueba para el Auditorio Magna.
   - Selecciona fecha, horario y añade micrófonos y proyector láser.
   - Muestra el botón **`Ver Mi Pase QR`** y explica que ese es el código unívoco que el docente presenta en su teléfono.

3. **Portal del Encargado de Recintos (`http://localhost:3000/encargado`):**
   - Muestra cómo la solicitud aparece en la bandeja con su **score de prioridad académica**.
   - Haz clic en **`Aprobar Reserva`** (o muestra el modal de rechazo que exige justificación formal).

4. **Portal del Técnico de Soporte en Terreno (`http://localhost:3000/tecnico`):**
   - Abre la vista (o reduce el navegador a tamaño smartphone para mostrar la responsividad).
   - Muestra que los botones táctiles tienen más de 52px de altura para operar con una sola mano.
   - Pulsa **`Validar Check-in QR (< 30s)`**: se estampa la hora exacta de llegada.
   - Pulsa **`Completar Check-out y Retorno Equipos`**: muestra cómo el sistema calcula matemáticamente la diferencia temporal:
     $$\Delta T = T_{\text{checkout}} - T_{\text{checkin}}$$
     generando el registro de horas dedicadas de soporte TI en la base de datos.

5. **Portal de Administración General (`http://localhost:3000/admin`):**
   - Ingresa como Super Administrador (`benjamin54144752123@gmail.com`).
   - **Pestaña `Agenda y Reservas`:** Haz clic en **`Modificar Horario / Datos`**. Muestra que el botón de guardado **está completamente bloqueado** hasta marcar la casilla de seguridad obligatoria: *"Sí, confirmo bajo mi rol de Administrador..."*. Explica que esto evita accidentes operativos y queda firmado en la bitácora (`HORARIO_MODIFICADO_ADMIN`).
   - **Pestaña `Salud y Mantenimiento`:** Muestra la card del Auditorio Magna, los 4 KPIs (Operatividad, Casos en Taller, Downtime acumulado y MTTR) y los **gráficos analíticos de barras y radiales**.
   - Muestra el botón **`Registrar Novedad / Mantención`** para enviar un equipo a taller y luego el botón **`Resolver y Restaurar`** con constancia técnica obligatoria.
   - **Pestaña `Funcionarios y Cuadrillas`:** Muestra el panel CRUD para gestionar correos de Aseo, Guardia y TI.
   - **Pestaña `Bitácora de Auditoría`:** Muestra la trazabilidad inmutable de todas las acciones con fecha, operador y detalle.

---

## 3. DESPLIEGUE CONTINUO EN LA NUBE (VERCEL + NEON CLOUD POSTGRESQL)

El código fuente ya está arquitectónicamente preparado para operar en la nube:

### Paso 1: Configurar Base de Datos Serverless en Neon Cloud
1. Ingresa a [Neon.tech](https://neon.tech) e inicia sesión con GitHub o Google.
2. Crea un nuevo proyecto: `sistema-gestion-auditorios-duoc`.
3. Copia la cadena de conexión de PostgreSQL proporcionada:
   ```env
   DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

### Paso 2: Ejecutar Migraciones y Semillero hacia Neon
En la consola de tu equipo, apunta temporalmente la variable y sincroniza las 10 tablas:
```bash
cd "c:\Users\MAANDO\Desktop\PROYECTO DE TITULO\objetos proyecto de titulo"
npx prisma db push
node prisma/seed.js
```

### Paso 3: Conectar Vercel con el Repositorio de GitHub
1. Ingresa a [Vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **`Add New... -> Project`**.
3. Selecciona el repositorio: `IMANDOI/sistema-gestion-auditorios-capstone`.
4. En **Root Directory**, selecciona la carpeta `objetos proyecto de titulo` (donde reside el archivo `package.json`).
5. En **Environment Variables**, añade:
   - `DATABASE_URL`: La URL de conexión de Neon PostgreSQL.
   - `JWT_SECRET`: Una clave segura (ej: `DuocCapstoneKey2026!SecretAuditSystem`).
   - `NEXT_PUBLIC_APP_URL`: La URL productiva que Vercel te asignará (ej: `https://auditorios-capstone.vercel.app`).
6. Haz clic en **`Deploy`**. En menos de 2 minutos, Vercel compilará la aplicación y te entregará el enlace público HTTPS con certificado SSL automático.

---

## 4. RESUMEN DE CREDENCIALES PARA LA PRESENTACIÓN

| Perfil | Correo Electrónico | Contraseña | Rol en Sistema |
| :--- | :--- | :--- | :--- |
| **Super Administrador** | `benjamin54144752123@gmail.com` | `Capstone2026!` | OWNER / IT_ADMIN |
| **Encargada Recintos** | `coordinacion@institucion.cl` | `Capstone2026!` | ENCARGADO_RECINTOS |
| **Soporte TI Terreno** | `soporte.ti@institucion.cl` | `Capstone2026!` | TECNICO_TI |
| **Docente Solicitante** | `patricia.gonzalez@institucion.cl` | `Capstone2026!` | DOCENTE |

---
*Guía elaborada para Benjamín Navarrete — Proyecto Capstone 2026 — Duoc UC*
