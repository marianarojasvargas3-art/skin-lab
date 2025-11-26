import React from 'react';

interface Props {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="flex h-full min-h-screen w-full flex-col p-6 bg-white text-text-main relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none transform -translate-y-1/2"></div>

      <header className="flex-shrink-0 pt-12 z-10 flex flex-col items-center gap-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-widest text-gray-900 uppercase font-brand text-center leading-tight">
            L'ORÉAL <span className="block text-2xl sm:text-3xl mt-1">PARIS</span>
        </h1>
        <p className="text-center text-lg font-bold tracking-[0.2em] text-primary/80 font-brand-extended uppercase mt-3">
            Skin Lab AI
        </p>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center text-center z-10 gap-8">
        
        {/* Facial Recognition Graphic */}
        <div className="relative flex items-center justify-center w-64 h-64">
          {/* Ambient Gold Glow */}
          <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full"></div>
          
          {/* Face Icon */}
          <span className="material-symbols-outlined text-9xl text-gold relative z-10 opacity-90">
            face_retouching_natural
          </span>

          {/* Scanning Frame UI */}
          <div className="absolute inset-0 pointer-events-none">
             {/* Top Left Corner */}
             <div className="absolute top-6 left-8 w-8 h-8 border-t-[3px] border-l-[3px] border-gold rounded-tl-xl"></div>
             {/* Top Right Corner */}
             <div className="absolute top-6 right-8 w-8 h-8 border-t-[3px] border-r-[3px] border-gold rounded-tr-xl"></div>
             {/* Bottom Left Corner */}
             <div className="absolute bottom-6 left-8 w-8 h-8 border-b-[3px] border-l-[3px] border-gold rounded-bl-xl"></div>
             {/* Bottom Right Corner */}
             <div className="absolute bottom-6 right-8 w-8 h-8 border-b-[3px] border-r-[3px] border-gold rounded-br-xl"></div>
             
             {/* Animated Scan Line */}
             <div className="absolute left-10 right-10 top-1/2 h-[2px] bg-gold/80 shadow-[0_0_15px_2px_#BF9A54] animate-scan-line"></div>
          </div>
        </div>
        
        <div className="space-y-6 max-w-xs w-full flex flex-col items-center">
            <p className="text-gray-600 font-medium leading-relaxed font-brand-extended">
            Obtén un análisis instantáneo de tu piel utilizando nuestra avanzada Inteligencia Artificial.
            </p>
        </div>
      </main>

      <footer className="flex w-full flex-shrink-0 flex-col items-center pb-8 z-10">
        <div className="w-full max-w-sm">
          <button 
            onClick={onStart}
            className="group relative flex h-14 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gold px-5 text-lg font-bold text-white shadow-lg shadow-gold/30 transition-all hover:scale-[1.02] hover:shadow-gold/50 active:scale-95"
          >
            <span className="relative z-10 font-brand-extended tracking-wide uppercase">Comenzar Análisis</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          </button>
        </div>
      </footer>
    </div>
  );
};