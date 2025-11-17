/**
 * 动态难度管理器
 * 根据玩家表现自动调整游戏难度
 */

import { Challenge, DifficultyAdjustment, DifficultyLevel } from '@/types/game';

export class DifficultyManager {
  private successStreak: number = 0;
  private failStreak: number = 0;
  private recentTimes: number[] = [];
  private readonly MAX_HISTORY = 10;

  /**
   * 记录成功
   */
  recordSuccess(timeUsed: number, timeLimit: number): void {
    this.successStreak++;
    this.failStreak = 0;
    this.recentTimes.push(timeUsed / timeLimit); // 归一化时间比例

    // 保持历史记录在合理范围
    if (this.recentTimes.length > this.MAX_HISTORY) {
      this.recentTimes.shift();
    }
  }

  /**
   * 记录失败
   */
  recordFailure(): void {
    this.failStreak++;
    this.successStreak = 0;
    this.recentTimes.push(1.5); // 失败视为超时1.5倍

    if (this.recentTimes.length > this.MAX_HISTORY) {
      this.recentTimes.shift();
    }
  }

  /**
   * 计算当前难度等级
   */
  calculateDifficulty(baseDifficulty: DifficultyLevel = 1): number {
    // 基础难度
    let difficulty = baseDifficulty;

    // 连续成功增加难度（更温和）
    difficulty += this.successStreak * 0.05;

    // 连续失败降低难度（更明显，帮助玩家）
    difficulty -= this.failStreak * 0.25;

    // 根据平均完成时间微调
    const avgTimeRatio = this.getAverageTimeRatio();
    if (avgTimeRatio < 0.25) {
      // 完成太快，增加难度
      difficulty += 0.2;
    } else if (avgTimeRatio > 0.85) {
      // 完成太慢，降低难度
      difficulty -= 0.3;
    }

    // 限制在1-5范围内
    return Math.max(1, Math.min(5, difficulty));
  }

  /**
   * 获取平均时间比例
   */
  private getAverageTimeRatio(): number {
    if (this.recentTimes.length === 0) return 0.5;

    const sum = this.recentTimes.reduce((a, b) => a + b, 0);
    return sum / this.recentTimes.length;
  }

  /**
   * 调整关卡参数
   */
  adjustChallenge(challenge: Challenge): DifficultyAdjustment {
    const calculatedDifficulty = this.calculateDifficulty(challenge.difficulty);
    const difficultyMultiplier = calculatedDifficulty / challenge.difficulty;

    // 调整时间限制（难度越高，时间越少）
    const adjustedTimeLimit = this.adjustTimeLimit(
      challenge.baseTimeLimit,
      difficultyMultiplier
    );

    // 调整目标数量（难度越高，目标越多）
    const adjustedTargets = this.adjustTargets(
      challenge.config.targets || 1,
      difficultyMultiplier
    );

    // 调整干扰项数量（难度越高，干扰越多）
    const adjustedDistractors = this.adjustDistractors(
      challenge.config.distractors || 7,
      difficultyMultiplier
    );

    return {
      successStreak: this.successStreak,
      failStreak: this.failStreak,
      averageTime: this.getAverageTimeRatio(),
      calculatedDifficulty,
      adjustedTimeLimit,
      adjustedTargets,
      adjustedDistractors,
    };
  }

  /**
   * 调整时间限制
   */
  private adjustTimeLimit(baseTime: number, multiplier: number): number {
    // 难度倍率越高，时间越少（但保留至少60%的时间，更友好）
    const minTime = baseTime * 0.6;
    const maxTime = baseTime * 1.4;
    const adjusted = baseTime * (2 - multiplier * 0.25);

    return Math.max(minTime, Math.min(maxTime, adjusted));
  }

  /**
   * 调整目标数量
   */
  private adjustTargets(baseTargets: number, multiplier: number): number {
    if (baseTargets <= 1) return baseTargets; // 单目标不调整

    const adjusted = Math.round(baseTargets * multiplier);
    return Math.max(1, Math.min(baseTargets * 2, adjusted));
  }

  /**
   * 调整干扰项数量
   */
  private adjustDistractors(baseDistractors: number, multiplier: number): number {
    if (baseDistractors === 0) return 0;

    const adjusted = Math.round(baseDistractors * multiplier);
    return Math.max(0, Math.min(baseDistractors * 2, adjusted));
  }

  /**
   * 重置统计数据
   */
  reset(): void {
    this.successStreak = 0;
    this.failStreak = 0;
    this.recentTimes = [];
  }

  /**
   * 获取当前状态
   */
  getStatus() {
    return {
      successStreak: this.successStreak,
      failStreak: this.failStreak,
      averageTimeRatio: this.getAverageTimeRatio(),
      recentPerformance: this.getPerformanceLevel(),
    };
  }

  /**
   * 获取表现等级
   */
  private getPerformanceLevel(): string {
    const avgRatio = this.getAverageTimeRatio();

    if (avgRatio < 0.3) return 'EXCELLENT';
    if (avgRatio < 0.5) return 'GOOD';
    if (avgRatio < 0.7) return 'NORMAL';
    if (avgRatio < 0.9) return 'STRUGGLING';
    return 'DIFFICULT';
  }
}

/**
 * 根据游戏模式调整时间限制
 */
export function adjustTimeForMode(
  baseTime: number,
  mode: 'casual' | 'normal' | 'challenge' | 'hell'
): number {
  switch (mode) {
    case 'casual':
      return baseTime * 1.5; // +50% 时间
    case 'normal':
      return baseTime;
    case 'challenge':
      return baseTime * 0.7; // -30% 时间
    case 'hell':
      return baseTime * 0.5; // -50% 时间
    default:
      return baseTime;
  }
}

/**
 * 计算难度显示星级
 */
export function getDifficultyStars(difficulty: number): string {
  const stars = Math.round(difficulty);
  return '⭐'.repeat(Math.min(5, Math.max(1, stars)));
}

/**
 * 计算推荐关卡
 * 基于玩家当前水平推荐合适的关卡
 */
export function getRecommendedDifficulty(
  completedChallenges: number,
  averageStars: number
): DifficultyLevel {
  // 初始阶段
  if (completedChallenges < 10) return 1;

  // 根据平均星级推荐
  if (averageStars >= 2.5) {
    // 表现优秀，增加难度
    return Math.min(5, Math.ceil(completedChallenges / 20) + 1) as DifficultyLevel;
  } else if (averageStars < 1.5) {
    // 表现不佳，降低难度
    return Math.max(1, Math.floor(completedChallenges / 30)) as DifficultyLevel;
  } else {
    // 表现正常
    return Math.min(5, Math.floor(completedChallenges / 15) + 1) as DifficultyLevel;
  }
}
