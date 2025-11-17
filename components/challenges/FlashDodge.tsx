/**
 * CH04: 闪光躲避 - 点击空白区域，避开闪烁的危险区
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Challenge } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface FlashDodgeProps {
  challenge: Challenge;
  onComplete: (success: boolean) => void;
  onMistake: () => void;
}

interface DangerZone {
  id: number;
  x: number;
  y: number;
  active: boolean;
}

export function FlashDodge({ challenge, onComplete, onMistake }: FlashDodgeProps) {
  const [zones, setZones] = useState<DangerZone[]>([]);
  const [clicksNeeded, setClicksNeeded] = useState(5);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    setClicksNeeded(challenge.config.targets);

    // 生成危险区域
    const dangerZones: DangerZone[] = [];
    for (let i = 0; i < 8; i++) {
      dangerZones.push({
        id: i,
        x: Math.random() * 80 + 5,
        y: Math.random() * 75 + 5,
        active: false,
      });
    }
    setZones(dangerZones);

    // 随机激活危险区域
    const interval = setInterval(() => {
      setZones(prev => prev.map(zone => ({
        ...zone,
        active: Math.random() > 0.6,
      })));
    }, 500);

    return () => clearInterval(interval);
  }, [challenge]);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // 检查是否点击在危险区域
    if (target.classList.contains('danger-zone') || target.closest('.danger-zone')) {
      audioManager.play('fail');
      onMistake();
      return;
    }

    audioManager.play('click');
    const newClicks = clicks + 1;
    setClicks(newClicks);

    if (newClicks >= clicksNeeded) {
      audioManager.play('success');
      setTimeout(() => onComplete(true), 200);
    }
  };

  return (
    <div className="challenge-container flash-dodge" onClick={handleClick}>
      <div className="challenge-instruction">
        点击空白区域 {clicks}/{clicksNeeded} 次，避开红色闪光！
      </div>

      <div className="play-area">
        <AnimatePresence>
          {zones.map((zone) => zone.active && (
            <motion.div
              key={zone.id}
              className="danger-zone"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </AnimatePresence>

        <div className="safe-clicks-indicator">
          {Array.from({ length: clicksNeeded }).map((_, i) => (
            <div
              key={i}
              className={`click-dot ${i < clicks ? 'filled' : ''}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .play-area {
          flex: 1;
          position: relative;
          background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
          border-radius: 16px;
          cursor: crosshair;
        }

        .danger-zone {
          position: absolute;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, #ff1744 0%, #f44336 100%);
          border-radius: 50%;
          pointer-events: auto;
          box-shadow: 0 0 20px rgba(255, 23, 68, 0.6);
        }

        .safe-clicks-indicator {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
        }

        .click-dot {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.6);
          transition: all 0.3s;
        }

        .click-dot.filled {
          background: #4caf50;
          border-color: #4caf50;
          box-shadow: 0 0 10px rgba(76, 175, 80, 0.8);
        }
      `}</style>
    </div>
  );
}
