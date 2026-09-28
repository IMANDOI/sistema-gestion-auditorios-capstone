"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Building2, ShieldCheck } from "lucide-react";
import { logoutUser } from "@/lib/auth";

interface PortalHeaderProps {
  userName: string;
  userRole: string;
  roleTitle: string;
  department?: string | null;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  userName,
  userRole,
  roleTitle,
  department,
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                  AUDITORIO
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {roleTitle}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Proyecto Capstone (APT122) • Sistema de Gestión Operativa
              </p>
            </div>
          </div>

          {/* User info & Logout */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-800">{userName}</p>
              <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                {department || "Campus Universitario"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-red-700 hover:bg-red-50 border border-slate-200 transition-colors touch-target"
              title="Cerrar Sesión e ir al Inicio"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
