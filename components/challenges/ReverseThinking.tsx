/**
 * CH23: 逆向思维 - 做出与指令相反的操作
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface ReverseThinkingProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

type Instruction = {
  text: string;
  correctColor: string;
  wrongColor: string;
};

const INSTRUCTIONS: Instruction[] = [
  { text: '点击红色', correctColor: '#4ECDC4', wrongColor: '#FF6B6B' },
  { text: '点击蓝色', correctColor: '#FF6B6B', wrongColor: '#4ECDC4' },
  { text: '点击黄色', correctColor: '#95E1D3', wrongColor: '#FFE66D' },
  { text: '点击绿色', correctColor: '#FFE66D', wrongColor: '#95E1D3' },
];

export function ReverseThinking({ challenge, onComplete, onMistake }: ReverseThinkingProps) {
  const [instruction, setInstruction] = useState<Instruction | null>(null);

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * INSTRUCTIONS.length);
    setInstruction(INSTRUCTIONS[randomIdx]);
  }, [challenge]);

  const handleChoice = (isCorrect: boolean) => {
    audioManager.play('click');

    if (isCorrect) {
      audioManager.play('success');
      setTimeout(() => onComplete(true), 200);
    } else {
      onMistake();
    }
  };

  if (!instruction) return null;

  return (
    <div className="challenge-container reverse-thinking">
      <div className="warning-banner">
        ⚠️ 做出相反的操作！⚠️
      </div>

      <div className="challenge-instruction">
        指令: <span className="instruction-text">{instruction.text}</span>
      </div>

      <div className="choice-area">
        <motion.button
          className="color-choice"
          style={{ backgroundColor: instruction.wrongColor }}
          onClick={() => handleChoice(false)}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.1, rotateZ: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="choice-label">这个颜色</div>
        </motion.button>

        <div className="separator">OR</div>

        <motion.button
          className="color-choice"
          style={{ backgroundColor: instruction.correctColor }}
          onClick={() => handleChoice(true)}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.1, rotateZ: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="choice-label">这个颜色</div>
        </motion.button>
      </div>

      <div className="hint-text">
        记住：要做相反的选择！
      </div>

      <style jsx>{`
        .warning-banner {
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
          padding: 15px;
          border-radius: 12px;
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: #d32f2f;
          margin-bottom: 20px;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .instruction-text {
          color: #667eea;
          font-size: 1.8rem;
          text-decoration: line-through;
          text-decoration-color: #ff6b6b;
          text-decoration-thickness: 3px;
        }

        .choice-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
          margin: 40px 0;
        }

        .color-choice {
          width: 180px;
          height: 180px;
          border: 5px solid white;
          border-radius: 24px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .choice-label {
          font-size: 1.4rem;
          font-weight: bold;
          color: white;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .separator {
          font-size: 1.5rem;
          font-weight: bold;
          color: #999;
        }

        .hint-text {
          text-align: center;
          font-size: 1.2rem;
          color: #d32f2f;
          font-weight: 600;
          animation: blink 1.5s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
