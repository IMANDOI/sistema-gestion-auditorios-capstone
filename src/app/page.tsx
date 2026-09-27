"use client";

import React, { useState, useEffect } from "react";
import { 
  getDashboardData, 
  approveReservationAction, 
  rejectReservationAction 
} from "@/lib/actions";
import { UserRole, ReservaItem, EquipamientoItem, DashboardMetrics } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { KPICards } from "@/components/KPICards";
import { QuickReservationModal } from "@/components/QuickReservationModal";
import { QRScannerModal } from "@/components/QRScannerModal";
import { InventoryModal } from "@/components/InventoryModal";
import { NotificationsModal } from "@/components/NotificationsModal";
import { AuditLogModal } from "@/components/AuditLogModal";
import { FeedbackModal } from "@/components/FeedbackModal";
import { 
  Calendar, 
  Clock, 
  Check, 
  X as XIcon, 
  QrCode, 
  Star, 
  Users, 
  Layers, 
  AlertCircle,
  Building,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<{
    reservas: ReservaItem[];
    equipamientos: EquipamientoItem[];
    auditorios: any[];
    users: any[];
    auditorias: any[];
    suscripciones: any[];
    metrics: DashboardMetrics;
  } | null>(null);

  const [currentRole, setCurrentRole] = useState<UserRole>("ASSISTANT");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  
  // Modals
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  
  // Feedback Modal
  const [feedbackTarget, setFeedbackTarget] = useState<{ id: string; title: string } | null>(null);
  
  // Active QR view preview modal
  const [viewingQR, setViewingQR] = useState<{ title: string; token: string } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await getDashboardData();
      setData(res as any);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl border-4 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Cargando Sistema de Gestión de Auditorios...
        </p>
      </div>
    );
  }

  // Find simulated current user based on role
  const currentUser = data.users.find((u) => u.role === currentRole) || data.users[0];
  const defaultAuditorio = data.auditorios[0] || { id: "default" };

  // Filter reservations
  const filteredReservas = data.reservas.filter((r) => {
    if (filterStatus === "ALL") return true;
    if (filterStatus === "PENDING") return r.status === "PENDING";
    if (filterStatus === "APPROVED") return r.status === "APPROVED";
    if (filterStatus === "CHECKED_IN") return r.status === "CHECKED_IN";
    if (filterStatus === "CHECKED_OUT") return r.status === "CHECKED_OUT";
    return true;
  });

  const handleApprove = async (id: string) => {
    await approveReservationAction(id, currentUser.id);
    loadData();
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Ingrese el motivo formal del rechazo:") || "Conflicto operacional de agenda";
    await rejectReservationAction(id, currentUser.id, reason);
    loadData();
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Navbar with Role Simulator */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenQR={() => setIsQROpen(true)}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        pendingCount={data.metrics.reservasPendientes}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* KPI Cards */}
        <KPICards metrics={data.metrics} />

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Column: Reservations List */}
          <div className="lg:col-span-3 space-y-4">
            {/* Filter toolbar */}
            <div className="glass-card rounded-2xl p-4 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-300">Filtrar por Estado:</span>
                <div className="flex flex-wrap gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                  {[
                    { id: "ALL", label: "Todas" },
                    { id: "PENDING", label: `Pendientes (${data.metrics.reservasPendientes})` },
                    { id: "APPROVED", label: "Aprobadas" },
                    { id: "CHECKED_IN", label: "En Curso" },
                    { id: "CHECKED_OUT", label: "Finalizadas" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterStatus(tab.id)}
                      className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                        filterStatus === tab.id
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Prevención de Colisiones Atómica</span>
              </div>
            </div>

            {/* Reservations Cards */}
            <div className="space-y-3">
              {filteredReservas.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center border border-slate-800">
                  <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">No se encontraron eventos</p>
                  <p className="text-xs text-slate-500 mt-1">
                    No existen reservas con el filtro seleccionado.
                  </p>
                </div>
              ) : (
                filteredReservas.map((r) => {
                  const start = new Date(r.startTime);
                  const end = new Date(r.endTime);

                  return (
                    <div
                      key={r.id}
                      className="glass-card rounded-2xl p-5 border border-slate-800/80 glass-card-hover space-y-3"
                    >
                      {/* Top Header of Card */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-white text-base tracking-tight">
                              {r.title}
                            </h3>
                            {/* Status badge */}
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                                r.status === "PENDING"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                  : r.status === "APPROVED"
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                  : r.status === "CHECKED_IN"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse"
                                  : r.status === "CHECKED_OUT"
                                  ? "bg-slate-700/50 text-slate-300 border-slate-600/40"
                                  : "bg-red-500/10 text-red-400 border-red-500/30"
                              }`}
                            >
                              {r.status === "CHECKED_IN"
                                ? "EN CURSO (Check-in OK)"
                                : r.status === "CHECKED_OUT"
                                ? "FINALIZADO (Horas TI OK)"
                                : r.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Docente: <strong className="text-slate-200">{r.user.name}</strong> •{" "}
                            {r.user.department || "Facultad"} • Estimación: {r.attendeesEstimate} asistentes
                          </p>
                        </div>

                        {/* Date and Time badge */}
                        <div className="text-right text-xs">
                          <div className="flex items-center space-x-1.5 text-indigo-400 font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {start.toLocaleDateString("es-CL", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>
                          <span className="text-slate-400 font-mono text-[11px]">
                            {start.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })} -{" "}
                            {end.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      {r.description && (
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
                          {r.description}
                        </p>
                      )}

                      {/* Equipment Badges & Logistics */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-indigo-400" /> Equipamiento:
                        </span>
                        {r.equipamientos.length === 0 ? (
                          <span className="text-[10px] text-slate-500 italic">Sin equipos solicitados</span>
                        ) : (
                          r.equipamientos.map((eq) => (
                            <span
                              key={eq.id}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-medium"
                            >
                              {eq.equipamiento.name} ({eq.quantity})
                            </span>
                          ))
                        )}

                        {r.requiresCleaning && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                            Aseo Coordinado
                          </span>
                        )}
                        {r.requiresGuardia && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium">
                            Guardia Coordinado
                          </span>
                        )}
                      </div>

                      {/* Hours TI Metrics / Evaluation results if checked-out */}
                      {r.status === "CHECKED_OUT" && (
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between text-xs gap-2">
                          <div className="flex items-center space-x-2 text-indigo-400 font-medium">
                            <Clock className="w-4 h-4" />
                            <span>
                              Soporte TI Utilizado:{" "}
                              <strong className="text-white">
                                {r.horasTI?.[0]?.hoursDecimal || 1.5} hrs
                              </strong>{" "}
                              ({r.horasTI?.[0]?.minutesDuration || 90} min computados)
                            </span>
                          </div>

                          {r.encuesta ? (
                            <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>
                                {((r.encuesta.ratingOverall + r.encuesta.ratingEquipment + r.encuesta.ratingSupport) / 3).toFixed(1)}{" "}
                                / 5 ★ ({r.encuesta.npsCategory})
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setFeedbackTarget({ id: r.id, title: r.title })}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-semibold text-[11px] transition-colors flex items-center gap-1"
                            >
                              <Star className="w-3 h-3" />
                              <span>Evaluar Servicio (1-5★)</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Action Bar according to Role */}
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                        {/* QR Badge button */}
                        {r.qrToken ? (
                          <button
                            onClick={() => setViewingQR({ title: r.title, token: r.qrToken! })}
                            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-emerald-400 border border-emerald-500/30 transition-colors"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[140px]">{r.qrToken}</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">
                            QR no generado (pendiente de aprobación)
                          </span>
                        )}

                        {/* Interactive action buttons based on simulated role */}
                        <div className="flex items-center space-x-2">
                          {/* Assistant or Owner: Approve / Reject */}
                          {r.status === "PENDING" && (currentRole === "ASSISTANT" || currentRole === "OWNER" || currentRole === "IT_ADMIN") && (
                            <>
                              <button
                                onClick={() => handleApprove(r.id)}
                                className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Aprobar y Emitir QR</span>
                              </button>
                              <button
                                onClick={() => handleReject(r.id)}
                                className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-500 text-white text-xs font-semibold shadow-sm transition-all"
                              >
                                <XIcon className="w-3.5 h-3.5" />
                                <span>Rechazar</span>
                              </button>
                            </>
                          )}

                          {/* Technician: Instant trigger QR */}
                          {r.status === "APPROVED" && (currentRole === "IT_SERVICE" || currentRole === "IT_ADMIN" || currentRole === "OWNER") && (
                            <button
                              onClick={() => setIsQROpen(true)}
                              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all badge-glow-green"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>Validar Check-in en Terreno</span>
                            </button>
                          )}

                          {/* Technician: Check-out */}
                          {r.status === "CHECKED_IN" && (currentRole === "IT_SERVICE" || currentRole === "IT_ADMIN" || currentRole === "OWNER") && (
                            <button
                              onClick={() => setIsQROpen(true)}
                              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Cerrar Check-out & Horas TI</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Information, PriorityScore & Quick Actions */}
          <div className="space-y-4">
            {/* Auditorio Information Card */}
            <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-3">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Building className="w-4 h-4" />
                <h4 className="font-bold text-white text-sm">Recinto Bajo Gobierno</h4>
              </div>
              <div>
                <p className="text-xs font-bold text-white">{defaultAuditorio.name}</p>
                <p className="text-[11px] text-slate-400">{defaultAuditorio.location}</p>
                <p className="text-[11px] text-slate-400 mt-1">Capacidad: 150 asistentes • Climatizado</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Estado: Operativo
                </p>
                <p className="text-slate-400">
                  Sonido envolvente, proyección 4K y microfonía inalámbrica calibrada.
                </p>
              </div>
            </div>

            {/* PriorityScore Rules Card */}
            <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Algoritmo PriorityScore</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                  RF-07
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Garantiza equidad ante solicitudes concurrentes y castiga reservas ociosas:
              </p>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                  <span>Puntaje Inicial Base:</span>
                  <strong className="text-emerald-400">100 pts</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                  <span>Penalización por No-Show:</span>
                  <strong className="text-red-400">-20 pts</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                  <span>Confirmación Rápida Token:</span>
                  <strong className="text-blue-400">48h / 24h</strong>
                </div>
              </div>
            </div>

            {/* Defensive Security Guarantee */}
            <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold text-white">Blindaje Defensivo Embebido</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Sin necesidad de paneles de SOC desacoplados, la ciberseguridad opera en el núcleo:
                passwords en bcrypt (cost factor 10), JWT cifrados en cookies HttpOnly/Secure,
                validación de esquemas Zod en servidor y consultas 100% parametrizadas con Prisma ORM.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* QR Visual Preview Modal */}
      {viewingQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-card w-full max-w-sm rounded-2xl border border-slate-700 p-6 bg-slate-900/95 text-center space-y-4">
            <h3 className="font-bold text-white text-base">Comprobante de Acceso QR</h3>
            <p className="text-xs text-slate-400">{viewingQR.title}</p>
            <div className="p-4 bg-white rounded-2xl w-48 h-48 mx-auto flex items-center justify-center shadow-xl">
              <div className="w-40 h-40 border-4 border-slate-950 flex flex-col items-center justify-center text-slate-950">
                <QrCode className="w-28 h-28 text-slate-950" />
                <span className="text-[9px] font-mono font-bold mt-1">CAPSTONE 2026</span>
              </div>
            </div>
            <p className="text-xs font-mono text-emerald-400 bg-slate-950 p-2 rounded-lg border border-slate-800 break-all">
              {viewingQR.token}
            </p>
            <p className="text-[11px] text-slate-500">
              Presente este código en su smartphone al llegar al auditorio para validar su ingreso en menos de 30 segundos.
            </p>
            <button
              onClick={() => setViewingQR(null)}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              Cerrar Vista
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <QuickReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        equipamientos={data.equipamientos}
        currentUserId={currentUser.id}
        auditorioId={defaultAuditorio.id}
        onSuccess={loadData}
      />

      <QRScannerModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        reservas={data.reservas}
        tecnicoId={currentUser.id}
        onSuccess={loadData}
      />

      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        equipamientos={data.equipamientos}
        onSuccess={loadData}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        suscripciones={data.suscripciones}
      />

      <AuditLogModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        auditorias={data.auditorias}
      />

      {feedbackTarget && (
        <FeedbackModal
          isOpen={true}
          onClose={() => setFeedbackTarget(null)}
          reservaId={feedbackTarget.id}
          reservaTitle={feedbackTarget.title}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
