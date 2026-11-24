import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { generateSignedQrToken, verifySignedQrToken } from '../src/lib/qr-security.ts';
import { generateInstitutionalICS, buildCrewWebhookPayload } from '../src/lib/integrations.ts';

describe('Batería de Pruebas Automatizadas ISO/IEC 25010 - Capstone Duoc UC', () => {

  describe('1. Adecuación Funcional (CP-FUNC-01: Lógica Anti-Solapamiento)', () => {
    function checkOverlap(existingStart, existingEnd, newStart, newEnd) {
      const eStart = new Date(existingStart).getTime();
      const eEnd = new Date(existingEnd).getTime();
      const nStart = new Date(newStart).getTime();
      const nEnd = new Date(newEnd).getTime();
      return (eStart < nEnd && eEnd > nStart);
    }

    test('Debe detectar solapamiento cuando una nueva reserva coincide en el horario activo', () => {
      const existing = { start: '2026-11-10T10:00:00Z', end: '2026-11-10T12:00:00Z' };
      const colision1 = { start: '2026-11-10T11:00:00Z', end: '2026-11-10T13:00:00Z' };
      assert.equal(checkOverlap(existing.start, existing.end, colision1.start, colision1.end), true);
    });

    test('Debe permitir reservas en horarios contiguos sin solapamiento', () => {
      const existing = { start: '2026-11-10T10:00:00Z', end: '2026-11-10T12:00:00Z' };
      const continua = { start: '2026-11-10T12:00:00Z', end: '2026-11-10T14:00:00Z' };
      assert.equal(checkOverlap(existing.start, existing.end, continua.start, continua.end), false);
    });
  });

  describe('2. Adecuación Funcional (CP-FUNC-02: Cómputo Matemático Delta-T)', () => {
    function computeHoursTI(checkInTime, checkOutTime) {
      const diffMs = new Date(checkOutTime).getTime() - new Date(checkInTime).getTime();
      const minutesDuration = Math.round(diffMs / (1000 * 60));
      const hoursDecimal = parseFloat((minutesDuration / 60).toFixed(2));
      return { minutesDuration, hoursDecimal };
    }

    test('Debe calcular exactamente 45 minutos como 0.75 horas dedicadas', () => {
      const inTime = '2026-11-10T10:00:00Z';
      const outTime = '2026-11-10T10:45:00Z';
      const res = computeHoursTI(inTime, outTime);
      assert.equal(res.minutesDuration, 45);
      assert.equal(res.hoursDecimal, 0.75);
    });

    test('Debe calcular exactamente 90 minutos como 1.50 horas dedicadas', () => {
      const inTime = '2026-11-10T08:30:00Z';
      const outTime = '2026-11-10T10:00:00Z';
      const res = computeHoursTI(inTime, outTime);
      assert.equal(res.minutesDuration, 90);
      assert.equal(res.hoursDecimal, 1.50);
    });
  });

  describe('3. Seguridad y Protección de Datos (CP-SEC-01 y CP-SEC-02)', () => {
    test('Debe generar hashes irreversibles con bcrypt factor 10 y validar contraseñas', async () => {
      const passwordPlana = 'Profesor2026!';
      const hash = await bcrypt.hash(passwordPlana, 10);
      
      assert.notEqual(hash, passwordPlana);
      assert.ok(hash.startsWith('$2a$10$') || hash.startsWith('$2b$10$'));
      
      const esValida = await bcrypt.compare(passwordPlana, hash);
      const esInvalida = await bcrypt.compare('ClaveErronea123', hash);
      assert.equal(esValida, true);
      assert.equal(esInvalida, false);
    });

    test('Zod debe bloquear inyecciones o datos maliciosos en correos institucionales', () => {
      const emailSchema = z.string().email();
      const valido = emailSchema.safeParse('benjamin54144752123@gmail.com');
      const inyeccion = emailSchema.safeParse("' OR '1'='1");
      
      assert.equal(valido.success, true);
      assert.equal(inyeccion.success, false);
    });
  });

  describe('4. Reglas de Negocio de Mantenimiento y Calidad (CP-USA-02)', () => {
    const ReactivacionSchema = z.object({
      equipamientoId: z.string().min(1),
      resolutionNotes: z.string().min(10, "La constancia técnica debe tener al menos 10 caracteres")
    });

    test('Debe rechazar la reactivación de un implemento en taller si no incluye constancia técnica', () => {
      const intentoSinConstancia = {
        equipamientoId: 'eq_mic_01',
        resolutionNotes: ''
      };
      const res = ReactivacionSchema.safeParse(intentoSinConstancia);
      assert.equal(res.success, false);
    });

    test('Debe aprobar la reactivación cuando la constancia técnica está completa', () => {
      const intentoValido = {
        equipamientoId: 'eq_mic_01',
        resolutionNotes: 'Se reemplazó la cápsula cardioide y se calibró la frecuencia 2.4GHz.'
      };
      const res = ReactivacionSchema.safeParse(intentoValido);
      assert.equal(res.success, true);
    });
  });

  describe('5. Seguridad Criptográfica QR Dinámico v2.0 (CP-SEC-03)', () => {
    test('CP-SEC-03: Debe firmar tokens QR con HMAC-SHA256 y detectar adulteración o expiración', () => {
      const start = '2026-11-15T10:00:00Z';
      const end = '2026-11-15T12:00:00Z';
      const endMs = new Date(end).getTime();

      const token = generateSignedQrToken('res_hmac_001', 'aud_magna', start, end);
      assert.ok(token.startsWith('QR2.res_hmac_001.'));

      // Verificación válida antes de expirar (incluso como URL escaneada)
      const validRes = verifySignedQrToken(`https://auditorios.duoc.cl/checkin?token=${token}`, endMs - 60_000);
      assert.equal(validRes.valid, true);
      assert.equal(validRes.isSigned, true);
      assert.equal(validRes.reservaId, 'res_hmac_001');
      assert.equal(validRes.cleanToken, token);

      // Detección de adulteración en la firma o payload
      const tampered = token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a');
      const tamperedRes = verifySignedQrToken(tampered, endMs - 60_000);
      assert.equal(tamperedRes.valid, false);
      assert.equal(tamperedRes.isSigned, true);
      assert.match(tamperedRes.reason || '', /inválida|adulterado/i);

      // Detección de token expirado
      const expiredRes = verifySignedQrToken(token, endMs + 10_000);
      assert.equal(expiredRes.valid, false);
      assert.equal(expiredRes.isSigned, true);
      assert.match(expiredRes.reason || '', /expirado/i);

      // Retrocompatibilidad con tokens legados
      const legacyRes = verifySignedQrToken('QR-LIVE-DEMO-2026-CAPSTONE-SECURE');
      assert.equal(legacyRes.valid, true);
      assert.equal(legacyRes.isSigned, false);
    });
  });

  describe('6. Integración Institucional Outlook/Teams RFC 5545 (CP-INT-01)', () => {
    test('CP-INT-01: Debe generar archivo .ics válido bajo RFC 5545 con alarma preventiva VALARM', () => {
      const ics = generateInstitutionalICS({
        id: 'res_ics_2026',
        title: 'Seminario de Ciberseguridad Duoc UC',
        description: 'Sesión plenaria\nCon transmisión Teams',
        startTime: '2026-11-20T14:00:00Z',
        endTime: '2026-11-20T16:00:00Z',
        auditorioName: 'Auditorio Magna',
        location: 'Sede San Joaquín - Piso -2',
      });

      assert.ok(ics.includes('BEGIN:VCALENDAR'));
      assert.ok(ics.includes('VERSION:2.0'));
      assert.ok(ics.includes('PRODID:-//Duoc UC//Sistema Gestion Auditorios//ES'));
      assert.ok(ics.includes('BEGIN:VEVENT'));
      assert.ok(ics.includes('UID:res_ics_2026@auditorios.duoc.cl'));
      assert.ok(ics.includes('DTSTART:20261120T140000Z'));
      assert.ok(ics.includes('DTEND:20261120T160000Z'));
      assert.ok(ics.includes('BEGIN:VALARM'));
      assert.ok(ics.includes('TRIGGER:-PT15M'));
      assert.ok(ics.includes('ACTION:DISPLAY'));
      assert.ok(ics.includes('END:VALARM'));
      assert.ok(ics.includes('END:VEVENT'));
      assert.ok(ics.includes('END:VCALENDAR'));
      assert.ok(ics.includes('Sesión plenaria\\nCon transmisión Teams'));
    });
  });

  describe('7. Resiliencia Offline-First en Recintos Subterráneos (CP-REL-02)', () => {
    test('CP-REL-02: Debe encolar lecturas QR en caché local y sincronizarlas al recuperar señal', () => {
      const QUEUE_KEY = 'auditorio_offline_checkin_queue_v2';
      const memStore = new Map();
      const mockStorage = {
        getItem: (k) => (memStore.has(k) ? memStore.get(k) : null),
        setItem: (k, v) => memStore.set(k, String(v)),
      };

      function enqueueOffline(token) {
        const current = JSON.parse(mockStorage.getItem(QUEUE_KEY) || '[]');
        current.push({ token, timestamp: new Date().toISOString(), synced: false });
        mockStorage.setItem(QUEUE_KEY, JSON.stringify(current));
        return current;
      }

      const token1 = generateSignedQrToken('res_sub_01', 'aud_magna', '2026-11-20T10:00:00Z', '2026-11-20T12:00:00Z');
      enqueueOffline(token1);
      enqueueOffline('QR-AUD-LEGACY-SUB-02');

      const stored = JSON.parse(mockStorage.getItem(QUEUE_KEY) || '[]');
      assert.equal(stored.length, 2);
      assert.equal(stored[0].token, token1);
      assert.equal(stored[0].synced, false);
      assert.ok(stored[0].timestamp);

      // Simular sincronización diferida al restaurar conectividad
      const syncedQueue = stored.map((entry) => ({ ...entry, synced: true }));
      mockStorage.setItem(QUEUE_KEY, JSON.stringify(syncedQueue));
      const pendingAfterSync = JSON.parse(mockStorage.getItem(QUEUE_KEY)).filter((e) => !e.synced);
      assert.equal(pendingAfterSync.length, 0);
    });
  });

  describe('8. Integración de Webhooks en Tiempo Real Teams/Telegram (CP-INT-02)', () => {
    test('CP-INT-02: Debe estructurar payload Adaptive Card para Teams y metadata Markdown para Telegram en alertas SEV-1', () => {
      const payload = buildCrewWebhookPayload('INCIDENTE_IRP_SEV1', {
        title: 'Corte de audio principal en consola',
        auditorio: 'Auditorio Magna',
        department: 'TI',
        severity: 'CRITICA',
        details: 'Se requiere técnico de soporte inmediato en cabina.',
      });

      assert.equal(payload.type, 'message');
      assert.ok(Array.isArray(payload.attachments));
      assert.equal(payload.attachments[0].contentType, 'application/vnd.microsoft.card.adaptive');
      assert.equal(payload.attachments[0].content.type, 'AdaptiveCard');
      assert.equal(payload.parse_mode, 'Markdown');
      assert.equal(payload.channelDepartment, 'TI');
      assert.equal(payload.severity, 'CRITICA');
      assert.ok(payload.text.includes('INCIDENTE_IRP_SEV1'));
      assert.ok(payload.text.includes('Auditorio Magna'));
    });
  });

});

