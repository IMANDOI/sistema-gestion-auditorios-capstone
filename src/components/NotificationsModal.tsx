"use client";

import React from "react";
import { X, Bell, Mail, Send, CheckCircle2 } from "lucide-react";

interface SuscripcionItem {
  id: string;
  name: string;
  email: string;
  department: string;
  isActive: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  suscripciones: SuscripcionItem[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  suscripciones,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="glass-card w-full max-w-xl rounded-2xl border border-slate-700/80 p-6 bg-slate-900/95 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Difusión Automática a Servicios de Apoyo
              </h2>
              <p className="text-xs text-slate-400">
                Sincronización por áreas (Aseo, Guardia, TI) - RF-22
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
          <p className="text-xs text-slate-300">
            Al confirmarse o modificarse una reserva, el despachador de correos envía automáticamente la ficha técnica con requerimientos de sanitización y horarios de apertura:
          </p>

          <div className="space-y-2">
            {suscripciones.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-xl border border-slate-800 bg-slate-800/40 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-xs">{s.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{s.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {s.department}
                  </span>
                  <span className="flex items-center space-x-1 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Activo</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-300 flex items-start space-x-2">
            <Send className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Despacho Resiliente:</strong> Conexión con cola de reintentos exponenciales para garantizar la entrega ante eventuales fallas de red del servidor SMTP.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
