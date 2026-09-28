"use client";

import React, { useState, useEffect } from "react";
import { PortalHeader } from "@/components/PortalHeader";
import { getDashboardData } from "@/lib/actions";
import { QuickReservationModal } from "@/components/QuickReservationModal";
import { FeedbackModal } from "@/components/FeedbackModal";
import { ReservaItem, EquipamientoItem } from "@/lib/types";
import { 
  CalendarPlus, 
  QrCode, 
  Star, 
  Clock, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

export default function DocentePage() {
  const [data, setData] = useState<{
    reservas: ReservaItem[];
    equipamientos: EquipamientoItem[];
    auditorios: any[];
    users: any[];
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrModal, setQrModal] = useState<{ title: string; token: string } | null>(null);
  const [feedbackTarget, setFeedbackTarget] = useState<{ id: string; title: string } | null>(null);

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
        <p className="text-sm font-bold text-slate-600">Cargando Portal Docente...</p>
      </div>
    );
  }

  const docenteUser = data.users.find((u) => u.role === "PROFESSOR") || data.users[0];
  const auditorio = data.auditorios[0] || { id: "default" };

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <PortalHeader
        userName={docenteUser.name}
        userRole="PROFESSOR"
        roleTitle="Docente / Expositor"
        department={docenteUser.department}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Banner with Big Action Button */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Portal de Solicitudes de Auditorio
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Reserve espacios académicos, seleccione equipamiento audiovisual y obtenga su pase QR.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all touch-target"
          >
            <CalendarPlus className="w-5 h-5" />
            <span>Nueva Solicitud de Reserva</span>
          </button>
        </div>

        {/* PriorityScore Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between text-xs text-blue-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white font-extrabold flex items-center justify-center text-sm">
              {docenteUser.priorityScore}
            </div>
            <div>
              <p className="font-bold text-slate-900">Su Puntuación de Prioridad (PriorityScore): {docenteUser.priorityScore} pts</p>
              <p className="text-slate-600">
                Puntaje óptimo para adjudicación de reservas ante solicitudes simultáneas.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full text-[11px]">
            Sin penalizaciones por No-Show
          </span>
        </div>

        {/* List of Reservations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Mis Solicitudes y Eventos ({data.reservas.length})
            </h2>
            <span className="text-xs text-slate-500">Actualizado en tiempo real</span>
          </div>

          {data.reservas.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-500 text-sm">
              No tiene solicitudes registradas. Presione el botón superior para crear una nueva reserva.
            </div>
          ) : (
            data.reservas.map((r) => {
              const start = new Date(r.startTime);
              const end = new Date(r.endTime);

              return (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-900 text-base">{r.title}</h3>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
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
                          {r.status === "PENDING"
                            ? "Pendiente de Aprobación"
                            : r.status === "APPROVED"
                            ? "Aprobada (Pase QR Activo)"
                            : r.status === "CHECKED_IN"
                            ? "En Curso (Check-in OK)"
                            : r.status === "CHECKED_OUT"
                            ? "Finalizada"
                            : r.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Auditorio: {r.auditorio?.name || "Auditorio Magna"} • {r.attendeesEstimate} asistentes estimados
                      </p>
                    </div>

                    <div className="text-xs text-slate-600 sm:text-right font-medium">
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

                  {/* Equipment summary */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-700" /> Equipos:
                    </span>
                    {r.equipamientos.length === 0 ? (
                      <span className="italic text-slate-500">Ninguno solicitado</span>
                    ) : (
                      r.equipamientos.map((eq) => (
                        <span
                          key={eq.id}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-medium"
                        >
                          {eq.equipamiento.name} ({eq.quantity})
                        </span>
                      ))
                    )}
                  </div>

                  {/* Actions for Professor */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    {r.qrToken && r.status === "APPROVED" && (
                      <button
                        onClick={() => setQrModal({ title: r.title, token: r.qrToken! })}
                        className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm touch-target transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Mostrar Mi Pase QR de Acceso</span>
                      </button>
                    )}

                    {r.status === "CHECKED_OUT" && (
                      <div className="flex items-center space-x-3">
                        {r.encuesta ? (
                          <span className="flex items-center space-x-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                            <span>Su Calificación: {((r.encuesta.ratingOverall + r.encuesta.ratingEquipment + r.encuesta.ratingSupport) / 3).toFixed(1)} / 5 ★</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setFeedbackTarget({ id: r.id, title: r.title })}
                            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm touch-target transition-colors"
                          >
                            <Star className="w-4 h-4" />
                            <span>Evaluar Servicio Post-Evento</span>
                          </button>
                        )}
                      </div>
                    )}

                    {r.status === "PENDING" && (
                      <span className="text-xs text-amber-800 font-medium flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                        <AlertCircle className="w-4 h-4" />
                        <span>Solicitud en revisión por la encargada del auditorio</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* QR Modal for Professor to present in auditorium entrance */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center space-y-4 border border-slate-300">
            <h3 className="font-extrabold text-slate-900 text-lg">Pase de Acceso al Auditorio</h3>
            <p className="text-xs text-slate-600 font-medium">{qrModal.title}</p>

            <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl w-52 h-52 mx-auto flex flex-col items-center justify-center shadow-inner">
              <QrCode className="w-36 h-36 text-slate-950" />
              <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">CAPSTONE PASS</span>
            </div>

            <p className="text-xs font-mono font-bold text-slate-800 bg-slate-100 p-2.5 rounded-xl border border-slate-200 break-all">
              {qrModal.token}
            </p>

            <p className="text-xs text-slate-600 leading-relaxed">
              Muestre esta pantalla al técnico de soporte al llegar al auditorio para validar su ingreso en menos de 30 segundos.
            </p>

            <button
              onClick={() => setQrModal(null)}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs touch-target hover:bg-slate-800 transition-colors"
            >
              Cerrar Pase
            </button>
          </div>
        </div>
      )}

      {/* Quick Reservation Modal */}
      <QuickReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        equipamientos={data.equipamientos}
        currentUserId={docenteUser.id}
        auditorioId={auditorio.id}
        onSuccess={loadData}
      />

      {/* Feedback Modal */}
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
