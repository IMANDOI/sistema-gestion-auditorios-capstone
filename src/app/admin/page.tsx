"use client";

import React, { useState, useEffect } from "react";
import { PortalHeader } from "@/components/PortalHeader";
import { 
  getDashboardData, 
  toggleEquipmentStatusAction,
  createSuscripcionAction,
  updateSuscripcionAction,
  deleteSuscripcionAction,
  updateReservationScheduleAction,
  createUserAction,
  updateUserAction,
  resetUserPasswordAction,
  deleteUserAction,
  getUserAuditLogsAction,
  runRPAJobAction,
  RPAResult
} from "@/lib/actions";
import { 
  ReservaItem, 
  EquipamientoItem, 
  DashboardMetrics,
  AuditorioItem,
  RegistroMantenimientoItem,
  MaintenanceMetrics
} from "@/lib/types";
import MaintenanceDashboard from "@/components/MaintenanceDashboard";
import { 
  BarChart3, 
  Clock, 
  TrendingUp, 
  CalendarCheck, 
  Star, 
  Boxes, 
  Bell, 
  History, 
  Wrench, 
  CheckCircle2, 
  ShieldAlert, 
  Mail, 
  Users,
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Plus,
  X,
  AlertCircle,
  CalendarClock,
  ShieldCheck,
  Activity,
  Key,
  Lock,
  UserCheck,
  Shield,
  Bot,
  Zap,
  RotateCcw,
  FileText,
  UserCheck2,
  CheckCircle,
  FileCode,
  ShieldAlert as ShieldAlertIcon
} from "lucide-react";

interface SuscripcionItem {
  id: string;
  name: string;
  email: string;
  department: string;
  isActive: boolean;
}

function formatDateTimeLocal(d: Date | string) {
  const date = new Date(d);
  const offset = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - offset);
  return local.toISOString().slice(0, 16);
}

export default function AdminPage() {
  const [data, setData] = useState<{
    reservas: ReservaItem[];
    equipamientos: EquipamientoItem[];
    auditorios: AuditorioItem[];
    users: any[];
    auditorias: any[];
    suscripciones: SuscripcionItem[];
    mantenimientos: RegistroMantenimientoItem[];
    metrics: DashboardMetrics;
    maintenanceMetrics: MaintenanceMetrics;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"RESERVAS" | "MANTENIMIENTO" | "INVENTARIO" | "CUADRILLAS" | "USUARIOS" | "RPA" | "AUDITORIA">("RESERVAS");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Cuadrillas CRUD state
  const [filterDept, setFilterDept] = useState<string>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<SuscripcionItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formDept, setFormDept] = useState("ASEO");
  const [formActive, setFormActive] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Schedule Modification (Horarios) state
  const [editingReserva, setEditingReserva] = useState<ReservaItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editAttendees, setEditAttendees] = useState(50);
  const [editNotes, setEditNotes] = useState("");
  const [confirmSecurity, setConfirmSecurity] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleSuccess, setScheduleSuccess] = useState<string | null>(null);

  // User Accounts Management state
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [filterUserRole, setFilterUserRole] = useState("ALL");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<any | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState("Capstone2026!");
  const [userFormName, setUserFormName] = useState("");
  const [userFormEmail, setUserFormEmail] = useState("");
  const [userFormPassword, setUserFormPassword] = useState("Capstone2026!");
  const [userFormRole, setUserFormRole] = useState("PROFESSOR");
  const [userFormDept, setUserFormDept] = useState("Escuela de Informática y Telecomunicaciones");
  const [userFormPhone, setUserFormPhone] = useState("+56 9 ");
  const [userFormScore, setUserFormScore] = useState(100);
  const [userActionError, setUserActionError] = useState<string | null>(null);
  const [userActionSuccess, setUserActionSuccess] = useState<string | null>(null);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  // Doble Verificación en Cuentas y Delegación de Gestor
  const [confirmCreateAccount, setConfirmCreateAccount] = useState(false);
  const [confirmEditAccount, setConfirmEditAccount] = useState(false);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [delegatingAdminUser, setDelegatingAdminUser] = useState<any | null>(null);
  const [confirmDelegateAdmin, setConfirmDelegateAdmin] = useState(false);

  // Registro de Logs y Cambios Específico de Cada Cuenta
  const [viewingLogsUser, setViewingLogsUser] = useState<any | null>(null);
  const [userLogsList, setUserLogsList] = useState<any[]>([]);
  const [isLoadingUserLogs, setIsLoadingUserLogs] = useState(false);

  // RPA (Robotic Process Automation) State
  const [isRPARunning, setIsRPARunning] = useState(false);
  const [rpaResult, setRpaResult] = useState<RPAResult | null>(null);

  const loadData = async () => {
    try {
      const res = await getDashboardData();
      setData(res as any);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <p className="text-sm font-bold text-slate-600">Cargando Panel Administrativo...</p>
      </div>
    );
  }

  const adminUser = data.users.find((u) => u.role === "OWNER" || u.role === "IT_ADMIN") || data.users[0];

  const handleToggleHardware = async (eq: EquipamientoItem) => {
    setIsUpdating(true);
    const nextStatus = eq.status === "AVAILABLE" ? "MAINTENANCE" : "AVAILABLE";
    await toggleEquipmentStatusAction(
      eq.id, 
      nextStatus, 
      "Ajuste rápido de estado desde Inventario Técnico", 
      adminUser?.id
    );
    await loadData();
    setIsUpdating(false);
  };

  const handleCreateOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setActionError(null);

    const res = await createSuscripcionAction({
      name: formName,
      email: formEmail,
      department: formDept,
    });

    setIsSubmitting(false);
    if (res.success) {
      setFormName("");
      setFormEmail("");
      setIsAddModalOpen(false);
      await loadData();
    } else {
      setActionError(res.error || "Error al agregar funcionario.");
    }
  };

  const handleUpdateOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficial) return;

    setIsSubmitting(true);
    setActionError(null);

    const res = await updateSuscripcionAction(editingOfficial.id, {
      name: formName,
      email: formEmail,
      department: formDept,
      isActive: formActive,
    });

    setIsSubmitting(false);
    if (res.success) {
      setEditingOfficial(null);
      await loadData();
    } else {
      setActionError(res.error || "Error al actualizar funcionario.");
    }
  };

  const handleDeleteOfficial = async (id: string, name: string) => {
    if (!confirm(`¿Está seguro de eliminar a ${name} de la lista de difusión?`)) {
      return;
    }
    await deleteSuscripcionAction(id);
    await loadData();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserActionError(null);
    setUserActionSuccess(null);
    setIsSubmittingUser(true);
    const res = await createUserAction({
      name: userFormName,
      email: userFormEmail,
      password: userFormPassword,
      role: userFormRole,
      department: userFormDept,
      phone: userFormPhone,
      priorityScore: Number(userFormScore),
    });
    setIsSubmittingUser(false);
    if (res.success) {
      setIsAddUserModalOpen(false);
      setUserFormName("");
      setUserFormEmail("");
      setUserFormPassword("Capstone2026!");
      setUserFormRole("PROFESSOR");
      setUserFormDept("Escuela de Informática y Telecomunicaciones");
      setUserFormPhone("+56 9 ");
      setUserFormScore(100);
      await loadData();
    } else {
      setUserActionError(res.error);
    }
  };

  const openEditUserModal = (u: any) => {
    setUserActionError(null);
    setUserActionSuccess(null);
    setEditingUser(u);
    setUserFormName(u.name);
    setUserFormEmail(u.email);
    setUserFormRole(u.role);
    setUserFormDept(u.department || "");
    setUserFormPhone(u.phone || "");
    setUserFormScore(u.priorityScore ?? 100);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUserActionError(null);
    setUserActionSuccess(null);
    setIsSubmittingUser(true);
    const res = await updateUserAction(editingUser.id, {
      name: userFormName,
      email: userFormEmail,
      role: userFormRole,
      department: userFormDept,
      phone: userFormPhone,
      priorityScore: Number(userFormScore),
    });
    setIsSubmittingUser(false);
    if (res.success) {
      setEditingUser(null);
      await loadData();
    } else {
      setUserActionError(res.error);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordUser) return;
    setUserActionError(null);
    setIsSubmittingUser(true);
    const res = await resetUserPasswordAction(resetPasswordUser.id, newPasswordVal);
    setIsSubmittingUser(false);
    if (res.success) {
      alert(`Contraseña actualizada con éxito para ${resetPasswordUser.name}.`);
      setResetPasswordUser(null);
      setNewPasswordVal("Capstone2026!");
      await loadData();
    } else {
      setUserActionError(res.error);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    if (deletingUser.email === "benjamin54144752123@gmail.com" || deletingUser.role === "OWNER") {
      alert("Protección de seguridad estricta: No se puede eliminar la cuenta del Super Administrador.");
      return;
    }
    if (!confirmDeleteAccount) {
      alert("Debe marcar la casilla obligatoria de doble verificación para confirmar.");
      return;
    }
    setIsSubmittingUser(true);
    const res = await deleteUserAction(deletingUser.id, adminUser.email);
    setIsSubmittingUser(false);
    if (res.success) {
      setDeletingUser(null);
      setConfirmDeleteAccount(false);
      await loadData();
    } else {
      alert(res.error);
    }
  };

  const handleOpenUserLogs = async (u: any) => {
    setViewingLogsUser(u);
    setIsLoadingUserLogs(true);
    const res = await getUserAuditLogsAction(u.id, u.email);
    setIsLoadingUserLogs(false);
    if (res.success) {
      setUserLogsList(res.logs);
    } else {
      setUserLogsList([]);
    }
  };

  const handleDelegateAdmin = async () => {
    if (!delegatingAdminUser) return;
    if (!confirmDelegateAdmin) {
      alert("Debe confirmar con la casilla de seguridad obligatoria.");
      return;
    }
    setIsSubmittingUser(true);
    const res = await updateUserAction(delegatingAdminUser.id, {
      name: delegatingAdminUser.name,
      email: delegatingAdminUser.email,
      role: "IT_ADMIN",
      department: delegatingAdminUser.department,
      phone: delegatingAdminUser.phone,
      priorityScore: delegatingAdminUser.priorityScore,
    });
    setIsSubmittingUser(false);
    if (res.success) {
      alert(`Permiso de Administrador y Gestor de Cuentas concedido a ${delegatingAdminUser.name}.`);
      setDelegatingAdminUser(null);
      setConfirmDelegateAdmin(false);
      await loadData();
    } else {
      alert(res.error);
    }
  };

  const handleRunRPACycle = async () => {
    setIsRPARunning(true);
    const res = await runRPAJobAction(adminUser.email);
    setIsRPARunning(false);
    setRpaResult(res);
    await loadData();
  };

  const openEditModal = (item: SuscripcionItem) => {
    setEditingOfficial(item);
    setFormName(item.name);
    setFormEmail(item.email);
    setFormDept(item.department);
    setFormActive(item.isActive);
    setActionError(null);
  };

  // Schedule Modification openers and handlers
  const openEditScheduleModal = (r: ReservaItem) => {
    setEditingReserva(r);
    setEditTitle(r.title);
    setEditStartTime(formatDateTimeLocal(r.startTime));
    setEditEndTime(formatDateTimeLocal(r.endTime));
    setEditAttendees(r.attendeesEstimate);
    setEditNotes(r.notes || "");
    setConfirmSecurity(false);
    setScheduleError(null);
    setScheduleSuccess(null);
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReserva) return;

    if (!confirmSecurity) {
      setScheduleError("Debe marcar la casilla de confirmación de seguridad para proceder.");
      return;
    }

    setIsSubmitting(true);
    setScheduleError(null);

    const res = await updateReservationScheduleAction(editingReserva.id, adminUser.id, {
      title: editTitle,
      startTime: editStartTime,
      endTime: editEndTime,
      attendeesEstimate: editAttendees,
      notes: editNotes,
      confirmSecurity: true,
    });

    setIsSubmitting(false);
    if (res.success) {
      setScheduleSuccess("¡Horario modificado exitosamente y registrado en la bitácora de auditoría!");
      setTimeout(() => {
        setEditingReserva(null);
      }, 1200);
      await loadData();
    } else {
      setScheduleError(res.error || "Error al modificar el horario.");
    }
  };

  const filteredReservas = data.reservas.filter((r) => {
    if (filterStatus !== "ALL" && r.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.user.name.toLowerCase().includes(q) ||
        (r.user.department && r.user.department.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const filteredSuscripciones = data.suscripciones.filter((s) => {
    if (filterDept === "ALL") return true;
    return s.department === filterDept;
  });

  const filteredUsers = data.users.filter((u) => {
    const q = searchUserQuery.toLowerCase().trim();
    const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.department && u.department.toLowerCase().includes(q));
    const matchesRole = filterUserRole === "ALL" || u.role === filterUserRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <PortalHeader
        userName={adminUser.name}
        userRole="IT_ADMIN"
        roleTitle="Administrador de TI"
        department={adminUser.department}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Dashboard de Gestión Operativa y Analítica
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Supervisión de horas de soporte TI, ocupación del recinto y control de recursos.
            </p>
          </div>
        </div>

        {/* High-Contrast Accessible KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Horas Soporte TI</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold text-slate-900">{data.metrics.horasTIUtilizadas}</span>
              <span className="text-xs text-slate-500 font-semibold">hrs computadas</span>
            </div>
            <p className="text-xs text-emerald-700 font-semibold">
              +{data.metrics.horasTIAhorradas} hrs ahorradas vía QR (&lt; 30s)
            </p>
          </div>

          {/* KPI 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Tasa de Ocupación</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold text-slate-900">{data.metrics.tasaOcupacion}%</span>
              <span className="text-xs text-slate-500 font-semibold">capacidad semanal</span>
            </div>
            <p className="text-xs text-slate-600">
              {data.metrics.totalReservas} eventos registrados
            </p>
          </div>

          {/* KPI 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Reservas Activas</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-800 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold text-slate-900">{data.metrics.reservasActivas}</span>
              <span className="text-xs text-slate-500 font-semibold">en curso / aprobadas</span>
            </div>
            <p className="text-xs text-amber-700 font-semibold">
              {data.metrics.reservasPendientes} solicitudes por dictaminar
            </p>
          </div>

          {/* KPI 4 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Satisfacción & NPS</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold text-slate-900">{data.metrics.calificacionPromedio}</span>
              <span className="text-xs text-amber-600 font-bold">/ 5 ★</span>
            </div>
            <p className="text-xs text-indigo-700 font-semibold">
              NPS: +{data.metrics.npsScore} pts (Calidad Óptima)
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          {[
            { id: "RESERVAS", label: `Agenda y Reservas (${data.reservas.length})`, icon: CalendarCheck },
            { 
              id: "MANTENIMIENTO", 
              label: `Salud y Mantenimiento (${data.maintenanceMetrics?.activosEnMantencion || 0} en taller)`, 
              icon: Wrench 
            },
            { id: "INVENTARIO", label: `Inventario Técnico (${data.equipamientos.length})`, icon: Boxes },
            { id: "CUADRILLAS", label: `Funcionarios y Cuadrillas (${data.suscripciones.length})`, icon: Bell },
            { id: "USUARIOS", label: `Gestión de Cuentas (${data.users.length})`, icon: Users },
            { id: "RPA", label: `Automatización RPA & Bots`, icon: Bot },
            { id: "AUDITORIA", label: `Bitácora de Auditoría (${data.auditorias.length})`, icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all touch-target ${
                  activeTab === tab.id
                    ? "bg-blue-700 text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: RESERVAS & AGENDA (WITH SCHEDULE MODIFICATION) */}
        {activeTab === "RESERVAS" && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por evento o docente..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
                {[
                  { id: "ALL", label: "Todas" },
                  { id: "PENDING", label: "Pendientes" },
                  { id: "APPROVED", label: "Aprobadas" },
                  { id: "CHECKED_IN", label: "En Curso" },
                  { id: "CHECKED_OUT", label: "Finalizadas" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setFilterStatus(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      filterStatus === s.id
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {filteredReservas.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">{r.title}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            r.status === "PENDING"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : r.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : r.status === "CHECKED_IN"
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : r.status === "CHECKED_OUT"
                              ? "bg-slate-100 text-slate-700 border-slate-300"
                              : "bg-red-50 text-red-800 border-red-300"
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Docente: <strong className="text-slate-800">{r.user.name}</strong> • {r.user.department}
                      </p>
                    </div>

                    <div className="text-xs text-slate-600 sm:text-right font-medium">
                      <span>{new Date(r.startTime).toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short" })}</span>
                      <p className="text-blue-900 font-bold text-xs">
                        {new Date(r.startTime).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })} -{" "}
                        {new Date(r.endTime).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                    <div className="flex items-center space-x-2">
                      <span>Asistentes: <strong>{r.attendeesEstimate}</strong></span>
                      <span>•</span>
                      <span>Token QR: <code className="text-slate-800">{r.qrToken || "No asignado"}</code></span>
                    </div>

                    {/* Admin Schedule Modification Button */}
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditScheduleModal(r)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold transition-colors touch-target"
                        title="Modificar Horario o Título del Evento"
                      >
                        <CalendarClock className="w-4 h-4 text-blue-700" />
                        <span>Modificar Horario / Datos</span>
                      </button>
                    </div>
                  </div>

                  {r.status === "CHECKED_OUT" && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-blue-900 font-bold">
                      <span>Horas TI Dedicadas: {r.horasTI?.[0]?.hoursDecimal || 1.5} hrs</span>
                      {r.encuesta && (
                        <span className="text-amber-600">
                          ★ {((r.encuesta.ratingOverall + r.encuesta.ratingEquipment + r.encuesta.ratingSupport) / 3).toFixed(1)}/5
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SALUD OPERACIONAL & MANTENIMIENTO DEL AUDITORIO Y HARDWARE */}
        {activeTab === "MANTENIMIENTO" && (
          <MaintenanceDashboard
            auditorio={
              data.auditorios[0] || {
                id: "default",
                name: "Auditorio Magna Principal",
                location: "Edificio A - Nivel Central",
                capacity: 150,
                isActive: true,
                status: "OPERATIONAL",
                slug: "auditorio-magna-principal",
              }
            }
            equipamientos={data.equipamientos}
            mantenimientos={data.mantenimientos || []}
            metrics={data.maintenanceMetrics}
            currentUser={adminUser}
            onRefresh={loadData}
          />
        )}

        {/* TAB 3: INVENTARIO */}
        {activeTab === "INVENTARIO" && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Catálogo de Equipamiento Técnico</h2>
                <p className="text-xs text-slate-500">
                  Bloqueo automático de hardware en mantenimiento preventivo (RF-20 / RF-21).
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {data.equipamientos.map((eq) => {
                const isMaint = eq.status === "MAINTENANCE";
                return (
                  <div
                    key={eq.id}
                    className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{eq.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                          {eq.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Serie: {eq.serialNumber || "N/A"} • Stock Total: {eq.totalQty} • Disponibles: {eq.availableQty}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 ${
                          isMaint
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        }`}
                      >
                        {isMaint ? <ShieldAlert className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>{isMaint ? "En Mantención" : "Disponible"}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleHardware(eq)}
                        disabled={isUpdating}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors touch-target"
                      >
                        {isMaint ? "Habilitar" : "Poner en Mantención"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CUADRILLAS Y FUNCIONARIOS */}
        {activeTab === "CUADRILLAS" && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Gestión de Funcionarios y Cuadrillas de Apoyo
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Agregue correos para dar acceso y enviar notificaciones automáticas por área (Aseo, Guardia, TI, Administración).
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormName("");
                  setFormEmail("");
                  setFormDept("ASEO");
                  setIsAddModalOpen(true);
                  setActionError(null);
                }}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all touch-target"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Agregar Funcionario</span>
              </button>
            </div>

            {/* Department Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-700 mr-2">Filtrar por Área:</span>
              {[
                { id: "ALL", label: `Todas las Áreas (${data.suscripciones.length})` },
                { id: "ASEO", label: "Aseo" },
                { id: "GUARDIA", label: "Guardia y Seguridad" },
                { id: "TI", label: "Soporte TI" },
                { id: "COORDINACION", label: "Administración / Coordinación" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setFilterDept(pill.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterDept === pill.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Officials List */}
            <div className="space-y-2.5">
              {filteredSuscripciones.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-300 rounded-2xl text-slate-500 text-xs">
                  No hay funcionarios registrados en el área seleccionada.
                </div>
              ) : (
                filteredSuscripciones.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                        <Mail className="w-5 h-5 text-blue-700" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              s.department === "ASEO"
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                : s.department === "GUARDIA"
                                ? "bg-blue-100 text-blue-900 border border-blue-300"
                                : s.department === "TI"
                                ? "bg-indigo-100 text-indigo-900 border border-indigo-300"
                                : "bg-purple-100 text-purple-900 border border-purple-300"
                            }`}
                          >
                            {s.department}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-mono mt-0.5">{s.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          s.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {s.isActive ? "Activo (Recibe Alertas)" : "Inactivo"}
                      </span>

                      <button
                        type="button"
                        onClick={() => openEditModal(s)}
                        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors touch-target"
                        title="Modificar Funcionario"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteOfficial(s.id, s.name)}
                        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors touch-target"
                        title="Eliminar de la lista"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

                {/* TAB: USUARIOS (GESTOR DE CUENTAS RBAC) */}
        {activeTab === "USUARIOS" && (
          <div className="space-y-4">
            {/* Header and Controls */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-700" />
                  <span>Gestor de Cuentas y Accesos del Sistema (RBAC)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Administración de credenciales, roles, departamentos y puntaje de prioridad académica.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setUserActionError(null);
                  setIsAddUserModalOpen(true);
                }}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition-all touch-target"
              >
                <UserPlus className="w-4 h-4" />
                <span>Nueva Cuenta / Usuario</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full sm:w-72">
                <input
                  type="text"
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  placeholder="Buscar por nombre, correo o departamento..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
                {[
                  { id: "ALL", label: "Todos los Roles" },
                  { id: "OWNER", label: "Super Admin" },
                  { id: "IT_SERVICE", label: "Técnico TI" },
                  { id: "ASSISTANT", label: "Encargada" },
                  { id: "PROFESSOR", label: "Docente" },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setFilterUserRole(r.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      filterUserRole === r.id
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Users List */}
            <div className="grid grid-cols-1 gap-3">
              {filteredUsers.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 text-xs">
                  No se encontraron cuentas con los criterios de búsqueda seleccionados.
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const isSuperAdmin = u.email === "benjamin54144752123@gmail.com" || u.role === "OWNER";
                  
                  let roleBadge = {
                    label: "Docente",
                    bg: "bg-emerald-50 text-emerald-800 border-emerald-300",
                  };
                  if (u.role === "OWNER" || u.role === "IT_ADMIN") {
                    roleBadge = { label: "Super Administrador", bg: "bg-purple-50 text-purple-800 border-purple-300" };
                  } else if (u.role === "IT_SERVICE") {
                    roleBadge = { label: "Soporte TI Terreno", bg: "bg-blue-50 text-blue-800 border-blue-300" };
                  } else if (u.role === "ASSISTANT") {
                    roleBadge = { label: "Encargada Recintos", bg: "bg-amber-50 text-amber-800 border-amber-300" };
                  }

                  return (
                    <div
                      key={u.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 truncate">
                            {u.name}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadge.bg}`}>
                            {roleBadge.label}
                          </span>
                          {isSuperAdmin && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white flex items-center space-x-1">
                              <Shield className="w-3 h-3 text-amber-400" />
                              <span>Cuenta Principal</span>
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                          <span className="font-mono text-slate-800 font-semibold">{u.email}</span>
                          {u.department && (
                            <span>• {u.department}</span>
                          )}
                          {u.phone && (
                            <span className="text-slate-500 font-mono">• Tel: {u.phone}</span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-0.5">
                          <span>
                            Prioridad Académica: <strong className="text-blue-800 font-bold">{u.priorityScore ?? 100} pts</strong>
                          </span>
                          {u.createdAt && (
                            <span>
                              • Creado: {new Date(u.createdAt).toLocaleDateString("es-CL")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 self-end sm:self-center">
                        {/* Botón Ver Logs y Cambios Específicos de la Cuenta */}
                        <button
                          type="button"
                          onClick={() => handleOpenUserLogs(u)}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-purple-800 hover:bg-purple-50 text-xs font-semibold flex items-center space-x-1 transition-colors touch-target"
                          title="Ver Registro de Logs y Cambios de esta Cuenta (Solo Admin)"
                        >
                          <Activity className="w-3.5 h-3.5 text-purple-600" />
                          <span>Logs</span>
                        </button>

                        {/* Botón Delegar Rol de Administrador/Gestor */}
                        {!isSuperAdmin && u.role !== "IT_ADMIN" && (
                          <button
                            type="button"
                            onClick={() => {
                              setDelegatingAdminUser(u);
                              setConfirmDelegateAdmin(false);
                            }}
                            className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-indigo-800 hover:bg-indigo-50 text-xs font-semibold flex items-center space-x-1 transition-colors touch-target"
                            title="Dar Acceso como Gestor de Cuentas (Doble Verificación)"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Dar Admin</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setResetPasswordUser(u);
                            setNewPasswordVal("Capstone2026!");
                            setUserActionError(null);
                          }}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-amber-800 hover:bg-amber-50 text-xs font-semibold flex items-center space-x-1 transition-colors touch-target"
                          title="Restablecer Contraseña"
                        >
                          <Key className="w-3.5 h-3.5 text-amber-600" />
                          <span>Clave</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setConfirmEditAccount(false);
                            openEditUserModal(u);
                          }}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-blue-800 hover:bg-blue-50 text-xs font-semibold flex items-center space-x-1 transition-colors touch-target"
                          title="Editar Datos y Rol"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Editar</span>
                        </button>

                        {isSuperAdmin ? (
                          <div
                            className="p-2 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                            title="Cuenta protegida (No se puede eliminar)"
                          >
                            <Lock className="w-4 h-4" />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingUser(u);
                              setConfirmDeleteAccount(false);
                            }}
                            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors touch-target"
                            title="Eliminar Cuenta (Doble Verificación)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}


                {/* TAB: RPA (AUTOMATIZACIÓN ROBÓTICA Y PLAN DE CONTINGENCIAS) */}
        {activeTab === "RPA" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-indigo-700" />
                    <span>Módulo RPA (Robotic Process Automation) &amp; Contingencias</span>
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Daemon Autónomo Operativo</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Agentes autónomos para mitigación de ausencias (No-Show), retornos preventivos y telemetría predictiva de hardware.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunRPACycle}
                disabled={isRPARunning}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold shadow-md transition-all touch-target disabled:opacity-50"
              >
                <Zap className={`w-4 h-4 ${isRPARunning ? "animate-spin" : ""}`} />
                <span>{isRPARunning ? "Ejecutando RPA..." : "Ejecutar Ciclo de RPA Ahora"}</span>
              </button>
            </div>

            {/* RPA Status & Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>Bot 1: Anti No-Show</span>
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">Tolerancia 30m</div>
                <p className="text-[11px] text-slate-500">
                  Libera salas no iniciadas y penaliza score docente (-15 pts).
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>Bot 2: Retorno Preventivo</span>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Boxes className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">Auto Check-out</div>
                <p className="text-[11px] text-slate-500">
                  Restaura implementos al inventario si el evento venció.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>Bot 3: Telemetría Predictiva</span>
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">MTTR &amp; Alertas</div>
                <p className="text-[11px] text-slate-500">
                  Detecta hardware con fallas reiteradas para taller preventivo.
                </p>
              </div>
            </div>

            {/* Results of Last RPA Execution */}
            {rpaResult && (
              <div className="bg-indigo-50/80 rounded-2xl p-5 border border-indigo-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-indigo-700" />
                    <h3 className="text-xs font-bold text-indigo-950 uppercase">
                      Resultado de Última Ejecución del RPA ({rpaResult.timestamp})
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-700">Estado: Satisfactorio</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-indigo-100">
                    <span className="text-slate-500 block text-[10px]">No-Shows Mitigados:</span>
                    <strong className="text-slate-900 text-base">{rpaResult.noShowsCount}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100">
                    <span className="text-slate-500 block text-[10px]">Cierres Preventivos:</span>
                    <strong className="text-slate-900 text-base">{rpaResult.autoCheckoutsCount}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100">
                    <span className="text-slate-500 block text-[10px]">Alertas Predictivas:</span>
                    <strong className="text-slate-900 text-base">{rpaResult.predictiveAlertsCount}</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 block">Detalle de Acciones del Bot:</span>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {rpaResult.details.map((d, i) => (
                      <li key={i} className="flex items-start space-x-2 bg-white/70 p-2 rounded-lg border border-indigo-100">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* PROTOCOLO DE CONTINGENCIAS (SOP / QUÉ HACER ANTE CADA EVENTO) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <ShieldAlertIcon className="w-4 h-4 text-amber-600" />
                  <span>Protocolo de Contingencias Institucionales (SOP - Modo de Acción)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Guía estandarizada para el Administrador ante situaciones críticas en el campus.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 font-bold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>1. Docente No Asiste / No se Presenta (No-Show)</span>
                  </strong>
                  <p className="text-slate-600">
                    <strong>Acción RPA:</strong> Tras 30 minutos de la hora pactada, el bot cancela la reserva, libera el recinto en la agenda y reduce 15 puntos de prioridad al solicitante. Las cuadrillas son notificadas.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 font-bold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>2. Falla Crítica de Proyector o Audio en Plena Charla</span>
                  </strong>
                  <p className="text-slate-600">
                    <strong>Acción Admin:</strong> Ir a la pestaña <em>Salud y Mantenimiento</em>, pulsar <em>Registrar Novedad</em> para enviar el equipo a taller. El sistema bloquea reservas futuras de ese equipo y permite reasignar otro del inventario disponible.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 font-bold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>3. Caída de Conexión a Internet en el Auditorio</span>
                  </strong>
                  <p className="text-slate-600">
                    <strong>Acción Terreno:</strong> El técnico puede validar al docente mediante el token alfanumérico impreso en el Pase QR (ej: <code>qr-res-001</code>) o sincronizar de forma offline mediante la versión local autónoma (<code>http://localhost:3000</code>).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-slate-900 font-bold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>4. Olvido o Bloqueo de Contraseña de Docente / Técnico</span>
                  </strong>
                  <p className="text-slate-600">
                    <strong>Acción Admin:</strong> Ingresar a <em>Gestión de Cuentas</em>, pulsar el botón <em>Clave</em> y restablecerla instantáneamente con cifrado bcrypt. El cambio queda registrado en la bitácora con IP y hora.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* TAB 4: AUDITORIA */}
        {activeTab === "AUDITORIA" && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Bitácora Inmutable de Auditoría Operativa</h2>
              <p className="text-xs text-slate-500">
                Trazabilidad completa de operaciones y modificaciones de horarios (RF-24 / ISO 27001).
              </p>
            </div>

            <div className="space-y-2">
              {data.auditorias.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <strong className={`font-mono text-xs ${log.action === "HORARIO_MODIFICADO_ADMIN" ? "text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200" : "text-blue-900"}`}>
                        {log.action}
                      </strong>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {log.entity}
                      </span>
                    </div>
                    <p className="text-slate-800 mt-0.5">{log.details}</p>
                    <p className="text-[10px] text-slate-500">
                      Operador: {log.user?.name || "Sistema"} • IP: {log.ipAddress || "127.0.0.1"}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-500 whitespace-nowrap font-mono">
                    {new Date(log.createdAt).toLocaleString("es-CL")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

                  {/* Modal: ELIMINAR CUENTA (DOBLE VERIFICACIÓN OBLIGATORIA) */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl border border-red-300 p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-red-100">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Eliminación de Cuenta</h3>
                <p className="text-xs text-red-600 font-semibold">Acción Crítica con Doble Verificación</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-1">
              <p>Está a punto de eliminar permanentemente la cuenta de:</p>
              <p className="font-bold text-sm text-red-950 font-mono">{deletingUser.name} ({deletingUser.email})</p>
              <p className="text-[11px] text-red-700 pt-1">
                Se revocará inmediatamente su acceso a los portales y se estampará en la bitácora forense de auditoría.
              </p>
            </div>

            {/* Checkbox de Doble Verificación */}
            <div className="p-3 rounded-2xl bg-slate-100 border border-slate-300">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmDeleteAccount}
                  onChange={(e) => setConfirmDeleteAccount(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded accent-red-700"
                />
                <span className="text-xs font-bold text-slate-900">
                  ☑ Entiendo que esta acción es irreversible y confirmo bajo mi rol de Administrador la eliminación permanente de esta cuenta.
                </span>
              </label>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeletingUser(null);
                  setConfirmDeleteAccount(false);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold touch-target"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={!confirmDeleteAccount || isSubmittingUser}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all touch-target disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmittingUser ? "Eliminando..." : "Eliminar Definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: DELEGAR ROL DE ADMINISTRADOR / GESTOR DE CUENTAS (DOBLE VERIFICACIÓN) */}
      {delegatingAdminUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl border border-indigo-300 p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-indigo-100">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Conceder Rol de Administrador</h3>
                <p className="text-xs text-indigo-600 font-semibold">Delegación de Gestión de Cuentas</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 space-y-1">
              <p>Asignarás privilegios de <strong>Administrador de TI (IT_ADMIN)</strong> a:</p>
              <p className="font-bold text-sm text-indigo-950 font-mono">{delegatingAdminUser.name} ({delegatingAdminUser.email})</p>
              <p className="text-[11px] text-indigo-700 pt-1">
                Este usuario podrá ingresar a <code>/admin</code> y colaborar en la gestión de cuentas del sistema.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-100 border border-slate-300">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmDelegateAdmin}
                  onChange={(e) => setConfirmDelegateAdmin(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded accent-indigo-700"
                />
                <span className="text-xs font-bold text-slate-900">
                  ☑ Confirmo la asignación de privilegios de Administrador para que este usuario gestione cuentas.
                </span>
              </label>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDelegatingAdminUser(null);
                  setConfirmDelegateAdmin(false);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold touch-target"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelegateAdmin}
                disabled={!confirmDelegateAdmin || isSubmittingUser}
                className="px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold shadow-md transition-all touch-target disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmittingUser ? "Asignando..." : "Confirmar y Promover"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: HISTORIAL DE LOGS Y CAMBIOS DE UNA CUENTA ESPECÍFICA (SOLO ADMIN) */}
      {viewingLogsUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-300 p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-900">Historial de Auditoría de Cuenta</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white flex items-center space-x-1">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>Exclusivo Super Admin</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {viewingLogsUser.name} &bull; {viewingLogsUser.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingLogsUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {isLoadingUserLogs ? (
                <div className="p-8 text-center text-slate-500 text-xs font-semibold">
                  Cargando trazabilidad y registros forenses de la cuenta...
                </div>
              ) : userLogsList.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-slate-200">
                  No hay transacciones registradas para esta cuenta aún.
                </div>
              ) : (
                userLogsList.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 hover:bg-white transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center space-x-2">
                        <strong className="font-mono text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {log.action}
                        </strong>
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-bold">
                          {log.entity}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(log.createdAt).toLocaleString("es-CL")}
                      </span>
                    </div>

                    <p className="text-slate-800 text-xs">{log.details}</p>

                    <div className="text-[10px] text-slate-500 flex items-center space-x-3 pt-0.5">
                      <span>Operador: {log.user?.name || "Sistema"}</span>
                      <span>• IP: {log.ipAddress || "127.0.0.1"}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingLogsUser(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold touch-target"
              >
                Cerrar Historial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: CREAR NUEVA CUENTA DE USUARIO */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-300 p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Crear Nueva Cuenta de Usuario</h3>
                  <p className="text-xs text-slate-500">Asignación de credenciales y rol institucional (RBAC)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {userActionError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{userActionError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Dr. Alejandro Soto"
                  value={userFormName}
                  onChange={(e) => setUserFormName(e.target.value)}
                  className="w-full bg-slate-50 text-xs font-semibold text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Correo Electrónico (Login) *</label>
                  <input
                    type="email"
                    required
                    placeholder="alejandro.soto@institucion.cl"
                    value={userFormEmail}
                    onChange={(e) => setUserFormEmail(e.target.value)}
                    className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Contraseña Inicial *</label>
                  <input
                    type="text"
                    required
                    value={userFormPassword}
                    onChange={(e) => setUserFormPassword(e.target.value)}
                    className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Rol en el Sistema *</label>
                  <select
                    value={userFormRole}
                    onChange={(e) => setUserFormRole(e.target.value)}
                    className="w-full bg-slate-50 text-xs font-bold text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  >
                    <option value="PROFESSOR">Docente Solicitante (/docente)</option>
                    <option value="IT_SERVICE">Soporte TI Terreno (/tecnico)</option>
                    <option value="ASSISTANT">Encargada Recintos (/encargado)</option>
                    <option value="IT_ADMIN">Administrador General (/admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Teléfono Móvil</label>
                  <input
                    type="text"
                    placeholder="+56 9 1234 5678"
                    value={userFormPhone}
                    onChange={(e) => setUserFormPhone(e.target.value)}
                    className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Facultad / Escuela / Departamento</label>
                <input
                  type="text"
                  placeholder="Escuela de Informática y Telecomunicaciones"
                  value={userFormDept}
                  onChange={(e) => setUserFormDept(e.target.value)}
                  className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* DOBLE VERIFICACIÓN OBLIGATORIA SOLICITADA POR EL USUARIO */}
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmCreateAccount}
                    onChange={(e) => setConfirmCreateAccount(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded accent-blue-700"
                  />
                  <span className="text-xs font-bold text-blue-950">
                    ☑ Confirmo bajo mi rol de Super Administrador que estoy seguro de crear esta cuenta y concederle los accesos seleccionados.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddUserModalOpen(false);
                    setConfirmCreateAccount(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold touch-target"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser || !confirmCreateAccount}
                  className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md touch-target transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingUser ? "Creando Cuenta..." : "Registrar Cuenta (Confirmado)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: EDITAR CUENTA DE USUARIO */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-300 p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Editar Cuenta: {editingUser.name}</h3>
                  <p className="text-xs text-slate-500">Modificación de rol, departamento y prioridad</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {userActionError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{userActionError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={userFormName}
                  onChange={(e) => setUserFormName(e.target.value)}
                  className="w-full bg-slate-50 text-xs font-semibold text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={userFormEmail}
                    onChange={(e) => setUserFormEmail(e.target.value)}
                    className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Rol en el Sistema *</label>
                  <select
                    value={userFormRole}
                    onChange={(e) => setUserFormRole(e.target.value)}
                    className="w-full bg-slate-50 text-xs font-bold text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  >
                    <option value="OWNER">Super Administrador (OWNER)</option>
                    <option value="IT_ADMIN">Administrador de TI (IT_ADMIN)</option>
                    <option value="IT_SERVICE">Soporte TI Terreno (IT_SERVICE)</option>
                    <option value="ASSISTANT">Encargada Recintos (ASSISTANT)</option>
                    <option value="PROFESSOR">Docente Solicitante (PROFESSOR)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Facultad / Departamento</label>
                  <input
                    type="text"
                    value={userFormDept}
                    onChange={(e) => setUserFormDept(e.target.value)}
                    className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={userFormPhone}
                    onChange={(e) => setUserFormPhone(e.target.value)}
                    className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Puntaje de Prioridad Académica: <strong className="text-blue-800">{userFormScore} pts</strong>
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={userFormScore}
                  onChange={(e) => setUserFormScore(Number(e.target.value))}
                  className="w-full accent-blue-700 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500">100 = Prioridad Máxima (Asistencia perfecta). Menor a 70 = Penalizado por inasistencias (No-Show).</p>
              </div>

              {/* DOBLE VERIFICACIÓN PARA MODIFICACIÓN */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmEditAccount}
                    onChange={(e) => setConfirmEditAccount(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded accent-amber-600"
                  />
                  <span className="text-xs font-bold text-amber-950">
                    ☑ Confirmo la actualización de privilegios y datos para este usuario en la base de datos institucional.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setConfirmEditAccount(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold touch-target"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser || !confirmEditAccount}
                  className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md touch-target transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingUser ? "Guardando..." : "Guardar Cambios (Confirmado)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: RESTABLECER CONTRASEÑA */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl border border-slate-300 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Restablecer Contraseña</h3>
                  <p className="text-xs text-slate-500">{resetPasswordUser.name} ({resetPasswordUser.email})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResetPasswordUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {userActionError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{userActionError}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Nueva Contraseña *</label>
                <input
                  type="text"
                  required
                  minLength={6}
                  value={newPasswordVal}
                  onChange={(e) => setNewPasswordVal(e.target.value)}
                  className="w-full bg-slate-50 text-xs font-mono text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <p className="text-[10px] text-slate-500 mt-1">Mínimo 6 caracteres. Se encriptará con bcrypt unidireccional.</p>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setResetPasswordUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold touch-target"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md touch-target transition-all disabled:opacity-50"
                >
                  {isSubmittingUser ? "Actualizando..." : "Confirmar Clave"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: MODIFICAR HORARIOS (CONTROL ADMINISTRATIVO CON CONFIRMACIÓN DE SEGURIDAD) */}
      {editingReserva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-300 p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <CalendarClock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Modificar Horario de Reserva</h3>
                  <p className="text-xs text-slate-500">Control Administrativo de Agenda y Reasignación</p>
                </div>
              </div>
              <button
                onClick={() => setEditingReserva(null)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 touch-target"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {scheduleError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs flex items-start space-x-2 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-700" />
                <span>{scheduleError}</span>
              </div>
            )}

            {scheduleSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start space-x-2 font-medium">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-700" />
                <span>{scheduleSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Título del Evento
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-50 text-xs font-semibold text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nueva Fecha y Hora de Inicio *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nueva Fecha y Hora de Término *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                    className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Estimación de Asistentes: <strong className="text-blue-800">{editAttendees} personas</strong>
                </label>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={editAttendees}
                  onChange={(e) => setEditAttendees(Number(e.target.value))}
                  className="w-full accent-blue-700 cursor-pointer"
                />
              </div>

              {/* SECURITY CONFIRMATION BOX REQUESTED BY USER */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>Confirmación de Seguridad Obligatoria</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Modificar un horario reajusta la agenda del auditorio y notifica a las cuadrillas de servicios. Este cambio quedará firmado bajo su cuenta en la bitácora inmutable.
                </p>

                <label className="flex items-start space-x-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmSecurity}
                    onChange={(e) => setConfirmSecurity(e.target.checked)}
                    className="w-5 h-5 rounded accent-blue-800 flex-shrink-0 mt-0.5"
                  />
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    Sí, confirmo bajo mi rol de Administrador que estoy seguro de realizar este cambio de horario.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingReserva(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold touch-target"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!confirmSecurity || isSubmitting}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md touch-target transition-all flex items-center space-x-1.5 ${
                    confirmSecurity && !isSubmitting
                      ? "bg-blue-700 hover:bg-blue-800 text-white"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? "Validando Colisiones..." : "Guardar Cambios de Horario"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Agregar Funcionario */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl border border-slate-300 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Agregar Funcionario a Cuadrilla</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={handleCreateOfficial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nombre Completo / Cargo *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej. Juan Pérez - Turno Mañana"
                  className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Correo Electrónico Institucional o Personal *
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="ejemplo.funcionario@institucion.cl"
                  className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Este correo recibirá notificaciones de reservas y sanitización apenas se confirme un evento.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Área / Departamento Asignado *
                </label>
                <select
                  value={formDept}
                  onChange={(e) => setFormDept(e.target.value)}
                  className="w-full bg-slate-50 text-xs font-bold text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="ASEO">Aseo y Sanitización</option>
                  <option value="GUARDIA">Guardia, Accesos y Seguridad</option>
                  <option value="TI">Soporte Técnico de TI</option>
                  <option value="COORDINACION">Administración / Coordinación</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold touch-target"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md touch-target transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Guardar Funcionario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Modificar Funcionario */}
      {editingOfficial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl border border-slate-300 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Modificar Funcionario</h3>
              </div>
              <button
                onClick={() => setEditingOfficial(null)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateOfficial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nombre Completo / Cargo *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Área / Departamento *
                </label>
                <select
                  value={formDept}
                  onChange={(e) => setFormDept(e.target.value)}
                  className="w-full bg-slate-50 text-xs font-bold text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="ASEO">Aseo y Sanitización</option>
                  <option value="GUARDIA">Guardia, Accesos y Seguridad</option>
                  <option value="TI">Soporte Técnico de TI</option>
                  <option value="COORDINACION">Administración / Coordinación</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-700"
                  />
                  <span>Funcionario Activo (Recibe notificaciones automáticas)</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingOfficial(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold touch-target"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md touch-target transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Actualizando..." : "Actualizar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
