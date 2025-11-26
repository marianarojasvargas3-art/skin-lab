import React, { useRef } from 'react';
import { AnalysisResult } from '../types';

interface Props {
  result: AnalysisResult;
  onRestart: () => void;
}

export const DashboardScreen: React.FC<Props> = ({ result, onRestart }) => {
  // Refs to scroll to specific condition cards when tapping the image box
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToCondition = (index: number) => {
    const el = cardRefs.current[index];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-primary');
      setTimeout(() => el.classList.remove('ring-2', 'ring-primary'), 1000);
    }
  };
  
  // Helper to convert 0-1000 scale to percentage
  const getStyleFromBox = (box?: number[]) => {
    if (!box || box.length !== 4) return { display: 'none' };
    const [ymin, xmin, ymax, xmax] = box;
    return {
      top: `${ymin / 10}%`,
      left: `${xmin / 10}%`,
      height: `${(ymax - ymin) / 10}%`,
      width: `${(xmax - xmin) / 10}%`,
    };
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-gray-50 text-gray-900 overflow-y-auto font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/95 backdrop-blur-lg p-4 shadow-sm border-b border-gray-200">
        <button onClick={onRestart} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700 hover:bg-black/5 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-sm font-bold leading-tight flex-1 text-center text-gray-900 uppercase tracking-widest">Diagnóstico Facial</h1>
        <div className="h-10 w-10 shrink-0"></div>
      </header>

      <main className="flex flex-col gap-6 p-5 pb-10">
        
        {/* User Image with Interactive Overlays */}
        <section className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-gray-200 shadow-xl bg-white mx-auto max-w-sm">
             {/* The actual user image */}
             <img 
                src={result.imageUrl} 
                alt="Rostro Analizado" 
                className="w-full h-full object-cover" 
             />
             
             {/* Tech Grid Overlay effect for "scanning" vibe */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

             {/* Dynamic Overlays for detected issues */}
             {result.conditions.map((condition, idx) => {
               if (!condition.box_2d) return null;
               
               return (
                 <button
                    key={idx}
                    onClick={() => scrollToCondition(idx)}
                    className="absolute rounded-lg transition-all duration-300 cursor-pointer group"
                    style={{
                      ...getStyleFromBox(condition.box_2d),
                      borderColor: condition.color,
                      borderWidth: '2px',
                      backgroundColor: `${condition.color}15`, 
                      boxShadow: `0 0 10px ${condition.color}30`
                    }}
                 >
                    {/* Pulsing corner markers */}
                    <div className="absolute top-0 left-0 w-1 h-1 bg-white opacity-80 shadow-sm"></div>
                    <div className="absolute bottom-0 right-0 w-1 h-1 bg-white opacity-80 shadow-sm"></div>

                    {/* Label that appears on the image */}
                    <div 
                      className="absolute -top-6 left-0 px-2 py-0.5 rounded-sm text-[9px] font-bold text-black whitespace-nowrap shadow-sm backdrop-blur-md flex items-center gap-1 border border-white/20 uppercase tracking-wider"
                      style={{ backgroundColor: condition.color }}
                    >
                      <span>{condition.name}</span>
                    </div>
                 </button>
               );
             })}
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-3">
          <div className="flex flex-col justify-center items-center gap-1 rounded-xl bg-white p-5 border border-gray-100 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Puntuación</span>
            <div className="flex items-baseline gap-1">
                <p className="text-4xl font-bold text-primary">{result.healthScore}</p>
                <span className="text-xs font-bold text-gray-300">/100</span>
            </div>
          </div>
          
          <div className="flex flex-col justify-center items-center gap-1 rounded-xl bg-white p-5 border border-gray-100 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hallazgos</span>
            <p className="text-4xl font-bold text-gray-900">{result.issuesCount}</p>
          </div>
        </section>

        {/* Detailed Findings List */}
        <section className="flex flex-col gap-5 pt-2">
          <div className="flex items-center gap-2 mb-1 pl-1">
             <span className="material-symbols-outlined text-primary text-xl">dermatology</span>
             <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Análisis Detallado</h3>
          </div>
          
          {result.conditions.map((condition, index) => (
              <div 
                key={index}
                ref={(el) => { if (el) cardRefs.current[index] = el; }}
                className="flex flex-col gap-0 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Header Condition */}
                <div className="p-5 pb-3 flex items-start justify-between">
                   <div className="flex items-center gap-3">
                      <div 
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${condition.color}15`, color: condition.color }}
                      >
                        <span className="material-symbols-outlined text-xl">{condition.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base uppercase tracking-wide leading-tight">{condition.name}</h4>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Severidad: <span style={{ color: condition.color }}>{condition.severity}</span></span>
                      </div>
                   </div>
                </div>

                {/* Description */}
                <div className="px-5 pb-4">
                    <p className="text-gray-600 text-sm leading-relaxed font-medium">
                        {condition.description}
                    </p>
                </div>

                {/* Recommendation Box - REFRESHED STYLE */}
                <div className="bg-gray-50 p-5 border-t border-gray-100 relative overflow-hidden">
                    <div className="flex gap-3 relative z-10">
                        <div className="shrink-0 mt-0.5">
                             <span className="material-symbols-outlined text-primary text-lg">hotel_class</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-[9px] font-extrabold text-primary uppercase tracking-widest mb-1.5">Recomendación</p>
                            <p className="text-sm text-gray-800 font-bold leading-relaxed">
                                {condition.recommendation}
                            </p>
                        </div>
                    </div>
                </div>
              </div>
          ))}

          {result.conditions.length === 0 && (
              <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50 text-primary">check_circle</span>
                  <p className="text-sm font-bold uppercase tracking-wide">¡Excelente!</p>
                  <p className="text-xs mt-1">Tu piel se ve radiante y saludable.</p>
              </div>
          )}
        </section>

        {/* Disclaimer */}
        <section className="mb-4 px-4 opacity-50">
            <p className="text-[9px] text-center leading-relaxed text-gray-500 uppercase tracking-wide">
                * Resultado generado por IA. Consulta a un dermatólogo.
            </p>
        </section>

        {/* Restart Action */}
         <button 
            onClick={onRestart}
            className="w-full rounded-xl bg-primary py-4 text-center font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-[#a68545] active:scale-95 uppercase tracking-widest text-sm"
        >
            Nuevo Análisis
        </button>
      </main>
    </div>
  );
};