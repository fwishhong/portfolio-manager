/**
 * CH09: 消失的物品 - 记住5个物品，找出被移除的那个
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface MissingItemProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

type Phase = 'show' | 'hide' | 'answer';

const ITEMS = [
  { emoji: '🍎', name: '苹果' },
  { emoji: '🍌', name: '香蕉' },
  { emoji: '🍇', name: '葡萄' },
  { emoji: '🍊', name: '橙子' },
  { emoji: '🍓', name: '草莓' },
  { emoji: '🍑', name: '桃子' },
  { emoji: '🍒', name: '樱桃' },
  { emoji: '🍍', name: '菠萝' },
  { emoji: '🥝', name: '猕猴桃' },
  { emoji: '🍉', name: '西瓜' },
];

export function MissingItem({ challenge, onComplete, onMistake }: MissingItemProps) {
  const [phase, setPhase] = useState<Phase>('show');
  const [allItems, setAllItems] = useState<typeof ITEMS>([]);
  const [displayedItems, setDisplayedItems] = useState<typeof ITEMS>([]);
  const [missingItem, setMissingItem] = useState<typeof ITEMS[0] | null>(null);
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    // 随机选择5个物品
    const shuffled = [...ITEMS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    setAllItems(selected);
    setDisplayedItems(selected);

    // 显示阶段（3秒）
    const showTimer = setTimeout(() => {
      setPhase('hide');

      // 隐藏阶段（1秒）
      setTimeout(() => {
        // 随机移除一个
        const removeIndex = Math.floor(Math.random() * selected.length);
        const removed = selected[removeIndex];
        const remaining = selected.filter((_, i) => i !== removeIndex);

        setMissingItem(removed);
        setDisplayedItems(remaining);
        setPhase('answer');
      }, 1000);
    }, 3000);

    return () => clearTimeout(showTimer);
  }, [challenge]);

  useEffect(() => {
    if (phase === 'show') {
      const timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 0.1));
      }, 100);
      return () => clearInterval(timer);
    }
  }, [phase]);

  const handleItemClick = (item: typeof ITEMS[0]) => {
    if (phase !== 'answer') return;

    audioManager.play('click');

    if (item === missingItem) {
      audioManager.play('perfect');
      setTimeout(() => onComplete(true), 300);
    } else {
      onMistake();
    }
  };

  return (
    <div className="challenge-container missing-item">
      <div className="challenge-instruction">
        {phase === 'show' && `记住这些物品！(${timeLeft.toFixed(1)}s)`}
        {phase === 'hide' && '正在隐藏...'}
        {phase === 'answer' && '哪个物品消失了？'}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'show' && (
          <motion.div
            key="show"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="items-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '20px',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            {displayedItems.map((item, index) => (
              <motion.div
                key={item.emoji}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  fontSize: '64px',
                  textAlign: 'center',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }}
              >
                {item.emoji}
              </motion.div>
            ))}
          </motion.div>
        )}

        {phase === 'hide' && (
          <motion.div
            key="hide"
            initial={{ scale: 1 }}
            animate={{ scale: 0.8, opacity: 0.5 }}
            style={{
              fontSize: '80px',
              textAlign: 'center',
              padding: '60px'
            }}
          >
            ❓
          </motion.div>
        )}

        {phase === 'answer' && (
          <motion.div
            key="answer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="items-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '20px',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            {allItems.map((item) => (
              <motion.button
                key={item.emoji}
                onClick={() => handleItemClick(item)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  fontSize: '64px',
                  textAlign: 'center',
                  padding: '20px',
                  background: displayedItems.includes(item)
                    ? 'linear-gradient(135deg, #667eea, #764ba2)'
                    : 'linear-gradient(135deg, #f093fb, #f5576c)',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                  opacity: displayedItems.includes(item) ? 0.5 : 1,
                  filter: displayedItems.includes(item) ? 'grayscale(100%)' : 'none'
                }}
              >
                {item.emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .missing-item {
          padding: 40px 20px;
        }
      `}</style>
    </div>
  );
}
