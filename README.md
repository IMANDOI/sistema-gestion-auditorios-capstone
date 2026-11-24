# Sistema de Gestión y Control Operativo de Auditorios (SIGOA)

> **ASIGNATURA CAPSTONE (`PTY4614 - 002D`)** — Escuela de Informática y Telecomunicaciones, **Duoc UC**  
> **Estudiante Responsable:** Benjamin Navarrete · **Profesor Guía:** Diego Garcés M.  
> **Producción Cloud (Vercel + Neon PostgreSQL):** https://sistema-gestion-auditorios-capstone.vercel.app

---

## Estructura Oficial del Repositorio (`IE 7` · `IE 9`)

```text
├── Fase 1/                                     # Documentación y definición inicial del Proyecto APT
│   ├── Evidencias Grupales/                    # Guía 1.5, informe Fase 1 y guion inicial
│   └── Evidencias Individuales/                # Autoevaluación Fase 1
├── Fase 2/                                     # Entregables finales, evidencias y certificación
│   ├── 2.6_GuiaEstudiante_Fase_2_Informe_Final_Proyecto_APT_Benjamin_Navarrete.docx
│   ├── Presentacion_Final_Proyecto_APT_20min_Benjamin_Navarrete.pptx
│   ├── Evidencias Grupales/                    # Copias oficiales, Carta Gantt, capturas (Fig. 1–18), manuales e IRP
│   ├── Evidencias Individuales/readme.txt      # Registro de trazabilidad individual
│   └── Evidencias Proyecto/
│       └── 04_Pruebas_Calidad_ISO25010/        # Log empírico, JUnit XML, benchmark JSON y reporte HTML v2.0
├── objetos proyecto de titulo/                 # Código fuente Next.js 15 + Prisma 6 + Suite ISO/IEC 25010
│   ├── prisma/                                 # Esquema 3FN (10 modelos, 4 índices @@index) y seed
│   ├── src/                                    # 24 Server Actions, QR2 HMAC-SHA256, RFC 5545 .ics, Offline-First
│   └── tests/                                  # 12/12 pruebas ISO/IEC 25010 (node --test) y benchmark 3.500 ops
├── .github/workflows/ci.yml                    # Pipeline de Integración Continua en GitHub Actions
├── AGENTS.md                                   # Reglas maestras de consistencia del proyecto
├── MAPA_DEL_PROYECTO.md                        # Mapa de módulos y rutas
└── PROJECT_STATE.md                            # Estado arquitectónico consolidado v2.0
```

---

## Arquitectura v2.0 y Resultados Verificados

| Dimensión | Implementación Verificada |
| :--- | :--- |
| **Stack Web & Nube** | Next.js 15 (`App Router`), React 19, TypeScript 5 estricto, `24` Server Actions, Vercel + Neon Cloud PostgreSQL |
| **Modelo de Datos 3FN** | `10` entidades Prisma, `4` índices compuestos B-Tree (`@@index`), `prisma.$transaction` ACID y agregaciones SQL `O(1)` |
| **Escaneo QR2 & Offline** | Pases `QR2` firmados con `HMAC-SHA256` (`timingSafeEqual`), escáner off-DOM `~12 ms` y cola local `Offline-First` |
| **Interoperabilidad & RPA** | Exportación `.ics` (`RFC 5545` con `VALARM -PT15M`), Webhooks Teams Adaptive Cards v1.4 / Telegram y `4` Bots RPA |
| **Seguridad & IRP** | RBAC por mínimo privilegio, `bcrypt` (factor 10), Zod OWASP A03, cookies `HttpOnly`, bitácora `Append-Only` e IRP `SEV-1..4` |
| **Certificación ISO/IEC 25010** | `12/12` pruebas automatizadas aprobadas (`0` fallos), benchmark `3.500` ops en `31.15 ms` y `0` errores de compilación |

---

## Verificación Local Rápida

```bash
cd "objetos proyecto de titulo"
npm ci
npx prisma generate
npx tsc --noEmit
npm test
```
