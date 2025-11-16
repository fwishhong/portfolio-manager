/**
 * 计时器组件
 */

import { useEffect } from 'react';
import { useGameStore } from '@/lib/gameStore';
import { audioManager } from '@/lib/audioManager';

export function Timer() {
  const { timeRemaining, updateTimer, failChallenge, isPlaying, isPaused } = useGameStore();

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

        // 最后3秒播放心跳音效
        if (newTime <= 3 && newTime % 1 < 0.1) {
          audioManager.play('tick', 0.5);
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
