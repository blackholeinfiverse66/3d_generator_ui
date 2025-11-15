import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Wireframe geometries with consistent stroke width
const WireframeShape = ({ geometry, position, rotation, scale, speed }) => {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * 0.5;
      meshRef.current.rotation.y += speed * 0.3;
      meshRef.current.rotation.z += speed * 0.2;
      
      // Subtle parallax based on mouse position
      const mouse = state.mouse;
      meshRef.current.position.x = position[0] + mouse.x * 0.02;
      meshRef.current.position.y = position[1] + mouse.y * 0.02;
    }
  });

  const wireframeMaterial = useMemo(() => 
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.06,
      transparent: true,
      wireframe: true,
    }), []
  );

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={wireframeMaterial}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
};

const BackgroundShapes = () => {
  // Reduced shape count for performance
  const shapes = useMemo(() => {
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.5, 8, 6),
      new THREE.ConeGeometry(0.5, 1, 6),
      new THREE.CylinderGeometry(0.3, 0.3, 1, 8),
      new THREE.OctahedronGeometry(0.6),
      new THREE.TetrahedronGeometry(0.7),
    ];

    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      geometry: geometries[i % geometries.length],
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 - 5,
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ],
      scale: 0.5 + Math.random() * 1.5,
      speed: 0.001 + Math.random() * 0.002,
    }));
  }, []);

  return (
    <>
      {shapes.map((shape) => (
        <WireframeShape
          key={shape.id}
          geometry={shape.geometry}
          position={shape.position}
          rotation={shape.rotation}
          scale={shape.scale}
          speed={shape.speed}
        />
      ))}
    </>
  );
};

const OptimizedBackground = () => {
  const canvasRef = useRef();

  useEffect(() => {
    // Disable parallax on mobile for performance
    const isMobile = window.innerWidth < 768;
    if (isMobile && canvasRef.current) {
      canvasRef.current.style.transform = 'none';
    }
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ 
          antialias: false, // Disable for performance
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={Math.min(window.devicePixelRatio, 2)} // Limit DPR for performance
      >
        <BackgroundShapes />
      </Canvas>
    </div>
  );
};

export default OptimizedBackground;