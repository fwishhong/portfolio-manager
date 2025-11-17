/**
 * CH05: 连锁反应 - 按照颜色序列快速点击
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface ChainReactionProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

type Phase = 'show' | 'input';

const COLORS = [
  { name: '红', color: '#EF4444', textColor: '#FEE2E2' },
  { name: '蓝', color: '#3B82F6', textColor: '#DBEAFE' },
  { name: '绿', color: '#10B981', textColor: '#D1FAE5' },
  { name: '黄', color: '#F59E0B', textColor: '#FEF3C7' },
  { name: '紫', color: '#8B5CF6', textColor: '#EDE9FE' },
];

export function ChainReaction({ challenge, onComplete, onMistake }: ChainReactionProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>('show');
  const [currentShowIndex, setCurrentShowIndex] = useState(-1);

  useEffect(() => {
    // 生成序列（长度3-7）
    const length = Math.min(3 + Math.floor(challenge.difficulty || 1), 7);
    const newSequence = Array.from({ length }, () => Math.floor(Math.random() * COLORS.length));
    setSequence(newSequence);

    // 依次显示序列
    showSequence(newSequence);
  }, [challenge]);

  const showSequence = async (seq: number[]) => {
    setPhase('show');
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentShowIndex(i);
      audioManager.play('click', 0.3);
      await new Promise(resolve => setTimeout(resolve, 600));
      setCurrentShowIndex(-1);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setPhase('input');
  };

  const handleColorClick = (colorIndex: number) => {
    if (phase !== 'input') return;

    audioManager.play('click');
    const newInput = [...userInput, colorIndex];
    setUserInput(newInput);

    // 检查当前输入是否正确
    if (colorIndex !== sequence[newInput.length - 1]) {
      onMistake();
      // 重新开始
      setTimeout(() => {
        setUserInput([]);
        showSequence(sequence);
      }, 800);
      return;
    }

    // 检查是否完成
    if (newInput.length === sequence.length) {
      audioManager.play('success');
      setTimeout(() => onComplete(true), 300);
    }
  };

  return (
    <div className="challenge-container chain-reaction">
      <div className="challenge-instruction">
        {phase === 'show' && '记住颜色序列！'}
        {phase === 'input' && `重复点击 (${userInput.length}/${sequence.length})`}
      </div>

      <div className="sequence-display" style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        marginBottom: '40px'
      }}>
        {sequence.map((colorIndex, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{
              scale: phase === 'show' && i <= currentShowIndex ? 1.2 :
                     userInput.length > i ? 1 : 0.6,
              opacity: phase === 'show' && i <= currentShowIndex ? 1 :
                      userInput.length > i ? 1 : 0.3
            }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: COLORS[colorIndex].color,
              border: userInput[i] === colorIndex ? '3px solid #fff' : 'none',
              boxShadow: currentShowIndex === i ? '0 0 20px rgba(255,255,255,0.8)' : 'none'
            }}
          />
        ))}
      </div>

      <div className="color-buttons" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '16px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {COLORS.map((color, index) => (
          <motion.button
            key={index}
            onClick={() => handleColorClick(index)}
            disabled={phase !== 'input'}
            whileHover={{ scale: phase === 'input' ? 1.1 : 1 }}
            whileTap={{ scale: phase === 'input' ? 0.95 : 1 }}
            style={{
              padding: '32px',
              background: `linear-gradient(135deg, ${color.color}, ${color.textColor})`,
              border: 'none',
              borderRadius: '16px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#fff',
              cursor: phase === 'input' ? 'pointer' : 'not-allowed',
              opacity: phase === 'input' ? 1 : 0.5,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            {color.name}
          </motion.button>
        ))}
      </div>

      <style jsx>{`
        .chain-reaction {
          padding: 40px 20px;
        }
        .sequence-display {
          min-height: 60px;
        }
      `}</style>
    </div>
  );
}
