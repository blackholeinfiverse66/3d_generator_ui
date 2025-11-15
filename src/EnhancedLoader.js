import React from 'react';
import './EnhancedLoader.css';

const EnhancedLoader = ({ message = "Generating your 3D design...", progress = null }) => {
  return (
    <div className="enhanced-loader">
      <div className="loader-container">
        <div className="loader-ring">
          <div className="loader-ring-inner"></div>
          <div className="loader-ring-middle"></div>
          <div className="loader-ring-outer"></div>
        </div>
        <div className="loader-core">
          <div className="loader-spark"></div>
          <div className="loader-spark"></div>
          <div className="loader-spark"></div>
        </div>
      </div>
      
      <div className="loader-text">
        <h3>{message}</h3>
        {progress !== null && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        )}
        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoader;