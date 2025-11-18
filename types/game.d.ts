/**
 * 脑力闪电战 - 游戏类型定义
 */

// ============ 基础类型 ============

export type ChallengeCategory =
  | 'reaction' | 'memory' | 'math' | 'judgment' | 'spatial' | '综合'
  | 'physics' | 'logic' | 'coordination' | 'ultimate'
  | 'time' | 'dimension' | 'perception' | 'transcendent';

export type Dimension = '2D' | '3D';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type GameMode = 'normal' | 'casual' | 'challenge' | 'hell' | 'endless';

export type StarRating = 0 | 1 | 2 | 3;

// ============ 关卡配置 ============

export interface ChallengeConfig {
  // 目标元素配置
  targets?: number;              // 目标数量
  distractors?: number;          // 干扰项数量

  // 视觉元素
  colors?: string[];            // 可用颜色
  shapes?: ShapeType[];         // 可用形状
  numbers?: number[];           // 数字范围

  // 难度参数
  similarity?: number;          // 相似度 0-1
  rotationSpeed?: number;       // 旋转速度（3D）
  complexity?: number;          // 复杂度

  // 变体关卡参数
  variant?: string;             // 变体类型标识
  hybrid?: boolean;             // 是否混合关卡
  innovative?: boolean;         // 是否创新关卡
  level?: number;               // 关卡等级
  items?: number;               // 记忆项数量
  speed?: string;               // 速度等级

  // 通用扩展属性
  [key: string]: any;           // 允许任意额外配置
}

export type ShapeType = 'circle' | 'square' | 'triangle' | 'pentagon' | 'hexagon' | 'star';

// ============ 关卡定义 ============

export interface Challenge {
  // 基本信息
  id: string;
  name: string;
  description: string;
  type: ChallengeCategory;
  dimension: Dimension;

  // 难度与时间
  difficulty: DifficultyLevel;
  baseTimeLimit: number;        // 基础时间限制（秒）

  // 配置
  config: ChallengeConfig;

  // 元数据
  unlockRequirement?: number;   // 解锁要求（通关数）
  tags?: string[];              // 标签
}

// ============ 游戏结果 ============

export interface ChallengeResult {
  challengeId: string;
  success: boolean;
  stars: StarRating;
  timeUsed: number;             // 实际用时（秒）
  score: number;                // 本关得分
  mistakes: number;             // 错误次数
  timestamp: number;
}

export interface GameSession {
  sessionId: string;
  mode: GameMode;
  startTime: number;
  endTime?: number;

  // 统计
  totalScore: number;
  challengesCompleted: number;
  perfectCount: number;         // 三星次数
  currentCombo: number;         // 当前连击
  maxCombo: number;             // 最高连击

  // 历史
  results: ChallengeResult[];
}

// ============ 玩家数据 ============

export interface PlayerStats {
  // 总体统计
  totalGamesPlayed: number;
  totalChallengesCompleted: number;
  totalScore: number;
  highestScore: number;

  // 分类统计
  reactionCount: number;
  memoryCount: number;
  mathCount: number;
  judgmentCount: number;
  spatialCount: number;
  physicsCount: number;
  logicCount: number;
  coordinationCount: number;
  ultimateCount: number;
  timeCount: number;
  dimensionCount: number;
  perceptionCount: number;
  transcendentCount: number;

  // 成就
  achievements: Achievement[];
  unlockedChallenges: string[];

  // 设置
  settings: GameSettings;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  progress?: number;            // 当前进度
  target?: number;              // 目标值
}

export interface GameSettings {
  volume: number;               // 0-1
  sfxEnabled: boolean;
  musicEnabled: boolean;
  difficulty: GameMode;
  vibrationEnabled: boolean;
  colorBlindMode: boolean;
}

// ============ 排行榜 ============

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  score: number;
  challengesCompleted: number;
  averageTime: number;
  timestamp: number;
}

export interface Leaderboard {
  type: 'daily' | 'weekly' | 'allTime' | 'friends';
  entries: LeaderboardEntry[];
  userRank?: number;
}

// ============ 游戏状态 ============

export interface GameState {
  // 当前状态
  currentChallenge: Challenge | null;
  currentSession: GameSession | null;

  // 游戏进度
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;

  // 实时数据
  timeRemaining: number;
  lives: number;
  combo: number;

  // 玩家数据
  playerStats: PlayerStats;
}

// ============ 动画与特效 ============

export interface ParticleEffect {
  type: 'success' | 'fail' | 'perfect' | 'combo';
  position: { x: number; y: number };
  color?: string;
  duration?: number;
}

export interface SoundEffect {
  type: 'click' | 'success' | 'fail' | 'perfect' | 'tick' | 'combo' | 'levelUp';
  volume?: number;
  pitch?: number;
}

// ============ 难度管理 ============

export interface DifficultyAdjustment {
  successStreak: number;
  failStreak: number;
  averageTime: number;
  calculatedDifficulty: number;

  // 调整后的参数
  adjustedTimeLimit: number;
  adjustedTargets: number;
  adjustedDistractors: number;
}

// ============ 3D相关 ============

export interface Transform3D {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface CameraConfig {
  position: [number, number, number];
  fov: number;
  near: number;
  far: number;
}

// ============ 组件Props ============

export interface ChallengeComponentProps {
  challenge: Challenge;
  timeRemaining: number;
  onComplete: (result: ChallengeResult) => void;
  onFail: () => void;
}

export interface GameUIProps {
  score: number;
  combo: number;
  timeRemaining: number;
  lives: number;
  currentChallenge: Challenge;
}

// ============ API响应（如果需要后端）============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface SaveGameRequest {
  playerId: string;
  session: GameSession;
  stats: PlayerStats;
}

export interface LeaderboardRequest {
  type: 'daily' | 'weekly' | 'allTime';
  limit?: number;
  offset?: number;
}
