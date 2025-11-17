/**
 * CH07: 颜色序列 - Simon Says游戏，记住颜色闪烁顺序
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface ColorSequenceProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

type ColorButton = {
  id: number;
  color: string;
  label: string;
};

type Phase = 'show' | 'input';

const COLORS: ColorButton[] = [
  { id: 0, color: '#FF6B6B', label: '红' },
  { id: 1, color: '#4ECDC4', label: '青' },
  { id: 2, color: '#FFE66D', label: '黄' },
  { id: 3, color: '#95E1D3', label: '绿' },
];

export function ColorSequence({ challenge, onComplete, onMistake }: ColorSequenceProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>('show');
  const [currentFlash, setCurrentFlash] = useState<number | null>(null);
  const [showingIndex, setShowingIndex] = useState(0);

  useEffect(() => {
    // 生成随机序列
    const { targets = 4 } = challenge.config;
    const length = Math.min(targets, 8);
    const seq: number[] = [];
    for (let i = 0; i < length; i++) {
      seq.push(Math.floor(Math.random() * 4));
    }
    setSequence(seq);
  }, [challenge]);

  useEffect(() => {
    if (phase === 'show' && sequence.length > 0) {
      showSequence();
    }
  }, [phase, sequence]);

  const showSequence = async () => {
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentFlash(sequence[i]);
      setShowingIndex(i);
      audioManager.play('click');

      await new Promise(resolve => setTimeout(resolve, 600));
      setCurrentFlash(null);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setPhase('input');
  };

  const handleColorClick = (colorId: number) => {
    if (phase !== 'input') return;

    audioManager.play('click');
    const newInput = [...userInput, colorId];
    setUserInput(newInput);

    // 检查当前输入是否正确
    if (newInput[newInput.length - 1] !== sequence[newInput.length - 1]) {
      onMistake();
      // 重新开始
      setTimeout(() => {
        setUserInput([]);
        setPhase('show');
        setShowingIndex(0);
      }, 800);
      return;
    }

    // 检查是否完成
    if (newInput.length === sequence.length) {
      audioManager.play('perfect');
      setTimeout(() => onComplete(true), 300);
    }
  };

  return (
    <div className="challenge-container color-sequence">
      <div className="challenge-instruction">
        {phase === 'show' && '记住颜色闪烁的顺序！'}
        {phase === 'input' && `重复序列 (${userInput.length}/${sequence.length})`}
      </div>

      <div className="simon-board">
        {COLORS.map((btn) => (
          <motion.button
            key={btn.id}
            className={`simon-button ${currentFlash === btn.id ? 'flashing' : ''}`}
            style={{
              backgroundColor: btn.color,
              opacity: currentFlash === btn.id ? 1 : phase === 'show' ? 0.3 : 0.6,
            }}
            onClick={() => handleColorClick(btn.id)}
            disabled={phase === 'show'}
            whileHover={phase === 'input' ? { scale: 1.05 } : {}}
            whileTap={phase === 'input' ? { scale: 0.95 } : {}}
          >
            {btn.label}
          </motion.button>
        ))}
      </div>

      <div className="sequence-display">
        {sequence.map((colorId, idx) => (
          <div
            key={idx}
            className={`sequence-dot ${idx < userInput.length ? 'filled' : ''} ${idx === showingIndex && phase === 'show' ? 'current' : ''}`}
            style={{
              backgroundColor: idx < userInput.length ? COLORS[userInput[idx]].color : '#ddd',
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .simon-board {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          max-width: 400px;
          margin: 40px auto;
        }

        .simon-button {
          aspect-ratio: 1;
          border: none;
          border-radius: 16px;
          font-size: 2rem;
          font-weight: bold;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .simon-button:disabled {
          cursor: not-allowed;
        }

        .simon-button.flashing {
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.8);
          transform: scale(1.05);
        }

        .sequence-display {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 30px;
        }

        .sequence-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #ccc;
          transition: all 0.3s;
        }

        .sequence-dot.current {
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
          transform: scale(1.3);
        }
      `}</style>
    </div>
  );
}
