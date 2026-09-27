import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema Autónomo de Gestión de Auditorios | Proyecto Capstone (APT122)",
  description:
    "Plataforma de alta fidelidad para la gestión operativa, validación QR en terreno en < 30s, medición exacta de horas de TI y analítica de auditorios bajo estándares OWASP Top 10.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
