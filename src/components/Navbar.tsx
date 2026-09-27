"use client";

import React from "react";
import { 
  ShieldCheck, 
  CalendarPlus, 
  QrCode, 
  Boxes, 
  Bell, 
  History, 
  UserCheck, 
  Building2 
} from "lucide-react";
import { UserRole } from "@/lib/types";

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenReservation: () => void;
  onOpenQR: () => void;
  onOpenInventory: () => void;
  onOpenNotifications: () => void;
  onOpenAudit: () => void;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  onOpenReservation,
  onOpenQR,
  onOpenInventory,
  onOpenNotifications,
  onOpenAudit,
  pendingCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">AUDITORIO</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  CAPSTONE APT122
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Gestión Operativa • Horas TI • Validación QR
              </p>
            </div>
          </div>

          {/* Role Simulator Switcher */}
          <div className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 px-2 flex items-center gap-1 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Rol Activo:
            </span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-slate-800 text-xs text-white font-medium rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="PROFESSOR">Docente / Solicitante</option>
              <option value="ASSISTANT">Encargado de Auditorio</option>
              <option value="IT_SERVICE">Soporte Técnico (Terreno)</option>
              <option value="IT_ADMIN">Administrador de TI</option>
              <option value="OWNER">Super Administrador</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenReservation}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              <CalendarPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Nueva Reserva</span>
            </button>

            <button
              onClick={onOpenQR}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all badge-glow-green"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Validar QR</span>
            </button>

            <button
              onClick={onOpenInventory}
              title="Inventario de Equipos"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <Boxes className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenNotifications}
              title="Notificaciones a Cuadrillas"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={onOpenAudit}
              title="Registro de Auditoría (Trazabilidad)"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Security Banner Badge */}
      <div className="bg-slate-900/60 border-t border-slate-800/40 px-4 py-1 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ciberseguridad Defensiva Integrada: OWASP Top 10 • Hashing bcrypt • Prisma Parametrizado</span>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-slate-400">
          <span>Base de Datos: SQLite / Neon PostgreSQL</span>
          <span>•</span>
          <span className="text-emerald-400 font-mono">Status: ONLINE (Local)</span>
        </div>
      </div>
    </header>
  );
};
