/**
 * 游戏HUD（抬头显示）
 */

import { useGameStore } from '@/lib/gameStore';
import { Timer } from './Timer';

export function HUD() {
  const { currentSession, combo, lives, currentChallenge } = useGameStore();

  const score = currentSession?.totalScore || 0;

  return (
    <div className="hud">
      <div className="hud-top">
        <div className="hud-left">
          <div className="hud-item">
            <span className="hud-label">分数</span>
            <span className="hud-value score">{score.toLocaleString()}</span>
          </div>

          {combo > 0 && (
            <div className="hud-item combo-display">
              <span className="hud-label">连击</span>
              <span className="hud-value combo">🔥 {combo}</span>
            </div>
          )}
        </div>

        <div className="hud-center">
          <Timer />
        </div>

        <div className="hud-right">
          <div className="hud-item">
            <span className="hud-label">生命</span>
            <span className="hud-value lives">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={i < lives ? 'heart filled' : 'heart empty'}>
                  {i < lives ? '❤️' : '🖤'}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {currentChallenge && (
        <div className="hud-instruction">
          <div className="instruction-text">
            {getInstructionText(currentChallenge.id)}
          </div>
        </div>
      )}
    </div>
  );
}

function getInstructionText(challengeId: string): string {
  const instructions: { [key: string]: string } = {
    CH01: '点击所有指定颜色的形状！',
    CH02: '点击所有指定形状！',
    CH10: '选择正确答案！',
    CH06: '记住位置并复现！',
    CH14: '判断陈述真假！',
    CH08: '记住立方体上的符号！',
  };

  return instructions[challengeId] || '完成挑战！';
}
