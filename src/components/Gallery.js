import React from 'react';

const Gallery = ({ savedDesigns = [], onLoadDesign }) => {
  return (
    <div className="gallery-view">
      <div className="gallery-header">
        <h2>Design Gallery</h2>
        <p className="gallery-subtitle">Your saved designs ({savedDesigns.length})</p>
      </div>
      
      <div className="gallery-grid">
        {savedDesigns.length === 0 ? (
          <div className="empty-gallery">
            <h3>No saved designs yet</h3>
            <p>Create and save your first design to see it here</p>
          </div>
        ) : (
          savedDesigns.map((design) => (
            <div key={design.id} className="gallery-item">
              <div className="gallery-preview">
                <div className="preview-placeholder">
                  {design.spec?.type || 'Design'}
                </div>
              </div>
              <div className="gallery-info">
                <h4>{(design.prompt || 'Untitled Design').substring(0, 50)}{design.prompt && design.prompt.length > 50 ? '...' : ''}</h4>
                <p>{new Date(design.timestamp).toLocaleDateString()}</p>
                <button 
                  className="load-design-btn"
                  onClick={() => onLoadDesign && onLoadDesign(design)}
                >
                  Load Design
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Gallery;