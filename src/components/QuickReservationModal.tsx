"use client";

import React, { useState } from "react";
import { X, Calendar, CheckCircle2, AlertTriangle, Layers, Sparkles } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-300 p-6 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Nueva Solicitud de Auditorio
              </h2>
              <p className="text-xs text-slate-500">
                Verificación anti-colisión transaccional en tiempo real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 p-1.5 rounded-xl hover:bg-slate-100 transition-colors touch-target"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs font-medium flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-700" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Título del Evento o Actividad Académica *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Conferencia Magistral: Inteligencia Artificial en Educación"
              className="w-full bg-slate-50 text-sm text-slate-900 rounded-xl px-3.5 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Fecha y Hora de Inicio *
              </label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Fecha y Hora de Término *
              </label>
              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Estimación de Asistentes: <span className="text-blue-800 font-extrabold">{attendees} personas</span>
            </label>
            <input
              type="range"
              min="10"
              max="150"
              step="5"
              value={attendees}
              onChange={(e) => setAttendees(Number(e.target.value))}
              className="w-full accent-blue-700 cursor-pointer"
            />
          </div>

          {/* Equipment selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Equipamiento Técnico Requerido</span>
              <span className="text-[11px] text-slate-500 font-normal">Disponibilidad en stock</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
              {equipamientos.map((eq) => {
                const isSelected = !!selectedEqs[eq.id];
                const isMaintenance = eq.status === "MAINTENANCE";
                return (
                  <button
                    key={eq.id}
                    type="button"
                    disabled={isMaintenance}
                    onClick={() => toggleEquipment(eq.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all touch-target ${
                      isMaintenance
                        ? "opacity-50 border-slate-200 bg-slate-100 cursor-not-allowed"
                        : isSelected
                        ? "border-blue-600 bg-blue-50 text-slate-900 font-bold"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="truncate font-bold text-slate-900">{eq.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {isMaintenance ? "EN MANTENCIÓN" : `Disponible: ${eq.availableQty} unid.`}
                      </p>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-blue-700 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logistics checkboxes */}
          <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-800">
            <label className="flex items-center space-x-2 cursor-pointer touch-target">
              <input
                type="checkbox"
                checked={requiresCleaning}
                onChange={(e) => setRequiresCleaning(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-700"
              />
              <span>Coordinar Aseo Previo y Posterior</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer touch-target">
              <input
                type="checkbox"
                checked={requiresGuardia}
                onChange={(e) => setRequiresGuardia(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-700"
              />
              <span>Coordinar Apertura con Guardia</span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 touch-target"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-md touch-target transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? "Validando Colisiones..." : "Enviar Solicitud"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
