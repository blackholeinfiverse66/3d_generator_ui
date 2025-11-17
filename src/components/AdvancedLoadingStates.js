import React, { useState, useEffect } from 'react';
import { SettingsIcon, CloseIcon } from './Icons';
import './AdvancedLoadingStates.css';

const LOADING_STAGES = [
  { text: 'Analyzing prompt...', duration: 2000 },
  { text: 'Generating 3D model...', duration: 3000 },
  { text: 'Applying materials...', duration: 2000 },
  { text: 'Finalizing design...', duration: 1500 }
];

const AdvancedLoadingStates = ({ isLoading, onCancel }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStage(0);
      setProgress(0);
      setTimeRemaining(0);
      return;
    }

    const totalDuration = LOADING_STAGES.reduce((sum, stage) => sum + stage.duration, 0);
    setTimeRemaining(Math.ceil(totalDuration / 1000));

    let currentTime = 0;
    let stageIndex = 0;
    
    const interval = setInterval(() => {
      currentTime += 100;
      
      // Update progress
      const overallProgress = (currentTime / totalDuration) * 100;
      setProgress(Math.min(overallProgress, 95));
      
      // Update time remaining
      setTimeRemaining(Math.max(0, Math.ceil((totalDuration - currentTime) / 1000)));
      
      // Update stage
      let accumulatedTime = 0;
      for (let i = 0; i < LOADING_STAGES.length; i++) {
        accumulatedTime += LOADING_STAGES[i].duration;
        if (currentTime <= accumulatedTime) {
          setCurrentStage(i);
          break;
        }
      }
      
      if (currentTime >= totalDuration) {
        clearInterval(interval);
        setProgress(100);
        setTimeRemaining(0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="advanced-loading-overlay">
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-core"><SettingsIcon size={24} /></div>
        </div>
        
        <div className="loading-content">
          <h3>Creating Your Design</h3>
          <p className="current-stage">{LOADING_STAGES[currentStage]?.text}</p>
          
          <div className="progress-container">
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="progress-text">
              {Math.round(progress)}% • {timeRemaining}s remaining
            </div>
          </div>
          
          <div className="stage-indicators">
            {LOADING_STAGES.map((_, index) => (
              <div 
                key={index}
                className={`stage-dot ${index <= currentStage ? 'active' : ''}`}
              />
            ))}
          </div>
          
          <button 
            className="cancel-btn"
            onClick={onCancel}
            aria-label="Cancel generation"
          >
            <CloseIcon size={16} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedLoadingStates;