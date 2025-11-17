import React from 'react';

const BeforeAfterComparison = ({ comparison, onClose }) => {
  if (!comparison || !comparison.before || !comparison.after) return null;

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className="comparison-overlay">
      <div className="comparison-modal">
        <div className="comparison-header">
          <h3>Design Comparison</h3>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="comparison-content">
          <div className="comparison-side">
            <h4>Before</h4>
            <div className="json-preview">
              <pre>{JSON.stringify(comparison.before || {}, null, 2)}</pre>
            </div>
          </div>
          
          <div className="comparison-divider">→</div>
          
          <div className="comparison-side">
            <h4>After</h4>
            <div className="json-preview">
              <pre>{JSON.stringify(comparison.after || {}, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterComparison;