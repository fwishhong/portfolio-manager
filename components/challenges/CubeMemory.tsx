/**
 * CH08: 3D盒子记忆 - 记住旋转立方体上的符号位置
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';
import { Scene3D } from '@/components/3d/Scene3D';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface CubeMemoryProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

type Phase = 'show' | 'answer';

const symbols = ['★', '●', '■', '▲', '◆', '♥'];

function RotatingCube({
  isRotating,
  targetSymbol,
  onFaceClick
}: {
  isRotating: boolean;
  targetSymbol: string;
  onFaceClick: (symbol: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [cubeSymbols] = useState(() => {
    // 随机打乱符号
    return [...symbols].sort(() => Math.random() - 0.5);
  });

  useFrame(() => {
    if (meshRef.current && isRotating) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x += 0.01;
    }
  });

  const getFacePosition = (index: number): [number, number, number] => {
    const positions: [number, number, number][] = [
      [0, 0, 1.01],   // front
      [0, 0, -1.01],  // back
      [1.01, 0, 0],   // right
      [-1.01, 0, 0],  // left
      [0, 1.01, 0],   // top
      [0, -1.01, 0],  // bottom
    ];
    return positions[index];
  };

  const getFaceRotation = (index: number): [number, number, number] => {
    const rotations: [number, number, number][] = [
      [0, 0, 0],
      [0, Math.PI, 0],
      [0, Math.PI / 2, 0],
      [0, -Math.PI / 2, 0],
      [-Math.PI / 2, 0, 0],
      [Math.PI / 2, 0, 0],
    ];
    return rotations[index];
  };

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        if (!isRotating) {
          e.stopPropagation();
          // 找出点击的面上的符号
          const faceIndex = Math.floor(Math.random() * 6); // 简化版本
          onFaceClick(cubeSymbols[faceIndex]);
        }
      }}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4ECDC4" />

      {/* 在每个面上添加符号 */}
      {cubeSymbols.map((symbol, i) => (
        <Text
          key={i}
          position={getFacePosition(i)}
          rotation={getFaceRotation(i)}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {symbol}
        </Text>
      ))}
    </mesh>
  );
}

export function CubeMemory({ challenge, onComplete, onMistake }: CubeMemoryProps) {
  const [phase, setPhase] = useState<Phase>('show');
  const [timeLeft, setTimeLeft] = useState(3);
  const [targetSymbol, setTargetSymbol] = useState('');

  useEffect(() => {
    // 随机选择一个目标符号
    const target = symbols[Math.floor(Math.random() * symbols.length)];
    setTargetSymbol(target);
  }, [challenge]);

  useEffect(() => {
    if (phase === 'show') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0.1) {
            setPhase('answer');
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [phase]);

  const handleFaceClick = (symbol: string) => {
    audioManager.play('click');

    if (symbol === targetSymbol) {
      audioManager.play('perfect');
      setTimeout(() => onComplete(true), 300);
    } else {
      onMistake();
    }
  };

  return (
    <div className="challenge-container cube-memory">
      <div className="challenge-instruction">
        {phase === 'show' && (
          <>
            记住 <span className="target-symbol">{targetSymbol}</span> 的位置！
            ({timeLeft.toFixed(1)}s)
          </>
        )}
        {phase === 'answer' && (
          <>
            点击立方体找到 <span className="target-symbol">{targetSymbol}</span>！
          </>
        )}
      </div>

      <Scene3D cameraPosition={[0, 0, 6]}>
        <RotatingCube
          isRotating={phase === 'show'}
          targetSymbol={targetSymbol}
          onFaceClick={handleFaceClick}
        />
      </Scene3D>

      <div className="cube-hint">
        {phase === 'show' ? '立方体正在旋转...' : '点击立方体选择答案'}
      </div>
    </div>
  );
}
