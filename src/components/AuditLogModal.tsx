"use client";

import React from "react";
import { X, History, Shield, Clock } from "lucide-react";

interface AuditLogItem {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  ipAddress?: string | null;
  details?: string | null;
  createdAt: string;
  user?: {
    name: string;
    role: string;
  } | null;
}

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditorias: AuditLogItem[];
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  isOpen,
  onClose,
  auditorias,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="glass-card w-full max-w-3xl rounded-2xl border border-slate-700/80 p-6 bg-slate-900/95 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Bitácora de Trazabilidad y Auditoría Operativa
              </h2>
              <p className="text-xs text-slate-400">
                Registro inmutable append-only de eventos (RF-24 / ISO 27001)
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

        <div className="mt-5 space-y-2.5">
          {auditorias.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No hay registros de auditoría aún.</p>
          ) : (
            auditorias.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-800 bg-slate-800/30 text-xs text-slate-300 flex items-start justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-semibold text-indigo-400 text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {log.entity}
                    </span>
                  </div>
                  <p className="text-slate-200">{log.details}</p>
                  <p className="text-[10px] text-slate-400">
                    Operador: {log.user?.name || "Sistema"} ({log.user?.role || "AUTO"}) • IP: {log.ipAddress || "127.0.0.1"}
                  </p>
                </div>

                <div className="flex items-center space-x-1 text-[10px] text-slate-500 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(log.createdAt).toLocaleString("es-CL")}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
