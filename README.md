# Sistema Autónomo de Gestión Operativa, Trazabilidad, Analítica y Ciberseguridad para Auditorios

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.1.12-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-6.3-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma ORM" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon_Cloud-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="Neon PostgreSQL" />
  <img src="https://img.shields.io/badge/Vercel-Edge_Network-black?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/ISO%2FIEC-25010_Certified-brightgreen?style=for-the-badge" alt="ISO 25010" />
  <img src="https://img.shields.io/badge/WCAG_2.1-AA_Compliant-orange?style=for-the-badge" alt="WCAG 2.1 AA" />
</p>

<p align="center">
  <b>Portafolio de Título (Capstone - PTY4614 / APT122)</b><br>
  Escuela de Informática y Telecomunicaciones — <b>Duoc UC</b><br>
  <b>Líder Técnico & Desarrollador Principal:</b> Benjamín Navarrete
</p>

<p align="center">
  <a href="https://sistema-gestion-auditorios-capstone.vercel.app">
    <img src="https://img.shields.io/badge/🚀_PRODUCCIÓN_CLOUD-VERCEL_LIVE-002B49?style=for-the-badge" alt="Live Demo" />
  </a>
  <a href="https://github.com/IMANDOI/sistema-gestion-auditorios-capstone">
    <img src="https://img.shields.io/badge/💻_REPOSITORIO-GITHUB_OFFICIAL-181717?style=for-the-badge" alt="GitHub Repo" />
  </a>
</p>

---

## 📌 Resumen Ejecutivo del Proyecto

El **Sistema Autónomo de Gestión Operativa de Auditorios** es una plataforma web reactiva de grado industrial y arquitectura desacoplada (*White-Label*), concebida para resolver la ineficiencia logística, el solapamiento de agendas y el desperdicio de horas de soporte técnico audiovisual en instituciones de educación superior y complejos corporativos.

### 🎯 Dolores Operacionales Resueltos
1. **Eliminación del Cuello de Botella de TI:** Reduce el tiempo de espera pasiva del personal audiovisual de **hasta 1 hora a menos de 15 segundos** mediante validación presencial con **Pases QR criptográficos 2D** escaneables por cámara web o móvil con auto-apagado de stream.
2. **Cómputo Matemático de Horas de Soporte (Delta-T):** Registra con exactitud milimétrica el tiempo real que el técnico asiste al docente en sala (`checkoutTime - checkInTime`), calculando horas hombre ahorradas y costos operativos.
3. **Control Cívico de No-Shows:** Automatización mediante **bots RPA** que liberan auditorios desatendidos tras 15 minutos de inasistencia y ajustan el puntaje de prioridad cívico (`priorityScore`) del solicitante.
4. **Sincronización Automática con Cuadrillas:** Despacho automatizado de cronogramas a las unidades de **Aseo, Guardia y TI** con requerimientos específicos de apertura de accesos e higiene.
5. **Dashboard de Salud Operacional & MTTR:** Telemetría de disponibilidad del parque de implementos, registro de downtime acumulado y cálculo del **Mean Time to Repair (MTTR)** con constancias técnicas obligatorias de taller.
6. **Plan de Respuesta a Incidentes (IRP):** Módulo de contingencia interactivo con clasificación de severidades **SEV-1 (Crítica)** a **SEV-4 (Leve)**.

---

## 🏗️ Arquitectura Técnica y Stack de Ingeniería

El sistema opera bajo una arquitectura **Serverless / Edge**, desacoplando la capa de presentación de la persistencia de datos mediante transacciones atómicas y seguridad perimetral.

```mermaid
flowchart TD
    subgraph Cliente [Frontend Accesible - Mobile First]
        A["📱 Dispositivo Móvil / Laptop"] -->|HTTPS / TLS 1.3| B["Next.js 15 (App Router)"]
        B --> C["React 19 + Tailwind CSS + WCAG 2.1 AA"]
        C --> D["Lector QR (Canvas HTML5 / attemptBoth)"]
    end

    subgraph Backend [Backend Seguro en Servidor]
        B --> E["Next.js Server Actions (RPC Interno)"]
        E --> F["Validación de Entrada con Zod"]
        E --> G["Autenticación RBAC + Bcrypt (Salt 10)"]
        E --> H["Cookies HttpOnly / Secure / SameSite=Lax"]
    end

    subgraph Persistencia [Persistencia Serverless en la Nube]
        E --> I["Prisma 6 ORM (Prepared Statements)"]
        I -->|Connection Pooling (PgBouncer)| J[("PostgreSQL Serverless en Neon Tech")]
        I -.->|Entorno Local| K[("SQLite Local dev.db")]
    end

    subgraph Automatizacion [Automatización & Auditoría]
        E --> L["4 Bots RPA de Contingencia"]
        E --> M["Bitácora Forense Append-Only (RegistroAuditoria)"]
    end
```

### 🛠️ Tecnologías Empleadas
* **Capa Web:** Next.js 15.1.12, React 19.0.0, TypeScript 5.7.3, Lucide React Icons.
* **Estilos & Diseño:** Tailwind CSS 3.4.17 (Enfoque Mobile-First, responsive).
* **Lógica de Servidor:** Next.js Server Actions (sin endpoints REST públicos vulnerables).
* **Base de Datos & ORM:** Prisma 6.3.1 con PostgreSQL Serverless en Neon Cloud (Producción) y SQLite (Desarrollo).
* **Ciberseguridad:** `bcryptjs` (factor de costo 10), cookies seguras, validación estricta con `zod`.
* **Despliegue & CI/CD:** Vercel Edge Network global con integración continua desde GitHub.

---

## 🔒 Marco de Ciberseguridad Defensiva (OWASP Top 10)

| Vulnerabilidad OWASP | Riesgo Potencial | Mitigación Implementada en el Código |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | Acceso horizontal a datos ajenos | Control de acceso basado en roles (**RBAC: Owner, IT_Admin, IT_Service, Professor**) y claves primarias criptográficas **CUID** (anti-IDOR). |
| **A02: Cryptographic Failures** | Exposición de credenciales | Hashing unidireccional de contraseñas con `bcrypt` (salt rounds 10). Tokens en cookies con flags `HttpOnly`, `Secure` y `SameSite=Lax`. |
| **A03: Injection (SQLi)** | Corrupción o robo de la base de datos | **Prisma ORM** ejecuta exclusivamente *Prepared Statements* parametrizadas. Ningún dato de usuario se concatena a código SQL. |
| **A07: Identification Failures** | Robo o secuestro de sesión | Invalidación estricta de tokens al cerrar sesión y protección contra Session Hijacking vía cookies `HttpOnly`. |
| **A09: Security Logging Failures** | Acciones sin registro forense | Bitácora **`RegistroAuditoria`** inmutable (*Append-Only*). Sin permisos de `UPDATE` ni `DELETE` en código fuente. |

---

## 🧪 Certificación de Calidad de Software (ISO/IEC 25010)

El proyecto cuenta con una batería de pruebas automatizadas que certifica las 4 dimensiones clave de la norma ISO/IEC 25010:

```bash
# Ejecutar la suite formal de pruebas unitarias y de integración
npm test
```

### Resultados de la Batería de Pruebas:
* ✔️ **CP-FUNC-01 (Adecuación Funcional):** Algoritmo matemático anti-solapamiento de horarios `(startTime < newEnd && endTime > newStart)`.
* ✔️ **CP-FUNC-02 (Adecuación Funcional):** Cómputo exacto de horas técnicas dedicadas (Delta-T en minutos y fracción decimal).
* ✔️ **CP-SEC-01 (Ciberseguridad):** Sanitización de entradas y bloqueo de inyecciones SQL mediante esquemas **Zod**.
* ✔️ **CP-SEC-02 (Ciberseguridad):** Hashing irreversible de contraseñas con **bcryptjs** (factor >= 10).
* ✔️ **CP-USA-02 (Calidad Operacional):** Regla de negocio de constancia técnica obligatoria antes de devolver hardware de taller a pañol.

---

## 🔑 Credenciales de Prueba para Demostración (Demo Accounts)

Para facilitar la evaluación de la comisión evaluadora, el sistema cuenta con selector rápido de perfiles en `/login`:

| Rol del Sistema | Correo Electrónico | Contraseña | Alcance y Facultades |
| :--- | :--- | :--- | :--- |
| **Super Administrador** | `benjamin54144752123@gmail.com` | `Admin2026!` | Acceso global, reprogramación segura, bitácora forense, cuadrillas y bots RPA. |
| **Encargado de Recintos** | `encargado@duocuc.cl` | `Encargado2026!` | Bandeja de dictamen: aprobación de reservas y rechazo fundamentado. |
| **Soporte Técnico TI** | `tecnico@duocuc.cl` | `Tecnico2026!` | Validación presencial por QR, escáner de cámara web y registro de horas Delta-T. |
| **Docente Solicitante** | `docente@duocuc.cl` | `Docente2026!` | Formulario modular de solicitud, catálogo de equipos y pase QR 2D personal. |

---

## 📂 Estructura Oficial del Repositorio

El repositorio está organizado conforme a las exigencias académicas de Duoc UC y los estándares de ingeniería de software:

```text
├── Fase 1/                                  # Entregables Oficiales Fase 1 (Definición y SRS)
│   ├── Evidencias Grupales/                 # Guía 1.5, Especificación SRS IEEE 830, PPT Fase 1
│   └── Evidencias Individuales/             # Autoevaluación de competencias individuales
│
├── Fase 2/                                  # Entregables Oficiales Fase 2 (Desarrollo y Avance)
│   ├── Evidencias Grupales/                 # Guía 2.4 Oficial, Anexo A (13 figuras), Manual Maestro de Estudio
│   └── Evidencias Individuales/             # Bitácoras de trabajo individual
│
├── Fase 3/                                  # Entregables Oficiales Fase 3 (Certificación y Cierre)
│   ├── Evidencias Grupales/                 # Plan de Pruebas Formal ISO/IEC 25010 (Tarea T11)
│   └── Evidencias Individuales/             # Autoevaluación final de egreso
│
├── src/                                     # Código Fuente del Núcleo de la Aplicación
│   ├── app/                                 # Rutas de Next.js (/login, /docente, /tecnico, /admin)
│   ├── components/                          # Componentes modulares accesibles y Lector QR
│   └── lib/                                 # Server Actions, prisma client y utilidades
│
├── prisma/                                  # Persistencia y Modelado de Datos
│   └── schema.prisma                        # Los 10 modelos relacionales en 3FN
│
├── tests/                                   # Suite de Pruebas Automatizadas ISO/IEC 25010
│   └── iso25010.test.mjs                    # Pruebas unitarias ejecutadas con node:test
│
├── PROJECT_STATE.md                         # Memoria Técnica y Registro de Tareas T01-T12
└── MAPA_DEL_PROYECTO.md                     # Guía de Navegación y Arquitectura de Carpetas
```

---

## 🚀 Puesta en Marcha en Entorno Local (Quickstart)

```bash
# 1. Clonar el repositorio
git clone https://github.com/IMANDOI/sistema-gestion-auditorios-capstone.git
cd sistema-gestion-auditorios-capstone

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (.env)
# DATABASE_URL="postgresql://usuario:clave@host/db?sslmode=require"

# 4. Sincronizar el esquema de base de datos
npx prisma generate
npx prisma db push

# 5. Ejecutar suite de pruebas de calidad ISO 25010
npm test

# 6. Levantar servidor de desarrollo
npm run dev
# Abrir en el navegador: http://localhost:3000
```

---

<p align="center">
  <b>Proyecto Capstone 2026 — Escuela de Informática y Telecomunicaciones — Duoc UC</b><br>
  Desarrollado con rigor técnico, accesibilidad universal y ciberseguridad defensiva.
</p>
