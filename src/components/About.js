import React from 'react';

const About = () => {
  return (
    <div className="about-view">
      <div className="about-header-container">
        <div className="page-header">
          <h2>About 3D Design Generator</h2>
          <p className="page-subtitle">Transforming imagination into reality with AI-powered 3D design</p>
        </div>
      </div>
      
      <div className="about-content-container">
        <div className="content-grid four-columns">
        <div className="content-card">
          <h3>What is this?</h3>
          <p>
            A cutting-edge 3D design generation platform that transforms your ideas into 
            stunning 3D models using AI technology. Simply describe what you want, and 
            watch as your vision comes to life.
          </p>
        </div>

        <div className="content-card">
          <h3>Key Features</h3>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🤖</span>
              <span>AI-powered design generation from natural language</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👁️</span>
              <span>Real-time 3D preview with interactive controls</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎨</span>
              <span>Material switching and design iteration</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📦</span>
              <span>Export designs in multiple formats</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📚</span>
              <span>Design history and version tracking</span>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h3>Technology Stack</h3>
          <div className="tech-grid">
            <div className="tech-item">
              <strong>React 19</strong>
              <span>Modern hooks & components</span>
            </div>
            <div className="tech-item">
              <strong>Three.js</strong>
              <span>3D rendering engine</span>
            </div>
            <div className="tech-item">
              <strong>Express.js</strong>
              <span>Backend API server</span>
            </div>
            <div className="tech-item">
              <strong>WebGL</strong>
              <span>Hardware acceleration</span>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h3>Version Information</h3>
          <p>Beta v1.0.0 - Built for demonstration and testing</p>
          <p>This application showcases the potential of AI-driven 3D design generation with a focus on user experience and real-time interaction.</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default About;