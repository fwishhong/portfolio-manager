/**
 * CH14: 真假判断 - 判断陈述是否正确
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface TrueFalseProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

interface Statement {
  text: string;
  isTrue: boolean;
}

export function TrueFalse({ challenge, onComplete, onMistake }: TrueFalseProps) {
  const [statement, setStatement] = useState<Statement>({ text: '', isTrue: true });

  useEffect(() => {
    generateStatement();
  }, [challenge]);

  const generateStatement = () => {
    const statements: Statement[] = [
      // 数学陈述
      { text: '3 + 5 = 8', isTrue: true },
      { text: '7 × 2 = 15', isTrue: false },
      { text: '10 - 4 = 6', isTrue: true },
      { text: '12 ÷ 3 = 5', isTrue: false },
      { text: '15 > 10', isTrue: true },
      { text: '8 < 5', isTrue: false },

      // 颜色陈述
      { text: '红色 + 蓝色 = 紫色', isTrue: true },
      { text: '黄色 + 蓝色 = 橙色', isTrue: false },
      { text: '红色 + 黄色 = 橙色', isTrue: true },

      // 形状陈述
      { text: '圆形有 0 个角', isTrue: true },
      { text: '三角形有 4 个角', isTrue: false },
      { text: '正方形有 4 条边', isTrue: true },
      { text: '五边形有 6 个角', isTrue: false },

      // 逻辑陈述
      { text: '1 小时 = 60 分钟', isTrue: true },
      { text: '1 周 = 5 天', isTrue: false },
      { text: '1 年 = 12 个月', isTrue: true },
      { text: '1 天 = 25 小时', isTrue: false },

      // 常识陈述
      { text: '太阳从东方升起', isTrue: true },
      { text: '地球是方形的', isTrue: false },
      { text: '水的沸点是100°C', isTrue: true },
      { text: '人有三只眼睛', isTrue: false },
    ];

    const selected = statements[Math.floor(Math.random() * statements.length)];
    setStatement(selected);
  };

  const handleAnswer = (answer: boolean) => {
    audioManager.play('click');

    if (answer === statement.isTrue) {
      audioManager.play('success');
      setTimeout(() => onComplete(true), 300);
    } else {
      onMistake();
    }
  };

  return (
    <div className="challenge-container true-false">
      <div className="statement-card">
        <motion.div
          className="statement-text"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {statement.text}
        </motion.div>

        <div className="answer-buttons">
          <motion.button
            className="answer-btn true-btn"
            onClick={() => handleAnswer(true)}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ✓ 正确
          </motion.button>

          <motion.button
            className="answer-btn false-btn"
            onClick={() => handleAnswer(false)}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ✗ 错误
          </motion.button>
        </div>
      </div>
    </div>
  );
}
