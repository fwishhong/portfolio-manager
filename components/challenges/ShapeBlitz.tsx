/**
 * CH02: 形状闪击 - 点击所有指定形状
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface ShapeBlitzProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

type ShapeType = 'circle' | 'square' | 'triangle' | 'star';

interface Shape {
  id: number;
  color: string;
  shape: ShapeType;
  x: number;
  y: number;
  rotation: number;
  isTarget: boolean;
}

export function ShapeBlitz({ challenge, onComplete, onMistake }: ShapeBlitzProps) {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [targetShape, setTargetShape] = useState<ShapeType>('circle');
  const [found, setFound] = useState(0);
  const [totalTargets, setTotalTargets] = useState(0);

  useEffect(() => {
    const { targets, distractors, colors, shapes: shapeTypes } = challenge.config;
    const allColors = colors || ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'];
    const allShapes = (shapeTypes || ['circle', 'square', 'triangle', 'star']) as ShapeType[];

    const target = allShapes[Math.floor(Math.random() * allShapes.length)];
    setTargetShape(target);
    setTotalTargets(targets);

    const generatedShapes: Shape[] = [];

    // 生成目标形状
    for (let i = 0; i < targets; i++) {
      generatedShapes.push({
        id: i,
        color: allColors[Math.floor(Math.random() * allColors.length)],
        shape: target,
        x: Math.random() * 75 + 5,
        y: Math.random() * 65 + 10,
        rotation: Math.random() * 360,
        isTarget: true,
      });
    }

    // 生成干扰形状
    const distractorShapes = allShapes.filter(s => s !== target);
    for (let i = 0; i < distractors; i++) {
      generatedShapes.push({
        id: targets + i,
        color: allColors[Math.floor(Math.random() * allColors.length)],
        shape: distractorShapes[Math.floor(Math.random() * distractorShapes.length)],
        x: Math.random() * 75 + 5,
        y: Math.random() * 65 + 10,
        rotation: Math.random() * 360,
        isTarget: false,
      });
    }

    setShapes(generatedShapes.sort(() => Math.random() - 0.5));
  }, [challenge]);

  const handleClick = (shape: Shape) => {
    audioManager.play('click');

    if (shape.isTarget) {
      setShapes(prev => prev.filter(s => s.id !== shape.id));
      const newFound = found + 1;
      setFound(newFound);

      audioManager.play('success', 0.7);

      if (newFound >= totalTargets) {
        setTimeout(() => onComplete(true), 200);
      }
    } else {
      onMistake();
    }
  };

  const getShapeName = (shape: ShapeType) => {
    const names: { [key in ShapeType]: string } = {
      circle: '圆形',
      square: '方形',
      triangle: '三角形',
      star: '星形',
    };
    return names[shape];
  };

  return (
    <div className="challenge-container shape-blitz">
      <div className="challenge-instruction">
        点击所有
        <span className="target-badge">
          {getShapeName(targetShape)}
        </span>
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
                transform: `rotate(${shape.rotation}deg)`,
              }}
              onClick={() => handleClick(shape)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, rotate: 360 }}
              whileHover={{ scale: 1.15 }}
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
