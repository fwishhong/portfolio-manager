/**
 * CH15: 奇偶分类 - 将数字拖到奇数/偶数区域
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface OddEvenSortProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

interface NumberItem {
  id: number;
  value: number;
  sorted: boolean;
}

export function OddEvenSort({ challenge, onComplete, onMistake }: OddEvenSortProps) {
  const [numbers, setNumbers] = useState<NumberItem[]>([]);
  const [draggedNumber, setDraggedNumber] = useState<number | null>(null);

  useEffect(() => {
    const count = Math.min(challenge.config.targets, 9);
    const items: NumberItem[] = [];

    for (let i = 0; i < count; i++) {
      const value = Math.floor(Math.random() * 50) + 1;
      items.push({ id: i, value, sorted: false });
    }

    setNumbers(items.sort(() => Math.random() - 0.5));
  }, [challenge]);

  const handleDragStart = (value: number) => {
    setDraggedNumber(value);
  };

  const handleDrop = (zone: 'odd' | 'even') => {
    if (draggedNumber === null) return;

    const isOdd = draggedNumber % 2 === 1;
    const isCorrect = (zone === 'odd' && isOdd) || (zone === 'even' && !isOdd);

    if (isCorrect) {
      audioManager.play('success', 0.7);
      setNumbers(prev =>
        prev.map(n => (n.value === draggedNumber ? { ...n, sorted: true } : n))
      );

      // 检查是否全部完成
      const allSorted = numbers.every(n => n.sorted || n.value === draggedNumber);
      if (allSorted) {
        setTimeout(() => onComplete(true), 300);
      }
    } else {
      audioManager.play('fail');
      onMistake();
    }

    setDraggedNumber(null);
  };

  const handleClickSort = (value: number, zone: 'odd' | 'even') => {
    const isOdd = value % 2 === 1;
    const isCorrect = (zone === 'odd' && isOdd) || (zone === 'even' && !isOdd);

    if (isCorrect) {
      audioManager.play('success', 0.7);
      setNumbers(prev =>
        prev.map(n => (n.value === value ? { ...n, sorted: true } : n))
      );

      const allSorted = numbers.every(n => n.sorted || n.value === value);
      if (allSorted) {
        setTimeout(() => onComplete(true), 300);
      }
    } else {
      audioManager.play('fail');
      onMistake();
    }
  };

  return (
    <div className="challenge-container odd-even-sort">
      <div className="challenge-instruction">
        将数字分类到奇数或偶数区域
      </div>

      <div className="sort-area">
        <div className="numbers-pool">
          <AnimatePresence>
            {numbers.filter(n => !n.sorted).map((item) => (
              <motion.div
                key={item.id}
                className="number-chip"
                draggable
                onDragStart={() => handleDragStart(item.value)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {item.value}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="drop-zones">
          <motion.div
            className="drop-zone odd-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('odd')}
            onClick={() => draggedNumber && handleClickSort(draggedNumber, 'odd')}
            whileHover={{ scale: 1.02 }}
          >
            <div className="zone-label">奇数</div>
            <div className="zone-hint">1, 3, 5, 7...</div>
          </motion.div>

          <motion.div
            className="drop-zone even-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop('even')}
            onClick={() => draggedNumber && handleClickSort(draggedNumber, 'even')}
            whileHover={{ scale: 1.02 }}
          >
            <div className="zone-label">偶数</div>
            <div className="zone-hint">2, 4, 6, 8...</div>
          </motion.div>
        </div>
      </div>

      <div className="progress-text">
        已分类: {numbers.filter(n => n.sorted).length}/{numbers.length}
      </div>

      <style jsx>{`
        .sort-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .numbers-pool {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          min-height: 100px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 12px;
        }

        .number-chip {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: bold;
          cursor: grab;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          user-select: none;
        }

        .number-chip:active {
          cursor: grabbing;
        }

        .drop-zones {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .drop-zone {
          padding: 40px 20px;
          border-radius: 16px;
          border: 3px dashed #ccc;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .drop-zone:hover {
          border-color: #999;
          background: rgba(0, 0, 0, 0.02);
        }

        .odd-zone {
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.05) 100%);
          border-color: #FF6B6B;
        }

        .even-zone {
          background: linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(78, 205, 196, 0.05) 100%);
          border-color: #4ECDC4;
        }

        .zone-label {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .zone-hint {
          font-size: 1rem;
          color: #666;
        }

        .progress-text {
          text-align: center;
          font-size: 1.1rem;
          font-weight: 600;
          color: #666;
        }
      `}</style>
    </div>
  );
}
