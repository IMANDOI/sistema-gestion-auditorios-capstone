const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Clean existing records safely
  await prisma.registroAuditoria.deleteMany({});
  await prisma.encuestaSatisfaccion.deleteMany({});
  await prisma.registroHorasTI.deleteMany({});
  await prisma.reservaEquipamiento.deleteMany({});
  await prisma.reserva.deleteMany({});
  await prisma.equipamiento.deleteMany({});
  await prisma.suscripcionArea.deleteMany({});
  await prisma.auditorio.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPasswordHash = await bcrypt.hash("Capstone2026!", 10);

  // 2. Users
  const admin = await prisma.user.create({
    data: {
      name: "Benjamín Navarrete (Super Administrador)",
      email: "benjamin54144752123@gmail.com",
      passwordHash: defaultPasswordHash,
      role: "OWNER",
      department: "Dirección de Tecnologías de Información",
      phone: "+56 9 8765 4321",
      priorityScore: 100,
    },
  });

  const encargado = await prisma.user.create({
    data: {
      name: "Carla Morales (Encargada Recintos)",
      email: "coordinacion@institucion.cl",
      passwordHash: defaultPasswordHash,
      role: "ASSISTANT",
      department: "Coordinación de Infraestructura y Eventos",
      phone: "+56 9 7654 3210",
      priorityScore: 100,
    },
  });

  const tecnico = await prisma.user.create({
    data: {
      name: "Rodrigo Tapia (Soporte TI Terreno)",
      email: "soporte.ti@institucion.cl",
      passwordHash: defaultPasswordHash,
      role: "IT_SERVICE",
      department: "Mesa de Ayuda y Soporte Audiovisual",
      phone: "+56 9 6543 2109",
      priorityScore: 100,
    },
  });

  const docente = await prisma.user.create({
    data: {
      name: "Dra. Patricia González (Docente)",
      email: "patricia.gonzalez@institucion.cl",
      passwordHash: defaultPasswordHash,
      role: "PROFESSOR",
      department: "Facultad de Ingeniería y Ciencias Aplicadas",
      phone: "+56 9 5432 1098",
      priorityScore: 100,
    },
  });

  console.log("✅ Users created");

  // 3. Auditorios
  const auditorio = await prisma.auditorio.create({
    data: {
      name: "Auditorio Magna Principal",
      slug: "auditorio-magna-principal",
      capacity: 150,
      location: "Edificio A - Nivel Central",
      description: "Auditorio principal con climatización centralizada, sonido envolvente y proyección láser de alta definición.",
      isActive: true,
    },
  });

  console.log("✅ Auditorio created");

  // 4. Equipamiento
  const eqMic = await prisma.equipamiento.create({
    data: {
      name: "Micrófono Inalámbrico Shure SM58",
      category: "AUDIO",
      serialNumber: "SHURE-WL-001",
      status: "AVAILABLE",
      totalQty: 4,
      availableQty: 4,
    },
  });

  const eqProy = await prisma.equipamiento.create({
    data: {
      name: "Proyector Láser 4K Epson 6000 Lumens",
      category: "PROJECTION",
      serialNumber: "EPSON-4K-002",
      status: "AVAILABLE",
      totalQty: 1,
      availableQty: 1,
    },
  });

  const eqLaptop = await prisma.equipamiento.create({
    data: {
      name: "Notebook Dell Latitude i7 para Expositor",
      category: "COMPUTING",
      serialNumber: "DELL-LAT-003",
      status: "AVAILABLE",
      totalQty: 2,
      availableQty: 2,
    },
  });

  const eqPointer = await prisma.equipamiento.create({
    data: {
      name: "Puntero Láser con Control Inalámbrico",
      category: "OTHER",
      serialNumber: "LOGI-PTR-004",
      status: "AVAILABLE",
      totalQty: 3,
      availableQty: 3,
    },
  });

  const eqConsola = await prisma.equipamiento.create({
    data: {
      name: "Consola de Audio Yamaha 12 Canales",
      category: "AUDIO",
      serialNumber: "YAM-MG12-005",
      status: "AVAILABLE",
      totalQty: 1,
      availableQty: 1,
    },
  });

  console.log("✅ Equipamientos created");

  // 5. Suscripciones de Áreas
  await prisma.suscripcionArea.createMany({
    data: [
      { name: "Cuadrilla Aseo Central", email: "aseo.campus@institucion.cl", department: "ASEO" },
      { name: "Puesto Guardia y Accesos", email: "guardia.seguridad@institucion.cl", department: "GUARDIA" },
      { name: "Mesa de Soporte TI", email: "soporte.ti@institucion.cl", department: "TI" },
      { name: "Coordinación Académica", email: "coordinacion@institucion.cl", department: "COORDINACION" },
    ],
  });

  console.log("✅ Suscripciones de áreas created");

  // 6. Reservas Históricas y Actuales
  const now = new Date();
  
  // Reserva 1: Realizada ayer, con Check-in, Check-out, Horas TI (1.5 hrs) y Encuesta 5 estrellas
  const yesterdayStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  yesterdayStart.setHours(10, 0, 0, 0);
  const yesterdayEnd = new Date(yesterdayStart.getTime() + 90 * 60 * 1000);
  
  const r1 = await prisma.reserva.create({
    data: {
      title: "Seminario de Ciberseguridad Defensiva y Análisis Forense",
      description: "Charla magistral dirigida a estudiantes de informática sobre técnicas de prevención OWASP y blindaje de aplicaciones web.",
      startTime: yesterdayStart,
      endTime: yesterdayEnd,
      status: "CHECKED_OUT",
      qrToken: "qr-sem-ciberseguridad-uuid-001",
      attendeesEstimate: 85,
      requiresCleaning: true,
      requiresGuardia: true,
      notes: "Se requirió amplificación estéreo y prueba de sonido 15 minutos antes.",
      priorityScoreApplied: 100,
      checkInTime: yesterdayStart,
      checkedInBy: tecnico.id,
      checkoutTime: yesterdayEnd,
      checkedOutBy: tecnico.id,
      reviewedBy: encargado.id,
      reviewedAt: new Date(yesterdayStart.getTime() - 48 * 60 * 60 * 1000),
      userId: docente.id,
      auditorioId: auditorio.id,
      equipamientos: {
        create: [
          { equipamientoId: eqMic.id, quantity: 2, delivered: true, returned: true },
          { equipamientoId: eqProy.id, quantity: 1, delivered: true, returned: true },
          { equipamientoId: eqPointer.id, quantity: 1, delivered: true, returned: true },
        ],
      },
      horasTI: {
        create: {
          tecnicoId: tecnico.id,
          minutesDuration: 90,
          hoursDecimal: 1.5,
          notes: "Evento concluido sin incidencias. Equipamiento recibido en perfecto estado.",
        },
      },
      encuesta: {
        create: {
          ratingOverall: 5,
          ratingEquipment: 5,
          ratingSupport: 5,
          feedbackComment: "Excelente asistencia del personal TI en la configuración del proyector y audio impecable.",
          npsCategory: "PROMOTER",
        },
      },
    },
  });

  // Reserva 2: Aprobada para HOY (Lista para probar Check-in QR en vivo)
  const todayStart = new Date(now.getTime() + 15 * 60 * 1000); // En 15 minutos
  const todayEnd = new Date(todayStart.getTime() + 120 * 60 * 1000); // 2 horas
  
  const r2 = await prisma.reserva.create({
    data: {
      title: "Clase Magistral: Arquitectura Cloud Serverless y Microservicios",
      description: "Presentación de proyectos Capstone y demostración práctica de base de datos relacional y pipelines de CI/CD.",
      startTime: todayStart,
      endTime: todayEnd,
      status: "APPROVED",
      qrToken: "QR-LIVE-DEMO-2026-CAPSTONE-SECURE",
      attendeesEstimate: 60,
      requiresCleaning: true,
      requiresGuardia: true,
      notes: "Requiere 2 micrófonos inalámbricos y proyector 4K activo.",
      priorityScoreApplied: 100,
      reviewedBy: encargado.id,
      reviewedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      userId: docente.id,
      auditorioId: auditorio.id,
      equipamientos: {
        create: [
          { equipamientoId: eqMic.id, quantity: 2, delivered: false, returned: false },
          { equipamientoId: eqProy.id, quantity: 1, delivered: false, returned: false },
          { equipamientoId: eqLaptop.id, quantity: 1, delivered: false, returned: false },
        ],
      },
    },
  });

  // Reserva 3: Pendiente de Aprobación para Mañana (Para probar flujo de Encargado)
  const tomorrowStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  tomorrowStart.setHours(15, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrowStart.getTime() + 90 * 60 * 1000);

  const r3 = await prisma.reserva.create({
    data: {
      title: "Taller Práctico de Programación Web y Testing Automatizado",
      description: "Laboratorio abierto de validación de casos de prueba unitarias e integración en TypeScript.",
      startTime: tomorrowStart,
      endTime: tomorrowEnd,
      status: "PENDING",
      qrToken: null,
      attendeesEstimate: 45,
      requiresCleaning: true,
      requiresGuardia: true,
      notes: "Solicitud de prueba enviada desde portal de docentes.",
      priorityScoreApplied: 100,
      userId: docente.id,
      auditorioId: auditorio.id,
      equipamientos: {
        create: [
          { equipamientoId: eqMic.id, quantity: 1, delivered: false, returned: false },
          { equipamientoId: eqProy.id, quantity: 1, delivered: false, returned: false },
        ],
      },
    },
  });

  // 7. Auditoría
  await prisma.registroAuditoria.createMany({
    data: [
      {
        action: "RESERVA_APROBADA",
        entity: "Reserva",
        entityId: r2.id,
        userId: encargado.id,
        ipAddress: "192.168.1.45",
        details: "Aprobada reserva de Arquitectura Cloud con asignación de 3 equipos",
      },
      {
        action: "CHECK_OUT_COMPLETADO",
        entity: "Reserva",
        entityId: r1.id,
        userId: tecnico.id,
        ipAddress: "192.168.1.112",
        details: "Check-out verificado en sitio. Horas computadas: 1.5 hrs. Retorno de equipos conforme.",
      },
    ],
  });

  console.log("✅ Sample reservations and audit logs created!");
  console.log("🎉 Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
