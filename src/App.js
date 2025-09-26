import React, { useState } from 'react';
import ThreeDViewer from './ThreeDViewer';
import InteractiveCubeBackground from './InteractiveCubeBackground';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [jsonSpec, setJsonSpec] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOutputs, setShowOutputs] = useState(false);
  const [showNav, setShowNav] = useState(false);

  const handleGenerateClick = async () => {
    setIsLoading(true);
    setError(null);
    setShowOutputs(false);

    try {
      const response = await fetch('http://localhost:3001/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setJsonSpec(data);
      setShowOutputs(true);
    } catch (error) {
      setError('Failed to fetch design spec. Is the backend server running?');
      setShowOutputs(false);
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !isLoading) {
        handleGenerateClick();
      }
    }
  };

  const resetToHome = () => {
    setPrompt('');
    setJsonSpec(null);
    setIsLoading(false);
    setError(null);
    setShowOutputs(false);
    setShowNav(false);
  };

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  return (
    <div className="App">
      <InteractiveCubeBackground />

      {/* Navigation Button */}
      <button className={`nav-toggle ${showNav ? 'nav-open' : ''}`} onClick={toggleNav} aria-label="Toggle navigation">
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Navigation Sidebar */}
      <nav className={`nav-sidebar ${showNav ? 'nav-open' : ''}`}>
        <div className="nav-content">
          <ul>
            <li><button onClick={resetToHome}>Home</button></li>
            <li><button onClick={() => setShowNav(false)}>About</button></li>
            <li><button onClick={() => setShowNav(false)}>Help</button></li>
          </ul>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {showNav && <div className="nav-overlay" onClick={toggleNav}></div>}

      <main className={showOutputs ? "container results" : "container centered"}>
        <h1 className={showOutputs ? "title-results clickable" : ""} onClick={showOutputs ? resetToHome : undefined}>3D Design Generator</h1>

        <div className={`input-section ${showOutputs ? "input-results" : ""}`}>
          <textarea
            value={prompt}
            onChange={handlePromptChange}
            onKeyPress={handleKeyPress}
            placeholder="e.g., A modern, minimalist wooden chair"
            rows="1"
          />
          <button title="Generate" onClick={handleGenerateClick} disabled={isLoading || !prompt}>
            {isLoading ? (
              <svg className="spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            )}
          </button>
        </div>

        {!showOutputs && <p className="tagline">Bring your wildest 3D ideas to life.</p>}

        {showOutputs && (
          <div className="output-section">
            <div className="preview-area">
              <h2>3D Preview</h2>
              <div className="preview-canvas-container">
                <ThreeDViewer />
              </div>
            </div>
            <div className="json-viewer">
              <h2>Generated JSON Specification</h2>
              {error && <pre className="error-message">{error}</pre>}
              {jsonSpec && (
                <pre>{JSON.stringify(jsonSpec, null, 2)}</pre>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;