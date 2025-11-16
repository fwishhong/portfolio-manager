/**
 * 分数计算系统
 */

import { StarRating, ChallengeResult, Challenge } from '@/types/game';

/**
 * 计算关卡星级
 */
export function calculateStars(
  timeUsed: number,
  timeLimit: number,
  mistakes: number
): StarRating {
  // 失败条件
  if (timeUsed > timeLimit || mistakes >= 3) {
    return 0;
  }

  // 时间比例
  const timeRatio = timeUsed / timeLimit;

  // 完美：2秒内或无失误且速度快
  if (timeUsed <= 2 || (mistakes === 0 && timeRatio < 0.3)) {
    return 3;
  }

  // 优秀：5秒内或1次失误且速度较快
  if (timeUsed <= 5 || (mistakes <= 1 && timeRatio < 0.6)) {
    return 2;
  }

  // 通过：在时间限制内
  if (timeUsed <= timeLimit && mistakes < 3) {
    return 1;
  }

  return 0;
}

/**
 * 计算速度倍率
 */
export function calculateSpeedMultiplier(timeUsed: number): number {
  if (timeUsed <= 3) return 3.0;
  if (timeUsed <= 5) return 2.0;
  if (timeUsed <= 8) return 1.5;
  if (timeUsed <= 10) return 1.0;
  return 0.5;
}

/**
 * 计算连击倍率
 */
export function calculateComboMultiplier(combo: number): number {
  if (combo >= 20) return 3.0;
  if (combo >= 10) return 2.0;
  if (combo >= 5) return 1.5;
  return 1.0;
}

/**
 * 计算难度倍率
 */
export function calculateDifficultyMultiplier(difficulty: number): number {
  return 1 + (difficulty - 1) * 0.25; // 难度1: 1.0x, 难度5: 2.0x
}

/**
 * 计算单关分数
 */
export function calculateScore(
  timeUsed: number,
  timeLimit: number,
  difficulty: number,
  combo: number,
  stars: StarRating
): number {
  // 失败得0分
  if (stars === 0) return 0;

  const baseScore = 100;
  const speedMultiplier = calculateSpeedMultiplier(timeUsed);
  const comboMultiplier = calculateComboMultiplier(combo);
  const difficultyMultiplier = calculateDifficultyMultiplier(difficulty);

  // 星级加成
  const starBonus = stars === 3 ? 1.5 : stars === 2 ? 1.2 : 1.0;

  const totalScore =
    baseScore *
    speedMultiplier *
    comboMultiplier *
    difficultyMultiplier *
    starBonus;

  return Math.round(totalScore);
}

/**
 * 计算完整的关卡结果
 */
export function createChallengeResult(
  challenge: Challenge,
  timeUsed: number,
  mistakes: number,
  combo: number
): ChallengeResult {
  const stars = calculateStars(timeUsed, challenge.baseTimeLimit, mistakes);
  const score = calculateScore(
    timeUsed,
    challenge.baseTimeLimit,
    challenge.difficulty,
    combo,
    stars
  );

  return {
    challengeId: challenge.id,
    success: stars > 0,
    stars,
    timeUsed,
    score,
    mistakes,
    timestamp: Date.now(),
  };
}

/**
 * 计算奖励分数（完美连击等）
 */
export function calculateBonusScore(
  combo: number,
  perfectStreak: number
): number {
  let bonus = 0;

  // 连击奖励
  if (combo >= 50) bonus += 5000;
  else if (combo >= 30) bonus += 3000;
  else if (combo >= 20) bonus += 2000;
  else if (combo >= 10) bonus += 1000;
  else if (combo >= 5) bonus += 500;

  // 完美连击奖励
  if (perfectStreak >= 20) bonus += 3000;
  else if (perfectStreak >= 10) bonus += 1500;
  else if (perfectStreak >= 5) bonus += 500;

  return bonus;
}

/**
 * 计算平均星级
 */
export function calculateAverageStars(results: ChallengeResult[]): number {
  if (results.length === 0) return 0;

  const totalStars = results.reduce((sum, r) => sum + r.stars, 0);
  return totalStars / results.length;
}

/**
 * 计算平均时间
 */
export function calculateAverageTime(results: ChallengeResult[]): number {
  if (results.length === 0) return 0;

  const totalTime = results.reduce((sum, r) => sum + r.timeUsed, 0);
  return totalTime / results.length;
}

/**
 * 计算准确率
 */
export function calculateAccuracy(results: ChallengeResult[]): number {
  if (results.length === 0) return 0;

  const successCount = results.filter(r => r.success).length;
  return (successCount / results.length) * 100;
}

/**
 * 生成表现报告
 */
export interface PerformanceReport {
  totalScore: number;
  challengesCompleted: number;
  averageStars: number;
  averageTime: number;
  accuracy: number;
  perfectCount: number;
  maxCombo: number;
  rank: string;
}

export function generatePerformanceReport(
  results: ChallengeResult[],
  maxCombo: number
): PerformanceReport {
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const perfectCount = results.filter(r => r.stars === 3).length;

  const report: PerformanceReport = {
    totalScore,
    challengesCompleted: results.length,
    averageStars: calculateAverageStars(results),
    averageTime: calculateAverageTime(results),
    accuracy: calculateAccuracy(results),
    perfectCount,
    maxCombo,
    rank: getRank(totalScore, results.length),
  };

  return report;
}

/**
 * 根据总分和关卡数计算等级
 */
function getRank(totalScore: number, challengesCompleted: number): string {
  if (challengesCompleted < 10) return '新手 (Novice)';

  const avgScore = totalScore / challengesCompleted;

  if (avgScore >= 1000) return '传说 (Legend)';
  if (avgScore >= 800) return '大师 (Master)';
  if (avgScore >= 600) return '专家 (Expert)';
  if (avgScore >= 400) return '高级 (Advanced)';
  if (avgScore >= 200) return '中级 (Intermediate)';
  return '初级 (Beginner)';
}

/**
 * 计算下一等级所需分数
 */
export function getNextRankRequirement(currentRank: string): number {
  const ranks = {
    '新手 (Novice)': 0,
    '初级 (Beginner)': 200,
    '中级 (Intermediate)': 400,
    '高级 (Advanced)': 600,
    '专家 (Expert)': 800,
    '大师 (Master)': 1000,
    '传说 (Legend)': Infinity,
  };

  const currentValue = ranks[currentRank as keyof typeof ranks] || 0;
  const nextRank = Object.entries(ranks).find(([_, value]) => value > currentValue);

  return nextRank ? nextRank[1] : Infinity;
}
