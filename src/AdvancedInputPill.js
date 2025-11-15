import React, { useState, useRef, useCallback, useEffect } from 'react';
import './AdvancedInputPill.css';

const PRESETS = [
  "Futuristic gaming chair with LED accents",
  "Minimal desk lamp with brass finish",
  "Modern coffee table with glass top",
  "Ergonomic office chair with mesh back",
  "Industrial pendant light fixture"
];

const SUGGESTIONS = [
  "chair", "table", "lamp", "desk", "sofa", "cabinet", "shelf", "stool"
];

const AdvancedInputPill = ({ 
  value, 
  onChange, 
  onGenerate, 
  isGenerating, 
  onCancel,
  placeholder = "Describe your 3D design idea..."
}) => {
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef();
  const suggestionRefs = useRef([]);
  const recognitionRef = useRef();

  // Check voice support
  useEffect(() => {
    setVoiceSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  // Progress simulation during generation
  useEffect(() => {
    if (isGenerating) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 15, 95));
      }, 200);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isGenerating]);

  const filteredSuggestions = SUGGESTIONS.filter(s => 
    s.toLowerCase().includes(value.toLowerCase()) && value.length > 0
  ).slice(0, 6);

  const handleFocus = useCallback(() => {
    setFocused(true);
    if (value.length > 0) {
      setShowSuggestions(true);
    }
  }, [value]);

  const handleBlur = useCallback((e) => {
    // Delay to allow clicking suggestions
    setTimeout(() => {
      setFocused(false);
      setShowSuggestions(false);
      setShowPresets(false);
      setSelectedSuggestion(-1);
    }, 150);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (showSuggestions && filteredSuggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestion(prev => 
            prev < filteredSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestion(prev => 
            prev > 0 ? prev - 1 : filteredSuggestions.length - 1
          );
          break;
        case 'Enter':
          if (selectedSuggestion >= 0) {
            e.preventDefault();
            onChange({ target: { value: filteredSuggestions[selectedSuggestion] } });
            setShowSuggestions(false);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedSuggestion(-1);
          break;
      }
    }
  }, [showSuggestions, filteredSuggestions, selectedSuggestion, onChange]);

  const handleVoiceClick = useCallback(() => {
    if (!voiceSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);
    
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChange({ target: { value: transcript } });
      inputRef.current?.focus();
    };

    recognitionRef.current.start();
  }, [voiceSupported, isListening, onChange]);

  const selectPreset = useCallback((preset) => {
    onChange({ target: { value: preset } });
    setShowPresets(false);
    inputRef.current?.focus();
  }, [onChange]);

  const selectSuggestion = useCallback((suggestion) => {
    onChange({ target: { value: suggestion } });
    setShowSuggestions(false);
  }, [onChange]);

  return (
    <div className="advanced-input-container">
      <div className={`input-pill ${focused ? 'focused' : ''} ${isGenerating ? 'generating' : ''}`}>
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={focused ? '' : placeholder}
            disabled={isGenerating}
            aria-label="Design description input"
            aria-describedby="input-help"
            aria-expanded={showSuggestions}
            aria-autocomplete="list"
          />
          
          <label className={`floating-label ${focused || value ? 'active' : ''}`}>
            {placeholder}
          </label>

          {isGenerating && (
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          )}
        </div>

        <div className="pill-actions">
          <button
            type="button"
            className="preset-btn"
            onClick={() => setShowPresets(!showPresets)}
            aria-label="Show presets"
            disabled={isGenerating}
          >
            📋
          </button>

          {voiceSupported && (
            <button
              type="button"
              className={`voice-btn ${isListening ? 'listening' : ''}`}
              onClick={handleVoiceClick}
              aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
              disabled={isGenerating}
            >
              🎤
            </button>
          )}


        </div>
      </div>

      {/* Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="suggestions-dropdown" role="listbox">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              ref={el => suggestionRefs.current[index] = el}
              className={`suggestion-item ${index === selectedSuggestion ? 'selected' : ''}`}
              onClick={() => selectSuggestion(suggestion)}
              role="option"
              aria-selected={index === selectedSuggestion}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Presets */}
      {showPresets && (
        <div className="presets-dropdown">
          <div className="presets-header">Quick Templates</div>
          {PRESETS.map((preset, index) => (
            <button
              key={index}
              className="preset-item"
              onClick={() => selectPreset(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      )}

      <div id="input-help" className="sr-only">
        Enter a description of your 3D design. Use arrow keys to navigate suggestions.
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isGenerating ? `Generating design... ${Math.round(progress)}% complete` : ''}
      </div>
    </div>
  );
};

export default AdvancedInputPill;