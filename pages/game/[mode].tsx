/**
 * 游戏页面 - 动态路由
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useGameStore } from '@/lib/gameStore';
import { GameEngine } from '@/components/game/GameEngine';
import { HUD } from '@/components/game/HUD';
import { ResultScreen } from '@/components/game/ResultScreen';

export default function GamePage() {
  const router = useRouter();
  const { mode } = router.query;
  const { startGame, resetGame, isGameOver } = useGameStore();
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (mode && typeof mode === 'string') {
      resetGame();
      startGame(mode);
    }
  }, [mode]);

  useEffect(() => {
    if (isGameOver) {
      setShowResult(true);
    }
  }, [isGameOver]);

  const handleRestart = () => {
    setShowResult(false);
    resetGame();
    if (mode && typeof mode === 'string') {
      startGame(mode);
    }
  };

  const handleMainMenu = () => {
    resetGame();
    router.push('/game');
  };

  if (!mode) {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
        <p>加载中...</p>

        <style jsx>{`
          .loading-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="game-page">
      {!showResult ? (
        <>
          <HUD />
          <div className="game-area">
            <GameEngine onGameOver={() => setShowResult(true)} />
          </div>
        </>
      ) : (
        <ResultScreen onRestart={handleRestart} onMainMenu={handleMainMenu} />
      )}

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          overflow: hidden;
        }

        .game-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
        }

        .game-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        /* HUD 样式 */
        .hud {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          padding: 15px 20px;
          color: white;
        }

        .hud-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .hud-left,
        .hud-right {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .hud-center {
          flex: 1;
          max-width: 300px;
        }

        .hud-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hud-label {
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .hud-value {
          font-size: 1.4rem;
          font-weight: bold;
        }

        .hud-value.score {
          color: #FFE66D;
        }

        .hud-value.combo {
          color: #FF6B6B;
        }

        .hud-value.lives .heart {
          margin: 0 2px;
        }

        .combo-display {
          animation: pulse 0.5s ease infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .hud-instruction {
          margin-top: 15px;
          text-align: center;
          padding: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }

        .instruction-text {
          font-size: 1.2rem;
          font-weight: 600;
        }

        /* Timer 样式 */
        .timer-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: center;
        }

        .timer-bar-background {
          width: 100%;
          height: 10px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 5px;
          overflow: hidden;
        }

        .timer-bar {
          height: 100%;
          background: linear-gradient(90deg, #4ECDC4, #44A08D);
          transition: width 0.1s linear;
          border-radius: 5px;
        }

        .timer-bar.warning {
          background: linear-gradient(90deg, #FFE66D, #FFA500);
          animation: pulse-bar 0.5s ease infinite;
        }

        .timer-bar.critical {
          background: linear-gradient(90deg, #FF6B6B, #C0392B);
        }

        @keyframes pulse-bar {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .timer-text {
          font-size: 1.1rem;
          font-weight: bold;
        }

        .timer-text.warning {
          color: #FFE66D;
          animation: pulse 0.5s ease infinite;
        }

        /* 挑战容器 */
        .challenge-container {
          width: 100%;
          max-width: 800px;
          height: 600px;
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .challenge-instruction {
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }

        .color-badge,
        .target-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 8px;
          margin: 0 10px;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .target-badge {
          background: #4ECDC4;
          color: white;
        }

        .shapes-container {
          flex: 1;
          position: relative;
        }

        .shape {
          border-radius: 8px;
        }

        .shape-circle {
          border-radius: 50%;
        }

        .shape-triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }

        .shape-star {
          clip-path: polygon(
            50% 0%,
            61% 35%,
            98% 35%,
            68% 57%,
            79% 91%,
            50% 70%,
            21% 91%,
            32% 57%,
            2% 35%,
            39% 35%
          );
        }

        .challenge-progress {
          text-align: center;
          font-size: 1.2rem;
          font-weight: 600;
          color: #666;
          margin-top: 15px;
        }

        /* 数学挑战 */
        .math-board {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px;
        }

        .math-question {
          font-size: 3rem;
          font-weight: 900;
          color: #333;
          text-align: center;
          padding: 30px;
          background: #f8f9fa;
          border-radius: 16px;
          min-width: 300px;
        }

        .math-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          width: 100%;
          max-width: 400px;
        }

        .math-option {
          padding: 30px;
          font-size: 2rem;
          font-weight: bold;
          background: #4ECDC4;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .math-option:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        /* 记忆挑战 */
        .memory-grid {
          flex: 1;
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 15px;
          padding: 20px;
        }

        .memory-card {
          background: #f0f0f0;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          border: 3px solid transparent;
        }

        .memory-card:hover {
          background: #e0e0e0;
        }

        .memory-card.selected {
          border-color: #4ECDC4;
          background: #d4f4f1;
        }

        .card-content {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-symbol {
          font-size: 3rem;
        }

        /* 真假判断 */
        .statement-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 50px;
        }

        .statement-text {
          font-size: 2.5rem;
          font-weight: bold;
          color: #333;
          text-align: center;
          padding: 40px;
          background: #f8f9fa;
          border-radius: 16px;
          max-width: 600px;
        }

        .answer-buttons {
          display: flex;
          gap: 30px;
        }

        .answer-btn {
          padding: 20px 50px;
          font-size: 1.5rem;
          font-weight: bold;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .true-btn {
          background: #4ECDC4;
          color: white;
        }

        .false-btn {
          background: #FF6B6B;
          color: white;
        }

        /* 3D挑战 */
        .cube-memory {
          height: 650px;
        }

        .scene-3d {
          flex: 1;
        }

        .target-symbol {
          display: inline-block;
          background: #FFE66D;
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 2rem;
          margin: 0 10px;
        }

        .cube-hint {
          text-align: center;
          color: #666;
          font-size: 1.1rem;
          margin-top: 10px;
        }

        /* 结算页面 */
        .result-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .result-container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .result-title {
          text-align: center;
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 30px;
        }

        .result-stats {
          margin-bottom: 30px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 15px;
          border-bottom: 1px solid #eee;
        }

        .stat-item.main-score {
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .stat-item.main-score .stat-value {
          font-size: 3rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .stats-grid .stat-item {
          flex-direction: column;
          gap: 8px;
          border: 1px solid #eee;
          border-radius: 8px;
          background: #f8f9fa;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #666;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: bold;
          color: #333;
        }

        .stat-value.rank {
          color: #667eea;
        }

        .result-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .btn {
          padding: 15px 30px;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #667eea;
          color: white;
        }

        .btn-secondary {
          background: #95E1D3;
          color: #333;
        }

        /* 加载动画 */
        .loading-screen {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* 响应式 */
        @media (max-width: 768px) {
          .challenge-container {
            max-width: 100%;
            height: 500px;
            padding: 20px;
          }

          .hud-top {
            flex-direction: column;
            align-items: stretch;
          }

          .hud-center {
            max-width: 100%;
          }

          .math-question {
            font-size: 2rem;
            padding: 20px;
          }

          .statement-text {
            font-size: 1.8rem;
            padding: 30px;
          }

          .answer-buttons {
            flex-direction: column;
            width: 100%;
          }

          .answer-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
