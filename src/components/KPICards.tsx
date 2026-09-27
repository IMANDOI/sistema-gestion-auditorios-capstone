"use client";

import React from "react";
import { Clock, TrendingUp, CalendarCheck, Star, Zap, Users } from "lucide-react";
import { DashboardMetrics } from "@/lib/types";

interface KPICardsProps {
  metrics: DashboardMetrics;
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Metric 1: Horas TI */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 glass-card-hover relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Horas de Soporte TI
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {metrics.horasTIUtilizadas}
          </span>
          <span className="text-xs text-slate-400 font-medium">hrs computadas</span>
        </div>
        <div className="mt-3 flex items-center text-xs text-emerald-400 space-x-1.5 font-medium">
          <Zap className="w-3.5 h-3.5" />
          <span>+{metrics.horasTIAhorradas} hrs ahorradas vía QR (&lt; 30s)</span>
        </div>
      </div>

      {/* Metric 2: Tasa de Ocupación */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 glass-card-hover relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Tasa de Ocupación
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {metrics.tasaOcupacion}%
          </span>
          <span className="text-xs text-slate-400 font-medium">de capacidad semanal</span>
        </div>
        <div className="mt-3 flex items-center text-xs text-slate-400 space-x-1.5">
          <Users className="w-3.5 h-3.5 text-blue-400" />
          <span>{metrics.totalReservas} eventos programados</span>
        </div>
      </div>

      {/* Metric 3: Estado de Reservas */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 glass-card-hover relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Control de Reservas
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {metrics.reservasActivas}
          </span>
          <span className="text-xs text-emerald-400 font-medium">aprobadas / en curso</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>{metrics.reservasPendientes} pendientes de dictamen</span>
          {metrics.totalNoShows > 0 && (
            <span className="text-amber-400">{metrics.totalNoShows} No-Shows</span>
          )}
        </div>
      </div>

      {/* Metric 4: Satisfacción & NPS */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800/80 glass-card-hover relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Satisfacción & NPS
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {metrics.calificacionPromedio}
          </span>
          <span className="text-xs text-amber-400 font-medium">★ (Escala 1 - 5)</span>
        </div>
        <div className="mt-3 flex items-center text-xs text-indigo-400 space-x-1.5 font-medium">
          <span>NPS Score: +{metrics.npsScore} pts (Calidad Óptima)</span>
        </div>
      </div>
    </div>
  );
};
