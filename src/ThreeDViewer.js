import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// This is the rotating 3D box component
function Box(props) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef();

  // Rotate mesh every frame, this is outside of React's render cycle
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={'#61dafb'} /> {/* React blue color */}
    </mesh>
  );
}

// This is the main 3D scene component
export default function ThreeDViewer() {
  return (
    <Canvas>
      {/* Ambient light softens the shadows */}
      <ambientLight intensity={0.5} />
      {/* Point light acts like a light bulb */}
      <pointLight position={[10, 10, 10]} />
      
      {/* Our rotating box */}
      <Box position={[0, 0, 0]} />
      
      {/* OrbitControls allow the user to rotate the scene with the mouse */}
      <OrbitControls />
    </Canvas>
  );
}