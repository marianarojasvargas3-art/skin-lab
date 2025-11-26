import React, { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PreparationScreen } from './components/PreparationScreen';
import { CameraScreen } from './components/CameraScreen';
import { AnalysisScreen } from './components/AnalysisScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ScreenState, AnalysisResult, MOCK_RESULT } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>(ScreenState.WELCOME);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const goTo = (screen: ScreenState) => setCurrentScreen(screen);

  const handleStart = () => goTo(ScreenState.PREPARATION);
  const handlePreparationContinue = () => goTo(ScreenState.CAMERA);
  const handleCameraBack = () => goTo(ScreenState.PREPARATION);
  
  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    goTo(ScreenState.ANALYSIS);
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    goTo(ScreenState.DASHBOARD);
  };

  const handleAnalysisCancel = () => {
      setCapturedImage('');
      goTo(ScreenState.CAMERA);
  };

  const handleRestart = () => {
      setCapturedImage('');
      setAnalysisResult(null);
      goTo(ScreenState.WELCOME);
  };

  return (
    <div className="mx-auto max-w-md h-screen w-full overflow-hidden bg-white shadow-2xl relative">
      {currentScreen === ScreenState.WELCOME && (
        <WelcomeScreen onStart={handleStart} />
      )}
      
      {currentScreen === ScreenState.PREPARATION && (
        <PreparationScreen onContinue={handlePreparationContinue} />
      )}

      {currentScreen === ScreenState.CAMERA && (
        <CameraScreen onCapture={handleCapture} onBack={handleCameraBack} />
      )}

      {currentScreen === ScreenState.ANALYSIS && (
        <AnalysisScreen 
            imageSrc={capturedImage} 
            onAnalysisComplete={handleAnalysisComplete}
            onCancel={handleAnalysisCancel}
        />
      )}

      {currentScreen === ScreenState.DASHBOARD && analysisResult && (
        <DashboardScreen result={analysisResult} onRestart={handleRestart} />
      )}
    </div>
  );
};

export default App;