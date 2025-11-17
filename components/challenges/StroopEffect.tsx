/**
 * CH24: 颜色文字混淆 - Stroop效应测试
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface StroopEffectProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

type ColorInfo = {
  name: string;
  color: string;
  label: string;
};

const COLORS: ColorInfo[] = [
  { name: '红色', color: '#FF6B6B', label: '红' },
  { name: '蓝色', color: '#4ECDC4', label: '蓝' },
  { name: '黄色', color: '#FFE66D', label: '黄' },
  { name: '绿色', color: '#95E1D3', label: '绿' },
];

export function StroopEffect({ challenge, onComplete, onMistake }: StroopEffectProps) {
  const [textColor, setTextColor] = useState<ColorInfo | null>(null);
  const [displayColor, setDisplayColor] = useState<ColorInfo | null>(null);
  const [questionType, setQuestionType] = useState<'text' | 'color'>('color');

  useEffect(() => {
    generateQuestion();
  }, [challenge]);

  const generateQuestion = () => {
    const text = COLORS[Math.floor(Math.random() * COLORS.length)];
    let display = COLORS[Math.floor(Math.random() * COLORS.length)];

    // 确保文字内容和显示颜色不同（制造冲突）
    while (display.name === text.name) {
      display = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    setTextColor(text);
    setDisplayColor(display);
    setQuestionType(Math.random() > 0.5 ? 'text' : 'color');
  };

  const handleChoice = (color: ColorInfo) => {
    audioManager.play('click');

    const isCorrect =
      (questionType === 'text' && color.name === textColor?.name) ||
      (questionType === 'color' && color.color === displayColor?.color);

    if (isCorrect) {
      audioManager.play('success');
      setTimeout(() => onComplete(true), 200);
    } else {
      onMistake();
    }
  };

  if (!textColor || !displayColor) return null;

  return (
    <div className="challenge-container stroop-effect">
      <div className="challenge-instruction">
        回答: {questionType === 'text' ? '文字内容' : '文字颜色'}是什么？
      </div>

      <motion.div
        className="stroop-display"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <div
          className="stroop-text"
          style={{ color: displayColor.color }}
        >
          {textColor.name}
        </div>
      </motion.div>

      <div className="question-reminder">
        {questionType === 'text' ? '👁️ 看文字说了什么' : '🎨 看文字是什么颜色'}
      </div>

      <div className="color-options">
        {COLORS.map((color, idx) => (
          <motion.button
            key={color.name}
            className="color-option"
            onClick={() => handleChoice(color)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className="color-swatch"
              style={{ backgroundColor: color.color }}
            />
            <div className="color-name">{color.label}</div>
          </motion.button>
        ))}
      </div>

      <style jsx>{`
        .stroop-display {
          margin: 40px 0;
          padding: 60px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .stroop-text {
          font-size: 4rem;
          font-weight: 900;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 4px;
        }

        .question-reminder {
          text-align: center;
          font-size: 1.3rem;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 30px;
          padding: 12px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 12px;
        }

        .color-options {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .color-option {
          padding: 20px;
          background: white;
          border: 3px solid #e0e0e0;
          border-radius: 16px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
        }

        .color-option:hover {
          border-color: #667eea;
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .color-swatch {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .color-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }
      `}</style>
    </div>
  );
}
