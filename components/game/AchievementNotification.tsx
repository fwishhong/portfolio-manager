/**
 * 成就解锁通知
 * 当玩家解锁新成就时显示
 */

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/types/game';
import { audioManager } from '@/lib/audioManager';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      audioManager.play('achievement');

      // 5秒后自动关闭
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 9999,
            width: '320px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              style={{
                fontSize: '48px',
                minWidth: '48px',
              }}
            >
              {achievement.icon}
            </motion.div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 600,
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                🏆 成就解锁
              </div>
              <div
                style={{
                  fontSize: '18px',
                  color: 'white',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                }}
              >
                {achievement.name}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                {achievement.description}
              </div>
            </div>

            <motion.button
              onClick={() => {
                setVisible(false);
                setTimeout(onClose, 300);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              ×
            </motion.button>
          </div>

          {/* 进度条动画 */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 5, ease: 'linear' }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'rgba(255, 255, 255, 0.5)',
              transformOrigin: 'left',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
