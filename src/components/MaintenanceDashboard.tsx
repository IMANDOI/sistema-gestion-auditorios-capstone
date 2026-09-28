"use client";

import React, { useState } from "react";
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  PlusCircle,
  Activity,
  Layers,
  Sparkles,
  BarChart3,
  PieChart as PieIcon,
  Flame,
  X,
  Search,
  Check,
  Radio,
  Tv,
  Mic,
  Laptop,
  Wind,
  Settings2,
  Calendar,
  DollarSign,
  UserCheck
} from "lucide-react";
import {
  AuditorioItem,
  EquipamientoItem,
  RegistroMantenimientoItem,
  MaintenanceMetrics,
  UserSession
} from "@/lib/types";
import {
  createMantenimientoAction,
  resolveMantenimientoAction,
  updateAuditorioStatusAction,
  toggleEquipmentStatusAction
} from "@/lib/actions";

interface Props {
  auditorio: AuditorioItem;
  equipamientos: EquipamientoItem[];
  mantenimientos: RegistroMantenimientoItem[];
  metrics: MaintenanceMetrics;
  currentUser: UserSession;
  onRefresh: () => Promise<void>;
}

export default function MaintenanceDashboard({
  auditorio,
  equipamientos,
  mantenimientos,
  metrics,
  currentUser,
  onRefresh,
}: Props) {
  // Filters
  const [filterStatus, setFilterStatus] = useState<"ALL" | "EN_MANTENCION" | "RESUELTO">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuditorioModalOpen, setIsAuditorioModalOpen] = useState(false);
  const [resolvingItem, setResolvingItem] = useState<RegistroMantenimientoItem | null>(null);

  // Form states for creating maintenance
  const [targetType, setTargetType] = useState<"EQUIPAMIENTO" | "AUDITORIO">("EQUIPAMIENTO");
  const [selectedTargetId, setSelectedTargetId] = useState(equipamientos[0]?.id || "");
  const [maintType, setMaintType] = useState<"PREVENTIVO" | "CORRECTIVO" | "CALIBRACION" | "MEJORA" | "DANIO_REPORTE">("CORRECTIVO");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"BAJA" | "MEDIA" | "ALTA" | "CRITICA">("MEDIA");
  const [technician, setTechnician] = useState("Soporte Técnico Audiovisual");
  const [costEstimate, setCostEstimate] = useState<number>(0);

  // Form state for changing auditorio status
  const [newAuditorioStatus, setNewAuditorioStatus] = useState<"OPERATIONAL" | "MAINTENANCE" | "PARTIAL_RESTRICTION">(
    auditorio.status || "OPERATIONAL"
  );
  const [auditorioReason, setAuditorioReason] = useState("");

  // Resolution state
  const [resolutionNotes, setResolutionNotes] = useState("");

  // Status feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filtered maintenance list
  const filteredMantenimientos = mantenimientos.filter((m) => {
    if (filterStatus === "EN_MANTENCION" && m.status === "RESUELTO") return false;
    if (filterStatus === "RESUELTO" && m.status !== "RESUELTO") return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const targetName = (m.targetType === "AUDITORIO" ? auditorio.name : m.equipamiento?.name || "").toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        targetName.includes(q) ||
        (m.technicianAssigned && m.technicianAssigned.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Handle Create Maintenance
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setFeedbackMessage({ type: "error", text: "Debe ingresar título y descripción de la novedad." });
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage(null);

    const targetId = targetType === "AUDITORIO" ? auditorio.id : selectedTargetId;

    const res = await createMantenimientoAction({
      targetType,
      targetId,
      type: maintType,
      title: title.trim(),
      description: description.trim(),
      severity,
      technicianAssigned: technician.trim(),
      costEstimate: Number(costEstimate) || 0,
      adminUserId: currentUser.id,
      reportedByName: currentUser.name,
    });

    setIsSubmitting(false);
    if (res.success) {
      setFeedbackMessage({
        type: "success",
        text: `¡Novedad registrada! ${targetType === "AUDITORIO" ? "El auditorio" : "El implemento"} fue puesto en mantenimiento.`,
      });
      setIsCreateModalOpen(false);
      setTitle("");
      setDescription("");
      await onRefresh();
    } else {
      setFeedbackMessage({ type: "error", text: res.error || "Error al registrar mantenimiento." });
    }
  };

  // Handle Resolve Maintenance
  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingItem) return;

    setIsSubmitting(true);
    const res = await resolveMantenimientoAction(
      resolvingItem.id,
      resolutionNotes.trim() || "Mantenimiento y pruebas técnicas completadas con éxito. Retorno a servicio activo.",
      currentUser.id
    );
    setIsSubmitting(false);

    if (res.success) {
      setFeedbackMessage({
        type: "success",
        text: "¡Novedad resuelta exitosamente! El elemento ha sido restaurado a estado Operativo.",
      });
      setResolvingItem(null);
      setResolutionNotes("");
      await onRefresh();
    } else {
      setFeedbackMessage({ type: "error", text: res.error || "Error al resolver novedad." });
    }
  };

  // Handle Auditorium Status Change
  const handleAuditorioStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await updateAuditorioStatusAction(
      auditorio.id,
      newAuditorioStatus,
      auditorioReason.trim() || "Ajuste de operatividad desde panel de control.",
      currentUser.id
    );
    setIsSubmitting(false);

    if (res.success) {
      setFeedbackMessage({
        type: "success",
        text: `Estado del Auditorio actualizado a: ${newAuditorioStatus}`,
      });
      setIsAuditorioModalOpen(false);
      setAuditorioReason("");
      await onRefresh();
    } else {
      setFeedbackMessage({ type: "error", text: res.error || "Error al actualizar estado del auditorio." });
    }
  };

  // Category Icon helper
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "AUDIO":
        return <Mic className="w-4 h-4 text-purple-700" />;
      case "PROJECTION":
        return <Tv className="w-4 h-4 text-blue-700" />;
      case "COMPUTING":
        return <Laptop className="w-4 h-4 text-indigo-700" />;
      case "HVAC":
        return <Wind className="w-4 h-4 text-cyan-700" />;
      default:
        return <Layers className="w-4 h-4 text-slate-700" />;
    }
  };

  // Severity styling
  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "CRITICA":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-red-100 text-red-800 border border-red-300">Crítica</span>;
      case "ALTA":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">Alta</span>;
      case "MEDIA":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">Media</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Baja</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback banner */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-bold border transition-all ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-300"
              : "bg-red-50 text-red-900 border-red-300"
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-700 flex-shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP HERO: AUDITORIO GLOBAL STATUS & ACTIONS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Control de Espacio e Infraestructura
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span className="text-xs font-semibold text-slate-600">{auditorio.location}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-extrabold text-slate-900">{auditorio.name}</h2>
            {auditorio.status === "OPERATIONAL" && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>100% Operativo y Disponible</span>
              </span>
            )}
            {auditorio.status === "MAINTENANCE" && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <Wrench className="w-3.5 h-3.5 text-amber-700" />
                <span>En Mantenimiento Técnico (Agenda Pausada)</span>
              </span>
            )}
            {auditorio.status === "PARTIAL_RESTRICTION" && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
                <Activity className="w-3.5 h-3.5 text-indigo-700" />
                <span>Operatividad Parcial / Con Restricciones</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            {auditorio.description || "Recinto principal de actos y docencia académica."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setIsAuditorioModalOpen(true)}
            className="flex-1 md:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold touch-target shadow-sm transition-all"
          >
            <Settings2 className="w-4 h-4 text-slate-700" />
            <span>Cambiar Estado Auditorio</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTargetType("EQUIPAMIENTO");
              setIsCreateModalOpen(true);
            }}
            className="flex-1 md:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold touch-target shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Registrar Novedad / Mantención</span>
          </button>
        </div>
      </div>

      {/* METRICS & KPIS TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Operatividad de Implementos */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
            <span>Operatividad Equipos</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.tasaOperatividadEquipos}%</span>
            <span className="text-xs font-bold text-emerald-700">Óptimo</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-blue-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.tasaOperatividadEquipos}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 font-medium">
            {equipamientos.filter((e) => e.status === "AVAILABLE").length} de {equipamientos.length} implementos 100% disponibles
          </span>
        </div>

        {/* KPI 2: Activos en Mantenimiento */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
            <span>En Mantención Activa</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-amber-900">{metrics.activosEnMantencion}</span>
            <span className="text-xs text-slate-500 font-semibold">casos abiertos</span>
          </div>
          <span className="text-[11px] text-amber-800 font-medium mt-3 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
            {metrics.resueltos} intervenciones resueltas con éxito
          </span>
        </div>

        {/* KPI 3: Downtime Acumulado */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
            <span>Downtime Total</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.downtimeHorasAcumuladas}</span>
            <span className="text-xs text-slate-500 font-semibold">horas fuera de servicio</span>
          </div>
          <span className="text-[11px] text-indigo-700 font-semibold mt-3">
            MTTR (Tiempo medio reparación): {metrics.mttrHorasPromedio} hrs
          </span>
        </div>

        {/* KPI 4: Auditoría e Historial */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
            <span>Historial Total</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{metrics.totalMantenimientos}</span>
            <span className="text-xs text-emerald-700 font-bold">registros</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-3">
            Garantía y trazabilidad inmutable bajo ISO 25010
          </span>
        </div>
      </div>

      {/* CHARTS SECTION (VISUAL ANALYTICS DASHBOARD) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART 1: BARRAS POR CATEGORÍA DE IMPLEMENTO (AUDIO, PROYECCIÓN, CÓMPUTO, HVAC) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Estado de Implementos por Categoría</h3>
              <p className="text-xs text-slate-500">Distribución de hardware disponible vs en mantenimiento</p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-semibold">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-md bg-blue-700"></span>
                <span className="text-slate-700">Operativo</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-500"></span>
                <span className="text-slate-700">Mantenimiento</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {metrics.distribucionPorCategoria.map((cat) => {
              const total = cat.total;
              const enMaint = cat.enMantencion;
              const disponibles = Math.max(0, total - enMaint);
              const pctDisp = total > 0 ? (disponibles / total) * 100 : 100;
              const pctMaint = total > 0 ? (enMaint / total) * 100 : 0;

              return (
                <div key={cat.categoria} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 font-bold text-slate-800">
                      {getCategoryIcon(cat.categoria)}
                      <span>
                        {cat.categoria === "AUDIO"
                          ? "Audio & Microfonía"
                          : cat.categoria === "PROJECTION"
                          ? "Proyección & Pantallas"
                          : cat.categoria === "COMPUTING"
                          ? "Cómputo & Redes"
                          : cat.categoria === "HVAC"
                          ? "Climatización HVAC"
                          : "Otros Equipos"}
                      </span>
                    </div>
                    <span className="font-bold text-slate-600">
                      {disponibles} disp. / {total} total {enMaint > 0 && `(${enMaint} en taller)`}
                    </span>
                  </div>

                  {/* Multi-segment visual bar */}
                  <div className="w-full bg-slate-100 h-4 rounded-xl flex overflow-hidden border border-slate-200">
                    <div
                      className="bg-blue-700 h-full transition-all duration-500"
                      style={{ width: `${pctDisp}%` }}
                      title={`${disponibles} Operativos`}
                    ></div>
                    {pctMaint > 0 && (
                      <div
                        className="bg-amber-500 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ width: `${pctMaint}%` }}
                        title={`${enMaint} En Mantenimiento`}
                      >
                        {enMaint}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 2: DONUT / RADIAL DISTRIBUCIÓN POR TIPO DE INTERVENCIÓN */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Distribución por Tipo de Novedad</h3>
            <p className="text-xs text-slate-500">Histórico de acciones técnicas registradas</p>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            {/* SVG Visual Donut Chart */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                {/* Preventivo Segment */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#1d4ed8"
                  strokeWidth="5"
                  strokeDasharray="50 100"
                  strokeDashoffset="0"
                />
                {/* Correctivo Segment */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="5"
                  strokeDasharray="30 100"
                  strokeDashoffset="-50"
                />
                {/* Calibración Segment */}
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="5"
                  strokeDasharray="20 100"
                  strokeDashoffset="-80"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900">{metrics.totalMantenimientos}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Eventos</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs font-bold">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-700"></span>
              <span className="text-slate-700">Preventivo: 2</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-700">Correctivo: 1</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="text-slate-700">Calibración: 1</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              <span className="text-slate-700">Daño reporte: 0</span>
            </div>
          </div>
        </div>
      </div>

      {/* BITÁCORA Y REGISTRO CRONOLÓGICO DE NOVEDADES Y MANTENIMIENTOS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Bitácora Histórica de lo que pasa en el Auditorio e Implementos
            </h3>
            <p className="text-xs text-slate-500">
              Registro completo de novedades, fallas de micrófonos/data show, revisiones preventivas y resoluciones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-60">
              <input
                type="text"
                placeholder="Buscar por implemento, falla..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>

            {/* Filter buttons */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilterStatus("ALL")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === "ALL" ? "bg-white text-blue-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Todos ({mantenimientos.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("EN_MANTENCION")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === "EN_MANTENCION"
                    ? "bg-white text-amber-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Activos ({metrics.activosEnMantencion})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("RESUELTO")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === "RESUELTO"
                    ? "bg-white text-emerald-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Resueltos ({metrics.resueltos})
              </button>
            </div>
          </div>
        </div>

        {/* LIST / TABLE OF RECORDS */}
        {filteredMantenimientos.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No hay novedades registradas con los filtros actuales.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMantenimientos.map((item) => {
              const isResolved = item.status === "RESUELTO";
              const targetName =
                item.targetType === "AUDITORIO"
                  ? auditorio.name
                  : item.equipamiento?.name || "Implemento técnico";

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isResolved
                      ? "bg-slate-50/70 border-slate-200"
                      : "bg-amber-50/40 border-amber-200 shadow-sm"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
                        {item.targetType === "AUDITORIO" ? (
                          <Activity className="w-4 h-4 text-blue-800" />
                        ) : (
                          getCategoryIcon(item.equipamiento?.category || "AUDIO")
                        )}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-extrabold text-slate-900">{targetName}</span>
                          <span className="text-[11px] text-slate-400">•</span>
                          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wide">
                            {item.type}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">{item.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {getSeverityBadge(item.severity)}
                      {isResolved ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Resuelto y Operativo</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1 animate-pulse">
                          <Wrench className="w-3 h-3" />
                          <span>En Mantenimiento</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed pl-1 sm:pl-10">
                    {item.description}
                  </p>

                  {/* Resolution Notes box if resolved */}
                  {isResolved && item.resolutionNotes && (
                    <div className="mt-2.5 sm:ml-10 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 space-y-0.5 font-medium">
                      <span className="font-bold flex items-center space-x-1 text-emerald-950">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Constancia de Solución Técnica:</span>
                      </span>
                      <p className="text-[11px] leading-relaxed text-emerald-900">{item.resolutionNotes}</p>
                    </div>
                  )}

                  {/* Footer metadata & actions */}
                  <div className="mt-3 sm:ml-10 pt-2 border-t border-slate-200/70 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2">
                    <div className="flex flex-wrap items-center space-x-3">
                      <span>Reportado por: <strong className="text-slate-800">{item.reportedBy}</strong></span>
                      <span>•</span>
                      <span>Técnico a cargo: <strong className="text-slate-800">{item.technicianAssigned || "TI"}</strong></span>
                      <span>•</span>
                      <span>
                        Inicio:{" "}
                        <strong className="text-slate-800">
                          {new Date(item.startDate).toLocaleDateString("es-CL", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </strong>
                      </span>
                      {item.costEstimate ? (
                        <>
                          <span>•</span>
                          <span>Costo: <strong className="text-slate-800">${item.costEstimate.toLocaleString("es-CL")}</strong></span>
                        </>
                      ) : null}
                    </div>

                    {!isResolved && (
                      <button
                        type="button"
                        onClick={() => {
                          setResolvingItem(item);
                          setResolutionNotes("");
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold touch-target shadow-sm transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolver y Restaurar a Disponible</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL 1: REGISTRAR NOVEDAD / PONER EN MANTENIMIENTO */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Registrar Novedad / Mantenimiento</h3>
                  <p className="text-xs text-slate-500">Ponga en mantenimiento el auditorio o un implemento</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              {/* Target Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  ¿Qué elemento requiere intervención? *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetType("EQUIPAMIENTO")}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                      targetType === "EQUIPAMIENTO"
                        ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20"
                        : "border-slate-300 text-slate-700 bg-white"
                    }`}
                  >
                    <Tv className="w-4 h-4 text-blue-700" />
                    <span>Implemento Específico</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetType("AUDITORIO")}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                      targetType === "AUDITORIO"
                        ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20"
                        : "border-slate-300 text-slate-700 bg-white"
                    }`}
                  >
                    <Activity className="w-4 h-4 text-blue-700" />
                    <span>Auditorio Completo</span>
                  </button>
                </div>
              </div>

              {/* If equipment, dropdown to pick which one */}
              {targetType === "EQUIPAMIENTO" && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Seleccionar Implemento / Hardware *
                  </label>
                  <select
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    className="w-full bg-slate-50 text-xs font-semibold text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {equipamientos.map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.name} ({eq.category}) - Estado actual: {eq.status}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Type and Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Tipo de Intervención *
                  </label>
                  <select
                    value={maintType}
                    onChange={(e) => setMaintType(e.target.value as any)}
                    className="w-full bg-slate-50 text-xs font-semibold text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="CORRECTIVO">Correctivo (Falla o Rotura)</option>
                    <option value="PREVENTIVO">Preventivo (Limpieza/Revisión)</option>
                    <option value="CALIBRACION">Calibración / Ajuste de Audio/Video</option>
                    <option value="DANIO_REPORTE">Reporte de Daño Post-Evento</option>
                    <option value="MEJORA">Mejora / Upgrade de Hardware</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nivel de Severidad *
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full bg-slate-50 text-xs font-semibold text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="BAJA">Baja (Uso parcial permitido)</option>
                    <option value="MEDIA">Media (Afecta una función)</option>
                    <option value="ALTA">Alta (Inoperativo en taller)</option>
                    <option value="CRITICA">Crítica (Bloquea eventos)</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Título de la Falla / Motivo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Falla en señal de micrófono inalámbrico Shure"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 text-xs font-semibold text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Diagnóstico y Descripción Técnica *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detalle los síntomas observados, pruebas realizadas y acciones requeridas..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 text-xs font-medium text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Technician and Cost */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Técnico / Servicio Asignado
                  </label>
                  <input
                    type="text"
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                    className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Costo Estimado Repuesto (CLP $)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={costEstimate}
                    onChange={(e) => setCostEstimate(Number(e.target.value))}
                    className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold touch-target"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md touch-target flex items-center space-x-1.5 transition-all"
                >
                  <Wrench className="w-4 h-4" />
                  <span>{isSubmitting ? "Registrando..." : "Poner en Mantenimiento"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESOLVER MANTENIMIENTO */}
      {resolvingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2.5 text-emerald-800">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Resolver y Retornar a Operatividad</h3>
                <p className="text-xs text-slate-500">Confirmación de reparación y pruebas</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900">{resolvingItem.title}</span>
              <p className="text-slate-600 text-[11px]">{resolvingItem.description}</p>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Constancia Técnica de la Solución Aplicada *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describa la solución técnica realizada (ej: Reemplazo de cápsula Shure, soldadura de contacto y prueba de audio en sala completada)..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full bg-slate-50 text-xs font-medium text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setResolvingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold touch-target"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md touch-target flex items-center space-x-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? "Restaurando..." : "Confirmar y Reactivar"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CAMBIAR ESTADO OPERATIVO DEL AUDITORIO */}
      {isAuditorioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Estado Operativo del Auditorio</h3>
                  <p className="text-xs text-slate-500">Gestión de disponibilidad general del recinto</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAuditorioModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAuditorioStatusSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nuevo Estado de Operación
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="audStatus"
                      value="OPERATIONAL"
                      checked={newAuditorioStatus === "OPERATIONAL"}
                      onChange={() => setNewAuditorioStatus("OPERATIONAL")}
                      className="accent-blue-700 w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900">100% Operativo</span>
                      <p className="text-[11px] text-slate-500">Auditorio disponible para reservas académicas y eventos.</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="audStatus"
                      value="MAINTENANCE"
                      checked={newAuditorioStatus === "MAINTENANCE"}
                      onChange={() => setNewAuditorioStatus("MAINTENANCE")}
                      className="accent-blue-700 w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-amber-900">En Mantenimiento Técnico</span>
                      <p className="text-[11px] text-slate-500">Suspende nuevas reservas. Recinto en obras o intervención.</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="audStatus"
                      value="PARTIAL_RESTRICTION"
                      checked={newAuditorioStatus === "PARTIAL_RESTRICTION"}
                      onChange={() => setNewAuditorioStatus("PARTIAL_RESTRICTION")}
                      className="accent-blue-700 w-4 h-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-indigo-900">Operatividad Parcial</span>
                      <p className="text-[11px] text-slate-500">Disponible con ciertas restricciones técnicas o de aforo.</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Motivo o Justificación Administrativa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mantención programada de Climatización Central y Pintura de Escenario"
                  value={auditorioReason}
                  onChange={(e) => setAuditorioReason(e.target.value)}
                  className="w-full bg-slate-50 text-xs font-semibold text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAuditorioModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold touch-target"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md touch-target flex items-center space-x-1.5 transition-all"
                >
                  <Activity className="w-4 h-4" />
                  <span>{isSubmitting ? "Guardando..." : "Actualizar Estado"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
