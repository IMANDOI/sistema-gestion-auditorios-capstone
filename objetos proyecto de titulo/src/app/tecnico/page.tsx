"use client";

import React, { useState, useEffect } from "react";
import { PortalHeader } from "@/components/PortalHeader";
import { 
  getDashboardData, 
  processCheckInAction, 
  processCheckOutAction,
  toggleReservaEquipmentDeliveryAction,
  reportTechnicalIncidentAction,
  toggleEquipmentStatusAction
} from "@/lib/actions";
import { ReservaItem, EquipamientoItem } from "@/lib/types";
import { CameraQRScanner } from "@/components/CameraQRScanner";
import { 
  QrCode, 
  CheckCircle2, 
  Clock, 
  Layers, 
  AlertCircle, 
  Check, 
  RefreshCw,
  Wrench,
  Boxes,
  AlertTriangle,
  Send,
  Search,
  X,
  Tv,
  Radio,
  Laptop,
  Flame,
  ShieldAlert
} from "lucide-react";

export default function TecnicoMobilePage() {
  const [data, setData] = useState<{ 
    reservas: ReservaItem[]; 
    equipamientos: EquipamientoItem[];
    mantenimientos: any[];
    users: any[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"CHECK_IN" | "CHECK_OUT" | "EQUIPAMIENTO">("CHECK_IN");
  const [tokenInput, setTokenInput] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Equipment category filter & search
  const [equipCategoryFilter, setEquipCategoryFilter] = useState<string>("ALL");
  const [equipSearchQuery, setEquipSearchQuery] = useState<string>("");

  // Incident reporting modal state
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [incidentEquipId, setIncidentEquipId] = useState("");
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentDesc, setIncidentDesc] = useState("");
  const [incidentSeverity, setIncidentSeverity] = useState<"BAJA" | "MEDIA" | "ALTA" | "CRITICA">("MEDIA");
  const [incidentSetMaintenance, setIncidentSetMaintenance] = useState(true);
  const [isSubmittingIncident, setIsSubmittingIncident] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const res = await getDashboardData();
      setData(res as any);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <p className="text-sm font-bold text-slate-600">Cargando Módulo Técnico Móvil...</p>
      </div>
    );
  }

  const tecnicoUser = data.users.find((u) => u.role === "IT_SERVICE") || {
    id: "tecnico-id",
    name: "Rodrigo Tapia",
    department: "Soporte Técnico en Terreno",
  };

  const approvedReservas = data.reservas.filter((r) => r.status === "APPROVED");
  const checkedInReservas = data.reservas.filter((r) => r.status === "CHECKED_IN");
  const equipamientosList = data.equipamientos || [];

  // Filtered equipment list for Tab 3
  const filteredEquipamientos = equipamientosList.filter((eq) => {
    const matchesCategory = equipCategoryFilter === "ALL" || eq.category === equipCategoryFilter;
    const matchesSearch = equipSearchQuery === "" || 
      eq.name.toLowerCase().includes(equipSearchQuery.toLowerCase()) ||
      (eq.serialNumber && eq.serialNumber.toLowerCase().includes(equipSearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleExecuteCheckIn = async (token: string) => {
    if (!token) return;
    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await processCheckInAction(token.trim(), tecnicoUser.id);
      if (res.success) {
        setFeedback({
          type: "success",
          message: `¡Check-in validado exitosamente en menos de 30 segundos! Inicio de soporte registrado para: "${res.reservaTitle}".`,
        });
        setTokenInput("");
        await loadData();
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Código QR no válido o ya utilizado.",
        });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Error al validar Check-in." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteCheckOut = async (reservaId: string) => {
    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await processCheckOutAction(reservaId, tecnicoUser.id);
      if (res.success) {
        setFeedback({
          type: "success",
          message: `¡Check-out completado! Se computaron ${res.hoursDecimal} horas de TI utilizadas (${res.minutes} minutos). Retorno de equipamiento confirmado.`,
        });
        await loadData();
      } else {
        setFeedback({ type: "error", message: res.error || "Error al registrar salida." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Error al procesar Check-out." });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle equipment delivery (Check-in verification checklist)
  const handleToggleEquipmentDelivered = async (reservaEquipId: string, currentVal: boolean) => {
    setIsLoading(true);
    try {
      const res = await toggleReservaEquipmentDeliveryAction(
        reservaEquipId,
        "delivered",
        !currentVal,
        tecnicoUser.id
      );
      if (res.success) {
        setFeedback({
          type: "success",
          message: !currentVal
            ? "¡Equipamiento verificado y entregado conforme en sala!"
            : "Equipamiento desmarcado como pendiente.",
        });
        await loadData();
      } else {
        setFeedback({ type: "error", message: res.error || "Error al verificar equipo." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Error inesperado." });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle equipment returned (Check-out verification checklist)
  const handleToggleEquipmentReturned = async (reservaEquipId: string, currentVal: boolean) => {
    setIsLoading(true);
    try {
      const res = await toggleReservaEquipmentDeliveryAction(
        reservaEquipId,
        "returned",
        !currentVal,
        tecnicoUser.id
      );
      if (res.success) {
        setFeedback({
          type: "success",
          message: !currentVal
            ? "¡Equipamiento recibido conforme en bodega técnica!"
            : "Devolución desmarcada como pendiente.",
        });
        await loadData();
      } else {
        setFeedback({ type: "error", message: res.error || "Error al registrar retorno de equipo." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Error inesperado." });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle general equipment status (Disponible <-> Mantenimiento)
  const handleToggleEquipmentStatus = async (equipId: string, currentStatus: string) => {
    setIsLoading(true);
    const newStatus = currentStatus === "MAINTENANCE" ? "AVAILABLE" : "MAINTENANCE";
    const reason = newStatus === "MAINTENANCE"
      ? "Equipo puesto en mantenimiento preventivo/correctivo desde módulo de terreno."
      : "Equipo restaurado a operativo por soporte técnico en terreno.";

    try {
      const res = await toggleEquipmentStatusAction(equipId, newStatus, reason, tecnicoUser.id);
      if (res.success) {
        setFeedback({
          type: "success",
          message: `Estado de equipo actualizado a: ${newStatus === "AVAILABLE" ? "DISPONIBLE" : "EN MANTENCIÓN"}.`,
        });
        await loadData();
      } else {
        setFeedback({ type: "error", message: res.error || "Error al cambiar estado." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Error inesperado." });
    } finally {
      setIsLoading(false);
    }
  };

  // Open incident modal preselecting an equipment
  const openIncidentModalForEquip = (equipId?: string) => {
    if (equipId) {
      setIncidentEquipId(equipId);
    } else if (equipamientosList.length > 0) {
      setIncidentEquipId(equipamientosList[0].id);
    }
    setIncidentTitle("");
    setIncidentDesc("");
    setIncidentSeverity("MEDIA");
    setIncidentSetMaintenance(true);
    setIsIncidentModalOpen(true);
  };

  // Submit incident report
  const handleSubmitIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentEquipId || !incidentTitle.trim()) return;

    setIsSubmittingIncident(true);
    try {
      const res = await reportTechnicalIncidentAction({
        equipamientoId: incidentEquipId,
        title: incidentTitle,
        description: incidentDesc || "Reporte técnico generado en terreno.",
        severity: incidentSeverity,
        reportedBy: `${tecnicoUser.name} (${tecnicoUser.department})`,
        setInMaintenance: incidentSetMaintenance,
      });

      if (res.success) {
        setIsIncidentModalOpen(false);
        setFeedback({
          type: "success",
          message: "¡Incidencia técnica registrada, notificada a la bitácora y equipo actualizado con éxito!",
        });
        await loadData();
      } else {
        setFeedback({ type: "error", message: res.error || "Error al registrar incidencia." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Error inesperado." });
    } finally {
      setIsSubmittingIncident(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Header */}
      <PortalHeader
        userName={tecnicoUser.name}
        userRole="IT_SERVICE"
        roleTitle="Soporte Técnico Móvil"
        department={tecnicoUser.department}
      />

      {/* Main Mobile-Optimized Container (Max width 550px) */}
      <main className="max-w-lg mx-auto px-4 pt-5 space-y-4">
        {/* Mobile Instruction Banner */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-base font-extrabold text-slate-900">
              Módulo de Soporte TI en Terreno
            </h1>
            <p className="text-xs text-slate-600">
              Check-in óptico, verificación de hardware y reporte de fallas.
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 touch-target"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
          </button>
        </div>

        {/* 3 High-Contrast Touch Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-200 rounded-2xl">
          <button
            type="button"
            onClick={() => { setActiveTab("CHECK_IN"); setFeedback(null); }}
            className={`py-2.5 px-2 text-xs font-bold rounded-xl transition-all touch-target flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === "CHECK_IN"
                ? "bg-emerald-700 text-white shadow-md"
                : "text-slate-700 hover:text-slate-900 bg-transparent"
            }`}
          >
            <QrCode className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Check-in ({approvedReservas.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("CHECK_OUT"); setFeedback(null); }}
            className={`py-2.5 px-2 text-xs font-bold rounded-xl transition-all touch-target flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === "CHECK_OUT"
                ? "bg-blue-800 text-white shadow-md"
                : "text-slate-700 hover:text-slate-900 bg-transparent"
            }`}
          >
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Check-out ({checkedInReservas.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("EQUIPAMIENTO"); setFeedback(null); }}
            className={`py-2.5 px-2 text-xs font-bold rounded-xl transition-all touch-target flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === "EQUIPAMIENTO"
                ? "bg-indigo-700 text-white shadow-md"
                : "text-slate-700 hover:text-slate-900 bg-transparent"
            }`}
          >
            <Boxes className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Equipos ({equipamientosList.length})</span>
          </button>
        </div>

        {/* Feedback Alert with high contrast */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl border text-xs font-medium flex items-start space-x-2.5 ${
              feedback.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : "bg-red-50 border-red-300 text-red-900"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed">{feedback.message}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: CHECK-IN */}
        {/* ========================================================================= */}
        {activeTab === "CHECK_IN" && (
          <div className="space-y-4">
            {/* Real Camera Scanner (with real-time bounding box tracking overlay) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Escáner Óptico de Pase QR
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Apunta la cámara al pase QR del docente para ingreso instantáneo en &lt; 30s
                    </p>
                  </div>
                </div>
              </div>

              {/* Camera Feed with real-time green bounding tracking box */}
              <CameraQRScanner
                onScan={(scannedToken) => {
                  setTokenInput(scannedToken);
                  handleExecuteCheckIn(scannedToken);
                }}
                isActive={activeTab === "CHECK_IN"}
              />

              {/* Manual input fallback */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                  O ingresa el token manualmente:
                </span>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleExecuteCheckIn(tokenInput);
                  }}
                  className="flex space-x-2"
                >
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Escriba o pegue el token QR"
                    className="flex-1 bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !tokenInput.trim()}
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm touch-target disabled:opacity-50"
                  >
                    Validar
                  </button>
                </form>
              </div>
            </div>

            {/* List of approved events with Hardware Checklist */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide px-1">
                Eventos Aprobados para Hoy ({approvedReservas.length})
              </h2>

              {approvedReservas.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-slate-500 text-xs">
                  No hay reservas aprobadas pendientes de ingreso en este momento.
                </div>
              ) : (
                approvedReservas.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3.5"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                          Listo para Ingreso
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {new Date(r.startTime).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{r.title}</h4>
                      <p className="text-xs text-slate-600">
                        Expositor: <strong className="text-slate-900">{r.user.name}</strong> • Auditorio: {r.auditorio.name}
                      </p>
                    </div>

                    {/* INTERACTIVE EQUIPMENT VERIFICATION CHECKLIST (RF-04) */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-[11px] text-slate-900 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-blue-700" />
                          <span>Verificación de Equipamiento por TI ({r.equipamientos.length}):</span>
                        </p>
                        <span className="text-[10px] text-slate-500">
                          {r.equipamientos.filter(eq => eq.delivered).length}/{r.equipamientos.length} listos
                        </span>
                      </div>

                      {r.equipamientos.length === 0 ? (
                        <p className="text-[11px] text-slate-500 italic">No se solicitó hardware adicional.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {r.equipamientos.map((eq) => (
                            <div
                              key={eq.id}
                              className={`p-2 rounded-lg border text-xs flex items-center justify-between transition-all ${
                                eq.delivered
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                                  : "bg-white border-slate-300 text-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate pr-1">
                                <button
                                  type="button"
                                  onClick={() => handleToggleEquipmentDelivered(eq.id, eq.delivered)}
                                  disabled={isLoading}
                                  className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                    eq.delivered
                                      ? "bg-emerald-600 text-white"
                                      : "border-2 border-slate-400 bg-white hover:border-emerald-600"
                                  }`}
                                  title={eq.delivered ? "Marcar como pendiente" : "Verificar y entregar conforme"}
                                >
                                  {eq.delivered && <Check className="w-3.5 h-3.5" />}
                                </button>
                                <span className="font-semibold truncate">
                                  {eq.equipamiento.name} ({eq.quantity} un.)
                                </span>
                              </div>

                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => openIncidentModalForEquip(eq.equipamiento.id)}
                                  className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold border border-amber-300 transition-colors flex items-center gap-1"
                                  title="Reportar falla o novedad de este equipo"
                                >
                                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                                  <span>Falla</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Touch Button to Validate Check-in in 1 tap */}
                    <button
                      type="button"
                      onClick={() => handleExecuteCheckIn(r.qrToken!)}
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2 touch-target transition-colors disabled:opacity-50"
                    >
                      <Check className="w-5 h-5" />
                      <span>Validar Check-in en Terreno (&lt; 30s)</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CHECK-OUT */}
        {/* ========================================================================= */}
        {activeTab === "CHECK_OUT" && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide px-1">
              Eventos en Curso (Soporte TI Activo) ({checkedInReservas.length})
            </h2>

            {checkedInReservas.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs space-y-1">
                <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-bold text-slate-700">No hay sesiones en curso</p>
                <p>Las reservas aparecerán aquí tras realizar el Check-in.</p>
              </div>
            ) : (
              checkedInReservas.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl p-4 border-2 border-blue-600 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                        Sesión en Progreso
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{r.title}</h4>
                      <p className="text-xs text-slate-600">
                        Docente: <strong className="text-slate-900">{r.user.name}</strong> • Auditorio: {r.auditorio.name}
                      </p>
                    </div>
                    <div className="text-right text-xs">
                      <span className="text-slate-500 block text-[10px]">Ingreso:</span>
                      <strong className="text-slate-900">
                        {r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                      </strong>
                    </div>
                  </div>

                  {/* HARDWARE RETURN CHECKLIST (RF-05) */}
                  {r.equipamientos.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-[11px] text-slate-900 flex items-center gap-1.5">
                          <Boxes className="w-3.5 h-3.5 text-indigo-700" />
                          <span>Recepción y Retorno de Hardware Conforme:</span>
                        </p>
                        <span className="text-[10px] text-slate-500">
                          {r.equipamientos.filter(eq => eq.returned).length}/{r.equipamientos.length} devueltos
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {r.equipamientos.map((eq) => (
                          <div
                            key={eq.id}
                            className={`p-2 rounded-lg border text-xs flex items-center justify-between transition-all ${
                              eq.returned
                                ? "bg-blue-50 border-blue-300 text-blue-950"
                                : "bg-white border-slate-300 text-slate-800"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate pr-1">
                              <button
                                type="button"
                                onClick={() => handleToggleEquipmentReturned(eq.id, eq.returned)}
                                disabled={isLoading}
                                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                                  eq.returned
                                    ? "bg-blue-600 text-white"
                                    : "border-2 border-slate-400 bg-white hover:border-blue-600"
                                }`}
                                title={eq.returned ? "Marcar como pendiente" : "Recibir y probar conforme"}
                              >
                                {eq.returned && <Check className="w-3.5 h-3.5" />}
                              </button>
                              <span className="font-semibold truncate">
                                {eq.equipamiento.name} ({eq.quantity} un.)
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => openIncidentModalForEquip(eq.equipamiento.id)}
                              className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold border border-amber-300 transition-colors flex items-center gap-1"
                              title="Reportar daño o faltante"
                            >
                              <AlertTriangle className="w-3 h-3 text-amber-700" />
                              <span>Novedad</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-700 flex-shrink-0 animate-pulse" />
                    <span>
                      Cronómetro de soporte activo. Al pulsar el botón se computarán automáticamente las horas exactas de dedicación ($\Delta T$).
                    </span>
                  </div>

                  {/* Big Touch Button to Close Check-out and compute hours */}
                  <button
                    type="button"
                    onClick={() => handleExecuteCheckOut(r.id)}
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2 touch-target transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Finalizar Evento y Computar Horas TI</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: EQUIPAMIENTO & NOVEDADES TI (NEW FEATURE) */}
        {/* ========================================================================= */}
        {activeTab === "EQUIPAMIENTO" && (
          <div className="space-y-4">
            {/* Quick Action: Report Incident Banner */}
            <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Control de Hardware y Alertas
                </h3>
                <p className="text-xs text-blue-200">
                  Cambia estados de equipos o notifica fallas a la cuadrilla de TI.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openIncidentModalForEquip()}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 touch-target flex-shrink-0"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Notificar Falla</span>
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total</span>
                <span className="text-xl font-extrabold text-slate-900">{equipamientosList.length}</span>
              </div>
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm text-center">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">Operativos</span>
                <span className="text-xl font-extrabold text-emerald-700">
                  {equipamientosList.filter(e => e.status === "AVAILABLE" || e.status === "IN_USE").length}
                </span>
              </div>
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm text-center">
                <span className="text-[10px] font-bold text-amber-700 uppercase block">Mantención</span>
                <span className="text-xl font-extrabold text-amber-700">
                  {equipamientosList.filter(e => e.status === "MAINTENANCE").length}
                </span>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={equipSearchQuery}
                  onChange={(e) => setEquipSearchQuery(e.target.value)}
                  placeholder="Buscar equipo o N° de serie..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Category Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                {["ALL", "PROJECTION", "AUDIO", "COMPUTING", "HVAC", "OTHER"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setEquipCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
                      equipCategoryFilter === cat
                        ? "bg-indigo-700 text-white shadow-sm"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat === "ALL" ? "Todos" : cat === "PROJECTION" ? "Proyección" : cat === "AUDIO" ? "Audio" : cat === "COMPUTING" ? "Computación" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment Inventory List */}
            <div className="space-y-2.5">
              {filteredEquipamientos.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-slate-500 text-xs">
                  No se encontraron equipos con los criterios de búsqueda.
                </div>
              ) : (
                filteredEquipamientos.map((eq) => {
                  const isMaintenance = eq.status === "MAINTENANCE";
                  const isInUse = eq.status === "IN_USE";

                  return (
                    <div
                      key={eq.id}
                      className={`bg-white rounded-2xl p-4 border shadow-sm space-y-3 transition-all ${
                        isMaintenance
                          ? "border-amber-300 bg-amber-50/30"
                          : isInUse
                          ? "border-blue-300"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                              {eq.category}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isMaintenance
                                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                                  : isInUse
                                  ? "bg-blue-100 text-blue-900 border border-blue-300"
                                  : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                              }`}
                            >
                              {isMaintenance ? "EN MANTENCIÓN" : isInUse ? "EN USO" : "DISPONIBLE"}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{eq.name}</h4>
                          <p className="text-[11px] text-slate-500 font-mono">
                            S/N: {eq.serialNumber || "N/A"} • Stock: {eq.availableQty}/{eq.totalQty}
                          </p>
                        </div>
                      </div>

                      {/* Equipment Action Controls */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                        {/* Toggle Status Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleEquipmentStatus(eq.id, eq.status)}
                          disabled={isLoading}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 touch-target ${
                            isMaintenance
                              ? "bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm"
                              : "bg-slate-800 hover:bg-slate-900 text-white shadow-sm"
                          }`}
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>{isMaintenance ? "✓ Marcar Operativo" : "🛠️ A Mantención"}</span>
                        </button>

                        {/* Report Incident for this specific equipment */}
                        <button
                          type="button"
                          onClick={() => openIncidentModalForEquip(eq.id)}
                          className="py-2 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 touch-target"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Notificar Falla</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL: REPORTE DE INCIDENCIA TÉCNICA DE HARDWARE */}
      {/* ========================================================================= */}
      {isIncidentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Notificar Novedad o Falla Técnica
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Registra la falla y notifica a la cuadrilla de TI en tiempo real.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsIncidentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitIncident} className="space-y-3">
              {/* Equipment selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Equipo Afectado *
                </label>
                <select
                  value={incidentEquipId}
                  onChange={(e) => setIncidentEquipId(e.target.value)}
                  className="w-full bg-slate-50 text-xs font-semibold text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
                >
                  {equipamientosList.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name} ({eq.category}) {eq.serialNumber ? `- S/N: ${eq.serialNumber}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title of the defect */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Título / Novedad Observada *
                </label>
                <input
                  type="text"
                  required
                  value={incidentTitle}
                  onChange={(e) => setIncidentTitle(e.target.value)}
                  placeholder="Ej: Lámpara proyector parpadea o cable HDMI cortado"
                  className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Severity Level */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nivel de Severidad
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {(["BAJA", "MEDIA", "ALTA", "CRITICA"] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setIncidentSeverity(sev)}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        incidentSeverity === sev
                          ? sev === "CRITICA"
                            ? "bg-red-700 text-white border-red-800 shadow-sm"
                            : sev === "ALTA"
                            ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                            : sev === "MEDIA"
                            ? "bg-blue-700 text-white border-blue-800 shadow-sm"
                            : "bg-emerald-700 text-white border-emerald-800 shadow-sm"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Detalle / Observaciones del Técnico
                </label>
                <textarea
                  rows={2}
                  value={incidentDesc}
                  onChange={(e) => setIncidentDesc(e.target.value)}
                  placeholder="Describe la falla observada en terreno para que la cuadrilla asista con repuestos..."
                  className="w-full bg-slate-50 text-xs text-slate-900 rounded-xl p-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Checkbox: Put equipment in maintenance immediately */}
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <label className="flex items-center space-x-2 text-xs font-bold text-amber-950 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={incidentSetMaintenance}
                    onChange={(e) => setIncidentSetMaintenance(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-600"
                  />
                  <span>Poner equipo automáticamente en &ldquo;EN MANTENCIÓN&rdquo;</span>
                </label>
                <p className="text-[10px] text-amber-800 ml-6 mt-0.5">
                  Evita que futuros docentes puedan reservar este equipo mientras está con falla.
                </p>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsIncidentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold touch-target"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingIncident || !incidentTitle.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md touch-target transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingIncident ? "Enviando..." : "Enviar Notificación"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
