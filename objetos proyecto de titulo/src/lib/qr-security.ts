import { createHmac, timingSafeEqual } from "crypto";

const DEFAULT_QR_SECRET = "duoc-capstone-pty4614-002d-hmac-key";

function getQrSecret(): string {
  return process.env.QR_SECRET || DEFAULT_QR_SECRET;
}

function toUnixSeconds(value: Date | string): number {
  const ms = value instanceof Date ? value.getTime() : new Date(value).getTime();
  if (!Number.isFinite(ms)) {
    throw new Error("Fecha inválida al generar token QR firmado.");
  }
  return Math.floor(ms / 1000);
}

function computeHmacHex16(reservaId: string, endUnix: number): string {
  return createHmac("sha256", getQrSecret())
    .update(`${reservaId}.${endUnix}`)
    .digest("hex")
    .slice(0, 16);
}

/**
 * Generates a self-contained dynamic QR token signed with HMAC-SHA256.
 * Format: QR2.<reservaId>.<endUnix>.<hmacHex16>
 * Signature binds reservaId and endUnix so verifySignedQrToken can verify offline without DB access.
 */
export function generateSignedQrToken(
  reservaId: string,
  auditorioId: string,
  startTime: Date | string,
  endTime: Date | string
): string {
  // Validate temporal bounds consistently while keeping verification payload self-contained
  void auditorioId;
  toUnixSeconds(startTime);
  const endUnix = toUnixSeconds(endTime);
  const hmacHex16 = computeHmacHex16(reservaId, endUnix);
  return `QR2.${reservaId}.${endUnix}.${hmacHex16}`;
}

export interface QrVerificationResult {
  valid: boolean;
  isSigned: boolean;
  cleanToken: string;
  reservaId?: string;
  reason?: string;
}

function extractCleanToken(rawInput: string): string {
  const trimmed = (rawInput || "").trim();
  if (!trimmed) return "";

  if (trimmed.includes("token=")) {
    try {
      const url = new URL(trimmed);
      const param = url.searchParams.get("token");
      if (param) return param.trim();
    } catch {
      const match = trimmed.match(/(?:^|[?&])token=([^&\s#]+)/i);
      if (match?.[1]) return decodeURIComponent(match[1]).trim();
    }
  }

  if (trimmed.includes("/")) {
    try {
      const parsed = new URL(trimmed);
      const segments = parsed.pathname.split("/").filter(Boolean);
      const lastSeg = segments[segments.length - 1];
      if (lastSeg && /^qr/i.test(lastSeg)) {
        return lastSeg.trim();
      }
    } catch {
      const segments = trimmed.split("/").filter(Boolean);
      const lastSeg = segments[segments.length - 1];
      if (lastSeg && /^qr/i.test(lastSeg)) {
        return lastSeg.trim();
      }
    }
  }

  return trimmed;
}

/**
 * Verifies dynamic QR2 HMAC-SHA256 tokens in constant time and checks expiration.
 * Maintains backwards compatibility for legacy unsigned tokens (e.g., QR-LIVE-DEMO-...).
 */
export function verifySignedQrToken(
  rawInput: string,
  nowMs: number = Date.now()
): QrVerificationResult {
  const cleanToken = extractCleanToken(rawInput);
  if (!cleanToken) {
    return {
      valid: false,
      isSigned: false,
      cleanToken: "",
      reason: "Token QR vacío",
    };
  }

  if (!cleanToken.startsWith("QR2.")) {
    return {
      valid: true,
      isSigned: false,
      cleanToken,
    };
  }

  const parts = cleanToken.split(".");
  if (parts.length !== 4) {
    return {
      valid: false,
      isSigned: true,
      cleanToken,
      reason: "Formato de token QR2 inválido",
    };
  }

  const [, reservaId, endUnixStr, providedHex] = parts;
  if (!reservaId || !/^\d+$/.test(endUnixStr) || !/^[0-9a-f]{16}$/i.test(providedHex)) {
    return {
      valid: false,
      isSigned: true,
      cleanToken,
      reservaId: reservaId || undefined,
      reason: "Firma HMAC-SHA256 inválida o token adulterado",
    };
  }

  const endUnix = Number(endUnixStr);
  const expectedHex = computeHmacHex16(reservaId, endUnix);
  const providedBuf = Buffer.from(providedHex.toLowerCase(), "utf8");
  const expectedBuf = Buffer.from(expectedHex, "utf8");

  if (providedBuf.length !== expectedBuf.length || !timingSafeEqual(expectedBuf, providedBuf)) {
    return {
      valid: false,
      isSigned: true,
      cleanToken,
      reservaId,
      reason: "Firma HMAC-SHA256 inválida o token adulterado",
    };
  }

  if (nowMs > endUnix * 1000) {
    return {
      valid: false,
      isSigned: true,
      cleanToken,
      reservaId,
      reason: "Token QR expirado",
    };
  }

  return {
    valid: true,
    isSigned: true,
    cleanToken,
    reservaId,
  };
}
