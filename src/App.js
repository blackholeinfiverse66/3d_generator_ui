import React, { useState, useEffect, useCallback, useRef } from 'react';
import DonutBackground from './DonutBackground';
import ErrorBoundary from './ErrorBoundary';
import NotificationSystem, { useNotifications } from './NotificationSystem';
import { CONSTANTS, createNotification } from './constants';

import EnhancedInputPill from './components/EnhancedInputPill';
import AdvancedLoadingStates from './components/AdvancedLoadingStates';
import TabbedResultsView from './components/TabbedResultsView';
import OnboardingTour from './components/OnboardingTour';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import FeedbackSection from './components/FeedbackSection';
import MaterialSwitcher from './components/MaterialSwitcher';
import GLBViewer from './components/GLBViewer';
import Gallery from './components/Gallery';
import About from './components/About';
import Help from './components/Help';
import BeforeAfterComparison from './components/BeforeAfterComparison';
import TransitionLoader from './components/TransitionLoader';
import { HomeIcon, FolderIcon, InfoIcon, HelpIcon, BrainIcon, EyeIcon, PackageIcon } from './components/Icons';
import './App.css';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';
const AUTH_TOKEN = process.env.REACT_APP_AUTH_TOKEN || 'mock-jwt-token';

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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [userId] = useState('user_123');
  const [projectId] = useState('proj_001');
  const [currentSpecId, setCurrentSpecId] = useState(null);
  const [currentIterationId, setCurrentIterationId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [designHistory, setDesignHistory] = useState([]);
  const [isPolling, setIsPolling] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [beforeAfterComparison, setBeforeAfterComparison] = useState(null);
  const [showTransition, setShowTransition] = useState(false);

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



  const handleGenerateClick = useCallback(async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setShowOutputs(false);

    // Show transition loader
    setShowTransition(true);
    
    // Always use mock data for development since backend is not available
    const mockData = {
      spec_id: 'spec_' + Date.now(),
      iteration_id: 'iter_' + Date.now(),
      spec_json: {
        type: prompt.toLowerCase().includes('chair') ? 'chair' : 
              prompt.toLowerCase().includes('table') ? 'table' : 
              prompt.toLowerCase().includes('lamp') ? 'lamp' : 'furniture',
        style: 'modern',
        material: 'wood',
        dimensions: { width: 50, height: 80, depth: 45 },
        objects: [
          { object_id: 'base_1', name: 'base', material: 'oak', color: '#8B4513' },
          { object_id: 'surface_1', name: 'surface', material: 'glass', color: '#E6E6FA' }
        ],
        colors: { primary: '#8B4513', secondary: '#E6E6FA', accent: '#FFD700' },
        prompt: prompt
      },
      preview_url: null
    };
    
    console.log('Using mock data:', mockData.spec_json);
    setJsonSpec(mockData.spec_json);
    setCurrentSpecId(mockData.spec_id);
    setCurrentIterationId(mockData.iteration_id);
    setPreviewUrl(mockData.preview_url);
  }, [prompt, userId, projectId]);

  // Load saved designs and check first visit on mount
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
    
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setIsFirstVisit(true);
      setShowOnboarding(true);
      localStorage.setItem('hasVisited', 'true');
    } else {
      setIsFirstVisit(false);
    }
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
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

  const toggleNav = useCallback(() => {
    setShowNav(!showNav);
  }, [showNav]);

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
      if (event.ctrlKey && event.shiftKey && event.key === '?') {
        event.preventDefault();
        setShowShortcuts(!showShortcuts);
      }
      if (event.key === 'Escape') {
        if (showNav) setShowNav(false);
        if (showShortcuts) setShowShortcuts(false);
        if (showOnboarding) setShowOnboarding(false);
      }
  }, [prompt, isLoading, showNav, showShortcuts, showOnboarding, handleGenerateClick, handleReset, handleSaveDesign, handleExportDesign]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const typingTimeoutRef = useRef(null);
  
  const handlePromptChange = useCallback((e) => {
    setPrompt(e.target.value);
    setIsTyping(true);
    
    const textarea = e.target;
    if (textarea && textarea.style && textarea.scrollHeight) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, CONSTANTS.TYPING_TIMEOUT);
  }, []);

  const handleInputFocus = useCallback(() => {
    setInputFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setInputFocused(false);
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
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

  const handleTransitionComplete = useCallback(() => {
    setShowTransition(false);
    setIsLoading(false);
    setShowOutputs(true);
  }, []);

  const resetToHome = useCallback(() => {
    setPrompt('');
    setJsonSpec(null);
    setIsLoading(false);
    setError(null);
    setShowOutputs(false);
    setShowNav(false);
    setCurrentView('home');
    setBeforeAfterComparison(null);
    setShowTransition(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, []);

  const handleNavigation = useCallback((view) => {
    setShowNav(false);
    setCurrentView(view);
    if (view === 'home') {
      resetToHome();
    }
  }, [resetToHome]);



  const handleThemeChange = useCallback((newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    // Force re-render to ensure all components respect theme change
    setTimeout(() => {
      document.body.style.display = 'none';
      void document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
    }, 0);
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
  }, []);

  const cancelGeneration = useCallback(() => {
    setIsLoading(false);
    addNotification(createNotification(
      'info',
      'Generation Cancelled',
      CONSTANTS.ERRORS.GENERATION_CANCELLED
    ));
  }, [addNotification]);

  const handleEvaluate = useCallback(async (rating, feedback = '') => {
    if (!currentSpecId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`
        },
        body: JSON.stringify({
          user_id: userId,
          spec_id: currentSpecId,
          iteration_id: currentIterationId,
          rating,
          feedback
        })
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Feedback Submitted',
          message: `Thank you for rating this design ${rating} stars!`,
          duration: 3000
        });
      }
    } catch (err) {
      console.error('Evaluate failed:', err);
      addNotification({
        type: 'info',
        title: 'Feedback Noted',
        message: `Thank you for rating this design ${rating} stars!`,
        duration: 3000
      });
    }
  }, [currentSpecId, currentIterationId, userId, addNotification]);

  const handleIterate = useCallback(async () => {
    if (!currentSpecId) return;

    setIsLoading(true);
    // Store before state for comparison
    const beforeSpec = { ...jsonSpec };
    
    // Mock iteration for development
    const improvedSpec = {
      ...jsonSpec,
      style: jsonSpec.style === 'modern' ? 'contemporary' : 'modern',
      dimensions: {
        ...jsonSpec.dimensions,
        height: jsonSpec.dimensions.height + 5
      }
    };
    
    setTimeout(() => {
      setBeforeAfterComparison({ before: beforeSpec, after: improvedSpec });
      setJsonSpec(improvedSpec);
      setCurrentIterationId('iter_' + Date.now());
      addNotification({
        type: 'success',
        title: 'Design Improved',
        message: 'The design has been automatically improved!',
        duration: 4000
      });
      setIsLoading(false);
    }, 1500);
  }, [currentSpecId, jsonSpec, addNotification]);

  const handleMaterialSwitch = useCallback(async (objectId, material) => {
    if (!currentSpecId || !jsonSpec) return;

    // Mock material switch for development
    const updatedSpec = {
      ...jsonSpec,
      objects: jsonSpec.objects.map(obj => 
        obj.object_id === objectId 
          ? { ...obj, material: material }
          : obj
      )
    };
    
    setJsonSpec(updatedSpec);
    addNotification({
      type: 'success',
      title: 'Material Updated',
      message: `Material changed to ${material}`,
      duration: 3000
    });
  }, [currentSpecId, jsonSpec, addNotification]);

  const pollPreviewStatus = useCallback(async (statusUrl) => {
    setIsPolling(true);
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(statusUrl, {
          headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });
        const data = await response.json();

        if (data.status === 'completed' && data.preview_url) {
          setPreviewUrl(data.preview_url);
          setIsPolling(false);
          addNotification({
            type: 'success',
            title: 'Preview Ready',
            message: 'Your 3D preview has been generated!',
            duration: 3000
          });
          return;
        }

        if (data.status === 'failed') {
          setIsPolling(false);
          addNotification({
            type: 'error',
            title: 'Preview Generation Failed',
            message: 'Unable to generate preview. Please try again.',
            duration: 4000
          });
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          setIsPolling(false);
        }
      } catch (err) {
        console.error('Polling failed:', err);
        setIsPolling(false);
      }
    };
//Nothing
    poll();
  }, [addNotification]);

  const loadDesignHistory = useCallback(async () => {
    // Mock history data for development
    const mockHistory = [
      {
        spec_id: 'spec_001',
        spec_version: 1,
        spec_json: { type: 'chair', style: 'modern', material: 'wood' },
        preview_url: null,
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        spec_id: 'spec_001',
        spec_version: 2,
        iteration_id: 'iter_001',
        spec_json: { type: 'chair', style: 'contemporary', material: 'metal' },
        preview_url: null,
        changed: { object_id: 'base_1', field: 'material', before: 'wood', after: 'metal' },
        created_at: '2024-01-15T11:00:00Z'
      },
      {
        spec_id: 'spec_002',
        spec_version: 1,
        spec_json: { type: 'table', style: 'minimalist', material: 'glass' },
        preview_url: null,
        created_at: '2024-01-16T09:00:00Z'
      }
    ];
    setDesignHistory(mockHistory);
  }, []);

  const loadHistoryItem = useCallback((historyItem) => {
    setJsonSpec(historyItem.spec_json);
    setCurrentSpecId(historyItem.spec_id);
    setCurrentIterationId(historyItem.iteration_id);
    setPreviewUrl(historyItem.preview_url);
    setCurrentView('home');
    setShowOutputs(true);
    addNotification({
      type: 'success',
      title: 'Design Loaded',
      message: 'Previous design loaded successfully!',
      duration: 3000
    });
  }, [addNotification]);

  const loadGalleryDesign = useCallback((design) => {
    setPrompt(design.prompt);
    setJsonSpec(design.spec);
    setCurrentView('home');
    setShowOutputs(true);
    addNotification({
      type: 'success',
      title: 'Design Loaded',
      message: 'Gallery design loaded successfully!',
      duration: 3000
    });
  }, [addNotification]);

  // Load design history when showing outputs
  useEffect(() => {
    if (showOutputs) {
      loadDesignHistory();
    }
  }, [showOutputs, loadDesignHistory]);


  return (
    <ErrorBoundary>
      <div className="App" ref={appRef} data-theme={theme}>
        <DonutBackground config={{
          objectCount: CONSTANTS.DONUT_OBJECT_COUNT,
          majorRadius: CONSTANTS.DONUT_MAJOR_RADIUS,
          minorRadius: CONSTANTS.DONUT_MINOR_RADIUS,
          reducedMode: window.innerWidth < CONSTANTS.MOBILE_BREAKPOINT
        }} />
        

        
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
              <li><button onClick={() => handleNavigation('home')} aria-label="Go to Home"><HomeIcon size={18} /> Home</button></li>
              <li><button onClick={() => handleNavigation('gallery')} aria-label="View Gallery"><FolderIcon size={18} /> Gallery</button></li>
              <li><button onClick={() => handleNavigation('about')} aria-label="About Information"><InfoIcon size={18} /> About</button></li>
              <li><button onClick={() => handleNavigation('help')} aria-label="Get Help"><HelpIcon size={18} /> Help</button></li>
            </ul>
            <div className="nav-footer">
              <div className="saved-count">
                {savedDesigns.length} Saved Design{savedDesigns.length === 1 ? '' : 's'}
              </div>
              <div className="theme-selector">
                <label>Theme:</label>
                <select value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div className="keyboard-shortcuts">
                <small>Press Ctrl+Shift+? for shortcuts</small>
              </div>
            </div>
          </div>
        </nav>

        {/* Overlay for mobile */}
        {showNav && <div className="nav-overlay" onClick={toggleNav}></div>}
        


        <main className={currentView === 'home' && showOutputs ? "container results" : "container centered"}>
          {/* Notification System */}
          <NotificationSystem 
            notifications={notifications}
            onDismiss={removeNotification}
          />

          {/* Animated Title */}
          <div className={`title-container ${(currentView === 'home' && (showOutputs || isLoading)) || currentView !== 'home' ? 'title-compact' : 'title-centered'}`}>
            <h1 className="main-title" onClick={resetToHome} style={{ cursor: currentView !== 'home' || showOutputs || isLoading ? 'pointer' : 'default' }}>
              3D Design Generator
              <span className="version-badge">Beta</span>
            </h1>
          </div>

          {currentView === 'gallery' && (
            <Gallery 
              savedDesigns={savedDesigns}
              onLoadDesign={loadGalleryDesign}
            />
          )}

          {currentView === 'about' && <About />}
          
          {currentView === 'help' && <Help />}

          {currentView === 'home' && !showOutputs && !showTransition && (
            <div className="hero-content">
              <div className="hero-subtitle-section">
                <p className="hero-subtitle">Transform your imagination into stunning 3D designs with AI</p>
              </div>
              
              <EnhancedInputPill
                value={prompt}
                onChange={handlePromptChange}
                onGenerate={handleGenerateClick}
                isGenerating={isLoading}
                onCancel={cancelGeneration}
              />
              
              <div className="feature-chips">
                <div className="feature-chip" tabIndex="0" role="button">
                  <BrainIcon size={20} />
                  <span className="chip-label">AI-Powered</span>
                </div>
                <div className="feature-chip" tabIndex="0" role="button">
                  <EyeIcon size={20} />
                  <span className="chip-label">Real-time Preview</span>
                </div>
                <div className="feature-chip" tabIndex="0" role="button">
                  <PackageIcon size={20} />
                  <span className="chip-label">Export Ready</span>
                </div>
              </div>
            </div>
          )}

          {/* Transition Loader */}
          <TransitionLoader 
            isVisible={showTransition}
            prompt={prompt}
            onComplete={handleTransitionComplete}
          />

          {currentView === 'home' && showOutputs && (
            <div style={{ transform: 'none', animation: 'none', transition: 'none' }}>
              <TabbedResultsView
                jsonSpec={jsonSpec}
                error={error}
                onSave={handleSaveDesign}
                onExport={handleExportDesign}
                onIterate={handleIterate}
                savedDesigns={savedDesigns}
                designHistory={designHistory}
                onLoadHistory={loadHistoryItem}
                ThreeDViewer={() => <GLBViewer previewUrl={previewUrl} jsonSpec={jsonSpec} />}
              />
              <MaterialSwitcher 
                jsonSpec={jsonSpec}
                onMaterialSwitch={handleMaterialSwitch}
              />
              <FeedbackSection onFeedback={handleEvaluate} />
            </div>
          )}

        </main>
        
        {/* Advanced Loading States */}
        <AdvancedLoadingStates 
          isLoading={isLoading}
          onCancel={cancelGeneration}
        />
        
        {/* Onboarding Tour */}
        <OnboardingTour 
          isVisible={showOnboarding}
          onComplete={handleOnboardingComplete}
        />
        
        {/* Keyboard Shortcuts */}
        <KeyboardShortcuts 
          isVisible={showShortcuts}
          onClose={() => setShowShortcuts(false)}
        />
        
        {/* Before/After Comparison */}
        <BeforeAfterComparison 
          comparison={beforeAfterComparison}
          onClose={() => setBeforeAfterComparison(null)}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;