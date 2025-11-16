/**
 * 结算页面组件
 */

import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/gameStore';
import { generatePerformanceReport } from '@/lib/scoreCalculator';

interface ResultScreenProps {
  onRestart: () => void;
  onMainMenu: () => void;
}

export function ResultScreen({ onRestart, onMainMenu }: ResultScreenProps) {
  const { currentSession } = useGameStore();

  if (!currentSession) return null;

  const report = generatePerformanceReport(
    currentSession.results,
    currentSession.maxCombo
  );

  return (
    <motion.div
      className="result-screen"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="result-container">
        <motion.h1
          className="result-title"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, type: 'spring' }}
        >
          游戏结束！
        </motion.h1>

        <div className="result-stats">
          <div className="stat-item main-score">
            <span className="stat-label">总分</span>
            <motion.span
              className="stat-value"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              {report.totalScore.toLocaleString()}
            </motion.span>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">完成关卡</span>
              <span className="stat-value">{report.challengesCompleted}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">平均星级</span>
              <span className="stat-value">
                {'⭐'.repeat(Math.round(report.averageStars))}
                {report.averageStars.toFixed(1)}
              </span>
            </div>

            <div className="stat-item">
              <span className="stat-label">完美次数</span>
              <span className="stat-value">{report.perfectCount} ✨</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">最高连击</span>
              <span className="stat-value">{report.maxCombo} 🔥</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">准确率</span>
              <span className="stat-value">{report.accuracy.toFixed(1)}%</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">评级</span>
              <span className="stat-value rank">{report.rank}</span>
            </div>
          </div>
        </div>

        <div className="result-buttons">
          <motion.button
            className="btn btn-primary"
            onClick={onRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 再来一局
          </motion.button>

          <motion.button
            className="btn btn-secondary"
            onClick={onMainMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🏠 返回主菜单
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
