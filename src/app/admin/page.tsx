"use client";

import React, { useState, useEffect } from "react";
import { PortalHeader } from "@/components/PortalHeader";
import { 
  getDashboardData, 
  toggleEquipmentStatusAction,
  createSuscripcionAction,
  updateSuscripcionAction,
  deleteSuscripcionAction,
  updateReservationScheduleAction
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
  Activity
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

  const [activeTab, setActiveTab] = useState<"RESERVAS" | "MANTENIMIENTO" | "INVENTARIO" | "CUADRILLAS" | "AUDITORIA">("RESERVAS");
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
