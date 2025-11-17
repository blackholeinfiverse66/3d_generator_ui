import React, { useState, useCallback } from 'react';
import { EyeIcon, DocumentIcon, HistoryIcon, SettingsIcon, SaveIcon, ExportIcon, FullscreenIcon, ExitFullscreenIcon, ZoomInIcon, ZoomOutIcon, CopyIcon, CheckIcon, DownloadIcon, LoadIcon } from './Icons';
import './TabbedResultsView.css';

const TabbedResultsView = ({ 
  jsonSpec, 
  error, 
  onSave, 
  onExport, 
  onIterate,
  savedDesigns,
  designHistory = [],
  onLoadHistory,
  ThreeDViewer 
}) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);

  const tabs = [
    { id: 'preview', label: '3D Preview', icon: <EyeIcon size={16} /> },
    { id: 'json', label: 'JSON Spec', icon: <DocumentIcon size={16} /> },
    { id: 'history', label: 'History', icon: <HistoryIcon size={16} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={16} /> }
  ];

  const copyToClipboard = useCallback(async () => {
    if (!jsonSpec) return;
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(jsonSpec, null, 2));
      setJsonCopied(true);
      setTimeout(() => setJsonCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [jsonSpec]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const downloadAs = useCallback((format) => {
    if (!jsonSpec) return;
    
    const data = JSON.stringify(jsonSpec, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [jsonSpec]);

  return (
    <div className={`tabbed-results ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="tabs-header">
        <div className="tabs-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="tabs-actions">
          {activeTab === 'preview' && (
            <button 
              className="action-btn"
              onClick={toggleFullscreen}
              title="Toggle fullscreen"
            >
              {isFullscreen ? <ExitFullscreenIcon size={16} /> : <FullscreenIcon size={16} />}
            </button>
          )}
          <button 
            className="action-btn save-btn"
            onClick={onSave}
            title="Save Design"
          >
            <SaveIcon size={16} />
          </button>
          <button 
            className="action-btn export-btn"
            onClick={onExport}
            title="Export JSON"
          >
            <ExportIcon size={16} />
          </button>
          {onIterate && (
            <button 
              className="action-btn iterate-btn"
              onClick={onIterate}
              title="Improve Design"
            >
              ✨ Iterate
            </button>
          )}
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'preview' && (
          <div className="preview-tab">
            <div className="preview-controls">
              <div className="zoom-controls">
                <button className="zoom-btn"><ZoomOutIcon size={14} /></button>
                <span>100%</span>
                <button className="zoom-btn"><ZoomInIcon size={14} /></button>
              </div>
            </div>
            <div className="preview-canvas">
              <ThreeDViewer />
            </div>
          </div>
        )}

        {activeTab === 'json' && (
          <div className="json-tab">
            <div className="json-header">
              <h3>Generated Specification</h3>
              <div className="json-actions">
                <button 
                  className={`copy-btn ${jsonCopied ? 'copied' : ''}`}
                  onClick={copyToClipboard}
                >
                  {jsonCopied ? <><CheckIcon size={14} /> Copied</> : <><CopyIcon size={14} /> Copy</>}
                </button>
                <div className="download-dropdown">
                  <button className="download-btn"><DownloadIcon size={14} /> Download ▼</button>
                  <div className="dropdown-menu">
                    <button onClick={() => downloadAs('json')}>JSON</button>
                    <button onClick={() => downloadAs('txt')}>Text</button>
                  </div>
                </div>
              </div>
            </div>
            {error ? (
              <pre className="error-display">{error}</pre>
            ) : jsonSpec ? (
              <pre className="json-display">
                {JSON.stringify(jsonSpec, null, 2)}
              </pre>
            ) : (
              <div className="empty-state">
                <p>No JSON specification available</p>
                <small>Generate a design to see the JSON spec here</small>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-tab">
            <h3>Design History ({designHistory.length})</h3>
            <div className="history-list">
              {designHistory.length === 0 ? (
                <div className="empty-state">
                  <p>No design history yet</p>
                  <small>Generate designs to see version history here</small>
                </div>
              ) : (
                designHistory.slice(-10).reverse().map((item, index) => (
                  <div key={`${item.spec_id}_${item.spec_version}`} className="history-item">
                    <div className="history-info">
                      <div className="history-prompt">
                        Version {item.spec_version}
                        {item.changed && ` - ${item.changed.field} changed`}
                      </div>
                      <div className="history-date">
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button 
                      className="load-btn"
                      onClick={() => onLoadHistory && onLoadHistory(item)}
                    >
                      <LoadIcon size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <h3>Rendering Settings</h3>
            <div className="settings-group">
              <label>Quality</label>
              <select defaultValue="high">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="settings-group">
              <label>Theme</label>
              <select defaultValue="dark">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div className="settings-group">
              <label>
                <input type="checkbox" defaultChecked />
                Auto-save designs
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabbedResultsView;