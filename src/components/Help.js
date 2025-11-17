import React from 'react';

const Help = () => {
  return (
    <div className="help-view">
      <div className="help-header-container">
        <div className="page-header">
          <h2>Help & Usage Guide</h2>
          <p className="page-subtitle">Everything you need to know to create amazing 3D designs</p>
        </div>
      </div>
      
      <div className="help-content-container">
        <div className="content-grid three-columns">
          <div className="content-card">
            <h3>Getting Started</h3>
            <ol>
              <li>Enter a description of what you want to create</li>
              <li>Click "Generate" or press Enter</li>
              <li>View your 3D design in the preview</li>
            </ol>
          </div>

          <div className="content-card">
            <h3>Writing Good Prompts</h3>
            <ul>
              <li><strong>Be specific:</strong> "Modern wooden dining chair"</li>
              <li><strong>Include materials:</strong> wood, metal, glass</li>
              <li><strong>Mention style:</strong> modern, vintage, minimalist</li>
            </ul>
          </div>

          <div className="content-card">
            <h3>Keyboard Shortcuts</h3>
            <ul>
              <li><kbd>Ctrl + Enter</kbd> - Generate design</li>
              <li><kbd>Ctrl + S</kbd> - Save design</li>
              <li><kbd>Ctrl + E</kbd> - Export design</li>
            </ul>
          </div>
        </div>

        <div className="content-grid three-columns">
          <div className="content-card">
            <h3>Key Features</h3>
            <ul>
              <li><strong>Material Switch:</strong> Change materials in real-time</li>
              <li><strong>Iterate:</strong> Automatically improve designs</li>
              <li><strong>History:</strong> View previous versions</li>
            </ul>
          </div>

          <div className="content-card">
            <h3>Troubleshooting</h3>
            <ul>
              <li>If generation fails, try a simpler prompt</li>
              <li>Refresh if interface becomes unresponsive</li>
              <li>Check your internet connection</li>
            </ul>
          </div>

          <div className="content-card">
            <h3>Tips & Tricks</h3>
            <ul>
              <li><strong>Experiment:</strong> Try different combinations</li>
              <li><strong>Save Often:</strong> Keep favorite designs</li>
              <li><strong>Export:</strong> Download JSON specs</li>
            </ul>
          </div>
        </div>

        <div className="content-grid three-columns">
          <div className="content-card">
            <h3>Design Process</h3>
            <ul>
              <li>Start with basic shapes and forms</li>
              <li>Add details and refinements</li>
              <li>Test different material combinations</li>
            </ul>
          </div>

          <div className="content-card">
            <h3>Best Practices</h3>
            <ul>
              <li>Use clear, descriptive language</li>
              <li>Iterate on successful designs</li>
              <li>Save variations for comparison</li>
            </ul>
          </div>

          <div className="content-card">
            <h3>Advanced Tips</h3>
            <ul>
              <li>Combine multiple design elements</li>
              <li>Use the history feature effectively</li>
              <li>Export designs for external tools</li>
            </ul>
          </div>
      </div>
    </div>
    </div>
  );
};

export default Help;