"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import jsQR from "jsqr";
import { 
  Camera, 
  CameraOff, 
  SwitchCamera, 
  Upload, 
  AlertCircle,
  Check,
  RefreshCw
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
  const processCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);
  const [detectedToken, setDetectedToken] = useState<string | null>(null);

  // Audio beep via Web Audio API
  const playSuccessBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // AudioContext may be blocked until user gesture, ignore safely
    }
  };

  // Enumerate cameras
  useEffect(() => {
    if (navigator?.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoInputs = devices.filter((d) => d.kind === "videoinput");
        setHasMultipleCameras(videoInputs.length > 1);
      }).catch(() => {});
    }
  }, []);

  // Rigorous camera shutdown: stops all hardware media tracks immediately
  const stopCamera = useCallback(() => {
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      activeStreamRef.current = null;
    }
    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
        videoRef.current.srcObject = null;
      }
    }
    // Clear overlay canvas
    if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
    }
    setIsCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError("Tu navegador no soporta acceso a la cámara. Puedes subir una captura del QR.");
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
      activeStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.warn("Camera access error:", err);
      let msg = "No se pudo acceder a la cámara.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        msg = "Permiso de cámara denegado. Permite el acceso a la cámara o sube una imagen.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        msg = "No se detectó cámara en este dispositivo. Puedes subir una captura del pase.";
      }
      setCameraError(msg);
      setIsCameraActive(false);
    }
  }, [facingMode, stopCamera]);

  // Manage camera lifecycle based on isActive prop
  useEffect(() => {
    if (isActive && !detectedToken) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isActive, detectedToken, facingMode, startCamera, stopCamera]);

  // Real-time scan and tracking frame loop
  useEffect(() => {
    if (!isCameraActive) return;

    let animId: number;
    let isLocked = false;
    let lastScanTime = 0;

    let nativeDetector: any = null;
    if (typeof window !== "undefined" && "BarcodeDetector" in window) {
      try {
        nativeDetector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
      } catch {
        nativeDetector = null;
      }
    }

    const drawTrackingBox = (
      points: { x: number; y: number }[],
      label: string,
      scaleX: number,
      scaleY: number
    ) => {
      const overlay = overlayCanvasRef.current;
      if (!overlay) return;
      const ctx = overlay.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, overlay.width, overlay.height);

      if (points.length >= 4) {
        ctx.beginPath();
        ctx.moveTo(points[0].x * scaleX, points[0].y * scaleY);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x * scaleX, points[i].y * scaleY);
        }
        ctx.closePath();

        // High-contrast tracking polygon
        ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
        ctx.fill();
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 4;
        ctx.lineJoin = "round";
        ctx.stroke();

        // Corner circles
        points.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x * scaleX, p.y * scaleY, 6, 0, 2 * Math.PI);
          ctx.fillStyle = "#34d399";
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
        });

        // Label above the detected QR
        const minX = Math.min(...points.map((p) => p.x * scaleX));
        const minY = Math.min(...points.map((p) => p.y * scaleY));
        ctx.font = "bold 13px monospace";
        ctx.fillStyle = "#10b981";
        ctx.fillText(`✓ QR DETECTADO`, Math.max(10, minX), Math.max(20, minY - 10));
      }
    };

    const handleSuccessfulScan = (rawValue: string) => {
      isLocked = true;
      setDetectedToken(rawValue);
      playSuccessBeep();
      onScan(rawValue);

      // CRITICAL FIX: Automatically stop camera and turn off hardware stream immediately after scan
      setTimeout(() => {
        stopCamera();
        isLocked = false;
      }, 500);
    };

    const processFrame = async () => {
      const video = videoRef.current;
      const overlay = overlayCanvasRef.current;
      const processCanvas = processCanvasRef.current;

      if (
        video &&
        video.readyState === video.HAVE_ENOUGH_DATA &&
        overlay &&
        processCanvas &&
        !isLocked
      ) {
        if (overlay.width !== video.clientWidth || overlay.height !== video.clientHeight) {
          overlay.width = video.clientWidth;
          overlay.height = video.clientHeight;
        }

        const now = performance.now();
        if (now - lastScanTime >= 30) {
          lastScanTime = now;

          // 1. Try native BarcodeDetector
          if (nativeDetector) {
            try {
              const barcodes = await nativeDetector.detect(video);
              if (barcodes && barcodes.length > 0) {
                const bc = barcodes[0];
                const rawValue = (bc.rawValue || "").trim();
                if (rawValue) {
                  const scaleX = overlay.width / video.videoWidth;
                  const scaleY = overlay.height / video.videoHeight;
                  drawTrackingBox(bc.cornerPoints || [], rawValue, scaleX, scaleY);
                  handleSuccessfulScan(rawValue);
                  return;
                }
              } else {
                const ctx = overlay.getContext("2d");
                if (ctx) ctx.clearRect(0, 0, overlay.width, overlay.height);
              }
            } catch {
              // Fallback to jsQR
            }
          }

          // 2. High-speed jsQR fallback
          const maxDim = 640;
          let targetW = video.videoWidth;
          let targetH = video.videoHeight;
          if (targetW > maxDim) {
            targetH = Math.round((targetH * maxDim) / targetW);
            targetW = maxDim;
          }

          if (processCanvas.width !== targetW || processCanvas.height !== targetH) {
            processCanvas.width = targetW;
            processCanvas.height = targetH;
          }

          const pctx = processCanvas.getContext("2d", { willReadFrequently: true });
          if (pctx) {
            pctx.drawImage(video, 0, 0, targetW, targetH);
            const imgData = pctx.getImageData(0, 0, targetW, targetH);
            const code = jsQR(imgData.data, imgData.width, imgData.height, {
              inversionAttempts: "attemptBoth",
            });

            if (code && code.data && code.data.trim()) {
              const rawValue = code.data.trim();
              const scaleX = overlay.width / targetW;
              const scaleY = overlay.height / targetH;
              const points = [
                code.location.topLeftCorner,
                code.location.topRightCorner,
                code.location.bottomRightCorner,
                code.location.bottomLeftCorner,
              ];

              drawTrackingBox(points, rawValue, scaleX, scaleY);
              handleSuccessfulScan(rawValue);
              return;
            } else {
              const ctx = overlay.getContext("2d");
              if (ctx) ctx.clearRect(0, 0, overlay.width, overlay.height);
            }
          }
        }
      }

      if (isCameraActive && !isLocked) {
        animId = requestAnimationFrame(processFrame);
      }
    };

    animId = requestAnimationFrame(processFrame);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isCameraActive, onScan, stopCamera]);

  // Decode QR from uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = processCanvasRef.current || document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = img.width;
        let h = img.height;
        if (w > 1000) {
          h = Math.round((h * 1000) / w);
          w = 1000;
        }

        canvas.width = w;
        canvas.height = h;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, w, h);

        try {
          const imageData = ctx.getImageData(0, 0, w, h);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });

          if (code && code.data && code.data.trim()) {
            const rawValue = code.data.trim();
            playSuccessBeep();
            setDetectedToken(rawValue);
            stopCamera();
            onScan(rawValue);
          } else {
            setCameraError("No se detectó código QR en la imagen seleccionada.");
          }
        } catch {
          setCameraError("Error al procesar la imagen.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div className="w-full space-y-3">
      {/* Hidden processing canvas */}
      <canvas ref={processCanvasRef} className="hidden" />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Clean Video Viewport with Live Tracking Overlay */}
      <div className="relative w-full aspect-video max-h-72 bg-black rounded-2xl overflow-hidden border-2 border-slate-700 shadow-md flex items-center justify-center">
        {/* Live Camera Video Feed (Direct, clean, no laser) */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover ${isCameraActive ? "block" : "hidden"}`}
        />

        {/* Real-Time Polygon Tracking Canvas */}
        <canvas
          ref={overlayCanvasRef}
          className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${
            isCameraActive ? "block" : "hidden"
          }`}
        />

        {/* Camera Off State / Post-Scan Confirmation */}
        {!isCameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-900 text-slate-300 space-y-3">
            {detectedToken ? (
              /* Success Card after QR scan (Camera successfully closed) */
              <div className="space-y-3 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">¡Pase QR Escaneado y Validado!</p>
                  <p className="text-[11px] font-mono text-emerald-300 mt-0.5 truncate max-w-xs bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                    {detectedToken}
                  </p>
                  <p className="text-[10px] text-emerald-400 mt-1 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Cámara cerrada automáticamente para ahorro de batería
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDetectedToken(null);
                    startCamera();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 touch-target"
                >
                  <Camera className="w-4 h-4" />
                  <span>Escanear Siguiente Pase</span>
                </button>
              </div>
            ) : (
              /* Camera Idle or Error State */
              <>
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                  <CameraOff className="w-6 h-6" />
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
                    La cámara está apagada. Pulsa &ldquo;Activar Cámara&rdquo; para escanear en tiempo real.
                  </p>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 touch-target"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Activar Cámara</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>Subir Imagen</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Active Scan Indicator Pill */}
        {isCameraActive && (
          <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Cámara en vivo • Cierre automático al detectar
            </span>
          </div>
        )}
      </div>

      {/* Camera Controls Toolbar */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          {isCameraActive ? (
            <button
              type="button"
              onClick={stopCamera}
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <CameraOff className="w-3.5 h-3.5 text-red-600" />
              <span>Cerrar Cámara</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setDetectedToken(null);
                startCamera();
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{detectedToken ? "Nuevo Escaneo" : "Activar Cámara"}</span>
            </button>
          )}

          {hasMultipleCameras && isCameraActive && (
            <button
              type="button"
              onClick={toggleCameraFacing}
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Cambiar entre cámara trasera y delantera"
            >
              <SwitchCamera className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">
                {facingMode === "environment" ? "Trasera" : "Frontal"}
              </span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 ml-auto"
          title="Escanear desde captura de pantalla o foto"
        >
          <Upload className="w-3.5 h-3.5 text-indigo-600" />
          <span>Subir Captura</span>
        </button>
      </div>
    </div>
  );
};
