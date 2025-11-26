import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Props {
  onCapture: (imageSrc: string) => void;
  onBack: () => void;
}

export const CameraScreen: React.FC<Props> = ({ onCapture, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMounted = useRef<boolean>(false);
  // To prevent infinite retry loops
  const retryAttempted = useRef<boolean>(false);
  
  const [error, setError] = useState<string>('');
  const [isFlashing, setIsFlashing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // robust cleanup function
  const stopCamera = useCallback(() => {
    // 1. Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
      });
      streamRef.current = null;
    }
    // 2. Clear the video source to release the hardware connection
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const initCamera = useCallback(async (isRetry = false) => {
    // Prevent execution if unmounted
    if (!isMounted.current) return;
    
    setIsLoading(true);
    setError('');
    
    // Ensure previous streams are completely killed before starting a new one
    stopCamera();

    // Small delay to ensure OS releases the camera hardware
    if (isRetry) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!isMounted.current) return;
    }

    // Check environment support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Tu navegador no soporta acceso a la cámara.");
      setIsLoading(false);
      return;
    }

    try {
      // Logic: 
      // First attempt: Ideal resolution for best analysis.
      // Retry attempt: Basic connection to ensure it works at all.
      const constraints: MediaStreamConstraints = isRetry 
        ? { video: true, audio: false } // Absolute fallback
        : { 
            video: { 
                facingMode: 'user', // Selfie camera
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }, 
            audio: false 
          };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // If unmounted during the async request, clean up immediately
      if (!isMounted.current) {
          stream.getTracks().forEach(track => track.stop());
          return;
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to actually be ready
        videoRef.current.onloadedmetadata = () => {
             if (isMounted.current && videoRef.current) {
                 videoRef.current.play()
                    .then(() => setIsLoading(false))
                    .catch(e => {
                        console.error("Play error:", e);
                        // If play fails, it might be an autoplay policy or minor glitch.
                        // We still consider it loaded if the stream is active.
                        setIsLoading(false); 
                    });
             }
        };
      } else {
        setIsLoading(false);
      }

    } catch (err: any) {
      console.error("Camera init failed:", err);
      
      if (!isMounted.current) return;

      // Handle specific error types
      if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          // This usually means the camera is in use by another app or "locked".
          // We try once more with a delay.
          if (!retryAttempted.current) {
              console.log("Hardware locked. Retrying...");
              retryAttempted.current = true;
              initCamera(true); // Retry with delay and basic constraints
              return;
          }
      }

      // If it wasn't a lock error, or we already retried:
      if (!retryAttempted.current && !isRetry) {
          retryAttempted.current = true;
          console.log("Standard fallback retry...");
          initCamera(true);
          return;
      }

      // Final Error Messaging
      let msg = "No se pudo iniciar la cámara.";
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = "Permiso denegado. Por favor permite el acceso en la configuración de tu navegador.";
      } else if (err.name === 'NotFoundError') {
        msg = "No se encontró ninguna cámara en este dispositivo.";
      } else if (err.name === 'NotReadableError') {
        msg = "La cámara parece estar bloqueada. Cierra otras apps que usen la cámara y reinicia.";
      }
      
      setError(msg);
      setIsLoading(false);
    }
  }, [stopCamera]);

  useEffect(() => {
    isMounted.current = true;
    retryAttempted.current = false;
    
    // Initial start
    initCamera();

    return () => {
      isMounted.current = false;
      stopCamera();
    };
  }, [initCamera, stopCamera]);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current && !isLoading && !error) {
        setIsFlashing(true);
        
        // Short delay to capture frame
        setTimeout(() => {
            if (!isMounted.current || !videoRef.current || !canvasRef.current) return;
            
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
      
            if (context) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              
              // Mirror effect for selfie cam
              context.translate(canvas.width, 0);
              context.scale(-1, 1);
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
              const imageSrc = canvas.toDataURL('image/jpeg', 0.85);
              
              // Important: Stop camera immediately after capture to release resources
              stopCamera(); 
              
              onCapture(imageSrc);
            }
            setIsFlashing(false);
        }, 100);
    }
  }, [isLoading, error, onCapture, stopCamera]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        stopCamera();
        onCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden bg-white">
      {/* Video Feed */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
        {!error && (
            <video 
                ref={videoRef} 
                playsInline 
                muted 
                autoPlay
                className={`h-full w-full object-cover transform -scale-x-100 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`} 
            />
        )}
        
        {/* Loading Spinner - White Background */}
        {isLoading && !error && (
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 text-gray-900 bg-white z-10">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="font-medium">Iniciando cámara...</p>
            </div>
        )}

        {/* Error State - White Background */}
        {error && (
           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-white">
             <div className="rounded-full bg-red-100 p-6 mb-6">
                <span className="material-symbols-outlined text-5xl text-red-500">videocam_off</span>
             </div>
             <h3 className="text-gray-900 font-bold text-xl mb-2">Problemas de acceso</h3>
             <p className="text-gray-500 text-sm mb-8 max-w-xs">{error}</p>
             
             <div className="flex flex-col gap-3 w-full max-w-xs">
                <button 
                    onClick={() => {
                        retryAttempted.current = false;
                        initCamera(true);
                    }}
                    className="w-full bg-gray-100 text-gray-900 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">refresh</span>
                    Reintentar
                </button>
                <label className="w-full bg-white text-gray-900 font-bold py-3 px-6 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">image</span>
                    Subir foto
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
             </div>
           </div>
        )}
      </div>

      {/* Flash Effect */}
      {isFlashing && <div className="absolute inset-0 z-50 bg-white animate-flash pointer-events-none"></div>}

      {/* HUD UI Overlay - Hide when error or loading */}
      {!error && !isLoading && (
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-4 sm:p-6 pointer-events-none">
            
            {/* Top Bar */}
            <header className="flex items-center justify-between pt-2 pointer-events-auto">
                <button onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors">
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>
                
                <div className="flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm text-white backdrop-blur-md border border-white/10">
                    <span className="material-symbols-outlined text-base text-cyan-light filled">lightbulb</span>
                    <span className="font-bold leading-tight tracking-wide">Buena Luz</span>
                </div>
                
                <div className="h-10 w-10 shrink-0"></div>
            </header>

            {/* Central Guide */}
            <main className="flex flex-1 flex-col items-center justify-center">
                <h3 className="text-white text-shadow-sm tracking-wide text-2xl font-bold mb-8 text-center drop-shadow-md">
                    Centra tu rostro
                </h3>
                
                {/* Oval Guide */}
                <div className="relative w-full max-w-[85%] aspect-[3/4] rounded-[50%] border-2 border-white/30 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="absolute inset-0 border-4 border-dashed border-white/20 rounded-[50%]"></div>
                    {/* Corner Markers */}
                    <div className="absolute top-10 left-10 w-4 h-4 border-t-2 border-l-2 border-cyan-light/50 rounded-tl-lg"></div>
                    <div className="absolute top-10 right-10 w-4 h-4 border-t-2 border-r-2 border-cyan-light/50 rounded-tr-lg"></div>
                    <div className="absolute bottom-10 left-10 w-4 h-4 border-b-2 border-l-2 border-cyan-light/50 rounded-bl-lg"></div>
                    <div className="absolute bottom-10 right-10 w-4 h-4 border-b-2 border-r-2 border-cyan-light/50 rounded-br-lg"></div>
                </div>
            </main>

            {/* Bottom Controls */}
            <footer className="flex items-center justify-center pb-8 pt-4 pointer-events-auto">
                <div className="relative flex items-center justify-center size-24">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                    <button 
                        onClick={handleCapture}
                        className="group relative flex shrink-0 items-center justify-center rounded-full size-20 bg-white/90 hover:bg-white transition-all active:scale-95"
                        aria-label="Tomar foto"
                    >
                        <div className="w-16 h-16 rounded-full border-2 border-black/10 bg-transparent"></div>
                    </button>
                </div>
                
                {/* Gallery Upload Alternative (Small button) */}
                <label className="absolute right-6 bottom-14 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors">
                    <span className="material-symbols-outlined text-2xl">photo_library</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
            </footer>
        </div>
      )}
      
      {/* Fallback Close Button for Error State */}
      {(error || isLoading) && (
         <div className="absolute top-6 left-6 z-30">
            <button onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors">
                <span className="material-symbols-outlined text-2xl">close</span>
            </button>
         </div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};