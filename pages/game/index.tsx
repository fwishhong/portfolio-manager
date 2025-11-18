/**
 * 游戏主菜单页面
 */

import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function GameMenu() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const startGame = (mode: string) => {
    setIsLoading(true);
    router.push(`/game/${mode}`);
  };

  // 自动跳转到normal模式（可选）
  // useEffect(() => {
  //   router.push('/game/normal');
  // }, []);

  return (
    <div className="game-menu">
      <div className="menu-container">
        <motion.div
          className="menu-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="game-title"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <span className="title-main">脑力闪电战</span>
            <span className="title-sub">Brain Blitz</span>
          </motion.h1>

          <motion.div
            className="menu-buttons"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <MenuButton
              onClick={() => startGame('normal')}
              label="开始游戏"
              icon="🎮"
              description="标准模式"
              delay={0.5}
            />

            <MenuButton
              onClick={() => startGame('casual')}
              label="休闲模式"
              icon="😌"
              description="更多时间，轻松游玩"
              delay={0.6}
            />

            <MenuButton
              onClick={() => startGame('challenge')}
              label="挑战模式"
              icon="🔥"
              description="更少时间，极限挑战"
              delay={0.7}
            />

            <MenuButton
              onClick={() => startGame('endless')}
              label="无尽模式"
              icon="♾️"
              description="坚持到最后"
              delay={0.8}
            />

            <MenuButton
              onClick={() => router.push('/')}
              label="返回首页"
              icon="🏠"
              description=""
              delay={0.9}
              variant="secondary"
            />
          </motion.div>

          <motion.div
            className="game-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p>⚡ 25+种微游戏 | 🎯 测试你的反应和智力</p>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        .game-menu {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .menu-container {
          max-width: 600px;
          width: 100%;
        }

        .menu-content {
          text-align: center;
        }

        .game-title {
          margin-bottom: 60px;
        }

        .title-main {
          display: block;
          font-size: 3.5rem;
          font-weight: 900;
          color: white;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          margin-bottom: 10px;
        }

        .title-sub {
          display: block;
          font-size: 1.5rem;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 2px;
        }

        .menu-buttons {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .game-info {
          margin-top: 40px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1rem;
        }

        @media (max-width: 640px) {
          .title-main {
            font-size: 2.5rem;
          }

          .title-sub {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}

interface MenuButtonProps {
  onClick: () => void;
  label: string;
  icon: string;
  description: string;
  delay: number;
  variant?: 'primary' | 'secondary';
}

function MenuButton({ onClick, label, icon, description, delay, variant = 'primary' }: MenuButtonProps) {
  return (
    <motion.button
      className={`menu-btn menu-btn-${variant}`}
      onClick={onClick}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, x: 10 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="btn-icon">{icon}</span>
      <div className="btn-content">
        <span className="btn-label">{label}</span>
        {description && <span className="btn-description">{description}</span>}
      </div>

      <style jsx>{`
        .menu-btn {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px 30px;
          border: none;
          border-radius: 16px;
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          width: 100%;
        }

        .menu-btn-primary {
          background: white;
          color: #667eea;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .menu-btn-primary:hover {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
        }

        .menu-btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .menu-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .btn-icon {
          font-size: 2rem;
        }

        .btn-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .btn-label {
          font-size: 1.3rem;
        }

        .btn-description {
          font-size: 0.9rem;
          opacity: 0.7;
          font-weight: 400;
        }
      `}</style>
    </motion.button>
  );
}
