function formatUtcIcsDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Fecha inválida al generar archivo .ics");
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

export interface InstitutionalICSReserva {
  id: string;
  title: string;
  description?: string | null;
  startTime: Date | string;
  endTime: Date | string;
  auditorioName: string;
  location: string;
}

/**
 * Generates an RFC 5545 compliant iCalendar (.ics) file for Outlook 365 / Microsoft Teams,
 * including a 15-minute preventive VALARM reminder.
 */
export function generateInstitutionalICS(reserva: InstitutionalICSReserva): string {
  const dtStamp = formatUtcIcsDate(new Date());
  const dtStart = formatUtcIcsDate(reserva.startTime);
  const dtEnd = formatUtcIcsDate(reserva.endTime);

  const summary = escapeIcsText(reserva.title);
  const location = escapeIcsText(`${reserva.auditorioName} - ${reserva.location}`);
  const rawDescription = reserva.description?.trim()
    ? `${reserva.description.trim()}\nRecinto: ${reserva.auditorioName} (${reserva.location})\nID Reserva: ${reserva.id}`
    : `Evento institucional en ${reserva.auditorioName} (${reserva.location}). ID Reserva: ${reserva.id}`;
  const description = escapeIcsText(rawDescription);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Duoc UC//Sistema Gestion Auditorios//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${reserva.id}@auditorios.duoc.cl`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcsText(`Recordatorio: ${reserva.title} inicia en 15 minutos`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${lines.join("\r\n")}\r\n`;
}

export interface CrewWebhookInput {
  title: string;
  auditorio: string;
  department: string;
  severity?: string;
  details: string;
}

/**
 * Builds a dual-compatible webhook payload for Microsoft Teams Adaptive Cards
 * and Telegram Bot API crew/SEV-1 alert channels.
 */
export function buildCrewWebhookPayload(eventType: string, data: CrewWebhookInput) {
  const severity = (data.severity || "INFO").toUpperCase();
  const isCritical = severity === "CRITICA" || severity === "SEV-1" || severity === "ALTA";
  const accentColor = isCritical ? "attention" : "accent";

  const telegramText = [
    `*[${eventType}]* (${severity})`,
    `*Evento:* ${data.title}`,
    `*Recinto:* ${data.auditorio}`,
    `*Cuadrilla:* ${data.department}`,
    `*Detalle:* ${data.details}`,
  ].join("\n");

  return {
    eventType,
    type: "message" as const,
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        contentUrl: null,
        content: {
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.4",
          body: [
            {
              type: "TextBlock",
              text: `[${severity}] ${eventType} — ${data.title}`,
              weight: "Bolder",
              size: "Medium",
              color: accentColor,
              wrap: true,
            },
            {
              type: "FactSet",
              facts: [
                { title: "Recinto:", value: data.auditorio },
                { title: "Cuadrilla:", value: data.department },
                { title: "Severidad:", value: severity },
              ],
            },
            {
              type: "TextBlock",
              text: data.details,
              wrap: true,
            },
          ],
        },
      },
    ],
    text: telegramText,
    parse_mode: "Markdown" as const,
    channelDepartment: data.department,
    severity,
    telegram: {
      text: telegramText,
      parse_mode: "Markdown" as const,
      channelDepartment: data.department,
      severity,
    },
  };
}
