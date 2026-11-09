import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

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

});

