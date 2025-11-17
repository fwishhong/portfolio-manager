/**
 * CH16: 影子匹配 - 根据影子判断形状 (简化2D版本)
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface ShadowMatchProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

const SHAPES = [
  { name: '圆形', emoji: '⚫', shadow: '🌑' },
  { name: '三角', emoji: '🔺', shadow: '▲' },
  { name: '方形', emoji: '⬛', shadow: '▪️' },
  { name: '星形', emoji: '⭐', shadow: '✦' },
];

export function ShadowMatch({ challenge, onComplete, onMistake }: ShadowMatchProps) {
  const [targetShape, setTargetShape] = useState(SHAPES[0]);
  const [options, setOptions] = useState(SHAPES);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const target = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    setTargetShape(target);
    setOptions([...SHAPES].sort(() => Math.random() - 0.5));

    // 旋转动画
    const interval = setInterval(() => {
      setRotation(prev => (prev + 5) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [challenge]);

  const handleOptionClick = (shape: typeof SHAPES[0]) => {
    audioManager.play('click');

    if (shape.name === targetShape.name) {
      audioManager.play('perfect');
      setTimeout(() => onComplete(true), 300);
    } else {
      onMistake();
    }
  };

  return (
    <div className="challenge-container shadow-match">
      <div className="challenge-instruction">
        根据影子选择形状
      </div>

      <motion.div
        animate={{ rotate: rotation }}
        style={{
          margin: '40px auto',
          width: '200px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6))',
          borderRadius: '24px',
          boxShadow: '0 16px 32px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{
          fontSize: '120px',
          filter: 'brightness(0) opacity(0.6)',
          transform: 'skew(-10deg, -5deg)'
        }}>
          {targetShape.shadow}
        </div>
      </motion.div>

      <div className="options-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        {options.map((shape, index) => (
          <motion.button
            key={index}
            onClick={() => handleOptionClick(shape)}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '24px',
              fontSize: '56px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            {shape.emoji}
          </motion.button>
        ))}
      </div>

      <style jsx>{`
        .shadow-match {
          padding: 40px 20px;
        }
      `}</style>
    </div>
  );
}
