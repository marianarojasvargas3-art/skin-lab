export enum ScreenState {
  WELCOME = 'WELCOME',
  PREPARATION = 'PREPARATION',
  CAMERA = 'CAMERA',
  ANALYSIS = 'ANALYSIS',
  DASHBOARD = 'DASHBOARD'
}

export interface SkinCondition {
  name: string;
  severity: 'Leve' | 'Moderada' | 'Severa';
  color: string; // Hex code for UI chips
  icon: string; // Material symbol name
  description: string;
  recommendation: string;
  box_2d?: number[]; // [ymin, xmin, ymax, xmax] scaled 0-1000
}

export interface AnalysisResult {
  date: string;
  healthScore: number;
  issuesCount: number;
  conditions: SkinCondition[];
  imageUrl: string;
}

export const MOCK_RESULT: AnalysisResult = {
  date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
  healthScore: 85,
  issuesCount: 3,
  conditions: [
    { 
      name: 'Acné Comedonal', 
      severity: 'Leve', 
      color: '#ef4444', 
      icon: 'grain',
      description: 'Presencia de pequeños puntos blancos y negros causados por la obstrucción de los poros.',
      recommendation: 'Utiliza limpiadores con ácido salicílico.',
      box_2d: [350, 550, 450, 650] // Mock coordinates (cheek area)
    },
    { 
      name: 'Rosácea', 
      severity: 'Moderada', 
      color: '#facc15', 
      icon: 'flare',
      description: 'Enrojecimiento visible en las mejillas con pequeños vasos sanguíneos dilatados.',
      recommendation: 'Aplica productos calmantes con niacinamida.',
      box_2d: [450, 300, 600, 700] // Mock coordinates (nose/cheeks)
    },
    { 
      name: 'Hiperpigmentación', 
      severity: 'Leve', 
      color: '#fb923c', 
      icon: 'blur_on',
      description: 'Manchas oscuras localizadas producidas por un exceso de melanina.',
      recommendation: 'Incorpora sérums con Vitamina C.',
      box_2d: [250, 250, 350, 350] // Mock coordinates (forehead)
    }
  ],
  imageUrl: ''
};