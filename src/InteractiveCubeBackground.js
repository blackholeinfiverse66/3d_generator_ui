import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

function CentralShape() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    const targetRotationX = state.mouse.y * 0.5;
    const targetRotationY = state.mouse.x * 0.5;

    groupRef.current.rotation.x = MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotationX,
      0.05
    );
    groupRef.current.rotation.y = MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      0.05
    );

    // Add subtle continuous rotation for movement
    groupRef.current.rotation.z += delta * 0.1;
  });

  return (
    <group ref={groupRef} scale={6} position={[0, 0, 0]}>
      <mesh>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#50507a"
          metalness={0.6}
          roughness={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          wireframe
          color="#a0c4ff"
          opacity={0.5}
          transparent
        />
      </mesh>
    </group>
  );
}

function OrbitingShape({ radius, speed, initialAngle, scale = 1, shapeType }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    // Orbit around the center in 3D space (circular motion)
    const time = state.clock.elapsedTime;
    const angle = initialAngle + time * speed;
    meshRef.current.position.x = Math.cos(angle) * radius;
    meshRef.current.position.y = Math.sin(angle) * radius * 0.5; // Vertical component for circular motion
    meshRef.current.position.z = Math.sin(angle) * radius;

    // Rotate the shape itself
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.3;
  });

  const getGeometry = () => {
    switch (shapeType) {
      case 'cube':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.8, 16, 16]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.6, 0.6, 1.2, 16]} />;
      case 'cone':
        return <coneGeometry args={[0.8, 1.2, 8]} />;
      case 'torus':
        return <torusGeometry args={[0.6, 0.3, 8, 16]} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.8, 0]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[1, 0]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[0.8, 0]} />;
      default:
        return <icosahedronGeometry args={[0.8, 0]} />;
    }
  };

  return (
    <group ref={meshRef} scale={scale}>
      <mesh>
        {getGeometry()}
        <meshStandardMaterial
          color="#50507a"
          metalness={0.6}
          roughness={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>
      <mesh>
        {getGeometry()}
        <meshStandardMaterial
          wireframe
          color="#a0c4ff"
          opacity={0.5}
          transparent
        />
      </mesh>
    </group>
  );
}

function InteractiveCubeBackground() {
  const shapes = React.useMemo(() => ['cube', 'sphere', 'cylinder', 'cone', 'torus', 'octahedron', 'tetrahedron', 'dodecahedron', 'icosahedron'], []);

  const getRandomShape = () => shapes[Math.floor(Math.random() * shapes.length)];

  // Generate consistent random shapes for each layer to prevent re-rendering changes
  const layerShapes = React.useMemo(() => ({
    layer1: Array.from({length: 6}, () => shapes[Math.floor(Math.random() * shapes.length)]),
    layer2: Array.from({length: 8}, () => shapes[Math.floor(Math.random() * shapes.length)]),
    layer3: Array.from({length: 12}, () => shapes[Math.floor(Math.random() * shapes.length)]),
    layer4: Array.from({length: 16}, () => shapes[Math.floor(Math.random() * shapes.length)]),
    layer5: Array.from({length: 20}, () => shapes[Math.floor(Math.random() * shapes.length)])
  }), [shapes]);

  return (
    <div id="canvas-container">
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#e0aaff" />
        <CentralShape />

        {/* Layer 1 - Closest to center */}
        <OrbitingShape radius={10} speed={0.6} initialAngle={0} scale={1.2} shapeType={layerShapes.layer1[0]} />
        <OrbitingShape radius={10} speed={0.6} initialAngle={Math.PI / 2} scale={1.2} shapeType={layerShapes.layer1[1]} />
        <OrbitingShape radius={10} speed={0.6} initialAngle={Math.PI} scale={1.2} shapeType={layerShapes.layer1[2]} />
        <OrbitingShape radius={10} speed={0.6} initialAngle={Math.PI * 3 / 2} scale={1.2} shapeType={layerShapes.layer1[3]} />
        <OrbitingShape radius={10} speed={0.6} initialAngle={Math.PI / 4} scale={1.2} shapeType={layerShapes.layer1[4]} />
        <OrbitingShape radius={10} speed={0.6} initialAngle={Math.PI * 3 / 4} scale={1.2} shapeType={layerShapes.layer1[5]} />

        {/* Layer 2 - Middle distance */}
        <OrbitingShape radius={15} speed={0.4} initialAngle={0} scale={1.0} shapeType={layerShapes.layer2[0]} />
        <OrbitingShape radius={15} speed={0.4} initialAngle={Math.PI / 3} scale={1.0} shapeType={layerShapes.layer2[1]} />
        <OrbitingShape radius={15} speed={0.4} initialAngle={Math.PI * 2 / 3} scale={1.0} shapeType={layerShapes.layer2[2]} />
        <OrbitingShape radius={15} speed={0.4} initialAngle={Math.PI} scale={1.0} shapeType={layerShapes.layer2[3]} />
        <OrbitingShape radius={15} speed={0.4} initialAngle={Math.PI * 4 / 3} scale={1.0} shapeType={layerShapes.layer2[4]} />
        <OrbitingShape radius={15} speed={0.4} initialAngle={Math.PI * 5 / 3} scale={1.0} shapeType={layerShapes.layer2[5]} />
        <OrbitingShape radius={15} speed={0.4} initialAngle={Math.PI / 6} scale={1.0} shapeType={layerShapes.layer2[6]} />
        <OrbitingShape radius={15} speed={0.4} initialAngle={Math.PI / 2} scale={1.0} shapeType={layerShapes.layer2[7]} />

        {/* Layer 3 - Outer layer */}
        <OrbitingShape radius={22} speed={0.25} initialAngle={0} scale={0.8} shapeType={layerShapes.layer3[0]} />
        <OrbitingShape radius={22} speed={0.25} initialAngle={Math.PI / 6} scale={0.8} shapeType={layerShapes.layer3[1]} />
        <OrbitingShape radius={22} speed={0.25} initialAngle={Math.PI / 3} scale={0.8} shapeType={layerShapes.layer3[2]} />
        <OrbitingShape radius={22} speed={0.25} initialAngle={Math.PI / 2} scale={0.8} shapeType={layerShapes.layer3[3]} />
        <OrbitingShape radius={22} speed={0.25} initialAngle={Math.PI * 2 / 3} scale={0.8} shapeType={layerShapes.layer3[4]} />
        <OrbitingShape radius={22} speed={0.25} initialAngle={Math.PI * 5 / 6} scale={0.8} shapeType={layerShapes.layer3[5]} />
        <OrbitingShape radius={22} speed={0.25} initialAngle={Math.PI} scale={0.8} shapeType={layerShapes.layer3[6]} />
        <OrbitingShape radius={22} speed={0.25} initialAngle={Math.PI * 7 / 6} scale={0.8} shapeType={layerShapes.layer3[7]} />
        <OrbitingShape radius={22} speed={0.25} initialAngle={Math.PI * 4 / 3} scale={0.8} shapeType={layerShapes.layer3[8]} />
        <OrbitingShape radius={22} speed={0.25} initialAngle={Math.PI * 3 / 2} scale={0.8} shapeType={layerShapes.layer3[9]} />
        <OrbitingShape radius={22} speed={0.25} initialAngle={Math.PI * 5 / 3} scale={0.8} shapeType={layerShapes.layer3[10]} />
        <OrbitingShape radius={22} speed={0.25} initialAngle={Math.PI * 11 / 6} scale={0.8} shapeType={layerShapes.layer3[11]} />

        {/* Layer 4 - Furthest layer */}
        <OrbitingShape radius={28} speed={0.15} initialAngle={0} scale={0.6} shapeType={layerShapes.layer4[0]} />
        <OrbitingShape radius={28} speed={0.15} initialAngle={Math.PI / 8} scale={0.6} shapeType={layerShapes.layer4[1]} />
        <OrbitingShape radius={28} speed={0.15} initialAngle={Math.PI / 4} scale={0.6} shapeType={layerShapes.layer4[2]} />
        <OrbitingShape radius={28} speed={0.15} initialAngle={Math.PI * 3 / 8} scale={0.6} shapeType={layerShapes.layer4[3]} />
        <OrbitingShape radius={28} speed={0.15} initialAngle={Math.PI / 2} scale={0.6} shapeType={layerShapes.layer4[4]} />
        <OrbitingShape radius={28} speed={0.15} initialAngle={Math.PI * 5 / 8} scale={0.6} shapeType={layerShapes.layer4[5]} />
        <OrbitingShape radius={28} speed={0.15} initialAngle={Math.PI * 3 / 4} scale={0.6} shapeType={layerShapes.layer4[6]} />
        <OrbitingShape radius={28} speed={0.15} initialAngle={Math.PI * 7 / 8} scale={0.6} shapeType={layerShapes.layer4[7]} />
        <OrbitingShape radius={28} speed={0.15} initialAngle={Math.PI} scale={0.6} shapeType={layerShapes.layer4[8]} />
        <OrbitingShape radius={28} speed={0.15} initialAngle={Math.PI * 9 / 8} scale={0.6} shapeType={layerShapes.layer4[9]} />
        <OrbitingShape radius={28} speed={0.15} initialAngle={Math.PI * 5 / 4} scale={0.6} shapeType={layerShapes.layer4[10]} />
        <OrbitingShape radius={28} speed={0.15} initialAngle={Math.PI * 11 / 8} scale={0.6} shapeType={layerShapes.layer4[11]} />
        <OrbitingShape radius={28} speed={0.15} initialAngle={Math.PI * 3 / 2} scale={0.6} shapeType={layerShapes.layer4[12]} />
        <OrbitingShape radius={28} speed={0.15} initialAngle={Math.PI * 13 / 8} scale={0.6} shapeType={layerShapes.layer4[13]} />
        <OrbitingShape radius={28} speed={0.15} initialAngle={Math.PI * 7 / 4} scale={0.6} shapeType={layerShapes.layer4[14]} />
        <OrbitingShape radius={28} speed={0.15} initialAngle={Math.PI * 15 / 8} scale={0.6} shapeType={layerShapes.layer4[15]} />

        {/* Layer 5 - Outermost layer */}
        <OrbitingShape radius={35} speed={0.1} initialAngle={0} scale={0.5} shapeType={layerShapes.layer5[0]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI / 10} scale={0.5} shapeType={layerShapes.layer5[1]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI / 5} scale={0.5} shapeType={layerShapes.layer5[2]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI * 3 / 10} scale={0.5} shapeType={layerShapes.layer5[3]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI * 2 / 5} scale={0.5} shapeType={layerShapes.layer5[4]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI / 2} scale={0.5} shapeType={layerShapes.layer5[5]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI * 3 / 5} scale={0.5} shapeType={layerShapes.layer5[6]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI * 7 / 10} scale={0.5} shapeType={layerShapes.layer5[7]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI * 4 / 5} scale={0.5} shapeType={layerShapes.layer5[8]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI * 9 / 10} scale={0.5} shapeType={layerShapes.layer5[9]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI} scale={0.5} shapeType={layerShapes.layer5[10]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI * 11 / 10} scale={0.5} shapeType={layerShapes.layer5[11]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI * 6 / 5} scale={0.5} shapeType={layerShapes.layer5[12]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI * 13 / 10} scale={0.5} shapeType={layerShapes.layer5[13]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI * 7 / 5} scale={0.5} shapeType={layerShapes.layer5[14]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI * 3 / 2} scale={0.5} shapeType={layerShapes.layer5[15]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI * 8 / 5} scale={0.5} shapeType={layerShapes.layer5[16]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI * 17 / 10} scale={0.5} shapeType={layerShapes.layer5[17]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI * 9 / 5} scale={0.5} shapeType={layerShapes.layer5[18]} />
        <OrbitingShape radius={35} speed={0.1} initialAngle={Math.PI * 19 / 10} scale={0.5} shapeType={layerShapes.layer5[19]} />

        {/* Layer 6 - Bottom filling layer */}
        <OrbitingShape radius={45} speed={0.08} initialAngle={0} scale={0.4} shapeType={getRandomShape()} />
        <OrbitingShape radius={45} speed={0.08} initialAngle={Math.PI / 8} scale={0.4} shapeType={getRandomShape()} />
        <OrbitingShape radius={45} speed={0.08} initialAngle={Math.PI / 4} scale={0.4} shapeType={getRandomShape()} />
        <OrbitingShape radius={45} speed={0.08} initialAngle={Math.PI * 3 / 8} scale={0.4} shapeType={getRandomShape()} />
        <OrbitingShape radius={45} speed={0.08} initialAngle={Math.PI / 2} scale={0.4} shapeType={getRandomShape()} />
        <OrbitingShape radius={45} speed={0.08} initialAngle={Math.PI * 5 / 8} scale={0.4} shapeType={getRandomShape()} />
        <OrbitingShape radius={45} speed={0.08} initialAngle={Math.PI * 3 / 4} scale={0.4} shapeType={getRandomShape()} />
        <OrbitingShape radius={45} speed={0.08} initialAngle={Math.PI * 7 / 8} scale={0.4} shapeType={getRandomShape()} />
        <OrbitingShape radius={45} speed={0.08} initialAngle={Math.PI} scale={0.4} shapeType={getRandomShape()} />
        <OrbitingShape radius={45} speed={0.08} initialAngle={Math.PI * 9 / 8} scale={0.4} shapeType={getRandomShape()} />
        <OrbitingShape radius={45} speed={0.08} initialAngle={Math.PI * 5 / 4} scale={0.4} shapeType={getRandomShape()} />
        <OrbitingShape radius={45} speed={0.08} initialAngle={Math.PI * 11 / 8} scale={0.4} shapeType={getRandomShape()} />
        <OrbitingShape radius={45} speed={0.08} initialAngle={Math.PI * 3 / 2} scale={0.4} shapeType={getRandomShape()} />
        <OrbitingShape radius={45} speed={0.08} initialAngle={Math.PI * 13 / 8} scale={0.4} shapeType={getRandomShape()} />
        <OrbitingShape radius={45} speed={0.08} initialAngle={Math.PI * 7 / 4} scale={0.4} shapeType={getRandomShape()} />
        <OrbitingShape radius={45} speed={0.08} initialAngle={Math.PI * 15 / 8} scale={0.4} shapeType={getRandomShape()} />

        {/* Layer 7 - Extra bottom layer */}
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI / 12} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI / 6} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI / 4} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI / 3} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 5 / 12} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI / 2} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 7 / 12} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 2 / 3} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 3 / 4} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 5 / 6} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 11 / 12} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 13 / 12} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 7 / 6} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 5 / 4} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 4 / 3} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 17 / 12} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 3 / 2} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 19 / 12} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 5 / 3} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 7 / 4} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 11 / 6} scale={0.35} shapeType={getRandomShape()} />
        <OrbitingShape radius={55} speed={0.05} initialAngle={Math.PI * 23 / 12} scale={0.35} shapeType={getRandomShape()} />
      </Canvas>
    </div>
  );
}

export default InteractiveCubeBackground;