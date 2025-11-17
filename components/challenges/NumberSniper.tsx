/**
 * CH03: 数字狙击 - 找出最大/最小的数字
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface NumberSniperProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

interface NumberItem {
  id: number;
  value: number;
  x: number;
  y: number;
}

export function NumberSniper({ challenge, onComplete, onMistake }: NumberSniperProps) {
  const [numbers, setNumbers] = useState<NumberItem[]>([]);
  const [targetType, setTargetType] = useState<'max' | 'min'>('max');
  const [targetValue, setTargetValue] = useState(0);

  useEffect(() => {
    const { targets = 1, distractors = 7 } = challenge.config;
    const total = targets + distractors;
    const min = 1;
    const max = 99;

    // 生成不重复的随机数字
    const values: number[] = [];
    while (values.length < total) {
      const val = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!values.includes(val)) {
        values.push(val);
      }
    }

    const type = Math.random() > 0.5 ? 'max' : 'min';
    setTargetType(type);

    const target = type === 'max' ? Math.max(...values) : Math.min(...values);
    setTargetValue(target);

    const items: NumberItem[] = values.map((val, idx) => ({
      id: idx,
      value: val,
      x: Math.random() * 75 + 5,
      y: Math.random() * 65 + 10,
    }));

    setNumbers(items.sort(() => Math.random() - 0.5));
  }, [challenge]);

  const handleClick = (item: NumberItem) => {
    audioManager.play('click');

    if (item.value === targetValue) {
      audioManager.play('success');
      setTimeout(() => onComplete(true), 200);
    } else {
      onMistake();
    }
  };

  return (
    <div className="challenge-container number-sniper">
      <div className="challenge-instruction">
        点击
        <span className="target-badge">
          {targetType === 'max' ? '最大' : '最小'}
        </span>
        的数字！
      </div>

      <div className="shapes-container">
        {numbers.map((item) => (
          <motion.div
            key={item.id}
            className="number-bubble"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
            onClick={() => handleClick(item)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: item.id * 0.05 }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {item.value}
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .number-bubble {
          position: absolute;
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          user-select: none;
        }
      `}</style>
    </div>
  );
}
