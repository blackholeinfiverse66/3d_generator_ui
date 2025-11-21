import React, { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PlayIcon, CloseIcon } from './Icons';
import { CONSTANTS } from '../constants';
import './EnhancedInputPill.css';

const ANIMATED_SUGGESTIONS = [
  "Futuristic gaming chair with LED accents",
  "Minimal desk lamp with brass finish",
  "Modern coffee table with glass top",
  "Ergonomic office chair with mesh back",
  "Industrial pendant light fixture"
];

const EnhancedInputPill = React.memo(({ 
  value, 
  onChange, 
  onGenerate, 
  isGenerating, 
  onCancel
}) => {
  const [focused, setFocused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentPrompts] = useState(['Modern chair', 'Glass table', 'LED lamp']);

  const inputRef = useRef();
  const typingTimeoutRef = useRef();

  const maxLength = CONSTANTS.MAX_PROMPT_LENGTH;
  const charCount = value.length;
  const isValid = charCount > 0 && charCount <= maxLength;
  const isWarning = charCount > maxLength * CONSTANTS.PROMPT_WARNING_THRESHOLD;

  // Animated placeholder typing effect with proper cleanup
  useEffect(() => {
    if (focused || value) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      return;
    }
    
    const typeText = () => {
      const text = ANIMATED_SUGGESTIONS[currentSuggestion];
      let charIndex = 0;
      setDisplayText('');
      setIsTyping(true);
      
      const typeChar = () => {
        if (charIndex < text.length) {
          setDisplayText(text.substring(0, charIndex + 1));
          charIndex++;
          typingTimeoutRef.current = setTimeout(typeChar, CONSTANTS.TYPING_CHAR_DELAY);
        } else {
          setIsTyping(false);
          typingTimeoutRef.current = setTimeout(() => {
            setCurrentSuggestion((prev) => (prev + 1) % ANIMATED_SUGGESTIONS.length);
          }, CONSTANTS.SUGGESTION_DISPLAY_TIME);
        }
      };
      
      typeChar();
    };
    
    typeText();
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, [currentSuggestion, focused, value]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
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

  const handleFocus = useCallback(() => {
    setFocused(true);
    setShowSuggestions(value.length === 0);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [value]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setFocused(false);
      setShowSuggestions(false);
    }, 150);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && isValid) {
        onGenerate();
      }
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }, [value, isValid, onGenerate]);

  const selectSuggestion = useCallback((suggestion) => {
    onChange({ target: { value: suggestion } });
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, [onChange]);

  const clearInput = useCallback(() => {
    onChange({ target: { value: '' } });
    inputRef.current?.focus();
  }, [onChange]);

  return (
    <div className="enhanced-input-container">
      <div className={`input-pill ${focused ? 'focused' : ''} ${isGenerating ? 'generating' : ''} ${!isValid && value ? 'invalid' : ''}`}>
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={focused || value ? '' : displayText + (isTyping ? '|' : '')}
            disabled={isGenerating}
            maxLength={maxLength}
            aria-label="Design description input"
          />
          
          {value && (
            <button 
              className="clear-btn"
              onClick={clearInput}
              type="button"
              aria-label="Clear input"
            >
              <CloseIcon size={14} />
            </button>
          )}

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
            className="generate-arrow-btn"
            onClick={onGenerate}
            aria-label="Generate design"
            disabled={isGenerating || !isValid}
          >
            <PlayIcon size={16} />
            Generate
          </button>
        </div>
      </div>

      <div className="input-meta">
        <div className={`char-counter ${isWarning ? 'warning' : ''}`}>
          {charCount}/{maxLength}
        </div>
        {(!isValid && value) || isWarning ? (
          <div className="validation-error">
            {charCount === 0 ? 'Please enter a description' : 
             charCount > maxLength ? 'Description too long' : 
             'Approaching character limit'}
          </div>
        ) : null}
      </div>

      {/* Recent Prompts Suggestions */}
      {showSuggestions && recentPrompts.length > 0 && (
        <div className="suggestions-dropdown">
          <div className="suggestions-header">Recent prompts</div>
          {recentPrompts.map((prompt, index) => (
            <button
              key={index}
              className="suggestion-item"
              onClick={() => selectSuggestion(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div className="sr-only">
        Enter a description of your 3D design and press Enter to generate.
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isGenerating ? `Generating design... ${Math.round(progress)}% complete` : ''}
      </div>
    </div>
  );
});

EnhancedInputPill.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onGenerate: PropTypes.func.isRequired,
  isGenerating: PropTypes.bool,
  onCancel: PropTypes.func
};

EnhancedInputPill.defaultProps = {
  isGenerating: false,
  onCancel: () => {}
};

export default EnhancedInputPill;