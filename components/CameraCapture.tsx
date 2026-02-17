
import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, X, Check } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setError(null);
      }
    } catch (err) {
      setError("No se pudo acceder a la cámara. Por favor verifica los permisos.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-4xl aspect-[3/4] md:aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
        {!capturedImage ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            {/* Guide Overlay */}
            <div className="absolute inset-0 border-[2px] border-white/30 m-8 rounded-lg pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500"></div>
            </div>
          </>
        ) : (
          <img src={capturedImage} className="w-full h-full object-contain" alt="Captured score" />
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-8 text-center">
            <p className="text-white font-medium">{error}</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-6 items-center">
        {!capturedImage ? (
          <>
            <button 
              onClick={onClose}
              className="p-4 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
            >
              <X size={24} />
            </button>
            <button 
              onClick={captureFrame}
              className="p-6 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition-all transform active:scale-95"
            >
              <Camera size={32} />
            </button>
            <div className="w-14"></div>
          </>
        ) : (
          <>
            <button 
              onClick={handleRetake}
              className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors"
            >
              <RefreshCw size={20} />
              Reintentar
            </button>
            <button 
              onClick={handleConfirm}
              className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-500 shadow-lg shadow-green-500/20 transition-all transform active:scale-95"
            >
              <Check size={20} />
              Usar Foto
            </button>
          </>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
