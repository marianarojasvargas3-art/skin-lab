import React, { useEffect, useState } from 'react';
import { analyzeSkinImage } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface Props {
  imageSrc: string;
  onAnalysisComplete: (result: AnalysisResult) => void;
  onCancel: () => void;
}

export const AnalysisScreen: React.FC<Props> = ({ imageSrc, onAnalysisComplete, onCancel }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const performAnalysis = async () => {
      try {
        // Start progress simulation
        const interval = setInterval(() => {
          setProgress(prev => {
             if (prev >= 90) {
                 clearInterval(interval);
                 return 90;
             }
             return prev + 1; // Slow increment
          });
        }, 50);

        // Actual API call
        const result = await analyzeSkinImage(imageSrc);

        if (isMounted) {
            setProgress(100);
            // Brief delay to show 100%
            setTimeout(() => {
                onAnalysisComplete(result);
            }, 500);
        }
      } catch (error) {
        console.error("Error during analysis:", error);
        // In a real app, handle error state here
        onCancel(); 
      }
    };

    performAnalysis();

    return () => { isMounted = false; };
  }, [imageSrc, onAnalysisComplete, onCancel]);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col font-sans text-gray-900 bg-white overflow-hidden">
      
      {/* Cancel Button */}
      <div className="absolute top-4 right-4 z-20">
        <button onClick={onCancel} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/5 text-gray-900 backdrop-blur-sm transition-colors hover:bg-black/10">
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center z-10">
        <div className="relative flex w-full max-w-[320px] aspect-square items-center justify-center">
          
          {/* User Image Container */}
          <div className="relative aspect-square w-full overflow-hidden rounded-full border-4 border-primary/30 p-1 shadow-lg bg-white">
            <div 
                className="h-full w-full rounded-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${imageSrc})` }}
            ></div>
            
            {/* Scanning Line Animation */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-scan-line pointer-events-none">
                 <div className="h-0.5 w-full bg-primary shadow-[0_0_15px_2px_#BF9A54]"></div>
            </div>
            
             {/* Tech Grid Overlay */}
            <div className="absolute inset-0 rounded-full bg-[linear-gradient(rgba(191,154,84,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(191,154,84,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
          </div>

          {/* Floating Tags (Animated) */}
          <div className="absolute inset-0 pointer-events-none">
            <span className="absolute top-[20%] left-[5%] rounded-full bg-white px-3 py-1 text-[10px] font-bold text-primary shadow-md animate-pulse-slow border border-primary/20 uppercase tracking-widest" style={{ animationDelay: '0s' }}>
                Textura
            </span>
            <span className="absolute top-[55%] right-[-5%] rounded-full bg-white px-3 py-1 text-[10px] font-bold text-primary shadow-md animate-pulse-slow border border-primary/20 uppercase tracking-widest" style={{ animationDelay: '1s' }}>
                Tono
            </span>
            <span className="absolute bottom-[15%] left-[-10%] rounded-full bg-white px-3 py-1 text-[10px] font-bold text-primary shadow-md animate-pulse-slow border border-primary/20 uppercase tracking-widest" style={{ animationDelay: '0.5s' }}>
                Firmeza
            </span>
          </div>

        </div>

        <h2 className="mt-10 text-xl font-bold tracking-widest uppercase text-gray-900 animate-pulse">
            Mapeando piel...
        </h2>

        {/* Progress Bar */}
        <div className="mt-8 flex flex-col gap-3 w-full max-w-xs px-4">
          <div className="flex justify-between items-end">
             <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">Analizando</p>
             <p className="text-primary text-xs font-bold">{progress}%</p>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div 
                className="h-full rounded-full bg-primary transition-all duration-300 ease-out shadow-[0_0_10px_#BF9A54]" 
                style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </main>

      <footer className="flex flex-col items-center justify-center p-6 pt-0 z-10">
        <p className="text-center text-xs font-medium text-gray-400 mb-6 max-w-xs">
            La IA está comparando tu imagen con miles de perfiles dermatológicos.
        </p>
        <button 
            onClick={onCancel}
            className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-gray-900 transition-colors"
        >
          Cancelar
        </button>
      </footer>
    </div>
  );
};