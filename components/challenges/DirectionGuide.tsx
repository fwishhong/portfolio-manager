/**
 * CH17: 方向指南 - 根据箭头指示选择最终方向
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface DirectionGuideProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

type Direction = 'up' | 'right' | 'down' | 'left';

const DIRECTIONS: Direction[] = ['up', 'right', 'down', 'left'];
const DIRECTION_SYMBOLS = {
  up: '↑',
  right: '→',
  down: '↓',
  left: '←',
};

const DIRECTION_LABELS = {
  up: '上',
  right: '右',
  down: '下',
  left: '左',
};

export function DirectionGuide({ challenge, onComplete, onMistake }: DirectionGuideProps) {
  const [sequence, setSequence] = useState<Direction[]>([]);
  const [finalDirection, setFinalDirection] = useState<Direction>('up');

  useEffect(() => {
    generateSequence();
  }, [challenge]);

  const generateSequence = () => {
    const { targets = 4 } = challenge.config;
    const length = Math.min(Math.max(targets, 3), 6);
    const seq: Direction[] = [];

    let currentDir = 0; // 从上开始

    for (let i = 0; i < length; i++) {
      const turn = Math.random() > 0.5 ? 1 : -1; // 右转或左转
      currentDir = (currentDir + turn + 4) % 4;
      seq.push(DIRECTIONS[currentDir]);
    }

    setSequence(seq);
    setFinalDirection(DIRECTIONS[currentDir]);
  };

  const handleChoice = (direction: Direction) => {
    audioManager.play('click');

    if (direction === finalDirection) {
      audioManager.play('success');
      setTimeout(() => onComplete(true), 200);
    } else {
      onMistake();
    }
  };

  return (
    <div className="challenge-container direction-guide">
      <div className="challenge-instruction">
        按照箭头转向，最终朝哪个方向？
      </div>

      <div className="direction-sequence">
        <div className="start-indicator">开始: ↑</div>

        <div className="arrow-chain">
          {sequence.map((dir, idx) => (
            <motion.div
              key={idx}
              className="arrow-step"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <span className="arrow-symbol">{DIRECTION_SYMBOLS[dir]}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="direction-options">
        {DIRECTIONS.map((dir, idx) => (
          <motion.button
            key={dir}
            className="direction-btn"
            onClick={() => handleChoice(dir)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sequence.length * 0.1 + idx * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="btn-symbol">{DIRECTION_SYMBOLS[dir]}</div>
            <div className="btn-label">{DIRECTION_LABELS[dir]}</div>
          </motion.button>
        ))}
      </div>

      <style jsx>{`
        .direction-sequence {
          margin: 30px 0;
        }

        .start-indicator {
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: #666;
          margin-bottom: 20px;
        }

        .arrow-chain {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .arrow-step {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .arrow-symbol {
          font-size: 2.5rem;
          color: white;
        }

        .direction-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          max-width: 400px;
          margin: 40px auto 0;
        }

        .direction-btn {
          padding: 30px;
          background: white;
          border: 3px solid #e0e0e0;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .direction-btn:hover {
          border-color: #667eea;
          background: #f5f5f5;
        }

        .btn-symbol {
          font-size: 3rem;
        }

        .btn-label {
          font-size: 1.2rem;
          font-weight: 600;
          color: #666;
        }
      `}</style>
    </div>
  );
}
