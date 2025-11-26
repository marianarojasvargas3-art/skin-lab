import React from 'react';

interface Props {
  onContinue: () => void;
}

export const PreparationScreen: React.FC<Props> = ({ onContinue }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 p-6 justify-between animate-fade-in font-sans">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-gray-900 uppercase tracking-wide">Prepárate para una foto nítida</h1>
          <p className="text-gray-500 text-sm sm:text-base font-medium tracking-wide">
            Una foto de buena calidad es esencial para un análisis preciso.
          </p>
        </div>

        <div className="grid w-full gap-4">
          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl">face</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Retira el cabello</h2>
              <p className="text-xs text-gray-500 font-medium">Tu rostro debe estar despejado.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl">light_mode</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Busca buena luz</h2>
              <p className="text-xs text-gray-500 font-medium">La luz natural funciona mejor.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl">photo_camera</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Limpia el lente</h2>
              <p className="text-xs text-gray-500 font-medium">Asegúrate de que la cámara esté limpia.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto pt-6 pb-4">
        <button 
          onClick={onContinue}
          className="flex h-14 w-full cursor-pointer items-center justify-center rounded-xl bg-primary text-white text-base sm:text-lg font-bold shadow-lg shadow-primary/25 transition-all hover:bg-[#a68545] active:scale-95 uppercase tracking-wider"
        >
          Permitir acceso a la cámara
        </button>
        <p className="text-gray-400 text-xs font-bold text-center mt-5 underline cursor-pointer hover:text-primary transition-colors tracking-widest uppercase">
          ¿Por qué es necesario?
        </p>
      </div>
    </div>
  );
};