import React, { useState, useEffect } from 'react';
import { CloseIcon } from './Icons';
import './KeyboardShortcuts.css';

const SHORTCUTS = [
  { key: 'Ctrl + Enter', action: 'Generate design' },
  { key: 'Ctrl + S', action: 'Save current design' },
  { key: 'Ctrl + E', action: 'Export JSON' },
  { key: 'Ctrl + Z', action: 'Reset to home' },
  { key: 'Ctrl + ?', action: 'Show shortcuts' },
  { key: 'Escape', action: 'Close menu/modal' },
  { key: 'Tab', action: 'Navigate elements' },
  { key: 'Space', action: 'Activate button' }
];

const KeyboardShortcuts = ({ isVisible, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="shortcuts-overlay" onClick={onClose}>
      <div className="shortcuts-modal" onClick={e => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2>Keyboard Shortcuts</h2>
          <button className="close-btn" onClick={onClose}><CloseIcon size={16} /></button>
        </div>
        
        <div className="shortcuts-content">
          <div className="shortcuts-grid">
            {SHORTCUTS.map((shortcut, index) => (
              <div key={index} className="shortcut-item">
                <div className="shortcut-keys">
                  {shortcut.key.split(' + ').map((key, keyIndex) => (
                    <React.Fragment key={keyIndex}>
                      <kbd className="key">{key}</kbd>
                      {keyIndex < shortcut.key.split(' + ').length - 1 && (
                        <span className="plus">+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="shortcut-action">{shortcut.action}</div>
              </div>
            ))}
          </div>
          
          <div className="shortcuts-tip">
            <p>💡 Tip: Press <kbd>Ctrl + ?</kbd> anytime to toggle this help</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;