import React, { useState, useEffect } from 'react';

const TransitionLoader = ({ isVisible, prompt, onComplete }) => {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  const stages = [
    { text: 'Analyzing your prompt...', duration: 800 },
    { text: 'Generating 3D structure...', duration: 1000 },
    { text: 'Applying materials and textures...', duration: 700 },
    { text: 'Finalizing design...', duration: 500 }
  ];

  useEffect(() => {
    if (!isVisible) {
      setStage(0);
      setProgress(0);
      return;
    }

    let currentStage = 0;
    let currentProgress = 0;
    const totalDuration = stages.reduce((sum, s) => sum + s.duration, 0);
    
    const progressInterval = setInterval(() => {
      currentProgress += 2;
      setProgress(Math.min(currentProgress, 100));
      
      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(onComplete, 200);
      }
    }, totalDuration / 50);

    const stageInterval = setInterval(() => {
      if (currentStage < stages.length - 1) {
        currentStage++;
        setStage(currentStage);
      } else {
        clearInterval(stageInterval);
      }
    }, totalDuration / stages.length);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="transition-loader">
      <div className="loader-content">
        <div className="loader-header">
          <h2>Creating Your Design</h2>
          <p className="prompt-display">"{prompt}"</p>
        </div>
        
        <div className="loader-animation">
          <div className="spinning-cube">
            <div className="cube-face front"></div>
            <div className="cube-face back"></div>
            <div className="cube-face right"></div>
            <div className="cube-face left"></div>
            <div className="cube-face top"></div>
            <div className="cube-face bottom"></div>
          </div>
        </div>
        
        <div className="loader-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="stage-text">{stages[stage]?.text}</p>
          <span className="progress-percent">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default TransitionLoader;