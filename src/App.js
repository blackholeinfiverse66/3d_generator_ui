import React, { useState} from 'react';
import ThreeDViewer from './ThreeDViewer';
import InteractiveCubeBackground from './InteractiveCubeBackground';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [jsonSpec, setJsonSpec] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOutputs, setShowOutputs] = useState(false);

  // The old useEffect for mouse-move has been removed from here.

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

  return (
    <div className="App">
      <InteractiveCubeBackground />
      <main className={showOutputs ? "container" : "container centered"}>
        <h1>3D Design Generator</h1>
        
        <div className="input-section">
          <textarea
            value={prompt}
            onChange={handlePromptChange}
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
                {/* Corrected y1="2" to y1="12" */}
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            )}
          </button>
        </div>

        <p className="tagline">Enter a description to generate a unique 3D model specification.</p>

        {showOutputs && (
          <div className="output-section">
            <div className="json-viewer">
              <h2>Generated JSON Specification</h2>
              {error && <pre className="error-message">{error}</pre>}
              {jsonSpec && (
                <pre>{JSON.stringify(jsonSpec, null, 2)}</pre>
              )}
            </div>
            <div className="preview-area">
              <h2>3D Preview</h2>
              <div className="preview-canvas-container">
                <ThreeDViewer />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;