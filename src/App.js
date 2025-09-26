import React, { useState, useEffect, useCallback } from 'react';
import ThreeDViewer from './ThreeDViewer';
import InteractiveCubeBackground from './InteractiveCubeBackground';
import ErrorBoundary from './ErrorBoundary';
import LoadingSkeleton from './LoadingSkeleton';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [jsonSpec, setJsonSpec] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOutputs, setShowOutputs] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [showNav, setShowNav] = useState(false);

  const handleSaveDesign = useCallback(() => {
    if (!jsonSpec) return;

    const design = {
      id: Date.now(),
      prompt,
      spec: jsonSpec,
      timestamp: new Date().toISOString()
    };

    const updatedDesigns = [...savedDesigns, design];
    setSavedDesigns(updatedDesigns);
    localStorage.setItem('savedDesigns', JSON.stringify(updatedDesigns));

    // Show success feedback
    console.log('Design saved successfully!');
  }, [jsonSpec, prompt, savedDesigns]);

  const handleReset = useCallback(() => {
    setPrompt('');
    setJsonSpec(null);
    setError(null);
    setShowOutputs(false);
  }, []);

  const toggleNav = useCallback(() => {
    setShowNav(!showNav);
  }, [showNav]);

  const handleGenerateClick = useCallback(async () => {
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
  }, [prompt]);

  // Load saved designs on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedDesigns');
    if (saved) {
      try {
        setSavedDesigns(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved designs:', e);
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+Enter to generate
      if (event.ctrlKey && event.key === 'Enter' && prompt.trim() && !isLoading) {
        event.preventDefault();
        handleGenerateClick();
      }

      // Ctrl+S to save current design
      if (event.ctrlKey && event.key === 's' && jsonSpec) {
        event.preventDefault();
        handleSaveDesign();
      }

      // Ctrl+Z to clear/reset
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        handleReset();
      }

      // Escape to close navigation
      if (event.key === 'Escape') {
        const navSidebar = document.querySelector('.nav-sidebar');
        if (navSidebar && navSidebar.classList.contains('nav-open')) {
          toggleNav();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [prompt, isLoading, jsonSpec, handleGenerateClick, handleReset, handleSaveDesign, toggleNav]);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleExportDesign = useCallback(() => {
    if (!jsonSpec) return;

    const dataStr = JSON.stringify(jsonSpec, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `design-${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [jsonSpec]);

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


  return (
    <ErrorBoundary>
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

          {isLoading ? (
            <LoadingSkeleton type="input" />
          ) : (
            <div className={`input-section ${showOutputs ? "input-results" : ""}`}>
              <textarea
                value={prompt}
                onChange={handlePromptChange}
                onKeyPress={handleKeyPress}
                placeholder="e.g., A modern, minimalist wooden chair"
                rows="1"
              />
              <button title="Generate (Ctrl+Enter)" onClick={handleGenerateClick} disabled={isLoading || !prompt}>
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
          )}

          {!showOutputs && !isLoading && <p className="tagline">Bring your wildest 3D ideas to life.</p>}

          {showOutputs && (
            <div className="output-section">
              <div className="preview-area">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2>3D Preview</h2>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleSaveDesign}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                      title="Save Design (Ctrl+S)"
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={handleExportDesign}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                      title="Export JSON"
                    >
                      📥 Export
                    </button>
                  </div>
                </div>
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

          {isLoading && showOutputs && (
            <div className="output-section">
              <LoadingSkeleton type="results" />
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;