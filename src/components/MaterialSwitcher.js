import React, { useState, useCallback } from 'react';

const MaterialSwitcher = ({ jsonSpec, onMaterialSwitch }) => {
  const [selectedObject, setSelectedObject] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const materials = [
    'wood_oak', 'wood_pine', 'metal_steel', 'metal_aluminum',
    'fabric_cotton', 'fabric_leather', 'glass_clear', 'glass_frosted',
    'plastic_white', 'plastic_black', 'ceramic_white', 'stone_marble'
  ];

  const handleSwitch = useCallback(async () => {
    if (!selectedObject || !selectedMaterial) return;
    
    setIsLoading(true);
    await onMaterialSwitch(selectedObject, selectedMaterial);
    setIsLoading(false);
  }, [selectedObject, selectedMaterial, onMaterialSwitch]);

  if (!jsonSpec?.objects?.length) {
    return (
      <div className="material-switcher">
        <h4>Material Switch</h4>
        <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '20px' }}>
          No objects available for material switching
        </p>
      </div>
    );
  }

  return (
    <div className="material-switcher">
      <h4>Material Switch</h4>
      <div className="switch-controls">
        <div className="control-group">
          <label>Select Object:</label>
          <select 
            value={selectedObject} 
            onChange={(e) => setSelectedObject(e.target.value)}
          >
            <option value="">Choose object...</option>
            {jsonSpec.objects.map(obj => (
              <option key={obj.object_id} value={obj.object_id}>
                {obj.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label>Select Material:</label>
          <select 
            value={selectedMaterial} 
            onChange={(e) => setSelectedMaterial(e.target.value)}
          >
            <option value="">Choose material...</option>
            {materials.map(material => (
              <option key={material} value={material}>
                {material.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          className="switch-btn"
          onClick={handleSwitch}
          disabled={!selectedObject || !selectedMaterial || isLoading}
        >
          {isLoading ? 'Switching...' : 'Switch Material'}
        </button>
      </div>
    </div>
  );
};

export default MaterialSwitcher;