/**
 * CH11: 数字比较 - 选择更大/更小的数字
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface NumberCompareProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

export function NumberCompare({ challenge, onComplete, onMistake }: NumberCompareProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [targetType, setTargetType] = useState<'larger' | 'smaller'>('larger');

  useEffect(() => {
    generateNumbers();
  }, [challenge]);

  const generateNumbers = () => {
    const a = Math.floor(Math.random() * 99) + 1;
    let b = Math.floor(Math.random() * 99) + 1;

    // 确保两个数字不相等
    while (b === a) {
      b = Math.floor(Math.random() * 99) + 1;
    }

    setNum1(a);
    setNum2(b);
    setTargetType(Math.random() > 0.5 ? 'larger' : 'smaller');
  };

  const handleChoice = (number: number) => {
    audioManager.play('click');

    const isCorrect =
      (targetType === 'larger' && number === Math.max(num1, num2)) ||
      (targetType === 'smaller' && number === Math.min(num1, num2));

    if (isCorrect) {
      audioManager.play('success');
      setTimeout(() => onComplete(true), 200);
    } else {
      onMistake();
    }
  };

  return (
    <div className="challenge-container number-compare">
      <div className="challenge-instruction">
        选择
        <span className="target-badge">
          {targetType === 'larger' ? '更大' : '更小'}
        </span>
        的数字
      </div>

      <div className="compare-board">
        <motion.button
          className="number-option left"
          onClick={() => handleChoice(num1)}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.1, rotateZ: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          {num1}
        </motion.button>

        <div className="vs-divider">VS</div>

        <motion.button
          className="number-option right"
          onClick={() => handleChoice(num2)}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.1, rotateZ: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          {num2}
        </motion.button>
      </div>

      <style jsx>{`
        .compare-board {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
        }

        .number-option {
          width: 160px;
          height: 160px;
          border: none;
          border-radius: 20px;
          font-size: 4rem;
          font-weight: 900;
          color: white;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          transition: all 0.3s;
        }

        .number-option.left {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .number-option.right {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .vs-divider {
          font-size: 2rem;
          font-weight: bold;
          color: #999;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
