"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, Mic, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { EquipamientoItem } from "@/lib/types";
import { createReservationAction } from "@/lib/actions";

interface QuickReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipamientos: EquipamientoItem[];
  currentUserId: string;
  auditorioId: string;
  onSuccess: () => void;
}

export const QuickReservationModal: React.FC<QuickReservationModalProps> = ({
  isOpen,
  onClose,
  equipamientos,
  currentUserId,
  auditorioId,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [attendees, setAttendees] = useState(50);
  const [requiresCleaning, setRequiresCleaning] = useState(true);
  const [requiresGuardia, setRequiresGuardia] = useState(true);
  const [notes, setNotes] = useState("");
  const [selectedEqs, setSelectedEqs] = useState<{ [id: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleEquipment = (id: string) => {
    setSelectedEqs((prev) => {
      const copy = { ...prev };
      if (copy[id]) {
        delete copy[id];
      } else {
        copy[id] = 1;
      }
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const selectedList = Object.entries(selectedEqs).map(([equipamientoId, quantity]) => ({
        equipamientoId,
        quantity,
      }));

      const res = await createReservationAction({
        title,
        description,
        startTime,
        endTime,
        attendeesEstimate: attendees,
        requiresCleaning,
        requiresGuardia,
        notes,
        userId: currentUserId,
        auditorioId,
        selectedEquipments: selectedList,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Error al procesar la reserva.");
        setIsLoading(false);
        return;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Error inesperado al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="glass-card w-full max-w-2xl rounded-2xl border border-slate-700/80 p-6 bg-slate-900/95 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Nueva Solicitud de Reserva
              </h2>
              <p className="text-xs text-slate-400">
                Verificación anti-colisión transaccional en tiempo real
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

        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Título del Evento / Clase Magistral *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Conferencia: Inteligencia Artificial en Salud"
              className="w-full bg-slate-800/90 text-sm text-white rounded-xl px-3.5 py-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Fecha y Hora de Inicio *
              </label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-800/90 text-sm text-white rounded-xl px-3.5 py-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Fecha y Hora de Término *
              </label>
              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-800/90 text-sm text-white rounded-xl px-3.5 py-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Estimación de Asistentes: <span className="text-indigo-400 font-bold">{attendees} personas</span>
            </label>
            <input
              type="range"
              min="10"
              max="150"
              step="5"
              value={attendees}
              onChange={(e) => setAttendees(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Equipment selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>Equipamiento Técnico Requerido</span>
              <span className="text-[11px] text-slate-400">Stock controlado por TI</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {equipamientos.map((eq) => {
                const isSelected = !!selectedEqs[eq.id];
                const isMaintenance = eq.status === "MAINTENANCE";
                return (
                  <button
                    key={eq.id}
                    type="button"
                    disabled={isMaintenance}
                    onClick={() => toggleEquipment(eq.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                      isMaintenance
                        ? "opacity-50 border-slate-800 bg-slate-900/40 cursor-not-allowed"
                        : isSelected
                        ? "border-indigo-500 bg-indigo-500/10 text-white font-medium"
                        : "border-slate-800 bg-slate-800/50 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="truncate font-semibold">{eq.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {isMaintenance ? "EN MANTENCIÓN" : `Disp: ${eq.availableQty}`}
                      </p>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coordination toggles */}
          <div className="pt-2 border-t border-slate-800 flex items-center space-x-6 text-xs text-slate-300">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresCleaning}
                onChange={(e) => setRequiresCleaning(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-500"
              />
              <span>Coordinar Aseo Previo/Post</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresGuardia}
                onChange={(e) => setRequiresGuardia(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-500"
              />
              <span>Coordinar Guardia (Apertura)</span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? "Validando Colisiones..." : "Confirmar Solicitud"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
