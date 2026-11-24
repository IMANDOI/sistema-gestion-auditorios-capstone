export type UserRole = "OWNER" | "IT_ADMIN" | "IT_SERVICE" | "ASSISTANT" | "PROFESSOR" | "STUDENT";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string | null;
  priorityScore: number;
}

export interface EquipamientoItem {
  id: string;
  name: string;
  category: string;
  serialNumber?: string | null;
  status: "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "DECOMMISSIONED";
  totalQty: number;
  availableQty: number;
}

export interface ReservaItem {
  id: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  status: "PENDING" | "APPROVED" | "POSTPONED" | "REJECTED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED" | "NO_SHOW";
  qrToken?: string | null;
  attendeesEstimate: number;
  requiresCleaning: boolean;
  requiresGuardia: boolean;
  notes?: string | null;
  rejectionReason?: string | null;
  priorityScoreApplied: number;
  checkInTime?: string | null;
  checkedInBy?: string | null;
  checkoutTime?: string | null;
  checkedOutBy?: string | null;
  user: {
    name: string;
    email: string;
    department?: string | null;
  };
  auditorio: {
    name: string;
    location: string;
  };
  equipamientos: {
    id: string;
    quantity: number;
    delivered: boolean;
    returned: boolean;
    equipamiento: {
      id: string;
      name: string;
      category: string;
    };
  }[];
  horasTI?: {
    minutesDuration: number;
    hoursDecimal: number;
    notes?: string | null;
  }[];
  encuesta?: {
    ratingOverall: number;
    ratingEquipment: number;
    ratingSupport: number;
    feedbackComment?: string | null;
    npsCategory: string;
  } | null;
}

export interface DashboardMetrics {
  totalReservas: number;
  reservasActivas: number;
  reservasPendientes: number;
  tasaOcupacion: number;
  horasTIUtilizadas: number;
  horasTIAhorradas: number;
  calificacionPromedio: number;
  npsScore: number;
  totalNoShows: number;
}

export interface AuditorioItem {
  id: string;
  name: string;
  slug: string;
  capacity: number;
  location: string;
  description?: string | null;
  isActive: boolean;
  status: "OPERATIONAL" | "MAINTENANCE" | "PARTIAL_RESTRICTION";
}

export interface RegistroMantenimientoItem {
  id: string;
  type: "PREVENTIVO" | "CORRECTIVO" | "CALIBRACION" | "MEJORA" | "DANIO_REPORTE";
  targetType: "AUDITORIO" | "EQUIPAMIENTO";
  auditorioId?: string | null;
  auditorio?: { id: string; name: string } | null;
  equipamientoId?: string | null;
  equipamiento?: { id: string; name: string; category: string } | null;
  title: string;
  description: string;
  severity: "BAJA" | "MEDIA" | "ALTA" | "CRITICA";
  status: "PROGRAMADO" | "EN_MANTENCION" | "ESPERANDO_REPUESTO" | "RESUELTO";
  reportedBy: string;
  technicianAssigned?: string | null;
  costEstimate?: number | null;
  startDate: string;
  expectedEndDate?: string | null;
  resolvedDate?: string | null;
  resolutionNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceMetrics {
  totalMantenimientos: number;
  activosEnMantencion: number;
  resueltos: number;
  tasaOperatividadEquipos: number;
  auditorioStatus: "OPERATIONAL" | "MAINTENANCE" | "PARTIAL_RESTRICTION";
  downtimeHorasAcumuladas: number;
  mttrHorasPromedio: number;
  distribucionPorTipo: { tipo: string; cantidad: number }[];
  distribucionPorCategoria: { categoria: string; total: number; enMantencion: number }[];
  incidentesPorSeveridad: { severidad: string; cantidad: number }[];
}

