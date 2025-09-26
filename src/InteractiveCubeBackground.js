import React from 'react';
import { Canvas } from '@react-three-fiber/fiber';

export default function InteractiveCubeBackground() {
  return (
    <div id="canvas-container">
      <Canvas>
        <ambientLight />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="red" />
        </mesh>
      </Canvas>
    </div>
  );
}