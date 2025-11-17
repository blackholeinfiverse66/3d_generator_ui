import React, { useState, useEffect } from 'react';
import { CloseIcon } from './Icons';
import './OnboardingTour.css';

const TOUR_STEPS = [
  {
    target: '.enhanced-input-container',
    title: 'Welcome to 3D Design Generator!',
    content: 'Start by describing your design idea here. Try typing something like "modern chair" or "glass table".',
    position: 'bottom'
  },
  {
    target: '.generate-arrow-btn',
    title: 'Generate Your Design',
    content: 'Click this arrow or press Enter to generate your 3D design from your description.',
    position: 'left'
  },
  {
    target: '.nav-toggle',
    title: 'Navigation Menu',
    content: 'Access your saved designs, settings, and help from this menu.',
    position: 'right'
  },
  {
    target: '.feature-chips',
    title: 'Key Features',
    content: 'Our AI-powered system provides real-time previews and export-ready designs.',
    position: 'top'
  }
];

const OnboardingTour = ({ isVisible, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isVisible) return;

    const updatePosition = () => {
      const step = TOUR_STEPS[currentStep];
      const target = document.querySelector(step.target);
      
      if (target) {
        const rect = target.getBoundingClientRect();
        const tooltipWidth = 320;
        const tooltipHeight = 150;
        
        let top, left;
        
        switch (step.position) {
          case 'bottom':
            top = rect.bottom + 10;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            break;
          case 'top':
            top = rect.top - tooltipHeight - 10;
            left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            break;
          case 'left':
            top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
            left = rect.left - tooltipWidth - 10;
            break;
          case 'right':
            top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
            left = rect.right + 10;
            break;
          default:
            top = rect.bottom + 10;
            left = rect.left;
        }
        
        // Keep tooltip within viewport
        top = Math.max(10, Math.min(top, window.innerHeight - tooltipHeight - 10));
        left = Math.max(10, Math.min(left, window.innerWidth - tooltipWidth - 10));
        
        setPosition({ top, left });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => window.removeEventListener('resize', updatePosition);
  }, [currentStep, isVisible]);

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onComplete();
  };

  if (!isVisible) return null;

  const currentTourStep = TOUR_STEPS[currentStep];

  return (
    <>
      <div className="tour-overlay" onClick={skipTour} />
      <div className="tour-spotlight" />
      <div 
        className="tour-tooltip"
        style={{ 
          top: position.top, 
          left: position.left 
        }}
      >
        <div className="tooltip-header">
          <h3>{currentTourStep.title}</h3>
          <button className="close-btn" onClick={skipTour}><CloseIcon size={16} /></button>
        </div>
        
        <div className="tooltip-content">
          <p>{currentTourStep.content}</p>
        </div>
        
        <div className="tooltip-footer">
          <div className="step-indicators">
            {TOUR_STEPS.map((_, index) => (
              <div 
                key={index}
                className={`step-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              />
            ))}
          </div>
          
          <div className="tour-actions">
            <button 
              className="tour-btn secondary"
              onClick={skipTour}
            >
              Skip Tour
            </button>
            {currentStep > 0 && (
              <button 
                className="tour-btn secondary"
                onClick={prevStep}
              >
                Back
              </button>
            )}
            <button 
              className="tour-btn primary"
              onClick={nextStep}
            >
              {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnboardingTour;