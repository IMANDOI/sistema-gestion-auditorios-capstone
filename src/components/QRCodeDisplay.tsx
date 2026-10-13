"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, Copy, Check, QrCode } from "lucide-react";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 220,
  className = "",
}) => {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<boolean>(false);

  useEffect(() => {
    if (!value) return;

    QRCode.toDataURL(value, {
      width: size * 2, // 2x resolution for sharp rendering on retina / high-DPI displays
      margin: 2,
      color: {
        dark: "#0f172a", // Deep slate for maximum contrast against white
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        setDataUrl(url);
        setGenerationError(false);
      })
      .catch((err) => {
        console.error("QR Code generation error:", err);
        setGenerationError(true);
      });
  }, [value, size]);

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `pase-acceso-${value}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Fallback public QR API URL if local canvas rendering fails
  const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    value
  )}&format=png`;

  const finalSrc = dataUrl || (generationError ? fallbackUrl : "");

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      {/* Real High-Contrast QR Matrix Card */}
      <div 
        className="bg-white p-3 rounded-2xl border-2 border-slate-900 shadow-lg flex items-center justify-center relative group"
        style={{ width: size + 24, height: size + 24 }}
      >
        {finalSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={finalSrc}
            alt={`Código QR para el token ${value}`}
            width={size}
            height={size}
            className="w-full h-full object-contain rounded-xl select-none"
          />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 text-slate-400">
            <QrCode className="w-12 h-12 animate-pulse" />
            <span className="text-[11px] font-semibold">Generando matriz QR...</span>
          </div>
        )}
      </div>

      {/* Token text badge with Copy & Download shortcuts */}
      <div className="w-full max-w-xs flex items-center justify-between gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
        <span className="font-mono text-[11px] font-bold text-slate-800 truncate px-2 select-all">
          {value}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors shadow-sm"
            title="Copiar token"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {dataUrl && (
            <button
              type="button"
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors shadow-sm"
              title="Descargar imagen PNG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
