/**
 * CH06: 记忆闪卡 - 记住图案位置并复现
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface MemoryFlashProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

interface Card {
  id: number;
  x: number;
  y: number;
  color: string;
  symbol: string;
}

type Phase = 'show' | 'memorize' | 'answer';

export function MemoryFlash({ challenge, onComplete, onMistake }: MemoryFlashProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [targetCards, setTargetCards] = useState<number[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>('show');
  const [timeLeft, setTimeLeft] = useState(2);

  useEffect(() => {
    generateCards();
  }, [challenge]);

  useEffect(() => {
    if (phase === 'show') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0.1) {
            setPhase('memorize');
            setTimeLeft(1);
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
      return () => clearInterval(timer);
    } else if (phase === 'memorize') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0.1) {
            setPhase('answer');
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [phase]);

  const generateCards = () => {
    const { targets = 3 } = challenge.config;
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A8E6CF'];
    const symbols = ['★', '●', '■', '▲', '◆'];

    const gridSize = 3;
    const totalCards = gridSize * gridSize;
    const allCards: Card[] = [];

    for (let i = 0; i < totalCards; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;

      allCards.push({
        id: i,
        x: col * 100 + 50,
        y: row * 100 + 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
      });
    }

    setCards(allCards);

    // 选择目标卡片
    const targets_indices: number[] = [];
    while (targets_indices.length < Math.min(targets, totalCards)) {
      const idx = Math.floor(Math.random() * totalCards);
      if (!targets_indices.includes(idx)) {
        targets_indices.push(idx);
      }
    }
    setTargetCards(targets_indices);
  };

  const handleCardClick = (cardId: number) => {
    if (phase !== 'answer') return;

    audioManager.play('click');

    const newSelected = [...selectedCards];

    if (newSelected.includes(cardId)) {
      // 取消选择
      const index = newSelected.indexOf(cardId);
      newSelected.splice(index, 1);
    } else {
      // 选择
      newSelected.push(cardId);
    }

    setSelectedCards(newSelected);

    // 检查是否选择完毕
    if (newSelected.length === targetCards.length) {
      // 检查是否正确
      const correct = newSelected.every(id => targetCards.includes(id)) &&
                     targetCards.every(id => newSelected.includes(id));

      if (correct) {
        audioManager.play('perfect');
        setTimeout(() => onComplete(true), 500);
      } else {
        onMistake();
        setTimeout(() => {
          setSelectedCards([]);
        }, 500);
      }
    }
  };

  return (
    <div className="challenge-container memory-flash">
      <div className="challenge-instruction">
        {phase === 'show' && `记住高亮的卡片！(${timeLeft.toFixed(1)}s)`}
        {phase === 'memorize' && `记忆中... (${timeLeft.toFixed(1)}s)`}
        {phase === 'answer' && '点击你记住的卡片位置！'}
      </div>

      <div className="memory-grid">
        <AnimatePresence>
          {cards.map((card) => {
            const isTarget = targetCards.includes(card.id);
            const isSelected = selectedCards.includes(card.id);
            const showContent = phase === 'show' && isTarget;

            return (
              <motion.div
                key={card.id}
                className={`memory-card ${isSelected ? 'selected' : ''}`}
                style={{
                  left: `${(card.id % 3) * 33}%`,
                  top: `${Math.floor(card.id / 3) * 33}%`,
                }}
                onClick={() => handleCardClick(card.id)}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={phase === 'answer' ? { scale: 1.05 } : {}}
                whileTap={phase === 'answer' ? { scale: 0.95 } : {}}
              >
                {showContent && (
                  <div
                    className="card-content"
                    style={{ backgroundColor: card.color }}
                  >
                    <span className="card-symbol">{card.symbol}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="challenge-progress">
        已选择: {selectedCards.length}/{targetCards.length}
      </div>
    </div>
  );
}
