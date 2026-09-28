"use client";

import React, { useState, useEffect } from "react";
import { PortalHeader } from "@/components/PortalHeader";
import { getDashboardData, toggleEquipmentStatusAction } from "@/lib/actions";
import { ReservaItem, EquipamientoItem, DashboardMetrics } from "@/lib/types";
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
  Search
} from "lucide-react";

export default function AdminPage() {
  const [data, setData] = useState<{
    reservas: ReservaItem[];
    equipamientos: EquipamientoItem[];
    auditorios: any[];
    users: any[];
    auditorias: any[];
    suscripciones: any[];
    metrics: DashboardMetrics;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"RESERVAS" | "INVENTARIO" | "CUADRILLAS" | "AUDITORIA">("RESERVAS");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

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
    await toggleEquipmentStatusAction(eq.id, nextStatus);
    await loadData();
    setIsUpdating(false);
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

        {/* Tab Navigation to avoid clutter */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          {[
            { id: "RESERVAS", label: `Agenda y Reservas (${data.reservas.length})`, icon: CalendarCheck },
            { id: "INVENTARIO", label: `Inventario Técnico (${data.equipamientos.length})`, icon: Boxes },
            { id: "CUADRILLAS", label: `Suscripciones Cuadrillas (${data.suscripciones.length})`, icon: Bell },
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

        {/* TAB 1: RESERVAS */}
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
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-2.5"
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
                      <p className="text-slate-500 text-[11px]">
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

                    {r.status === "CHECKED_OUT" && (
                      <div className="flex items-center space-x-3 text-blue-800 font-bold">
                        <span>Horas TI Dedicadas: {r.horasTI?.[0]?.hoursDecimal || 1.5} hrs</span>
                        {r.encuesta && (
                          <span className="text-amber-600">
                            ★ {((r.encuesta.ratingOverall + r.encuesta.ratingEquipment + r.encuesta.ratingSupport) / 3).toFixed(1)}/5
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: INVENTARIO */}
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

        {/* TAB 3: CUADRILLAS */}
        {activeTab === "CUADRILLAS" && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Listas de Difusión Automática (Servicios Generales)</h2>
              <p className="text-xs text-slate-500">
                Coordinación automática de sanitización y aperturas de acceso (RF-22).
              </p>
            </div>

            <div className="space-y-2.5">
              {data.suscripciones.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{s.email}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    Área: {s.department}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AUDITORIA */}
        {activeTab === "AUDITORIA" && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Bitácora Inmutable de Auditoría Operativa</h2>
              <p className="text-xs text-slate-500">
                Trazabilidad completa de operaciones sin requerir infraestructura externa de SOC (RF-24 / ISO 27001).
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
                      <strong className="text-blue-900 font-mono text-xs">{log.action}</strong>
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
    </div>
  );
}
