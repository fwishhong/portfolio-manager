/**
 * 计时器组件 - 增强音效版本
 */

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/lib/gameStore';
import { audioManager } from '@/lib/audioManager';

export function Timer() {
  const { timeRemaining, updateTimer, failChallenge, isPlaying, isPaused } = useGameStore();
  const lastWarningTime = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying || isPaused || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      const newTime = timeRemaining - 0.1;

      if (newTime <= 0) {
        updateTimer(0);
        failChallenge();
        audioManager.play('fail');
      } else {
        updateTimer(newTime);

        // 5秒警告 - 只播放一次
        if (newTime <= 5 && newTime > 4.9 && lastWarningTime.current !== 5) {
          audioManager.play('warning', 0.4);
          lastWarningTime.current = 5;
        }

        // 最后3秒每秒播放倒计时音效
        if (newTime <= 3 && newTime % 1 < 0.1) {
          const count = Math.ceil(newTime);
          audioManager.play('countdown', 0.5 + count * 0.1);
        }

        // 最后1秒紧急警告
        if (newTime <= 1 && newTime > 0.9 && lastWarningTime.current !== 1) {
          audioManager.play('warning', 0.8);
          lastWarningTime.current = 1;
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [timeRemaining, isPlaying, isPaused, updateTimer, failChallenge]);

  const percentage = (timeRemaining / 10) * 100; // 假设最大10秒
  const isWarning = timeRemaining <= 3;
  const isCritical = timeRemaining <= 1;

  return (
    <div className="timer-container">
      <div className="timer-bar-background">
        <div
          className={`timer-bar ${isWarning ? 'warning' : ''} ${isCritical ? 'critical' : ''}`}
          style={{ width: `${Math.max(0, percentage)}%` }}
        />
      </div>
      <span className={`timer-text ${isWarning ? 'warning' : ''}`}>
        ⏱️ {timeRemaining.toFixed(1)}s
      </span>
    </div>
  );
}
