/**
 * 3D场景组件 - React Three Fiber包装
 */

'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ReactNode } from 'react';

interface Scene3DProps {
  children: ReactNode;
  enableControls?: boolean;
  cameraPosition?: [number, number, number];
}

export function Scene3D({
  children,
  enableControls = false,
  cameraPosition = [0, 0, 5]
}: Scene3DProps) {
  return (
    <div className="scene-3d" style={{ width: '100%', height: '500px' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={cameraPosition} />

        {/* 光照 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {children}

        {enableControls && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        )}
      </Canvas>
    </div>
  );
}
