import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
// import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const DonutOrbit = ({ config }) => {
  const groupRef = useRef();
  const centralRef = useRef();
  const orbitingRefs = useRef([]);
  
  const { objectCount, majorRadius, minorRadius, offsetSpeed, bloomStrength } = config;

  // Create orbiting objects with 3 layers
  const orbitingObjects = useMemo(() => {
    const objects = [];
    const geometries = [
      new THREE.IcosahedronGeometry(4, 0),
      new THREE.OctahedronGeometry(5),
      new THREE.TetrahedronGeometry(6),
      new THREE.BoxGeometry(7, 7, 7),
      new THREE.ConeGeometry(4, 8, 6)
    ];

    const layers = [
      { radius: 90, count: 10 },   // Inner layer
      { radius: 150, count: 20 },  // Middle layer
      { radius: 220, count: 30 }   // Outer layer
    ];

    layers.forEach((layer, layerIndex) => {
      for (let i = 0; i < layer.count; i++) {
        const theta = (i / layer.count) * Math.PI * 2;
        
        objects.push({
          id: `${layerIndex}_${i}`,
          geometry: geometries[i % geometries.length],
          theta,
          radius: layer.radius,
          layerIndex,
          spinSpeed: 0.01 + Math.random() * 0.02,
          scale: 0.4 + Math.random() * 0.2
        });
      }
    });
    return objects;
  }, [objectCount, majorRadius]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const globalOffset = time * offsetSpeed;

    // Rotate central object
    if (centralRef.current) {
      centralRef.current.rotation.y = time * 0.3;
      centralRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }

    // Update orbiting objects
    orbitingObjects.forEach((obj, i) => {
      const ref = orbitingRefs.current[i];
      if (!ref) return;

      // Inner (0) and outer (2) layers rotate clockwise, middle (1) rotates counter-clockwise
      const direction = obj.layerIndex === 1 ? -1 : 1;
      const currentTheta = obj.theta + globalOffset * direction;
      const x = Math.cos(currentTheta) * obj.radius;
      const y = Math.sin(currentTheta) * obj.radius;
      const z = 0;

      ref.position.set(x, y, z);
      ref.lookAt(0, 0, 0);
      ref.rotation.z += obj.spinSpeed;
      ref.scale.setScalar(obj.scale * 5);
    });

    // Fixed camera position - no mouse parallax
  });

  return (
    <group ref={groupRef}>
      {/* Central Object */}
      <mesh ref={centralRef}>
        <icosahedronGeometry args={[35, 1]} />
        <meshStandardMaterial
          color="#6EE7FF"
          emissive="#6EE7FF"
          emissiveIntensity={0.15}
          metalness={0.1}
          roughness={0.8}
          wireframe
        />
      </mesh>

      {/* Orbiting Objects */}
      {orbitingObjects.map((obj, i) => (
        <mesh
          key={obj.id}
          ref={(el) => (orbitingRefs.current[i] = el)}
          geometry={obj.geometry}
        >
          <meshStandardMaterial
            color="#FF6EC7"
            emissive="#FF6EC7"
            emissiveIntensity={0.8}
            metalness={0.1}
            roughness={0.9}
            wireframe
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
};

const DonutBackground = ({ config = {} }) => {
  const canvasRef = useRef();
  
  const defaultConfig = {
    objectCount: 32,
    majorRadius: 120,
    minorRadius: 0,
    offsetSpeed: 0.1,
    bloomStrength: 0.2,
    pixelRatioCap: 1.5,
    reducedMode: false
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Performance detection
  useEffect(() => {
    const isLowPower = 
      navigator.deviceMemory < 2 ||
      navigator.hardwareConcurrency <= 2 ||
      /Mobi|Android/i.test(navigator.userAgent);

    if (isLowPower && !config.reducedMode) {
      finalConfig.objectCount = 8;
      finalConfig.bloomStrength = 0;
      finalConfig.pixelRatioCap = 1;
    }
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      pointerEvents: 'none'
    }}>
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 180], fov: 65 }}
        gl={{ 
          alpha: true,
          antialias: !finalConfig.reducedMode,
          powerPreference: 'high-performance'
        }}
        dpr={Math.min(window.devicePixelRatio, finalConfig.pixelRatioCap)}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[100, 100, 100]} intensity={0.5} />
        
        <DonutOrbit config={finalConfig} />
        
        {/* Bloom effect disabled for now - install @react-three/postprocessing if needed */}
      </Canvas>
    </div>
  );
};

export default DonutBackground;