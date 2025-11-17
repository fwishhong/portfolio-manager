/**
 * CH12: 倍数猎手 - 点击所有3的倍数/5的倍数
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface MultipleHunterProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

export function MultipleHunter({ challenge, onComplete, onMistake }: MultipleHunterProps) {
  const [targetMultiple, setTargetMultiple] = useState(3);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [clickedNumbers, setClickedNumbers] = useState<Set<number>>(new Set());
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    // 随机选择倍数类型
    const multiples = [3, 5];
    const target = multiples[Math.floor(Math.random() * multiples.length)];
    setTargetMultiple(target);

    // 生成10-15个数字（包含5-7个目标倍数）
    const count = 12;
    const targetCount = 6;
    const nums: number[] = [];

    // 添加目标倍数
    for (let i = 0; i < targetCount; i++) {
      const multiplier = Math.floor(Math.random() * 8) + 2; // 2-9
      nums.push(target * multiplier);
    }

    // 添加非倍数
    while (nums.length < count) {
      const num = Math.floor(Math.random() * 50) + 10;
      if (num % target !== 0 && !nums.includes(num)) {
        nums.push(num);
      }
    }

    // 打乱顺序
    setNumbers(nums.sort(() => Math.random() - 0.5));
    setCorrectCount(targetCount);
  }, [challenge]);

  const handleNumberClick = (num: number, index: number) => {
    if (clickedNumbers.has(index)) return;

    audioManager.play('click');
    const newClicked = new Set(clickedNumbers);
    newClicked.add(index);
    setClickedNumbers(newClicked);

    const isCorrect = num % targetMultiple === 0;
    if (!isCorrect) {
      onMistake();
      return;
    }

    // 检查是否全部找到
    const clickedCorrect = numbers.filter((n, i) =>
      newClicked.has(i) && n % targetMultiple === 0
    ).length;

    if (clickedCorrect === correctCount) {
      audioManager.play('success');
      setTimeout(() => onComplete(true), 300);
    }
  };

  return (
    <div className="challenge-container multiple-hunter">
      <div className="challenge-instruction">
        点击所有 <span style={{
          color: '#F59E0B',
          fontWeight: 'bold',
          fontSize: '1.3em'
        }}>{targetMultiple}的倍数</span>
      </div>

      <div className="progress-bar" style={{
        margin: '20px auto 30px',
        maxWidth: '400px',
        height: '8px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${(numbers.filter((n, i) =>
              clickedNumbers.has(i) && n % targetMultiple === 0
            ).length / correctCount) * 100}%`
          }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #10B981, #34D399)',
            borderRadius: '4px'
          }}
        />
      </div>

      <div className="numbers-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        {numbers.map((num, index) => {
          const isClicked = clickedNumbers.has(index);
          const isCorrect = num % targetMultiple === 0;
          const showResult = isClicked && isCorrect;

          return (
            <motion.button
              key={index}
              onClick={() => handleNumberClick(num, index)}
              disabled={isClicked}
              initial={{ scale: 0, y: -50 }}
              animate={{
                scale: 1,
                y: 0,
                rotate: isClicked ? 360 : 0
              }}
              transition={{
                delay: index * 0.05,
                rotate: { duration: 0.5 }
              }}
              whileHover={{ scale: isClicked ? 1 : 1.1 }}
              whileTap={{ scale: isClicked ? 1 : 0.95 }}
              style={{
                padding: '24px',
                fontSize: '32px',
                fontWeight: 'bold',
                background: showResult
                  ? 'linear-gradient(135deg, #10B981, #34D399)'
                  : isClicked
                    ? 'linear-gradient(135deg, #EF4444, #F87171)'
                    : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: '#fff',
                border: 'none',
                borderRadius: '16px',
                cursor: isClicked ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                opacity: isClicked ? 0.6 : 1,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {num}
              {showResult && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '48px'
                  }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <style jsx>{`
        .multiple-hunter {
          padding: 40px 20px;
        }
      `}</style>
    </div>
  );
}
