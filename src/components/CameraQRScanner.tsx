"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import jsQR from "jsqr";
import { 
  Camera, 
  CameraOff, 
  RefreshCw, 
  SwitchCamera, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Zap
} from "lucide-react";

interface CameraQRScannerProps {
  onScan: (decodedText: string) => void;
  isActive?: boolean;
}

export const CameraQRScanner: React.FC<CameraQRScannerProps> = ({
  onScan,
  isActive = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  // Play audio beep upon successful scan via Web Audio API (zero external assets needed)
  const playSuccessBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // AudioContext might be blocked until user gesture, ignore silently
    }
  };

  // Check available cameras
  useEffect(() => {
    if (navigator?.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoInputs = devices.filter((d) => d.kind === "videoinput");
        setHasMultipleCameras(videoInputs.length > 1);
      }).catch(() => {});
    }
  }, []);

  // Stop current video stream
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsScanning(false);
  }, []);

  // Start video stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError("Tu navegador no soporta acceso a la cámara. Puedes subir una imagen con el QR.");
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true"); // Required for iOS Safari
        await videoRef.current.play();
        setIsCameraActive(true);
        setIsScanning(true);
      }
    } catch (err: any) {
      console.warn("Camera access error:", err);
      let msg = "No se pudo acceder a la cámara.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        msg = "Permiso de cámara denegado. Permite el acceso a la cámara en los ajustes del navegador o sube una imagen.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        msg = "No se detectó ninguna cámara en este dispositivo. Puedes subir una foto o ingresar el código.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        msg = "La cámara está siendo utilizada por otra aplicación.";
      }
      setCameraError(msg);
      setIsCameraActive(false);
      setIsScanning(false);
    }
  }, [facingMode, stopCamera]);

  // Handle active state
  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isActive, facingMode, startCamera, stopCamera]);

  // Continuous frame analysis loop with jsQR
  useEffect(() => {
    let animationFrameId: number;
    let isProcessing = false;

    const scanFrame = () => {
      if (
        isScanning &&
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
        canvasRef.current
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });

            if (code && code.data && !isProcessing) {
              const decoded = code.data.trim();
              if (decoded && decoded !== lastScanned) {
                isProcessing = true;
                setLastScanned(decoded);
                playSuccessBeep();
                onScan(decoded);
                // Pause briefly to avoid rapid repeated triggers
                setTimeout(() => {
                  isProcessing = false;
                }, 2000);
              }
            }
          } catch (e) {
            // Ignore scan parse error
          }
        }
      }

      if (isCameraActive) {
        animationFrameId = requestAnimationFrame(scanFrame);
      }
    };

    if (isCameraActive) {
      animationFrameId = requestAnimationFrame(scanFrame);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isCameraActive, isScanning, lastScanned, onScan]);

  // Decode QR from uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });

          if (code && code.data) {
            playSuccessBeep();
            setLastScanned(code.data);
            onScan(code.data);
          } else {
            setCameraError("No se detectó un código QR válido en la imagen seleccionada.");
          }
        } catch {
          setCameraError("Error al procesar la imagen.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Reset file input
    e.target.value = "";
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div className="w-full space-y-3">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Main Viewfinder Frame */}
      <div className="relative w-full aspect-video max-h-72 bg-slate-950 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-inner flex items-center justify-center group">
        {/* Live Video Feed */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isCameraActive ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Camera Off / Error State Overlay */}
        {!isCameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-950/90 text-slate-300 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <CameraOff className="w-7 h-7" />
            </div>
            {cameraError ? (
              <div className="max-w-xs space-y-1">
                <p className="text-xs font-semibold text-amber-400 flex items-center justify-center gap-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  Cámara no disponible
                </p>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {cameraError}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                La cámara está desactivada. Haz clic en &ldquo;Activar Cámara&rdquo; para escanear en tiempo real.
              </p>
            )}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={startCamera}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Activar Cámara</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>Subir Imagen</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Active Overlay: Viewfinder box and Laser scanning animation */}
        {isCameraActive && (
          <>
            {/* Dark vignette border */}
            <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

            {/* Targeted Scanning Box */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 border-2 border-emerald-400/80 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 pointer-events-none">
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

              {/* Animated Laser Scanning Line */}
              <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10b981] animate-laser" />

              {/* Centered Guide Icon */}
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center opacity-40">
                <Zap className="w-4 h-4 text-emerald-300" />
              </div>
            </div>

            {/* Live scanning pill banner */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-emerald-500/40 text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Escaneando en vivo (&lt; 30s)
              </span>

              {lastScanned && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-[10px] font-mono text-emerald-200 truncate max-w-[150px]">
                  ✓ {lastScanned}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Camera Controls Toolbar */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          {isCameraActive ? (
            <button
              type="button"
              onClick={stopCamera}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <CameraOff className="w-3.5 h-3.5 text-red-400" />
              <span>Pausar Cámara</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startCamera}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Reanudar Cámara</span>
            </button>
          )}

          {hasMultipleCameras && isCameraActive && (
            <button
              type="button"
              onClick={toggleCameraFacing}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
              title="Cambiar entre cámara trasera y delantera"
            >
              <SwitchCamera className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">
                {facingMode === "environment" ? "Cámara Trasera" : "Cámara Frontal"}
              </span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5 ml-auto"
          title="Escanear desde imagen o captura de pantalla"
        >
          <Upload className="w-3.5 h-3.5 text-indigo-400" />
          <span>Subir Captura</span>
        </button>
      </div>
    </div>
  );
};
