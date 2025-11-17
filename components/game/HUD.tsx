/**
 * 游戏HUD（抬头显示）
 * 使用主题配色系统
 */

import { useGameStore } from '@/lib/gameStore';
import { Timer } from './Timer';
import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';

export function HUD() {
  const { currentSession, combo, lives, currentChallenge } = useGameStore();
  const { currentTheme } = useTheme();

  const score = currentSession?.totalScore || 0;
  const colors = currentTheme.colors;

  return (
    <div className="hud">
      <div className="hud-top">
        <div className="hud-left">
          <motion.div
            className="hud-item"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
              border: `1px solid ${colors.border}`,
              boxShadow: `0 2px 8px ${colors.shadow}`,
            }}
          >
            <span className="hud-label" style={{ color: colors.textSecondary }}>分数</span>
            <span className="hud-value score" style={{ color: colors.primary }}>
              {score.toLocaleString()}
            </span>
          </motion.div>

          {combo > 0 && (
            <motion.div
              className="hud-item combo-display"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                background: `linear-gradient(135deg, ${colors.accent}30, ${colors.primary}30)`,
                border: `2px solid ${colors.accent}`,
                boxShadow: `0 0 16px ${colors.accent}50`,
              }}
            >
              <span className="hud-label" style={{ color: colors.text }}>连击</span>
              <motion.span
                className="hud-value combo"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ color: colors.accent }}
              >
                🔥 {combo}
              </motion.span>
            </motion.div>
          )}
        </div>

        <div className="hud-center">
          <Timer />
        </div>

        <div className="hud-right">
          <motion.div
            className="hud-item"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
              border: `1px solid ${colors.border}`,
              boxShadow: `0 2px 8px ${colors.shadow}`,
            }}
          >
            <span className="hud-label" style={{ color: colors.textSecondary }}>生命</span>
            <span className="hud-value lives">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={i < lives ? 'heart filled' : 'heart empty'}>
                  {i < lives ? '❤️' : '🖤'}
                </span>
              ))}
            </span>
          </motion.div>
        </div>
      </div>

      {currentChallenge && (
        <motion.div
          className="hud-instruction"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: `linear-gradient(90deg, ${colors.primary}20, ${colors.secondary}20)`,
            border: `1px solid ${colors.border}`,
            boxShadow: `0 4px 12px ${colors.shadow}`,
          }}
        >
          <div className="instruction-text" style={{ color: colors.text }}>
            {getInstructionText(currentChallenge.id)}
          </div>
          <div className="challenge-badge" style={{
            background: colors.primary,
            color: colors.background,
          }}>
            {currentChallenge.id}
          </div>
        </motion.div>
      )}

      <style jsx>{`
        .hud {
          position: relative;
          width: 100%;
        }
        .hud-top {
          display: flex;
          justify-content: space-between;
          padding: 16px 24px;
          gap: 24px;
        }
        .hud-left, .hud-right {
          display: flex;
          gap: 16px;
        }
        .hud-item {
          padding: 12px 20px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 120px;
          transition: all 0.3s ease;
        }
        .hud-item:hover {
          transform: translateY(-2px);
        }
        .hud-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.8;
        }
        .hud-value {
          font-size: 24px;
          font-weight: bold;
        }
        .combo-display {
          animation: pulse 0.8s infinite;
        }
        .hud-instruction {
          margin: 0 24px 16px;
          padding: 16px 24px;
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .instruction-text {
          font-size: 18px;
          font-weight: 600;
        }
        .challenge-badge {
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: bold;
        }
        .heart {
          margin: 0 2px;
          display: inline-block;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

function getInstructionText(challengeId: string): string {
  const instructions: { [key: string]: string } = {
    CH01: '点击所有指定颜色的形状！',
    CH02: '点击所有指定形状！',
    CH03: '找到最大/最小的数字！',
    CH04: '避开闪烁的危险区域！',
    CH05: '按颜色序列点击！',
    CH06: '记住位置并复现！',
    CH07: '重复颜色闪烁顺序！',
    CH08: '记住立方体上的符号！',
    CH09: '找出消失的物品！',
    CH10: '选择正确答案！',
    CH11: '选择更大/更小的数字！',
    CH12: '点击所有倍数！',
    CH13: '完成等式！',
    CH14: '判断陈述真假！',
    CH15: '将数字分类！',
    CH16: '根据影子选择形状！',
    CH17: '确定最终方向！',
    CH18: '找出图案规律！',
    CH22: '同时完成所有任务！',
    CH23: '做相反的操作！',
    CH24: '选择文字的颜色！',
    CH25: '按节奏点击！',
  };

  return instructions[challengeId] || '完成挑战！';
}
