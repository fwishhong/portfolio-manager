/**
 * CH18: 图案规律 - 找出序列中的下一个图案
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface PatternRuleProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

type PatternType = 'color' | 'shape' | 'size';

export function PatternRule({ challenge, onComplete, onMistake }: PatternRuleProps) {
  const [patternType, setPatternType] = useState<PatternType>('color');
  const [sequence, setSequence] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);

  const COLORS = ['🔴', '🔵', '🟢', '🟡', '🟣'];
  const SHAPES = ['⭐', '❤️', '⬛', '🔺', '⬜'];
  const SIZES = ['small', 'medium', 'large'];

  useEffect(() => {
    const types: PatternType[] = ['color', 'shape', 'size'];
    const type = types[Math.floor(Math.random() * types.length)];
    setPatternType(type);

    let seq: string[] = [];
    let ans: string = '';
    let opts: string[] = [];

    if (type === 'color') {
      // 简单交替模式：红蓝红蓝红？
      const pattern = [
        COLORS[Math.floor(Math.random() * COLORS.length)],
        COLORS[Math.floor(Math.random() * COLORS.length)]
      ];
      seq = [pattern[0], pattern[1], pattern[0], pattern[1], pattern[0]];
      ans = pattern[1];
      opts = COLORS.slice(0, 4);
    } else if (type === 'shape') {
      // 循环模式：星心方星心？
      const pattern = [
        SHAPES[Math.floor(Math.random() * SHAPES.length)],
        SHAPES[Math.floor(Math.random() * SHAPES.length)],
        SHAPES[Math.floor(Math.random() * SHAPES.length)]
      ];
      seq = [...pattern, pattern[0], pattern[1]];
      ans = pattern[2];
      opts = SHAPES.slice(0, 4);
    } else {
      // 大小模式
      seq = ['small', 'medium', 'large', 'small', 'medium'];
      ans = 'large';
      opts = SIZES;
    }

    setSequence(seq);
    setAnswer(ans);
    setOptions(opts.sort(() => Math.random() - 0.5));
  }, [challenge]);

  const handleOptionClick = (option: string) => {
    audioManager.play('click');

    if (option === answer) {
      audioManager.play('perfect');
      setTimeout(() => onComplete(true), 300);
    } else {
      onMistake();
    }
  };

  const renderItem = (item: string, size: 'normal' | 'large' = 'normal') => {
    if (patternType === 'size') {
      const sizeMap = {
        small: size === 'large' ? '40px' : '24px',
        medium: size === 'large' ? '64px' : '40px',
        large: size === 'large' ? '88px' : '56px'
      };
      return (
        <div style={{
          width: sizeMap[item as keyof typeof sizeMap],
          height: sizeMap[item as keyof typeof sizeMap],
          background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
          borderRadius: '50%'
        }} />
      );
    }
    return <span style={{ fontSize: size === 'large' ? '64px' : '48px' }}>{item}</span>;
  };

  return (
    <div className="challenge-container pattern-rule">
      <div className="challenge-instruction">
        找出规律，选择下一个
      </div>

      <div className="sequence-display" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        margin: '40px 0',
        padding: '32px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px'
      }}>
        {sequence.map((item, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.15 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: patternType === 'size' ? '80px' : 'auto',
              minHeight: patternType === 'size' ? '80px' : 'auto'
            }}
          >
            {renderItem(item)}
          </motion.div>
        ))}

        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{
            fontSize: '64px',
            color: '#10B981',
            fontWeight: 'bold'
          }}
        >
          ?
        </motion.div>
      </div>

      <div className="options-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        {options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleOptionClick(option)}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '24px',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100px'
            }}
          >
            {renderItem(option, 'large')}
          </motion.button>
        ))}
      </div>

      <style jsx>{`
        .pattern-rule {
          padding: 40px 20px;
        }
      `}</style>
    </div>
  );
}
