import React, { useRef, useEffect, useState } from 'react';
// Fallback for when Three.js is not installed
let Canvas, useFrame, OrbitControls, Environment, ContactShadows;
try {
  const fiber = require('@react-three/fiber');
  const drei = require('@react-three/drei');
  Canvas = fiber.Canvas;
  useFrame = fiber.useFrame;
  OrbitControls = drei.OrbitControls;
  Environment = drei.Environment;
  ContactShadows = drei.ContactShadows;
} catch (e) {
  console.warn('Three.js dependencies not installed');
}

// Animated Model Component (only used when Three.js is available)
const AnimatedModel = ({ url }) => {
  const meshRef = useRef();
  const [gltf, setGltf] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    
    try {
      const { GLTFLoader } = require('three/examples/jsm/loaders/GLTFLoader');
      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          setGltf(gltf);
          setError(null);
        },
        undefined,
        (error) => {
          console.error('GLB loading error:', error);
          setError(error);
        }
      );
    } catch (e) {
      setError(e);
    }
  }, [url]);

  // Always call useFrame when this component is rendered
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  if (error || !url) {
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
    );
  }

  if (!gltf) {
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4ecdc4" />
      </mesh>
    );
  }

  return <primitive ref={meshRef} object={gltf.scene} scale={[1, 1, 1]} />;
};

// Static Model Component (fallback)
const StaticModel = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4ecdc4" />
    </mesh>
  );
};

// Model selector
const Model = ({ url }) => {
  // Only render AnimatedModel if useFrame is available
  if (useFrame) {
    return <AnimatedModel url={url} />;
  }
  return <StaticModel />;
};

const GLBViewer = ({ previewUrl, jsonSpec }) => {
  const [lightingPreset, setLightingPreset] = useState('studio');
  const [zoom, setZoom] = useState(100);

  // Fallback when Three.js is not available
  if (!Canvas) {
    return (
      <div style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <p>3D Preview</p>
          <small>Three.js not installed</small>
          {jsonSpec && (
            <div style={{ marginTop: '16px', fontSize: '14px' }}>
              <strong>{jsonSpec.type}</strong><br/>
              {jsonSpec.style} • {jsonSpec.material}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <div className="viewer-controls">
        <select 
          value={lightingPreset} 
          onChange={(e) => setLightingPreset(e.target.value)}
          className="lighting-select"
        >
          <option value="studio">Studio</option>
          <option value="sunset">Sunset</option>
          <option value="dawn">Dawn</option>
          <option value="night">Night</option>
        </select>
        <div className="zoom-display">{zoom}%</div>
      </div>
      
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <Model url={previewUrl} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
          onEnd={(e) => setZoom(Math.round((5 / e.target.object.position.distanceTo(e.target.target)) * 100))}
        />
        
        <Environment preset={lightingPreset} />
        <ContactShadows 
          rotation-x={Math.PI / 2} 
          position={[0, -1.4, 0]} 
          opacity={0.75} 
          width={10} 
          height={10} 
          blur={2.6} 
          far={2} 
        />
      </Canvas>
    </div>
  );
};

export default GLBViewer;

// Install Three.js dependencies with:
// npm install three @react-three/fiber @react-three/drei