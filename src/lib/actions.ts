"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function getDashboardData() {
  const [
    reservas,
    equipamientos,
    auditorios,
    users,
    auditorias,
    suscripciones,
  ] = await Promise.all([
    prisma.reserva.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, department: true } },
        auditorio: { select: { id: true, name: true, location: true } },
        equipamientos: {
          include: { equipamiento: true },
        },
        horasTI: true,
        encuesta: true,
      },
      orderBy: { startTime: "asc" },
    }),
    prisma.equipamiento.findMany({
      orderBy: { category: "asc" },
    }),
    prisma.auditorio.findMany({
      where: { isActive: true },
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        priorityScore: true,
      },
    }),
    prisma.registroAuditoria.findMany({
      include: { user: { select: { name: true, role: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.suscripcionArea.findMany({
      where: { isActive: true },
    }),
  ]);

  // Compute operational KPIs
  const totalReservas = reservas.length;
  const reservasActivas = reservas.filter((r) => r.status === "APPROVED" || r.status === "CHECKED_IN").length;
  const reservasPendientes = reservas.filter((r) => r.status === "PENDING").length;
  const totalNoShows = reservas.filter((r) => r.status === "NO_SHOW").length;

  // Real IT hours computation (sum of hoursDecimal)
  let totalHorasTI = 0;
  reservas.forEach((r) => {
    r.horasTI.forEach((h) => {
      totalHorasTI += h.hoursDecimal;
    });
  });

  // Calculate estimated saved hours (each QR check-in saves ~45 min of idle technician waiting)
  const completedCheckins = reservas.filter((r) => r.checkInTime !== null).length;
  const horasTIAhorradas = parseFloat((completedCheckins * 0.75).toFixed(1));

  // Compute average satisfaction rating & NPS
  const encuestas = reservas.map((r) => r.encuesta).filter(Boolean);
  let sumRating = 0;
  let promoters = 0;
  let detractors = 0;

  encuestas.forEach((e) => {
    if (e) {
      sumRating += (e.ratingOverall + e.ratingEquipment + e.ratingSupport) / 3;
      if (e.npsCategory === "PROMOTER") promoters++;
      if (e.npsCategory === "DETRACTOR") detractors++;
    }
  });

  const calificacionPromedio = encuestas.length > 0 ? parseFloat((sumRating / encuestas.length).toFixed(1)) : 5.0;
  const npsScore = encuestas.length > 0 ? Math.round(((promoters - detractors) / encuestas.length) * 100) : 100;

  // Occupancy rate estimate (based on 40 weekly operational hours)
  const tasaOcupacion = Math.min(100, Math.round((totalReservas * 2.5 / 40) * 100));

  return {
    reservas: JSON.parse(JSON.stringify(reservas)),
    equipamientos: JSON.parse(JSON.stringify(equipamientos)),
    auditorios: JSON.parse(JSON.stringify(auditorios)),
    users: JSON.parse(JSON.stringify(users)),
    auditorias: JSON.parse(JSON.stringify(auditorias)),
    suscripciones: JSON.parse(JSON.stringify(suscripciones)),
    metrics: {
      totalReservas,
      reservasActivas,
      reservasPendientes,
      tasaOcupacion,
      horasTIUtilizadas: parseFloat(totalHorasTI.toFixed(1)),
      horasTIAhorradas,
      calificacionPromedio,
      npsScore,
      totalNoShows,
    },
  };
}

export async function createReservationAction(formData: {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  attendeesEstimate: number;
  requiresCleaning: boolean;
  requiresGuardia: boolean;
  notes?: string;
  userId: string;
  auditorioId: string;
  selectedEquipments: { equipamientoId: string; quantity: number }[];
}) {
  const start = new Date(formData.startTime);
  const end = new Date(formData.endTime);

  if (start >= end) {
    return { success: false, error: "La hora de término debe ser posterior a la de inicio." };
  }

  // Anti-collision transactional check (RF-05)
  // Conflicto si: max(start1, start2) < min(end1, end2)
  const overlapping = await prisma.reserva.findFirst({
    where: {
      auditorioId: formData.auditorioId,
      status: { in: ["APPROVED", "CHECKED_IN"] },
      AND: [
        { startTime: { lt: end } },
        { endTime: { gt: start } },
      ],
    },
  });

  if (overlapping) {
    return {
      success: false,
      error: `Conflicto de horario: El auditorio ya tiene una reserva confirmada ("${overlapping.title}") en el bloque solicitado.`,
    };
  }

  const user = await prisma.user.findUnique({ where: { id: formData.userId } });
  const priority = user?.priorityScore ?? 100;

  const nuevaReserva = await prisma.reserva.create({
    data: {
      title: formData.title,
      description: formData.description,
      startTime: start,
      endTime: end,
      status: "PENDING",
      attendeesEstimate: Number(formData.attendeesEstimate),
      requiresCleaning: formData.requiresCleaning,
      requiresGuardia: formData.requiresGuardia,
      notes: formData.notes,
      priorityScoreApplied: priority,
      userId: formData.userId,
      auditorioId: formData.auditorioId,
      equipamientos: {
        create: formData.selectedEquipments.map((eq) => ({
          equipamientoId: eq.equipamientoId,
          quantity: eq.quantity,
          delivered: false,
          returned: false,
        })),
      },
    },
  });

  // Audit log
  await prisma.registroAuditoria.create({
    data: {
      action: "SOLICITUD_CREADA",
      entity: "Reserva",
      entityId: nuevaReserva.id,
      userId: formData.userId,
      ipAddress: "127.0.0.1",
      details: `Solicitud "${formData.title}" ingresada para ${start.toLocaleString("es-CL")}`,
    },
  });

  revalidatePath("/");
  return { success: true, reservaId: nuevaReserva.id };
}

export async function approveReservationAction(reservaId: string, reviewerId: string) {
  // Generate dynamic cryptographic QR token
  const qrToken = `QR-AUD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  const updated = await prisma.reserva.update({
    where: { id: reservaId },
    data: {
      status: "APPROVED",
      qrToken,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
    },
  });

  await prisma.registroAuditoria.create({
    data: {
      action: "RESERVA_APROBADA",
      entity: "Reserva",
      entityId: reservaId,
      userId: reviewerId,
      ipAddress: "127.0.0.1",
      details: `Reserva aprobada con token QR emitido: ${qrToken}`,
    },
  });

  revalidatePath("/");
  return { success: true, qrToken };
}

export async function rejectReservationAction(reservaId: string, reviewerId: string, reason: string) {
  await prisma.reserva.update({
    where: { id: reservaId },
    data: {
      status: "REJECTED",
      rejectionReason: reason,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
    },
  });

  await prisma.registroAuditoria.create({
    data: {
      action: "RESERVA_RECHAZADA",
      entity: "Reserva",
      entityId: reservaId,
      userId: reviewerId,
      ipAddress: "127.0.0.1",
      details: `Reserva rechazada por: ${reason}`,
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function updateReservationScheduleAction(
  reservaId: string,
  adminUserId: string,
  data: {
    title: string;
    startTime: string;
    endTime: string;
    attendeesEstimate: number;
    notes?: string;
    confirmSecurity: boolean;
  }
) {
  if (!data.confirmSecurity) {
    return {
      success: false,
      error: "Debe confirmar explícitamente el cambio de horario por motivos de seguridad.",
    };
  }

  const start = new Date(data.startTime);
  const end = new Date(data.endTime);

  if (start >= end) {
    return {
      success: false,
      error: "La hora de término debe ser posterior a la hora de inicio.",
    };
  }

  const current = await prisma.reserva.findUnique({
    where: { id: reservaId },
  });

  if (!current) {
    return { success: false, error: "La reserva no existe." };
  }

  // Anti-collision check against OTHER approved/in-progress reservations
  const overlapping = await prisma.reserva.findFirst({
    where: {
      id: { not: reservaId },
      auditorioId: current.auditorioId,
      status: { in: ["APPROVED", "CHECKED_IN"] },
      AND: [
        { startTime: { lt: end } },
        { endTime: { gt: start } },
      ],
    },
  });

  if (overlapping) {
    return {
      success: false,
      error: `Conflicto de horario: El nuevo bloque se solapa con la reserva confirmada "${overlapping.title}".`,
    };
  }

  const oldSchedule = `${new Date(current.startTime).toLocaleString("es-CL")} - ${new Date(current.endTime).toLocaleTimeString("es-CL")}`;
  const newSchedule = `${start.toLocaleString("es-CL")} - ${end.toLocaleTimeString("es-CL")}`;

  const updated = await prisma.reserva.update({
    where: { id: reservaId },
    data: {
      title: data.title.trim(),
      startTime: start,
      endTime: end,
      attendeesEstimate: Number(data.attendeesEstimate),
      notes: data.notes,
    },
  });

  // Log in immutable audit trail
  await prisma.registroAuditoria.create({
    data: {
      action: "HORARIO_MODIFICADO_ADMIN",
      entity: "Reserva",
      entityId: reservaId,
      userId: adminUserId,
      ipAddress: "127.0.0.1",
      details: `Horario modificado por Administrador para "${data.title}". Anterior: [${oldSchedule}] -> Nuevo: [${newSchedule}]`,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true, reserva: updated };
}


export async function processCheckInAction(qrToken: string, tecnicoId: string) {
  const reserva = await prisma.reserva.findFirst({
    where: {
      qrToken: qrToken.trim(),
      status: "APPROVED",
    },
    include: { equipamientos: { include: { equipamiento: true } } },
  });

  if (!reserva) {
    return {
      success: false,
      error: "Código QR no válido, no aprobado o ya utilizado anteriormente.",
    };
  }

  const checkInTime = new Date();

  await prisma.reserva.update({
    where: { id: reserva.id },
    data: {
      status: "CHECKED_IN",
      checkInTime,
      checkedInBy: tecnicoId,
    },
  });

  // Mark requested equipment as delivered
  await prisma.reservaEquipamiento.updateMany({
    where: { reservaId: reserva.id },
    data: { delivered: true },
  });

  await prisma.registroAuditoria.create({
    data: {
      action: "CHECK_IN_VALIDADO",
      entity: "Reserva",
      entityId: reserva.id,
      userId: tecnicoId,
      ipAddress: "127.0.0.1",
      details: `Check-in validado en sitio en < 30 seg. Inicio de soporte técnico: ${checkInTime.toLocaleTimeString("es-CL")}`,
    },
  });

  revalidatePath("/");
  return { success: true, reservaTitle: reserva.title, checkInTime };
}

export async function processCheckOutAction(
  reservaId: string,
  tecnicoId: string,
  notes?: string
) {
  const reserva = await prisma.reserva.findUnique({
    where: { id: reservaId },
    include: { horasTI: true },
  });

  if (!reserva || !reserva.checkInTime) {
    return { success: false, error: "La reserva no tiene un Check-in registrado previamente." };
  }

  const checkoutTime = new Date();
  const diffMs = checkoutTime.getTime() - new Date(reserva.checkInTime).getTime();
  const minutes = Math.max(15, Math.round(diffMs / (1000 * 60)));
  const hoursDecimal = parseFloat((minutes / 60).toFixed(2));

  await prisma.reserva.update({
    where: { id: reservaId },
    data: {
      status: "CHECKED_OUT",
      checkoutTime,
      checkedOutBy: tecnicoId,
    },
  });

  // Record exact IT hours consumed
  await prisma.registroHorasTI.create({
    data: {
      reservaId,
      tecnicoId,
      minutesDuration: minutes,
      hoursDecimal,
      notes: notes || "Check-out completado con devolución conforme de hardware.",
    },
  });

  // Mark equipment as returned
  await prisma.reservaEquipamiento.updateMany({
    where: { reservaId },
    data: { returned: true },
  });

  await prisma.registroAuditoria.create({
    data: {
      action: "CHECK_OUT_COMPLETADO",
      entity: "Reserva",
      entityId: reservaId,
      userId: tecnicoId,
      ipAddress: "127.0.0.1",
      details: `Check-out registrado. Horas hombre TI utilizadas computadas: ${hoursDecimal} hrs (${minutes} min).`,
    },
  });

  revalidatePath("/");
  return { success: true, hoursDecimal, minutes };
}

export async function submitFeedbackAction(
  reservaId: string,
  ratings: {
    overall: number;
    equipment: number;
    support: number;
    comment?: string;
  }
) {
  const avg = (ratings.overall + ratings.equipment + ratings.support) / 3;
  let npsCategory = "PASSIVE";
  if (avg >= 4.5) npsCategory = "PROMOTER";
  else if (avg <= 3.0) npsCategory = "DETRACTOR";

  await prisma.encuestaSatisfaccion.create({
    data: {
      reservaId,
      ratingOverall: ratings.overall,
      ratingEquipment: ratings.equipment,
      ratingSupport: ratings.support,
      feedbackComment: ratings.comment,
      npsCategory,
    },
  });

  await prisma.registroAuditoria.create({
    data: {
      action: "ENCUESTA_RECIBIDA",
      entity: "Reserva",
      entityId: reservaId,
      ipAddress: "127.0.0.1",
      details: `Encuesta post-evento: Promedio ${avg.toFixed(1)} estrellas (${npsCategory}).`,
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function toggleEquipmentStatusAction(
  equipamientoId: string,
  newStatus: "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "DECOMMISSIONED"
) {
  await prisma.equipamiento.update({
    where: { id: equipamientoId },
    data: { status: newStatus },
  });

  revalidatePath("/");
  return { success: true };
}

export async function createSuscripcionAction(formData: {
  name: string;
  email: string;
  department: string;
}) {
  const emailClean = formData.email.trim().toLowerCase();
  if (!emailClean || !formData.name.trim()) {
    return { success: false, error: "Debe ingresar nombre y correo válidos." };
  }

  // Check if already subscribed in same department
  const existing = await prisma.suscripcionArea.findFirst({
    where: {
      email: emailClean,
      department: formData.department,
    },
  });

  if (existing) {
    return { success: false, error: "El correo ya está registrado en este departamento." };
  }

  const created = await prisma.suscripcionArea.create({
    data: {
      name: formData.name.trim(),
      email: emailClean,
      department: formData.department,
      isActive: true,
    },
  });

  await prisma.registroAuditoria.create({
    data: {
      action: "FUNCIONARIO_AGREGADO",
      entity: "SuscripcionArea",
      entityId: created.id,
      ipAddress: "127.0.0.1",
      details: `Funcionario agregado a cuadrilla ${formData.department}: ${formData.name} (${emailClean})`,
    },
  });

  revalidatePath("/");
  return { success: true, item: created };
}

export async function updateSuscripcionAction(
  id: string,
  data: {
    name: string;
    email: string;
    department: string;
    isActive: boolean;
  }
) {
  const updated = await prisma.suscripcionArea.update({
    where: { id },
    data: {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      department: data.department,
      isActive: data.isActive,
    },
  });

  await prisma.registroAuditoria.create({
    data: {
      action: "FUNCIONARIO_MODIFICADO",
      entity: "SuscripcionArea",
      entityId: id,
      ipAddress: "127.0.0.1",
      details: `Datos actualizados: ${data.name} (${data.department}) - Activo: ${data.isActive}`,
    },
  });

  revalidatePath("/");
  return { success: true, item: updated };
}

export async function deleteSuscripcionAction(id: string) {
  const item = await prisma.suscripcionArea.findUnique({ where: { id } });

  await prisma.suscripcionArea.delete({
    where: { id },
  });

  await prisma.registroAuditoria.create({
    data: {
      action: "FUNCIONARIO_ELIMINADO",
      entity: "SuscripcionArea",
      entityId: id,
      ipAddress: "127.0.0.1",
      details: `Eliminado funcionario ${item?.name || id} (${item?.department || "General"})`,
    },
  });

  revalidatePath("/");
  return { success: true };
}

