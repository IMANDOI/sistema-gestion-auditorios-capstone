import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema Autónomo de Gestión de Auditorios | Proyecto Capstone (APT122)",
  description:
    "Plataforma accesible de alta fidelidad para la gestión operativa, validación QR en terreno en < 30s y medición de horas de TI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
