import React, { useState, useEffect, useCallback, useRef } from 'react';
import ThreeDViewer from './ThreeDViewer';
import DonutBackground from './DonutBackground';
import AdvancedInputPill from './AdvancedInputPill';

import ErrorBoundary from './ErrorBoundary';
import LoadingSkeleton from './LoadingSkeleton';
import NotificationSystem, { useNotifications } from './NotificationSystem';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [jsonSpec, setJsonSpec] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOutputs, setShowOutputs] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [showNav, setShowNav] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showHUD, setShowHUD] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const textareaRef = useRef(null);
  const titleRef = useRef(null);
  const appRef = useRef(null);
  const { notifications, addNotification, removeNotification } = useNotifications();



  const handleSaveDesign = useCallback(() => {
    if (!jsonSpec) {
      addNotification({
        type: 'warning',
        title: 'No Design to Save',
        message: 'Please generate a design first before saving.',
        duration: 4000
      });
      return;
    }

    const design = {
      id: Date.now(),
      prompt,
      spec: jsonSpec,
      timestamp: new Date().toISOString()
    };

    try {
      const updatedDesigns = [...savedDesigns, design];
      setSavedDesigns(updatedDesigns);
      localStorage.setItem('savedDesigns', JSON.stringify(updatedDesigns));

      addNotification({
        type: 'success',
        title: 'Design Saved Successfully!',
        message: `"${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}" has been saved to your gallery.`,
        duration: 5000
      });
    } catch (err) {
      console.error('Failed to save design:', err);
      addNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Unable to save the design. Storage may be full.',
        duration: 5000
      });
    }
  }, [jsonSpec, prompt, savedDesigns, addNotification]);

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
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setShowOutputs(false);

    // Add a slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const response = await fetch('http://localhost:3001/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setJsonSpec(data);
      
      // Smooth transition to results
      setTimeout(() => {
        setShowOutputs(true);
      }, 300);
    } catch (error) {
      const errorMessage = 'Failed to generate design. Please check if the backend server is running.';
      setError(errorMessage);
      setShowOutputs(false);
      
      addNotification({
        type: 'error',
        title: 'Generation Failed',
        message: 'Unable to connect to the design service. Please try again.',
        duration: 6000
      });
      
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, addNotification]);

  // Load saved designs on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedDesigns');
    if (saved) {
      try {
        const designs = JSON.parse(saved);
        setSavedDesigns(designs);
      } catch (err) {
        console.error('Failed to load saved designs:', err);
        localStorage.removeItem('savedDesigns');
      }
    }
  }, []);

  const handleExportDesign = useCallback(() => {
    if (!jsonSpec) {
      addNotification({
        type: 'warning',
        title: 'No Design to Export',
        message: 'Please generate a design first before exporting.',
        duration: 4000
      });
      return;
    }

    try {
      const dataStr = JSON.stringify(jsonSpec, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `3d-design-${Date.now()}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      addNotification({
        type: 'success',
        title: 'Design Exported!',
        message: `File "${exportFileDefaultName}" has been downloaded.`,
        duration: 4000
      });
    } catch (err) {
      console.error('Export failed:', err);
      addNotification({
        type: 'error',
        title: 'Export Failed',
        message: 'Unable to export the design. Please try again.',
        duration: 5000
      });
    }
  }, [jsonSpec, addNotification]);

  const handleKeyDown = useCallback((event) => {
      if (event.ctrlKey && event.key === 'Enter' && prompt.trim() && !isLoading) {
        event.preventDefault();
        handleGenerateClick();
      }
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        handleSaveDesign();
      }
      if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        handleExportDesign();
      }
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        handleReset();
      }
      if (event.key === 'Escape' && showNav) {
        toggleNav();
      }
  }, [prompt, isLoading, showNav, handleGenerateClick, handleReset, handleSaveDesign, handleExportDesign, toggleNav]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handlePromptChange = useCallback((e) => {
    setPrompt(e.target.value);
    setIsTyping(true);
    
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    
    if (window.typingTimeout) {
      clearTimeout(window.typingTimeout);
    }
    window.typingTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  }, []);

  const handleInputFocus = useCallback(() => {
    setInputFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setInputFocused(false);
  }, []);

  useEffect(() => {
    return () => {
      if (window.typingTimeout) {
        clearTimeout(window.typingTimeout);
      }
    };
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !isLoading) {
        handleGenerateClick();
      }
    }
  }, [prompt, isLoading, handleGenerateClick]);

  const resetToHome = useCallback(() => {
    setPrompt('');
    setJsonSpec(null);
    setIsLoading(false);
    setError(null);
    setShowOutputs(false);
    setShowNav(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, []);

  const handleNavigation = useCallback((view) => {
    setShowNav(false);
    if (view === 'home') {
      resetToHome();
    }
  }, [resetToHome]);


  return (
    <ErrorBoundary>
      <div className="App" ref={appRef}>
        <DonutBackground config={{
          objectCount: 16,
          majorRadius: 120,
          minorRadius: 0,
          reducedMode: window.innerWidth < 768
        }} />
        
        {/* HUD Overlay */}
        <div className="hud-overlay" data-hud={showHUD ? 'on' : 'off'}>
          <div className="hud-element hud-reticle"></div>
          <div className="hud-element hud-grid"></div>
        </div>

        {/* Navigation Button */}
        <button 
          className={`nav-toggle ${showNav ? 'nav-open' : ''}`} 
          onClick={toggleNav} 
          aria-label="Toggle navigation"
          aria-expanded={showNav}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Sidebar */}
        <nav className={`nav-sidebar ${showNav ? 'nav-open' : ''}`} role="navigation">
          <div className="nav-content">
            <div className="nav-header">
              <h3>Design Studio</h3>
            </div>
            <ul role="list">
              <li><button onClick={() => handleNavigation('home')} aria-label="Go to Home">🏠 Home</button></li>
              <li><button onClick={() => handleNavigation('gallery')} aria-label="View Gallery">🎨 Gallery</button></li>
              <li><button onClick={() => handleNavigation('about')} aria-label="About Information">ℹ️ About</button></li>
              <li><button onClick={() => handleNavigation('help')} aria-label="Get Help">❓ Help</button></li>
            </ul>
            <div className="nav-footer">
              <div className="saved-count">
                {savedDesigns.length} Saved Design{savedDesigns.length === 1 ? '' : 's'}
              </div>
              <div className="keyboard-shortcuts">
                <small>Shortcuts: Ctrl+Enter (Generate), Ctrl+S (Save), Ctrl+E (Export)</small>
              </div>
              <button 
                onClick={() => setShowHUD(!showHUD)}
                className="hud-toggle"
                aria-label={`${showHUD ? 'Hide' : 'Show'} HUD elements`}
              >
                {showHUD ? '🔲' : '⬜'} HUD
              </button>
            </div>
          </div>
        </nav>

        {/* Overlay for mobile */}
        {showNav && <div className="nav-overlay" onClick={toggleNav}></div>}

        <main className={showOutputs ? "container results" : "container centered"}>
          <h1 
            ref={titleRef}
            className={showOutputs ? "title-results" : ""}
            onClick={showOutputs ? resetToHome : undefined}
            data-text="3D Design Generator"
            tabIndex={showOutputs ? 0 : -1}
            role={showOutputs ? "button" : "heading"}
            aria-level={showOutputs ? undefined : "1"}
          >
            3D Design Generator
          </h1>

          {/* Notification System */}
          <NotificationSystem 
            notifications={notifications}
            onDismiss={removeNotification}
          />

          {!showOutputs && (
            <div className="hero-content">
              <AdvancedInputPill
                value={prompt}
                onChange={handlePromptChange}
                onGenerate={handleGenerateClick}
                isGenerating={isLoading}
                onCancel={() => setIsLoading(false)}
                placeholder="Describe your 3D design idea..."
              />
              
              <div className="hero-tagline">
                <p className="tagline">Transform your imagination into stunning 3D designs</p>
                <div className="feature-chips">
                  <div className="feature-chip" tabIndex="0" role="button">
                    <span className="chip-icon">⚡</span>
                    <span className="chip-label">AI-Powered</span>
                  </div>
                  <div className="feature-chip" tabIndex="0" role="button">
                    <span className="chip-icon">👁️</span>
                    <span className="chip-label">Real-time Preview</span>
                  </div>
                  <div className="feature-chip" tabIndex="0" role="button">
                    <span className="chip-icon">📦</span>
                    <span className="chip-label">Export Ready</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showOutputs && (
            <div className="output-section">
              <div className="preview-area">
                <div className="preview-header">
                  <h2>3D Preview</h2>
                  <div className="preview-actions">
                    <button
                      onClick={handleSaveDesign}
                      className="action-button save-button"
                      title="Save Design (Ctrl+S)"
                      aria-label="Save current design"
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={handleExportDesign}
                      className="action-button export-button"
                      title="Export JSON (Ctrl+E)"
                      aria-label="Export design as JSON"
                    >
                      📥 Export
                    </button>
                  </div>
                </div>
                <div className="preview-canvas-container" role="img" aria-label="3D design preview">
                  <ThreeDViewer />
                </div>
              </div>
              <div className="json-viewer">
                <h2>Generated JSON Specification</h2>
                {error && (
                  <pre className="error-message" role="alert" aria-label="Error message">
                    {error}
                  </pre>
                )}
                {jsonSpec && (
                  <pre aria-label="Generated design specification">
                    {JSON.stringify(jsonSpec, null, 2)}
                  </pre>
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