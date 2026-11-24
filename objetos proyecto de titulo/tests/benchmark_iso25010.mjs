import { performance } from 'node:perf_hooks';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { z } from 'zod';
import { generateSignedQrToken, verifySignedQrToken } from '../src/lib/qr-security.ts';
import { generateInstitutionalICS } from '../src/lib/integrations.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEST_SUITE_PATH = resolve(__dirname, 'iso25010.test.mjs');
const JUNIT_XML_PATH = resolve(
  __dirname,
  '../../Fase 2/Evidencias Proyecto/04_Pruebas_Calidad_ISO25010/junit_iso25010_v2.xml'
);
const OUT_JSON_PATH = resolve(
  __dirname,
  '../../Fase 2/Evidencias Proyecto/04_Pruebas_Calidad_ISO25010/benchmark_iso25010_v2.json'
);

function sha256File(filePath) {
  const buf = readFileSync(filePath);
  return createHash('sha256').update(buf).digest('hex');
}

function checkOverlap(existingStart, existingEnd, newStart, newEnd) {
  const eStart = new Date(existingStart).getTime();
  const eEnd = new Date(existingEnd).getTime();
  const nStart = new Date(newStart).getTime();
  const nEnd = new Date(newEnd).getTime();
  return eStart < nEnd && eEnd > nStart;
}

function percentile95(sortedLatencies) {
  if (sortedLatencies.length === 0) return 0;
  const idx = Math.min(
    sortedLatencies.length - 1,
    Math.ceil(sortedLatencies.length * 0.95) - 1
  );
  return sortedLatencies[idx];
}

function runBenchmark(id, nombre, normaIso, iterations, fn) {
  // Precalentamiento breve de JIT (V8) para estabilizar mediciones
  const warmup = Math.min(50, Math.floor(iterations * 0.05));
  for (let w = 0; w < warmup; w++) {
    fn(w);
  }

  const latencies = new Array(iterations);
  const suiteStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const t0 = performance.now();
    fn(i);
    const t1 = performance.now();
    latencies[i] = t1 - t0;
  }
  const suiteEnd = performance.now();

  const totalDurationMs = suiteEnd - suiteStart;
  const sumLatencies = latencies.reduce((acc, v) => acc + v, 0);
  const avgLatencyMs = sumLatencies / iterations;
  const sorted = [...latencies].sort((a, b) => a - b);
  const p95LatencyMs = percentile95(sorted);
  const minLatencyMs = sorted[0];
  const maxLatencyMs = sorted[sorted.length - 1];
  const throughputOpsSec = totalDurationMs > 0 ? (iterations / totalDurationMs) * 1000 : 0;

  return {
    id,
    nombre,
    normaIso,
    operaciones: iterations,
    duracionTotalMs: Number(totalDurationMs.toFixed(4)),
    latenciaPromedioMs: Number(avgLatencyMs.toFixed(6)),
    latenciaP95Ms: Number(p95LatencyMs.toFixed(6)),
    latenciaMinMs: Number(minLatencyMs.toFixed(6)),
    latenciaMaxMs: Number(maxLatencyMs.toFixed(6)),
    throughputOpsSeg: Number(throughputOpsSec.toFixed(2)),
  };
}

// 1. CP-FUNC-01: 1,000 verificaciones anti-solapamiento horario
const benchFunc01 = runBenchmark(
  'CP-FUNC-01',
  'Verificación Anti-Solapamiento Horario',
  'Adecuación Funcional',
  1000,
  (i) => {
    const existingStart = '2026-11-10T10:00:00Z';
    const existingEnd = '2026-11-10T12:00:00Z';
    const isCollision = i % 2 === 0;
    const newStart = isCollision ? '2026-11-10T11:00:00Z' : '2026-11-10T12:00:00Z';
    const newEnd = isCollision ? '2026-11-10T13:00:00Z' : '2026-11-10T14:00:00Z';
    const overlap = checkOverlap(existingStart, existingEnd, newStart, newEnd);
    assert.equal(overlap, isCollision);
  }
);

// 2. CP-SEC-03: 1,000 ciclos completos de firma + verificación QR2 HMAC-SHA256 timingSafeEqual
const qrStart = '2026-11-24T10:00:00Z';
const qrEnd = '2026-11-24T12:00:00Z';
const qrCheckNowMs = new Date('2026-11-24T11:00:00Z').getTime();
const benchSec03 = runBenchmark(
  'CP-SEC-03',
  'Ciclo Firma + Verificación QR2 HMAC-SHA256 (timingSafeEqual)',
  'Seguridad Criptográfica',
  1000,
  (i) => {
    const reservaId = `res_bench_${i}`;
    const token = generateSignedQrToken(reservaId, 'aud_magna', qrStart, qrEnd);
    const verified = verifySignedQrToken(token, qrCheckNowMs);
    assert.equal(verified.valid, true);
    assert.equal(verified.isSigned, true);
    assert.equal(verified.reservaId, reservaId);
  }
);

// 3. CP-INT-01: 500 generaciones RFC 5545 .ics con VALARM -PT15M
const benchInt01 = runBenchmark(
  'CP-INT-01',
  'Generación iCalendar RFC 5545 (.ics con VALARM -PT15M)',
  'Interoperabilidad',
  500,
  (i) => {
    const ics = generateInstitutionalICS({
      id: `res_ics_bench_${i}`,
      title: `Seminario Técnico Capstone #${i}`,
      description: 'Sesión evaluativa en Auditorio Magna',
      startTime: '2026-11-24T14:00:00Z',
      endTime: '2026-11-24T16:00:00Z',
      auditorioName: 'Auditorio Magna',
      location: 'Edificio A - Nivel Central',
    });
    assert.ok(ics.includes('BEGIN:VALARM'));
    assert.ok(ics.includes('TRIGGER:-PT15M'));
  }
);

// 4. CP-SEC-02: 1,000 bloqueos Zod contra payload de inyección SQLi
const emailSchema = z.string().email();
const sqliPayloads = [
  "' OR '1'='1",
  "admin'--",
  "'; DROP TABLE Reserva;--",
  "1' UNION SELECT * FROM User--",
];
const benchSec02 = runBenchmark(
  'CP-SEC-02',
  'Bloqueo Zod contra Payloads de Inyección SQLi',
  'Seguridad (OWASP A03)',
  1000,
  (i) => {
    const payload = sqliPayloads[i % sqliPayloads.length];
    const parsed = emailSchema.safeParse(payload);
    assert.equal(parsed.success, false);
  }
);

const escenarios = [benchFunc01, benchSec03, benchInt01, benchSec02];
const totalOperaciones = escenarios.reduce((acc, e) => acc + e.operaciones, 0);
const duracionAcumuladaMs = Number(
  escenarios.reduce((acc, e) => acc + e.duracionTotalMs, 0).toFixed(4)
);

const report = {
  metadata: {
    proyecto: 'Sistema de Gestión y Control Operativo de Auditorios (SIGOA)',
    asignatura: 'ASIGNATURA CAPSTONE (PTY4614 - 002D)',
    estudiante: 'Benjamin Navarrete',
    versionArquitectura: 'v2.0',
    fechaEjecucionIso: new Date().toISOString(),
    entorno: {
      nodeVersion: process.version,
      plataforma: process.platform,
      arquitectura: process.arch,
    },
    totalOperaciones,
    duracionAcumuladaMs,
  },
  integridadSha256: {
    suitePruebas: {
      archivo: 'objetos proyecto de titulo/tests/iso25010.test.mjs',
      sha256: sha256File(TEST_SUITE_PATH),
    },
    reporteJunitXml: {
      archivo: 'Fase 2/Evidencias Proyecto/04_Pruebas_Calidad_ISO25010/junit_iso25010_v2.xml',
      sha256: sha256File(JUNIT_XML_PATH),
    },
  },
  escenarios,
};

writeFileSync(OUT_JSON_PATH, JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(report, null, 2));
