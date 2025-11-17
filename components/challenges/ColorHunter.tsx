/**
 * CH01: 颜色猎手 - 快速点击指定颜色的形状
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface ColorHunterProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

interface Shape {
  id: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  x: number;
  y: number;
  isTarget: boolean;
}

export function ColorHunter({ challenge, onComplete, onMistake }: ColorHunterProps) {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [targetColor, setTargetColor] = useState('');
  const [found, setFound] = useState(0);
  const [totalTargets, setTotalTargets] = useState(0);

  // 生成形状
  useEffect(() => {
    const { targets = 1, distractors = 7, colors, shapes: shapeTypes } = challenge.config;
    const allColors = colors || ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A8E6CF'];
    const allShapes = (shapeTypes || ['circle', 'square', 'triangle']) as ('circle' | 'square' | 'triangle')[];

    const targetColorIndex = Math.floor(Math.random() * allColors.length);
    const target = allColors[targetColorIndex];
    setTargetColor(target);
    setTotalTargets(targets);

    const generatedShapes: Shape[] = [];

    // 生成目标形状
    for (let i = 0; i < targets; i++) {
      generatedShapes.push({
        id: i,
        color: target,
        shape: allShapes[Math.floor(Math.random() * allShapes.length)],
        x: Math.random() * 75 + 5,
        y: Math.random() * 65 + 10,
        isTarget: true,
      });
    }

    // 生成干扰形状
    for (let i = 0; i < distractors; i++) {
      const distractorColors = allColors.filter(c => c !== target);
      generatedShapes.push({
        id: targets + i,
        color: distractorColors[Math.floor(Math.random() * distractorColors.length)],
        shape: allShapes[Math.floor(Math.random() * allShapes.length)],
        x: Math.random() * 75 + 5,
        y: Math.random() * 65 + 10,
        isTarget: false,
      });
    }

    // 打乱顺序
    setShapes(generatedShapes.sort(() => Math.random() - 0.5));
  }, [challenge]);

  const handleClick = (shape: Shape) => {
    audioManager.play('click');

    if (shape.isTarget) {
      // 正确！移除形状
      setShapes(prev => prev.filter(s => s.id !== shape.id));
      const newFound = found + 1;
      setFound(newFound);

      audioManager.play('success', 0.7);

      // 检查是否全部找到
      if (newFound >= totalTargets) {
        setTimeout(() => onComplete(true), 200);
      }
    } else {
      // 错误
      onMistake();
    }
  };

  return (
    <div className="challenge-container color-hunter">
      <div className="challenge-instruction">
        点击所有
        <span
          className="color-badge"
          style={{
            backgroundColor: targetColor,
            padding: '6px 16px',
            borderRadius: '8px',
            margin: '0 10px',
            display: 'inline-block',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          {targetColor}
        </span>
        颜色的形状！
      </div>

      <div className="shapes-container">
        <AnimatePresence>
          {shapes.map((shape) => (
            <motion.div
              key={shape.id}
              className={`shape shape-${shape.shape}`}
              style={{
                backgroundColor: shape.color,
                left: `${shape.x}%`,
                top: `${shape.y}%`,
                position: 'absolute',
                width: '60px',
                height: '60px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
              onClick={() => handleClick(shape)}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180, transition: { duration: 0.3 } }}
              whileHover={{ scale: 1.15, transition: { duration: 0.1 } }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="challenge-progress">
        找到: {found}/{totalTargets}
      </div>
    </div>
  );
}
