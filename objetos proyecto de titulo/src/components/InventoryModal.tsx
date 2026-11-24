"use client";

import React, { useState } from "react";
import { X, Boxes, Wrench, CheckCircle2, ShieldAlert } from "lucide-react";
import { EquipamientoItem } from "@/lib/types";
import { toggleEquipmentStatusAction } from "@/lib/actions";

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipamientos: EquipamientoItem[];
  onSuccess: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  equipamientos,
  onSuccess,
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggle = async (eq: EquipamientoItem) => {
    setUpdatingId(eq.id);
    const nextStatus = eq.status === "AVAILABLE" ? "MAINTENANCE" : "AVAILABLE";
    try {
      await toggleEquipmentStatusAction(eq.id, nextStatus);
      onSuccess();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="glass-card w-full max-w-2xl rounded-2xl border border-slate-700/80 p-6 bg-slate-900/95 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Control de Inventario Técnico Audiovisual
              </h2>
              <p className="text-xs text-slate-400">
                Bloqueo automático de hardware en mantenimiento (RF-20 / RF-21)
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

        <div className="mt-5 space-y-3">
          {equipamientos.map((eq) => {
            const isMaint = eq.status === "MAINTENANCE";
            return (
              <div
                key={eq.id}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-800/40 flex items-center justify-between transition-colors hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white text-xs">{eq.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                      {eq.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    S/N: {eq.serialNumber || "N/A"} • Total: {eq.totalQty} • Disponibles: {eq.availableQty}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center space-x-1 ${
                      isMaint
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {isMaint ? <ShieldAlert className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    <span>{isMaint ? "En Mantención" : "Disponible"}</span>
                  </span>

                  <button
                    onClick={() => handleToggle(eq)}
                    disabled={updatingId === eq.id}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors text-xs flex items-center gap-1"
                    title={isMaint ? "Habilitar para reservas" : "Marcar en mantención"}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{isMaint ? "Habilitar" : "Mantención"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
