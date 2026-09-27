"use client";

import React, { useState } from "react";
import { X, QrCode, CheckCircle2, Clock, Smartphone, AlertCircle, ArrowRight } from "lucide-react";
import { ReservaItem } from "@/lib/types";
import { processCheckInAction, processCheckOutAction } from "@/lib/actions";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservas: ReservaItem[];
  tecnicoId: string;
  onSuccess: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  reservas,
  tecnicoId,
  onSuccess,
}) => {
  const [tokenInput, setTokenInput] = useState("");
  const [selectedReservaId, setSelectedReservaId] = useState("");
  const [activeTab, setActiveTab] = useState<"CHECK_IN" | "CHECK_OUT">("CHECK_IN");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  if (!isOpen) return null;

  // Filter approved reservations ready for check-in
  const approvedReservas = reservas.filter((r) => r.status === "APPROVED" && r.qrToken);
  // Filter checked-in reservations ready for check-out
  const checkedInReservas = reservas.filter((r) => r.status === "CHECKED_IN");

  const handleQuickSelectToken = (token: string) => {
    setTokenInput(token);
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await processCheckInAction(tokenInput.trim(), tecnicoId);
      if (res.success) {
        setFeedback({
          type: "success",
          message: `¡Check-in validado exitosamente en < 30s! Evento "${res.reservaTitle}" iniciado. Cronómetro de soporte en marcha.`,
        });
        setTokenInput("");
        onSuccess();
      } else {
        setFeedback({ type: "error", message: res.error || "Código QR no válido." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Error al validar Check-in." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async (reservaId: string) => {
    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await processCheckOutAction(reservaId, tecnicoId);
      if (res.success) {
        setFeedback({
          type: "success",
          message: `¡Check-out completado! Se registraron ${res.hoursDecimal} horas de TI dedicadas (${res.minutes} minutos). Retorno de equipamiento conforme.`,
        });
        onSuccess();
      } else {
        setFeedback({ type: "error", message: res.error || "Error al procesar Check-out." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Error inesperado." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="glass-card w-full max-w-xl rounded-2xl border border-slate-700/80 p-6 bg-slate-900/95 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Módulo Móvil de Validación QR
              </h2>
              <p className="text-xs text-slate-400">
                Check-in en &lt; 30 seg • Medición matemática de horas TI ($\Delta T$)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-800/60 rounded-xl border border-slate-700/50">
          <button
            onClick={() => { setActiveTab("CHECK_IN"); setFeedback(null); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "CHECK_IN"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Validar Check-in (Ingreso)
          </button>
          <button
            onClick={() => { setActiveTab("CHECK_OUT"); setFeedback(null); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "CHECK_OUT"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Cerrar Check-out (Salida)
          </button>
        </div>

        {feedback && (
          <div
            className={`mt-4 p-3.5 rounded-xl border text-xs flex items-start space-x-2 ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Tab Content: CHECK-IN */}
        {activeTab === "CHECK_IN" && (
          <div className="mt-5 space-y-4">
            {/* Visual Viewfinder Frame Simulator */}
            <div className="relative w-full h-44 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-slate-950/60 flex flex-col items-center justify-center overflow-hidden">
              <div className="w-32 h-32 border-2 border-emerald-400 rounded-xl relative flex items-center justify-center">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-300" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-300" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-300" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-300" />
                <Smartphone className="w-8 h-8 text-emerald-400/60 animate-pulse" />
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Alinee el código QR generado en el comprobante del expositor
              </p>
            </div>

            <form onSubmit={handleCheckIn} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Token Criptográfico QR (Ingreso Rápido)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Ej. QR-LIVE-DEMO-2026-CAPSTONE-SECURE"
                    className="flex-1 bg-slate-800 text-xs font-mono text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !tokenInput}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-50"
                  >
                    {isLoading ? "Validando..." : "Validar"}
                  </button>
                </div>
              </div>

              {/* Quick tokens available for demo */}
              {approvedReservas.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                    Códigos QR de Eventos Aprobados Disponibles:
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {approvedReservas.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleQuickSelectToken(r.qrToken!)}
                        className="w-full text-left p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between group transition-colors"
                      >
                        <div className="truncate pr-2">
                          <p className="font-semibold text-white truncate">{r.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{r.qrToken}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Tab Content: CHECK-OUT */}
        {activeTab === "CHECK_OUT" && (
          <div className="mt-5 space-y-3">
            <span className="text-xs text-slate-400 block">
              Eventos en curso con Check-in activo listos para cierre y cómputo de horas TI:
            </span>

            {checkedInReservas.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                No hay eventos con Check-in activo en este momento.
              </div>
            ) : (
              <div className="space-y-2.5">
                {checkedInReservas.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-white text-xs">{r.title}</p>
                      <p className="text-[11px] text-slate-400">
                        Docente: {r.user.name} • Ingreso:{" "}
                        {r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString("es-CL") : "--:--"}
                      </p>
                      <div className="mt-1 flex items-center space-x-2 text-[10px] text-emerald-400">
                        <Clock className="w-3 h-3" />
                        <span>Soporte activo en progreso</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCheckOut(r.id)}
                      disabled={isLoading}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
                    >
                      Cerrar Check-out
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
