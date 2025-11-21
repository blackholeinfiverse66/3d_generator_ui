import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CONSTANTS, handleError } from '../constants';
// Safe Three.js dependency loading with fallback
let Canvas, useFrame, OrbitControls, Environment, ContactShadows, GLTFLoader, Html;
let threeJsAvailable = false;

try {
  const fiber = require('@react-three/fiber');
  const drei = require('@react-three/drei');
  const three = require('three');
  
  Canvas = fiber.Canvas;
  useFrame = fiber.useFrame;
  OrbitControls = drei.OrbitControls;
  Environment = drei.Environment;
  ContactShadows = drei.ContactShadows;
  Html = drei.Html;
  GLTFLoader = three.GLTFLoader || require('three/examples/jsm/loaders/GLTFLoader').GLTFLoader;
  
  threeJsAvailable = true;
} catch (e) {
  const handledError = handleError(e, 'Three.js Dependencies');
  console.warn(CONSTANTS.ERRORS.THREE_JS_UNAVAILABLE + ':', e.message);
  threeJsAvailable = false;
}

// Animated Model Component (only used when Three.js is available)
const AnimatedModel = React.memo(({ url }) => {
  const meshRef = useRef();
  const [gltf, setGltf] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url || !GLTFLoader) {
      setError(new Error('No GLB file URL provided or GLTFLoader unavailable'));
      return;
    }
    
    setError(null);
    setGltf(null);
    
    try {
      const loader = new GLTFLoader();
      loader.load(
        url,
        (gltf) => {
          setGltf(gltf);
          setError(null);
        },
        (progress) => {
          console.log('Loading progress:', Math.round(progress.loaded / progress.total * 100) + '%');
        },
        (error) => {
          const handledError = handleError(error, 'GLB Loading');
          const userFriendlyError = new Error(
            error.message.includes('404') ? CONSTANTS.ERRORS.GLB_NOT_FOUND :
            error.message.includes('CORS') ? CONSTANTS.ERRORS.GLB_CORS_BLOCKED :
            error.message.includes('parse') ? CONSTANTS.ERRORS.GLB_INVALID_FORMAT :
            CONSTANTS.ERRORS.GLB_LOAD_FAILED
          );
          setError(userFriendlyError);
        }
      );
    } catch (e) {
      const handledError = handleError(e, '3D Model Loader');
      setError(new Error(CONSTANTS.ERRORS.GLB_LOADER_INIT_FAILED));
    }
  }, [url]);

  // Always call useFrame when this component is rendered
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  if (error) {
    return (
      <group>
        <mesh ref={meshRef}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff6b6b" />
        </mesh>
        <Html center>
          <div style={{ 
            background: 'rgba(0,0,0,0.8)', 
            color: 'white', 
            padding: '8px 12px', 
            borderRadius: '6px', 
            fontSize: '12px',
            maxWidth: '200px',
            textAlign: 'center'
          }}>
            ⚠️ {error.message}
          </div>
        </Html>
      </group>
    );
  }
  
  if (!url) {
    return (
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#666" />
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
});

// Static Model Component (fallback)
const StaticModel = React.memo(() => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4ecdc4" />
    </mesh>
  );
});

// Model selector with error boundary
const Model = React.memo(({ url }) => {
  // Only render AnimatedModel if Three.js is fully available
  if (threeJsAvailable && useFrame && GLTFLoader) {
    return <AnimatedModel url={url} />;
  }
  return <StaticModel />;
});

const GLBViewer = React.memo(({ previewUrl, jsonSpec }) => {
  const [lightingPreset, setLightingPreset] = useState('studio');
  const [zoom, setZoom] = useState(100);

  // Enhanced fallback when Three.js is not available
  if (!threeJsAvailable || !Canvas) {
    return (
      <div style={{ 
        width: '100%', 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'rgba(0,0,0,0.2)', 
        borderRadius: '12px',
        border: '2px dashed rgba(110,231,255,0.3)'
      }}>
        <div style={{ textAlign: 'center', color: 'var(--muted-white)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎲</div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--neon-cyan)' }}>3D Preview Unavailable</h3>
          <p style={{ margin: '0 0 16px 0', opacity: 0.8 }}>Install Three.js dependencies for 3D rendering</p>
          <code style={{ 
            background: 'rgba(0,0,0,0.3)', 
            padding: '8px 12px', 
            borderRadius: '6px',
            fontSize: '12px',
            display: 'block',
            marginBottom: '16px'
          }}>
            npm install three @react-three/fiber @react-three/drei
          </code>
          {jsonSpec && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: 'rgba(110,231,255,0.1)',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              <strong style={{ color: 'var(--neon-cyan)' }}>{jsonSpec.type}</strong><br/>
              <span style={{ opacity: 0.8 }}>{jsonSpec.style} • {jsonSpec.material}</span>
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
});

GLBViewer.propTypes = {
  previewUrl: PropTypes.string,
  jsonSpec: PropTypes.shape({
    type: PropTypes.string,
    style: PropTypes.string,
    material: PropTypes.string
  })
};

GLBViewer.defaultProps = {
  previewUrl: null,
  jsonSpec: null
};

export default GLBViewer;

// Install Three.js dependencies with:
// npm install three @react-three/fiber @react-three/drei