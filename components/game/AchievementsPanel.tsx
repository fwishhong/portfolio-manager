/**
 * 成就面板
 * 显示所有成就的进度和状态
 */

'use client';

import { motion } from 'framer-motion';
import { Achievement } from '@/types/game';
import { ACHIEVEMENT_DEFINITIONS } from '@/lib/achievementSystem';

interface AchievementsPanelProps {
  achievements: Achievement[];
  onClose: () => void;
}

export function AchievementsPanel({ achievements, onClose }: AchievementsPanelProps) {
  const categories = [
    { id: 'progress', name: '进度', icon: '📈', color: '#10B981' },
    { id: 'skill', name: '技能', icon: '⚡', color: '#F59E0B' },
    { id: 'mastery', name: '专精', icon: '👑', color: '#8B5CF6' },
    { id: 'speed', name: '速度', icon: '💨', color: '#3B82F6' },
    { id: 'special', name: '特殊', icon: '✨', color: '#EC4899' },
  ];

  const getAchievementDef = (id: string) => {
    return ACHIEVEMENT_DEFINITIONS.find(def => def.id === id);
  };

  const getCategoryAchievements = (categoryId: string) => {
    return achievements.filter(a => {
      const def = getAchievementDef(a.id);
      return def?.category === categoryId;
    });
  };

  const getUnlockedCount = (categoryId: string) => {
    return getCategoryAchievements(categoryId).filter(a => a.unlockedAt).length;
  };

  const getTotalCount = (categoryId: string) => {
    return getCategoryAchievements(categoryId).length;
  };

  const totalUnlocked = achievements.filter(a => a.unlockedAt).length;
  const totalAchievements = achievements.length;
  const percentage = (totalUnlocked / totalAchievements) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '24px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '30px',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>
                🏆 成就系统
              </h2>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>
                已解锁 {totalUnlocked} / {totalAchievements} ({percentage.toFixed(1)}%)
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '24px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              marginTop: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              height: '12px',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '30px',
          }}
        >
          {categories.map(category => {
            const categoryAchievements = getCategoryAchievements(category.id);
            const unlockedCount = getUnlockedCount(category.id);
            const totalCount = getTotalCount(category.id);

            return (
              <div key={category.id} style={{ marginBottom: '30px' }}>
                {/* Category Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '15px',
                    paddingBottom: '10px',
                    borderBottom: `2px solid ${category.color}20`,
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{category.icon}</span>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: category.color,
                    }}
                  >
                    {category.name}
                  </h3>
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#666',
                      marginLeft: 'auto',
                    }}
                  >
                    {unlockedCount} / {totalCount}
                  </span>
                </div>

                {/* Achievements Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '15px',
                  }}
                >
                  {categoryAchievements.map(achievement => {
                    const isUnlocked = !!achievement.unlockedAt;
                    const progress = achievement.progress || 0;
                    const target = achievement.target || 1;
                    const progressPercent = Math.min((progress / target) * 100, 100);

                    return (
                      <motion.div
                        key={achievement.id}
                        whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
                        style={{
                          background: isUnlocked
                            ? `linear-gradient(135deg, ${category.color}15, ${category.color}05)`
                            : '#f5f5f5',
                          border: `2px solid ${isUnlocked ? category.color : '#e0e0e0'}`,
                          borderRadius: '12px',
                          padding: '15px',
                          opacity: isUnlocked ? 1 : 0.6,
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                          <div
                            style={{
                              fontSize: '32px',
                              filter: isUnlocked ? 'none' : 'grayscale(1)',
                            }}
                          >
                            {achievement.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: '15px',
                                fontWeight: 'bold',
                                color: isUnlocked ? '#333' : '#999',
                                marginBottom: '4px',
                              }}
                            >
                              {achievement.name}
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: isUnlocked ? '#666' : '#aaa',
                                lineHeight: '1.4',
                              }}
                            >
                              {achievement.description}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar for locked achievements */}
                        {!isUnlocked && target > 1 && (
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '11px',
                                color: '#999',
                                marginBottom: '4px',
                              }}
                            >
                              <span>进度</span>
                              <span>
                                {progress} / {target}
                              </span>
                            </div>
                            <div
                              style={{
                                background: '#e0e0e0',
                                borderRadius: '4px',
                                height: '6px',
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{
                                  width: `${progressPercent}%`,
                                  height: '100%',
                                  background: category.color,
                                  borderRadius: '4px',
                                  transition: 'width 0.3s',
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Unlock date for unlocked achievements */}
                        {isUnlocked && achievement.unlockedAt && (
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#999',
                              marginTop: '8px',
                              textAlign: 'right',
                            }}
                          >
                            🎉 {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
