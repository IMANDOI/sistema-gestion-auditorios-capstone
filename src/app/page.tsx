"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  Smartphone, 
  GraduationCap, 
  ClipboardCheck, 
  BarChart3, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { loginWithCredentials, quickLoginAsRole } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const res = await loginWithCredentials(formData);
    setIsLoading(false);

    if (res.success) {
      redirectToRole(res.role!);
    } else {
      setErrorMessage(res.error || "Error al iniciar sesión.");
    }
  };

  const handleQuickLogin = async (role: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    const res = await quickLoginAsRole(role);
    setIsLoading(false);

    if (res.success) {
      redirectToRole(res.role!);
    } else {
      setErrorMessage(res.error || "Error al conectar.");
    }
  };

  const redirectToRole = (role: string) => {
    switch (role) {
      case "IT_SERVICE":
        router.push("/tecnico");
        break;
      case "PROFESSOR":
        router.push("/docente");
        break;
      case "ASSISTANT":
        router.push("/encargado");
        break;
      case "IT_ADMIN":
      case "OWNER":
        router.push("/admin");
        break;
      default:
        router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 bg-blue-700 text-white rounded-2xl mx-auto flex items-center justify-center shadow-md mb-3">
          <Building2 className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Gestión de Auditorios
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">
          Proyecto Capstone (APT122 / PTY4614) • Acceso al Sistema
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-md rounded-2xl border border-slate-200 space-y-6">
          {/* Quick Access Roles for Testing and Evaluation */}
          <div>
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Acceso Rápido por Perfil (Demostración y Evaluación)
            </h2>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Seleccione el rol que desea simular para ingresar directamente a su portal especializado:
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Option 1: Mobile Technician (QR Validator) */}
              <button
                type="button"
                onClick={() => handleQuickLogin("IT_SERVICE")}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border-2 border-emerald-500/80 bg-emerald-50/60 hover:bg-emerald-100 text-slate-900 text-left transition-all touch-target"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-950">Soporte Técnico en Terreno</p>
                    <p className="text-xs text-emerald-800">
                      Optimizado para Smartphone • Validación QR en &lt; 30s
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              </button>

              {/* Option 2: Professor */}
              <button
                type="button"
                onClick={() => handleQuickLogin("PROFESSOR")}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-slate-900 text-left transition-all touch-target"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Docente / Expositor</p>
                    <p className="text-xs text-slate-600">
                      Solicitud asistida de auditorio • Ver mi Pase QR
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-700 flex-shrink-0" />
              </button>

              {/* Option 3: Assistant / Coordinator */}
              <button
                type="button"
                onClick={() => handleQuickLogin("ASSISTANT")}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 text-left transition-all touch-target"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 text-white flex items-center justify-center flex-shrink-0">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Encargada de Auditorio</p>
                    <p className="text-xs text-slate-600">
                      Revisión de solicitudes • Aprobación / Rechazo
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
              </button>

              {/* Option 4: Admin TI */}
              <button
                type="button"
                onClick={() => handleQuickLogin("OWNER")}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 text-slate-900 text-left transition-all touch-target"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-700 text-white flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Administrador de TI</p>
                    <p className="text-xs text-slate-600">
                      Dashboard analítico • Horas TI • Inventario • Auditoría
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-700 flex-shrink-0" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500 font-semibold">
                O ingresar con credenciales
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo Electrónico Institucional
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@institucion.cl"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Clave de demostración: <code>Capstone2026!</code></p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-colors touch-target disabled:opacity-50"
            >
              {isLoading ? "Validando credenciales..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>

        {/* Security Footer Notice */}
        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <div className="flex items-center justify-center space-x-1.5 text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Ciberseguridad Defensiva Integrada (OWASP Top 10)</span>
          </div>
          <p>Cifrado de contraseñas bcrypt • Sesiones JWT HttpOnly • Prisma ORM parametrizado</p>
        </div>
      </div>
    </div>
  );
}
