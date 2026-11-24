"use client";

import React, { useState, useEffect } from "react";
import { PortalHeader } from "@/components/PortalHeader";
import { 
  getDashboardData, 
  approveReservationAction, 
  rejectReservationAction 
} from "@/lib/actions";
import { ReservaItem } from "@/lib/types";
import { 
  ClipboardCheck, 
  Check, 
  X as XIcon, 
  Calendar, 
  Clock, 
  Users, 
  Layers, 
  Sparkles,
  AlertCircle 
} from "lucide-react";

export default function EncargadoPage() {
  const [data, setData] = useState<{
    reservas: ReservaItem[];
    users: any[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

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
        <p className="text-sm font-bold text-slate-600">Cargando Portal de Coordinación...</p>
      </div>
    );
  }

  const encargadoUser = data.users.find((u) => u.role === "ASSISTANT") || data.users[0];
  const pendingReservas = data.reservas.filter((r) => r.status === "PENDING");
  const approvedReservas = data.reservas.filter((r) => r.status === "APPROVED" || r.status === "CHECKED_IN");

  const handleApprove = async (id: string) => {
    setIsLoading(true);
    await approveReservationAction(id, encargadoUser.id);
    await loadData();
    setIsLoading(false);
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Ingrese el motivo formal del rechazo para notificar al docente:") || "Horario incompatible con mantención de infraestructura.";
    setIsLoading(true);
    await rejectReservationAction(id, encargadoUser.id, reason);
    await loadData();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <PortalHeader
        userName={encargadoUser.name}
        userRole="ASSISTANT"
        roleTitle="Encargada de Auditorio"
        department={encargadoUser.department}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Revisión y Dictamen de Solicitudes
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Valide solicitudes pendientes, asigne equipamiento y emita pases QR a los docentes.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-blue-800">{pendingReservas.length}</span>
            <p className="text-xs text-slate-500 font-medium">Por Dictaminar</p>
          </div>
        </div>

        {/* Section: Pending Requests */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span>Solicitudes Pendientes de Aprobación ({pendingReservas.length})</span>
          </h2>

          {pendingReservas.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
              No hay solicitudes pendientes en este momento. Todas las peticiones han sido procesadas.
            </div>
          ) : (
            pendingReservas.map((r) => {
              const start = new Date(r.startTime);
              const end = new Date(r.endTime);

              return (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl p-5 border-2 border-amber-300 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        Pendiente de Revisión
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base mt-1">{r.title}</h3>
                      <p className="text-xs text-slate-600">
                        Solicitante: <strong className="text-slate-900">{r.user.name}</strong> • {r.user.department}
                      </p>
                    </div>

                    <div className="text-xs text-slate-700 sm:text-right font-medium">
                      <div className="flex items-center sm:justify-end space-x-1 text-blue-800 font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{start.toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short" })}</span>
                      </div>
                      <div className="flex items-center sm:justify-end space-x-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {start.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })} -{" "}
                          {end.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {r.description && (
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {r.description}
                    </p>
                  )}

                  {/* Logistics requested */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
                    <span className="font-bold text-slate-900">Requerimientos:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {r.attendeesEstimate} Asistentes estimados
                    </span>
                    {r.requiresCleaning && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-medium">
                        Aseo Solicitado
                      </span>
                    )}
                    {r.requiresGuardia && (
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-medium">
                        Guardia de Acceso
                      </span>
                    )}
                  </div>

                  {/* Equipment items */}
                  {r.equipamientos.length > 0 && (
                    <div className="text-xs text-slate-700">
                      <span className="font-bold text-slate-900 block mb-1">Equipamiento Técnico Solicitado:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {r.equipamientos.map((eq) => (
                          <span
                            key={eq.id}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-medium"
                          >
                            {eq.equipamiento.name} ({eq.quantity})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => handleReject(r.id)}
                      disabled={isLoading}
                      className="px-4 py-2.5 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors touch-target disabled:opacity-50"
                    >
                      Rechazar Solicitud
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApprove(r.id)}
                      disabled={isLoading}
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 touch-target transition-all disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>Aprobar y Emitir Pase QR</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Section: Confirmed Events Calendar */}
        <div className="space-y-3 pt-4">
          <h2 className="text-base font-bold text-slate-900">
            Eventos Confirmados y en Curso ({approvedReservas.length})
          </h2>

          <div className="space-y-2.5">
            {approvedReservas.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Confirmado
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{r.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Docente: {r.user.name} • QR: <code className="text-slate-700">{r.qrToken}</code>
                  </p>
                </div>

                <div className="text-xs text-slate-600 sm:text-right font-medium">
                  <span>{new Date(r.startTime).toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short" })}</span>
                  <p className="text-slate-500 font-mono text-[11px]">
                    {new Date(r.startTime).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })} -{" "}
                    {new Date(r.endTime).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
