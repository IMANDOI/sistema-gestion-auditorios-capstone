"use client";

import React, { useState, useEffect } from "react";
import { PortalHeader } from "@/components/PortalHeader";
import { getDashboardData, processCheckInAction, processCheckOutAction } from "@/lib/actions";
import { ReservaItem } from "@/lib/types";
import { 
  QrCode, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Smartphone, 
  AlertCircle, 
  Check, 
  ArrowRight,
  RefreshCw
} from "lucide-react";

export default function TecnicoMobilePage() {
  const [data, setData] = useState<{ reservas: ReservaItem[]; users: any[] } | null>(null);
  const [activeTab, setActiveTab] = useState<"CHECK_IN" | "CHECK_OUT">("CHECK_IN");
  const [tokenInput, setTokenInput] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        loadData();
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
        loadData();
      } else {
        setFeedback({ type: "error", message: res.error || "Error al registrar salida." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Error al procesar Check-out." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      {/* Header */}
      <PortalHeader
        userName={tecnicoUser.name}
        userRole="IT_SERVICE"
        roleTitle="Soporte Técnico Móvil"
        department={tecnicoUser.department}
      />

      {/* Main Mobile-Optimized Container (Max width 500px) */}
      <main className="max-w-lg mx-auto px-4 pt-5 space-y-4">
        {/* Mobile Instruction Banner */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-base font-extrabold text-slate-900">
              Validación en Terreno (Smartphone)
            </h1>
            <p className="text-xs text-slate-600">
              Valide accesos de expositores y compute horas de soporte en sitio.
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

        {/* Big High-Contrast Tabs for Touch */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-200 rounded-2xl">
          <button
            type="button"
            onClick={() => { setActiveTab("CHECK_IN"); setFeedback(null); }}
            className={`py-3 px-4 text-xs font-bold rounded-xl transition-all touch-target flex items-center justify-center space-x-1.5 ${
              activeTab === "CHECK_IN"
                ? "bg-emerald-700 text-white shadow-md"
                : "text-slate-700 hover:text-slate-900 bg-transparent"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Check-in ({approvedReservas.length})</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab("CHECK_OUT"); setFeedback(null); }}
            className={`py-3 px-4 text-xs font-bold rounded-xl transition-all touch-target flex items-center justify-center space-x-1.5 ${
              activeTab === "CHECK_OUT"
                ? "bg-blue-800 text-white shadow-md"
                : "text-slate-700 hover:text-slate-900 bg-transparent"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Check-out ({checkedInReservas.length})</span>
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

        {/* TAB 1: CHECK-IN */}
        {activeTab === "CHECK_IN" && (
          <div className="space-y-4">
            {/* Visual camera scan representation */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-32 h-32 mx-auto rounded-2xl border-4 border-emerald-600 bg-emerald-50 flex flex-col items-center justify-center p-2">
                <Smartphone className="w-10 h-10 text-emerald-700" />
                <span className="text-[10px] font-bold text-emerald-800 mt-1">CÁMARA MÓVIL</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Escáner de Código QR en Terreno
                </h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Alinee el pase QR presentado por el expositor. La validación toma menos de 30 segundos.
                </p>
              </div>

              {/* Manual input fallback */}
              <div className="pt-2">
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

            {/* List of approved events ready for 1-tap Check-in */}
            <div className="space-y-2">
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
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3"
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
                        Expositor: <strong className="text-slate-900">{r.user.name}</strong>
                      </p>
                    </div>

                    {/* Equipment requested */}
                    {r.equipamientos.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                        <p className="font-semibold text-[11px] text-slate-900 flex items-center gap-1 mb-1">
                          <Layers className="w-3.5 h-3.5 text-blue-700" /> Equipos a Entregar:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {r.equipamientos.map((eq) => (
                            <span
                              key={eq.id}
                              className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-300 font-medium"
                            >
                              {eq.equipamiento.name} ({eq.quantity})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Big Touch Button to Validate Check-in in 1 tap */}
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

        {/* TAB 2: CHECK-OUT */}
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
                        Docente: <strong className="text-slate-900">{r.user.name}</strong>
                      </p>
                    </div>
                    <div className="text-right text-xs">
                      <span className="text-slate-500 block text-[10px]">Ingreso:</span>
                      <strong className="text-slate-900">
                        {r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                      </strong>
                    </div>
                  </div>

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
      </main>
    </div>
  );
}
