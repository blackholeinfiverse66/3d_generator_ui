import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Text } from '@react-three/drei';
import { MathUtils } from 'three';

// Enhanced 3D design preview component
function DesignPreview(props) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth rotation with mouse interaction
      const targetRotationY = hovered ? state.mouse.x * 0.5 : meshRef.current.rotation.y + delta * 0.3;
      const targetRotationX = hovered ? state.mouse.y * 0.3 : meshRef.current.rotation.x + delta * 0.2;
      
      meshRef.current.rotation.y = MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, 0.05);
      meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, 0.05);
      
      // Subtle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <mesh 
        {...props} 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshStandardMaterial 
          color={hovered ? '#00ffff' : '#ff00ff'}
          metalness={0.7}
          roughness={0.2}
          emissive={hovered ? '#001122' : '#110022'}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

// Floating text component
function FloatingText() {
  return (
    <Float
      speed={1}
      rotationIntensity={0.2}
      floatIntensity={0.3}
    >
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        onError={(error) => console.warn('Font loading failed:', error)}
      >
        3D DESIGN PREVIEW
      </Text>
    </Float>
  );
}

// Enhanced 3D scene component
export default function ThreeDViewer() {
  return (
    <Canvas 
      camera={{ position: [5, 5, 5], fov: 60 }}
      style={{ background: 'transparent' }}
    >
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.8} color="#00ffff" />
      <pointLight position={[10, -10, 5]} intensity={0.6} color="#ff00ff" />
      <spotLight 
        position={[0, 10, 0]} 
        intensity={0.5} 
        color="#ffff00"
        angle={0.3}
        penumbra={0.5}
      />
      
      {/* Environment for reflections */}
      <Environment preset="city" />
      
      {/* Floating text */}
      <FloatingText />
      
      {/* Main design preview */}
      <DesignPreview position={[0, 0, 0]} />
      
      {/* Contact shadows for better grounding */}
      <ContactShadows 
        position={[0, -2, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={4} 
        color="#000000"
      />
      
      {/* Enhanced orbit controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}