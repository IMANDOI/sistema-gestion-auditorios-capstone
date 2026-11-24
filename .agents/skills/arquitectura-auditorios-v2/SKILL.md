---
name: arquitectura-auditorios-v2
description: >-
  Mapa quirúrgico de la base de código Next.js 15, Prisma 6, seguridad HMAC-SHA256,
  resiliencia Offline-First, integraciones RFC 5545/Webhooks y suite ISO/IEC 25010.
---

# Arquitectura v2.0 — Sistema Autónomo de Auditorios

Usa esta skill antes de tocar cualquier archivo dentro de `objetos proyecto de titulo/` para evitar exploraciones innecesarias.

## 1. Mapa Exacto de Módulos Críticos
- `objetos proyecto de titulo/prisma/schema.prisma`: `10` modelos en 3FN (`User`, `Auditorio`, `Reserva`, `Equipamiento`, `ReservaEquipamiento`, `RegistroHorasTI`, `EncuestaSatisfaccion`, `SuscripcionArea`, `RegistroAuditoria`, `RegistroMantenimiento`) + `4` índices compuestos B-Tree (`@@index([auditorioId, status, startTime, endTime])`, `@@index([userId, createdAt])`, `@@index([entity, createdAt])`, `@@index([status, severity])`).
- `objetos proyecto de titulo/src/lib/actions.ts`: Server Actions RPC con `prisma.$transaction` anti-TOCTOU, agregaciones SQL `O(1)` (`aggregate` + `take: 250`) en `getDashboardData()`, cómputo `Delta-T` y constancia técnica obligatoria en taller.
- `objetos proyecto de titulo/src/lib/qr-security.ts`: `generateSignedQrToken` y `verifySignedQrToken` (`QR2.<reservaId>.<endUnix>.<hmacHex16>`) usando `HMAC-SHA256` y `crypto.timingSafeEqual`.
- `objetos proyecto de titulo/src/lib/integrations.ts`: `generateInstitutionalICS` (RFC 5545 `.ics` con `VALARM -PT15M` para Outlook 365 / Teams) y `buildCrewWebhookPayload` (Teams Adaptive Cards v1.4 + Telegram Bot API).
- `objetos proyecto de titulo/src/components/CameraQRScanner.tsx`: Lector QR multi-tier en canvas virtual off-DOM (`420px`, `~12 ms`) + cola `Offline-First` (`auditorio_offline_checkin_queue_v2` en `localStorage`) con auto-sincronización al evento `online`.
- `objetos proyecto de titulo/src/app/docente/page.tsx`: Portal docente con exportación directa `.ics`.
- `objetos proyecto de titulo/tests/iso25010.test.mjs`: `12` pruebas automatizadas (`CP-FUNC-01a/b` a `CP-INT-02`).
- `objetos proyecto de titulo/tests/benchmark_iso25010.mjs`: Benchmark de carga (`3,500` ops) + hashes SHA-256.

## 2. Comandos de Validación Oficiales (Windows)
Ejecutar dentro de `objetos proyecto de titulo/`:
```powershell
node --test tests/iso25010.test.mjs; if ($?) { node tests/benchmark_iso25010.mjs }; if ($?) { npx.cmd tsc --noEmit }; if ($?) { npm.cmd run build }
```
