/**
 * 成就系统
 * 跟踪玩家成就和解锁内容
 */

import { Achievement } from '@/types/game';

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'progress' | 'skill' | 'mastery' | 'speed' | 'special';
  requirement: {
    type: 'challenges_completed' | 'perfect_count' | 'combo' | 'score' | 'category_count' | 'speed' | 'custom';
    target: number;
    category?: string; // for category_count type
  };
  reward?: {
    type: 'unlock_mode' | 'unlock_theme' | 'title' | 'badge';
    value: string;
  };
}

// 成就定义
export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // 进度成就
  {
    id: 'first_steps',
    name: '初出茅庐',
    description: '完成第1个挑战',
    icon: '🎯',
    category: 'progress',
    requirement: { type: 'challenges_completed', target: 1 },
  },
  {
    id: 'challenger',
    name: '挑战者',
    description: '完成10个挑战',
    icon: '⚔️',
    category: 'progress',
    requirement: { type: 'challenges_completed', target: 10 },
  },
  {
    id: 'veteran',
    name: '老手',
    description: '完成50个挑战',
    icon: '🎖️',
    category: 'progress',
    requirement: { type: 'challenges_completed', target: 50 },
  },
  {
    id: 'expert',
    name: '专家',
    description: '完成100个挑战',
    icon: '👑',
    category: 'progress',
    requirement: { type: 'challenges_completed', target: 100 },
  },
  {
    id: 'legend',
    name: '传奇',
    description: '完成所有200个挑战',
    icon: '🏆',
    category: 'progress',
    requirement: { type: 'challenges_completed', target: 200 },
    reward: { type: 'title', value: '传奇大师' },
  },

  // 技能成就
  {
    id: 'perfectionist',
    name: '完美主义者',
    description: '获得10次3星评价',
    icon: '⭐',
    category: 'skill',
    requirement: { type: 'perfect_count', target: 10 },
  },
  {
    id: 'flawless',
    name: '无瑕之星',
    description: '获得50次3星评价',
    icon: '✨',
    category: 'skill',
    requirement: { type: 'perfect_count', target: 50 },
  },
  {
    id: 'combo_starter',
    name: '连击新手',
    description: '达成10连击',
    icon: '🔥',
    category: 'skill',
    requirement: { type: 'combo', target: 10 },
  },
  {
    id: 'combo_master',
    name: '连击大师',
    description: '达成25连击',
    icon: '💥',
    category: 'skill',
    requirement: { type: 'combo', target: 25 },
  },
  {
    id: 'unstoppable',
    name: '势不可挡',
    description: '达成50连击',
    icon: '⚡',
    category: 'skill',
    requirement: { type: 'combo', target: 50 },
    reward: { type: 'badge', value: '连击之王' },
  },

  // 分数成就
  {
    id: 'high_scorer',
    name: '高分达人',
    description: '单局得分超过10000',
    icon: '💯',
    category: 'mastery',
    requirement: { type: 'score', target: 10000 },
  },
  {
    id: 'score_titan',
    name: '分数巨人',
    description: '单局得分超过50000',
    icon: '💎',
    category: 'mastery',
    requirement: { type: 'score', target: 50000 },
  },
  {
    id: 'score_god',
    name: '分数之神',
    description: '单局得分超过100000',
    icon: '🌟',
    category: 'mastery',
    requirement: { type: 'score', target: 100000 },
    reward: { type: 'unlock_mode', value: 'endless' },
  },

  // 专精成就
  {
    id: 'reaction_master',
    name: '反应大师',
    description: '完成20个反应类挑战',
    icon: '⚡',
    category: 'mastery',
    requirement: { type: 'category_count', target: 20, category: 'reaction' },
  },
  {
    id: 'memory_master',
    name: '记忆大师',
    description: '完成20个记忆类挑战',
    icon: '🧠',
    category: 'mastery',
    requirement: { type: 'category_count', target: 20, category: 'memory' },
  },
  {
    id: 'math_master',
    name: '数学大师',
    description: '完成20个数学类挑战',
    icon: '🔢',
    category: 'mastery',
    requirement: { type: 'category_count', target: 20, category: 'math' },
  },
  {
    id: 'judgment_master',
    name: '判断大师',
    description: '完成20个判断类挑战',
    icon: '⚖️',
    category: 'mastery',
    requirement: { type: 'category_count', target: 20, category: 'judgment' },
  },
  {
    id: 'spatial_master',
    name: '空间大师',
    description: '完成20个空间类挑战',
    icon: '🎲',
    category: 'mastery',
    requirement: { type: 'category_count', target: 20, category: 'spatial' },
  },

  // 速度成就
  {
    id: 'speedrunner',
    name: '速通玩家',
    description: '3秒内完成一个挑战',
    icon: '💨',
    category: 'speed',
    requirement: { type: 'speed', target: 3 },
  },
  {
    id: 'lightning_fast',
    name: '闪电侠',
    description: '1秒内完成一个挑战',
    icon: '⚡',
    category: 'speed',
    requirement: { type: 'speed', target: 1 },
    reward: { type: 'badge', value: '速度之王' },
  },

  // 特殊成就
  {
    id: 'no_mistakes',
    name: '零失误',
    description: '一局中完成5个挑战且无失误',
    icon: '🎯',
    category: 'special',
    requirement: { type: 'custom', target: 5 },
  },
  {
    id: 'comeback_king',
    name: '绝地反击',
    description: '只剩1条生命时完成挑战',
    icon: '💪',
    category: 'special',
    requirement: { type: 'custom', target: 1 },
  },
  {
    id: 'night_owl',
    name: '夜猫子',
    description: '在午夜12点到凌晨6点间游戏',
    icon: '🦉',
    category: 'special',
    requirement: { type: 'custom', target: 1 },
  },
  {
    id: 'early_bird',
    name: '早起鸟',
    description: '在早上6点到9点间游戏',
    icon: '🐦',
    category: 'special',
    requirement: { type: 'custom', target: 1 },
  },
];

/**
 * 成就管理器类
 */
export class AchievementManager {
  private achievements: Map<string, Achievement>;
  private listeners: Array<(achievement: Achievement) => void> = [];

  constructor(initialAchievements?: Achievement[]) {
    this.achievements = new Map();

    // 初始化所有成就
    ACHIEVEMENT_DEFINITIONS.forEach(def => {
      const existing = initialAchievements?.find(a => a.id === def.id);
      this.achievements.set(def.id, {
        id: def.id,
        name: def.name,
        description: def.description,
        icon: def.icon,
        unlockedAt: existing?.unlockedAt,
        progress: existing?.progress || 0,
        target: def.requirement.target,
      });
    });
  }

  /**
   * 检查并更新成就进度
   */
  checkAchievements(stats: {
    challengesCompleted: number;
    perfectCount: number;
    maxCombo: number;
    highestScore: number;
    reactionCount: number;
    memoryCount: number;
    mathCount: number;
    judgmentCount: number;
    spatialCount: number;
  }): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    ACHIEVEMENT_DEFINITIONS.forEach(def => {
      const achievement = this.achievements.get(def.id);
      if (!achievement || achievement.unlockedAt) return;

      let progress = 0;
      let shouldUnlock = false;

      switch (def.requirement.type) {
        case 'challenges_completed':
          progress = stats.challengesCompleted;
          break;
        case 'perfect_count':
          progress = stats.perfectCount;
          break;
        case 'combo':
          progress = stats.maxCombo;
          break;
        case 'score':
          progress = stats.highestScore;
          break;
        case 'category_count':
          if (def.requirement.category === 'reaction') progress = stats.reactionCount;
          else if (def.requirement.category === 'memory') progress = stats.memoryCount;
          else if (def.requirement.category === 'math') progress = stats.mathCount;
          else if (def.requirement.category === 'judgment') progress = stats.judgmentCount;
          else if (def.requirement.category === 'spatial') progress = stats.spatialCount;
          break;
      }

      achievement.progress = progress;

      if (progress >= def.requirement.target && !achievement.unlockedAt) {
        achievement.unlockedAt = Date.now();
        shouldUnlock = true;
        newlyUnlocked.push(achievement);
      }
    });

    // 通知监听器
    newlyUnlocked.forEach(achievement => {
      this.notifyListeners(achievement);
    });

    return newlyUnlocked;
  }

  /**
   * 手动解锁特殊成就
   */
  unlockSpecialAchievement(achievementId: string): boolean {
    const achievement = this.achievements.get(achievementId);
    if (!achievement || achievement.unlockedAt) return false;

    achievement.unlockedAt = Date.now();
    achievement.progress = achievement.target || 1;
    this.notifyListeners(achievement);

    return true;
  }

  /**
   * 检查速度成就
   */
  checkSpeedAchievement(timeUsed: number): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    ACHIEVEMENT_DEFINITIONS
      .filter(def => def.requirement.type === 'speed')
      .forEach(def => {
        const achievement = this.achievements.get(def.id);
        if (!achievement || achievement.unlockedAt) return;

        if (timeUsed <= def.requirement.target) {
          achievement.unlockedAt = Date.now();
          achievement.progress = def.requirement.target;
          newlyUnlocked.push(achievement);
          this.notifyListeners(achievement);
        }
      });

    return newlyUnlocked;
  }

  /**
   * 获取所有成就
   */
  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  /**
   * 获取已解锁成就
   */
  getUnlockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => a.unlockedAt);
  }

  /**
   * 获取成就进度统计
   */
  getStats() {
    const all = this.getAllAchievements();
    const unlocked = this.getUnlockedAchievements();

    return {
      total: all.length,
      unlocked: unlocked.length,
      percentage: (unlocked.length / all.length) * 100,
    };
  }

  /**
   * 添加成就解锁监听器
   */
  addListener(callback: (achievement: Achievement) => void) {
    this.listeners.push(callback);
  }

  /**
   * 移除监听器
   */
  removeListener(callback: (achievement: Achievement) => void) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(achievement: Achievement) {
    this.listeners.forEach(callback => callback(achievement));
  }

  /**
   * 序列化成就数据
   */
  serialize(): Achievement[] {
    return this.getAllAchievements();
  }
}

// 单例导出
let achievementManagerInstance: AchievementManager | null = null;

export function getAchievementManager(initialAchievements?: Achievement[]): AchievementManager {
  if (!achievementManagerInstance) {
    achievementManagerInstance = new AchievementManager(initialAchievements);
  }
  return achievementManagerInstance;
}

export function resetAchievementManager() {
  achievementManagerInstance = null;
}
