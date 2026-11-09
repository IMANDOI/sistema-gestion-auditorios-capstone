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
  Zap,
  ZapOff,
  Sparkles
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
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const startRequestRef = useRef<number>(0);
  const onScanRef = useRef(onScan);
  
  // Off-DOM canvas in memory to avoid any mobile Safari/Blink display:none backing-store clearing
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);
  const [detectedToken, setDetectedToken] = useState<string | null>(null);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);

  // Initialize offscreen canvas
  useEffect(() => {
    if (typeof document !== "undefined" && !offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement("canvas");
    }
  }, []);

  // Audio & Haptic feedback
  const triggerSuccessFeedback = () => {
    // 1. Haptic vibration (mobile)
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([80, 50, 80]);
      }
    } catch {
      // Ignore vibration error
    }

    // 2. Audio chime via Web Audio API
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.12); // E6 note
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      }
    } catch {
      // AudioContext blocked without gesture, ignore safely
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

  // Rigorous camera shutdown
  const stopCamera = useCallback(() => {
    startRequestRef.current++;
    setIsTorchOn(false);
    setHasTorch(false);

    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
          track.enabled = false;
        } catch {}
      });
      activeStreamRef.current = null;
    }

    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
          try {
            track.stop();
            track.enabled = false;
          } catch {}
        });
        videoRef.current.srcObject = null;
      }
    }

    if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
    }

    setIsCameraActive(false);
  }, []);

  // Toggle hardware flashlight/torch
  const toggleTorch = async () => {
    if (!activeStreamRef.current) return;
    const track = activeStreamRef.current.getVideoTracks()[0];
    if (!track) return;
    try {
      const nextState = !isTorchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextState }],
      });
      setIsTorchOn(nextState);
    } catch (err) {
      console.warn("Error toggling torch:", err);
    }
  };

  // Start camera stream
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

      const requestId = ++startRequestRef.current;
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (requestId !== startRequestRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      activeStreamRef.current = stream;

      // Check torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const caps = (videoTrack.getCapabilities ? videoTrack.getCapabilities() : {}) as any;
        setHasTorch(Boolean(caps && "torch" in caps));
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.setAttribute("webkit-playsinline", "true");
        videoRef.current.setAttribute("autoplay", "true");
        videoRef.current.muted = true;

        try {
          await videoRef.current.play();
        } catch (playErr: any) {
          if (playErr?.name !== "AbortError") throw playErr;
        }

        if (requestId !== startRequestRef.current) return;
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

  // Manage camera lifecycle
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

  // Real-time scan loop
  useEffect(() => {
    if (!isCameraActive) return;

    let animId: number;
    let isLocked = false;
    let lastScanTime = 0;
    let frameCount = 0;

    // Check native BarcodeDetector
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
        ctx.fillStyle = "rgba(16, 185, 129, 0.35)";
        ctx.fill();
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 4;
        ctx.lineJoin = "round";
        ctx.stroke();

        // Corner circles
        points.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x * scaleX, p.y * scaleY, 7, 0, 2 * Math.PI);
          ctx.fillStyle = "#34d399";
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
        });

        // Label
        const minX = Math.min(...points.map((p) => p.x * scaleX));
        const minY = Math.min(...points.map((p) => p.y * scaleY));
        ctx.font = "bold 13px monospace";
        ctx.fillStyle = "#10b981";
        ctx.fillText(`✓ QR VALIDADO`, Math.max(10, minX), Math.max(20, minY - 10));
      }
    };

    const handleSuccessfulScan = (rawValue: string) => {
      isLocked = true;
      setDetectedToken(rawValue);
      triggerSuccessFeedback();
      onScanRef.current(rawValue);

      // Auto shut-off stream after scan
      setTimeout(() => {
        stopCamera();
      }, 500);
    };

    let cancelled = false;

    // Multi-tier fast scan routine
    const scanVideoFrame = (
      video: HTMLVideoElement,
      canvas: HTMLCanvasElement,
      invertCheck: boolean
    ): { value: string; points: { x: number; y: number }[] } | null => {
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (vw <= 0 || vh <= 0) return null;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return null;

      // PASS 1: Scaled full frame (Optimal max dimension: 420px for sub-12ms decode)
      const maxDim = 420;
      const scale1 = Math.min(1, maxDim / Math.max(vw, vh));
      const sw1 = Math.round(vw * scale1);
      const sh1 = Math.round(vh * scale1);

      if (canvas.width !== sw1) canvas.width = sw1;
      if (canvas.height !== sh1) canvas.height = sh1;

      ctx.drawImage(video, 0, 0, sw1, sh1);
      let imgData = ctx.getImageData(0, 0, sw1, sh1);
      let code = jsQR(imgData.data, sw1, sh1, {
        inversionAttempts: invertCheck ? "attemptBoth" : "dontInvert",
      });

      if (code && code.data && code.data.trim()) {
        const kx = vw / sw1;
        const ky = vh / sh1;
        return {
          value: code.data.trim(),
          points: [
            code.location.topLeftCorner,
            code.location.topRightCorner,
            code.location.bottomRightCorner,
            code.location.bottomLeftCorner,
          ].map((p) => ({ x: p.x * kx, y: p.y * ky })),
        };
      }

      // PASS 2: Center crop (Center 65% of camera view scaled to 340x340)
      const cropSize = Math.round(Math.min(vw, vh) * 0.65);
      const cropX = Math.round((vw - cropSize) / 2);
      const cropY = Math.round((vh - cropSize) / 2);
      const targetDim = 340;

      if (canvas.width !== targetDim) canvas.width = targetDim;
      if (canvas.height !== targetDim) canvas.height = targetDim;

      ctx.drawImage(video, cropX, cropY, cropSize, cropSize, 0, 0, targetDim, targetDim);
      imgData = ctx.getImageData(0, 0, targetDim, targetDim);
      code = jsQR(imgData.data, targetDim, targetDim, {
        inversionAttempts: "dontInvert",
      });

      if (code && code.data && code.data.trim()) {
        const k = cropSize / targetDim;
        return {
          value: code.data.trim(),
          points: [
            code.location.topLeftCorner,
            code.location.topRightCorner,
            code.location.bottomRightCorner,
            code.location.bottomLeftCorner,
          ].map((p) => ({ x: cropX + p.x * k, y: cropY + p.y * k })),
        };
      }

      return null;
    };

    const processFrame = async () => {
      if (cancelled || isLocked) return;
      const video = videoRef.current;
      const overlay = overlayCanvasRef.current;
      const offCanvas = offscreenCanvasRef.current || document.createElement("canvas");

      try {
        if (video && overlay && video.readyState >= 2 && video.videoWidth > 0) {
          // Adjust overlay resolution safely without unnecessary context wipes
          if (Math.abs(overlay.width - video.clientWidth) > 2 || Math.abs(overlay.height - video.clientHeight) > 2) {
            overlay.width = video.clientWidth;
            overlay.height = video.clientHeight;
          }

          const now = performance.now();
          // Scan cadence: ~70ms (up to ~14 frames per second)
          if (now - lastScanTime >= 70) {
            lastScanTime = now;
            frameCount++;
            const vw = video.videoWidth;
            const vh = video.videoHeight;
            const scaleX = overlay.width / vw;
            const scaleY = overlay.height / vh;
            let result: { value: string; points: { x: number; y: number }[] } | null = null;

            // 1. Native BarcodeDetector (if available in browser)
            if (nativeDetector) {
              try {
                const barcodes = await nativeDetector.detect(video);
                const raw = barcodes?.[0]?.rawValue?.trim();
                if (raw) {
                  result = { value: raw, points: barcodes[0].cornerPoints || [] };
                }
              } catch {
                nativeDetector = null;
              }
            }

            // 2. High-performance jsQR multi-tier scan
            if (!result && !cancelled) {
              const invertCheck = frameCount % 5 === 0;
              result = scanVideoFrame(video, offCanvas, invertCheck);
            }

            if (result && !cancelled) {
              drawTrackingBox(result.points, scaleX, scaleY);
              handleSuccessfulScan(result.value);
              return;
            }
          }
        }
      } catch (err) {
        console.warn("QR frame error:", err);
      }

      if (!cancelled && !isLocked) {
        animId = requestAnimationFrame(processFrame);
      }
    };

    animId = requestAnimationFrame(processFrame);

    return () => {
      cancelled = true;
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isCameraActive, stopCamera]);

  // Decode QR from uploaded image or taken photo
  const handleImageFile = (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = offscreenCanvasRef.current || document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = img.width;
        let h = img.height;
        if (w > 1200 || h > 1200) {
          const maxDim = 1200;
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
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
            triggerSuccessFeedback();
            setDetectedToken(rawValue);
            stopCamera();
            onScanRef.current(rawValue);
          } else {
            setCameraError("No se detectó código QR en la imagen. Intenta con mejor iluminación o más cerca.");
          }
        } catch {
          setCameraError("Error al procesar la imagen.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div className="w-full space-y-3">
      {/* Hidden file input for gallery upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleImageFile(f);
          e.target.value = "";
        }}
        className="hidden"
      />

      {/* Hidden input for direct native camera photo snap (Double fail-safe) */}
      <input
        type="file"
        ref={photoInputRef}
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleImageFile(f);
          e.target.value = "";
        }}
        className="hidden"
      />

      {/* Camera Viewport with Responsive Aspect Ratio */}
      <div className="relative w-full aspect-[4/3] sm:aspect-video max-h-80 bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-lg flex items-center justify-center">
        {/* Live Camera Video Stream */}
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isCameraActive ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Real-time Tracking Box Overlay */}
        <canvas
          ref={overlayCanvasRef}
          className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${
            isCameraActive ? "block" : "hidden"
          }`}
        />

        {/* Target Reticle Viewfinder (Visual Target Overlay) */}
        {isCameraActive && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
            {/* Darkened vignette around target */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />

              {/* Animated Laser Scanning Line */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34d399] animate-pulse" />

              {/* Center subtle crosshair */}
              <div className="w-3 h-3 border border-emerald-400/40 rounded-full" />
            </div>

            <p className="mt-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-[11px] font-semibold text-emerald-300 tracking-wide shadow-md">
              Apunta al código QR dentro del recuadro
            </p>
          </div>
        )}

        {/* Active Scan Indicator Pill */}
        {isCameraActive && (
          <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              En vivo • Cierre automático
            </span>
          </div>
        )}

        {/* Camera Off / Success State */}
        {!isCameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-900 text-slate-300 space-y-3 z-30">
            {detectedToken ? (
              /* Success Card after QR scan */
              <div className="space-y-3 flex flex-col items-center animate-in fade-in zoom-in-95">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl">
                  <Check className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white">¡Pase QR Validado Exitosamente!</p>
                  <p className="text-xs font-mono text-emerald-300 mt-1 truncate max-w-xs bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 select-all">
                    {detectedToken}
                  </p>
                  <p className="text-[10px] text-emerald-400 mt-1.5 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Cámara cerrada para ahorro de batería
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDetectedToken(null);
                    startCamera();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 touch-target"
                >
                  <Camera className="w-4 h-4" />
                  <span>Escanear Siguiente Pase</span>
                </button>
              </div>
            ) : (
              /* Idle / Error State */
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
                  <p className="text-xs text-slate-400 max-w-xs">
                    Presiona &ldquo;Activar Cámara&rdquo; o &ldquo;Tomar Foto&rdquo; para validar el ingreso del docente.
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 touch-target"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Activar Cámara</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5"
                    title="Tomar foto con la cámara nativa de tu teléfono"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tomar Foto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>Subir Captura</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Control Toolbar */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          {isCameraActive ? (
            <button
              type="button"
              onClick={stopCamera}
              className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5 touch-target"
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
              className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5 touch-target"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{detectedToken ? "Nuevo Escaneo" : "Activar Cámara"}</span>
            </button>
          )}

          {/* Flashlight / Torch toggle */}
          {hasTorch && isCameraActive && (
            <button
              type="button"
              onClick={toggleTorch}
              className={`p-2 rounded-xl text-xs font-medium transition-colors border ${
                isTorchOn
                  ? "bg-amber-400 text-slate-950 border-amber-500 shadow-md"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300"
              }`}
              title={isTorchOn ? "Apagar linterna" : "Encender linterna"}
            >
              {isTorchOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
            </button>
          )}

          {/* Switch Camera */}
          {hasMultipleCameras && isCameraActive && (
            <button
              type="button"
              onClick={toggleCameraFacing}
              className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Cambiar entre cámara trasera y delantera"
            >
              <SwitchCamera className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">
                {facingMode === "environment" ? "Trasera" : "Frontal"}
              </span>
            </button>
          )}
        </div>

        {/* Double Contingency Buttons */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Tomar foto con la cámara nativa"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Tomar</span> Foto
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Subir captura o foto del pase QR"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Subir</span> Captura
          </button>
        </div>
      </div>
    </div>
  );
};
